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

## typeScript 中的抽象类

## typeScript 对象类型

## typeScript 接口补充

## 严格字面量检测

## typeScript 枚举类型
