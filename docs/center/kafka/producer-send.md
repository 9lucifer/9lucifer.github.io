# kafka生产者发送消息流程

下面是发送消息的测试代码：

```java
public class KafkaProducerExample {
    public static void main(String[] args) {
        Properties properties = new Properties();
        properties.setProperty(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,"localhost:9092");
        properties.setProperty(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        properties.setProperty(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,StringSerializer.class.getName());
        
        try (Producer<String,String> producer = new KafkaProducer<>(properties)){
            for (int i = 6; i < 10; i++) {
                String key = "key-"+i;
                String value = "这是第"+i+"条消息";
                ProducerRecord<String,String>record = new ProducerRecord<>("test2",key,value);
                producer.send(record, new Callback() {
                    @Override
                    public void onCompletion(RecordMetadata metadata, Exception e) {
                        if(e != null){
                            System.out.println("发送失败");
                        }else{
                            System.out.printf("发送成功！主题: %s, 分区: %d, 偏移量: %d%n",
                                    metadata.topic(), metadata.partition(), metadata.offset());
                        }
                    }
                });
            }
            producer.flush();
            System.out.println("发送完成");
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
```



## 生产者发送步骤

### 创建生产者

```java
properties.setProperty(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,"localhost:9092"); properties.setProperty(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
properties.setProperty(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,StringSerializer.class.getName());
```

要向kafka写入消息，得先有一个生产者，并设置一些属性。kafka生产者有三个必须的属性：

`bootstrap.servers`：broker的地址。可以由多个host:port组成，生产者用它们来建立初始的Kafka集群连接。它不需要包含所有的broker地址，因为生产者在建立初始连接之后可以从给定的broker那里找到其他broker的信息。

> 建议至少提供两个broker地址，因为一旦其中一个停机，则生产者仍然可以连接到集群。

`key.serializer`:序列化消息的键。

`value.serializer`：序列化消息的值。

发送消息主要有以下三种方式：

- 发送并忘记：将消息发送至服务器而不关心其是否成功送达。虽然 Kafka 的高可用性和生产者的自动重发机制能确保大多数消息成功，但若遇不可重试错误或超时，消息将会丢失且应用不会收到任何异常。
- 同步发送：通过调用 send() 方法返回的 Future 对象并执行 get() 方法进行等待，使生产者在发送下一条消息前明确当前消息是否发送成功。
- 异步发送：调用 send() 方法时指定一个回调函数，当服务器返回响应时自动触发该函数，从而在不阻塞流程的情况下处理发送结果或异常。



### 发消息到kafka

```java
// ➊ 创建一个 ProducerRecord 对象，指定主题 (Topic)、键 (Key) 和值 (Value)
ProducerRecord<String, String> record =
    new ProducerRecord<>("CustomerCountry", "Precision Products", "France");

try {
    // ➋ 使用 producer 对象的 send() 方法发送记录
    producer.send(record);
} catch (Exception e) {
    // ➌ 如果在发送到 Kafka 之前（如序列化错误）发生异常，捕获并打印
    e.printStackTrace();
}
```

**同步发送消息**的实现相对简单，其核心在于调用 `producer.send(record)` 后紧接着调用 `get()` 方法来等待 Kafka 的响应。这种方式的优点是生产者可以直观地捕获到消息发送失败或重试达上限时的异常，确保在发送下一条消息前明确当前消息的状态。然而，同步发送存在严重的性能瓶颈：由于发送线程在等待 broker 响应（通常需 2 毫秒甚至更久）期间处于阻塞状态，无法执行任何其他操作，这会导致整体吞吐量大幅下降。因此，同步发送虽常用于示例代码，但在追求高性能的生产环境中极少使用。

