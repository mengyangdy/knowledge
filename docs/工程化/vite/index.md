---
title: vite学习（一）
tags:
  - vite
date: 2024-03-23
cover: https://s2.loli.net/2023/09/29/VYdjJzhAnx5IelH.jpg
---
# vite基础学习

> 最近所使用的项目都是基于`vite`开发的，相比于`webpack`来说开发速度确实是提升了一大截，所以来学习一下`vite`的一些原理。

## 1. 前端工程化

在现在的前端项目开发过程中，构建工具给我们带来了非常多的帮助，可以说现代的前端项目中**构建工具已经成为了前端工程项目的标配了。**

如今的前端构建工具有很多种，有远古时代的`browserify`、`grunt`，有传统的`webpack`、`rollup`、`Parcel`，也有现代的`Esbuild`、`vite`等等，不仅是种类繁多，更新也非常的快。

无论**工具层面上如何的更新，他们的解决问题的核心，即前端工程的痛点是不变的**。因此，想要知道那个工具好用，就要看他解决了前端工程痛点的效果。

- 前端工程有哪些痛点呢？
	-  首先是前端的**模块化需求**，业界的模块化标准非常多，包括ESM、CommonJS、AMD和CMD等等，前端工程一方面需要落实这些模块规范，保证模块正常加载，另一方面需要兼容不同的模块规范，以适应不同的执行环境。
	- 其次是**浏览器兼容，编译高级语法**，由于浏览器的实现规范所限，只要高级语言/语法（TypeScript，JSX）想要在浏览器中正常运行，就必须被转化为浏览器可以理解的形式，这都需要工具链层面的支持，而且这个需求是一直存在的。
	- 再者是**线上代码的质量**问题，和开发阶段的考虑侧重点不同，生产环境中，我们不仅仅要考虑代码的`安全性`、`兼容性`的问题，保证线上代码的正确运行，也需要考虑代码运行时的性能问题，由于浏览器的版本众多，代码兼容性和安全策略各不相同，线上代码的质量问题也将是前端工程中长期存在的一个痛点。
	- 同时，`开发效率`也不容忽视，我们知道，**项目的冷启动/二次启动时间，热更新时间**都可能严重的影响开发效率，尤其是当项目越来越庞大的时候，因此，提高项目的启动速度和热更新速度也是前端工程的重要需求。

那么我们的前端构建工具是如何解决以上的问题呢？

