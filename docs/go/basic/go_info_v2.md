# go学习记录——进阶

> 记录的定位：复盘，索引，查缺补漏
>
> 学习资料：https://www.liwenzhou.com/

## go开发进阶

### 函数

##### **定义**

```go
func 函数名(参数)(返回值){
    函数体
}
```

- 函数的参数和返回值是可选的

##### **参数**

- 如果相邻变量类型相同，可以**省略**类型，举例：

  ```go
  func intSum(x, y int) int {
  	return x + y
  }
  ```

- 可变参数：参数数量不固定，go里面用`...`表示。

  ```go
  func intSum2(x ...int) int {
  	fmt.Println(x) //x是一个切片
  	sum := 0
  	for _, v := range x {
  		sum = sum + v
  	}
  	return sum
  }
  ```

##### **返回值**

- 多返回值：如果有多个返回值，必须得用`()`包起来。

  ```go
  func calc(x, y int) (int, int) {
  	sum := x + y
  	sub := x - y
  	return sum, sub
  }
  ```

- <u>返回值命名</u>：函数定义时可以给返回值命名，并在函数体中直接使用这些变量，最后通过`return`关键字返回。

  ```go
  func calc(x, y int) (sum, sub int) {
  	sum = x + y
  	sub = x - y
  	return
  }
  ```

- 返回值是切片的时候，若是空，直接返回nil，没必要返回一个长度为0的切片



##### 变量作用域

- 全局变量：定义在函数之外的变量，在程序整个运行周期有效，在函数里面可以使用。

- 局部变量
  - 函数内定义的变量无法在该函数外使用
  - 如果局部变量和全局变量重名，优先访问局部变量



##### 函数类型

使用`type`关键字来定义一个函数类型，格式如下：

```go
type calculation func(int, int) int
```

上面语句定义了一个`calculation`类型，是一种函数类型，函数接收两个int类型的参数并且返回一个int类型的返回值,凡是满足这个条件的函数都是calculation类型的函数，例如下面的add和sub是calculation类型。

```go
func add(x, y int) int {
	return x + y
}

func sub(x, y int) int {
	return x - y
}
```

- add和sub都能赋值给calculation类型的变量。



##### 高阶函数

- 函数作为参数

```go
func add(x, y int) int {
	return x + y
}
func calc(x, y int, op func(int, int) int) int {
	return op(x, y)
}
func main() {
	ret2 := calc(10, 20, add)
	fmt.Println(ret2)
}
```

- 函数作为返回值

```go
func do(s string) (func(int, int) int, error) {
	switch s {
	case "+":
		return add, nil
	case "-":
		return sub, nil
	default:
		err := errors.New("无法识别的操作符")
		return nil, err
	}
}
```



##### 匿名函数&闭包

顾名思义，没有名字的函数，定义格式如下：

```go
func(参数)(返回值){
    函数体
}
```

- 匿名函数没有名字，因此不能被调用，只能<u>保存在某个变量</u>或者<u>立即执行</u>。

  ```go
  func main() {
  	// 将匿名函数保存到变量
  	add := func(x, y int) {
  		fmt.Println(x + y)
  	}
  	add(10, 20) // 通过变量调用匿名函数
  
  	//自执行函数：匿名函数定义完加()直接执行
  	func(x, y int) {
  		fmt.Println(x + y)
  	}(10, 20)
  }
  ```

- 匿名函数多用于实现回调函数和闭包。



##### 闭包

<u>闭包=函数+引用环境</u>

例子：

```go
func adder() func(int) int {
	var x int
	return func(y int) int {
		x += y
		return x
	}
}
func main() {
	var f = adder()
	fmt.Println(f(10)) //10
	fmt.Println(f(20)) //30
	fmt.Println(f(30)) //60

	f1 := adder()
	fmt.Println(f1(40)) //40
	fmt.Println(f1(50)) //90
}
```

我的理解是，这个例子里面f和x（f所在的环境）构成一个闭包，在f的生命周期内，x也会存活。

##### `defer`

`defer`会延迟处理后面跟的语句，顺序是按照定义的顺序逆序执行，一般用于处理资源释放的问题。

**执行时机**：return在go中不是原子操作，要分为赋返回值和ret指令两步；defer语句的执行时机就是在二者中间。



##### panic和recover

Go 中 `panic` 用于抛出运行时严重错误，会中断当前函数执行并沿调用栈向上展开，同时执行沿途的 `defer`。`recover` 用于捕获 `panic`，但只能在 `defer` 函数中生效。实际开发中，普通错误一般用 `error` 返回，`panic` 只用于不可恢复的严重问题或程序内部异常状态。

**panic**：`panic` 会让程序停止当前函数的正常执行，并开始一层层往外返回。
 在返回过程中，当前函数里已经注册的 `defer` 仍然会执行。

```go
func main() {
	fmt.Println("start")
	panic("something went wrong")
	fmt.Println("end")
}
// 输出
// start
// panic: something went wrong
```

当发生 `panic` 时：

1. 当前函数立即停止后续正常代码
2. 开始执行当前函数的 `defer`
3. 然后返回到上一层函数
4. 上一层函数的 `defer` 也会执行
5. 如果一直没人处理，程序最终崩溃退出

**recover**：`recover` 用来**捕获 panic**，让程序不要继续崩溃，只能在`defer`里面生效。