**异步发送消息**则通过回调机制解决了性能问题。实现时需要定义一个实现 `Callback` 接口的类，并重写其唯一的 `onCompletion` 方法。当消息发送完成时，如果 Kafka 返回错误，该方法会接收到一个非空的异常对象以供处理。在调用 `send()` 方法时，将此回调对象作为参数传入，生产者便可以在不阻塞主线程的情况下继续发送后续消息。需要注意的是，回调逻辑是在生产者主线程中执行的，虽然这能保证发往同一分区的消息回调按发送顺序执行，但也要求回调函数的处理必须极快。开发者应避免在回调中执行任何阻塞操作，否则会引发生产者的延迟并影响整体消息的发送效率，复杂的后续逻辑建议放入其他线程执行。

#### 生产者配置

| **参数名称**                              | **类别** | **功能描述与核心要点**                                     | **性能/可靠性影响**                                          |
| ----------------------------------------- | -------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| **client.id**                             | 标识     | 客户端标识符，任意字符串。                                 | 用于日志、指标和配额，方便故障诊断。                         |
| **acks**                                  | 可靠性   | 指定多少个副本收到消息才算写入成功。                       | **0**: 不等待响应，吞吐量最高但极易丢数； **1**: 仅leader收到即响应，兼顾速度与持久性； **all**: 全部同步副本收到才响应，最安全但延迟最高。 |
| **max.block.ms**                          | 时间控制 | 控制 `send()` 等方法在缓冲区满或元数据不可用时阻塞的时间。 | 超过此时间会抛出超时异常。                                   |
| **delivery.timeout.ms**                   | 时间控制 | 消息从准备好发送到收到响应或放弃发送（含重试）的总时间。   | 建议设置为愿意等待的最长时间（如几分钟），涵盖首领选举时间。 |
| **request.timeout.ms**                    | 时间控制 | 生产者等待服务器响应单个请求的时间。                       | 触及时会进行重试或触发 `TimeoutException` 回调。             |
| **retries / retry.backoff.ms**            | 可靠性   | 控制重试次数及重试的时间间隔（默认 100ms）。               | 建议通过 `delivery.timeout.ms` 统一控制重试时长，而非单纯限制次数。 |
| **linger.ms**                             | 性能     | 发送批次前等待更多消息加入的时间（默认 0）。               | 设置略大于 0 的值会增加少量延迟，但能显著提升吞吐量并减少开销。 |
| **buffer.memory**                         | 内存     | 生产者待发送消息的内存缓冲区总大小。                       | 若应用发送速度超过生产速度，缓冲耗尽后 `send()` 会被阻塞。   |
| **compression.type**                      | 性能     | 指定消息发送前的压缩算法（snappy, gzip, lz4, zstd）。      | 降低网络传输和存储开销。snappy CPU 消耗低；gzip 压缩比高。   |
| **batch.size**                            | 性能     | 发往同一分区的单个批次最大内存大小（单位：字节）。         | 太小会增加频繁发送的开销；太大仅会多占内存，不会增加延迟。   |
| **max.in.flight.requests.per.connection** | 性能     | 在收到服务器响应前，生产者可以发送的并发批次数。           | 值越大吞吐量越高。设置为 1 可保证重试时的顺序，或启用幂等性。 |
| **max.request.size**                      | 性能     | 限制单个请求或单条消息的最大大小（默认 1MB）。             | 需与 broker 的 `message.max.bytes` 配置匹配。                |
| **enable.idempotence**                    | 可靠性   | 是否启用幂等生产者（精确一次性语义）。                     | 设置为 `true` 可避免因重试导致的重复消息，并保证分区内消息有序。 |



## 分区

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/image/image-20260215201350749.png" alt="image-20260215201350749" style="zoom:50%;" />



除了默认分区器，Kafka 客户端还提供了其他选择：

- **RoundRobinPartitioner**：实现简单的随机分区分配。
- **UniformStickyPartitioner**：即使消息包含键，也实现黏性的随机分配，用于解决因某些键负载过大导致的倾斜问题。
- **分区数量警告**：映射关系依赖于分区总数。如果主题增加了新分区，旧键对应的映射可能会改变，导致新旧数据分布在不同分区。因此，建议在创建主题时规划好分区数且不要随意增加。

