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



### 接口

接口更倾向于描述<u>能做什么</u>，约定一个类型应该具备哪些方法。

go里面提倡面向接口编程，从而实现<u>**解耦**</u>。

接口类型是一组方法的集合，规定了需要实现的所有方法，接口类型由任意个方法签名构成，定义格式如下：

```go
type 接口类型名 interface{
    方法名1( 参数列表1 ) 返回值列表1
    方法名2( 参数列表2 ) 返回值列表2
    …
}
```

- 当**方法名**首字母是大写且这个**接口类型**名首字母也是大写时，这个方法可以被接口所在的包之外的代码访问。

#### 接口实现

Go 语言中的类型只要实现了接口中的**所有方法**，就称实现了该接口。

举例，定义接口如下：

```go
type Singer interface {
	Sing()
}
```

有一个结构体：`type Bird struct {}`

只要给该结构体加一个方法就可以实现该接口：

```go
func (b Bird) Sing() {
	fmt.Println("汪汪汪")
}
```

> 一个接口类型的变量能够存储**所有**实现了该接口的类型变量。

注意：

- 一个类型能实现多个不同的接口

- 也可以多个类型实现一个接口（这个指的是一个结构体以及其嵌套的子结构体一起实现）

  ```go
  type RW interface {
  	Read()
  	Write()
  }
  
  type A struct{}
  func (A) Read() {}
  
  type B struct{}
  func (B) Write() {}
  
  type C struct {
  	A
  	B
  }
  ```



#### 接口的意义

让代码面向行为编程，而不是面向具体类型编程，一套类似的逻辑可以用一个统一的方法去处理。在实际开发中，很多场景并不关心对象的具体类型，而只关心它是否具备某种能力。

比如在<u>电商系统</u>中，用户可以选择<u>支付宝</u>、<u>微信</u>、<u>银联</u>等不同支付方式，但交易流程本身并不需要区分具体用的是哪一种，只要该方式能够提供 `Pay` 方法完成支付即可。

接口的意义就在于此：它把<u>不同的具体实现</u>统一抽象为**相同的行为**，使代码能够面向能力编程，而不是面向具体类型编程。

#### 值接收和指针接收

值接收者实现接口：值和指针**都**可以实现接口
指针接收者实现接口：**只有指针**可以实现接口（值不行）

原理：接口匹配的是“方法集合”：

> 方法集合：某个类型，按 Go 的规则，真正算拥有的方法有哪些。

值类型 `T`只拥有：
```
func (t T) xxx()
```

指针类型 `*T`拥有：

```
func (t T) xxx()
func (t *T) xxx()
```

如果是值接收者，T和*T都有对应的方法，所以都满足；

如果是指针接收者，只有*T有；



#### 接口组合

##### 接口和接口组合

把多个接口“拼在一起”，形成一个更大的接口

```go
type ReadWriter interface {
    Reader
    Writer
}
```

##### 接口和结构体组合

把接口当字段放进结构体，让结构体“继承”接口能力，举例：

```go
type Interface interface {
    Len() int
    Less(i, j int) bool
    Swap(i, j int)
}

type reverse struct {
    Interface
}
```

`reverse` 会自动拥有`Len()`、`Less()`、`Swap()`，因为这些方法来自它内部的 `Interface`

**优点**：可以实现特定方法的重写。

>  结构体嵌入接口 = 默认复用 + 局部重写



#### 空接口

空接口是指没有定义任何方法的接口类型。

任何类型都可以视为实现了空接口。因为这个特性，空接口类型的变量可以存储任意类型的值。

通常在使用空接口类型直接使用`interface{}`：`var x interface{}  // 声明一个空接口类型变量x`

##### 应用

1. 空接口作为函数的参数，使用空接口实现可以接收任意类型的函数参数。

   ```go
   func show(a interface{}) {
   	fmt.Printf("type:%T value:%v\n", a, a)
   }
   ```

2. 空接口作为map的值

   ```go
   // 空接口作为map值
   var studentInfo = make(map[string]interface{})
   studentInfo["name"] = "沙河娜扎"
   studentInfo["age"] = 18
   studentInfo["married"] = false
   fmt.Println(studentInfo)
   ```

   

#### 类型断言

一个接口值，本质包含两部分：

1. **动态类型**（里面实际是什么类型，比如 `*Dog`）
2. **动态值**（具体数据，比如 `{Name: "旺财"}`）

##### 两种写法

1. 安全写法

```
v, ok := x.(*Dog)
```

- `v`：转换后的值
- `ok`：是否成功

2. 不安全写法

```
v := x.(*Dog)
```

如果不是 `*Dog`，直接崩：

```
panic: interface conversion: xxx is not *Dog
```

> 类型断言本质是从“接口类型”拿回“具体类型”

**提前发现**：var _ 接口 = 类型 是一种编译期断言，用来保证某个类型确实实现了该接口。



### error接口

go语言中，error是一种类型，更强调判断错误和处理错误。

Go 语言中使用一个名为 `error` 接口来表示错误类型。

```go
type error interface {
    Error() string
}
```

该接口只包含一个方法`Error()`，返回描述错误信息的字符串。

