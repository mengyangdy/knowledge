---
title: 说说你对TypeScript的理解,TypeScript与JavaScript的主要区别是什么?
tags:
  - ts
  - 面试题
date: 2024-05-29
---
# 一 说说你对TypeScript的理解,TypeScript与JavaScript的主要区别是什么?

## 1.1 是什么
TypeScript 是 JavaScript 的类型的超集，⽀持 ES6 语法，⽀持⾯向对象编程的概念，如类、接⼝、继承、泛型等

超集，不得不说另外⼀个概念，⼦集，怎么理解这两个呢，举个例⼦，如果⼀个集合 A ⾥⾯的的所有元素集合 B ⾥⾯都存在，那么我们可以理解集合 B 是集合 A 的超集，集合 A 为集合 B 的⼦集

![](https://f.pz.al/pzal/2024/06/10/e8905332eefe5.png)

TypeScript其是⼀种静态类型检查的语⾔，提供了类型注解，在代码编译阶段就可以检查出数据类型的错误,同时扩展了 JavaScript 的语法，所以任何现有的 JavaScript 程序可以不加改变的在TypeScript 下⼯作

为了保证兼容性， TypeScript 在编译阶段需要编译器编译成纯 JavaScript 来运⾏，是为⼤型应⽤之开发⽽设计的语⾔

ts ⽂件如下：

```ts
const hello: string = "Hello World!";
console.log(hello);
```

编译⽂件后：

```ts
const hello = "Hello World!";
console.log(hello);
```

## 1.2 特性
TypeScript 的特性主要有如下：
- 类型批注和编译时类型检查 ：在编译时批注变量类型
- 类型推断：ts 中没有批注变量类型会⾃动推断变量的类型
- 类型擦除：在编译过程中批注的内容和接⼝会在运⾏时利⽤⼯具擦除
- 接⼝：ts 中⽤接⼝来定义对象类型
- 枚举：⽤于取值被限定在⼀定范围内的场景
- Mixin：可以接受任意类型的值
- 泛型编程：写代码时使⽤⼀些以后才指定的类型
- 名字空间：名字只在该区域内有效，其他区域可重复使⽤该名字⽽不冲突
- 元组：元组合并了不同类型的对象，相当于⼀个可以装不同类型数据的数组
- ...

### 1.2.1 类型批注

通过类型批注提供在编译时启动类型检查的静态类型，这是可选的，⽽且可以忽略⽽使⽤ JavaScript 常规的动态类型

```JS
function Add(left: number, right: number): number {
 return left + right;
}
```

对于基本类型的批注是 number 、 bool 和 string ，⽽弱或动态类型的结构则是 any 类型


### 1.2.2 类型推断

当类型没有给出时，TypeScript 编译器利⽤类型推断来推断类型，如下：

```JS
let str = "string";
```

变量 str 被推断为字符串类型，这种推断发⽣在初始化变量和成员，设置默认参数值和决定函数返回值时

如果缺乏声明⽽不能推断出类型，那么它的类型被视作默认的动态 any 类型

### 1.2.3 接⼝

接⼝简单来说就是⽤来描述对象的类型 数据的类型有 number 、 null 、 string 等数据格式，对象的类型就是⽤接⼝来描述的

```JS
interface Person {
  name: string
  age: number
}
let tom: Person = {
  name: 'Tom',
  age: 25,
}
```

## 1.3 区别

- TypeScript 是 JavaScript 的超集，扩展了 JavaScript 的语法
- TypeScript 可处理已有的 JavaScript 代码，并只对其中的 TypeScript 代码进⾏编译
- TypeScript ⽂件的后缀名 .ts （.ts，.tsx，.dts），JavaScript ⽂件是 .js
- 在编写 TypeScript 的⽂件的时候就会⾃动编译成 js ⽂件

更多的区别如下图所⽰：

![](https://f.pz.al/pzal/2024/06/10/40fa36280da2d.png)