![](https://my-vitepress-blog.sh1a.qingstor.com/202403231812542.png)

- 模块化方面，提供模块加载方案，并兼容不同的模块规范
- 语法转移方面，配合`sass`、`TSC`、`Babel`等前端工具链，完成高级语法的转译功能，同时对于静态资源也能进行处理，使之能作为一个模块正常加载。
- 产物质量方面，在生产环境，配合`Terser`等压缩工具进行代码压缩和混淆，通过`Tree Shaking`删除未使用的代码，提交对于低版本浏览器和语法降级处理等等。
- 开发效率方面，构建工具本身通过各种方式来进行性能优化，包括`使用原生语言Go/Rust、no-bundle`等等等思路，提高项目的启动性能和热更新速度。

### 1.1 为什么Vite是当前最高效的构建工具

首先是开发效率，传统构建工具普遍的缺点就是太慢了，与之相比，Vite能将项目的启动性能提升一个量级，并且达到毫秒级的瞬间热更新效果。

和webpack相比，在工作中可以发现，一般的项目使用webpack之后，启动花个几分钟的时间都是很常见的事情，热更新也经常需要等待十秒以上，这主要是因为：
- 项目冷启动时必须递归打包整个项目的依赖树
- JavaScript语言本身的性能限制，导致构建性能遇到瓶颈，直接影响开发效率。

这样一来，代码改动后不能立马看到效果，自然开发体验也越来越差，而其中，最占用时间的就是代码打包和文件编译。

而vite很好的解决了这个问题，一方面，vite在开发阶段基于浏览器原生ESM的支持实现了`no-bubdle`服务，另一方面借助ESBuild超快的编译速度来做第三方库构建和TX/JSX语法编译，从而能够有效提高开发效率。

除了开发效率，在其他三个纬度上，vite也表现不俗：
- 模块化方面，vite基于浏览器原生ESM的支持实现模块加载，并且无论是开发环境还是生产环境，都可以将其他格式的产物（CommonJS）转为ESM的。
- 语法转译方面，vite内置了对TypeScript、JSX、Sass等高级语法的支持，也能够加载各种各样的静态资源，如图片、Worker等等。
- 产物质量方面，vite基于成熟的打包工具Rollup实现生产环境打包，同时可以配合`Terser`、`Babel`等工具链，可以极大成都保证构建产物的质量。

## 2. 前端模块化

2002年的AJAX诞生至今，前端从刀耕火种的年代，经历了一系列的发展，各种标准和工具百花齐放，自从2009年的`Node.js`诞生，前端先后出现了`CommonJS`、`AMD`、`CMD`、`UMD`和`ES Module`等模块规范，底层规范的发展催生出了一系列工具链的创新，比如`AMD`规范提出时社区诞生了模块加载工具`requireJS`，基于`CommonJS`规范的模块打包工具`browserify`，还有能让用户提前用上`ES Module`语法的JS编译器`Babel`、兼容各种模块规范的重量级打包工具`webpack`以及基于浏览器原生`ES Module`支持而实现的`no-bundle`构建工具`Vite`等等。

![](https://my-vitepress-blog.sh1a.qingstor.com/202403232109860.png)

总体而言，业界经历了一系列由规范、标准引领工程化改革的过程，构建工具作为前端工程化的核心要素，与底层的前端模块化规范和标准息息相关。

### 2.1 无模块化标准阶段

早在模块化标准还没有诞生的时候，前端界已经产生了一些模块化的开发手段，如`文件划分`、`命名空间`、`IIFE私有作用域`

#### 2.1.1 文件划分
文件划分方式是最原始的模块化实现，简单来说就是将应用的状态和逻辑分散到不同的文件中，然后通过HTML中的scripts来意一一引入，下面就是一个通过`文件划分`实现模块化的具体例子：

```js
// module a.js
let data='this is data'

// module b.js
function sum(a, b) {
  console.log(a)
  console.log(b)
}

// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Document</title>
  </head>
  <body>
    <script src="./a.js"></script>
    <script src="./b.js"></script>
    <script>
      console.log(data)

      sum(1, 2)
    </script>
  </body>
</html>
```

从上面我们可以看到`module-a`和`module-b`为两个不同的模块，通过两个script标签分别引入到HTML中，这么做看似是分散了不同模块的状态和运行逻辑，但是实际上也隐藏着一些风险因素：
- 模块变量相当于在全局声明和定义，会有变量名冲突的问题，比如`module-b`可能也存在`data`变量，这就会和`module-a`中的变量冲突。
- 由于变量都在全局定义的，我们很难知道某个变量到底属于哪个模块，因此也给调试带来了困难。
- 无法清晰地管理模块之间的依赖关系和加载顺序，假如`module-a`依赖`module-b`，那么上述的HTML的script执行顺序需要手动调整，不然可能会产生运行时错误。

#### 2.1.2 命名空间

`命名空间`是模块化的另一种实现手段，它可以解决上述文件划分方式中`全局变量定义`所带来的一系列问题，下面是一个简单的例子：

```js
// module a
window.moduleA = {
  data: "this is data A",
  sum: function () {
    console.log("this is module A sum")
  },
}

// module b
window.moduleB = {
  data: "this is data B",
  sum: function () {
    console.log("this is module B sum")
  },
}

// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Document</title>
  </head>
  <body>
    <script src="./a.js"></script>
    <script src="./b.js"></script>
    <script>
      console.log(moduleA.data)
      moduleB.sum()
    </script>
  </body>
</html>
```

这样一来，每个变量都有自己专属的命名空间，我们可以清楚地知道某个变量到底属于哪个`模块`,同时也避免全局变量命名的问题。

#### 2.1.3 IIFE（立即执行函数）

相比于`命名空间`的模块化手段，`IIFE`实现的模块化安全性更要高，对于模块作用域的区分更加彻底，可以参考如下`IIFE实现模块化`的例子：

```js
// module a
(function () {
 let data = "moduleA";
 function sum() {
 console.log(data + "execute");
 }
 window.moduleA = {
 sum: sum,
 };
})();

// module b
(function () {
 let data = "moduleB";
 function sum() {
 console.log(data + "execute");
 }
 window.moduleB = {
 sum: sum,
 };
})();

// index.html
<!DOCTYPE html>
<html lang="en">
 <head>
 <meta charset="UTF-8" />
 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 <title>Document</title>
 </head>
 <body>
 <script src="./module-a.js"></script>
 <script src="./module-b.js"></script>
 <script>
 // 此时 window 上已经绑定了 moduleA 和 moduleB
 console.log(moduleA.data);
 moduleB.sum();
 </script>
 </body>
</html>
```

我们知道，每个`IIFE`即立即执行函数都会创建一个私有的作用域，在私有作用域的变量外界无法访问的，只有模块内部的方法才能访问，对于上述的`module-a`中来说，对于其他的`data`变量，我们只能在模块内部的`sum`函数中通过闭包访问，而在其他模块中无法直接访问，这就是模块`私有成员`功能，避免模块私成员被其他模块非法篡改，相比于`命名空间`的视线方式更加安全。

但是无论是`命名空间`还是`IIFE`，都是为了解决全局变量所带来的命名冲突以及作用域不明确的问题，也就是在`文件划分方式`从所总结的`问题1`和`问题2`,而并没有真正解决另外一个问题-**模块加载**，如果模块间存在依赖关系，那么script标签的加载顺序就需要受到严格的控制，一旦顺序不对，就会产生运行时BUG。

而随着前端工程的日益庞大，各个模块之间项目依赖已经是非常常见的事情，模块加载的需求已经成为了业界刚需，而以上几种非标准化手段不能满足这个需求，因此我们需要制定一个行业标准去统一前端代码的模块化。

不过前端的模块化规范统一也经历也漫长的发展阶段，即便是到了现在也没有实现完全的统一，接下来，我们就来熟悉一下业界主流的三大模块规范：`CommonJS`、`AMD`、`ES Module`。

### 2.2 CommonJS规范

CommonJS是业界最早正式提出的JavaScript模块规范，主要用于服务端，随着Node.js越来越普及，这个规范也被业界广泛应用，对于模块规范而言，一般会包含两个方面的内容：
- 统一的模块化代码规范
- 实现自动加载模块的加载器（也称之为`loader`）

对于CommonJS模块本身，相信有Node.js使用经验的同学都不陌生：

```ts
// module-a
const data = `hello world`

function getData() {
  return data
}

module.exports = {
  getData
}

// index.js
const { getData } = require('./module-a.js')
console.log(getData())
```

代码中使用了`require`来导入一个模块，用`module.exports`来导入一个模块，实际上`Node.js`内部会有响应的loader转译模块代码，最后模块代码会被处理成下面这样：

```js
;(function (exports, require, module, __filename, __dirname) {
  //执行模块代码
  //返回exports对象
})
```

对于ConnonJS而言，一方面它定义了一套完整的模块化代码规范，另一方面`Node.js`为之实现了自动加载模块的`loader`，看上去是一个不错的模块规范，但是也存在一些问题：

模块加载器由`Node.js`提供，依赖了`Node.js`本身的功能实现，比如文件系统，如果CommonJS模块直接放到浏览器中是无法执行的，当然，业界也产生了[browserify/browserify: browser-side require() the node.js way (github.com)](https://github.com/browserify/browserify),这种打包工具来支持打包CommonJS模块，从而顺利的在浏览器中执行，相当于社区实现了一个第三方的loader。

CommonJS本身约定以同步的方式进行模块jx在，这种加载机制放在服务端是没有问题的，依赖模块都在本地，不需要进行网络IO，二来只有服务启动时才会加载模块，而服务通常启动后会一直运行，所以对服务的性能并没有太大的影响，但如果这种加载机制放到浏览器端，会带来明显的性能问题，他会产生大量同步的模块请求，浏览器要等到响应返回后才能继续解析模块。也就是说，**模块请求会造成浏览器JS解析过程的阻塞**，导致页面加载速度缓慢。

总之，CommonJS是一个不太合适在浏览器中运行的模块规范，因此，业界也设计除了全新的规范来作为浏览器的模块标准，最致命的要数`AMD`了。

### 2.3 AMD规范

`AMD`全称为`Asynchronous Module Definition`，即异步模块定义规范，模块根据这个规范，在浏览器环境中被异步加载，而不会像`CommonJS`规范进行同步加载，也就不会产生同步请求导致的浏览器解析过程阻塞的问题了，我们先来看看这个模块规范是如何来使用的：

```js
// print.js
define(function () {
  return {
    print: function (msg) {
      console.log('print: ' + msg)
    }
  }
})

//main.js
define(['./print'], function (printModule) {
  printModule.print('main')
})
```

在`AMD`规范当中，我们可以通过define去定义或加载一个模块，比如上面的`main`模块和`print`模块，如果模块需要导出一些成员需要通过在定义模块的函数中return 出去，如果当前模块依赖了一些其他模块则可以通过define的第一个参数来声明依赖，这样模块的代码执行之前浏览器会先**加载依赖模块**。

当然，我们也可以使用require关键字来加载一个模块，比如：

```js
require(['./print'], function (printModule) {
  printModule.print('main')
})
```

不过require与define的区别在于前者只能加载模块，而不能**定义一个模块**。

由于没有得到浏览器的原生支持，AMD规范需要由第三方的loader来实现， 最经典的就是[requirejs/requirejs: A file and module loader for JavaScript (github.com)](https://github.com/requirejs/requirejs)库了，它完整的实现了AMD规范，至今依然有不少的项目在使用。

不过AMD规范使用起来稍显复杂，代码阅读和书写比较困难，因此，这个规范并不能成为前端模块化的终极解决方案，妗妗是社区中提出的一个妥协性的方案，关于新的模块化规范的探索，业界扔从未停止脚步。

### 2.4 CMD规范

同期出现的规范当中也有CMD规范，这个规范是由淘宝出品的`SeaJS`实现的，解决的问题和`AMD`一样，不过随着社区的不断发展，SeaJS已经被`requireJS`兼容了。

### 2.5 UMD规范

> 当然，你可能也听说过`UMD`（Universal Module Definition）规范，其实它并不算一个新的规范，只是兼容AMD和CommonJS的一个模块化方案，可以同时运行在浏览器和Node.js环境，顺便提一句，后面要介绍的ES Module也具备这种跨平台的能力。

### 2.6 ES6 Module

ES6 Module也被称作`ES Module`或者`ESM`，是由ECMAScript官方提出的模块化规范，作为一个官方提出的规范，`ES Module`已经得到了现代浏览器的内置支持，在现代浏览器中，如果在HTML中加入含有`type='module'`属性的script标签，name浏览器会按照ESModule规范来进行依赖加载和模块解析，这也是vite在开发阶段实现no-bundle的原因，由于模块加载的任务交给了浏览器，即使不打包也可以顺序运行模块代码。

不仅如此，一直依赖CommonJS作为模块标准的Node.js也紧跟着ESModul的发展步伐，从`12.20`版本开始正式支持原生ESModul，也就是说，如今ESModule能够同时在浏览器与Node.js环境中执行，拥有天然的跨平台的能力。

```js
// module a
const sum = () => {
  console.log('a')
}
export { sum }

// module-b
import { sum } from './module-a'

sum()
```

如果在Node.js环境中，可以在`packag.json`中声明`type:'module'`属性：

```json
{
  "type": "module"
}
```

然后Node.js便会默认以ESModule规范去解析模块。

顺便说一句，在Node.js中，即使在CommonJS模块里面，也可以通过`import`方法顺利加载ES模块，如下所示：

```js
async function func() {
  //加载一个ES模块
  //文件名后缀需要是mjs
  const { a } = await import('./module-a.mjs')
  console.log(a)
}
func()
module.exports = {
  func
}
```

ESModule作为ECMAScript官方提出的规范，经过几年的发展，不仅得到了众多浏览器的原生支持，也在Node.js中得到原生支持，是一个能够跨平台的模块规范，同时，它也是社区各种生态库的发展趋势，尤其是被如今大火的构建工具Vite所深度应用，可以说，ESModule前景一片光明，成为前端大一统的模块标准指日可待。

## 3. vite使用-搭建项目

### 3.1 项目搭建

首先需要的是代码编辑器和浏览器，推荐安装`VSCode`和`Chrome`浏览器，其次安装的是Node.js，推荐安装的是`12.0.0`以上的版本，包管理工具也是推荐使用`pnpm`

由于默认的镜像源在国外，包下载速度和稳定性都不太好，因此建议换成国内的镜像源，这样`pnpm install`命令的体验会好很多，命令如下：
```shell
pnpm config set registry https://registry.npmmirror.com/
```

### 3.2 项目初始化

在搭建了基础的开发环境之后，我们进入到了`项目初始化阶段`,可以在终端命令中输入如下的命令：

```shell
pnpm create vite
```

在执行完这个命令之后，pnpm首先会自动下载`create-vite`这个第三方的包，然后执行这个包中的项目初始化逻辑，因此，我们可以看到这样的交互界面：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403232228495.png)

后续的交互流程如下：

- 输入项目名称
- 选择前端框架
- 选择开发语言

```text
✔ Project name: react-demo
? Select a framework: › - Use arrow-keys. Return to submit.
vanilla // 无前端框架
vue // 基于 Vue
> react // 基于 React
preact // 基于 Preact（一款精简版的类 React 框架）
lit // 基于 lit（一款 Web Components 框架）
svelte // 基于 Svelte
```

然后选择框架和语言之后，脚手架的模版已经生成完毕了，可以执行如下命令在本地启动项目：

```text
// 进入项目目录
cd react-demo
// 安装依赖
pnpm install
// 启动项目
pnpm run dev
```

之后执行pnpm run dev之后看到如下界面，表示项目已经启动成功了：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403232232734.png)

我们去浏览器打开`http://localhost:5173`页面，可以看到：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403232233422.png)

至此我们已经成功的搭建了一个React项目，利用Vite来初始化一个前端项目非常的简单，Vite给我们的第一感觉就是简洁、轻量、快速。

### 3.3 项目入口加载

Vite初始化项目后，项目的目录结构如下：

```text
├─.eslintrc.cjs
├─.gitignore
├─index.html
├─package.json
├─pnpm-lock.yaml
├─README.md
├─vite.config.js
├─src
|  ├─App.css
|  ├─App.jsx
|  ├─index.css
|  ├─main.jsx
|  ├─assets
|  |   └react.svg
├─public
|   └vite.svg
```

只得注意的是：在项目根目录中有一个`index.html`文件，这个文件非常关键，因为Vite默认会把项目根目录下的`index.html`作为入口文件，也就是说，当你访问`http://localhost:3000`的时候，Vite的Dev Server会自动返回这个html文件的内容，我们看下这个HTML写了什么:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link
      rel="icon"
      type="image/svg+xml"
      href="/vite.svg"
    />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script
      type="module"
      src="/src/main.jsx"
    ></script>
  </body>
</html>
```

可以看到这个HTML文件的内容非常简洁：在`body`标签中除了id为root的根节点，还包含了声明`type='module'`的script标签：

```js
<script
  type="module"
  src="/src/main.jsx"
></script>
>```

由于现代浏览器原生支持ES模块规范，因此原生的ES语法也可以直接放到浏览器中执行，只需要在script标签中声明`type='module'`即可，比如上面的script标签就声明了`type='module'`，同时src指向了`src/main.tsx`文件，此时相当于请求了`http://localhost:3000/src/main.tsx`这个资源，Vite的Dev Server此时会接受到这个请求，然后读取对应的文件内容，进行一定的中间处理，最后将处理的结果返回给浏览器。

![](https://my-vitepress-blog.sh1a.qingstor.com/202403232243804.png)

我们来看下`main.jsx`的内容：

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

到这里可能会有些疑问了，浏览器并不识别jsx语法，也无法直接import css文件，上面这段代码究竟是如何被浏览器正常执行的呢？

这就归功于Vite Dev Server所做的中间处理了，也就是说，在读取到`main.jsx`文件的内容之后，vite会对文件的内容进行编译，大家可以从Chrome的网络调试面板看到编译后的结果：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403232248383.png)

vite会将项目的源代码编译生浏览器可以识别的代码，与此同时，一个import语句即代表了一个HTTP请求，如下面两个import语句：

```js
import App from './App.jsx'
import './index.css'
```

需要注意的是，在Vite项目中，**一个import语句即代表一个HTTP请求**，上述两个语句则分别代表了两个不同的请求，Vite Dev Server会读取本地文件，返回浏览器可以解析的代码，当浏览器解析到新的import语句，又会发出新的请求，以此类推，直到所有的资源都加载完毕。

Vite所倡导的`no-bndle`里面的真正含义：利用浏览器原生ES模块的支持，实现开发者阶段的Dev Server，进行模块的按需加载，而不是先整体打包在进行加载，相比webpack这种必须打包再加载的传统构建模式，Vite在开发阶段省略了繁琐且耗时的打包过程，这也是它为什么快的一个原因。

### 3.4 vite配置文件

在使用vite的过程中，我们需要对vite做一些配置，以满足日常开发的需求，我们可以通过两种方式来对vite进行配置，一是通过命令行参数，如`vite --port=8888`，二是通过配置文件，一般情况下，大多数的配置都通过配置文件的方式来声明。

vite当中支持多种配置文件类型，包括`.js`、`.ts`、`.mjs`三种后缀的文件，实际项目中一般使用`vite.config.ts`作为配置文件，具体的配置代码如下：

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()]
})
```

可以看到配置文件中默认在`plugins`数组中配置了官方的react插件，来提供React项目编译和热更新的功能。

如果我们页面的入口文件`index.html`并不在项目的根目录下，而需要放到`src`目录下，如何在访问`localhost:3000`的时候让vite自动返回src目录下的`index.html`ne ?我们可以通过参数配置项目根目录的位置：

```js
// vite.config.ts
import { defineConfig } from 'vite'
// 引入 path 包注意两点:
// 1. 为避免类型报错，你需要通过 `pnpm i @types/node -D` 安装类型
// 2. tsconfig.node.json 中设置 `allowSyntheticDefaultImports: true`，以允许下面的 default 导入方式
import path from 'path'
import react from '@vitejs/plugin-react'
export default defineConfig({
 // 手动指定项目根目录位置
 root: path.join(__dirname, 'src')
 plugins: [react()]
})
```

当手动指定`root`参数之后，vite会自动从这个路径寻找`index.html`文件，也就是说当我直接访问`localhost:3000`的时候，vite从`src`目录下读取入口文件，这样就成功实现了刚才的需求。

### 3.5 生产环境构建

在开发环境Vite通过Dev Server实现了不打包的特性，而在生产环境中，Vite依然会基于Rollup进行打包，并采取一系列的打包优化手段，从脚手架项目的`package.json`中就可见一斑：

```js
"scripts":{
//开发阶段驱动 Vite Dev Server
"dev": "vite",
// 生产环境打包
"build": "tsc && vite build",
// 生产环境打包完预览产物
"preview": "vite preview"
}
```

这其中的build命令就是vite专门用来进行生产环境打包的，但是你可能会有疑惑，为什么在`vite build`命令之前要执行`tsc`呢？

`tsc`作为TypeScript的官方编译命令，可以来编译TypeScript代码并进行类型检查，而这里的作用主要是用来做类型检查的，我们可以从项目的`tsconfig.json`中注意到这样的一个配置：

```json
{
 "compilerOptions": {
 // 省略其他配置
 // 1. noEmit 表示只做类型检查，而不会输出产物文件
 // 2. 这行配置与 tsc --noEmit 命令等效
 "noEmit": true,
 },
}
```

虽然Vite提供了开箱即用的TypeScript以及JSX的编译能力，但是实际上底层并没有实现TypeScript的类型校验系统，因此需要借助`tsc`来完成类型校验（在Vue项目中使用`vue-tsc`这个工具来完成），在打包前提早暴露出类型相关的问题，保证代码的健壮性。

接下来我们可以试着执行一下这个打包命令：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403232341986.png)

此时Vite已经生成了最终的打包产物，我们可以通过`pnpm run preview`命令来预览一下打包产物的执行效果：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403232343710.png)

在浏览器中打开`localhost:4173`地址就可以看到和开发阶段一样的页面内容，证明我们成功完成第一个Vite项目的生产环境构建。

## 4. vite中使用现代化的css方案

### 4.1 使用样式方案的意义

开发前端的样式，首先我们想到的是直接写原生css，但是时间一长，难免会发现原生css开发的各种问题，哪么，如果我们不使用任何css工程方案，又会出现哪些问题呢？

1. 开发体验欠佳，比如原生css不支持选择器的嵌套：

```css
// 选择器只能平铺，不能嵌套
.container .header .nav .title .text {
  color: blue;
}
.container .header .nav .box {
  color: blue;
  border: 1px solid grey;
}
```

2. 样式污染问题，如果出现同样的类名，很容易造成不同的样式互相覆盖和污染：

```css
// a.css
.container {
{
 color: red;
}
// b.css
// 很有可能覆盖 a.css 的样式！
.container {
 color: blue;
}
```

3. 浏览器兼容性问题：

为了兼容不同的浏览器，我们需要对一些属性（如`transition`）加上不同的浏览器前缀，比如`--webkit11`、`-moz-`、`-ms-`、`-o-`，意味着开发着要针对同一个样式属性写上很多的冗余代码。

4. 打包后的体积问题：

如果不使用任何的css工程化方案，所有的css代码都将打包到产物中，即使有部分样式并没有在代码中使用，导致产物体积过大。

针对以上原生css的痛点，社区中诞生了不少解决方案，常见的有5类：

`css预处理器`：主流的包括`sass/scss`、`less`、`stylus`，这些方案各自定义了一套语法，让css也能使用嵌套规则，甚至能够像编程语言一样定义变量，写条件判断和循环语句，大大增强了样式语言的灵活性，解决原生css的**开发体验问题**。

`CSS Modules`：能将css类名处理成哈希值，这样就可以避免同名的情况下`样式污染`的问题。

`CSS后处理器PostCSS`：用来解析和处理css代码，可以实现的功能非常丰富，比如将`px`转化为`rem`，根据目标浏览器情况自动加上类似于`--moz--`、`-o-`的属性前缀等等。

`CSS in JS方案`：主流的包括`emotion`、`styled-components`等等，顾名思义，这类方案可以实现直接在JS中写样式代码，基本包含`CSS预处理器`和`CSS Modules`的各项优点，非常灵活，解决了开发体验和全局样式污染的问题。

`CSS原子化框架`：如`Tailwind CSS`、`Windi CSS`，通过类名来指定样式，大大简化了样式写法，提高了样式开发的效率，主要解决了**原生CSS开发体验**的问题。

不过，各种方案没有孰优孰劣，各自解决的方案有重叠的部分，但也有一定的差异，大家可以根据自己项目的痛点来引入。接下来，我们进入实战阶段，在Vite中应用上述常见的CSS方案。

### 4.2 CSS预处理器

Vite本身对CSS各种预处理器语言(`Sass/Scss`、`Less`和`Stylus`)做了内置的支持，也就是说，即使你不经过任何的配置也可以直接使用各种CSS预处理器，我们以`Sass/Scss`为例，来具体感受一下vite的`零配置`给我们带来的便利。

由于vite底层会调用css预处理的官方进行编译，二vite为了实现按需加载，并没有内置过这些工具库，而是让用户根据需要安装，因此，我们首先安装Sass的官方库：

```shell
pnpm i sass -D
```

然后在新建的项目中创建`src/components/Header`目录，并且分别新建`index.jsx`和`index.scss`文件，代码如下：

```js
// index.tsx
import './index.scss';
export function Header() {
 return <p className="header">This is Header</p>
};
// index.scss
.header {
 color: red;
}
```

这样就完成了一个最简单的demo组件，接着我们在`App.tsx`应用这个组件：

```js
import { Header } from './components/Header'
function App() {
  return (
    <div>
      <Header />
    </div>
  )
}
export default App
```

现在你可以执行`pnpm run dev`，然后到浏览器上查看效果：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403240008572.png)

如果页面上出现了红色的文字则说明`scss`的样式已经生效了，现在我们封装一个全局的主题色，新建`src/variable.scss`文件，内容如下：

```css
$theme-color: red;
```

然后，我们在原来Header组件中应用这个变量：

```css
@import '../../variable';
.header {
  color: $theme-color;
}
```

回到浏览器访问页面，可以看到样式依然生效，你可能会注意到，每次要使用`$theme-color`属性的时候我们都需要手动引入`variable.scss`文件，那么有没有自动引入的方案呢？这就需要在Vite中进行一些自定义配置了，在配置文件中增加如下的内容：

```js
// vite.config.ts
import { normalizePath } from 'vite'
// 如果类型报错，需要安装 @types/node: pnpm i @types/node -D
import path from 'path'
// 全局 scss 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve('./src/variable.scss'))

export default defineConfig({
  // css 相关的配置
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData 的内容会在每个 scss 文件的开头自动注入
        additionalData: `@import "${variablePath}";`
      }
    }
  }
})
```

现在可以直接在文件中使用全局文件的变量，相当于之前手动引入的方式。

### 4.3 CSS Modules

CSS Modules在vite也是一个开箱即用的能力，Vite会对后缀带有`.module`的样式文件自动应用`CSS Modules`，接下来我们通过一个简单的例子来使用这个功能。

首先，将Header组件中的`index.scss`更名为`index.module.scss`，然后稍微改动一下`index.tsx`的内容，如下：

```js
import styles from './index.module.scss'
export function Header() {
  return <p className={styles.header}>This is Header</p>
}
```

现在打开浏览器，可以看见p标签的类名已经被处理成了哈希值的形式：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403240015962.png)

说明现在CSS Modules已经正式生效了，同样的，你也可以在配置文件中的`css.modules`选项来配置CSS Modules的功能，比如下面的例子：

```ts
// vite.config.ts
export default {
  css: {
    modules: {
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    preprocessorOptions: {
      // 省略预处理器配置
    }
  }
}
```

再次访问页面，我们可以发现刚才的类名已经变成了我们自定义的形式：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403240019696.png)

这是CSS Modules中很常见的一个配置，对开发时的调试非常有用，其他的一些配置项不太常用，大家可以去这个[madyankin/postcss-modules: PostCSS plugin to use CSS Modules everywhere (github.com)](https://github.com/madyankin/postcss-modules)仓库去查看。

### 4.4 PostCSS

一般可以通过`postcss.config.ts`来配置`postcss`，不过在vite配置文件中已经提供了PostCSS的配置入口，我们可以直接在vite配置文件中进行操作：

首先，我们来安装一个常用的PostCSS插件`autoprefixer`

```shell
pnpm install autoprefixer -D
```

这个插件主要用来自动为不同的目标浏览器添加样式前缀，解决的是浏览器兼容性的问题，接下来我们在vite中接入这个插件：

```js
// vite.config.ts 增加如下的配置
import autoprefixer from 'autoprefixer'
export default {
  css: {
    // 进行 PostCSS 配置
    postcss: {
      plugins: [
        autoprefixer({
          // 指定目标浏览器
          overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11', '>1%']
        })
      ]
    }
  }
}
```

配置完成后，我们回到Header组件的样式文件中添加一个新的CSS属性：

```css
.header {
  text-decoration: dashed;
}
```

我们可以执行`pnpm run build`命令进行打包，可以看到生产产物中已经补上了浏览器前缀：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403240025437.png)

由于有CSS代码的AST（抽象语法树）解析能力，PostCSS可以做的事情非常多，甚至能实现CSS预处理器语法和CSS Module，社区当中也有不少的PostCSS插件，处理刚刚提到的`autoprefixer`插件，常见的插件还包括：

- [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem)：用来将px转化为rem单位，在适配移动端的场景下很有用。
- [postcss-preset-env](https://github.com/csstools/postcss-preset-env)：通过它，你可以编写最新的css语法，而不用担心兼容性问题。
- [cssnano](https://github.com/cssnano/cssnano)：主要用来压缩CSS代码，跟常规的代码压缩工具不一样，汤做得更加智能，比如提取一些公共样式进行复用、缩短一些常见的属性值等等。

更多的PostCSS插件大家可以去 www.postcss.parts/ 这个网址查看。

### 4.5 CSS in JS

社区中有两款主流的`CSS in JS`方案：`styled-components`和`emotion`。

对于CSSin JS方案，在构建侧我们需要考虑`选择器命名问题`/`DEC`(Dead Code Elimination即无用代码删除)、`代码压缩`、`生成SuorceMap`、`服务端渲染SSR`等问题，而`styled-components`和`emotion`已经提供了对应的babel插件来解决这些问题，我们在vite中要做的就是集成这些babel插件。

具体来说，上述的两种主流的CSS in JS方案中集成方式如下：

```js
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        // 加入 babel 插件
        // 以下插件包都需要提前安装
        // 当然，通过这个配置你也可以添加其它的 Babel 插件
        plugins: [
          // 适配 styled-component
          'babel-plugin-styled-components',
          // 适配 emotion
          '@emotion/babel-plugin'
        ]
      },
      // 注意: 对于 emotion，需要单独加上这个配置
      // 通过 `@emotion/react` 包编译 emotion 中的特殊 jsx 语法
      jsxImportSource: '@emotion/react'
    })
  ]
})
```

### 4.6 原子化框架

在目前的社区当中，CSS原子化框架主要包括Tailwind CSS和Windi CSS。Windi CSS作为前者的替换方案，实现了按需生成 CSS 类名的功能，开发环境下的 CSS 产物体积大大减少，速度上比 Tailwind CSS v2 快 20~100 倍！当然，Tailwind CSS 在 v3 版本也引入 JIT(即时编译) 的功能，解决了开发环境下 CSS 产物体积庞大的问题。接下来我们将这两个方案分别接入到 Vite 中，在实际的项目中你只需要使用其中一种就可以了。

**注：Windi CSS已经不更新了，下面就不介绍他的用法了。**

#### 4.6.1 TaIlwind CSS接入

首先安装tailwindcss以及其必要的依赖：

```shell
pnpm install -D tailwindcss postcss autoprefixer
```

然后新建两个配置文件`tailwind.config.js`和`postcss.config.js`：

```js
// tailwind.config.js
module.exports = {
 content: [
 "./index.html",
 "./src/**/*.{vue,js,ts,jsx,tsx}",
 ],
 theme: {
 extend: {},
 },
 plugins: [],
}

