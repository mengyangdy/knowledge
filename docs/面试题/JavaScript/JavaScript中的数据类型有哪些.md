---
title: JavaScript中的数据类型有哪些?
tags:
  - js
  - 面试题
date: 2024-06-11
---

# JavaScript中的数据类型有哪些?

## 1 前⾔

在 JavaScript 中，我们可以分成两种类型：
- 基本类型
- 复杂类型

两种类型的区别是：存储位置不同

## 2 基本类型

基本类型主要为以下6种：
- Number
- String
- Boolean
- Undefined
- null
- symbol
- bigint

### 2.1 Number

数值最常⻅的整数类型格式则为⼗进制，还可以设置⼋进制（零开头）、⼗六进制（0x开头）

```JS
let intNum = 55 // 10进制的55
let num1 = 070 // 8进制的56
let hexNum1 = 0xA //16进制的10
```

浮点类型则在数值汇总必须包含⼩数点，还可通过科学计数法表⽰

```JS
let floatNum1 = 1.1;
let floatNum2 = 0.1;
let floatNum3 = .1; // 有效，但不推荐
let floatNum = 3.125e7; // 等于 31250000
```

在数值类型中，存在⼀个特殊数值 NaN ，意为“不是数值”，⽤于表⽰本来要返回数值的操作失败了（⽽不是抛出错误）

```JS
console.log(0/0); // NaN
console.log(-0/+0); // NaN
```

### 2.2 Undefined

Undefined 类型只有⼀个值，就是特殊值 undefined 。当使⽤ var 或 let 声明了变量但没有初始化时，就相当于给变量赋予了 undefined 值

```JS
let message;
console.log(message == undefined); // true
```

包含 undefined 值的变量跟未定义变量是有区别的

```JS
let message; // 这个变量被声明了，只是值为 undefined
console.log(message); // "undefined"
console.log(age); // 没有声明过这个变量，报错
```

### 2.3 String

字符串可以使⽤双引号（"）、单引号（'）或反引号（`）标⽰

```JS
let firstName = "John";
let lastName = 'Jacob';
let lastName = Jingleheimerschmidt
```

字符串是不可变的，意思是⼀旦创建，它们的值就不能变了

```JS
let lang = "Java";
lang = lang + "Script"; // 先销毁再创建
```

### 2.4 Null

Null 类型同样只有⼀个值，即特殊值 null

逻辑上讲， null 值表⽰⼀个空对象指针，这也是给 typeof 传⼀个 null 会返回 "object" 的原因

```JS
let car = null;
console.log(typeof car); // "object"
```

undefined 值是由 null 值派⽣⽽来

```JS
console.log(null == undefined); // true
```
只要变量要保存对象，⽽当时⼜没有那个对象可保存，就可⽤ null 来填充该变量

### 2.5 Boolean

Boolean （布尔值）类型有两个字⾯值： true 和 false

通过 Boolean 可以将其他类型的数据转化成布尔值
规则如下：

|数据类型 | 转换为false | 转换为true |
|--- | --- |---|
|String|''|非空字符串|
|Number|0/NaN|⾮零数值（包括⽆穷值）|
|Object|null|任意对象|
|Undefined|undefined|N/A(不存在)|

### 2.6 Symbol

Symbol （符号）是原始值，且符号实例是唯⼀、不可变的。符号的⽤途是确保对象属性使⽤唯⼀标识符，不会发⽣属性冲突的危险

```JS
let genericSymbol = Symbol();
let otherGenericSymbol = Symbol();
console.log(genericSymbol == otherGenericSymbol); // false
let fooSymbol = Symbol('foo');
let otherFooSymbol = Symbol('foo');
console.log(fooSymbol == otherFooSymbol); // false
```

### 2.7 BigInt

BigInt（ES6引入）: 大整数类型，用来安全地存储和操作大于 2^53 - 1（Number.MAX_SAFE_INTEGER）的大整数

## 3 引⽤类型

复杂类型统称为 Object ，我们这⾥主要讲述下⾯三种：
- Object
- Array
- Function

### 3.1 Object

创建 object 常⽤⽅式为对象字⾯量表⽰法，属性名可以是字符串或数值

```JS
let person = {
name: "Nicholas",
"age": 29,
5: true
};
```

### 3.2 Array

JavaScript 数组是⼀组有序的数据，但跟其他语⾔不同的是，数组中每个槽位可以存储任意类型的数据。并且，数组也是动态⼤⼩的，会随着数据添加⽽⾃动增⻓

```JS
let colors = ["red", 2, {age: 20 }]
colors.push(2)
```

### 3.3 Function

函数实际上是对象，每个函数都是 Function 类型的实例，⽽ Function 也有属性和⽅法，跟其他引⽤类型⼀样

函数存在三种常⻅的表达⽅式：
- 函数声明

```JS
// 函数声明
function sum (num1, num2) {
return num1 + num2;
}
```

- 函数表达式

```JS
let sum = function(num1, num2) {
return num1 + num2;
};
```

- 箭头函数

```JS
// 函数声明和函数表达式两种⽅式
let sum = (num1, num2) => {
return num1 + num2;
};
```

### 3.4 其他引⽤类型

除了上述说的三种之外，还包括 Date 、 RegExp 、 Map 、 Set 等......

## 4 存储区别

基本数据类型和引⽤数据类型存储在内存中的位置不同：
- 基本数据类型存储在栈中
- 引⽤类型的对象存储于堆中

当我们把变量赋值给⼀个变量时，解析器⾸先要确认的就是这个值是基本类型值还是引⽤类型值

下⾯来举个例⼦

### 4.1 基本类型

```JS
let a = 10;
let b = a; // 赋值操作
b = 20;
console.log(a); // 10值
```

a 的值为⼀个基本类型，是存储在栈中，将 a 的值赋给 b ，虽然两个变量的值相等，但是两个变量保存了两个不同的内存地址

下图演⽰了基本类型赋值的过程：

![](https://f.pz.al/pzal/2024/06/11/f8a6449fe01c2.png)

### 4.2 引⽤类型

```JS
var obj1 = {}
var obj2 = obj1;
obj2.name = "Xxx";
console.log(obj1.name); // xxx
```

引⽤类型数据存放在堆中，每个堆内存对象都有对应的引⽤地址指向它，引⽤地址存放在栈中。

obj1 是⼀个引⽤类型，在赋值操作过程汇总，实际是将堆内存对象在栈内存的引⽤地址复制了⼀份给了 obj2 ，实际上他们共同指向了同⼀个堆内存对象，所以更改 obj2 会对 obj1 产⽣影响

下图演⽰这个引⽤类型赋值过程

![](https://f.pz.al/pzal/2024/06/11/5258ad4cfef78.png)

## 5 ⼩结
- 声明变量时不同的内存地址分配：
	- 简单类型的值存放在栈中，在栈中存放的是对应的值
	- 引⽤类型对应的值存储在堆中，在栈中存放的是指向堆内存的地址
- 不同的类型数据导致赋值变量时的不同：
	- 简单类型赋值，是⽣成相同的值，两个对象对应不同的地址
	- 复杂类型赋值，是将保存对象的内存地址赋值给另⼀个变量。也就是两个变量指向堆内存中同⼀个对象