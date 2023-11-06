---
title: vite 学习
tags:
  - vite
date: 2023-08-27
cover: https://s2.loli.net/2023/09/29/VYdjJzhAnx5IelH.jpg
---

# vite 学习

## vite 基础学习

### 前端工程化之 vite

在现在的前端项目开发过程中，我们是越来越离不开构建工具了，可以说现代的前端项目中**构建工具已经成为了前端工程项目的标配**。

如今的前端攻坚工具有很多种，有远古时代的 `browserify`、`grunt`，有传统的 `webpack`、`rollup`、`Parcel`，也有现代的 `Esbuild` 、`vite` 等等，不仅是种类繁多，更新的也比较快。

无**论工具层面上如何的更新，他们的解决的核心问题，即前端工程的痛点是不变的**。因此，想要知道那个工具好用，就要看他解决了前端工程痛点的效果。

- 前端工程有哪些痛点呢？
  - 首先是前端的**模块化需求**，业界的模块化标准非常多，包括 ESM、CommonJS、AMD 和 CMD 等等。前端工程一方面需要落实这些模块规范，保证模块正常加载，另一方面需要兼容不同的模块规范，以适应不同的执行环境。
  - 其次是**浏览器兼容，编译高级语法**，由于浏览器的实现规范所限，只要高级语言/语法(TypeScript、JSX)想要在浏览器中正常运行，就必须被转化为浏览器可以理解的形式，这都需要工具链层面的支持，而且这个需求是一直存在的。
  - 再者是**线上代码的质量**问题，和开发阶段的考虑侧重点不同，生产环境中，我们不仅要考虑代码的 `安全性`、`兼容性` 问题，保证线上代码的正常运行，也需要考虑代码运行时的性能问题，由于浏览器的版本众多，代码兼容性和安全策略各不相同，线上代码的质量问题也将是前端工程中长期存在的一个痛点。
  - 同事，`开发效率`**也不容忽视**，我们知道，**项目的领冷启动/二次启动时间、热更新时间**都可能严重的影响开发效率，尤其是当项目越来越庞大的时候。因此，提高项目的启动速度和热更新速度也是前端工程的重要需求。

那么，我们的前端构建工具是如何解决以上的问题呢？

