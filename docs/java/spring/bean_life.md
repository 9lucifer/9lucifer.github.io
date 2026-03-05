# bean的生命周期

bean的生命周期可以分为下面五个阶段。

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20260306004932718.png" alt="image-20260306004932718" style="zoom:50%;" />

第⼀个阶段是**实例化**。Spring 容器会根据 **BeanDefinition**，通过反射调⽤ Bean 的构造⽅法创建对象实例。

第⼆阶段是**属性赋值**。这个阶段 Spring 会给 Bean 的属性赋值，包括通过 @Autowired 、 @Resource 这些注解注 ⼊的依赖对象，以及通过 @Value 注⼊的配置值。

第三阶段是**初始化**。这个阶段包括：

- 检查 Aware 接口并注入依赖：如果 Bean 实现了 Aware 接口，Spring 会注入对应对象，例如`BeanNameAware`、`BeanFactoryAware`、`ApplicationContextAware`

- BeanPostProcessor 前置处理：执行

  ```
  BeanPostProcessor.postProcessBeforeInitialization()
  ```

  典型用途如修改 Bean。
  
- 执行 InitializingBean 接口：如果实现`InitializingBean`则执行`afterPropertiesSet()`

- 执行自定义 init-method：如果配置：`@Bean(initMethod="init")`则执行`init()`

- BeanPostProcessor 后置处理：很多 **AOP代理对象** 是在这里创建的。

第四阶段是**使用**阶段。Bean 完成初始化后，被应用程序正常调用。

第五阶段是**销毁**。有以下几个步骤：

- 注册 Destruction 回调：Spring 会记录 Bean 的销毁方法。
- 执行 DisposableBean：如果实现`DisposableBean`，执行`destroy()`
- 执行自定义 destroy-method：如果配置`@Bean(destroyMethod="destroy")`，执行`destroy()`
