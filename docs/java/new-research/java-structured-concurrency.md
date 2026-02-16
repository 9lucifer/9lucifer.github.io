# 结构化并发-虚拟线程

## 基础概念

### 虚拟线程和平台线程的区别

传统的 Java 线程是一种**平台线程**：它是一个包含线程运行状态的对象，例如运行时栈、本地存储、指针等，并且与**内核线程一一对应**。平台线程有具体的地址，比如占用了很多的运行时堆栈。
平台线程几乎可以胜任所有场景，但也存在明显限制：由于每个线程都对应一个内核线程，操作系统需要维护大量线程元数据与调度信息，因此会占用较多内存和系统资源。

虚拟线程则属于**用户线程**，它们运行在用户态而非内核态，由 Java 自身负责调度，而不是操作系统。虚拟线程在少量的平台线程上多路复用，使用更少的资源。这么做最大的优势在于：我们可以轻松创建海量线程 😋。
虚拟线程不会直接占用操作系统线程资源，而是运行在 Java 维护的一小部分 **carrier 线程** 之上。另外，在虚拟线程上下文中执行的阻塞操作，实际上不会阻塞底层的 carrier 线程，从而显著提升并发能力与资源利用率。



### 线程如何创建

#### 平台线程

1. 继承 `Thread` 类

```java
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("当前线程: " + Thread.currentThread().getName());
    }
}

public class Main {
    public static void main(String[] args) {
        MyThread t = new MyThread();
        t.start(); // start() 才会真正创建平台线程
    }
}

```

每调用一次 start() → 创建一个新的内核线程，这种方式耦合度比较高，不推荐。

2. 实现 `Runnable`

```java
class MyTask implements Runnable {
    @Override
    public void run() {
        System.out.println("执行任务: " + Thread.currentThread().getName());
    }
}

public class Main {
    public static void main(String[] args) {
        Thread t = new Thread(new MyTask());
        t.start();
    }
}

```

这种方式把**任务**和**线程**分离，更合理。

3. 线程池 `ExecutorService`

```java
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) {
        ExecutorService pool = Executors.newFixedThreadPool(3);

        pool.submit(() ->
            System.out.println(Thread.currentThread().getName())
        );

        pool.shutdown();
    }
}

```

4. `Callable + Future`（有返回值）

```java
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws Exception {
        ExecutorService pool = Executors.newSingleThreadExecutor();

        Future<Integer> future = pool.submit(() -> {
            return 42;
        });

        System.out.println(future.get());

        pool.shutdown();
    }
}
```

5. jdk21显式写法

```java
public class Main {
    public static void main(String[] args) {

        Thread.ofPlatform().start(() -> {
            System.out.println("当前线程: " + Thread.currentThread());
        });

    }
}
```

这种写法明确表达我要内核线程，而不是虚拟线程，因为未来很多 API 默认可能是 virtual thread（猜测）。

#### 虚拟线程

1. Thread.ofVirtual().start(...)

```java
public class Main {
    public static void main(String[] args) {

        Thread.ofVirtual().start(() -> {
            System.out.println("虚拟线程: " + Thread.currentThread());
        });

    }
}
```
> 特别注意：Thread.ofVirtual().unstarted(...)能让你有未启动的虚拟线程实例。

2. Thread.startVirtualThread(...)

```java
public class Main {
    public static void main(String[] args) {

        Thread.startVirtualThread(() -> {
            System.out.println(Thread.currentThread());
        });

    }
}
```



### 虚拟线程使用的注意点

1. 不要池化虚拟线程

传统的平台线程一般用线程池去管理，提前创建好n个线程，任务来了排队获取线程的使用权。但是虚拟线程创建很快，真的不用池化。

2. 不要使用类似threadlocal类似的这种每个线程独有的实例，原因很简单，当你有2000万个虚拟线程的时候，每个独享实例的数量都是千万级的。
3. 不要使用synchronized代码块，如果需要用到同步的功能，需要使用reentrantlock或者其他锁。因为jvm会把使用同步块的虚拟线程固定到平台线程，这又退化成了平台线程。





---

###### 参考教程

https://www.bilibili.com/video/BV1X8BeB5EGc?buvid=XX52ED45644AEC2D82ACF8AE34FE8A513547B&from_spmid=search.search-result.0.0&is_story_h5=false&mid=NCoz3%2FfnxyjQk0vBZB1M6g%3D%3D&plat_id=116&share_from=ugc&share_medium=android&share_plat=android&share_session_id=c1e2b8cc-dbda-4a6c-bdee-6de637db8c2e&share_source=WEIXIN&share_tag=s_i&spmid=united.player-video-detail.0.0&timestamp=1771041114&unique_k=O25uWhK&up_id=542307689&vd_source=5485aeb0fc1c5dc7e2d79f40fb5fe4ea

