---
title: TypeScript中的面向对象
tags:
  - ts
date: 2023-10-21
cover: https://s2.loli.net/2023/10/21/qroahvGpzFJACbW.jpg
---

# TypeScript 中的面向对象

## typeScript 类的使用

- 在早起的 JavaScript 就开发中我们需要通过函数和原型链来实现类和继承，从 ES 6 开始，引入了 class 关键字，可以更加方便的定义和使用类
- 他炸 script 作为 JavaScript 的超集，也是支持使用 class 关键字的，并且还可以对类的属性和方法等进行静态类型检测。
- 实际上在 JavaScript 的开发过程中，我们更加习惯于函数式编程
  - 比如 react 开发中，目前更多使用的函数组件以及结合 hook 的开发模式
  - 比如在 vue 3 中，目前也更加提推崇使用 Composition API
- 但是在封装某些业务的时候，类具有更强大的封装性，所以我们也需要掌握他们
- 类的定义我们通常使用 class 关键字：
  - 在面向对象的世界上，任何事物都可以使用类的结构来描述
  - 类中包含特有的属性和方法

### 类的定义

- 我们来定义一个 Person 类
  - 使用 class 然某处来定义一个类
- 我们可以声明类的属性，在类的内部声明类的属性以及对应的类型
- 我们可以声明类的属性：在类的内部声明类的属性以及对应的类型
  - 如果类型没有声明，那么他们默认是 any 的
  - 我们也可以给属性设置初始值
  - 在默认的 strictPropertyInitialization 模式下面我们的属性是必须初始化的，如果没有初始化，那么编译时就会报错
    - 如果我们在 strictPropertyInitialization 模式下确实不希望给属性初始化，可以使用 name!: string 语法
- 类可以有自己的构造函数 constructor，当我们通过 new 关键字创建一个实例时，构造函数会被调用
  - 构造函数不需要返回任何值，默认返回当前创建出来的实例
- 类中可以有自己的函数，定义的函数称之为方法

```js
class Person{
	name!:string
	age:number
	constructor(name:string,age:number){
		this.age=age
	}
	running(){
	console.log(this.name)
	}
	eating(){
		cnsole.log(this.age)
	}
}
```

### 类的继承

- 面向对象的其中一大特性就是继承，继承不仅仅可以减少我们的代码量，也是多态的使用前提
- 我们可以使用 extends 关键字来实现继承，子类中使用 super 来访问父类
- 我们来看一下 Student 类继承自 Person
  - Sudent 类可以有自己的属性和方法，并且会继承 Person 的属性和方法
  - 在构造函数中，我们可以通过 super 来调用 super 来调用父类的构造函数，对父类中的属性进行初始化

```ts
class Student entends Person{
	son:number
	constructor(name:string,age:number,sno:number){
		super(name,age)
		this.sno=sno
	}
	studying(){
		console.log(this,name)
	}
}

eating(){
	console.log('student eating')
}
running(){
	super.running()
	console.log('student running')
}
```

### 类的成员修饰符

- 在 typescript 中，类的属性和方法支持三种修饰符：public/private/protected
  - public 修饰的是在任何地方可见、公有的属性或方法，默认编写的属性就是 public 的
  - private 修饰的是仅在同一类中可见、私有的属性或方法
  - protected 修饰的是仅在类自身以及子类中可见、受保护的属性或方法
- public 是默认的修饰符，也是可以直接访问的，我篇幅这里来演示一下 proteced 和 private

```ts
class Person {
  protected name: string
  constructor(name: string) {
    this.name = name
  }
}

class Student extends Person {
  constrocutr(name: string) {
    super(name)
  }
  running() {
    console.log(this.name)
  }
}
```

```ts
class Person {
  private name: string
  constructor(name: string) {
    this.name = name
  }
}

const p = new Person('why')
console.log(p.name)
//Property name is private and accessible within...
```

### 只读属性 readonly

- 如果有一个属性我们不希望外界可以任意的修改，只希望确定值后直接使用，那么可以使用 readonly

```ts
class Person {
  readonly name: string
  constructor(name: string) {
    this.name = name
  }
}
const p = new Person('why')
console.log(p.name)
//Cannot assign to name becauseit it is a read-only property
```

### getters/setters

- 在前面一些私有属性我们是不能直接访问的，或者某些属性我们想要监听它的获取（getter）和设置（setter）的过程，这个时候我们可以使用存取器

```ts
class Person {
  private _name: string
  set name(newName) {
    this._name = newName
  }
  get name() {
    return this._name
  }
  constructor(name: string) {
    this.name = name
  }
}

const p = new Person('why')
p.name = 'dylan'
console.log(p.name)
```

### 参数属性（Parameter Properties）

- typeScript 提供了特殊的语法，可以把一个构造函数参数转成一个同名同值的类属性
  - 这些就被称之为参数属性（parameter properties）
  - 你可以通过在构造函数参数前添加一个可见性修饰符 public private protected 或者 readonly 来创建参数属性，最后这些类属性字段也会得到这些修饰符

```ts
class Person {
  constructor(
    public name: string,
    private _age: number
  ) {}
  set age(newAge) {
    this._age = newAge
  }
  get age() {
    return this._age
  }
}
```

## typeScript 中的抽象类

### 抽象类 abstract

- 我们知道，继承是多态使用的前提
  - 所以在定义很多通用的调用接口时，我们通常会让调用者传入父类，通过多态来实现更加灵活的调用方式
  - 但是，父类本身可能并不需要对某些方法进行具体的实现，所以父类中定义的方法，我们可以定义为抽象方法
- 什么是抽象方法？在 ts 中没有具体实现的方法（没有方法体）就是抽象方法
  - 抽象方法，必须存在于抽象类中
  - 抽象类是使用 abstract 声明的类
