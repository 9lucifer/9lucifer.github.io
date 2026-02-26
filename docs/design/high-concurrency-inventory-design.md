# 如何解决超卖和少卖

## 什么是超卖和少卖

在电商的团购、秒杀等高并发场景下，用户会在极短时间内集中抢购库存极少的商品（有的支持多件购买，有的限制每人一件），核心难点是**如何避免库存超卖**。如果系统采用“先查询库存，再扣减库存”的方式，在大量并发请求下会产生资源竞争和并发冲突，导致多个人同时看到有库存并成功下单，最终出现库存被扣成负数或实际销售数量超过上限的异常。因此，秒杀系统设计的关键在于通过原子扣减、加锁、队列削峰或数据库乐观锁等手段，保证库存扣减的**原子性和一致性**，确保成功下单人数不超过商品库存上限。

问题：当商品A一共有库存15件，用户甲先下单10件，用户乙下单8件，这时候库存只能满足一个人下单成功，如果两个人同时提交，就出现了超卖的问题。

## 高并发秒杀流程

### 第一阶段：预扣库存

用户选中秒杀商品并点击“抢购”后，后端首先接收下单请求，通过 **Redis Lua 脚本**对库存进行预扣减。在 Lua 脚本中同时完成库存校验与扣减操作，保证整个过程的**原子性**，避免“先查库存再扣库存”导致的并发超卖问题。库存一旦成功扣减，后续用户读取到的库存数量会立即减少，从而实现高并发场景下的强一致控制。

同时，为防止用户在极短时间内重复点击触发多次请求，系统在扣减库存前引入 **Redis 分布式锁（或基于唯一请求标识的幂等控制）**，保障操作幂等性，避免同一用户重复抢购成功。

库存预扣成功后，下单请求被异步投递至消息队列，进入第二阶段处理，由下游服务完成订单创建、数据库落库等操作，从而实现削峰填谷与业务解耦，提升整体系统吞吐能力与稳定性。

### 第二阶段：库存扣减

在下单阶段，系统通过 **Redis 分布式锁（或基于唯一业务请求号的幂等校验机制）**，保障订单操作的幂等性，防止同一请求在网络重试或重复点击等情况下被多次处理，从而避免重复下单问题。

在订单创建与库存扣减之间，引入**本地消息表模式**实现分布式事务控制：订单服务在本地事务中同时完成订单落库与消息记录写入，本地事务提交后，再由异步任务将消息投递至消息队列，驱动库存服务进行最终扣减或状态确认。通过“本地事务 + 可靠消息投递”的方式，保障订单与库存数据之间的**最终一致性**，避免分布式事务带来的性能开销与复杂度。

当订单创建成功后，系统将订单状态更新为**“待支付”**，进入支付流程，同时设置支付超时时间，若用户未在规定时间内完成支付，则触发订单关闭与库存回补机制，确保库存数据的准确性与系统资源的有效利用。

### 第三阶段：支付回调

之后触发支付流程，支持完成后会回调订单服务，修改订单状态

### 第四阶段：库存补偿

使用延迟消息/定时任务，对超时未支付订单进行关闭，并且对库存进行补偿。

> 以上流程整理自https://www.cnblogs.com/crazymakercircle/p/18665436#autoid-h2-5-0-1，尼恩老师的资料不错就是广告较多。

## 一种新的思路

基于分布式缓存的强一致热点库存合并扣减方案

>  Redis = 计数屏障，作用是实时高并发减速
>  DB 明细 = 真实账本
>  DB 主表 = 最终余额

> 参考https://mp.weixin.qq.com/s/_ezTVydFszZnc0ZN-JEtlQ

传统优化路径包括：

- 数据库内核优化
- 行级锁优化
- 乐观锁版本控制
- 分布式缓存分桶扣减

虽然数据库性能已被大幅提升，但在**单行热点扣减场景**下，数据库仍然存在：

- 行锁竞争严重
- 高并发下 TPS 受限
- 需要入口限流保护



### 传统 Redis 分桶扣减的局限性

常见做法是：

- 将 MySQL 库存拆分为多个 Redis 分桶
- 使用 `INCR/DECR` 扣减
- 剩余库存 >= 0 作为校验条件

优点：

- 性能极高
- 降低 DB 行锁压力

#### 存在三个严重问题

1. 无法避免“少卖”

Redis 扣减超时或异常时，应用层无法判断是否成功。为了避免超卖，通常只能默认扣减超时为失败，这会造成库存损失（少卖）。

因此该方案通常只适用于权益类库存、限购类库存等可接受少卖的业务场景。

2. 无法支持复杂库存模型

简单 Redis 扣减只支持一个数值字段：value = 剩余库存

但真实库存模型通常包含：

- sq（可售库存）
- wq（预扣库存）
- oq（占用库存）

3. 完全依赖 Redis 稳定性

一旦 Redis 故障，整条扣减链路不可用，无法降级到 DB，对于实物库存来说，这是不可接受的。

