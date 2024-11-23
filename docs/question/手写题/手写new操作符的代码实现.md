---
title: 手写new操作符的代码实现
tags:
  - 手写题
  - 面试题
date: 2024-06-11
---

# 一 手写new操作符的代码实现

## 1.1 是什么

在 JavaScript 中， new 操作符⽤于创建⼀个给定构造函数的实例对象

```JS
 function Person(name, age){
 this.name = name;
 this.age = age;
 }
 Person.prototype.sayName = function () {
 console.log(this.name)
 }
 const person1 = new Person('Tom', 20)
 console.log(person1) // Person {name: "Tom", age: 20}
 t.sayName() // 'Tom'
```

从上⾯可以看到：

- new 通过构造函数 Person 创建出来的实例可以访问到构造函数中的属性
- new 通过构造函数 Person 创建出来的实例可以访问到构造函数原型链中的属性（即实例与构造函数通过原型链连接了起来）

现在在构建函数中显式加上返回值，并且这个返回值是⼀个原始类型

```JS
 function Test(name) {
 this.name = name
 return 1
 }
 const t = new Test('xxx')
 console.log(t.name) // 'xxx'
```

可以发现，构造函数中返回⼀个原始值，然⽽这个返回值并没有作⽤

下⾯在构造函数中返回⼀个对象

```JS
 function Test(name) {
 this.name = name
 console.log(this) // Test { name: 'xxx' }
 return { age: 26 }
 }
 const t = new Test('xxx')
 console.log(t) // { age: 26 }
 console.log(t.name) // 'undefined'
```

从上⾯可以发现，构造函数如果返回值为⼀个对象，那么这个返回值会被正常使⽤

## 1.2 流程

从上⾯介绍中，我们可以看到 new 关键字主要做了以下的⼯作：

- 创建⼀个新的对象 obj
- 将对象与构建函数通过原型链连接起来
- 将构建函数中的 this 绑定到新建的对象 obj 上
- 根据构建函数返回类型作判断，如果是原始值则被忽略，如果是返回对象，需要正常处理

```JS
 function Person(name, age){
 this.name = name;
 this.age = age;
 }
 const person1 = new Person('Tom', 20)
 console.log(person1) // Person {name: "Tom", age: 20}
 t.sayName() // 'Tom'
```

流程图如下：

![](https://f.pz.al/pzal/2024/06/11/b15eaeb04c625.png)

## 1.3 ⼿写new操作符

现在我们已经清楚地掌握了 new 的执⾏过程

那么我们就动⼿来实现⼀下 new

```JS
 function mynew(Func, ...args) {
 // 1.创建⼀个新对象
 const obj = {}
 // 2.新对象原型指向构造函数原型对象
 obj.__proto__ = Func.prototype
 // 3.将构建函数的this指向新对象
 let result = Func.apply(obj, args)
 // 4.根据返回值判断
 return result instanceof Object ? result : obj
}
```

测试⼀下

```JS
 function mynew(func, ...args) {
 const obj = {}
 obj.
 __proto__
 = func.prototype
 let result = func.apply(obj, args)
 return result instanceof Object ? result : obj
 }
 function Person(name, age) {
 this.name = name;
 this.age = age;
 }
 Person.prototype.say = function () {
 console.log(this.name)
 }
 let p = mynew(Person, "huihui", 123)
 console.log(p) // Person {name: "huihui", age: 123}
 p.say() // huihui
```

可以发现，代码虽然很短，但是能够模拟实现 new
