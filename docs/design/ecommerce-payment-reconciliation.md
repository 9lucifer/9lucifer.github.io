# 电商支付系统对账

>  设计：基于 XXL-JOB 分片广播实现海量对账数据的分布式并行处理，结合 EasyExcel 流式解析提升大文件吞吐并规避 OOM，同时通过策略模式统一多渠道账单适配，并利用 Redis Set 构建跨日订单缓冲池实现长款自动挂账与次日回捞比对。

## 一、背景

在电商或支付系统中，每天都会产生大量订单。

系统里面会有几种数据源：

- 业务系统的订单
- 支付渠道的账单（比如每天晚上支付宝那边会给商家一个用于对账的xlxs表格）
- 支付流水

### 对账的含义

为了确保`系统订单金额=支付渠道账单金额`，避免出现短款，长款问题。

| 类型           | 含义                |
| -------------- | ------------------- |
| **平账**       | 系统金额 = 渠道金额 |
| **长款**       | 渠道 > 系统         |
| **短款**       | 系统 > 渠道         |
| **金额不一致** | 都存在但金额不同    |

## 二、技术点以及解决的问题

1. **XXL-JOB 分片广播 → 分布式并行对账**

2. **EasyExcel 流式解析 → 解决大文件 OOM**

3. **策略模式 → 多渠道账单统一处理**

4. **Redis Set → 跨日订单缓冲池（长款自动挂账 + 次日回捞）**

## 三、详细设计

### （一）XXL-JOB 分片广播

主要是为了分布式并行处理。如果文件很大，比如100万条记录，如果单线程执行会很慢。

所以使用XXL-JOB 分片广播模式，任务会被 **多个执行器并行执行**。

假设5台机器，任务会被分成5个分片，每个节点只处理自己负责的那一部分数据。

示例：总数据 100万，可以分为：

```
机器1 处理 0-20万
机器2 处理 20-40万
机器3 处理 40-60万
机器4 处理 60-80万
机器5 处理 80-100万
```

XXL-JOB 提供：`ShardingUtil.getShardingVo()`，可以获取当前分片编号和总分片数。

示例代码：

```
ShardingVO shardingVO = ShardingUtil.getShardingVo();

int index = shardingVO.getIndex();
int total = shardingVO.getTotal();

if (rowNum % total == index) {
    processRow();
}
```

效果：处理速度 = 原来 / 节点数

### （二）EasyExcel 流式解析

主要是为了避免 OOM问题。

如果使用`Apache POI`解析 Excel,POI 会把整个文件加载到内存

如果1GB Excel，很容易出现Java OOM。
解决方案：使用EasyExcel。

#### 核心特点

- SAX 解析
- 流式读取
- 一行一行处理

示例：
```
EasyExcel.read(file, BillData.class, new AnalysisEventListener<BillData>() {

    @Override
    public void invoke(BillData data, AnalysisContext context) {
        reconcile(data);
    }

}).sheet().doRead();
```
#### 效果

读取一行，处理一行，释放一行。内存占用几MB，吞吐提升，解析速度更快。

### （三）策略模式

这个是为了多渠道账单统一处理。

不同支付渠道如支付宝、微信、银联，账单格式 完全不同。

如果写成下面这样，代码会变得非常难维护。

```java
if(channel == ALIPAY)
if(channel == WECHAT)
if(channel == UNIONPAY)
```

#### 使用策略模式定义接口

```
public interface BillParser {
    ReconcileData parse(Object row);
}
```
#### 不同渠道实现

##### 支付宝

```java
@Component
public class AlipayBillParser implements BillParser {
    public ReconcileData parse(Object row){
        ...
    }
}
```
##### 微信

```java
@Component
public class WechatBillParser implements BillParser {
}
```
#### 工厂

```java
Map<String, BillParser> parserMap;
```
#### 调用

```java
BillParser parser = parserMap.get(channel);
ReconcileData data = parser.parse(row);
```
好处：

- 新增渠道不用改原代码

- 符合开闭原则

  

### （四）Redis Set 跨日订单缓冲池

#### 跨日订单问题

在支付对账系统中，经常会出现 **跨日支付** 的情况。例如：

- **订单创建时间：23:59**
- **支付成功时间：00:01**

当系统在 **当天进行对账** 时，可能会出现以下情况：

- **渠道账单：存在该订单**
- **系统订单：不存在该订单**

此时对账系统会判断为：

> **长款（渠道有订单，系统没有订单）**

但实际上，这并不是真正的异常，而是因为 **支付发生在第二天**，属于正常的 **跨日支付**。如果系统在当天对账时直接把这种情况当作异常处理，就会产生 **大量误报**，增加人工排查成本。

#### Redis 跨日订单缓冲池

为了解决跨日支付带来的误报问题，可以设计一个 **跨日订单缓冲机制**。

当系统发现渠道账单存在且系统订单不存在时，**先不立即判定为异常订单**，而是先将该订单放入一个 **Redis 跨日订单缓冲池** 中。

缓冲池使用 **Redis Set** 来存储订单号，例如：

```text
key: reconcile:pending:20240301
value: orderNo
```

选择 **Redis Set** 的原因是天然去重，避免重复记录同一订单，以及查询效率高。

通过这种方式，可以先暂存这些可能是跨日支付的订单，而不是直接记录为异常。

#### 次日回捞

在 **第二天进行对账时**，系统会先扫描 **Redis 跨日订单缓冲池**，对这些订单进行 **二次校验**。

整体流程如下：

```
Redis Set
   │
   ▼
取出订单号
   │
   ▼
再次查询系统订单
```

处理逻辑如下：

**1. 如果查询到系统订单**

说明该订单只是 **跨日支付**，系统订单在第二天才生成或更新。

此时可以自动对平订单，从 Redis 缓冲池中删除该记录。

**2. 如果仍然查询不到系统订单**

说明该订单可能是真正的异常，例如：

- 回调失败
- 系统订单丢失
- 数据同步问题

此时才会正式记录为长款订单，并进入后续的 **异常订单处理流程**。