当默认哈希分配导致严重数据倾斜（例如某个大客户的交易量远超其他客户）时，需要实现自定义分区器。

```java
public class BananaPartitioner implements Partitioner {
    public void configure(Map<String, ?> configs) {} 

    public int partition(String topic, Object key, byte[] keyBytes,
                         Object value, byte[] valueBytes, Cluster cluster) {
        List<PartitionInfo> partitions = cluster.partitionsForTopic(topic);
        int numPartitions = partitions.size();

        // 验证键是否合法
        if ((keyBytes == null) || (!(key instanceof String)))
            throw new InvalidRecordException("We expect customer name as key");

        // 特殊客户分配固定分区，其他客户进行哈希分配
        if (((String) key).equals("Banana"))
            return numPartitions - 1; 

        return Math.abs(Utils.murmur2(keyBytes)) % (numPartitions - 1);
    }
    public void close() {}
}
```



## 结合源码分析

##### 函数位置

`org.apache.kafka.clients.producer.KafkaProducer#send(org.apache.kafka.clients.producer.ProducerRecord<K,V>, org.apache.kafka.clients.producer.Callback)`

##### 函数介绍

异步地将一条记录发送到主题，并在发送被确认时调用提供的回调函数，一旦记录被存储在等待发送的记录缓冲区中，此方法将立即返回，允许并行发送许多记录，而无需在每条记录后阻塞等待响应。

##### 返回值介绍

发送的结果是一个 RecordMetadata，指定记录被发送到的分区、分配给它的偏移量和记录的时间戳。

由于 send 调用是异步的，它为将分配给此记录的 RecordMetadata 返回一个 Future。在此 future 上调用 get() 将阻塞直到关联的请求完成，然后返回记录的元数据或抛出发送记录时发生的任何异常。发送到同一分区的记录的回调保证按顺序执行。请注意，回调通常会在生产者的 I/O 线程中执行，因此应该相当快速，否则它们将延迟来自其他线程的消息发送。如果你想执行阻塞或计算量大的回调，建议在回调体中使用你自己的 Executor 来并行化处理。

```java
@Override
public Future<RecordMetadata> send(ProducerRecord<K, V> record, Callback callback) {
    // intercept the record, which can be potentially modified; this method does not throw exceptions
    // 拦截器，调用拦截器链 ，可以修改消息记录
    ProducerRecord<K, V> interceptedRecord = this.interceptors.onSend(record);
    return doSend(interceptedRecord, callback);
}
```

##### 拦截器

拦截器作用：调用拦截器链 ，可以修改消息记录

