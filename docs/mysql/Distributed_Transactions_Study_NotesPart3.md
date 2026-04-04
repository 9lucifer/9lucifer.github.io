# Seata AT 模式介绍

>   from《正本清源分布式事务之 Seata》-第三章

## 目录
- [基本原理](#基本原理)
- [工作流程](#工作流程)
- [事务日志表](#事务日志表)
- [`seata` 数据源代理](#seata-数据源代理)
- [AT 模式的两阶段提交](#at-模式的两阶段提交)

## 关联文章
- [上一篇：Seata简介（Part2）](./Distributed_Transactions_Study_NotesPart2.md)
- [下一篇：TCC模式介绍（Part4）](./Distributed_Transactions_Study_NotesPart4.md)


### 基本原理
AT 模式是一种**无侵入式**的分布式事务技术。
在 AT 模式中，通过 `seata` 的数据源代理对数据库进行操作。业务通过 jdbc 接口访问数据库资源时，数据源代理会拦截请求进行一些增强。
在 `seata` 中，每个参与 AT 的数据库都被看作是一个资源；在本地事务提交之前，RM 都会向 TC 注册一个分支事务（插入事务日志），本地事务提交之后，RM 向 TC 汇报分支状态。TC 会找出所有该事务的分支事务，向每个分支的 RC 发起二阶段提交或者二阶段回滚。
> AT 模式一阶段，二阶段都是 `seata ` 框架自动生成的，用户只需要写 sql

### 工作流程
举例：有两个服务，余额服务和积分服务；业务流程：用户充值时，调用余额服务加余额，并调用积分服务加积分。
在 `seata` 的 AT，就可以把余额服务和积分服务声明为两个全局事务。
**具体流程**
1. 余额服务的 TM 向 TC 申请开启一个全局事务，TC 返回一个全局事务 id。
2. 余额服务开启本地事务，生成 `undo log`，执行业务 sql，生成 `redo log`，并且保存两个日志，生成全局锁。
3. 余额服务提交之前，RM 会向 TC 注册事务分支。
4. 余额服务提交本地事务。
5. 余额服务的 RM 向 TC 上报事务状态。
6. 余额服务发起 RPC，把事务 id 传递给积分服务。
7. 积分服务开启本地事务，生成 `undo log`，执行业务 sql，生成 `redo log`，并且保存两个日志，生成全局锁。
8. 积分服务提交之前，RM 会向 TC 注册事务分支。
9. 积分服务提交本地事务。
10. 积分服务的 RM 向 TC 上报事务状态。
11. 积分服务返回远程调用结果给余额服务。
12. 余额服务的 TM 向 TC 申请全局事务的提交/回滚。

### 事务日志表
作用：用于二阶段的回滚
在数据源代理拦截业务 sql 语句之后，会生成事务日志，存在 `undo_log` 表中。
`undo_log` 表结构：
```sql
CREATE TABLE `undo_log` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `branch_id` BIGINT(20) NOT NULL,
  `xid` VARCHAR(100) NOT NULL,
  `context` VARCHAR(128) NOT NULL,
  `rollback_info` LONGBLOB NOT NULL,
  `log_status` INT(11) NOT NULL,
  `log_created` DATETIME NOT NULL,
  `log_modified` DATETIME NOT NULL,
  `ext` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_undo_log` (`xid`, `branch_id`)
) ENGINE=InnoDB
  AUTO_INCREMENT=1
  DEFAULT CHARSET=utf8;
```

其中 `rollback_info` 是核心字段，记录了回滚的数据信息。其中有 `beforeimage` 和 `afterimage`，分别是前镜像和后镜像，记录了修改前后的数据。

### `seata` 数据源代理
功能：在 sql 执行前后，事务 commit 或者是 rollback 执行的前后，进行 `seata` 分布式事务相关的操作。
#### 代理类列举
1. 数据源代理类
2. 数据库连接代理
3. `statementproxy` 和 `preparedstatementproxy`

### AT 模式的两阶段提交
**一阶段**
`seata` 会拦截业务 sql 语句，解析 sql 语句的定义，提取表的元数据，找到 sql 语句要更新的业务数据；之后，在更新之前保存为前镜像，执行业务 sql 语句；执行完之后保存为后镜像，生成 `seata` 事务锁数据。这些操作**都在一个数据库本地事务完成**，保证一阶段的原子性。
流程图：

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20260404143615252.png" alt="image-20260404143615252" style="zoom:50%;" />


在分支注册时，若发现数据被其他全局事务锁定，就会抛出全局锁冲突异常，客户端就会循环等待，指导其他的全局事务释放之后再提交本地事务。

**二阶段**
如果是提交状态：
TC 会先释放锁，释放各个分支在一阶段加的全局锁，推进二阶段提交。
RM 在收到提交指令后，会删除事务日志数据，为了提高性能，RM 会立即返回 TC 成功，对日志数据进行异步删除。

如果是回滚操作：
TC 会推进二阶段回滚，RM 在收到回滚指令后，会回滚一阶段执行的 sql，用前镜像还原业务数据。
> 在还原之前会校验是否存在脏写，如果有的话，需要**转人工**。由于一阶段已经对数据行进行了加锁，正常情况不会有脏写。出现脏写都是因为有人绕过了 `seata` 进行修改。


