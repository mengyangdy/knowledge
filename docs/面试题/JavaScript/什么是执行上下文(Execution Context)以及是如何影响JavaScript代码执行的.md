---
title: 什么是执行上下文(Execution Context)和执行栈?
tags:
  - js
  - 面试题
date: 2024-05-28
---
# 一什么是执行上下文(Execution Context)和执行栈？

> 执行上下文（Execution Context）它定义了代码执行时的环境，包括其中的变量、函数以及 `this` 的值。每当JavaScript代码开始执行时，无论是全局代码还是函数代码，JavaScript引擎都会创建一个新的执行上下文来管理当前代码块的执行环境。执行上下文确定了代码在执行时能够访问哪些数据，以及如何访问这些数据。

## 1.1 执行上下文的类型

JavaScript中有三种主要类型的执行上下文：

1. **全局执行上下文（Global Execution Context）**：
    - 当JavaScript脚本开始执行时，会首先创建一个全局执行上下文。
    - 这个上下文包含了全局变量、全局函数以及`this`关键字指向全局对象（在浏览器中是`window`对象，在Node.js环境中是`global`对象）。
    - 全局上下文在整个程序生命周期中只创建一次，并且是所有其他执行上下文的根。
2. **函数执行上下文（Function Execution Context）**：
    - 每当一个函数被调用时，一个新的函数执行上下文会被创建。
    - 这个上下文包含了函数的局部变量、参数、内部函数以及`this`的值（根据函数调用方式决定）。
    - 函数执行上下文在函数调用结束并返回后会被销毁，除非涉及到闭包。
3. **Eval函数执行上下文（不常用，某些情况下由`eval()`函数创建）**：
    - 当使用`eval()`函数执行代码字符串时，会创建一个特殊的执行上下文。
    - 由于安全和性能原因，通常建议避免使用`eval()`。

下⾯给出全局上下⽂和函数上下⽂的例⼦：