![Snipaste_2023-11-01_11-37-52.png](https://s2.loli.net/2023/11/06/puJLH7GEgkxmKCU.png)

- 模块化方面，提供模块加载方案，并兼容不同的模块规范
- 语法转译方面，配合 `sass` 、`TSC`、`Babel` 等前端工具链，完成高级语法的转译功能，同时对于静态资源也能进行处理，使之能作为一个模块正常加载。
- 产物质量方面，在生产环境中，配合 `Terser` 等压缩工具进行代码压缩和混淆，通过 `Tree Shaking` 删除未使用的代码，提交对于低版本浏览器和语法降级处理等等。
- 开发效率方面，构建工具本身通过各种方式来进行性能优化，包括 `使用原生语言Go/Rut` 、`no-bundle` 等等思路，提高项目的启动性能和热更新的速度。

#### 为什么 Vite 是当前最高效的构建工具

首先是开发效率，传统构建工具普遍的缺点就是太慢了，与之相比，Vite 能将项目的启动性能提升一个量级，并且达到毫秒级的瞬间热更新效果。

就拿 webpack 来说，在工作中可以发现，一般的项目使用 webpack 之后，启动花个几分钟的时间都是很常见的事情，热更新也经常需要等待十秒以上，这主要是因为：

- 项目冷启动时必须递归打包整个项目的依赖树
- JavaScript 语言本身的性能限制，导致构建性能遇到瓶颈，直接影响开发效率

这样一来，代码改动后不能立马看到效果，自然开发体验也越来越差，而其中，最占用时间的就是代码打包和文件编译。

而 Vite 很好的解决了这些问题，一方便，Vite 在开发阶段基于浏览器原生 ESM 的支持实现了 `no-bundle` 服务，另一方面借助 ESBuild 超快的编译速度来做第三方库构建和 TS/JSX 语法编译，从而能够有效提高开发效率。

除了开发效率，在其他三个纬度上，Vite 也表现不俗：

- 模块化方面，Vite 基于浏览器原生 ESM 的支持实现模块加载，并且无论是开发环境还是生产环境，都可以将其他格式的产物（CommonJS）转换为 ESM 的。
- 语法转译方面，Vite 内置了对 TypeScript、JSX、Sass 等高级语法的支持，也能够加载各种各样的静态资源，如图片、Worker 等等。
- 产物质量方面，Vite 基于成熟的打包工具 Rollup 实现生产环境打包，同时可以配合 `Terser`、`Babel` 等工具链，可以极大程度保证构建产物的质量。

### 前端模块化

2002 年的 AJAX 诞生至今，前端从刀耕火种的年代，经历了一系列的发展，各种标准和工具百花齐放。自从 2009 年的 Node.js 诞生，前端先后出现了 `CommonJS`、`AMD` 、`CMD`、`UMD` 和 `ES Module` 等模块规范，底层规范的发展催生除了一系列工具链的创新，比如 AMD 规范提出时社区诞生了模块加载工具 `requireJS`，基于 CommonJS 规范的模块打包工具 `browserify`，还有能让用户提前用上 `ES Module` 语法的 JS 编译器 `Babel`、兼容各种模块规范的重量级打包工具 `weboack` 以及基于浏览器原生 ES Module 支持而实现的 no-bundle 构建工具 `Vite` 等等。

![v2-0f8ef1bf4422b446fc82ebfc321a038f_1440w.png](https://s2.loli.net/2023/11/06/PSrLm2eNxFH3c57.png)

总体而言，业界经历了一系列由规范、标准引领工程化改个的过程，构建工具作为前端工程化的核心要素，与底层的前端模块化规范和标准息息相关。

#### 无模块化标准阶段

早在模块化标准还没有诞生的时候，前端界已经产生了一些模块化的开发手段，如 `文件划分`、`命名空间`、`IIFE私有作用域`

##### 1.文件划分

文件划分方式是最原始的模块化实现，简单来说就是将应用的状态和逻辑分散到不同的文件中，然后通过 HTML 中的 script 来意一一引入。下面就是一个通过`文件划分`实现模块化的具体例子：

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

从上面我们可以看到 `module-a` 和 `module-b` 为两个不同的模块，通过两个 script 标签分拨引入到 HTML 中，这么做看似是分散了不同模块的状态和运行逻辑，但是实际上也隐藏着一些风险因素：

- 模块变量相当于在全局声明和定义，会有变量名冲突的问题，比如 `moule-b` 可能也存在 `data` 变量，这就会和 `module-a` 中的变量冲突。
- 由于变量都在全局定义的，我们很难知道某个变量到底属于哪个模块，因此也给调试带来了困难。
- 无法清晰地管理模块之间的依赖关系和加载顺序，假如 `module-a` 依赖 `module-b`，那么上述的 HTML 的 script 执行顺序需要手动调整，不然可能会产生运行时错误。

##### 2.命名空间

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

这样一来，每个变量都有自己专属的命名空间，我们可以清楚地知道某个变量到底属于哪个 `模块`，同事也避免全局变量命名的问题。

##### 3.IIFE(立即执行函数)

相比于 `命名空间` 的模块化手段，`IIFE` 实现的模块化安全性要更高，对于模块作用域的区分更加彻底，你可以参考如下 `IIFE实现模块化` 的例子：

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

我们知道，每个 `IIFE` 即立即执行函数都会创建一个私有的作用域，在私有作用域中的变量外界无法访问的，只有模块内部的方法才能访问。上述的 `module-a ` 中来说：

对于其中的 `data` 变量，我们只能在模块内部的 `sum` 函数中通过闭包访问，而在其他模块中无法直接访问，这就是模块 `私有成员` 功能，避免模块私有成员被其他模块非法篡改，相比于 `命名空间` 的实现方式更加安全。

但是无论是 `命名空间` 还是 `IIFE`，都是为了解决全局变量所带来的命名冲突以及作用域不明确的问题，也就是在 `文件划分方式` 中所总结的 `问题 1` 和 `问题 2,` 而并没有真正解决另外一个问题-**模块加载**，如果模块间存在依赖关系，俺么 script 标签的加载顺序就需要受到严格的控制，一旦顺序不对，就会产生运行时 BUG。

而随着前端工程的日益庞大，各个模块之间相互依赖已经是非常常见的事情，模块加载的需求已经给我了业界刚需，而以上的几种非标准化手段不能满足这个需求，因此我们需要制定一个行业标准去统一前端代码的模块化。

不过前端的模块化规范统一也经历了漫长的发展阶段，即便是到了现在也没有实现完全的统一，接下来，我们就来书熟悉一下页面主流的几大模块规范：`CommonJS`、`AMD` 和 `ES Module`。

#### CommonJS 规范

CommonJS 是业界最早正式提出的 JavaScript 模块规范，主要用于服务端，随着 Node.js 越来越普及，这个规范也被业界广泛应用，对于模块规范而言，一般会包含 2 方面的内容：

- 统一的模块化代码规范
- 实现自动加载模块的加载器（也称之为 `loader`）

对于 CommonJS 模块本身，相信有 Node.js 使用经验的同学都不陌生：

```js
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

代码中使用了 `require` 来导入一个模块，用 `module.exports` 来导入一个模块，实际上 Node.js 内部会有相应的 loader 转译模块代码，最后模块代码会被处理成下面这样：

```js
;(function (exports, require, module, __filename, __dirname) {
  //执行模块代码
  //返回exports对象
})
```

对于 CommonJS 而言，一方面它定义了一套完整的模块化代码规范，另一方面 Node.js 为之实现了自动加载模块的 `loader`，看上去是一个不错的模块规范，但是也存一些问题：

模块加载器由 Noe.js 提供，依赖了 Node.js 本身的功能实现，比如文件系统，如果 CommonJS 模块直接放到浏览器中是无法执行的，当然，业界也产生了 [browserify/browserify: browser-side require() the node.js way (github.com)](https://github.com/browserify/browserify) 这种打包工具来支持打包 CommonJS 模块，从而顺利在浏览器中执行，相当于社区实现了一个第三方的 loader。
CommonJS 本身约定以同步的方式进行模块加载，这种加载机制放在服务端是没有问题的，依赖模块都在本地，不需要进行网络 IO，二来只有服务启动时才会加载模块，而服务通常启动后会一直运行，所以对服务的性能并没有太大的影响，但如果这种加载机制放到浏览器端，会带来明显的性能问题。他会产生大量同步的模块请求，浏览器要等到响应返回后才能就解析模块，也就是说，**模块请求会造成浏览器 JS 解析过程的阻塞**，导致页面加载速度缓慢。

总之，CommonJS 是一个不太适合在浏览器中运行的模块规范，因此，业界也设计除了权限的规范来作为浏览器的模块标准，最知名的要数 `AMD` 了。

#### AMD 规范

`AMD` 全程为 `Asynchronous Module Definition`，即异步模块定义规范，模块根据这个规范，在浏览器环境中被异步加载，而不会像 CommonJS 规范进行同步加载，也就不会产生同步请求导致的浏览器解析过程阻塞的问题了，我们先来看看这个模块规范是如何来使用的：

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

在 AM 规范当中，我们可以通过 define 去定义或加载一个模块，比如上面的 `main` 模块和 `print` 模块，仍哦模块需要导出一些成员需要通过在定义模块的函数中 return 出去，如果当前模块依赖了一些其他模块则可以通过 define 的第一个参数来声明依赖，这样模块的代码执行之前浏览器会先**加载依赖模块**

当然，我们也可以使用 require 干某处来加载一个模块：

```js
require(['./print'], function (printModule) {
  printModule.print('main')
})
```

不过 require 与 define 的区别在于前者只能加载模块，而**不能定义一个模块**

由于没有得到浏览器的原生支持，AMD 规范需要由第三方的 loader 来实现，最经典的就是 [requirejs/requirejs: A file and module loader for JavaScript (github.com)](https://github.com/requirejs/requirejs) 库了，它完整的实现了 AMD 规范，至今依然由不少的项目在使用。

不过 AMD 规范使用起来稍显复杂，代码阅读和书写都比较困难，因此，这个规范并不能成为前端模块化的终极解决方案，仅仅是社区中提出的一个妥协性的方案，关于新的模块化规范的探索，业界也从未停止脚步。

同期出现的规范当中也有 CMD 规范，这个规范是由淘宝出品的 `SeaJS` 实现的，解决的问题和 AMD 一样，不过随着社区的不断发展，SeaJS 已经被 `requireJS` 兼容了。

> 当然，你可能也听说过 `UMD`（Universal Module Definition）规范，其实它并不算一个新的规范，只是兼容 AMD 和 ConnonJS 的一个模块化方案，可以同时运行在浏览器和 Node.js 环境，后面要介绍的 ES Module 也具备了这种跨平台的能力。

#### ES6 Module

ES6 Module 也被称作 `ES MODULE` 或者（ESM），是由 ECMAScript 官方提出的模块化规范，作为一个官方提出的规范，`ES Module` 已经得到了现代浏览器的内置支持，在现代浏览器中，如果在 HTML 中加入含有 `type="module"` 属性的 script 标签，那么浏览器会按照 ESModule 规范来进行依赖加载和模块解析，这也是 vite 在开发阶段实现 no-bundle 的原因，由于模块加载的任务交给了浏览器，即使不打包也可以顺序运行模块代码。

不仅如此，一直以 CommonJS 作为模块标准的 Node.js 也紧跟着 ESModule 的发展步伐，从 `12.20` 版本开始正式支持原生 ESModule，也就是说，如今 ESModule 能够同时在浏览器与 Node.js 环境中执行，拥有天然的扩平台的能力。

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

如果在 Node.js 环境中，可以在 `package.json` 中声明 `type:"module"` 属性：

```json
{
  "type": "module"
}
```

然后 Node.js 便会默认以 ESModule 规范去解析模块。

顺便说一句，在 Node.js 中，即使是在 CommonJS 模块里面，也可以通过 `import` 方法顺利加载 ES 模块，如下所示：

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

ESModule 作为 ECMAScript 官方提出的规范，经过了几年的发展，不仅得到了众多浏览器的原生支持，也在 Node.js 中得到了原生支持，是一个能够跨平台的模块规范，同时，它也是社区各种生态库的发展趋势，尤其是被如今大火的构建工具 Vite 所深度应用，可以说，ESModule 前景一片光明，成为前端大一统的模块标准指日可待。

### Vite 搭建前端项目

#### 项目搭建

首先需要的是代码编辑器和浏览器，推荐安装 `SVCode` 和 `Chrome` 浏览器，其次安装的是 Node.js，推荐安装的是 `12.0.0` 以上的版本，包管理工具也是推荐使用 `pnpm`

由于默认的镜像源在国外，包下载速度和稳定性都不太好，因此建议换成国内的镜像源，这样 `pnpm install` 命令的体验会好很多，命令如下：

```shell
pnpm config set registry https://registry.npmmirror.com/
```

#### 项目初始化

在搭建了基本的开发环境之后，我们进入到了 `项目初始化` 阶段，可以在终端命令中输入如下的命令：

```shell
pnpm create vite
```

在执行完这个命令后，pnpm 首先会自动下载 `create-vite` 这个第三方的包，然后执行这个包中的项目初始化逻辑，因此，我们可以看到这样的交互界面：

![Snipaste_2023-11-06_14-51-51.png](https://s2.loli.net/2023/11/06/k3XgljmIrFYvZBt.png)

后续的交互流程如下：

- 输入项目名称
- 选择前端框架
- 选择开发语言

```txt
✔ Project name: react-demo
? Select a framework: › - Use arrow-keys. Return to submit.
vanilla // 无前端框架
vue // 基于 Vue
> react // 基于 React
preact // 基于 Preact（一款精简版的类 React 框架）
lit // 基于 lit（一款 Web Components 框架）
svelte // 基于 Svelte
```

然后选择框架和语言之后，脚手架的模版已经生成完毕，可以执行如下命令在本地启动项目：

```txt
// 进入项目目录
cd react-demo
// 安装依赖
pnpm install
// 启动项目
pnpm run dev
```

之后执行 pnpm run dev 之后看到如下界面，表示项目已经启动成功了：

![Snipaste_2023-11-06_14-59-54.png](https://s2.loli.net/2023/11/06/k6wmZPt41ExGcvH.png)

我们去浏览器打开 `http://localhost:5173` 页面，可以看到：

![Snipaste_2023-11-06_15-01-15.png](https://s2.loli.net/2023/11/06/W9M6ZoXYLBCF2SV.png)

至此我们已经成功搭建了一个 React 项目，利用 Vite 来初始化一个前端项目非常的简单，Vite 给我们的第一感觉就是简洁、轻量、快速。

#### 项目入口加载

Vite 初始化项目后，项目的目录结构如下：

```txt
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

值得注意的是，在项目根目录中由一个 `index.html` 文件，这个文件非常关键，因为 Vite 默认会把项目根目录下的 `index.html` 作为入口文件，也就是说，当你访问 `http://localhost:3000` 的时候，Vite 的 Dev Server 会自动返回这个 html 文件的内容。我们看下这个 HTML 写了什么：

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

可以看到这个 HTML 文件的内容非常简洁：在 `body` 标签中除了 id 为 root 的根节点外，还包含了声明了 `type="module"` 的 script 标签：

```html
<script
  type="module"
  src="/src/main.jsx"
></script>
```

由于现代浏览器原生支持 ES 模块规范，因此原生的 ES 语法也可以直接放到浏览器中执行，只需要在 script 标签中声明 `type="module"` 即可，比如上面的 script 标签就声明了 type="module"，同时 src 指向了 `/src/main.tsx` 文件，此时相当于请求了 `http://localhost:3000/src/main.tsx` 这个资源，Vite 的 Dev Server 此时会接受到这个请求，然后读取对应的文件内容，进行一定的中间处理，最后将处理的结果返回给浏览器

![Snipaste_2023-11-06_15-22-57.png](https://s2.loli.net/2023/11/06/WvTFEfIaBMdXo3A.png)

我们来看下 `mian.jsx` 的内容：

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

到这里可能会有些疑问，浏览器并不是别 jsx 语法，也无法直接 import css 文件，上面这段代码究竟是如何被浏览器正常执行的呢？

这就归功于 Vite Dev Server 所做的中间处理了，也就是说，在读取到 main.jsx 文件的内容之后，Vite 会对文件的内容进行编译，大家可以从 Chorme 的网络调试面板看到编译后的结果：

![Snipaste_2023-11-06_15-28-52.png](https://s2.loli.net/2023/11/06/L3SpyXfKRz56Awd.png)

Vite 会将项目的源代码编译成浏览器可以识别的代码，与此同时，一个 import 语句即代表了一个 HTTP 请求，如下面两个 import 语句：

```js
import App from './App.jsx'
import './index.css'
```

需要注意的是，在 Vite 项目中，`一个 import 语句即代表一个 HTTP 请求`，上述两个语句则分别代表了两个不同的请求，Vite Dev Server 会读取本地文件，返回浏览器可以解析的代码，当浏览器解析到新的 import 语句，又会发出新的请求，以此类推，直到所有的资源都加载完毕。

Vite 所倡导的 `no-bundle` 里面的真正含义：**利用浏览器原生 ES 模块的支持，实现开发者阶段的 Dev Server,进行模块的按需加载**，而不是**先整体打包在进行加载**，相比 Webpack 这种必须打包再加载的传统构建模式，Vite 在开发阶段省略了繁琐且耗时的打包过程，这也是他为什么快的一个重要原因。

#### vite 配置文件

在使用 vite 的过程，我们需要对 vite 做一些配置，以满足日常开发的需求，我们可以通过两种方式来对 Vite 进行配置，一室通过命令行参数，如 `vite --port=8888`,二是通过配置文件，一般情况下，大多数的配置都通过配置文件的方式来声明。

Vite 当中支持多种配置文件类型，包括 `.js` 、`.ts`、`.mjs` 三种后缀的文件，实际项目中一般使用 vite.config.ts 作为配置文件，具体的配置代码如下：

```js
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()]
})
```

可以看到配置文件中默认在 `plugins` 数组中配置了官方的 react 插件，来提供 React 项目编译和热更新的功能。

如果我们页面的入口文件 `index.html` 并不在项目的根目录下，而需要放到 `src` 目录下，如何在访问 `localhost:3000` 的时候让 Vite 自动返回 src 目录下的 `index.html` 呢？我们可以通过参数配置项目根目录的位置：

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

当手动指定 `root` 参数之后，Vite 会自动从这个路径寻找 `index.html` 文件，也就是说当我直接访问 `localhost:3000` 的时候，Vite 从 `src` 目录下读取入口文件，这样就成功实现了刚才的需求。

#### 生产环境构建

在开发环境 Vite 通过 Dev Server 实现了不打包的特性，而在生产环境中，Vite 依然会基于 Rollup 进行打包，并采取一系列的打包优化手段，从脚手架项目的 `package.json` 中就可见一斑：

```js
"scripts":{
//开发阶段驱动 Vite Dev Server
"dev": "vite",
// 生产环境打包
"build": "vite build",
// 生产环境打包完预览产物
"preview": "vite preview"
}
```

这其中的 build 命令就是 vite 专门用来进行生产环境打包的，但是你可能会有遗憾，为什么在 `vite build` 命令执行之前要先执行 `tsc` 呢？

`tsc` 作为 TypeScript 的官方编译命令，可以用来编译 TypeScript 代码并进行类型检查，而这里的作用主要是用来做类型检查的，我们可以从项目的 `tsconfig.json` 中注意到这样的一个配置：

```js
{
 "compilerOptions": {
 // 省略其他配置
 // 1. noEmit 表示只做类型检查，而不会输出产物文件
 // 2. 这行配置与 tsc --noEmit 命令等效
 "noEmit": true,
 },
}
```

虽然 Vite 提供了开箱即用的 TypeScript 以及 JSX 的编译能力，但是实际上底层并没有实现 TypeScript 的类型校验系统，因此需要借助 `tsc` 来完成类型校验（在 Vue 项目中使用 `vue-esc` 这个工具来完成）在打包钱提早暴露出类型相关的问题，保证代码的健壮性。

接下来我们可以试着执行一下这个打包命令：

![Snipaste_2023-11-06_15-59-08.png](https://s2.loli.net/2023/11/06/me6GR7USJWQNqMn.png)

此时 Vite 已经生成了最终的打包产物，我们可以通过 `pnpm run previer` 命令来预览一下打包产物的执行效果。

![Snipaste_2023-11-06_16-00-28.png](https://s2.loli.net/2023/11/06/2vBg1Oawl4hVfDI.png)

在浏览器中打开 `localhost:4173` 地址就可以看到和开发阶段一样的页面内容，证明我们成功完成第一个 Vite 项目的生产环境构建。

### vite 中使用现代化的 css 方案

#### 使用样式方案的意义

开发前端的样式，首先我们想到的是直接写原生 CSS，但是时间一长，难免会发现原生 css 开发的各种问题，那么，如果我们不适用任何 css 工程方案，又会出现那些问题呢？

开发体验欠佳，比如原生 CSS 不支持选择器的嵌套：

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

样式污染问题，如果出现同样的类名，很容易造成不同的样式相互覆盖和污染：

```js
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

浏览器兼容性问题，为了兼容不同的浏览器，我们需要对一些属性（如 `transition`）加上不同的浏览器前缀，比如 `-webkit-`、`-moz-` 、`-ms` -、`-0-`，意味着开发者要针对同一个样式属性写上很多的冗余代码。

打包后的体积问题，如果不用任何的 css 工程化方案，所有的 css 代码都将打包到产物中，即时有部分样式并没有在代码中使用，导致产物体积过大。

针对以上原生 css 的痛点，社区中诞生了不少解决方案，常见的用 5 类：

`css预处理器`：主流的包括 `sass/scss` / `Less` / `Stylus`，这些方案各自定义了一套语法，让 css 也能使用嵌套规则，甚至能够像编程语言一样定义变量，写条件判断和循环语句，大大增强了样式语言的灵活性，解决原生 css 的开发体验问题。

`CSS Modules`：能将 css 类名处理成哈希值，这样就可以避免同名的强狂下**样式污染**的问题

CSS 后处理器 PostCSS，用来解析和处理 css 代码，可以实现的功能非常丰富，比如将 `px` 转化为 `rem`、根据目标浏览器情况自动加上类似于 `--moz--`、`-o-` 的属性前缀等等。

`CSS in JS` 方案，主流的包含 `emotion`、`styled-components` 等等，顾名思义，这类方案可以实现直接在 JS 中写样式代码，基本包含 `CSS预处理器` 和 `CSS Modules` 的各项优点，非常灵活，解决了开发体验和全局样式污染的问题。

CSS 原子化框架，如 `Tailwind CSS` / `Windi CSS`，通过类名来指定样式，大大简化了样式写法，提高了样式开发的效率，主要解决了原生 css 开发体验的问题。

不过各种方案没有孰优孰劣，各自解决的方案有重叠的部分，但也有一定的差异，大家可以根据自己项目的痛点来引入使用。

#### CSS 预处理器

Vite 本身对 CSS 各种预处理器语言（Sass、Scss）、Less 和 Stylus 做了内置的支持，也就是说，即时你不经过任何的配置也可以直接使用各种 CSS 预处理器，我们以 `Sass/Scss` 为例，感受下 Vite 的 `零配置` 给我们带来的遍历。

由于 Vite 底层会调用 css 预处理器的官方库进行编译，而 Vite 为了实现按需加载，并没有内置这些工具库，而是让用户根据需要安装，因此，我们首先安装 Sass 的官方库：

```shell
pnpm i sass -D
```

然后在新建的项目中创建 `src/components/Header` 目录，并且分别新建 `index.jsx` 和 `index.scss` 文件，代码如下：

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

这样就完成了一个最简单的 demo 组件。接着我们在 `App.tsx ` 应用这个组件:

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

现在你可以执行 pnpm run dev ，然后到浏览器上查看效果:

![Snipaste_2023-11-06_16-29-57.png](https://s2.loli.net/2023/11/06/vgHW65xTdcbklNR.png)

如果页面上出现了红色的文字则说明 `scss` 的样式已经生效了，现在我们封装一个全局的主题色，新建 `src/varrable.scss` 文件，内容如下：

```css
$theme-color: red;
```

然后，我们在原来 Header 组件的样式中应用这个变量:

```css
@import '../../variable';
.header {
  color: $theme-color;
}
```

回到浏览器访问页面，可以看到样式依然生效。你可能会注意到，每次要使用 $theme-color 属性的时候我们都需要手动引入 variable.scss 文件，那有没有自动引入的方案呢？这就需要在 Vite 中进行一些自定义配置了，在配置文件中增加如下的内容:

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

#### CSS Modules

CSS Modules 在 Vite 也是一个开箱即用的能力，Vite 会对后缀带有 `.module` 的样式传文件自动应用 CSS Modules，接下来我们通过一个例子来看一下：

首先将 Header 组件中的 `index.scss` 更名为 `index.module.scss`，然后稍微改动一下 `index.jsx` 的内容，如下：

```js
import styles from './index.module.scss'
export function Header() {
  return <p className={styles.header}>This is Header</p>
}
```

现在打开浏览器，开一看见 p 标签的类名已经被处理成了哈希值的形式：

![Snipaste_2023-11-06_16-47-00.png](https://s2.loli.net/2023/11/06/XjnJHZurMvRBOK3.png)

说明现在 CSS Modules 已经正式生效了，同样的，也可以在配置文件中 `css.modules` 选项来配置 CSS Modules 的功能，比如下面这个例子：

```js
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

再次访问页面，我们可以发现刚才的类名已经变成了我们自定义形式：

![Snipaste_2023-11-06_16-50-24.png](https://s2.loli.net/2023/11/06/OyDI5KJsa8ZzAv6.png)

这是 CSS Modules 中很常见的一个配置，对开发时的调试非常有用，其他的一些配置项不太常用，大家可以去这个 [madyankin/postcss-modules: PostCSS plugin to use CSS Modules everywhere (github.com)](https://github.com/madyankin/postcss-modules) 仓库进行查看。

#### PostCSS

一般可以通过 `postcss.config。js` 来配置 postcss，不过在 vite 配置文件中已经提供了 PostCSS 的配置入口，我们可以直接在 Vite 配置文件中进行操作：

首先，我们来安装一个常见的 PostCSS 插件- `autoprefixer`

```shell
pnpm i autoprefixer -D
```

这个插件主要用来自动为不同的目标浏览器添加样式前缀，解决的是浏览器兼容性的问题，接下来我们在 vite 中接入这个插件：

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

配置完成后，我们回到 Header 组件的样式文件中添加一个新的 CSS 属性：

```css
.header {
  text-decoration: dashed;
}
```

我们可以执行 `pnpm run build` 命令进行打包，可以看到生产产物中已经补上了浏览器前缀：

![Snipaste_2023-11-06_17-09-39.png](https://s2.loli.net/2023/11/06/3TrvOmsXQGzIyHj.png)

由于有 CSS 代码的 AST（抽象语法树）解析能力，Postcss 可以做的事情非常多，甚至能实现 CSS 预处理器语法和 CSS Module，社区当中也有不少的 PostCSS 插件，处理刚刚提到的 `autoprefixer` 插件，常见的插件还包括：

- [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem):用来将 px 转换为 rem 单位，在适配移动端的场景下很常用
- [postcss-preset-env](https://github.com/csstools/postcss-preset-env):t 通过它，你可以编写最新的 css 语法，不用担心兼容性问题
- [cssnano](https://github.com/cssnano/cssnano):主要用来压缩 CSS 代码，跟常规的代码压缩工具不一样，它能做得更加智能，比如提取一些公共样式进行复用、缩短一些常见的属性值等等。

更多的 PostCSS 插件大家可以去 [PostCSS.parts | A searchable catalog of PostCSS plugins](https://www.postcss.parts/?searchTerm=auto) 这个网址查看

#### CSS in JS

社区中有两款主流的 `CSS in JS` 方案：`styled-components` 和 `emotion`

对于 CSS in JS 方案，在构建侧我们需要考虑 `选择器命名问题` / `DEC` (Dead Code Elimination 即无用代码删除)、`代码压缩`、`生成SuorceMap` 、`服务端渲染SSR` 等问题，而 `styled-components` 和 `emotion` 已经提供了对应的 babel 插件来解决这些问题，我们在 vite 中要做的就是集成这些 babel 插件

具体来说，上述的两种主流的 CSS in JS 方案中集成方式如下：

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

#### 原子化框架

在目前的社区当中，CSS 原子化框架主要包括 Tailwind CSS 和 Windi CSS 。Windi CSS
作为前者的替换方案，实现了按需生成 CSS 类名的功能，开发环境下的 CSS 产物体积大
大减少，速度上比 Tailwind CSS v2 快 20~100 倍！当然，Tailwind CSS 在 v3 版本也
引入 JIT(即时编译) 的功能，解决了开发环境下 CSS 产物体积庞大的问题。接下来我们将
这两个方案分别接入到 Vite 中，在实际的项目中你只需要使用其中一种就可以了。

##### Windi CSS 接入

首先安装 `windicss` 以及对应的 vite 插件

```shell
pnpm in windicss vite-plugin-windicss -D
```

随后我们在配置文件中来使用它：

```js
// vite.config.ts
import windi from 'vite-plugin-windicss'

export default {
  plugins: [windi()]
}
```

接着要注意在 `src/main.tsx` 中引入一个必须得 import 语句：

```js
//main.jsx
// 用来注入 Windi CSS 所需的样式，一定要加上！
import 'virtual:windi.css'
```

这样我们就完成了 Windi CSS 在 Vite 中的接入，接下来我们在 Header 组件中来测试，组件代码修改如下:

```js
// src/components/Header/index.tsx
import { devDependencies } from '../../../package.json'
export function Header() {
  return (
    <div className="p-20px text-center">
      <h1 className="font-bold text-2xl mb-2">this is header</h1>
    </div>
  )
}
```

启动项目可以看到如下的效果，说明样式已经正常生效：

![Snipaste_2023-11-06_17-39-05.png](https://s2.loli.net/2023/11/06/FcR1w7EozSTvNHt.png)

除了本身的原子化 CSS 能力，Windi CSS 还有一些非常好用的高级功能，在此我给大家推荐自己常用的两个能力: attributify 和 shortcuts：

要开启这两个功能，我们需要在项目根目录新建 windi.config.ts ，配置如下:

```js
import { defineConfig } from 'vite-plugin-windicss'
export default defineConfig({
  // 开启 attributify
  attributify: true
})
```

首先我们来看看 `attributify`，翻译过来就是 `属性化`，也就是说我们可以用 props 的方式去定义样式属性，如下所示：

```js
<button
  bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
  text="sm white"
  font="mono light"
  p="y-2 x-4"
  border="2 rounded blue-200"
>
  Button
</button>
```

这样的开发方式不仅省去了繁琐的 className 内容，还加强了语义化，让代码更易维护，大大提升了开发体验。

不过使用 attributify 的时候需要注意类型问题，你需要添加 types/shim.d.ts 来增加类型声明，以防类型报错:

```js
import { AttributifyAttributes } from 'windicss/types/jsx';
declare module 'react' {
 type HTMLAttributes<T> = AttributifyAttributes;
}
```

shortcuts 用来封装一系列的原子化能力，尤其是一些常见的类名集合，我们在 windi.config.ts 来配置它:

```js
//windi.config.ts
import { defineConfig } from 'vite-plugin-windicss'
export default defineConfig({
  attributify: true,
  shortcuts: {
    'flex-c': 'flex justify-center items-center'
  }
})
```

比如这里封装了 flex-c 的类名，接下来我们可以在业务代码直接使用这个类名:

```html
<div className="flex-c"></div>
<!-- 等同于下面这段 -->
<div className="flex justify-center items-center"></div>
```

##### Tailwind CSS 接入

首先安装 tailwindcss 及其必要的依赖:

```shell
pnpm install -D tailwindcss postcss autoprefixer
```

然后新建两个配置文件 tailwind.config.js 和 postcss.config.js :

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

接着在项目的入口 CSS 中引入必要的样板代码:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

现在我们就可以在项目中安心地使用 Tailwind 样式了：

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

### vite 项目的代码规范

> 在真实的工程项目中，尤其是多人协作的场景下，代码规范就变得非常重要了，它可以用来统一团队代码风格，避免不同风格的代码混杂到一起难以阅读，有效提高**代码质量**，甚至可以将一些**语法错误**在开发阶段提前规避掉。但仅有规范本身不够，我们需要**自动化的工具**(即 `Lint 工具` )来保证规范的落地，把代码规范检查(包括 `自动修复 `)这件事情交给机器完成，开发者只需要专注应用逻辑本身。

> 接下来我们将一起来完成 Lint 工具链在项目中的落地，实现自动化代码规范检查及修复的能力，学完之后不仅能熟悉诸如 `ESLint` 、 `Prettier` 、 `Stylelint` 和 `Commitlint` 等诸多主流 Lint 工具的概念和使用，还能配合 `husky` 、 `lint-staged` 、`VSCode 插件`和 `Vite 生态`在项目中集成完整的 Lint 工具链，搭建起完整的前端开发和代码提交工作流。

## rollup 和 esbuild 使用

## vite 实战

## 源码阅读

## 手写
