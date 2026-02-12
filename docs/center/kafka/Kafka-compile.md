# Kafka2.7.2源码编译记录

> 参考博客：https://cloud.tencent.com/developer/article/2240359

为什么是2.7.2呢，因为我想搭配《kafka权威指南第2版》一起食用。

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/image/image-20260212190839193.png" alt="image-20260212190839193" style="zoom: 25%;" />

## 一、准备好环境

编译某个中间件源码的第一步就是去网上去搜罗相关的基建的版本，盲目的编译很可能编译到一半缺这个少那个。根据参考博客的结果，搜罗到的基建版本需求如下：

```text
JDK 版本：1.8
Scala 版本：2.12.8
Gradle 版本：6.6
```

#### 验证版本

![image-20260212191010562](https://imgtu.oss-cn-beijing.aliyuncs.com/image/image-20260212191010562.png)

## 二、修改镜像文件下载地址

需要更改的文件是：`build.gradle`

1. 先搜索`buildscript`，位置如下

需要在repositories中加上在国内的私服地址

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/image/image-20260212192656379.png" alt="image-20260212192656379" style="zoom:50%;" />

repositories内容如下：

```json
repositories {
    maven {
      url 'http://maven.aliyun.com/nexus/content/groups/public/'
    }
    maven {
      url 'http://maven.aliyun.com/nexus/content/repositories/jcenter'
    }
    mavenCentral()
    jcenter()
    maven {
      url "https://plugins.gradle.org/m2/"
    }
```

2. 再在文件内搜索`allprojects`，位置如下

需要在repositories中加上在国内的私服地址

![image-20260212192836156](https://imgtu.oss-cn-beijing.aliyuncs.com/image/image-20260212192836156.png)

repositories内容如下：

```json
  repositories {
    maven {
      url 'http://maven.aliyun.com/nexus/content/groups/public/'
    }
    maven {
      url 'http://maven.aliyun.com/nexus/content/repositories/jcenter'
    }
    mavenCentral()
  }
```



都符合要求之后，下面就是开始编译源码了，点击右侧的小按钮即可。

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/image/image-20260212193047810.png" alt="image-20260212193047810" style="zoom: 33%;" />





## 三、编译成功的效果

可以看到是非常之快的，比jdk快多了～

![image-20260212193139273](https://imgtu.oss-cn-beijing.aliyuncs.com/image/image-20260212193139273.png)

编译之后的代码结构：

![image-20260212193311846](https://imgtu.oss-cn-beijing.aliyuncs.com/image/image-20260212193311846.png)