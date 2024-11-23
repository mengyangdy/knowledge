---
title: TypeScript中类的理解
tags:
  - ts
  - 面试题
date: 2024-06-11
---

# 一 TypeScript中类的理解

## 1.1 是什么

类（Class）是⾯向对象程序设计（OOP，Object-Oriented Programming）实现信息封装的基础类是⼀种⽤⼾定义的引⽤数据类型，也称类类型

传统的⾯向对象语⾔基本都是基于类的，JavaScript 基于原型的⽅式让开发者多了很多理解成本

在 ES6 之后， JavaScript 拥有了 class 关键字，虽然本质依然是构造函数，但是使⽤起来已经⽅便了许多

但是 JavaScript 的 class 依然有⼀些特性还没有加⼊，⽐如修饰符和抽象类

TypeScript 的 class ⽀持⾯向对象的所有特性，⽐如 类、接⼝等

## 1.2 使⽤⽅式

定义类的关键字为 class ，后⾯紧跟类名，类可以包含以下⼏个模块（类的数据成员）：
- 字段 ： 字段是类⾥⾯声明的变量。字段表⽰对象的有关数据。
- 构造函数： 类实例化时调⽤，可以为类的对象分配内存。
- ⽅法： ⽅法为对象要执⾏的操作

如下例⼦：

```JS
class Car {
// 字段
engine:string;
// 构造函数
constructor(engine:string) {
this.engine = engine
}
// ⽅法
disp():void {
console.log("发动机为 : "+this.engine)
}
}
```

### 1.2.1 继承

类的继承使⽤过 extends 的关键字

```JS
class Animal {
move(distanceInMeters: number = 0) {
console.log(
Animal moved ${distanceInMeters}m.
);
}
}
class Dog extends Animal {
bark() {
console.log('Woof! Woof!');
 }
 }
const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```

Dog 是⼀个 派⽣类，它派⽣⾃ Animal 基类，派⽣类通常被称作⼦类，基类通常被称作 超类

Dog 类继承了 Animal 类，因此实例 dog 也能够使⽤ Animal 类 move ⽅法

同样，类继承后，⼦类可以对⽗类的⽅法重新定义，这个过程称之为⽅法的重写，通过 super 关键字是对⽗类的直接引⽤，该关键字可以引⽤⽗类的属性和⽅法，如下：

```JS
class PrinterClass {
doPrint():void {
console.log("⽗类的 doPrint() ⽅法。")
}
}
class StringPrinter extends PrinterClass {
doPrint():void {
super.doPrint() // 调⽤⽗类的函数
console.log("⼦类的 doPrint()⽅法。")
}
}
```

### 1.2.2 修饰符
可以看到，上述的形式跟 ES6 ⼗分的相似， typescript 在此基础上添加了三种修饰符：
- 公共 public：可以⾃由的访问类程序⾥定义的成员
- 私有 private：只能够在该类的内部进⾏访问
- 受保护 protect：除了在该类的内部可以访问，还可以在⼦类中仍然可以访问

### 1.2.3 私有修饰符

只能够在该类的内部进⾏访问，实例对象并不能够访问

![](https://f.pz.al/pzal/2024/06/11/3e90bede0b6ad.png)

并且继承该类的⼦类并不能访问，如下图所⽰：

![](https://f.pz.al/pzal/2024/06/11/2223e1d12edb8.png)

### 1.2.4 受保护修饰符

跟私有修饰符很相似，实例对象同样不能访问受保护的属性，如下：

![](https://f.pz.al/pzal/2024/06/11/735709ac37b6a.png)

有⼀点不同的是 protected 成员在⼦类中仍然可以访问

![](https://f.pz.al/pzal/2024/06/11/2f1484ed64822.png)

除了上述修饰符之外，还有只读修饰符


#### 1.2.4.1 只读修饰符

通过 readonly 关键字进⾏声明，只读属性必须在声明时或构造函数⾥被初始化，如下：

![](https://f.pz.al/pzal/2024/06/11/5b7d6127f0a13.png)

除了实例属性之外，同样存在静态属性

### 1.2.5 静态属性

这些属性存在于类本⾝上⾯⽽不是类的实例上，通过 static 进⾏定义，访问这些属性需要通过类型.静态属性 的这种形式访问，如下所⽰：

```JS
class Square {
static width = '100px'
}
console.log(Square.width) // 100px
```

上述的类都能发现⼀个特点就是，都能够被实例化，在 typescript 中，还存在⼀种抽象类

### 1.2.6 抽象类

抽象类做为其它派⽣类的基类使⽤，它们⼀般不会直接被实例化，不同于接⼝，抽象类可以包含成员的实现细节

abstract 关键字是⽤于定义抽象类和在抽象类内部定义抽象⽅法，如下所⽰：

```JS
abstract class Animal {
abstract makeSound(): void;
move(): void {
console.log('roaming the earch...');
}
}
```

这种类并不能被实例化，通常需要我们创建⼦类去继承，如下：

```JS
class Cat extends Animal {
makeSound() {
console.log('miao miao')
}
}
const cat = new Cat()
cat.makeSound() // miao miao
cat.move() // roaming the earch...
```

## 1.3 应⽤场景


除了⽇常借助类的特性完成⽇常业务代码，还可以将类（class）也可以作为接⼝，尤其在 React ⼯程中是很常⽤的，如下：

```JS
export default class Carousel extends React.Component<Props, State> {}
```

由于组件需要传⼊ props 的类型 Props ，同时有需要设置默认 props 即 defaultProps，这时候更加适合使⽤ class 作为接⼝

先声明⼀个类，这个类包含组件 props 所需的类型和初始值：

```JS
// props的类型
export default class Props {
public children: Array<React.ReactElement<any>> | React.ReactElement<any> |
never[] = []
public speed: number = 500
public height: number = 160
public animation: string = 'easeInOutQuad'
public isAuto: boolean = true
public autoPlayInterval: number = 4500
public afterChange: () => {}
public beforeChange: () => {}
public selesctedColor: string
public showDots: boolean = true
}
```

当我们需要传⼊ props 类型的时候直接将 Props 作为接⼝传⼊，此时 Props 的作⽤就是接⼝，⽽当需要我们设置 defaultProps 初始值的时候，我们只需要:

```JS
public static defaultProps = new Props()
```

Props 的实例就是 defaultProps 的初始值，这就是 class 作为接⼝的实际应⽤，我们⽤⼀个 class 起到了接⼝和设置初始值两个作⽤，⽅便统⼀管理，减少了代码量