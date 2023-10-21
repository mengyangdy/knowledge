---
title: TS语法学习
tags:
  - ts
date: 2023-10-20
cover: https://s2.loli.net/2023/10/21/XA9FB26YNQDdkol.jpg
---

# TS语法学习

## TS 运行环境

- TS 最终会被编译成 JS 来运行，所以我们需要搭建对应的环境
  - 我们需要在电脑上安装 TypeScript，这样就可以通过 TS 的 Compiler 将其编译成 JS

![Snipaste_2023-10-21_09-37-17.png](https://s2.loli.net/2023/10/21/jras4UQkmWyFTV9.png)

- 所以我们需要先可以进行全局的安装

```shell
# 安装命令
npm install typescript -g
# 查看版本
tsc --version
```

- 如果我们每次为了查看 TypeScript 代码的运行效果，都通过两个步骤来完成的话就太繁琐了：
  - 第一步：通过 tsc 编译 TypeScript 代码到 Javascript 代码
  - 第二部：在浏览器或者 Node 环境下运行 JavaScript 代码
- 是否可以简化这样的步骤：
  - 比如编写了 TypeScript 之后可以直接运行在浏览器中
  - 比如编写了 TypeScript 之后，直接通过 node 的命令来执行
- 上面我提到的两种方式，可以通过两个解决方案来完成
  - 方式一：通过 webpack，配置本地的 TypeScript 编译环境和开启一个本地服务，可以直接运行在浏览器上
  - 方式二：通过 ts-node 库，为 TypeScript 的运行提供执行环境
- 方式一：webpack 配置：
  - 查看代码模板
- 方式二：安装 ts-node
  - `npm install ts-node -g`
- 另外 ts-node 需要依赖 tslib 和@types/node 两个包
  - `npm install tslib @types/node -g`
- 现在，我们可以直接通过 ts-node 来运行 TypeScript 的代码
  - `ts-node main.ts`

## TS 变量声明

- 在 TypeScript 中定义变量需要制定标识符的类型
- 所以完整的声明格式如下：
  - 声明了类型后 TypeScript 就会进行类型检测，声明的类型可以称之为类型注解（Type Annotation）
    - `var/let/const 标识符：数据类型 = 赋值`
- 比如我们声明了一个 message，完整的写法如下
  - 注意：这里的 string 是小写的，和 String 是有区别的
  - string 是 typeScript 中定义的字符串类型，String 是 ECMAScript 中定义的一个类
    - `let message:string='hello'`
  - 如果我们给 message 赋值其他类型的值，那么就会报错
    - Type 'number' is not assignable to type string

### 声明变量的关键字

- 在 TypeScript 定义变量（标识符）和 ES 6 之后一致，可以使用 var、let、const 来定义
- 在 tslint 中并不推荐使用 var 来声明变量
  - 可见，在 TypeScript 中并不建议在使用 var 关键字了，主要原因和 ES 6 升级后 let 和 var 的区别是一样的，var 是没有块级作用域的

### 变量的类型推导（推断）

- 在开发中，有时候为了方便起见我们并不会在声明每一个变量时都写上对应的数据类型，我们更希望可以通过 TypeScript 本身的特性帮助我们推断出对应的变量类型
- 如果我们给 message 赋值 123
- 他是有类型的，因为在一个变量第一次赋值时，会根据后面的赋值内容的类型，来推断出变量的类型
  - message 就是因为后面赋值的是一个 number 类型，所以 message 虽然没有明确的说明，但是依然是一个 string 类型

## TS 数据类型

- 我们经常说 TypeScript 是 JavaScript 的一个超集

![图片.png](https://s2.loli.net/2023/10/21/J8A5XFNCmvDtjpL.png)

### JavaScript 类型-number 类型

- 数字类型是我们开发中经常使用的类型，typeScript 和 JavaScript 一样，不区分证书类型（int）和浮点型（double），统一为 number 类型

```js
let num = 100
num = 20
num = 6.66
```

- 学习过 ES 6 的应该知道，ES 6 新增了二进制和八进制的表示方法，而 TypeSCRIPT 也是支持二进制、八进制、十六进制的表示

```js
num = 100 //十进制
num = 0b110 //二进制
num = 0o555 //八进制
num = 0xf23 //十六进制
```

### JavaScript 类型-boolean 类型

- boolean 类型只有两个取值：true 和 false 非常简单

```js
let flag:boolean=true
flag=false
flag=20>30
```

### JavaScript 类型-string 类型

- string 类型是字符串类型，可以使用单引号或者双引号表示

```js
let message:string='hello'
message='hello world'
```

- 同时也支持 es 6 的模板字符串来拼接变量和字符串

```js
const name = 'why'
const age = 18
const height = 1
const info = `my name is ${name}, age is ${age},height is ${height}`
```

### JavaScript 类型-Array 类型

- 数组类型的定义也非常简单，有两种方法：
  - ` Array<string>` 事实上是一种泛型的写法

```ts
coinst names:string[]=['a','b','c']
const names2:Array<string>=['a','b','c']
names.push('d')
names.push('d')
```

- 如果添加其他类型到数组中，那么会报错：
  - Argument of type number is not assignable to parameter of type names 2.push(string)

### JavaScript 类型-Object 类型

- object 对象类型可以用于描述一个对象

```js
const myInfo:object={
	name:'qq',
	age:1,
	height:1
}
```

- 但是从 myInfo 中我们不能获取数据，也不能设置数据

```ts
myInfo['name'] = 'abc'
console.log(myInfo['name'])
//element implicitly has an any type because expression of type name cant be used to index type {}
```

### JavaScript 类型-Symbol 类型

- 在 ES 5 中，我们是不可以在对象中添加相同属性名的：

```js
const person = {
  inentity: 'c',
  inentity: 'a' //报错
}
```

- 通常我们的做法是定义两个不同的属性名字：name 1 和 name2
- 但是我们也可以通过 symbol 来定义相同的名称，因为 Symbol 函数返回的是不同的值

```ts
const s1: symbol = Symbol('name')
const s2: symbol = Symbol('name')
const person = {
  [s1]: 'a',
  [s2]: 'b'
}
```

### JavaScript 类型-null 和 undefined 类型

- 在 JavaScript 中，undefined 和 unll 是两个基本数据类型
- 在 typeScript 中，他们各自的类型也是 undefined 和 null，也就意味着它们即是实际的值，也是自己的类型

```js
let n:null=null
let u:undefined=undefined
```

### 函数的参数类型

- 函数是 JavaScript 非常重要的组成部分，typeScript 允许我们制定函数的参数和返回值的类型
- 参数的类型注解：
  - 生命函数时，可以在每个参数后添加类型注解，以声明函数接受的参数类型

```js
function greet(name:string){
	console.log("Hello"+name.toUpperCase()
)

//Argument of type'number not assignable to parameter of type 'string'
greet(123)

//Expected 1 arguments,but got 2.ts(2554)
greet("abc","cba")
```

### 函数的返回值类型

- 我们也可以添加返回值的类型注解，这个注解出现在函数列表的后面

```ts
function sum(num1:number.num2:number):number{
	return num1+num2
}
```

- 和变量的类型注解一样，我们通常情况下不需要返回类型注解，因为 typeScript 会根据 return 返回值推断函数的返回类型：
  - 某些第三方库为了方便理解，会明确的制定返回类型

### 匿名函数的参数

- 匿名函数与函数声明会有一些不同
  - 当一个函数出现在 typeScript 可以确定该函数会被如何调用的地方时
  - 该函数的参数会自动指定类型

```js
const names = ['a', 'b', 'c']
names.forEach(item => {
  console.log(item.toUpperCase())
})
```

- 我们并没有指定 item 的类型，但是 itemU 是一个 string 类型
  - 这是因为 typeScript 会根据 forEach 函数的类型以及数组的类型推断出 item 的类型
  - 这个过程称之为上下文类型（contextual typing），因为函数执行的上下文可以帮助群定参数和返回值的类型

### 对象类型

- 如果我们希望限定一个函数接受的参数是一个对象类型，这个时候要如何限定呢？
  - 我们可以使用对象类型

```js
function printCoordinate(point:{x:number,y:number}){
	console.log('x坐标'，point.x)
	console.log('y坐标'，point.y)
}
printCoordinate({x:10.y:11})
```

- 在这里我们使用了一个对象来作为类型：
  - 在对象里我们可以添加属性，并且告知 typeScript 该属性需要什么类型
  - 属性之间可以使用，或者；来分隔，最后一个分隔符是可选的
  - 每个属性的类型部分也是可选的，如果不指定，那么就是 any 类型

### 可选类型

- 对象类型也可以制定那些属性是可选的，可以在属性的后面添加一个?:

```js
function printCoordinate(point:{x:number,y:number,z?:number}){
	console.log("x坐标：",point.x)
	console.log("y坐标：",point.y)
	if(point.z){
		console.log("z坐标：",point.z)
	}
}
printCoordinate({x:10,y:30})
printCoordinate({x:20,y:30,z:40})
```

### typeScript 类型-any 类型

- 在某些情况下，我们确实无法确定一个变量的类型，并且可能它会发生一些变化，这个时候我们可以使用 any 类型（类似与 Dart 语言中的 dynamic 类型）
- any 类型有点像一种讨巧的 typeScript 手段
  - 我们可以对 any 类型的变量进行任何的操作，包括获取不存在的属性、方法
  - 我们给一个 any 类型的变量赋值任何的值，比如数字、字符串的值

```js
let a:any='why'
a=123
a=true
const aArray:any[]=['a',1,2]
```

- 如果对于某些情况的处理过于繁琐不希望添加规定的类型注解，或者在引入一些第三方库时，缺少了类型注解，这个时候我们可以使用 any
  - 包括在 Vue 源码中，也会使用到 any 来进行某些类型的适配

### typeScript 类型-unknown 类型

- unknown 是 typeScript 中比较特殊的一种类型，它用于描述类型不确定的变量
  - 和 any 类型有些类似，但是 unknown 类型的值上做任何事情都是不合法的

```js
let str:unknown='hello'
console.log(str.length)
```

### typeScript 类型-void 类型

- void 通常用来指定一个函数是没有返回值的，那么他的返回值就是 void 类型

```ts
function sum(num1:number.num2:number){
	console.log(num1+num2)
}
```

- 这个函数我们没有写任何类型，那么它默认返回值的类型就是 void 的，我们也可以显示的来指定返回值是 void：

```ts
function sum(num1:number.num2:number):void{
	console.log(num1+num2)
}
```

- 这里还有一个注意事项：
  - 我们可以将 undefined 赋值给 void 类型，也就是函数可以返回 undefined
- 当基于上下文的类型推导（Contextual Typing）推导出返回类型为 void 的时候，并不会强制函数一定不能返回内容

```js
type FnType=()=>void
const foo:FnType=()=>{
	return 123
}

const names=['a','b','c']
names.forEach(item=>item.length)
```

### typeScript 类型-never 类型

- never 表示永远不会发生值的类型，比如一个函数：
  - 如果一个函数中是一个死循环或者抛出一个异常，那么这个函数会返回东西吗？
  - 不会，那么写 void 类型或者其他类型作为返回值类型都不合适，我们就可以使用 never 类型

```ts
function loopFun():never {
	while(true){
		console.log("123")
	}
}

function loopErr():never {
	throw new Error()
}
function handleMessage(message:number|string){
	switch(typeof message){
		case 'string':
			console.log('foo')
			break
		case 'number‘：
			consoel.log('bar')
			break
		default:
			const check:never=message
	}
}
```

### typeScript 类型-tuple 类型

- tuple 是元组类型，很多语言也有这种数据类型，比如 Python、Swift 等等

```js
const tInfo:[string,number,number]=['a',1,1]
const item1=tInfo[0]//item1是string类型的
```

- 那么 tuple 和数组有什么区别呢？
  - 首先，数组中通常建议存放相同类型的元素，不同类型的元素是不推荐放在数组中（可以放在对象或者元组中）
  - 其次，元组中每个元素都有自己特定的类型，根据索引值获取到的值可以确定对应的类型

```ts
const info: (string | number)[] = ['a', 1, 1]
const item1 = info[0] //不能确定item1的类型
```

- 那么 tuple 在什么地方使用的是最多的呢？
  - tuple 通常可以作为返回的值，在使用的时候非常的方便

```js
function useState<T>(state:T):[T,(newState:T)=>void]{
	let currentState=state
	const changeState=(enewState:T)=>{
		currentState=newState
	}
	return [currentState,changeState]
	const [counter,setCounter]=useState(10)
}
```

## TS 语法细节

### 联合类型

- typeScript 的类型系统允许我们使用多种运算符，从现有类型中构建新类型
- 我们来使用第一种组合类型的方法：联合类型（Union Type）
  - 联合类型是由两个或者多个其他类型组成的类型
  - 表示可以是这些类型中的一个值
  - 联合类型中的每一个类型被称之为联合组员（unions members）

```js
function printId(id:number|string){
	console.log('你的id是',id)
}
printId(10)
printId('abc')
```

### 使用联合类型

- 传入给一个联合类型的值是非常简单的：只要保证是联合类型中的某一个类型的值即可
  - 但是我们拿到这个值以后，我们应该如何使用它呢？因为它可能是任何一种类型
  - 比如我们拿到的值可能是 string 或者 number，我们就不能对其调用 string 上的一些方法
- 那么我们怎么处理这样的问题呢?
  - 我们需要使用缩小（narrow）联合
  - typeScript 可以根据我们缩小的代码结构，推断出更加具体的类型

```ts
function printId(id:numberl string){
if(typeof id ==='string'){
	//确定id是string类型
	console.log("你的id是：",id.toUpperCase())
}else {
	//确定id是number类型
	console.log("你的id是",id)
	}
}
```

### 类型别名

- 在前面，我们通过在类型注解中编写对象类型和联合类型，但是当我们想要多次在其他地方使用时，就要编写多次
- 比如我们可以给对象类型起一个别名

```ts
type Point = {
  x: number
  y: number
}
function printPoint(point: Point) {
  console.log(point.x, point.y)
}
function sumPoint(point: Point) {
  console.log(point.x, point.y)
}
printPoint({ x: 10, y: 10 })
sumPoint({ x: 20, x: 30 })

type ID = string | number
function printId(id: ID) {
  console.log('您的id', id)
}
```

### 接口的声明

- 在前面我们通过 type 可以用来声明一个对象类型

```ts
type Point{
x:number
y:number
}
```

- 对象的另外一种声明方式就是通过接口来声明：

```ts
interface Point {
  x: number
  y: number
}
```

- 那么他们有什么区别呢？
  - 类型别名和接口非常类似，在定义对象类型时，大部分情况下，都可以选择任意使用
  - 接口的几乎所有特性都可以在 type 中使用

### interface 和 type 的区别

- 我们会发现 interface 和 typeScript 都可以用来定义对象类型，那么在开发中定义对象类型时，到底选择哪一个呢？
  - 如果是定义非对象类型，通常推荐使用 type，比如 Direction、Alignment、一些 Function
- 如果是定义对象类型，那么他们是有区别的：
  - interface 可以重复的对某个接口来定义属性和方法
  - 而 type 定义的是别名，别名是不能重复的

```ts
interface IPerson {
  name: string
  running: () => void
}
interface IPerson {
  age: number
}

type Person = {
  name: string
}
type Person = {
  //报错
  age: number
}
```

### 交叉类型

- 前面我们学习了联合类型
  - 联合类型表示多个类型中的一个即可
  - `type Alignment='left' | 'right'`
- 还有另外一种类型合并，就是交叉类型（Intersection Types）：
  - 交叉类型表示需要满足多个类型的条件
  - 交叉类型使用&符号
- 我们来看下面的交叉类型
  - 表达的含义是 number 和 string 要同时满足
  - 但是有同时满足是 number 和 string 的值，其实是没有的，所以这个值是一个 never 类型的
  - `type MyType=number & string`

### 交叉类型的应用

- 所以在开发中，我们进行交叉时，通常是对对象类型进行交叉的

```ts
interface ColorFul {
  color: string
}
interface IRun {
  running: () => void
}
type NewType = ColorFul & IRun
const obj: NewType = {
  color: 'red',
  running: function () {}
}
```

### 类型断言 as

- 有时候 typeScript 无法获取具体的类型信息，这个我们需要使用类型断言（Type Assertions）
  - 比如我们通过 document.getElementById,typeScript 只知道该函数会返回 HTMLElement，但是并不知道他具体的类型

```ts
const myEl = documnet.getElementById('my-img') as HTMLImageElement
myEl.src = '图片地址'
```

- typeScript 只允许类型断言转化为更具体或者不太具体的类型版本，此规则可防止不可能的强制转换

### 非空类型断言!

- 当我们编写下面的代码时，在执行 ts 的编译阶段会报错
  - 这是因为传入的 message 有可能是为 undefined 的，这个时候是不能执行方法的

```ts
function printMessage(message?: string) {
  //error TS2532:Object is possible undefined
  console.log(message.toUpperCase())
}
```

- 但是，我们确定传入的参数是有值的，这个时候我们可以使用非空类型断言：
  - 非空类型断言使用的是!,表示可以确定某个标识符是有值的，跳过 ts 在编译阶段对他的检测

```ts
function printMessage(message?: string) {
  //error TS2532:Object is possible undefined
  console.log(message!.toUpperCase())
}
```

### 字面量类型

- 除了前面我们所讲过的类型之外，也可以使用字面量类型（Literal types）：

```ts
let message: 'left' | 'center'
```

- 那么这样做有什么意义呢？
  - 默认情况下这么做是有没太大的意义的，但是我们可以将多个联合类型在一起

```ts
type Alignment = 'left' | 'center'
function changeAlign(align: Alignment) {
  console.log('修改方向', align)
}
changeAlign('left')
```

### 字面量推理

- 我们来看下面的代码：

```ts
const info = {
  url: 'https://coderwhy.org/abc',
  method: 'get'
}
function request(url: string, method: 'get' | 'post') {
  console.log(url, method)
}
request(info.url, info.method) //报错info.method
```

- 这是因为我们的对象字面量推理的时候，info 其实是一个{url:string,method:string}，我以我们没法将一个 string 赋值给一个字面量类型

```ts
//方式一
request(info.url, info.method as 'get')

const info = {
  url: 'https://coderwhy.org/abc',
  method: 'get'
} as const
```

### 类型缩小

- 什么是类型缩小呢？
  - 类型缩小的英文是 Type Narrowing(也有人翻译成类型收窄)
  - 我们可以通过类型与 typeof padding === 'number'
  - 在给定的执行路径中，我们可以缩小比声明时更小的类型，这个过程称之为缩小（Narrowing）
  - 而我们编写的 typeof padding === ‘number’可以称之为类型保护（type guards）
- 创建的类型保护有如下几种：
  - typeof
  - 平等缩小（比如三个等号）
  - instanceof
  - in

### typeof

- 在 typeScript 中，检查返回的值 typeof 是一种类型保护
  - 因为 typeScript 对如何 typeof 操作不同的值进行编码

```ts
type Id = number | string
function printId(id: ID) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase)
  } else {
    console.log(id)
  }
}
```

### 平等缩小

- 我们可以使用 switch 或者相等的一些运算符来表达相等性（比如=== !== == and !=）

```ts
type Direction = 'left' | 'right'

function turDirection(direction: Direction) {
  switch (direction) {
    case 'left':
      console.log('调用left方法')
      break
    case 'right':
      console.log('right')
      break
    default:
      console.log('默认')
  }
}
```

### instanceof

- javascript 由一个运算符来检查一个值是否是另一个值的实例

```ts
function printValue(date: Date | string) {
  if (date instanceof Date) {
    console.log(date.toLocaleString())
  } else {
    console.log(date)
  }
}
```

### in 操作符

- JavaScript 有一个运算符，用于确定对象是否具有带名称的属性：in 运算符
  - 如果指定的属性在指定的对象或者其原型中，则 in 运算符返回 true

```ts
type Fish = { swim: () => void }
type Dog = { run: () => void }
function move(animal: Fish | Dog) {
  if ('swim' in animal) {
    animal.swim()
  } else {
    animal.run()
  }
}
```

### typeScript 函数类型

- 在 JavaScript 开发中，函数是重要的组成部分，并且函数可以作为一个一等公民（可以作为参数，也可以作为返回值进行传递）
- 那么在使用函数的过程中，函数是否也可以有自己的类型呢？
- 我们可以编写函数类型的表达式（Function Type Expressions）来表达函数类型

```ts
type CalcFunc = (num1: number, num2: number) => void

function calc(fn: CalcFunc) {
  console.log(fn(20, 30))
}

function sum(num1: number, num2: number) {
  return num1 + num2
}
function mul(num1: number, num2: number) {
  return num1 + num2
}
calc(sum)
calc(mul)
```

### typeScript 函数类型解析

- 在上面的语法中（num 1:number,num 2:number）=>void，代表的就是一个函数类型
  - 接受两个参数的函数：num 1 和 num 2 并且都是 number 类型
  - 并且这个函数是没有返回值的，所以是 void
- 注意：在某些语言中，可能参数名称 num 1 和 num 2 是可以省略买剧场 typeScript 是不可以的

![图片.png](https://s2.loli.net/2023/10/21/q8RQZxDYeckKBEg.png)

### 调用签名（call Signatures）

- 在 JavaScript 中，函数除了可以被调用，自己也是可以有属性值的
  - 然而前面讲到的喊护士类型表达式并不能支持声明属性
  - 如果我们想描述一个带有属性的函数，我们可以在一个对象类型中写一个调用签名

```ts
interface ICalcFn {
  name: string
  (num1: number, num2: number): void
}
function calc(calcFn: ICalcFn) {
  console.log(calcFn.name)
  calcFn(10, 20)
}
```

- 注意这个语法跟函数表达式稍有不同，在参数列表和返回的类型之间用的是：而不是=>

### 构造签名（Construct Signatures）

- JavaScript 函数也可以使用 new 操作符调用，当被调用的时候，typeScript 会认为这是一个构造函数（constructors）因为他们会产生一个新对象
  - 你可以写一个构造签名（Construct Signatures），方法是在调用签名前面加一个 new 关键字

```ts
interface IPerson {
  new (name: string): Person
}
function tactory(ctor: IPerson) {
  return new ctor('why')
}

class Person {
  name: string
  constructor(name: string) {
    this.name = name
  }
}
factory(Person)
```

### 参数的可选类型

- 我们可以指定某个参数是可选的

```ts
function foo(x: number, y?: number) {
  console.log(x, y)
}
```

- 这个时候这个参数 Y 依然是有类型的，他是什么类型的呢？number|undefined
- 另外可选类型需要在必传参数的后面

### 默认参数

- 从 ES 6 开始，JS 是支持默认参数的，TS 也是支持默认参数的

```ts
function foo(x: number, y: number) {
  console.log(x, y)
}
foo(10)
```

- 这个时候 y 的类型其实是 undefined 和 number 类型的联合

### 剩余参数

- 从 es 6 开始，JS 也支持剩余参数，剩余参数语法允许我们将一个不定数量的参数放到一个数组中

```ts
function sum(...nums: number[]) {
  let total = 0
  for (const num of nums) {
    total += num
  }
  return total
}

const result1 = sum(10, 20, 30)
const result2 = sum(10, 20, 30, 40)
```

### 函数的重载

- 在 TS 中，如果我们编写了一个 add 函数，希望可以对字符串和数字类型进行相加，应该如何编写呢？
- 在 TS 中，我们可以去编写不同的重载签名（overload signatures）来表示函数可以以不同的方式进行调用
- 一般是编写两个或者以上的重载签名，再去编写一个通用的函数以及实现
- 比如我们对 sum 函数进行重构：
  - 在我调用 sum 的时候，它会根据我们传入的参数类型来决定函数体，到底执行哪一个函数的重载签名：

```ts
function sum(a1: number, a2: number): number
function sum(a1: string, a2: string): string
function sum(a1: any, a2: any) {
  return a1 + a2
}
```

- 但是注意，有实现体的函数是不能直接被调用的

### 联合类型和重载

- 我们现在有一个需求：定义一个函数，可以传入字符串或者数组，获取他们的长度
- 这里有两种实现方案
  - 方案一：使用联合类型来实现
  - 方案二：使用函数重载来实现

```ts
function getLength(a: string | any[]) {
  return a.length
}

function getLength(a: string): number
function getLength(a: any[]): number
function getLength(a: any) {
  return a.length
}
```

- 在开发中我们选择使用哪一种呢？
  - 在可能得情况下，尽量选择使用联合类型来实现

### 可推导的 this 类型

- this 是 JavaScript 中一个比较难以理解的知识点：
- 目前的开发中已经很少见到了：
  - Vue 3 的 Composition API 中很少使用到 this，Reatc 的 hooks 开发中也很少见到了
- 但是我们还是简单掌握一些 TS 中的 this：

```ts
const obj = {
  name: 'obj',
  foo: function () {
    console.log(this.name)
  }
}
obj.foo()
```

```ts
function foo1() {
  console.log(this)
}
foo1()
```

- 上面的代码默认情况下是可以正常运行的，也就是 typeScript 在编译时，认为我们的 this 是可以正确去使用的
  - 这是因为在没有指定 this 的情况下，this 默认情况下是 any 类型的

### this 的编译选项

- VSCode 在检测我们的 typeScript 代码时，默认情况下运行不确定的 this 安按照 any 类型去使用
  - 但是我们可以创建一个 tsconfig.json 文件，并且在其中告知 VSCode 对 this 必须明确执行（不能是隐式的）

```json
//tsconfig.json
"noImplicitThis":true
```

- 在设置了 noImplicitThis 为 true 时，typeScript 会根据上下文推导 this，但是在不能正确推导时，就会报错，需要我们明确指定 this

### 指定 this 的类型

- 在开始 noImplicitThis 的情况下，我们必须指定 this 的类型
- 如何指定呢？函数的第一个参数类型
  - 函数的第一个参数我们可以根据该函数之后被调用的情况，用于声明 this 的类型（名词必须叫 this）
  - 在后续调用函数传入参数时，从第二个参数开始传递的，this 参数会在编译后被抹除

```ts
function foo1(this: { name: string }) {
  console.log(this)
}
foo1.call({ name: 'why' })
```

### this 相关的内置工具

- typeScript 提供了一些工具类型来辅助进行常见的类型转换，这些类型全局可用
- ThisParameterType
  - 用于提取一个函数类型 Type 的 this(opens new window)参数类型
  - 如果这个函数类型没有 this 参数返回 unknown

```ts
function foo(this:{name::string}{
	console.log(this.name)
}
//获取一个函数中this的类型
type ThisType=ThisParameterType<typeof foo>
```

- OmitThisParameter
  - 用于移除一个函数类型 Type 的 this 参数类型，并且返回当前的函数类型

```ts
//用于移除一个函数类型Type的this参数类型，并且返回当前的函数类型
type FnType = OmitThisParameter<typeof foo>
```

### this 相关的内置工具-ThisType

- 这个类型不返回一个转换过的类型，它被作用于标记一个上下文的 this 类型
  - 事实上官方文档的不管是解释还是案例都没有说明 ThisType 类型的作用
- 这里举个例子：

```ts
interface IState {
  name: string
  age: number
}
interface IData {
  state: IState
  running: () => void
  eating: () => void
}

const info: IData & ThisType<IState> = {
  state: { name: 'a', age: 1 },
  running: function () {
    console.log(this.name)
  },
  eating: function () {}
}
info.running.call(info.state)
```
