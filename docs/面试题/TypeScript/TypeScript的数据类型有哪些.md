---
title: TypeScript的数据类型有哪些?
tags:
  - ts
  - 面试题
date: 2024-06-10
---

# 一 TypeScript的数据类型有哪些?

## 1.1 是什么

typescript 和 javascript ⼏乎⼀样，拥有相同的数据类型，另外在 javascript 基础上提供了更加实⽤的类型供开发使⽤

在开发阶段，可以为明确的变量定义为某种类型，这样 typescript 就能在编译阶段进⾏类型检查，当类型不合符预期结果的时候则会出现错误提⽰

## 1.2 有哪些

typescript 的数据类型主要有如下：
- boolean（布尔类型）
- number（数字类型）
- string（字符串类型）
- array（数组类型）
- tuple（元组类型）
- enum（枚举类型）
- any（任意类型）
- null 和 undefined 类型
- void 类型
- never 类型
- object 对象类型

### 1.2.1  boolean布尔类型

```JS
1 let flag:boolean = true;
2 // flag = 123; // 错误
3 flag = false; //正确
```

### 1.2.2 number
数字类型，和 javascript ⼀样， typescript 的数值类型都是浮点数，可⽀持⼆进制、⼋进制、⼗进制和⼗六进制

```JS
let num:number = 123;
// num = '456'; // 错误
num = 456; //正确
```

进制表⽰：

```JS
let decLiteral: number = 6; // ⼗进制
let hexLiteral: number = 0xf00d; // ⼗六进制
let binaryLiteral: number = 0b1010; // ⼆进制
let octalLiteral: number = 0o744; // ⼋进制
```

### 1.2.3 string
字符串类型，和 JavaScript ⼀样，可以使⽤双引号（ " ）或单引号（ ' ）表⽰字符串

```JS
let str:string = 'this is ts';
str = 'test';
```

作为超集，当然也可以使⽤模版字符串``进⾏包裹，通过 ${} 嵌⼊变量

```JS
let name: string ='Gene'
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }
```

### 1.2.4 array
### 
数组类型，跟 javascript ⼀致，通过 [] 进⾏包裹，有两种写法：

⽅式⼀：元素类型后⾯接上 []

```JS
let arr:string[] = ['12', '23'];
arr = ['45', '56'];
```

⽅式⼆：使⽤数组泛型， Array<元素类型> ：

```JS
let arr:Array<number> = [1, 2];
arr = ['45', '56'];
```

### 1.2.5 tuple
### 
元祖类型，允许表⽰⼀个已知元素数量和类型的数组，各元素的类型不必相同

```JS
let tupleArr:[number, string, boolean];
tupleArr = [12, '34', true]; //ok
typleArr = [12, '34'] // no ok
```

赋值的类型、位置、个数需要和定义（⽣明）的类型、位置、个数⼀致

### 1.2.6 enum
### 
enum 类型是对JavaScript标准数据类型的⼀个补充，使⽤枚举类型可以为⼀组数值赋予友好的名字

```JS
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```

### 1.2.7 any

可以指定任何类型的值，在编程阶段还不清楚类型的变量指定⼀个类型，不希望类型检查器对这些值进⾏检查⽽是直接让它们通过编译阶段的检查，这时候可以使⽤ any 类型

使⽤ any 类型允许被赋值为任意类型，甚⾄可以调⽤其属性、⽅法

```JS
let num:any = 123;
num = 'str';
num = true;
```

定义存储各种类型数据的数组时，⽰例代码如下：

```JS
let arrayList: any[] = [1, false, 'fine'];
arrayList[1] = 100;
```

### 1.2.8 null 和 和 undefined

在 JavaScript 中 null 表⽰ "什么都没有"，是⼀个只有⼀个值的特殊类型，表⽰⼀个空对象引⽤，⽽ undefined 表⽰⼀个没有设置值的变量

默认情况下 null 和 undefined 是所有类型的⼦类型， 就是说你可以把 null 和 undefined 赋值给 number 类型的变量

```JS
let num:number | undefined; // 数值类型 或者 undefined
console.log(num); // 正确
num = 123;
console.log(num); // 正确
```

但是 ts 配置了 --strictNullChecks 标记， null 和 undefined 只能赋值给 void 和它们各⾃

### 1.2.9 void

⽤于标识⽅法返回值的类型，表⽰该⽅法没有返回值。

```JS
function hello(): void {
alert("Hello Runoob");
}
```

### 1.2.10 never

never 是其他类型 （包括 null 和 undefined ）的⼦类型，可以赋值给任何类型，代表从不会出现的值

但是没有类型是 never 的⼦类型，这意味着声明 never 的变量只能被 never 类型所赋值。

never 类型⼀般⽤来指定那些总是会抛出异常、⽆限循环

```JS
let a:never;
a = 123; // 错误的写法
a = (() => { // 正确的写法
throw new Error('错误');
})()
// 返回never的函数必须存在⽆法达到的终点
function error(message: string): never {
throw new Error(message);
}
```

### 1.2.11 object

对象类型，⾮原始类型，常⻅的形式通过 {} 进⾏包裹

```JS
let obj:object;
obj = {name: 'Wang', age: 25};
```

## 1.3 总结
和 javascript 基本⼀致，也分成：
- 基本类型
- 引⽤类型

在基础类型上， typescript 增添了 void 、 any 、 emum 等原始类型