- 抽象类有如下的特点：
  - 抽象类是不能被实例化（也就是不能通过 new 创建）
  - 抽象方法必须被子类实现，否则该类必须是一个抽象类

```ts
abstract class Shape {
  abstract getArea(): number
}

class Circle extends Shape {
  private r: number
  constructor(r: number) {
    super()
    this.r = r
  }
  getArea(): number {
    return this.r * this.r * 3.14
  }
}

class Rectangle extends Shape {
  private width: number
  private height: number

  constructor(width: number, height: number) {
    super()
    this.width = width
    this.height = height
  }

  getArea(): number {
    return this.width * this.height
  }
}

const circle = new Circle(10)
const rectangle = new Rectangle(20, 30)

function calcArea(shape: Shape) {
  console.log(shape.getArea())
}

calcArea(circle)
calcArea(rectangle)
```

## typeScript 对象类型

### 类的类型

- 类本身也是可以作为一种数据类型的：

```ts
class Person {
  name: string
  constructor(name: string) {
    this.name = name
  }
  running() {
    console.log(this.name)
  }
}

const p1: Person = new Person('d')

const p2: Person = {
  name: 'ab',
  running: function () {
    console.log(this.name)
  }
}
```

### 对象类型的属性修饰符（Property Modifiers）

- 对象类型中的每个属性可以说明他的类型、属性是否可选、属性是否只读等信息
- 可选属性（Optional Properties）
  - 我们可以在属性名后面加一个?标记这个属性是可选的
- 只读属性（Readonly Properties）
  - 在 ts 中，属性可以被标记为 readonly，这不会改变任何运行时的行为
  - 但是在类型检查的时候，一个标记为 readonly 的属性是不能被写入的

```ts
interface IPerson {
  name: string
  age?: number
  readonly height: number
}
const p: IPerson = {
  name: 'a',
  height: 1
}
```

## typeScript 接口补充

### 索引签名（Index Signatures）

- 什么是索引签名呢？
  - 有的时候，你不能提前知道一个类型里的所有属性的名字，但是你知道这些值的特征
  - 这种情况，你就可以用一个索引签名（index signature）来描述可能得值的类型

```ts
interface ICollection {
  [index: number]: any
  length: number
}

function logCollection(collection: ICollection) {
  for (let i = 0; i < collection.length; i++) {
    console.log(collection[i])
  }
}

const tuple: [string, number, number] = ['a', 1, 1]
const array: string[] = ['1', 'b', 'c']
logCollection(tuple)
console.log(array)
```

- 一个索引签名的属性类型必须是 string 或者是 number
  - 虽然 ts 可以同时支持 string 和 number 类型，但数字索引的返回类型一定要是字符索引返回类型的子类型

### 接口继承

- 接口和类一样是可以进行继承的，也是使用 extends 关键字
  - 并且我们会发现，接口是支持多继承的

```ts
interface Person {
  name: string
  eating: () => void
}

interface Animal {
  running: () => void
}

interface Student extends Person, Animal {
  sno: number
}

const stu: Student = {
  sno: 1,
  name: 'a',
  eating: function () {},
  running: function () {}
}
```

### 接口的实现

- 接口定义后，也是可以被类实现的：
  - 如果被一个类实现，那么在之后需要传入接口的地方，都可以将这个类传入
  - 这就是面相接口开发

```ts
interface ISwim {
  swimming: () => void
}

interface IRun {
  running: () => void
}

class Person implements ISwim, IRun {
  swimming() {
    console.log('swimming')
  }

  running() {
    console.log('running')
  }
}

function swim(swimmer: ISwim) {
  swimmer.swimming()
}

const p = new Person()
swim(p)
```

## 严格字面量检测

- 对于对象的字面量赋值，在 ts 中有一个非常有意思的现象：

```ts
interface IPerson {
  name: string
  eating: () => void
}

const p: IPerson = {
  name: 'w',
  age: 1, //Object literal may only specify known properties, and age does not exist in type IPerson
  eating: function () {}
}

function printInfo(info: IPerson) {
  console.log(info.name, info.age) //TS2339: Property age does not exist on type IPerson
}

printInfo({ name: 'a', age: 1, height: 1 })

interface IPerson {
  name: string
  eating: () => void
}

const obj = {
  name: '1',
  age: 12,
  eating: function () {}
}
const p: IPerson = obj
```

- 为什么会这样呢？
  - 每个对象字面量最初都被认为是新鲜的（fresh）
  - 当一个新的对象字面量分配给一个变量或传递给一个非空目标类型的参数时，对象字面量指定目标类型中不存在的属性是错误的
  - 当类型断言或对象字面量的类型扩大时，新鲜度会消失

## typeScript 枚举类型

- 枚举类型是为数不多的 ts 特有的特性之一：
  - 枚举其实就是一组可能出现的值，一个个列举出来，定义在一个类型中，这个类型就是枚举类型
  - 枚举允许开发者定义一组命名常量，常量可以是数组、字符串类型

```ts
enum Direction {
  LEFT,
  RIGHT,
  TOP,
  BOTTOM
}
```

- 枚举类型默认是有值的，比如上面的枚举，默认值是这样的：
- 当然，我们也可以给枚举其他值
  - 这个时候从 100 进行递增
- 我们也可以给他们赋值其他的类型

```ts
enum Direction {
	LEFT=0,
	RIGHT=1,
	TOP=2,
	BOTTOM=3
}

enum Direction {
	LEFT=100,
	RIGHT
	TOP
	BOTTOM
}

enum Direction {
	LEFT,
	RIGHT
	TOP='TOP',
	BOTTOM='BOTTOM'
}
```
