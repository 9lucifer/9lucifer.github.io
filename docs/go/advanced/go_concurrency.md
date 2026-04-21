# go并发

## 并发基础

### 串行、并发与并行

串行：逐个执行任务。

并发：<u>同一时间段</u>执行多个任务。

并行：<u>同一时刻</u>执行多个任务。

### 进程、线程与协程

进程：程序在操作系统中的一次执行过程，是操作系统资源分配和调度的基本单位。

线程：操作系统基于进程开启的轻量级进程，是<u>操作系统执行的最小单位</u>。

协程：用户**自行**创建和维护的用户态线程，比线程轻量级。

### 并发模型

- 线程&锁模型：多个线程共享内存，通过锁来保证安全
- Actor模型：不共享内存，通过消息通信
- CSP模型：通过通信共享内存（而不是共享内存来通信）
- Fork&Join模型：把任务拆分（Fork），并行执行，再合并结果（Join）

go语言主要是基于`csp`的goroutine和channel实现，同时也支持多线程共享内存的并发方式。



## goroutine

goroutine是go程序的基本并发执行单元，每个go程序至少包含一个goroutine（main），启动时自动创建。

一个goroutine初始只占很小的栈空间，由go的运行时调度。

在go中不需要自己写进程线程协程，只需要<u>把任务包装成函数</u>，开启goroutine去执行这个函数就可以。

#### go关键字

go中使用goroutine只需要在函数前加上go关键字即可，就可以让该函数在新创建的goroutine里面执行。

```go
go f()  // 创建一个新的 goroutine 运行函数f
```

- 匿名函数也支持，但是注意闭包



##### WaitGroup

Go 语言在 `sync` 包中提供了更规范的并发控制工具，例如 `WaitGroup`，用于**等待一组 goroutine 执行完成**。当我们不关心具体返回结果，或者结果通过其他方式处理时，`WaitGroup` 是一种非常合适的同步手段。

其核心机制如下：

- `Add(n)`：登记需要等待的 goroutine 数量
- `Done()`：每个 goroutine 完成时调用，计数减一
- `Wait()`：阻塞当前 goroutine，直到计数归零

在示例中，主 goroutine 通过 `wg.Add(1)` 登记一个子任务，子 goroutine 执行完毕后调用 `wg.Done()`，主 goroutine 在 `wg.Wait()` 处阻塞等待。这样可以**精确地在所有任务完成后再退出程序**，相比 `time.Sleep` 更加高效和可靠。

```go
var wg sync.WaitGroup
func hello() {
	defer wg.Done() // 确保一定会执行
	fmt.Println("hello")
}
func main() {
	wg.Add(1) // 登记1个goroutine
	go hello()
	fmt.Println("你好")
	wg.Wait() // 阻塞直到所有goroutine完成
}
```

##### goroutine调度

和操作系统内核调度系统线程不同，goroutine调度是由go的运行时完成的，作用是按照一定的规则把所有的goroutine调度到操作系统的线程上去执行。目前go的调度器采用的是GPM调度模型。

###### GPM模型



- G：表示goroutine，每次`go f()`都是创建一个G，包含函数和上下文；
- 全局队列，P的本地队列：存放等待运行的G；优先加入本地队列，满了之后会批量转移到G的全局队列；
- P：表示goroutine所需的资源，最多GOMAXPROCS 个；
- M：线程运行任务就得获取 G，从 P 的本地队列获取 G，当 P 的本地队列为空时，M 也会尝试从全局队列或其他 P 的本地队列获取 G。M 运行 G，G 执行之后，M 会从 P 获取下一个 G，不断重复下去。

> Go 调度器采用本地队列和全局队列的组合：本地队列用于减少锁竞争、<u>提高调度效率</u>；全局队列用于在队列溢出或负载不均时进行任务分发，从而实现高性能与<u>负载均衡</u>。

Go 的 goroutine 之所以高性能，是因为它在用户态由 runtime 调度，避免了操作系统线程的高开销，并且能够高效利用多核资源。

