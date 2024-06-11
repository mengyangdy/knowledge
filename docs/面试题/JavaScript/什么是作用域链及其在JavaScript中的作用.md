---
title: 什么是作用域链及其在JavaScript中的作用
tags:
  - js
  - 面试题
date: 2024-05-26
---

# 一什么是作用域链及其在JavaScript中的作用？

## 1.1 作用域

作⽤域，即变量（变量作⽤域⼜称上下⽂）和函数⽣效（能被访问）的区域或集合

换句话说，作⽤域决定了代码区块中变量和其他资源的可⻅性

```JS
 function myFunction() {
 let inVariable = "函数内部变量";
 }
 myFunction();//要先执⾏这个函数，否则根本不知道⾥⾯是啥
 console.log(inVariable); // Uncaught ReferenceError: inVariable is not defined
```

上述例⼦中，函数 myFunction 内部创建⼀个 inVariable 变量，当我们在全局访问这个变量的时候，系统会报错

这就说明我们在全局是⽆法获取到（闭包除外）函数内部的变量

我们⼀般将作⽤域分成：
- 全局作⽤域
- 函数作⽤域
- 块级作⽤域

### 1.1.1 全局作用域

任何不在函数中或是⼤括号中声明的变量，都是在全局作⽤域下，全局作⽤域下声明的变量可以在程序的任意位置访问

```JS
 // 全局变量
 var greeting = 'Hello World!';
 function greet() {
 console.log(greeting);
 }
 // 打印 'Hello World!'
 greet();
```

### 1.1.2 函数作用域

函数作⽤域也叫局部作⽤域，如果⼀个变量是在函数内部声明的它就在⼀个函数作⽤域下⾯。这些变量只能在函数内部访问，不能在函数以外去访问

```JS
 function greet() {
 var greeting = 'Hello World!';
 console.log(greeting);
 }
 // 打印 'Hello World!'
 greet();
 // 报错： Uncaught ReferenceError: greeting is not defined
 console.log(greeting);
```

可⻅上述代码中在函数内部声明的变量或函数，在函数外部是⽆法访问的，这说明在函数内部定义的变量或者⽅法只是函数作⽤域

### 1.1.3 块级作用域

ES6引⼊了 let 和 const 关键字,和 var 关键字不同，在⼤括号中使⽤ let 和 const 声明的变量存在于块级作⽤域中。在⼤括号之外不能访问这些变量

```JS
 {
 // 块级作⽤域中的变量
 let greeting = 'Hello World!';
 var lang = 'English';
 console.log(greeting); // Prints 'Hello World!'
 }
 // 变量 'English'
 console.log(lang);
 // 报错：Uncaught ReferenceError: greeting is not defined
 console.log(greeting);
```

## 1.2 词法作用域

词法作⽤域，⼜叫静态作⽤域，变量被创建时就确定好了，⽽⾮执⾏阶段确定的。也就是说我们写好代码时它的作⽤域就确定了， JavaScript 遵循的就是词法作⽤域

```JS
 var a = 2;
 function foo(){
 console.log(a)
 }
 function bar(){
 var a = 3;
 foo();
 }
 bar()
```

上述代码改变成⼀张图

![](https://f.pz.al/pzal/2024/06/11/44fb6183ba2cf.png)

由于 JavaScript 遵循词法作⽤域，相同层级的 foo 和 bar 就没有办法访问到彼此块作⽤域中的变量，所以输出2

## 1.3 作用域链

当在 Javascript 中使⽤⼀个变量的时候，⾸先 Javascript 引擎会尝试在当前作⽤域下去寻找该变量，如果没找到，再到它的上层作⽤域寻找，以此类推直到找到该变量或是已经到了全局作⽤域

如果在全局作⽤域⾥仍然找不到该变量，它就会在全局范围内隐式声明该变量(⾮严格模式下)或是直接报错

这⾥拿《你不知道的Javascript(上)》中的⼀张图解释：

把作⽤域⽐喻成⼀个建筑，这份建筑代表程序中的嵌套作⽤域链，第⼀层代表当前的执⾏作⽤域，顶层代表全局作⽤域

![](https://f.pz.al/pzal/2024/06/11/9428c0224819a.png)

变量的引⽤会顺着当前楼层进⾏查找，如果找不到，则会往上⼀层找，⼀旦到达顶层，查找的过程都会停⽌

下⾯代码演⽰下：

```JS
 var sex = '男';
 function person() {
 var name = '张三';
 function student() {
 var age = 18;
 console.log(name); // 张三
 console.log(sex); // 男
 }
 student();
 console.log(age); // Uncaught ReferenceError: age is not defined
 }
 person();
```

上述代码主要主要做了以下⼯作：
- student 函数内部属于最内层作⽤域，找不到 name ，向上⼀层作⽤域 person 函数内部找，找到了输出“张三”
- student 内部输出 sex 时找不到，向上⼀层作⽤域 person 函数找，还找不到继续向上⼀层找，即全局作⽤域，找到了输出“男”
- 在 person 函数内部输出 age 时找不到，向上⼀层作⽤域找，即全局作⽤域，还是找不到则报错