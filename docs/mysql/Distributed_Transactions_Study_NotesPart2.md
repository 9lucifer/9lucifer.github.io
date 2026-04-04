# Seata 简介
>   from《正本清源分布式事务之 Seata》-第二章

## 目录
- [组件定位](#组件定位)
- [逻辑结构](#逻辑结构)
- [Seata 支持的事务模式](#seata-支持的事务模式)
  - [AT](#at)
  - [TCC](#tcc)
  - [Seata 怎么实现 TCC](#seata-怎么实现-tcc)
  - [SAGA](#saga)
  - [XA](#xa)


### 组件定位
该组件刚开始是阿里内部用于解决分布式事务问题的中间件，主要模式是 AT（非侵入性） 和 TCC（侵入性），广泛用于各个业务线，主要用于解决 HSF 服务下的多数据库读写的一致性问题。

### 逻辑结构
**主要角色**：TM，RM，TC
TM 和 RM 作为 `seata` 的客户端和业务集成，TC 最为服务端独立进行部署。
<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20260403230514292.png" alt="image-20260403230514292" style="zoom:50%;" />
TM：事务管理器，与 TC 交互，开启，提交，回滚全局事务。
RM：资源管理器，与 TC 交互，负责资源相关处理，包括分支注册和分支的事务状态上报。
TC：事务协调器，维护全局事务和分支事务的状态，推进事务的两阶段处理；对 AT 模式，TM 负责事务的并发控制。

流程：
1. TM 开启全局事务
2. 事务参与者和 RM 交互，注册分支事务（RM ->TC）
3. 事务参与者完成资源操作后，上报事务状态（RM ->TC）
4. TM 结束全局事务，结束一阶段（TM->TC）
5. TC 推进事务二阶段（TC->RM）

## Seata 支持的事务模式
`Seata` 支持 AT，TCC，Saga，XA 四种事务模式。

### AT
是 `seata` 主推的分布式事务解决方案，对业务无侵入，做到事务和业务分离。
>  `seata` 里面用 AT 只需要加注解。

AT 细节可以看这篇单独展开：  
[Seata AT模式介绍（Part3）](./Distributed_Transactions_Study_NotesPart3.md)

AT 模式是 Seata 默认、也最常用的一种分布式事务模式，它的特点是对业务侵入较小，开发者通常只需要像写普通本地事务一样处理业务，再由 Seata 通过数据源代理、全局锁和 undo log 机制完成分布式事务控制。其执行过程分为两阶段：第一阶段中，业务 SQL 与回滚日志会在同一个本地事务里一起提交，在提交前还要先获取全局锁；第二阶段如果全局提交，Seata 主要做异步清理，因此提交很快；如果全局回滚，则根据第一阶段记录的 undo log 进行反向补偿，把数据恢复到修改前的状态。相比 TCC，AT 不需要开发者手写 Confirm/Cancel，接入更简单，但它更依赖关系型数据库和代理机制，适合以数据库更新为主、希望低侵入实现分布式事务的一类场景。Seata 的 Spring Boot Starter 中，数据源自动代理默认就是开启的。


### TCC
TCC 模式是一种基于业务层控制的分布式事务方案，将整个事务过程划分为 Try、Confirm、Cancel 三个阶段。Try 阶段主要用于预留资源和完成业务检查，Confirm 阶段在所有操作都成功后正式提交，Cancel 阶段则在出现异常时执行回滚或释放预留资源。相比 XA，TCC 不依赖底层数据库协议支持，灵活性更强、性能也更适合高并发场景，但对业务侵入较深，需要开发者为每个操作单独设计确认与补偿逻辑，实现成本相对较高。

TCC 细节可以看这篇单独展开：  
[TCC模式介绍（Part4）](./Distributed_Transactions_Study_NotesPart4.md)

#### Seata 怎么实现 TCC
Seata 实现 TCC 的核心思路是：**把业务服务本身当成事务资源**，而不是像 AT 模式那样主要依赖数据源代理。开发者需要先定义一个 TCC 接口，在 Try 方法上用 `@TwoPhaseBusinessAction` 标注，并指定对应的 `commitMethod` 和 `rollbackMethod`；如果是本地 Bean 参与，还要加 `@LocalTCC`。业务入口再通过 `@GlobalTransactional` 开启全局事务。运行时由 **TM** 发起全局事务、**TC** 负责两阶段协调、**RM** 负责执行各分支的 Try/Confirm/Cancel：Try 阶段做资源检查与预留，全部成功后由 TC 在二阶段统一下发 Confirm，否则下发 Cancel；各阶段共享 `BusinessActionContext`，其中会携带 `xid`、`branchId` 和业务参数，便于二阶段定位和处理对应分支。为了处理 TCC 常见的**幂等、空回滚、悬挂**问题，Seata 又通过 TCC 控制表或 `tcc_fence_log` 记录事务状态（如 tried、committed、rollbacked、suspended），在 Cancel/Confirm 重试或乱序到达时做状态判断，从而避免重复提交、空回滚和 Try 晚到造成的资源悬挂。

```txt
TM(事务发起方)-开启全局事务 XID
    v
TC(事务协调器)
    |
    +----> RM1: Try ----成功----+
    +----> RM2: Try ----成功----+----> Confirm
    |
    +---- 任一失败 ------------------> Cancel
```



### SAGA
Saga 模式是一种通过“拆分大事务、失败后执行补偿操作”来实现最终一致性的分布式事务方案。它将一个完整业务流程拆成多个本地事务，每个服务只需保证自身操作成功；一旦某一步失败，系统就按预先定义好的顺序触发对应的补偿动作，撤销前面已完成的操作。相比 XA，Saga 不依赖底层资源支持强一致协议，性能开销更小、扩展性更好，更适合微服务场景，但它保证的是最终一致性，业务设计也相对更复杂。

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20260403233208634.png" alt="image-20260403233208634" style="zoom:50%;" />


### XA
XA 模式对底层事务资源有较高要求，并不是所有系统都能直接使用。它要求数据库、消息队列等事务参与者本身能够支持 XA 规范及其相关协议，并能与事务协调器配合完成两阶段提交。也正因如此，XA 虽然一致性强，但实现复杂、性能开销较大，实际落地时通常需要结合具体技术栈谨慎评估。
