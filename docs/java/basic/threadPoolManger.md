# 手写线程池管理器

## 项目设计

### 核心功能

1. 线程池集中管理：统一创建、存储系统中的所有线程池 
2. 实时监控：通过 REST API 获取所有线程池的运行状态 
3. 动态扩缩容：运行时调整线程池参数（无需重启）      

### 项目架构设计

![image-20260219171335765](https://imgtu.oss-cn-beijing.aliyuncs.com/image/image-20260219171335765.png)

这是一个DDD 风格的项目，采用四层架构去设计，分为接口层、应用层、领域层、基础设施层。

#### 接口层

接口层的职责是处理外部的请求，以及调用应用服务。

组成：

- ThreadPoolController：线程池管理 REST API：创建、调整、查询监控
- PrimeController：素数计算测试 API



#### 应用层

应用的职责是编排领域对象完成用例，不包含业务逻辑

组成：

- ThreadPoolApplicationService：线程池应用服务：创建、调整线程池
- PrimeCalculatorService：素数计算服务：任务拆分和提交
- ThreadPoolFactory：ThreadPoolTaskExecutor 工厂
- ThreadPoolShutdownHook：应用关闭钩子



#### 领域层

核心业务逻辑，领域模型（ddd的核心）

组成：

- ThreadPool（聚合根）
  - 线程池聚合根，包含 resize()、execute()、shutdown()
- ThreadPoolId（值对象）
  - 线程池唯一标识（UUID）
- ThreadPoolConfig（值对象）
  - 线程池配置，带参数校验
- ThreadPoolMetrics（值对象）
  - 监控指标数据
- RejectedPolicyType（枚举）
  - 拒绝策略类型
- ThreadPoolCreatedEvent（领域事件）
  - 线程池创建事件
- ThreadPoolRepository（仓储接口）



### 功能设计

#### 动态调整线程池

Spring 的 ThreadPoolTaskExecutor 本身可以调整 corePoolSize 和 maxPoolSize，但不支持动态调整队列容量。所以需要我们自定义一个支持动态调整容量的 BlockingQueue，然后让 ThreadPoolTaskExecutor 使用它。

```java
public void resize(ThreadPoolConfig newConfig) {
      synchronized (this) {// 锁保护，保证原子性
          if (newConfig.getQueueCapacity() < getCurrentQueueSize()) {
              throw new
  IllegalArgumentException("新队列容量不能小于当前队列中的任务数");
          }
          if (newConfig.getMaxPoolSize() > this.config.getCorePoolSize()) {
              this.executor.setMaxPoolSize(newConfig.getMaxPoolSize());
              this.executor.setCorePoolSize(newConfig.getCorePoolSize());
          } else {
              this.executor.setCorePoolSize(newConfig.getCorePoolSize());
              this.executor.setMaxPoolSize(newConfig.getMaxPoolSize());
          }
          this.executor.setQueueCapacity(newConfig.getQueueCapacity());
          this.config = newConfig;
      }
      // 发布领域事件
      registerEvent(new ThreadPoolResizedEvent(this.id, newConfig));
  }
```



##### ResizeLinkedBlockingQueue 设计

JDK 的 LinkedBlockingQueue 容量是 final 的，创建后不能修改，所以需要自己新写一个可变的。

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/image/image-20260219173444668.png" alt="image-20260219173444668" style="zoom: 50%;" />



##### ThreadPoolFactory 如何关联

```java
ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor() {
      private boolean initialized = false;
      // 重写 createQueue，返回自定义队列
      @Override
      protected BlockingQueue<Runnable> createQueue(int queueCapacity) {
          if (queueCapacity > 0) {
              return new ResizeLinkedBlockingQueue<>(queueCapacity);
          } else {
              return new SynchronousQueue<>();
          }
      }

      // 重写 setQueueCapacity，调用我们队列的 setCapacity()
      @Override
      public void setQueueCapacity(int queueCapacity) {
          if (this.initialized && this.getThreadPoolExecutor() != null &&
                  this.getThreadPoolExecutor().getQueue() != null &&
                  this.getThreadPoolExecutor().getQueue() instanceof
  ResizeLinkedBlockingQueue) {
              ((ResizeLinkedBlockingQueue<?>)
  this.getThreadPoolExecutor().getQueue())
                  .setCapacity(queueCapacity);
          }
          super.setQueueCapacity(queueCapacity);
      }

      @Override
      public void afterPropertiesSet() {
          if (initialized) {
              return;
          }
          super.afterPropertiesSet();
          this.initialized = true;
      }
  };
```



#### 线程池监控信息获取设计

##### ThreadPoolTaskExecutor和ThreadPoolExecutor

Spring 的 ThreadPoolTaskExecutor 是对 JDK ThreadPoolExecutor 的包装：

ThreadPoolTaskExecutor (Spring)

- getCorePoolSize()
- getMaxPoolSize()
- getActiveCount()
- getQueueCapacity()
- ……
- getThreadPoolExecutor()  获取底层的 JDK ThreadPoolExecutor
  - ThreadPoolExecutor (JDK)
    - getPoolSize()
    - getCompletedTaskCount()
    - getTaskCount()
    - ……

| 指标                 | 获取来源                                                       | 说明                       |
| ------------------ | ---------------------------------------------------------- | ------------------------ |
| corePoolSize       | `executor.getCorePoolSize()`                               | 核心线程数（常驻线程，空闲也不会回收）      |
| maxPoolSize        | `executor.getMaxPoolSize()`                                | 最大线程数（线程池能扩容到的上限）        |
| activeCount        | `executor.getActiveCount()`                                | 正在执行任务的线程数               |
| poolSize           | `executor.getThreadPoolExecutor().getPoolSize()`           | 当前线程池中实际存在的线程数量（包含空闲+忙碌） |
| queueCapacity      | `executor.getQueueCapacity()`                              | 队列容量（最多可排队多少任务）          |
| queueSize          | `executor.getQueueSize()`                                  | 当前队列中等待执行的任务数            |
| completedTaskCount | `executor.getThreadPoolExecutor().getCompletedTaskCount()` | 已完成的任务总数（累计值）            |
| rejectedPolicy     | `config.getRejectedPolicy()`                               | 拒绝策略（队列满且线程到上限时的处理方式）    |