### 核心设计

Redis 只负责防止超卖的“计数控制”，实际扣减成功与否以库存明细（DB）为准。

#### 数据库设计

库存主表 inventory

```SQL
CREATE TABLE inventory (
    id BIGINT PRIMARY KEY,
    sku_id BIGINT NOT NULL,
    
    sq INT NOT NULL COMMENT '可售库存',
    lq INT NOT NULL DEFAULT 0 COMMENT '预锁库存',
    wq INT NOT NULL DEFAULT 0 COMMENT '预扣库存',
    oq INT NOT NULL DEFAULT 0 COMMENT '占用库存',
    
    version INT NOT NULL DEFAULT 0,
    update_time DATETIME
);
```

字段含义

| 字段 | 含义                    |
| ---- | ----------------------- |
| sq   | 当前可售库存            |
| lq   | 已锁库存（给Redis预留） |
| wq   | 已下单未支付库存        |
| oq   | 已支付库存              |



库存扣减明细表 inventory_detail

```SQL
CREATE TABLE inventory_detail (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    inv_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    bucket_id INT NOT NULL,
    
    quantity INT NOT NULL,
    status TINYINT NOT NULL COMMENT '0=预扣 1=已合并 2=已回补',
    
    create_time DATETIME,
    
    INDEX idx_inv_bucket (inv_id, bucket_id),
    INDEX idx_order (order_id),
    INDEX idx_cover (inv_id, bucket_id, quantity)
);
```

扣减是否成功，不看 Redis，看这张表是否插入成功。



#### Redis Key 设计

我们现在只把 Redis 当成高并发计数器。

**Key 结构**：

- 分桶 key 设计

```
inv:1001:bucket:0
inv:1001:bucket:1
...
inv:1001:bucket:7
```

- 分桶索引 key

```
inv:1001:buckets
```

- 扣减屏障 key

```
inv:1001:bucket:3:closed
```

用于防止扫描过程中继续扣减

### 完整扣减流程（一次真实请求）

#### 阶段一：锁库存

```SQL
UPDATE inventory
SET lq = lq + 2000
WHERE sq - lq >= 2000
```

sq 不减，初始化 Redis。

```
inv:1001:bucket:0 = 250
inv:1001:bucket:1 = 250
...
```

#### 阶段二：用户下单

##### Step 1：选择桶

假设 hash(orderId) % 8 = 3，选中：

```
inv:1001:bucket:3
```

##### Step 2：Redis 扣减

```lua
if redis.call("GET", key) > 0 then
  return redis.call("DECR", key)
else
  return -1
end
```

成功进入下一步,失败走普通 DB 扣减。

##### Step 3：插入扣减明细

```sql
INSERT INTO inventory_detail
(inv_id, order_id, bucket_id, quantity, status)
VALUES (1001, 88888, 3, 1, 0);
```

到这里才算扣减成功，Redis 只是计数器。



#### 合并提交阶段

假设bucket 3 被打爆，触发合并提交。

##### Step 1：关闭桶

```lua
SET inv:1001:bucket:3:closed = 1 // 防止继续扣减。
```

##### Step 2：扫描明细

```sql
SELECT SUM(quantity)
FROM inventory_detail
WHERE inv_id = 1001
AND bucket_id = 3
AND status = 0;
```

##### Step 3：真正扣 DB

如果库存还有，扣减。

```sql
UPDATE inventory
SET 
  sq = sq - 180,
  lq = lq - 180,
  wq = wq + 180
WHERE id = 1001
AND sq - lq >= 180;
```

##### Step 4：更新明细状态

```sql
UPDATE inventory_detail
SET status = 1
WHERE inv_id = 1001
AND bucket_id = 3
AND status = 0;
```

### 超卖和少卖问题

#### 为什么不会超卖？

因为DB 层永远有硬约束，Redis 再乱也不会突破 DB。

```
WHERE sq - lq - δ > 0
```

#### 为什么不会少卖？

即便Redis 宕机，Redis 丢数据，只要inventory_detail 还在，我们扫描明细就知道真实扣减量。

### 为什么有提升

假设一个真实热点场景：

- 商品库存：10000
- 突发流量：**1 万 QPS**
- 都在扣同一行库存（单行热点）
- MySQL InnoDB（行锁）

每个请求都执行：

```
UPDATE inventory
SET sq = sq - 1
WHERE id = 1001
AND sq > 0;
```

InnoDB 行锁是**排他锁**，同一时间，只能有 1 个线程持有该行锁，其他 9999 个线程在等待。

合并扣减模型流程变成下单时：

```
INSERT INTO inventory_detail ...
```
插入明细没有热点行锁问题，因为是不同主键，自增ID，插入性能极高，1 秒后批量提交。

```
UPDATE inventory
SET sq = sq - 8000
WHERE id = 1001;
```

总结下来就是：把 N 次排他锁竞争压缩成 1 次，从根本上消除了热点行锁瓶颈。
