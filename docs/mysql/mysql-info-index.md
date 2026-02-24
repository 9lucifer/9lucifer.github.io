# Mysql知识体系[索引]

## 基础

mysql是什么

两张表怎么进⾏连接

内连接、左连接、右连接有什么区别

数据库的三⼤范式

varchar 与 char 的区别

blob 和 text 有什么区别

DATETIME 和 TIMESTAMP 有什么区别

in和exists的区别

- NULL值陷

记录货币⽤什么类型⽐较好

怎么存储 emoji

drop、delete 与 truncate

UNION 与 UNION ALL 的区别

count(1)、count(*) 与 count(列名) 的区别

SQL 查询语句的执⾏顺序

MySQL 的常⽤命令

MySQL bin ⽬录下的可执⾏⽂件了解吗

第 3-10 条记录怎么查

⽤过哪些 MySQL 函数

SQL 的隐式数据类型转换

SQL 的语法树解析

## 数据库架构

 MySQL 的基础架构

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/image/image-20260222180846450.png" alt="image-20260222180846450" style="zoom: 50%;" />

⼀条查询语句是如何执⾏的

⼀条更新语句是如何执⾏的

说说 MySQL 的段区⻚⾏

## 存储引擎

MySQL 有哪些常⻅存储引擎

存储引擎应该怎么选择

InnoDB 和 MyISAM 主要有什么区别

InnoDB的内存结构了解吗

 InnoDB 的 Buffer Pool了解吗

InnoDB 对 LRU 算法的优化了解吗

## 日志

mysql日志有哪些（6种）

请重点说说 binlog

binlog 的配置参数都了解哪些

有了binlog为什么还要undolog redolog

说说 redo log 的⼯作机制

说说 WAL的作用

binlog 和 redo log 有什么区别

为什么要两阶段提交

redo log 的写⼊过程了解吗

Redo Log Buffer 是顺序写还是随机写

Redo Log Block 的结构了解吗

- Redo Log Block 为什么设计成 512 字节

LSN 了解吗？

Checkpoint 了解多少？

关于redo log 的调优参数了解多少？

## SQL优化

什么是慢 SQL？

如何优化慢 SQL 呢

慢sql⽇志怎么开启

哪些⽅法可以优化 SQL

如何进⾏分⻚优化

为什么分⻚会变慢

JOIN 代替⼦查询有什么好处

JOIN操作为什么要⼩表驱动⼤表

为什么要避免使⽤ JOIN 关联太多的表

条件下推你了解多少

知道哪些 SQL 优化⽅法

explain平常有⽤过吗

## 索引

索引为什么能提⾼MySQL查询效率？

能简单说⼀下索引的分类吗？

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/image/image-20260224160919167.png" alt="image-20260224160919167" style="zoom: 50%;" />

唯⼀索引和主键索引有什么区别？

 对全⽂索引了解多少？

创建索引有哪些注意点（3点

索引哪些情况下会失效呢？

什么情况下模糊查询不⾛索引？

索引不适合哪些场景呢？

什么样的字段适合加索引？

索引是不是建的越多越好？

为什么 InnoDB 要使⽤ B+树作为索引？

为什么 MongoDB 的索引⽤ B树，⽽ MySQL ⽤ B+ 树

⼀棵B+树能存储多少条数据呢

索引为什么⽤ B+树不⽤普通⼆叉树？

为什么不⽤平衡⼆叉树呢？

为什么⽤ B+ 树⽽不⽤ B 树呢？（3点

为什么⽤ B+树不⽤跳表呢？

B+树的范围查找怎么做的？

B+树索引和 Hash 索引有什么区别？

聚族索引和⾮聚族索引有什么区别？

回表了解吗？

什么情况下会触发回表

了解 MRR 吗？

联合索引了解吗？

联合索引的叶⼦节点存的什么内容?

覆盖索引了解吗？

什么是最左前缀原则？

为什么不从最左开始查，就⽆法匹配呢？

联合索引里有 `>` 条件，怎么判断是否命中索引？

什么是索引下推？

如何查看是否⽤到了索引？

## 锁

MySQL 中有哪⼏种锁？（加锁机制，兼容性，锁的粒度，锁的模式

- 全局锁了解吗？

- 表锁了解吗？

说说 MySQL 的⾏锁？

- 说说记录锁吧？
- 间隙锁了解吗？
  - 执⾏什么命令会加上间隙锁？
- 临键锁了解吗？

select for update 有什么需要注意的？

MySQL 默认的⾏锁类型

意向锁是什么知道吗？

意向锁的意义是什么？

MySQL的乐观锁和悲观锁了解吗？

- 如何通过悲观锁和乐观锁解决库存超卖问题？