> onSend函数具体内容:遍历当前所有的拦截器，加进去 
>
> ![image.png](https://imgtu.oss-cn-beijing.aliyuncs.com/image/1768749453298-83ad697c-dc86-4a19-9e8b-671549a07cea.png)



##### doSend方法-核心执行

- private - 私有方法，只在 KafkaProducer 内部调用 
- 返回 Future - 异步结果                                             
- 参数：拦截器处理后的 record 和用户的 callback

```java
private Future<RecordMetadata> doSend(ProducerRecord<K, V> record, Callback callback) {
    // 用来存储最终选定的 topic 和 partition，初始为 null
    TopicPartition tp = null;

    try {
        // 检查生产者是否已关闭，如果关闭则抛 IllegalStateException
        throwIfProducerClosed();

        // ……
        // 获取 ClusterAndWaitTime 对象，包含集群信息和等待时间

        // 更新当前时间（加上等待元数据的时间），提取集群信息
        nowMs += clusterAndWaitTime.waitedOnMetadataMs;
        long remainingWaitMs = Math.max(
            0,
            maxBlockTimeMs - clusterAndWaitTime.waitedOnMetadataMs
        );
        Cluster cluster = clusterAndWaitTime.cluster;

        // ……
        // 使用配置的 key 序列化器将 key 转换为字节数组

        // ……
        // 使用配置的 value 序列化器将 value 转换为字节数组

        // 调用分区器选择目标分区
        int partition = partition(
            record,
            serializedKey,
            serializedValue,
            cluster
        );
        tp = new TopicPartition(record.topic(), partition);

        // 将 headers 设置为只读（防止后续修改）
        setReadOnly(record.headers());
        Header[] headers = record.headers().toArray();

        // 估算消息大小
        int serializedSize =
            AbstractRecords.estimateSizeInBytesUpperBound(
                apiVersions.maxUsableProduceMagic(),
                compressionType,
                serializedKey,
                serializedValue,
                headers
            );

        ensureValidRecordSize(serializedSize);

        long timestamp =
            record.timestamp() == null ? nowMs : record.timestamp();

        if (log.isTraceEnabled()) {
            log.trace(
                "Attempting to append record {} with callback {} to topic {} partition {}",
                record,
                callback,
                record.topic(),
                partition
            );
        }

        // 包装用户的 callback 和拦截器，确保两者都被调用 
        Callback interceptCallback =
            new InterceptorCallback<>(callback, this.interceptors, tp);

        // 检查事务
        if (transactionManager != null && transactionManager.isTransactional()) {
            transactionManager.failIfNotReadyForSend();
        }

        // 添加到批处理缓冲区
        //  返回 RecordAppendResult，包含：                                                                                                                                    
        //  	future - 消息的异步结果                                                                                                                                          
        //  	batchIsFull - 批次是否已满                                                                                                                                       
        //  	newBatchCreated - 是否创建了新批次                                                                                                                               
        // 	 	abortForNewBatch - 是否需要重新选择分区
        RecordAccumulator.RecordAppendResult result =
            accumulator.append(
                tp,
                timestamp,
                serializedKey,
                serializedValue,
                headers,
                interceptCallback,
                remainingWaitMs,
                true,
                nowMs
            );

        // 处理新批次     
        if (result.abortForNewBatch) {
            int prevPartition = partition;

            partitioner.onNewBatch(
                record.topic(),
                cluster,
                prevPartition
            );

            partition = partition(
                record,
                serializedKey,
                serializedValue,
                cluster
            );
            tp = new TopicPartition(record.topic(), partition);

            if (log.isTraceEnabled()) {
                log.trace(
                    "Retrying append due to new batch creation for topic {} partition {}. The old partition was {}",
                    record.topic(),
                    partition,
                    prevPartition
                );
            }

            // producer callback will make sure to call both 'callback' and interceptor callback
            interceptCallback =
                new InterceptorCallback<>(callback, this.interceptors, tp);

            result =
                accumulator.append(
                    tp,
                    timestamp,
                    serializedKey,
                    serializedValue,
                    headers,
                    interceptCallback,
                    remainingWaitMs,
                    false,
                    nowMs
                );
        }

        // 如果启用了事务，将这个分区添加到事务中
        if (transactionManager != null && transactionManager.isTransactional())
            transactionManager.maybeAddPartitionToTransaction(tp);

        // 如果满了或者创建了新的：唤醒发送线程
        if (result.batchIsFull || result.newBatchCreated) {
            log.trace(
                "Waking up the sender since topic {} partition {} is either full or getting a new batch",
                record.topic(),
                partition
            );
            this.sender.wakeup();
        }

        // 返回异步结果给用户
        return result.future;

        // handling exceptions and record the errors;
        // for API exceptions return them in the future,
        // for other exceptions throw directly
    } 
  // ......异常处理链
}

```

<br>

##### 总流程

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/image/1768751453593-1325f008-7eea-46b1-9169-7a5913e57dbf.png" alt="image.png" style="zoom: 50%;" />

<br>

##### 关键特性                                                                                                                               

- 异步处理：消息先添加到缓冲区，不立即发送
- 批处理：多条消息一起发送，提高吞吐量       
- 异常处理：所有异常都会通知拦截器           
- 事务支持：如果启用事务，会更新事务状态