// postcss.config.js
// 从中你可以看到，Tailwind CSS 的编译能力是通过 PostCSS 插件实现的
// 而 Vite 本身内置了 PostCSS，因此可以通过 PostCSS 配置接入 Tailwind CSS
// 注意: Vite 配置文件中如果有 PostCSS 配置的情况下会覆盖掉 post.config.js 的内容!
module.exports = {
 plugins: {
 tailwindcss: {},
 autoprefixer: {},
 },
},
}
```

接着在项目的入口css中引入必要的样板代码：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

现在我们就可以在项目中安心的使用Tailwind样式了：

```js
// App.tsx
import logo from './logo.svg'
import './App.css'
function App() {
  return (
    <div>
      <header className="App-header">
        <img
          src={logo}
          className="w-20"
          alt="logo"
        />
        <p className="bg-red-400">Hello Vite + React!</p>
      </header>
    </div>
  )
}
export default App
```

## 5. vite项目的代码规范

> 在真实的工程项目中，尤其是多人写作的场景下，代码规范就变得非常重要了，它可以用来统一团队代码风格，避免不同风格的代码混杂到一起难以阅读，有效提高`代码质量`,甚至可以将一些`语法错误`在开发阶段提前规避掉。但仅有规范本身不够，我们需要`自动化的工具`(即`Lint工具`)来保证规范的落地，把代码规范检查（包括`自动修复`）这件事情交给机器完成，开发着只需要专注应用逻辑本身。

> 接下来我们将一起来完成Lint工具链的项目中的落地，实现自动化代码规范检查及修复的能力，学完之后，不仅能熟悉诸如`ESLint`、`Prettier`、`Stylelint`和`Commitlint`等诸多主流Lint工具的概念和使用，还能配合`husky`、`lint-staged`、`VSCode插件`和`Vite生态`在项目中集成完整的Lint工具链，搭建起完整的前端开发和代码提交工作流。

### 5.1 JS/TS规范工具：ESLint

> ESLint是在ECMAScript、JavaScript代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误。

ESLint是国外的前端大牛`Nicholas C. Zakas`在2013年发起的一个开源项目，有一本书被誉为前端界的圣经，叫做《JavScript高级程序设计》(即红宝书)，他正是这本书的作者。

`Nicholas`当初做这个开源项目，就是为了打造一款插件化的JavaScript代码静态检查工具，通过解析代码的AST来分析代码格式，检查代码的风格和质量问题。现在，ESLint已经成为一个非常成功的开源项目了，基本上属于前端项目中Lint工具的标配。

ESLint的使用并不复杂，主要通过配置文件对各种代码格式的规则（rules）进行配置，以指定具体的代码规范，目前开源社区也有一些成熟的规范集可供使用，著名的包括[Airbnb JavaScript 代码规范](https://github.com/airbnb/javascript)、[Standard JavaScript 规范](https://github.com/standard/standard/blob/master/docs/README-zhcn.md)、[Google JavaScript 规范](https://google.github.io/styleguide/jsguide.html)等等，你可以在项目中直接使用这些成熟的规范，也可以自己定制一套团队独有的代码规范，这在一些大型团队当中还是很常见的。

#### 5.1.1 初始化

接下来我们来利用ESLint官方的cli在现有的脚手架项目中进行初始化操作，首先我们需要安装ESLint：

```shell
 pnpm i eslint -D
