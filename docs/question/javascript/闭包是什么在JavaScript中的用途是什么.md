---
title: 闭包是什么在JavaScript中的用途是什么？
tags:
  - js
  - 面试题
date: 2024-05-28
---
# 一 闭包是什么？在JavaScript中的用途是什么？

## 1.1 是什么

闭包指的是一个函数可以访问并操作其外部作用域中的变量，即使其外部函数已经执行完毕并返回后仍然可以保持这种访问能力。简而言之，闭包是由函数和该函数在其外部作用域中访问的所有变量组成的组合体。

## 1.2 使⽤

任何闭包的使⽤场景都离不开这两点：
- 创建私有变量
- 延⻓变量的⽣命周期

⼀般函数的词法环境在函数返回后就被销毁，但是闭包会保存对创建时所在词法环境的引⽤，即便创建时所在的执⾏上下⽂被销毁，但创建时所在词法环境依然存在，以达到延⻓变量的⽣命周期的⽬的

下⾯举个例⼦：

在⻚⾯上添加⼀些可以调整字号的按钮

```JS
 function makeSizer(size) {
 return function() {
 document.body.style.fontSize = size + 'px';
 };
 }
 var size12 = makeSizer(12);
 var size14 = makeSizer(14);
 var size16 = makeSizer(16);
 document.getElementById('size-12').onclick = size12;
 document.getElementById('size-14').onclick = size14;
 document.getElementById('size-16').onclick = size16;
```

### 1.2.1 柯里化函数

柯⾥化的⽬的在于避免频繁调⽤具有相同参数函数的同时，⼜能够轻松的重⽤

```JS
 // 假设我们有⼀个求⻓⽅形⾯积的函数
 function getArea(width, height) {
 return width * height
 }
 // 如果我们碰到的⻓⽅形的宽⽼是10
 const area1 = getArea(10, 20)
 const area2 = getArea(10, 30)
 const area3 = getArea(10, 40)
 // 我们可以使⽤闭包柯⾥化这个计算⾯积的函数
 function getArea(width) {
 return height => {
 return width * height
 }
 }
 const getTenWidthArea = getArea(10)
 // 之后碰到宽度为10的⻓⽅形就可以这样计算⾯积
 const area1 = getTenWidthArea(20)
// ⽽且如果遇到宽度偶尔变化也可以轻松复⽤
 const getTwentyWidthArea = getArea(20)
```

### 1.2.2 使用闭包模拟私有方法

在 JavaScript 中，没有⽀持声明私有变量，但我们可以使⽤闭包来模拟私有⽅法

下⾯举个例⼦：

```JS
 var Counter = (function() {
 var privateCounter = 0;
 function changeBy(val) {
 privateCounter += val;
 }
 return {
 increment: function() {
 changeBy(1);
 },
 decrement: function() {
 changeBy(-1);
 },
 value: function() {
 return privateCounter;
 }
 }
 })();
 var Counter1 = makeCounter();
 var Counter2 = makeCounter();
 console.log(Counter1.value()); /* logs 0
 /
 Counter1.increment();
 Counter1.increment();
 *console.log(Counter1.value()); /*
 logs 2
 /
 Counter1.decrement();
 *console.log(Counter1.value()); /*
 logs 1
 /
 *console.log(Counter2.value()); /* logs 0 */
```

### 1.2.3 其他

例如计数器、延迟调⽤、回调等闭包的应⽤，其核⼼思想还是创建私有变量和延⻓变量的⽣命周期

## 1.3 注意事项

如果不是某些特定任务需要使⽤闭包，在其它函数中创建函数是不明智的，因为闭包在处理速度和内存消耗⽅⾯对脚本性能具有负⾯影响

例如，在创建新的对象或者类时，⽅法通常应该关联于对象的原型，⽽不是定义到对象的构造器中。

原因在于每个对象的创建，⽅法都会被重新赋值

```JS
 function MyObject(name, message) {
 this.name = name.toString();
 this.message = message.toString();
 this.getName = function() {
 return this.name;
 };
 this.getMessage = function() {
 return this.message;
 };
 }
```

上⾯的代码中，我们并没有利⽤到闭包的好处，因此可以避免使⽤闭包。修改成如下：

```JS
 function MyObject(name, message) {
 this.name = name.toString();
 this.message = message.toString();
 }
 MyObject.prototype.getName = function() {
return this.name;
 };
 MyObject.prototype.getMessage = function() {
 return this.message;
 };
```

## 1.4 闭包用途

在JavaScript中，闭包的主要用途包括：

1. **数据私有化**：通过闭包，可以创建私有变量，这些变量只在闭包内部可见，外部代码无法直接访问，从而实现了数据隐藏和封装。这对于模拟类的私有成员或实现模块化设计非常有用。
    
2. **状态保持**：闭包允许内部函数维持对外部变量的引用，即使外部函数执行完毕，这个状态也能被保留下来。这使得在多次调用同一个函数时，内部的局部变量可以记住之前的值，适用于计数器、缓存、登录状态保持等场景。
    
3. **实现模块模式**：通过闭包，可以创建独立的模块，每个模块拥有自己的私有变量和公开的方法，而不会污染全局命名空间，提高代码的可维护性和可复用性。
    
4. **函数工厂**：可以利用闭包创建一系列具有特定配置的函数，每个函数都绑定了不同的状态或行为，这在生成具有特定初始化参数的函数时特别有用。
    
5. **柯里化和偏函数**：闭包使得函数能够记住部分传入的参数，从而可以创建新的函数，这个新函数接受剩余的参数，这种技术在函数式编程中很常见。
    
6. **迭代器和生成器**：闭包可以用来实现迭代器模式，通过保存迭代的状态（如索引或条件），使得每次调用迭代器函数时都能够从上次停止的地方继续。