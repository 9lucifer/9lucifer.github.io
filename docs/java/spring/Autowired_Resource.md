# Autowired和Resource

如果使⽤ `@Autowired `注解注⼊ Bean 时，IDEA 会提示“Field injection is not recommended”。主要原因如下：

- 不利于单测，字段注入需要反射去设置和修改属性。
  - 原因：字段注入让依赖隐藏在类内部，只能靠 Spring 反射注入，导致类无法脱离 Spring 容器独立测试。
- 字段注入会隐藏循环依赖问题，但是构造方法注入会去检查。
- 构造⽅法注⼊可以使⽤ final 字段确保依赖在对象创建时就被初始化，避免了后续修改的⻛险。

### @Autowired 和 @Resource 注解的区别

- 来源：@Autowired 是spring提供的；@Resource 是JDK自带的。

- 注⼊⽅式： @Autowired 默认按照类型，byType；⽽ @Resource 默认按名称，byName 。

### @Autowired的实现原理

`@Autowired` 的实现依赖于 Spring 的 **BeanPostProcessor 机制**。Spring 在启动时会注册 `AutowiredAnnotationBeanPostProcessor`。当 Bean 创建完成后，在 `populateBean` 阶段，该处理器会扫描 Bean 中的 `@Autowired` 注解，构建依赖元数据，然后通过 `BeanFactory.resolveDependency` 从容器中查找对应类型的 Bean，最后通过反射将依赖注入到字段、setter 方法或构造器中。

> populateBean 是 Spring 在 Bean 创建过程中用于 **完成依赖注入和属性填充** 的方法，它会调用 BeanPostProcessor（如 AutowiredAnnotationBeanPostProcessor）扫描 `@Autowired` 等注解，并通过 BeanFactory 查找依赖，最后通过反射将依赖注入到 Bean 中。