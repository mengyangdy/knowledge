---
title: TypeScript中的装饰器如何理解?
tags:
  - ts
  - 面试题
date: 2024-06-11
---

# 一 TypeScript中的装饰器如何理解?

## 1.1 是什么

装饰器是⼀种特殊类型的声明，它能够被附加到类声明，⽅法， 访问符，属性或参数上是⼀种在不改变原类和使⽤继承的情况下，动态地扩展对象功能

同样的，本质也不是什么⾼⼤上的结构，就是⼀个普通的函数， @expression 的形式其实是Object.defineProperty 的语法糖

expression 求值后必须也是⼀个函数，它会在运⾏时被调⽤，被装饰的声明信息做为参数传⼊

## 1.2 使⽤⽅式

由于 typescript 是⼀个实验性特性，若要使⽤，需要在 tsconfig.json ⽂件启动，如下：

```JS
{
 "compilerOptions": {
 "target": "ES5",
 "experimentalDecorators": true
}
}
```

typescript 装饰器的使⽤和 javascript 基本⼀致

类的装饰器可以装饰：
- 类
- ⽅法/属性
- 参数
- 访问器

### 1.2.1 类装饰

例如声明⼀个函数 addAge 去给 Class 的属性 age 添加年龄

```JS
function addAge(constructor: Function) {
constructor.prototype.age = 18;
}
 @addAge
 class Person{
 name: string;
 age!: number;
 constructor() {
 this.name = 'huihui';
 }
 }
 let person = new Person();
 console.log(person.age); // 18
```

上述代码，实际等同于以下形式：

```JS
Person = addAge(function Person() { ... });
```

上述可以看到，当装饰器作为修饰类的时候，会把构造器传递进去。

constructor.prototype.age 就是在每⼀个实例化对象上⾯添加⼀个 age 属性

### 1.2.2 ⽅法/属性装饰

同样，装饰器可以⽤于修饰类的⽅法，这时候装饰器函数接收的参数变成了：
- target：对象的原型
- propertyKey：⽅法的名称
- descriptor：⽅法的属性描述符

可以看到，这三个属性实际就是 Object.defineProperty 的三个参数，如果是类的属性，则没有传递第三个参数

如下例⼦：

```JS
 // 声明装饰器修饰⽅法/属性
 function method(target: any, propertyKey: string, descriptor:
PropertyDescriptor) {
 console.log(target);
 console.log("prop " + propertyKey);
 console.log("desc " + JSON.stringify(descriptor) + "\n\n");
 descriptor.writable = false;
 };
 function property(target: any, propertyKey: string) {
 console.log("target", target)
 console.log("propertyKey", propertyKey)
 }
 class Person{
 @property
 name: string;
 constructor() {
 this.name = 'huihui';
 }
 @method
 say(){
 return 'instance method';
 }
 @method
 static run(){
 return 'static method';
 }
 }
 const xmz = new Person();
 // 修改实例⽅法say
 xmz.say = function() {
 return 'edit'
 }
```

输出如下图所⽰：

![](https://f.pz.al/pzal/2024/06/11/1478daf417a50.png)

### 1.2.3 参数装饰

接收3个参数，分别是：
- target ：当前对象的原型
- propertyKey ：参数的名称
- index：参数数组中的位置

```JS
function logParameter(target: Object, propertyName: string, index: number) {
console.log(target);
console.log(propertyName);
console.log(index);
}
class Employee {
greet(@logParameter message: string): string {
 return hello ${message};
 }
 }
 const emp = new Employee();
 emp.greet('hello');
```

输⼊如下图：

![](https://f.pz.al/pzal/2024/06/11/17ab06907b329.png)

### 1.2.4 访问器装饰

使⽤起来⽅式与⽅法装饰⼀致，如下：

```JS
 function modification(target: Object, propertyKey: string, descriptor:
PropertyDescriptor) {
 console.log(target);
 console.log("prop " + propertyKey);
 console.log("desc " + JSON.stringify(descriptor) + "\n\n");
 };
 class Person{
 _name: string;
 constructor() {
 this._name = 'huihui';
 }
 @modification
 get name() {
 return this._name
 }
 }
```

### 1.2.5 装饰器⼯⼚

如果想要传递参数，使装饰器变成类似⼯⼚函数，只需要在装饰器函数内部再函数⼀个函数即可，如下：

```JS
function addAge(age: number) {
return function(constructor: Function) {
 constructor.prototype.age = age
 }
 }
 @addAge(10)
 class Person{
 name: string;
 age!: number;
 constructor() {
 this.name = 'huihui';
 }
 }
 let person = new Person();
```

### 1.2.6 执⾏顺序

当多个装饰器应⽤于⼀个声明上，将由上⾄下依次对装饰器表达式求值，求值的结果会被当作函数，由下⾄上依次调⽤，例如如下：

```JS
 function f() {
 console.log("f(): evaluated");
 return function (target, propertyKey: string, descriptor:
PropertyDescriptor) {
 console.log("f(): called");
 }
 }
 function g() {
 console.log("g(): evaluated");
 return function (target, propertyKey: string, descriptor:
PropertyDescriptor) {
 console.log("g(): called");
 }
 }
 class C {
 @f()
 @g()
 method() {}
 }
 // 输出
 f(): evaluated
 g(): evaluated
 g(): called
 f(): called
```

## 1.3 应⽤场景

可以看到，使⽤装饰器存在两个显著的优点：
- 代码可读性变强了，装饰器命名相当于⼀个注释
- 在不改变原有代码情况下，对原来功能进⾏扩展

后⾯的使⽤场景中，借助装饰器的特性，除了提⾼可读性之后，针对已经存在的类，可以通过装饰器的特性，在不改变原有代码情况下，对原来功能进⾏扩展