```

接着执行ESLint的初始化命令，并进行如下的命令行交互：

```shell
npm eslint --init
```

![](https://my-vitepress-blog.sh1a.qingstor.com/202403242303631.png)

接着ESLint会帮助我们自动生成.eslintrc.js配置文件。需要注意的是，在上述初始化流程中我们并没有用npm安装依赖，需要进行手动安装：

```shell
pnpm i @typescript-eslint/eslint-plugin@latest eslint-plugin-react@latest @typescript-eslint/parser@latest
```

#### 5.1.2 核心配置阶解读

搭建初次接触配置文件可能会有点不太理解，接下来我来为你介绍一下几个核心的配置项，你可以对照目前生成的.eslintrc.js一起冲学习：

##### 5.1.2.1 parser-解析器

ESLint底层默认使用[Espree](https://github.com/eslint/espree)来进行AST解析，这个解析器目前已经基于`Acron`来实现，虽然说`Acron`目前能够解析绝大多数的ECMAScript规范的语法，但还是不支持TypeScript，因此需要引入其他的解析器完成TS的解析。

社区提供了`@typescript-eslint/parser`这个解决方案，专门为了TypeScript的解析而诞生，将`TS`代码转换为`Espree`能够识别的格式（即`EStree`格式），然后在`ESLint`下通过`Espree`进行给检查，以此兼容了TypeScript语法。

##### 5.1.2.2 parserOptions-解析器选项

这个配置可以对上述的解析器进行能力定制，默认情况下ESLint支持ES5语法，你可以配置这个选项，具体内容如下：

- ecmaVersion：这个配置和`Acron`的`ecmaVersion`是兼容的，可以配置`ES+数字`（如ES6）或者`ES+年份`(如ES2015)也可以直接配置为`latest`，启用最新的ES语法
- sourceType：默认为`script`，如果使用ESModule则应设置为`module`
- ecmaFeatures：为一个对象，表示像使用的额外语言特性，如开启`jsx`

##### 5.1.2.3 rules-具体代码规则

`rules`配置即代表在ESLint中手动调整那些代码规则，比如`禁止在if语句中使用赋值语句`这条规则可以像如下的方式配置：

```ts
// .eslintrc.js
module.exports = { // 其它配置省略 rules: {
// key 为规则名，value 配置内容
    "no-cond-assign": ["error", "always"]
  }
}```

在 rules 对象中， `key` 一般为规则名，`value` 为具体的配置内容，在上述的例子中我们设置为一个数组，数组第一项为规则的 `ID` ，第二项为 `规则的配置`

这里重点说一说规则的 ID，它的语法对所有规则都适用，你可以设置以下的值:

- `off` 或 `0`：表示关闭规则
- `warn` 或 `1`：表示开启规则，不过违背规则后只抛出 warning，而不会导致程序退出
- `error` 或 `2`：表示开启规则，不过违背规则后抛出 `error`，程序会退出

具体的规则配置可能会不一样，有的是一个字符串，有的可以配置一个对象，你可以参考 [ESLint 官方文档](https://zh-hans.eslint.org/)

当然，你也能直接将 `rules` 对象的 `value` 配置成 ID，如 `no-cond-assign:error`

##### 5.1.2.4. plugins


上面提到过 ESLint 的 parser 基于 `Acorn` 实现，不能直接解析 TypeScript，需要我们指定 parser 选项为 `@typescript-eslint/parser` 才能兼容 TS 的解析，同理，ESLint 本身也没有内置 TypeScript 的代码规则，这个时候 ESLint 的插件系统就排上用场了，我们需要通过添加 ESLint 插件来增加一些特定的规则，比如添加 `@typescript-eslint/eslint-plugin` 来扩展一些关于 TS 代码的规则，如下代码所示：

```js
// .eslintrc.js
module.exports = {
// 添加 TS 规则，可省略`eslint-plugin` 
plugins: ['@typescript-eslint']
}
```

值得注意的是，添加插件后只是扩展了ESLint本身的规则集，但ESLint默认并没有开启这些规则的校验。如要过开启或者调整这些规则，你需要在rules中进行配置，如：

```js
// .eslintrc.js
module.exports = { // 开启一些 TS 规则 rules: {
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
  }
}
```

##### 5.1.2.5 extends-继承配置

extends相当于`继承`另外一份ESLint配置，可以配置为一个字符串，也可以配置成一个字符串数组，主要分为如下3种情况：

- 从ESLint本身继承
- 从类似`eslint-config-xxx`的npm包继承
- 从ESLint插件继承

```js
// .eslintrc.js
module.exports = {
  extends: [
    // 第1种情况
    'eslint:recommended'
    // 第2种情况，一般配置的时候可以省略 `eslint-config` "standard"
    // 第3种情况，可以省略包名中的 `eslint-plugin`
    // 格式一般为: `plugin:${pluginName}/${configName}` "plugin:react/recommended" "plugin:@typescript-eslint/recommended",
  ]
}
```

有了extends的配置，对于之前所说的ESLint插件中的繁多配置，我们就不需要手动一一开启了，通过extends字段即可自动开启插件中的推荐规则：

```js
extends:["plugin:@typescript-eslint/recommended"]
```

##### 5.1.2.6 env和globals

这两个配置分别表示运行环境和全局变量，在指定的运行环境中会预设一些全局变量，比如：

```js
// .eslint.js
module.export = {
  env: {
    browser: 'true',
    node: 'true'
  }
}
```

指定上述的`env`配置后便会启用浏览器和Node.js环境，这两个环境中的一些全局变量（如`window`、`global`）会同时启用。

有些全局变量是业务代码引入的第三方库所声明，这里就需要再`globals`配置中声明全局变量了，每个全局变量的配置值有三种情况：

- `writavle`或者`true`，表示变量可重写
- `readonly`或者`false`，表示变量不可重写
- `off`，表示禁用该全局变量

拿`jquery`举例，我们可以在配置文件中声明如下：

```js
// .eslintrc.js
module.exports = {
  globals: {
    // 不可重写
    $: false,
    jQuery: false
  }
}
```

### 5.2. 与Prettier结合

虽然ESint本身具备自动格式化代码的功能(`eslint --fix`),但术业有专攻，ESLint的主要优势在于`代码的风格检查并给出提示`，而在代码格式化这一块Prettier做的更加专业，因此我们经常将ESLint结合Prettier一起使用。

首先我们先来安装下Prettier：

```shell
pnpm i prettier -D
```

在项目根目录新建`.prettierrc.js`配置文件，填写如下的配置内容：

```js
// .prettierrc.js
module.exports = {
  printWidth: 80, //一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 2, // 一个 tab 代表几个空格数，默认为 2 个
  useTabs: false, //是否使用 tab 进行缩进，默认为false，表示用空格进行缩减 singleQuote: true, // 字符串是否使用单引号，默认为 false，使用双引号
  semi: true, // 行尾是否使用分号，默认为true
  trailingComma: 'none', // 是否使用尾逗号
  bracketSpacing: true // 对象大括号直接是否有空格，默认为 true，效果:{ a: 1 }
}
```

接下来我们将`Prettier`集成到现有的`ESLint`工具中，首先安装两个工具包：

```shell
pnpm i eslint-config-prettier eslint-plugin-prettier -D
```

其中`eslint-config-prettier`用来覆盖ESLint本身的规则配置，而`eslint-plugin-prettier`则是用于让Prettier来接管`eslint --fix`即修复代码的能力。

在`.eslintrc.js`配置文件中接入prettier的相关工具链，最终的配置代码如下所示，你可以直接粘贴过去：

```js
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    // 1. 接入 prettier 的规则
    'prettier',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  // 2. 加入 prettier 的 eslint 插件
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    // 3. 注意要加上这一句，开启 prettier 自动修复的功能 "prettier/prettier": "error",
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'react/react-in-jsx-scope': 'off'
  }
}
```

OK，现在我们回到项目中来见证一下`ESLint+Prettier`强强联合的威力，在`package.josn`中定义一个脚本：

```json
{
  "scripts": {
	// 省略已有 script
    "lint:script": "eslint --ext .js,.jsx,.ts,.tsx --fix --quiet ./",
  }
}
```

接下来在命令行终端执行：

```shell
pnpm run lint:script
```

这样我们就完成了`ESLint的规则检查`以及`Prettier的自动修复`。不过每次执行这个命令未免会有些繁琐，我们可以在`VSCode`中安装`ESLint`和`prettier`这两个插件，并且在设置区中开启`Format On Save`：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403242356280.png)

接下来在你按`Ctrl+S`保存代码的时候，Prettier便会自动帮忙修复代码格式。

### 5.3 vite中接入ESLint

除了安装编辑器插件，我们也可以通过Vite插件的方式在开发阶段进行ESLint扫描，以命令行的方式展示出代码中的规范问题，并能够直接定位到原文件。

首先我们安装vite中的ESLint插件：

```shell
pnpm i vite-plugin-eslint -D
```

然后在`vite.config.ts`中接入：

```ts
// vite.config.ts
import viteEslint from 'vite-plugin-eslint';
// 具体配置 {
plugins: [
// 省略其它插件
    viteEslint(),
  ]
}
```

现在你可以试着重新启动项目，ESLint的错误已经能够及时显示到命令行窗口中了。

![](https://my-vitepress-blog.sh1a.qingstor.com/202403250000097.png)

由于这个插件采用另一个进程来运行ESLint的扫描工作，因此不会影响vite项目的启动速度，这个大家不用担心。

### 5.4 样式规范工具：StyleLint

接下来我们进入StyleLint的不分，先来看看官方的定义：

> Stylelint，一个强大的现代化样式 Lint 工具，用来帮助你避免语法错误和统一代码风格。

Stylelint主要专注于样式代码的规范检查，内置了**170多个书写规则**，支持**CSS预处理器**（如Sass/Less）,提供**插件化机制**以供开发着扩展规则，已经被Google、Github的**大型团队**投入使用，与ESLint类似，在规范检查方面，StyleLint已经做的足够专业了，而在代码格式化方面，我们仍然需要结合Prettier一起来使用。

首先让我们来安装StyleLint以及相应的工具套件：

```shell 
pnpm i stylelint stylelint-prettier stylelint-config-standard postcss-scss postcss-html stylelint-config-recommended-vue stylelint-config-recess-order -D
```

然后，我们在StyleLint的配置文件`.stylelintrc.js`中一一使用这些工具套件：

```js
// .stylelintrc.js
module.exports = {
  // 注册 stylelint 的 prettier 插件
  plugins: ['stylelint-prettier'],
  // 继承一系列规则集合
  extends: [
    // standard 规则集合
    'stylelint-config-standard',
    // standard 规则集合的 scss 版本
    'stylelint-config-standard-scss',
    // 样式属性顺序规则
    'stylelint-config-recess-order',
    // 接入 Prettier 规则
    'stylelint-config-prettier',
    'stylelint-prettier/recommended'
  ],
  // 配置 rules
  rules: {
    // 开启 Prettier 自动格式化功能
    'prettier/prettier': true
  }
}
```

可以发现StyleLint的配置文件和ESLint还是非常相似的，常用的`plugins`、`extends`和`rules`属性在ESLint同样存在，并且与ESLint中这三个属性的功能也基本相同，不过需要强调的是在StyleLint中rules的配置会和ESLInt有些区别，对于每个具体的rule会有三种配置方式：

- `null`：表示关闭规则
- 一个简单值（如true，字符串，根据不同规则有所不同），表示开启规则，但并不做过多的定制。
- 一个数组，包含两个元素，即[简单值，自定义配置],第一个元素通常为一个简单值，第二个元素用来进行更精细化的规则配置。

接下来我们将StyleLint集成到项目中，回到package.json中，增加如下的scripts配置：

```json
{
  "scripts": {
// 整合 lint 命令
"lint": "npm run lint:script && npm run lint:style",
// stylelint 命令
"lint:style": "stylelint --fix \"src/**/*.{css,scss}\""
}
}
```

执行 `pnpm run lint:style` 即可完成样式代码的规范检查和自动格式化。当然，你也可以在 VSCode 中安装 `Stylelint` 插件，这样能够在开发阶段即时感知到代码格式问题，提前进行修复。

  当然，我们也可以直接在 Vite 中集成 Stylelint。社区中提供了 Stylelint 的 Vite 插件，实现在项目开发阶段提前暴露出样式代码的规范问题。我们来安装一下这个插件:

```shell
pnpm i @amatlash/vite-plugin-stylelint -D
```

然后在vite配置文件中添加如下的内容：

```js
// 具体配置 {
plugins: [
// 省略其它插件 viteStylelint({
// 对某些文件排除检查
      exclude: /windicss|node_modules/
    }),
]
}
```

接下来，你就可以在命令行界面看到对应的StyleLint提示了：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403250011368.png)

## 6 Husky+lint-staged的提交工作流集成

### 6.1 提交前的代码lint检查

在上文中我们提到了安装`ESLint`、`Prettier`和`StyleLint`的VSCode插件或者vite插件，在开发阶段提前规避掉代码格式的问题，但实际上这也只是将问题提前暴露，并不能保证规范问题能完全被解决，还是可能导致线上的代码出现不符合规范的情况，那么如何来避免这类问题呢？

我们可以在代码提交的时候进行卡点检查，也就是拦截`git commit`命令，进行代码格式检查，只有确保通过格式检查才允许正常提交代码，社区中已经有对应的工具--`Husky`来完成这件事情，让我们来安装一下这个工具：

```shell
pnpm i husky -D
```

值得提醒的是，有很多人推荐在pacage.json中配置husky的钩子：

```json
// package.json
{
  "husky": {
    "pre-commit": "npm run lint"
  }
}
```

这种做法在Husky`4.x`及以下版本没问题，而在最新版本`7.x版本`中是无效的，在新版Husky版本中，我们需要做如下的事情：

初始化Husky：`npx husky install`，并将`husky install`作为项目启动前脚本，如：

```json
{
  "scripts": {
// 会在安装 npm 依赖后自动执行
    "postinstall": "husky install"
  }
}
```

添加Husky钩子，在终端执行如下命令：

```shell
npx husky add .husky/pre-commit "npm run lint"
```

接着你将会在项目根目录的`.husky`目录中看到名为`pre-commit`的文件，里面包含了`git commit`前要执行的脚本。现在，当你执行`git commit`的时候，会首先执行`npm run lint`脚本，通过Lint检查后才会正式提交代码记录。

不过，刚才我们直接在Husky的钩子中执行`npm run lint`，这样产生一个额外的问题，Husky中每次执行`npm run lint`都会对仓库中的代码进行全量检查，也就是说，即使某些文件并没有改动，也会走一次Lint检查，当项目代码越来越多的时候，提交的过程会越来越慢，影响开发体验。

而`lint-staged`就是用来解决上述全量扫描问题的，可以实现只对存入`暂存区`的文件进行Lint检查，大大提高了提交代码的效率，首先，我们安装一下对应的npm包：

```shell
pnpm i -D lint-staged
```

然后在package.json中添加如下的配置：

```json
{
  "lint-staged": {
    "**/*.{js,jsx,tsx,ts}": ["npm run lint:script", "git add ."],
    "**/*.{scss}": ["npm run lint:style", "git add ."]
  }
}
```

接下来我们需要在Husky中应用`lint-stage`，回到`.husky/pre-commit`脚本中，将原来的npm rn lint换成如下的脚本：

```shell
npmx --no -- lint-staged
```

如此一来，我们便实现了提交代码时的`增量lint检查`。

### 6.2 提交时的commit信息规范

除了代码规范检查之后，git提交信息的规范也是不容忽视的一个环节，规范的commit信息能够方便团队写作和问题定位，首先我们来安装一下需要的工具库，执行如下的命令：

```shell
pnpm i commitlint @commitlint/cli @commitlint/config-conventional -D
```

接下来新建`.commitlintrc.js`：

```js
// .commitlintrc.js
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