`recover` 的设计就是在 **panic 正在向外传播的过程中** 去拦截它。 如果不是在 `defer` 中调用，通常拿不到 panic。



### 指针

区别于`cpp`的指针，go的指针不能进行偏移和运算，是安全指针。

> Go 的指针不是“裸内存工具”，而是“受限制的对象引用”。它保留了按引用访问和修改值的能力，但去掉了 C/C++ 那种直接操作内存地址的危险能力，因此更安全。

go使用`&`进行取址：`ptr := &v    // v的类型为T`

go使用`*`进行取值：`c := b // 指针取值（根据指针去内存取值）`

##### make

go的基本类型默认分配内存，但是引用类型需要自行分配内存。

new函数不太常用，new函数的返回值是相应的指针。

```go
func new(Type) *Type
```

make也是用于内存分配，只用于`slice`、`map`以及`channel`的内存创建，而且返回的是三个类型本身，而不是他们的指针类型。

> new 和 make的区别：
>
> 1. make只用于slice、map以及channel的初始化，返回的还是这三个引用类型本身；
> 2. 而new用于类型的内存分配，并且内存对应的值为类型零值，返回的是指向类型的指针。



### 结构体

##### 自定义类型

将`MyInt`定义为int类型：`type MyInt int`，这是一个全新的类型，但是特性和int一样。

##### 类型别名

语法：`type TypeAlias = Type`

举例：

```go
type byte = uint8
type rune = int32
```

类型别名不会产生编译之后的新类型，但是自定义类型会。

##### 结构体定义

定义：

```go
type 类型名 struct {
    字段名 字段类型
    字段名 字段类型
    …
}
```

- 类型名：结构体的名称，在同一个包内**<u>不能重复</u>**。
- 字段名：结构体字段名。结构体中的字段名必须唯一。
- 字段类型：表示结构体字段的具体类型，同样类型的字段也可以写在一行。

字段大写表示可公开访问，小写表示私有。



##### 结构体实例化

结构体是**<u>值类型</u>**！实例化语法：`var 结构体实例 结构体类型`

举例：

```go
func main() {
    var user struct{Name string; Age int}
    user.Name = "小王子"
    user.Age = 18
    fmt.Printf("%#v\n", user)
}
```

结构体占用一块连续的内存，空结构体不占用内存。

##### 匿名结构体

在一些临时场景可以用匿名结构体：
```go
var user struct{Name string; Age int}
user.Name = "小王子"
user.Age = 18
fmt.Printf("%#v\n", user)
```



##### 指针类型结构体

可以用`new`实例化结构体，返回值是结构体的指针；但是go支持直接用`.`去访问成员。

```go
var p2 = new(person)
p2.name = "小王子"
```

> 使用`&`对结构体进行取地址操作相当于对该结构体类型进行了一次`new`实例化操作。



##### 结构体初始化

没初始化的结构体，成员变量是对应类型的零值。

1. 键值对初始化

```go
p5 := person{
	name: "小王子",
	city: "北京"
}
fmt.Printf("p5=%#v\n", p5) //p5=main.person{name:"小王子", city:"北京"}
```

2. 对结构体指针初始化

```go
p6 := &person{
	name: "小王子"
}
fmt.Printf("p6=%#v\n", p6) //p6=&main.person{name:"小王子"}
```

3. 初始化可以不写键，只写值
   - 必须是初始化所有字段
   - 顺序必须一致
   - 不可以和键值初始化方式混用



##### 构造函数

go语言<u>无构造函数</u>，需要自己实现；注意返回值用指针，因为结构体是值类型，值拷贝传递开销太大。

```
func newPerson(name, city string) *person {
	return &person{
		name: name,
		city: city,
	}
}
```



##### 方法和接受者

在go中，可以指定某种类型为接收者，方法是作用于特定类型变量的函数，接受者类似其他语言的`this`。

定义：

```go
func (接收者变量 接收者类型) 方法名(参数列表) (返回参数) {
    函数体
}
```

- 接收者变量：接收者中的参数变量名在命名时，官方建议使用接收者类型名称首字母的小写，例如`Connector`类型的接收者变量应该命名为`c`等。

> 方法和函数区别：函数不属于任何类型，方法属于特定类型。

什么时候应该用值类型接受者：

1. 需要修改接收者中的值
2. 接收者是大对象
3. 保证全局一致

> 在Go语言中，接收者的类型可以是<u>任何类型</u>，不仅仅是结构体，任何类型都可以拥有方法。 



##### 结构体匿名字段

结构体允许其成员字段在声明时没有字段名而只有类型，默认毁用类型名作为字段名。一个结构体中，**同种类型的匿名字段只能有一个**。



##### 嵌套结构体

一个结构体可以嵌套另一个结构体/指针。

访问结构体成员会优先在结构体里面查找，找不到再去嵌套的匿名字段里面查找。

> 如果字段名冲突，需要指定具体的内嵌字段名。

###### 继承

可以使用嵌套结构体实现继承。

##### 结构体标签

标签是结构体的元数据，可以在运行时通过反射获取。

结构体tag由一个或多个键值对组成。键与值使用冒号分隔，值用双引号括起来。同一个结构体字段可以设置多个键值对tag，不同的键值对之间使用空格分隔。

> 切记不要在键值之间加多余空格