#### 默认值和判断

由于error是一个接口，默认值是nil，所以一般把error和nil对比从而判断是否有error。

#### 创建错误

我们可以用errors包自定义的`New`函数创建一个错误，例：

```go
func queryById(id int64) (*Info, error) {
	if id <= 0 {
		return nil, errors.New("无效的id")
	}

	// ...
}
```

#### `fmt.Errorf`

当我们需要传入格式化的错误描述信息时，可以使用`fmt.Errorf`。

```go
func GetUser() error {
	err := errors.New("数据库连接超时")
	if err != nil {
		return fmt.Errorf("查询数据库失败，err:%v", err)
	}
	return nil
}
```

但是上面的方式会丢失原有的错误类型，只拿到错误描述的文本信息。

为了**不丢失**函数调用的错误链，使用`fmt.Errorf`时搭配使用特殊的格式化动词`%w`，可以实现基于已有错误包装得到一个新的错误。

```go
fmt.Errorf("查询数据库失败，err:%w", err)
```

对于这种二次包装的错误，`errors`包中提供了以下三个方法。

```go
func Unwrap(err error) error                 // 获得err包含下一层错误
func Is(err, target error) bool              // 判断err是否包含target
func As(err error, target interface{}) bool  // 判断err是否为target类型
```



### 反射

go的变量分为两部分，类型信息和值信息；反射指的是程序在编译期间把变量的信息比如字段名，类型信息等整合到可执行文件中，并提供接口，使得程序运行期间能访问和修改这些信息。

例如：go可以用反射去获取空接口的类型。

在Go语言中反射的相关功能由内置的reflect包提供，任意接口值在反射中都可以理解为由`reflect.Type`和`reflect.Value`两部分组成，并且reflect包提供了`reflect.TypeOf`和`reflect.ValueOf`两个函数来获取任意对象的Value和Type。

#### 取类型

- `reflect.TypeOf`：可以获得任意值的类型对象。

在反射中，类型分为 **Type** 和 **Kind**。`Type` 指具体类型，包括用户自定义类型；`Kind` 指底层类别，用来表示它属于哪一大类，例如指针、结构体、整数等。由于 Go 可以通过 `type` 定义很多新类型，所以多个不同的 `Type` 可能对应同一种 `Kind`。例如，两个自定义结构体的 `Type` 不同，但它们的 `Kind` 都是 `struct`；两个不同的指针类型，`Type` 不同，但 `Kind` 都是 `ptr`。

例如：

```go
func reflectType(x interface{}) {
	t := reflect.TypeOf(x)
	fmt.Printf("type:%v kind:%v\n", t.Name(), t.Kind())
}

func main() {
	var a *float32 // 指针
	reflectType(a) // type: kind:ptr
}
```

`Name()` → 具体类型叫什么

`Kind()` → 它底层属于哪一类

> Go语言的反射中像数组、切片、Map、指针等类型的变量，它们的`.Name()`都是返回`空`。

#### 取值

- `reflect.ValueOf()`：返回`reflect.Value`类型，包含了原始值的值信息。`reflect.Value`与原始值之间可以互相转换，例如：

```go
func reflectValue(x interface{}) {
	v := reflect.ValueOf(x)

	switch v.Kind() {
	case reflect.Int64:
		fmt.Println("int64:", v.Int())
	case reflect.Float32, reflect.Float64:
		fmt.Println("float:", v.Float())
	}
}

func main() {
	var a float32 = 3.14
	var b int64 = 100

	reflectValue(a)
	reflectValue(b)
}
```



#### 设置值

反射修改值时，必须传入变量地址。因为函数参数默认是值拷贝，直接反射拿到的是副本，不能修改原变量；只有**传指针**，再用 `Elem()` 取到指针指向的值，才能修改成功。

```
func setValue(x interface{}) {
	v := reflect.ValueOf(x)
	if v.Elem().Kind() == reflect.Int64 {
		v.Elem().SetInt(200)
	}
}

func main() {
	var a int64 = 100
	setValue(&a)
	fmt.Println(a) // 200
}
```



#### `IsNil()` 和 `IsValid()` 的区别

**`IsNil()`**：判断“值是不是 `nil`”
 只能用于这些类型：**指针、接口、切片、map、chan、func**，否则会 `panic`。

**`IsValid()`**：判断“这个反射值存不存在、是否有效”
 常用于判断查找结果是否找到。若是无效值，除了 `IsValid`、`Kind`、`String` 外，调用其他方法基本都会 `panic`。

```go
func main() {
	var p *int
	fmt.Println(reflect.ValueOf(p).IsNil())   // true
	fmt.Println(reflect.ValueOf(nil).IsValid()) // false

	m := map[string]int{}
	v := reflect.ValueOf(m).MapIndex(reflect.ValueOf("x"))
	fmt.Println(v.IsValid()) // false
}
```



#### 反射缺点

1. 反射中的类型错误会在运行的时候才会引发panic，很可能是在代码写完很久之后。
2. 大量用反射的代码难以理解。
3. 反射的性能低下，比正常代码运行速度慢。