一般我们直接使用`@commitlint/config-conventional`规范集就可以了，他所规定的commit信息一般由两个部分：`type`和`subject`组成，结构如下：

```text
// type 指提交的类型
// subject 指提交的摘要信息
<type>: <subject>
```

常用的`type`如下：

- `feat`：添加新功能
- `fix`：修复问题/bug
- `style`：代码风格相关无影响运行结果的
- `chore`：一些不影响功能的更改(依赖更新/脚手架配置修改等)
- `perf`：性能方面的优化
- `refactor`：代码重构
- `revert`：撤销修改
- `test`：添加一些测试代码等等
- `docs`：文档/注释
- `workflow`：工作流改进
- `ci`：持续集成
- `types`：类型定义文件更改
- `wip`：开发中

接下来我们将`commitlint`的功能集成到husky的钩子中，在终端执行如下命令即可：

```shell
npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"
```

你可以发现在`.husky`目录下多出了`commit-msg`脚本文件，表示`commitlint`命令已经成功接入到了husky的钩子当中，现在我们可以尝试对代码进行提交，加入输入一个错误的commit信息，commitlint会自动抛出错误并退出：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251003411.png)

至此，我们便完成了git提交信息的卡点扫描和规范检查。

## 7 vite处理静态资源

> 静态资源处理是前端工程经常遇到的问题，在真实的工程中不仅仅包含了动态执行的代码，也不可避免地要引入各种静态资源，如`图片`、`JSON`、`Worker文件`、`web Assembly文件`等等。

