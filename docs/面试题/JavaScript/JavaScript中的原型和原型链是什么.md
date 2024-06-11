---
title: JavaScript中的原型和原型链是什么?
tags:
  - js
  - 面试题
date: 2024-05-26
---
# 一 JavaScript中的原型和原型链是什么?

## 1.1 原型
JavaScript 常被描述为⼀种基于原型的语⾔--每个对象拥有⼀个原型对象

当试图访问⼀个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到⼀个名字匹配的属性或到达原型链的末尾

准确地说，这些属性和⽅法定义在Object的构造器函数（constructor functions）之上的 prototype 属性上，⽽⾮实例对象本⾝

下⾯举个例⼦：

函数可以有属性。 每个函数都有⼀个特殊的属性叫作原型 prototype

```JS
function doSomething(){}
console.log( doSomething.prototype );
```

控制台输出

```JS
{
constructor: ƒ doSomething(),
 __proto__: {
 constructor: ƒ Object(),
 hasOwnProperty: ƒ hasOwnProperty(),
 isPrototypeOf: ƒ isPrototypeOf(),
 propertyIsEnumerable: ƒ propertyIsEnumerable(),
 toLocaleString: ƒ toLocaleString(),
 toString: ƒ toString(),
 valueOf: ƒ valueOf()
 }
}
```

上⾯这个对象，就是⼤家常说的原型对象

可以看到，原型对象有⼀个⾃有属性 constructor ，这个属性指向该函数，如下图关系展⽰

![](https://f.pz.al/pzal/2024/06/11/0d4f0ed87c003.png)

## 1.2 原型链
原型对象也可能拥有原型，并从中继承⽅法和属性，⼀层⼀层、以此类推。这种关系常被称为原型链 (prototype chain)，它解释了为何⼀个对象会拥有定义在其他对象中的属性和⽅法

在对象实例和它的构造器之间建⽴⼀个链接（它是 proto 属性，是从构造函数的 prototype 属性派⽣的），之后通过上溯原型链，在构造器中找到这些属性和⽅法

下⾯举个例⼦：

```JS
 function Person(name) {
 this.name = name;
 this.age = 18;
 this.sayName = function() {
 console.log(this.name);
 }
 }
 // 第⼆步 创建实例
 var person = new Person('person')
```

根据代码，我们可以得到下图

![](https://f.pz.al/pzal/2024/06/11/d1581b4ad0929.png)

下⾯分析⼀下：
- 构造函数 Person 存在原型对象 Person.prototype
- 构造函数⽣成实例对象 person ， person 的 proto 指向构造函数 Person 原型对象
- Person.prototype.__proto__ 指向内置对象，因为 Person.prototype 是个对象，默认是由 Object 函数作为类创建的，⽽ Object.prototype 为内置对象
- Person.__proto__ 指向内置匿名函数 anonymous ，因为 Person 是个函数对象，默认由Function 作为类创建
- Function.prototype 和 Function.__proto__ 同时指向内置匿名函数 anonymous，这样原型链的终点就是 null

## 1.3 总结

下⾯⾸先要看⼏个概念：

proto 作为不同对象之间的桥梁，⽤来指向创建它的构造函数的原型对象的

![](https://f.pz.al/pzal/2024/06/11/a6279f6569293.png)

每个对象的 proto 都是指向它的构造函数的原型对象 prototype 的

```JS
person1.__proto__ === Person.prototype
```

构造函数是⼀个函数对象，是通过 Function 构造器产⽣的

```JS
Person.__proto__ === Function.prototype
```

原型对象本⾝是⼀个普通对象，⽽普通对象的构造函数都是 Object

```JS
Person.prototype.__proto__ === Object.prototype
```

刚刚上⾯说了，所有的构造器都是函数对象，函数对象都是 Function 构造产⽣的

```JS
Object.__proto__ === Function.prototype
```

Object 的原型对象也有 proto 属性指向 null ，null 是原型链的顶端

```JS
Object.prototype.__proto__ === null
```
下⾯作出总结：
- ⼀切对象都是继承⾃ Object 对象， Object 对象直接继承根源对象 null
- ⼀切的函数对象（包括 Object 对象），都是继承⾃ Function 对象
- Object 对象直接继承⾃ Function 对象
- Function 对象的 proto 会指向⾃⼰的原型对象，最终还是继承⾃ Object 对象