# go学习记录——基础

> 记录的定位：复盘，索引，查缺补漏
>
> 学习资料：https://www.liwenzhou.com/

## go语言的优势

1. 多核**并发**原生具有优势，从底层就有支持。
2. go性能好，是**编译型**语言。
3. 语法简单（存疑）。

## go开发前置

### 依赖管理

为什么需要：解决**不同项目**依赖同一个库的**不同版本**的问题

- v1.5：引入vendor，配套工具`godep`

> 好处：可以控制搜索依赖时候的优先级，优先在项目根目录的vendor文件夹寻找

- v1.11：引入go module

#### `go module`

|      命令       |                   介绍                   |
| :-------------: | :--------------------------------------: |
|   go mod init   |      初始化项目依赖，生成go.mod文件      |
| go mod download |          根据go.mod文件下载依赖          |
|   go mod tidy   | 比对项目文件中引入的依赖与go.mod进行比对 |
|  go mod graph   |              输出依赖关系图              |
|   go mod edit   |              编辑go.mod文件              |
|  go mod vendor  |     将项目的所有依赖导出至vendor目录     |
|  go mod verify  |        检验一个依赖包是否被篡改过        |
|   go mod why    |          解释为什么需要某个依赖          |

`go.mod`文件中记录了当前项目中所有依赖包的相关信息，声明依赖的格式如下：

```bash
require module/path v1.2.3
```

其中：

- require：声明依赖的关键字
- module/path：依赖包的引入路径
- v1.2.3：依赖包的版本号。支持以下几种格式：
  - latest：最新版本
  - v1.0.0：详细版本号
  - commit hash：指定某次commit hash



#### 二者区别

Go Modules 是官方推荐的依赖管理方式，通过 go.mod 管理依赖版本并从远程下载；
 vendor 是将依赖源码**拷贝到项目本地**，实现完全离线和可控构建。



### 包

工程化go开发中，go语言的源码是建立在包的基础上的。一一个包是由一个或多个go源码文件组成的，是一种高级的代码复用方案，比如go内置的`fmt`、`os`等。

#### **定义包**

一个包可以理解为存放go文件的文件夹，在第一行标注`package packagename`。

- 包名为`main`的包是程序的入口包，这种包编译之后会得到一个可执行文件。

#### 外部使用&可见性

同一个包内部申明的标识符在同一个命名空间内，在包外使用包内的成员必须要加包的前缀。

go语言通过首字母大小写来控制可见性（public还是private），在包内<u>首字母大写</u>的标识符才是对外可见的，go里面称为可导出性。

#### 引入包

要使用另外一个包需要使用`import`关键字引入这个包，通常放在文件的开头，`package`声明语句的下方。完整的引入声明语句格式如下:

```go
import importname "path/to/package"
```

其中：

- `importname`：引入的包名，通常都省略。默认值为引入包的包名。

- path/to/package：引入包的路径名称，必须使用双引号包裹起来。
- 禁止循环导入包。

> go中不允许引入但是不使用；但是go支持匿名引用:`_`：`import _ "github.com/go-sql-driver/mysql"`，作用是初始化该包内的资源。

#### `init`初始化函数

在每个包里，都可以定义如下函数：

```go
func init(){
  // ...
}
```

这个函数不需要任何参数，不需要主动调用，程序启动的时候会按照声明顺序自动执行。

**执行顺序**：先执行依赖的`init`函数，再执行自己的`init`函数。

> 包级别的变量先于包的`init`函数初始化。





## 开发基础

### 变量&常量

常量：`var 变量名 变量类型`

声明的时候以var开头，类型放在变量后边，也可以批量申明：
```go
var (
    a string
    b int
    c bool
    d float32
)
```

- 有时候可以省略类型，让编译器去推导
- 在使用多重赋值时，如果想要忽略某个值，可以使用`匿名变量`。 匿名变量用一个下划线`_`表示。
- 函数外的每个语句都必须以关键字开始（var、const、func等）
- `:=`不能使用在函数外。
- `_`多用于占位，表示忽略值。

常量：值不变，语法上就是var变成const





### 基本数据类型

1. 整形：

- uint8，uint16，uint32，uint64，int8，int16，int32，in64

- uint，int，uintptr

- 数字字面量

2. 浮点型

- float32，float64

3. 复数

complex64和complex128

```go
var c1 complex64
c1 = 1 + 2i
var c2 complex128
c2 = 2 + 3i
fmt.Println(c1)
fmt.Println(c2)
```

4. bool

默认为false，不许整形强转

5. 字符串

如果是多行字符串，需要用反引号

```go
s1 := `第一行
第二行
第三行
`
fmt.Println(s1)
```

6. byte和rune类型

Go 语言的字符有以下两种：

1. `uint8`类型，或者叫 byte 型，代表一个`ASCII码`字符。
2. `rune`类型，代表一个 `UTF-8字符`。

> 当需要处理中文、日文或者其他复合字符时，则需要用到`rune`类型。`rune`类型实际是一个`int32`。

- 要修改字符串，需要先将其转换成`[]rune`或`[]byte`，完成后再转换为`string`。无论哪种转换，都会重新分配内存，并复制字节数组。

> go**只有**强制类型转换`T(表达式)`



### 运算符

- 算术运算符

- 关系运算符
- 逻辑运算符
- 位运算符
- 赋值运算符



### 流程控制

go的流程控制主要是`if else`和`for`，除此之外还有`switch`和`goto`。

**if**

- 普通写法

```go
func ifDemo1() {
	score := 65
	if score >= 90 {
		fmt.Println("A")
	} else {
		fmt.Println("C")
	}
}
```