> 静态资源本身并不是标准意义上的模块，因此对它们的处理和普通的代码是需要区别对待的。一方面我们需要解决资源加载的问题，对 Vite 来说就是如何将静态资源解析并加载为一个 ES 模块的问题;另一方面在**生产环境**下我们还需要考虑静态资源的部署问题、体积问题、网络性能问题，并采取相应的方案来进行优化。

### 7.1 图片加载

> 图片是项目中最常用的静态资源之一，本身包括了非常多的格式，诸如 png、jpeg、 webp、avif、gif，当然，也包括经常用作图标的 svg 格式。这一部分我们主要讨论的是如何加载图片，也就是说怎么让图片在页面中**正常显示**。

#### 7.1.1 使用场景

在日常的项目开发过程中，我们一般会遇到三种加载图片的场景：

在HTML或者JSX中，通过img标签来加载图片，如：

```html
<img src="../../assets/a.png"></img>
```

在CSS中通过background属性来加载图片，如：

```css
background: url('../../assets/b.png') no-repeat;
```

在JavaScript中，通过脚本的方式动态指定图片的src属性，如：

```js
document.getElementById('hero-img').src = '../../assets/c.png'
```

当然，大家一般还会有别名路径的需求，比如地址前缀直接换成`@assets`，这样就不用开发人员手动寻址，降低开发时的心智负担。

#### 7.1.2 vite中使用

接下来让我们在目前的脚手架项目来进行实际的编码，你可以在vite的配置文件中配置一下别名，方便后续的图片引入：

```js
// vite.config.ts
import path from 'path';

{
resolve: {
// 别名配置 alias: {
      '@assets': path.join(__dirname, 'src/assets')
    }
}
}
```

这样vite在遇到@assets路径的时候，会自动帮我们定位至根目录下的`src/assets`目录，值得注意的是，alias别名配置不仅在JavaScript的import语句中生效，在CSS代码的@import和url导入语句中也同样生效。

现在`src/assets`目录的内容如下：

```text
├── icons
│   ├── favicon.svg
│   ├── logo-1.svg
│   ├── logo-2.svg
│   ├── logo-3.svg
│   ├── logo-4.svg
│   ├── logo-5.svg
│   └── logo.svg
└── imgs
    ├── background.png
    └── vite.png
```

接下来我们在Header组件中引入vite.png这张图片：

```js
// Header/index.tsx
import React, { useEffect } from 'react';
import { devDependencies } from '../../../package.json';
import styles from './index.module.scss';
// 1. 导入图片
import logoSrc from '@assets/imgs/vite.png';
// 方式一
export function Header() {
return (
<div className={`p-20px text-center ${styles.header}`}>
<!-- 省略前面的组件内容 -->
<!-- 使用图片 -->
<img className="m-auto mb-4" src={logoSrc} alt="" />
</div>
);
}


// 方式二
export function Header() {
useEffect(() => {
const img = document.getElementById('logo') as HTMLImageElement; img.src = logoSrc;
}, []);
return (
<div className={`p-20px text-center ${styles.header}`}>
<!-- 省略前面的组件内容 -->
<!-- 使用图片 -->
<img id="logo" className="m-auto mb-4" alt="" />
</div>
); }
```

然后我们在网站上就可以看出这张图片已经显示出来了。

而图片路径也被解析为了正确的格式（/表示项目根路径）：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251046659.png)

现在让我们进入Header组件的样式文件中添加background属性：

```css
.header {
// 前面的样式代码省略
  background: url('@assets/imgs/background.png') no-repeat;
}
```

再次回到浏览器，可以看到生效的背景图片。

#### 7.1.3 SVG组件方式加载

刚才我们成功地在vite中实现了图片的加载，上述这些加载的方式对于SVG格式来说依然是适用的，不过，我们通常也虚妄能够将SVG当做一个组件来引入，这样我们可以很方便地修改SVG的各种属性，而且比img标签的引入方式更加优雅。

SVG组件加载在不同的前端框架中的实现不太相同，社区中也已经有了对应的插件支持：

- Vue2项目中可以使用[vite-plugin-vue 2-svg](https://github.com/pakholeung37/vite-plugin-vue2-svg)插件
- Vue3项目中可以引入[vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader)插件
- React项目中可以使用[vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr)插件

我们在React脚手架项目中安装对应的依赖：

```shell
pnpm i vite-plugin-svgr -D
```

```js
// vite.config.ts
import svgr from 'vite-plugin-svgr'

{
  plugins: [
    // 其它插件省略
    svgr()
  ]
}
```

随后注意要在tsconfig.json添加如下配置，否则会有类型错误：

```json
{
  "compilerOptions": {
  // 省略其它配置
    "types": ["vite-plugin-svgr/client"]
  }
}
```

接下来让我们在项目中使用SVG组件：

```js
import { ReactComponent as ReactLogo } from '@assets/icons/logo.svg'
export function Header() {
  return (
    // 其他组件内容省略
    <ReactLogo />
  )
}
```

回到浏览器中，你可以看到SVG已经成功渲染了。

#### 7.1.4 JSON加载

vite中已经内置了对于JSON文件的解析，底层使用`@rollup/pluginutils`的`dataToEsm`方法将JSON对象转换为一个包含各种具名导出的ES模块，使用如下：

```js
import { version } from '../../../package.json'
```

不过你也可以在配置文件禁用按名导入的方式：

```js
// vite.config.ts
{
  json: {
    stringify: true
  }
}
```

这样会将JSON的内容解析为`exort default JSON.parse('xxx)`，这样会失去`按需导出`的能力，不过在JSON数据量比较大的时候，可以优化解析性能。

#### 7.1.5 Web Worker脚本

vite中使用Web Worker也非常简单，我们可以在新建`Header/example.js`文件：

```js
const start = () => {
  let count = 0
  setInterval(() => {
    // 给主线程传值
    postMessage(++count)
  }, 2000)
}
start()
```

然后在Header组件中引入，引入的时候注意加上`?wrker`后缀，相当于告诉vite这是一个Web Worker脚本文件：

```js
import Worker from './example.js?worker'
// 1. 初始化 Worker 实例
const worker = new Worker()
// 2. 主线程监听 worker 的信息
worker.addEventListener('message', e => {
  console.log(e)
})
```

打开浏览器的控制面板，你可以看到Worker传给主线程的信息已经成功打印了，说明Web Worker脚本已经成功执行，也能与主线程正常通信。

#### 7.1.6 Web Assembly文件

vite对于`.wasm`文件也提供了开箱即用的支持，我们那一个斐波那契的`.wasm`文件来进行一下实际操作，对应的JavaScript原文件如下：

```js
export function fib(n) {
  var a = 0,
    b = 1
  if (n > 0) {
    while (--n) {
      let t = a + b
      a = b
      b = t
    }
    return b
  }
  return a
}
```

让我们在组件中导入`fib.wasm`文件：

```js
// Header/index.tsx
import init from './fib.wasm';
type FibFunc = (num: number) => number;
init({}).then((exports) => {
const fibFunc = exports.fib as FibFunc;
console.log('Fib result:', fibFunc(10));
});
```

vite会对`.wasm`文件的内容进行封装，默认导出为init函数，这个函数返回一个Promise，因此我们可以在其them方法中拿到其导出的成员--`fib`方法。

回到浏览器，我们可以查看到计算结果，说明`.wasm文件`已经被成功执行了。

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251105985.png)

#### 7.1.7 其他静态资源

除了上述的一些资源格式，vite也对下面几类格式提供了内置的支持：

- 媒体类文件：包括`mp4`、`webm`、`ogg`、`mp3`、`wav`、`flac`和`aac`
- 字体类文件：包括`woff`、`woff2`、`eot`、`ttf`和`otf`
- 文本类：包括`webmanifest`、`pdf`和`txt`

也就是说，你可以在vite中将这些类型的文件当做一个ES模块来导入使用，如果你的项目中还存在其他格式的静态资源，你可以通过`assetsInclude`配置让vite来支持加载：

```js
// vite.config.ts
{
  assetsInclude: ['.gltf']
}
```

#### 7.1.8 特殊资源后缀

vite中引入静态资源时，也支持在路径最后加上一些特殊的query后缀，包括：

- `?url`：表示获取资源的路径，这在只想获取文件路径而不是内容的场景将会很有用
- `?raw`：表示获取资源的字符串内容，如果你只想拿到资源的原始内容，可以使用这个后缀
- `?inline`：表示资源强制内联，而不是打包成单独的文件

#### 7.1.9 生产环境处理

在前面的内容中，我们围绕着如何加载静态资源这个问题，在vite中进行具体的编码实践，相信对于vite中各种静态资源的时候，你已经比较熟悉了，但另一方面，在生产环境下，我们又面临着一些新的问题。

- 部署域名怎么配置？
- 资源打包成单文件还是作为Base 64 格式内联？
- 图片太大了怎么压缩？
- SVG请求数量太多了怎么优化？

##### 7.1.9.1 自定义部署域名

一般在我们访问线上的站点时，站点里面一些静态资源的地址都包含了相应域名的前缀，如：

```html
<img src="https://sanyuan.cos.ap-beijing.myqcloud.com/logo.png" />
```

