---
title: TypeScript中函数的理解?
tags:
  - ts
  - 面试题
date: 2024-06-11
---

# 一 TypeScript中函数的理解?

## 1.1 是什么
函数是 JavaScript 应⽤程序的基础，帮助我们实现抽象层、模拟类、信息隐藏和模块

在 TypeScript ⾥，虽然已经⽀持类、命名空间和模块，但函数仍然是主要定义⾏为的⽅式，TypeScript 为 JavaScript 函数添加了额外的功能，丰富了更多的应⽤场景

函数类型在 TypeScript 类型系统中扮演着⾮常重要的⻆⾊，它们是可组合系统的核⼼构建块

## 1.2 使⽤⽅式

跟 javascript 定义函数⼗分相似，可以通过 funciton 关键字、箭头函数等形式去定义，例如下⾯⼀个简单的加法函数：

```JS
const add = (a: number, b: number) => a + b
```

上述只定义了函数的两个参数类型，这个时候整个函数虽然没有被显式定义，但是实际上TypeScript 编译器是能够通过类型推断到这个函数的类型，如下图所⽰：

![](https://f.pz.al/pzal/2024/06/11/40403bae9094e.png)

当⿏标放置在第三⾏ add 函数名的时候，会出现完整的函数定义类型，通过 : 的形式来定于参数类型，通过 => 连接参数和返回值类型

当我们没有提供函数实现的情况下，有两种声明函数类型的⽅式，如下所⽰：

```JS
// ⽅式⼀
type LongHand = {
(a: number): number;
};
// ⽅式⼆
type ShortHand = (a: number) => number;
```

当存在函数重载时，只能使⽤⽅式⼀的形式

### 1.2.1 可选参数

当函数的参数可能是不存在的，只需要在参数后⾯加上 ? 代表参数可能不存在，如下：

```JS
const add = (a: number, b?: number) => a + (b ? b : 0)
```

这时候参数 b 可以是 number 类型或者 undefined 类型，即可以传⼀个 number 类型或者不传都可以

### 1.2.2 剩余类型

剩余参数与 JavaScript 的语法类似，需要⽤ ... 来表⽰剩余参数

如果剩余参数 rest 是⼀个由 number 类型组成的数组，则如下表⽰：

```JS
const add = (a: number, ...rest: number[]) => rest.reduce(((a, b) => a + b), a)
```

### 1.2.3 函数重载

允许创建数项名称相同但输⼊输出类型或个数不同的⼦程序，它可以简单地称为⼀个单独功能可以执⾏多项任务的能⼒

关于 typescript 函数重载，必须要把精确的定义放在前⾯，最后函数实现时，需要使⽤ | 操作符或者 ? 操作符，把所有可能的输⼊类型全部包含进去，⽤于具体实现

这⾥的函数重载也只是多个函数的声明，具体的逻辑还需要⾃⼰去写， typescript 并不会真的将你的多个重名 function 的函数体进⾏合并

例如我们有⼀个add函数，它可以接收 string 类型的参数进⾏拼接，也可以接收 number 类型的参数进⾏相加，如下：

```JS
// 上边是声明
function add (arg1: string, arg2: string): string
function add (arg1: number, arg2: number): number
// 因为我们在下边有具体函数的实现，所以这⾥并不需要添加 declare 关键字
// 下边是实现
function add (arg1: string | number, arg2: string | number) {
// 在实现上我们要注意严格判断两个参数的类型是否相等，⽽不能简单的写⼀个 arg1 + arg2
if (typeof arg1 === 'string' && typeof arg2 === 'string') {
return arg1 + arg2
} else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
return arg1 + arg2
}
}
```

## 1.3 区别

从上⾯可以看到：
- 从定义的⽅式⽽⾔，typescript 声明函数需要定义参数类型或者声明返回值类型
- typescript 在参数中，添加可选参数供使⽤者选择
- typescript 增添函数重载功能，使⽤者只需要通过查看函数声明的⽅式，即可知道函数传递的参数个数以及类型