![](https://f.pz.al/pzal/2024/06/11/99fb382dbb60b.png)

紫⾊框住的部分为全局上下⽂，蓝⾊和橘⾊框起来的是不同的函数上下⽂。只有全局上下⽂（的变量）能被其他任何上下⽂访问

可以有任意多个函数上下⽂，每次调⽤函数创建⼀个新的上下⽂，会创建⼀个私有作⽤域，函数内部声明的任何变量都不能在当前函数作⽤域外部直接访问

## 1.2 生命周期

执⾏上下⽂的⽣命周期包括三个阶段：创建阶段 → 执⾏阶段 → 回收阶段

### 1.2.1 创建阶段

创建阶段即当函数被调⽤，但未执⾏任何其内部代码之前

创建阶段做了三件事：
- 确定 this 的值，也被称为 This Binding
- LexicalEnvironment（词法环境） 组件被创建
- VariableEnvironment（变量环境） 组件被创建

伪代码如下：

```JS
 ExecutionContext = {
 ThisBinding = <this value>, // 确定this
 LexicalEnvironment = { ... }, // 词法环境
 VariableEnvironment = { ... }, // 变量环境
 }
```

#### 1.2.1.1 This Binding

确定 this 的值我们前⾯讲到， this 的值是在执⾏的时候才能确认，定义的时候不能确认

#### 1.2.1.2 词法环境

词法环境有两个组成部分：
- 全局环境：是⼀个没有外部环境的词法环境，其外部环境引⽤为 null ，有⼀个全局对象，this 的值指向这个全局对象
- 函数环境：⽤⼾在函数中定义的变量被存储在环境记录中，包含了 arguments 对象，外部环境的引⽤可以是全局环境，也可以是包含内部函数的外部函数环境

伪代码如下：

```JS
 GlobalExectionContext = { // 全局执⾏上下⽂
 LexicalEnvironment: { // 词法环境
 EnvironmentRecord: { // 环境记录
 Type: "Object", // 全局环境
 // 标识符绑定在这⾥
 outer: <null> // 对外部环境的引⽤
 }
 }
 FunctionExectionContext = { // 函数执⾏上下⽂
 LexicalEnvironment: { // 词法环境
 EnvironmentRecord: { // 环境记录
 Type: "Declarative", // 函数环境
 // 标识符绑定在这⾥ // 对外部环境的引⽤
 outer: <Global or outer function environment reference>
 }
 }
```

#### 1.2.1.3 变量环境

变量环境也是⼀个词法环境，因此它具有上⾯定义的词法环境的所有属性

在 ES6 中，词法环境和变量环境的区别在于前者⽤于存储函数声明和变量（ let 和 const ）绑定，⽽后者仅⽤于存储变量（ var ）绑定

```JS
 let a = 20;
 const b = 30;
 var c;
 function multiply(e, f) {
 var g = 20;
 return e * f * g;
 }
 c = multiply(20, 30);
```

执⾏上下⽂如下：

```JS
GlobalExectionContext = {
 ThisBinding: <Global Object>,
 LexicalEnvironment: { // 词法环境
 EnvironmentRecord: {
 Type: "Object",
 // 标识符绑定在这⾥
 a: < uninitialized >,
 b: < uninitialized >,
 multiply: < func >
 }
 outer: <null>
 },
 VariableEnvironment: { // 变量环境
 EnvironmentRecord: {
 Type: "Object",
 // 标识符绑定在这⾥
 c: undefined,
 }
 outer: <null>
 }
 }
 FunctionExectionContext = {
 ThisBinding: <Global Object>,
 LexicalEnvironment: {
 EnvironmentRecord: {
 Type: "Declarative",
 // 标识符绑定在这⾥
 Arguments: {0: 20, 1: 30, length: 2},
 },
 outer: <GlobalLexicalEnvironment>
 },
 VariableEnvironment: {
 EnvironmentRecord: {
 Type: "Declarative",
 // 标识符绑定在这⾥
 g: undefined
 },
 outer: <GlobalLexicalEnvironment>
 }
 }
```

留意上⾯的代码， let 和 const 定义的变量 a 和 b 在创建阶段没有被赋值，但 var 声明的变量从在创建阶段被赋值为 undefined

这是因为，创建阶段，会在代码中扫描变量和函数声明，然后将函数声明存储在环境中

但变量会被初始化为 undefined ( var 声明的情况下)和保持 uninitialized (未初始化状态)(使⽤ let 和 const 声明的情况下)

这就是变量提升的实际原因

### 1.2.2 执行阶段

在这阶段，执⾏变量赋值、代码执⾏

如果 Javascript 引擎在源代码中声明的实际位置找不到变量的值，那么将为其分配undefined 值

### 1.2.3 回收阶段

执⾏上下⽂出栈等待虚拟机回收执⾏上下⽂

## 1.3 执行栈

执⾏栈，也叫调⽤栈，具有 LIFO（后进先出）结构，⽤于存储在代码执⾏期间创建的所有执⾏上下⽂

![](https://f.pz.al/pzal/2024/06/11/c033b1020c3f7.png)

当 Javascript 引擎开始执⾏你第⼀⾏脚本代码的时候，它就会创建⼀个全局执⾏上下⽂然后将它压到执⾏栈中

每当引擎碰到⼀个函数的时候，它就会创建⼀个函数执⾏上下⽂，然后将这个执⾏上下⽂压到执⾏栈中

引擎会执⾏位于执⾏栈栈顶的执⾏上下⽂(⼀般是函数执⾏上下⽂)，当该函数执⾏结束后，对应的执⾏上下⽂就会被弹出，然后控制流程到达执⾏栈的下⼀个执⾏上下⽂

举个例⼦

```JS
 let a = 'Hello World!';
 function first() {
 console.log('Inside first function');
 second();
 console.log('Again inside first function');
 }
 function second() {
 console.log('Inside second function');
 }
 first();
 console.log('Inside Global Execution Context');
```

转化成图的形式

![](https://f.pz.al/pzal/2024/06/11/56f9aba005829.png)

简单分析⼀下流程：
- 创建全局上下⽂请压⼊执⾏栈
- first 函数被调⽤，创建函数执⾏上下⽂并压⼊栈
- 执⾏ first 函数过程遇到 second 函数，再创建⼀个函数执⾏上下⽂并压⼊栈
- second 函数执⾏完毕，对应的函数执⾏上下⽂被推出执⾏栈，执⾏下⼀个执⾏上下⽂ first函数
- first 函数执⾏完毕，对应的函数执⾏上下⽂也被推出栈中，然后执⾏全局上下⽂
- 所有代码执⾏完毕，全局上下⽂也会被推出栈中，程序结束






## 1.2 影响代码执行的方式

1. **变量和函数的查找**：执行上下文决定了变量和函数的查找规则，即作用域链（Scope Chain）。每个执行上下文都有一个与之关联的作用域链，它是一个包含所有父执行上下文变量对象的链表，用于解决变量名的查找。
    
2. **`this`值的确定**：执行上下文决定了`this`的值。在全局上下文中，`this`指向全局对象；在函数上下文中，`this`的值依赖于函数的调用方式（例如，作为对象方法调用、普通函数调用、构造函数调用等）。
    
3. **代码执行顺序**：JavaScript引擎使用执行上下文栈（Execution Context Stack）来管理多个执行上下文。这是一个后进先出（LIFO）的数据结构，新的执行上下文被推入栈顶，执行完毕后从栈顶弹出。这确保了正确的代码执行顺序，比如函数嵌套调用时的返回流程。