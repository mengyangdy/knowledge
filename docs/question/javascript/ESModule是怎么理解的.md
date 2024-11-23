---
title: ESModule是怎么理解的?
tags:
  - js
  - 面试题
date: 2024-06-10
---

# 一 ESModule是怎么理解的?

## 1.1 介绍

模块，（Module），是能够单独命名并独⽴地完成⼀定功能的程序语句的集合（即程序代码和数据结的集合体）

两个基本的特征：外部特征和内部特征
- 外部特征是指模块跟外部环境联系的接⼝（即其他模块或程序调⽤该模块的⽅式，包括有输⼊输出参数、引⽤的全局变量）和模块的功能
- 内部特征是指模块的内部环境具有的特点（即该模块的局部数据和程序代码）

### 1.1.1 为什么需要模块化

代码抽象
- 代码封装
- 代码复⽤
- 依赖管理
如果没有模块化，我们代码会怎样？
- 变量和⽅法不容易维护，容易污染全局作⽤域
- 加载资源的⽅式通过script标签从上到下。
- 依赖的环境主观逻辑偏重，代码较多就会⽐较复杂。
- ⼤型项⽬资源难以维护，特别是多⼈合作的情况下，资源的引⼊会让⼈奔溃

因此，需要⼀种将 JavaScript 程序模块化的机制，如
- CommonJs (典型代表：node.js早期)
- AMD (典型代表：require.js)
- CMD (典型代表：sea.js)

### 1.1.2 AMD

Asynchronous ModuleDefinition （AMD），异步模块定义，采⽤异步⽅式加载模块。所有依赖模块的语句，都定义在⼀个回调函数中，等到模块加载完成之后，这个回调函数才会运⾏

代表库为 require.js

```JS
 /** main.js ⼊⼝⽂件/主模块 **/
 // ⾸先⽤config()指定各模块路径和引⽤名
 require.config({
 baseUrl: "js/lib",
 paths: {
 "jquery": "jquery.min", //实际路径为js/lib/jquery.min.js
 "underscore": "underscore.min",
 }
 });
 // 执⾏基本操作
 require(["jquery","underscore"],function($,_){
 // some code here
 });
```

### 1.1.3 CommonJS

CommonJS 是⼀套 Javascript 模块规范，⽤于服务端

```JS
 // a.js
 module.exports={ foo , bar}
 // b.js
 const { foo,bar } = require('./a.js')
```

其有如下特点：
- 所有代码都运⾏在模块作⽤域，不会污染全局作⽤域
- 模块是同步加载的，即只有加载完成，才能执⾏后⾯的操作
- 模块在⾸次执⾏后就会缓存，再次加载只返回缓存结果，如果想要再次执⾏，可清除缓存
- require 返回的值是被输出的值的拷⻉，模块内部的变化也不会影响这个值

既然存在了 AMD 以及 CommonJs 机制， ES6 的 Module ⼜有什么不⼀样？

ES6 在语⾔标准的层⾯上，实现了 Module ，即模块功能，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通⽤的模块解决⽅案

CommonJS 和 AMD 模块，都只能在运⾏时确定这些东西。⽐如， CommonJS 模块就是对象，输⼊时必须查找对象属性

```JS
 // CommonJS模块
 let { stat, exists, readfile } = require('fs');
 // 等同于
 let _fs = require('fs');
 let stat = _fs.stat;
 let exists = _fs.exists;
 let readfile = _fs.readfile;
```

ES6 设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输⼊和输出的变量

```JS
 // ES6模块
 import { stat, exists, readFile } from 'fs';
```

上述代码，只加载3个⽅法，其他⽅法不加载，即 ES6 可以在编译时就完成模块加载

由于编译加载，使得静态分析成为可能。包括现在流⾏的 typeScript 也是依靠静态分析实现功能

## 1.2 使用

ES6 模块内部⾃动采⽤了严格模式，这⾥就不展开严格模式的限制，毕竟这是 ES5 之前就已经规定好