- 特殊写法：在if表达式之前添加一个**执行语句**，再根据变量值进行判断

```go
func ifDemo2() {
	if score := 65; score >= 90 {
		fmt.Println("A")
	} else if score > 75 {
		fmt.Println("B")
	} else {
		fmt.Println("C")
	}
}
```

二者区别：普通写法是先定义变量，后面随便用；特殊写法是这个变量只给当前 if 用，用完就销毁。



**for**

go的所有循环都可以用for完成，格式如下：

```go
for 初始语句;条件表达式;结束语句{
    循环体语句
}
```

> for循环的初始语句和结束语句都可以省略

- 无限循环

```go
for {
    循环体语句
}
```

- `for range`循环

可以使用`for range`遍历数组、切片、字符串、map 及通道。 通过`for range`遍历的返回值：

1. 数组、切片、字符串返回索引和值。
2. map返回键和值。
3. 通道（channel）只返回通道内的值。



> `switch` 、`goto `、`break`、`continue`太过简单，不作记录。





### 数组

> 记住数组是**`值类型`**，赋值和传参只会改变副本的值。

数组是元素类型的集合，在go语言中，数组成员可变，但是数组大小不可变。

**数组定义**：`var 数组变量名 [元素数量]T`

数组下标是从`0`开始，最后一个元素下标是：`len-1`，访问越界会panic。

**数组初始化**

- 初始化列表：`var cityArray = [3]string{"北京", "上海", "深圳"} `
- 初始化自行推断长度：`var cityArray = [**...**]string{"北京", "上海", "深圳"}`

**数组遍历**

```go
var a = [...]string{"北京", "上海", "深圳"}
// 方法1：for循环遍历
for i := 0; i < len(a); i++ {
	fmt.Println(a[i])
}

// 方法2：for range遍历
for index, value := range a {
	fmt.Println(index, value)
}
```



### 切片

数组有自己的局限性：

1. 长度固定
2. 长度是类型的一部分

**切片**：具有**相同元素**类型的**可变长**序列。切片是**引用类型**，一般用于快速操作一块数据集合。

**切片声明**：`var name []T`

```GO
var a []string              //声明一个字符串切片
var b = []int{}             //声明一个整型切片并初始化
var c = []bool{false, true} //声明一个布尔切片并初始化
var d = []bool{false, true} //声明一个布尔切片并初始化
```

切片长度和容量：`len()`可以求长度，`cap()`可以求容量（从切片起始位置到**底层数组末尾**的总空间）

> 对切片再切片，high的上限是切片的容量。

**切片表达式**

- 简单切片表达式：`s := a[1:3]  // s := a[low:high]`，左闭右开
- 完整切片表达式：`a[low : high : max]`，和简单切片相比，`len`相同，但是`cap`是`max-low`，完整切片表达式只有`low`可以省略。
- 使用`make()`函数构造切片：`make([]T, size, cap)`，其中size是元素的数量，cap是切片的容量。

**切片的本质**：对底层数组的封装。切片包含了底层数组的指针，切片的长度以及切片的容量。

<img src="https://imgtu.oss-cn-beijing.aliyuncs.com/blog_img/image-20260408103552205.png" alt="image-20260408103552205" style="zoom:50%;" />

**切片判空**：务必使用`len(s) == 0`而不是`s == nil`，`=nil`说明没有底层数组，这样的数组长度和容量都是0。

**切片修改**：如果两个切片基于一个底层数组，修改其一会影响另一个。

**切片遍历**：同数组。

**`append()`函数**：可以为切片动态添加元素，如果容量不够，会触发切片扩容，此时切片底层指向的数组会换。

**扩容策略**：

| 当前容量（cap）  | 扩容方式     | 新容量计算规则            | 说明                      |
| ---------------- | ------------ | ------------------------- | ------------------------- |
| cap < 1024       | 翻倍扩容     | newCap = 2 × cap          | 小切片快速增长，提高性能  |
| cap ≥ 1024       | 逐步增长     | newCap ≈ 1.25 × cap       | 避免内存浪费              |
| 不足以容纳新元素 | 至少满足需求 | newCap ≥ len + 新增元素数 | append 时优先满足容量需求 |
| 初始切片为空     | 特殊处理     | 从 1 或所需大小开始       | 如 append(nil, x)         |
| 多元素 append    | 按需扩容     | 可能直接跳到更大容量      | 避免多次扩容              |

**copy函数**：`copy(destSlice, srcSlice []T)`，深拷贝切片。

**切片删除元素**：`a = append(a[:index], a[index+1:]...)`



### map

map是一种无序的`k-v`结构，go的map是引用类型，需初始化才可以使用。

**定义**：`map[KeyType]ValueType`

**内存分配**：`make(map[KeyType]ValueType, [cap])`

**基本使用**

```go
scoreMap := make(map[string]int, 8)
scoreMap["张三"] = 90
scoreMap["小明"] = 100
fmt.Println(scoreMap)
fmt.Println(scoreMap["小明"])

// 也支持在声明的时候填充元素
userInfo := map[string]string{
	"username": "沙河小王子",
	"password": "123456",
}
```



**判断某个key存在**

```go
scoreMap := make(map[string]int)
scoreMap["小明"] = 100
// 如果key存在ok为true,v为对应的值；不存在ok为false,v为值类型的零值
v, ok := scoreMap["张三"]
if ok {
	fmt.Println(v)
} else {
	fmt.Println("查无此人")
}
```



**遍历map**：go使用`for range`遍历map

**删除键值对**：`delete(map, key)`