以上面这个地址例子，[https://sanyuan.cos.ap-beijing.myqcloud.com](https://sanyuan.cos.ap-beijing.myqcloud.com)是CDN地址前缀，`/logo.png`则是我们开发阶段使用的路径，name，我们是不是需要在上线前把图片先上传到CDN，然后将代码中的地址手动替换成线上地址呢？这样就太麻烦了。

在vite中我们可以有更加自动化的方式来实现地址的替换，只需要在配置文件中指定`base`参数即可：

```js
// vite.config.ts
// 是否为生产环境，在生产环境一般会注入 NODE_ENV 这个环境变量，见下面的环境变量文件配置 const isProduction = process.env.NODE_ENV === 'production';
// 填入项目的 CDN 域名地址
const CDN_URL = 'xxxxxx';
// 具体配置 {
  base: isProduction ? CDN_URL: '/'
}

// .env.development
NODE_ENV=development
// .env.production
NODE_ENV=production
```

注意在项目根目录新增的两个环境变量文件 `.env.development` 和 `.env.production`，顾名思义，即分别在开发环境和生产环境注入一些环境变量，这里为了区分不同环境我们加上了 `NODE_ENV` ，你也可以根据需要添加别的环境变量。

打包的时候 Vite 会自动将这些环境变量替换为相应的字符串。

接着执行 `pnpm run build`，可以发现产物中的静态资源地址已经自动加上了 CDN 地址前缀:

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251124287.png)

当然，HTML 中的一些 JS、CSS 资源链接也一起加上了 CDN 地址前缀:

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251125941.png)

当然，有时候可能项目中的某些图片需要存放到另外的存储服务，一种直接的方案是将完整地址写死到 src 属性中，如:

```html
<img src="https://my-image-cdn.com/logo.png" />
```

这样做显然是不太优雅的，我们可以通过定义环境变量的方式来解决这个问题，在项目根目录新增 .env 文件:

```text
// 开发环境优先级: .env.development > .env
// 生产环境优先级: .env.production > .env
// .env 文件 VITE_IMG_BASE_URL=https://my-image-cdn.com
```

然后进入 src/vite-env.d.ts 增加类型声明:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
readonly VITE_APP_TITLE: string;
// 自定义的环境变量
readonly VITE_IMG_BASE_URL: string;
}
interface ImportMeta {
readonly env: ImportMetaEnv;
}
```

值得注意的是，如果某个环境变量要在 Vite 中通过 `import.meta.env` 访问，那么它必须以 `VITE_` 开头，如 `VITE_IMG_BASE_URL` 。接下来我们在组件中来使用这个环境变量:

```html
<img src={new URL('./logo.png', import.meta.env.VITE_IMG_BASE_URL).href} />
```

接下来在 `开发环境` 启动项目或者 `生产环境` 打包后可以看到环境变量已经被替换，地址能够正常显示了。

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251127077.png)

##### 7.1.9.2 单文件or内联

在 Vite 中，所有的静态资源都有两种构建方式，一种是打包成一个单文件，另一种是通过 base64 编码的格式内嵌到代码中。

这两种方案到底应该如何来选择呢?

对于比较小的资源，适合内联到代码中，一方面对 `代码体积` 的影响很小，另一方面可以减少不必要的网络请求， `优化网络性能` 。而对于比较大的资源，就推荐单独打包成一个文件，而不是内联了，否则可能导致上 MB 的 base64 字符串内嵌到代码中，导致代码体积瞬间庞大，页面加载性能直线下降。

Vite 中内置的优化方案是下面这样的:

- 如果静态资源体积 >= 4 KB，则提取成单独的文件
- 如果静态资源体积 < 4 KB，则作为 base 64 格式的字符串内联

上述的 `4 KB` 即为提取成单文件的临界值，当然，这个临界值你可以通过 `build.assetsInlineLimit` 自行配置，如下代码所示:

```js
// vite.config.ts
{
  build: {
    // 8 KB
    assetsInlineLimit: 8 * 1024
  }
}
```

##### 7.1.9.3 图片压缩

图片资源的体积往往是项目产物体积的大头，如果能尽可能精简图片的体积，那么对项目整体打包产物体积的优化将会是非常明显的。在 JavaScript 领域有一个非常知名的图片[压缩库 imagemin](https://www.npmjs.com/package/imagemin)，作为一个底层的压缩工具，前端的项目中经常基于它来进行图片压缩，比如 Webpack 中大名鼎鼎的 `image-webpack-loader` 。社区当中也已经有了开箱即用的 Vite 插件—— `vite-plugin-imagemin` ，首先让我们来安装它:

```shell
pnpm i vite-plugin-imagemin -D
```

随后在 Vite 配置文件中引入:

```js
//vite.config.ts
import viteImagemin from 'vite-plugin-imagemin';

{
plugins: [
// 忽略前面的插件 viteImagemin({
// 无损压缩配置，无损压缩下图片质量不会变差
optipng: {
        optimizationLevel: 7
    },
// 有损压缩配置，有损压缩下图片质量可能会变差
pngquant: {
        quality: [0.8, 0.9],
      },
// svg 优化 svgo: {
plugins: [ {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
} ]
} })
]
}
```

接下来我们可以尝试执行 `pnpm run build` 进行打包:

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251131515.png)

Vite 插件已经自动帮助我们调用 imagemin 进行项目图片的压缩，可以看到压缩的效果非常明显，强烈推荐大家在项目中使用。

##### 7.1.9.4 雪碧图的优化

在实际的项目中我们还会经常用到各种各样的 svg 图标，虽然 svg 文件一般体积不大，但 Vite 中对于 svg 文件会始终打包成单文件，大量的图标引入之后会导致网络请求增加，大量的 HTTP 请求会导致网络解析耗时变长，页面加载性能直接受到影响。这个问题怎么解决呢?

> HTTP 2 的多路复用设计可以解决大量 HTTP 的请求导致的网络加载性能问题，因此雪碧图技术在 HTTP 2 并没有明显的优化效果，这个技术更适合在传统的 HTTP 1.1 场景下使用(比如本地的 Dev Server)。

比如在 Header 中分别引入 5 个 svg 文件:

```js
import Logo1 from '@assets/icons/logo-1.svg'
import Logo2 from '@assets/icons/logo-2.svg'
import Logo3 from '@assets/icons/logo-3.svg'
import Logo4 from '@assets/icons/logo-4.svg'
import Logo5 from '@assets/icons/logo-5.svg'
```

这里顺便说一句，Vite 中提供了 `import.meta.glob` 的语法糖来解决这种批量导入的问题，如上述的 import 语句可以写成下面这样:

```js
const icons = import.meta.glob('../../assets/icons/logo-*.svg')
```

结果如下：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251133432.png)

可以看到对象的 value 都是动态 import，适合按需加载的场景。在这里我们只需要同步加载即可，可以使用 import.meta.globEager 来完成:

```js
const icons = import.meta.globEager('../../assets/icons/logo-*.svg')
```

`icons`的结果打印，接下来我们稍作解析，然后将 svg 应用到组件当中:

```js
// Header/index.tsx
const iconUrls = Object.values(icons).map(mod => mod.default);

// 组件返回内容添加如下 {iconUrls.map((item) => (
  <img src={item} key={item} width="50" alt="" />
))}
```

回到页面中，我们发现浏览器分别发出了 5 个 svg 的请求:

假设页面有 100 个 svg 图标，将会多出 100 个 HTTP 请求，依此类推。我们能不能把这些 svg 合并到一起，从而大幅减少网络请求呢?

答案是可以的。这种合并图标的方案也叫 `雪碧图` ，我们可以通过 `vite-plugin-svg-icons` 来实现这个方案，首先安装一下这个插件:

```shell
pnpm i vite-plugin-svg-icons -D
```

接着在 Vite 配置文件中增加如下内容:

```js
// vite.config.ts

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

{
plugins: [
// 省略其它插件 createSvgIconsPlugin({
      iconDirs: [path.join(__dirname, 'src/assets/icons')]
    })
]
}
```

在 `src/components` 目录下新建 `SvgIcon` 组件:

```js
// SvgIcon/index.tsx
export interface SvgIconProps {
name?: string;
prefix: string;
color: string;
  [key: string]: string;
}

export default function SvgIcon({ name,
  prefix = 'icon',
  color = '#333',
  ...props
}: SvgIconProps) {
const symbolId = `#${prefix}-${name}`;
return (
<svg {...props} aria-hidden="true">
      <use href={symbolId} fill={color} />
    </svg>
);
}
```

现在我们回到 Header 组件中，稍作修改:

```js
// index.tsx
const icons = import.meta.globEager('../../assets/icons/logo-*.svg');
const iconUrls = Object.values(icons).map((mod) => {
// 如 ../../assets/icons/logo-1.svg -> logo-1
const fileName = mod.default.split('/').pop();
const [svgName] = fileName.split('.');
return svgName;
});

// 渲染 svg 组件 {iconUrls.map((item) => (
  <SvgIcon name={item} key={item} width="50" height="50" />
))}
```

最后在 `src/main.tsx` 文件中添加一行代码:

```js
import 'virtual:svg-icons-register'
```

现在回到浏览器的页面中，发现雪碧图已经生成:

雪碧图包含了所有图标的具体内容，而对于页面每个具体的图标，则通过 use 属性来引用雪碧图的对应内容:

如此一来，我们就能将所有的 svg 内容都内联到 HTML 中，省去了大量 svg 的网络请求。

## 8. vite-预构建

大家都知道， Vite 是一个提倡 `no-bundle` 的构建工具，相比于传统的 Webpack，能做到开发时的模块按需编译，而不用先打包完再加载。

需要注意的是，我们所说的模块代码其实分为两部分，一部分是源代码，也就是业务代码，另一部分是第三方依赖的代码，即 `node_modules` 中的代码。所谓的 `no-bundle` `只是对于源代码而言`，对于第三方依赖而言，Vite 还是选择 bundle(打包)，并且使用速度极快的打包器 Esbuild 来完成这一过程，达到秒级的依赖编译速度。

### 8.1 为什么需要预构建？

为什么在开发阶段我们要对第三方依赖进行预构建? 如果不进行预构建会怎么样？

首先 Vite 是基于浏览器原生 ES 模块规范实现的 Dev Server，不论是应用代码，还是第三方依赖的代码，理应符合 ESM 规范才能够正常运行。

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251434229.png)

但可惜，我们没有办法控制第三方的打包规范。就目前来看，还有相当多的第三方库仍然没有 ES 版本的产物，比如大名鼎鼎的 `react` :

```js
// react 入口文件
// 只有 CommonJS 格式
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react.production.min.js')
} else {
  module.exports = require('./cjs/react.development.js')
}
```

这种 CommonJS 格式的代码在 Vite 当中无法直接运行，我们需要将它转换成 ESM 格式的产物。

此外，还有一个比较重要的问题——请求瀑布流问题。比如说，知名的 loadsh-es 库本身是有 ES 版本产物的，可以在 Vite 中直接运行。但实际上，它在加载时会发出特别多的请求，导致页面加载的前几秒几都乎处于卡顿状态，拿一个简单的 demo 项目举例，请求情况如下图所示:

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251435336.png)

我在应用代码中调用了 `debounce` 方法，这个方法会依赖很多工具函数，如下图所示:

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251436879.png)

每个 `import` 都会触发一次新的文件请求，因此在这种 `依赖层级深`、`涉及模块数量多` 的情况下，会触发成百上千个网络请求，巨大的请求量加上 Chrome 对同一个域名下只能同时支持 `6` 个 HTTP 并发请求的限制，导致页面加载十分缓慢，与 Vite 主导性能优势的初衷背道而驰。不过，在进行依赖的预构建之后， `lodash-es` 这个库的代码被打包成了一个文件，这样请求的数量会骤然减少，页面加载也快了许多。下图是进行预构建之后的请求情况，你可以对照看看:

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251436613.png)

总之，依赖预构建主要做了两件事情：

一是将其他格式（如UMD和CommonJS）的产物转换为ESM格式，使其在浏览器通过`<script type="module"><script>`的方式正常加载。

二是打包第三方库的代码，将各个第三方库分散的文件合并到一起，减少HTTP请求数量，避免页面加载性能劣化。

而这两件事情全部由性能优异的 Esbuild (基于 Golang 开发)完成，而不是传统的 `Webpack/Rollup`，所以也不会有明显的打包性能问题，反而是 Vite 项目启动飞快(秒级启动)的一个核心原因。

> ps: Vite 1.x 使用了 Rollup 来进行依赖预构建，在 2.x 版本将 Rollup 换成了 Esbuild，编译速度提升了近 100 倍。

### 8.2 如何开启预构建

在 Vite 中有两种开启预构建的方式，分别是 `自动开启` 和 `手动开启`。

#### 8.2.1 自动开启

首先是 `自动开启` 。当我们在第一次启动项目的时候，可以在命令行窗口看见如下的信息:

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251440141.png)

同时，在项目启动成功后，你可以在根目录下的 node_modules 中发现 .vite 目录，这就是预构建产物文件存放的目录，内容如下:

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251440267.png)

在浏览器访问页面后，打开 Dev Tools 中的网络调试面板，你可以发现第三方包的引入路径已经被重写:

```text
import React from "react";
// 路径被重写，定向到预构建产物文件中
import __vite__cjsImport0_react from "/node_modules/.vite/react.js?v=979739df";
const React = __vite__cjsImport0_react.__esModule
 ? __vite__cjsImport0_react.default
 : __vite__cjsImport0_react;