模块功能主要由两个命令构成：
- export ：⽤于规定模块的对外接⼝
- import ：⽤于输⼊其他模块提供的功能

### 1.2.1 export

⼀个模块就是⼀个独⽴的⽂件，该⽂件内部的所有变量，外部⽆法获取。如果你希望外部能够读取模块内部的某个变量，就必须使⽤ export 关键字输出该变量

```JS
 // profile.js
 export var firstName = 'Michael';
 export var lastName = 'Jackson';
 export var year = 1958;
 或
 // 建议使⽤下⾯写法，这样能瞬间确定输出了哪些变量
 var firstName = 'Michael';
 var lastName = 'Jackson';
 var year = 1958;
 export { firstName, lastName, year };
```

输出函数或类

```JS
 export function multiply(x, y) {
 return x * y;
 };
```

通过 as 可以进⾏输出变量的重命名

```JS
 function v1() { ... }
 function v2() { ... }
 export {
 v1 as streamV1,
 v2 as streamV2,
 v2 as streamLatestVersion
 };
```

### 1.2.2 import

使⽤ export 命令定义了模块的对外接⼝以后，其他 JS ⽂件就可以通过 import 命令加载这个模块

```JS
 // main.js
 import { firstName, lastName, year } from './profile.js';
 function setName(element) {
 element.textContent = firstName + ' ' + lastName;
 }
```

同样如果想要输⼊变量起别名，通过 as 关键字

```JS
import { lastName as surname } from './profile.js';
```

当加载整个模块的时候，需要⽤到星号 *

```JS
 // circle.js
 export function area(radius) {
 return Math.PI * radius * radius;
 }
 export function circumference(radius) {
 return 2 * Math.PI * radius;
 }
 // main.js
 import * as circle from './circle';
 console.log(circle) // {area:area,circumference:circumference}
```

输⼊的变量都是只读的，不允许修改，但是如果是对象，允许修改属性

```JS
 import {a} from './xxx.js'
 a.foo = 'hello'; // 合法操作
 a = {}; // Syntax Error : 'a' is read-only;
```

不过建议即使能修改，但我们不建议。因为修改之后，我们很难差错

import 后⾯我们常接着 from 关键字， from 指定模块⽂件的位置，可以是相对路径，也可以是绝对路径

```JS
import { a } from './a';
```

如果只有⼀个模块名，需要有配置⽂件，告诉引擎模块的位置

```JS
import { myMethod } from 'util';
```
在编译阶段， import 会提升到整个模块的头部，⾸先执⾏

```JS
foo();
import { foo } from 'my_module';
```

多次重复执⾏同样的导⼊，只会执⾏⼀次

```JS
import 'lodash';
import 'lodash';
```

上⾯的情况，⼤家都能看到⽤⼾在导⼊模块的时候，需要知道加载的变量名和函数，否则⽆法加载

如果不需要知道变量名或函数就完成加载，就要⽤到 export default 命令，为模块指定默认输出

```JS
// export-default.js
export default function () {
console.log('foo');
}
```

加载该模块的时候， import 命令可以为该函数指定任意名字

```JS
// import-default.js
import customName from './export-default';
customName(); // 'foo'
```

### 1.2.3 动态加载

允许您仅在需要时动态加载模块，⽽不必预先加载所有模块，这存在明显的性能优势

这个新功能允许您将 import() 作为函数调⽤，将其作为参数传递给模块的路径。 它返回⼀个promise ，它⽤⼀个模块对象来实现，让你可以访问该对象的导出

```JS
import('/modules/myModule.mjs')
.then((module) => {
// Do something with the module.
});
```

### 1.2.4 复合写法

如果在⼀个模块之中，先输⼊后输出同⼀个模块， import 语句可以与 export 语句写在⼀起

```JS
export { foo, bar } from 'my_module';
// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```

同理能够搭配 as 、 * 搭配使⽤