```

并且对于依赖的请求结果，Vite 的 Dev Server 会设置强缓存:

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251441580.png)

缓存过期时间被设置为一年，表示缓存过期前浏览器对 react 预构建产物的请求不会再经过 Vite Dev Server，直接用缓存结果。

当然，除了 HTTP 缓存，Vite 还设置了本地文件系统的缓存，所有的预构建产物默认缓存在 node_modules/.vite 目录中。如果以下 3 个地方都没有改动，Vite 将一直使用缓存文件:

- package.json的`dependencies`字段
- 各种包管理器的lock文件
- `optimizeDeps`配置内容

#### 8.2.2 手动开启

前面说到了如何启动预构建的问题，现在我们来谈谈怎样通过 Vite 提供的配置项来定制预构建的过程。Vite 将预构建相关的配置项都集中在 `optimizeDeps` 属性上，我们来一一拆解这些子配置项背后的含义和应用场景。

##### 8.2.2.1 入口文件-entries

第一个是参数是 optimizeDeps.entries，通过这个参数你可以自定义预构建的入口文件：

实际上，在项目第一次启动时，Vite 会默认抓取项目中所有的 HTML 文件（如当前脚手架项目中的 `index.html`），将 HTML 文件作为应用入口，然后根据入口文件扫描出项目中用到的第三方依赖，最后对这些依赖逐个进行编译。

那么，当默认扫描 HTML 文件的行为无法满足需求的时候，比如项目入口为 vue 格式文件时，你可以通过 entries 参数来配置:

```js
// vite.config.ts
{
  optimizeDeps: {
    // 为一个字符串数组
    entries: ['./src/main.vue']
  }
}
```

当然，entries 配置也支持 [glob 语法](https://github.com/mrmlnc/fast-glob)，非常灵活，如:

```js
// 将所有的 .vue 文件作为扫描入口
entries: ['**/*.vue']
```

不光是 `.vue` 文件，Vite 同时还支持各种格式的入口，包括: `html` 、 `svelte` 、 `astro` 、`js`、 `jsx` 、 `ts` 和 `tsx` 。可以看到，只要可能存在 `import` 语句的地方，Vite 都可以解析，并通过内置的扫描机制搜集到项目中用到的依赖，通用性很强。

##### 8.2.2.2 添加一些依赖-include

除了 `entries` ， `include` 也是一个很常用的配置，它决定了可以强制预构建的依赖项，使用方式很简单：

```js
// vite.config.ts
optimizeDeps: {
  // 配置为一个字符串数组，将 `lodash-es` 和 `vue`两个包强制进行预构建
  include: ['lodash-es', 'vue']
}
```

它在使用上并不难，真正难的地方在于，如何找到合适它的使用场景。前文中我们提到，Vite 会根据应用入口( `entries` )自动搜集依赖，然后进行预构建，这是不是说明 Vite 可以百分百准确地搜集到所有的依赖呢？事实上并不是，某些情况下 Vite 默认的扫描行为并不完全可靠，这就需要联合配置 `include` 来达到完美的预构建效果了。接下来，我们好好梳理一下到底有哪些需要配置 `include` 的场景。

###### 8.2.2.2.1 场景一：动态import

在某些动态 import 的场景下，由于 Vite 天然按需加载的特性，经常会导致某些依赖只能在运行时被识别出来。

```js
// src/locales/zh_CN.js
import objectAssign from 'object-assign'
console.log(objectAssign)
// main.tsx
const importModule = m => import(`./locales/${m}.ts`)
importModule('zh_CN')
```

在这个例子中，动态 import 的路径只有运行时才能确定，无法在预构建阶段被扫描出来。因此，我们在访问项目时控制台会出现下面的日志信息:

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251446095.png)

这段 log 的意思是: Vite 运行时发现了新的依赖，随之重新进行依赖预构建，并刷新页面。这个过程也叫二次预构建。在一些比较复杂的项目中，这个过程会执行很多次，如下面的日志信息所示：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251447044.png)

然而，二次预构建的成本也比较大。我们不仅需要把预构建的流程重新运行一遍，还得重新刷新页面，并且需要重新请求所有的模块。尤其是在大型项目中，这个过程会严重拖慢应用的加载速度！因此，我们要尽力避免运行时的 `二次预构建`。具体怎么做呢？你可以通过 include 参数提前声明需要按需加载的依赖:

```js
// vite.config.ts
{
  optimizeDeps: {
    include: [
      // 按需加载的依赖都可以声明到这个数组里
      'object-assign'
    ]
  }
}
```

###### 8.2.2.2.2 场景二：某些哦包被手动exclude

`exclude` 是 `optimizeDeps` 中的另一个配置项，与 `include` 相对，用于将某些依赖从预构建的过程中排除。不过这个配置并不常用，也不推荐大家使用。如果真遇到了要在预构建中排除某个包的情况，需要注意 `它所依赖的包` 是否具有 ESM 格式，如下面这个例子:

```js
// vite.config.ts
{
  optimizeDeps: {
    exclude: ['@loadable/component']
  }
}
```

可以看到浏览器控制台会出现如下的报错:

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251449809.png)

这是为什么呢? 我们刚刚手动 exclude 的包 @loadable/component 本身具有 ESM 格式的产物，但它的某个依赖 hoist-non-react-statics 的产物并没有提供 ESM 格式，导致运行时加载失败。

这个时候 include 配置就派上用场了，我们可以强制对 hoist-non-react-statics 这个间接依赖进行预构建:

```js
// vite.config.ts
{
  optimizeDeps: {
    include: [
      // 间接依赖的声明语法，通过`>`分开, 如`a > b`表示 a 中依赖的 b
      '@loadable/component > hoist-non-react-statics'
    ]
  }
}
```

在 include 参数中，我们将所有不具备 ESM 格式产物包都声明一遍，这样再次启动项目就没有问题了。

##### 8.2.2.3 自定义ESBuild行为

Vite 提供了 `esbuildOptions` 参数来让我们自定义 Esbuild 本身的配置，常用的场景是加入一些 Esbuild 插件:

```js
// vite.config.ts
{
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        // 加入 Esbuild 插件
      ]
    }
  }
}
```

这个配置主要是处理一些特殊情况，如某个第三方包本身的代码出现问题了。接下来，我们就来讨论一下。

###### 8.2.2.3.1 特殊情况：第三方包出现问题怎么办？

由于我们无法保证第三方包的代码质量，在某些情况下我们会遇到莫名的第三方库报错。我举一个常见的案例—— `react-virtualized` 库。这个库被许多组件库用到，但它的 ESM 格式产物有明显的问题，在 Vite 进行预构建的时候会直接抛出这个错误：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403251453416.png)

原因是这个库的 ES 产物莫名其妙多出了一行无用的代码:

```js
// WindowScroller.js 并没有导出这个模块
import { bpfrpt_proptype_WindowScroller } from '../WindowScroller.js'
```

其实我们并不需要这行代码，但它却导致 Esbuild 预构建的时候直接报错退出了。那这一类的问题如何解决呢？

第一种方法：改第三方库代码

首先，我们能想到的思路是直接修改第三方库的代码，不过这会带来团队协作的问题，你的改动需要同步到团队所有成员，比较麻烦。

好在，我们可以使用 patch-package 这个库来解决这类问题。一方面，它能记录第三方库代码的改动，另一方面也能将改动同步到团队每个成员。

`patch-package` 官方只支持 npm 和 yarn，而不支持 pnpm，不过社区中已经提供了支持 `pnpm` 的版本，这里我们来安装一下相应的包:

```shell
pnpm i @milahu/patch-package -D
```

> 注意: 要改动的包在 package.json 中必须声明确定的版本，不能有 ~ 或者 ^ 的前缀。

接着，我们进入第三方库的代码中进行修改，先删掉无用的 import 语句，再在命令行输入:

```shell
npx patch-package react-virtualized
```

现在根目录会多出 `patches` 目录记录第三方包内容的更改，随后我们在 `package.json` 的 `scripts` 中增加如下内容：

```js
{
 "scripts": {
 // 省略其它 script
 "postinstall": "patch-package"
 }
}
```

这样一来，每次安装依赖的时候都会通过 postinstall 脚本自动应用 patches 的修改，解决了团队协作的问题。

第二种方法：加入ESBuild插件

```js
// vite.config.ts
const esbuildPatchPlugin = {
  name: 'react-virtualized-patch',
  setup(build) {
    build.onLoad(
      {
        filter: /react-virtualized\/dist\/es\/WindowScroller\/utils\/onScroll.js$/
      },
      async args => {
        const text = await fs.promises.readFile(args.path, 'utf8')
        return {
          contents: text.replace('import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";', '')
        }
      }
    )
  }
}
// 插件加入 Vite 预构建配置
{
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildPatchPlugin]
    }
  }
}
```