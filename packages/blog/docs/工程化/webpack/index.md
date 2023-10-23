---
title: webpack学习
tags:
  - webpack
date: 2023-10-23
cover:
---

# webpack 学习

## 认识 webpack 工具

### 认识 webpack

- 事实上随着前端的快速发展，目前前端的开发已经变得越来越复杂了
  - 比如开发过程中过我们需要通过模块化的方式来开发
  - 比如也会使用一些高级的特性来加快我们开发效率或者安全性，比如通过 ES 6+、TypeScript 开发脚本逻辑，通过 sass、less 等方式来编写 css 样式代码
  - 比如开发过程中，我们还希望实时的监听文件的变化来反应到浏览器上，提高开发的效率
  - 比如开发完成后我们还需要将代码进行压缩、合并以及其他相关的优化
- 但是对于很多的前端开发着来哦，并不需要考虑这些问题，日常的开发中根本就没有面临这些问题
  - 这是因为目前前端开发我们通常都会直接使用三大框架来开发
  - 事实上，这三大框架的创建过程我们都是借助于脚手架开发的
  - vue-cli、create-react-app 都是基于 webpack 来帮助我们支持模块化、less、typescript、打包优化等等

### webpack 到底是什么？

- 我们先来看一下官方的解释：
  - webpack is a static module bundler fro modern javascript applications
- webpack 是一个静态的模块化打包工具，为现代的 JavaScript 应用程序
- 我们来对上面的解释进行拆解
  - **打包 bundler**：webpack 可以帮助我们进行打包，所以他是一个打包工具
  - **静态的 static**：这样表述的原因是我们最终可以将代码打包成最终的静态资源（部署到静态服务器）
  - **模块化 module**：webpack 默认支持各种模块化开发，ES Module、CommonJS、AMD
  - **现代的 modern**：正式因为现代前端开发面临各种各样的问题，才催生了 webpack 的出现和发展

![iShot_2023-10-23_20.56.52.png](https://s2.loli.net/2023/10/23/VhQMO3sBZ2Iwadr.png)

### Vue 项目加载的文件有哪些？

- JavaScript 的打包
  - 将 es 6 转换成 ES 5 的语法
  - typescript 的处理，将其转换成 JavaScript
- css 的处理：
  - css 文件模块的加载、提取
  - less、sass 等于处理器的处理
- 资源处理 img、font
  - 图片 img 文件的加载
  - 字体 font 文件的加载
- html 资源的处理
  - 打包 html 资源文件
- 处理 vue 项目的 SFC 文件. vue 文件

## webpack 基本打包

### webpack 的安装

- webpack 的安装目前分为 webpack、webpack-cli
- 那么他们是什么关系呢？
  - 执行 webpack 命令，会执行 node_modules 下的. bin 目录下的 webpack
  - webpack 在执行时是依赖 webpack-cli 的，如果没有安装就会报错
  - 而 webpack-cli 中代码执行时，才是真正利用 webpack 进行编译和打包的过程
  - 所以在安装 webpack 时，我们需要同时安装 webpack-cli（第三方的脚手架事实上是没有使用 webpack-cli 的，而是类似于自己的 `vue-~~service-cli` 的东西）

![iShot_2023-10-23_21.08.56.png](https://s2.loli.net/2023/10/23/zpMIfGNjkxUwmAQ.png)

```shell
# 全局安装
npm install webpack webpack-cli -g

# 局部安装
npm install webpack webpack-cli -D
```

### webpack 的默认打包

- 我们可以通过 webpack 进行打包，之后运行打包之后的代码
  - 在目录下直接执行 webpack 命令
  - `webpack`
- 生成一个 dist 文件夹，里面存放着一个 main. js 的文件，就是我们打包之后的文件
  - 这个文件中的代码被压缩和丑化了
  - 另外我们发现代码中依然存在着 ES 6 的代码，比如箭头函数、const 等，这是因为默认情况下 webpack 并不清楚我们打包后的文件是否需要转成 ES 5 之前的语法，后续我们需要通过 babel 来进行转化和设置
- 我们发现是可以正常进行打包的，但是有一个问题，webpack 是如何确定我们的入口的呢？
  - 事实上，当我们运行 webpack 时，webpack 会查找当前目录下的 src/index. js 作为入口
  - 所以，如果当前项目中没有存在 src/index. js 文件，那么会报错
- 当然，我们也可以通过配置来制定入口和出口
  - `npx webpack --entry ./src/main.js --output-path ./build`

### 创建局部的 webpack

- 前面我们直接执行 webpack 命令使用的是全局的 webpack，如果希望使用局部的昆虫按照下面的步骤来操作
- 第一步：创建的 package. json 文件，用于管理项目的信息、库依赖等
  - `npm init`
- 第二步：安装局部的 webpack
  - `npm install webpack webpack-cli -D`
- 第三步：使用局部的 webpack
  - `npx webpack`
- 第四步：在 package. json 中创建 scripts 脚本，执行脚本打包即可
  - `"build":"webpack"`
  - `npm run build`

## webpack 配置文件

- 在通常情况下，webpack 需要打包的项目是非常复杂的，并且我们需要一系列的配置来满足要求，默认配置必然是不可以满足的
- 我们可以在根目录下创建一个 webpack. config. js 文件，来作为 webpack 的配置文件：

```js
const path = require('path')
module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'builder.js',
    path: path.resolve(__dirname, './dist')
  }
}
```

- 继续执行 webpack 命令，依然可以正常打包
  - `npm run build`
- 但是如果我们的配置文件并不是 `webpack.config.js` 的名字，而是其他的名字呢？
  - 比如我们将 webpack.config.js 修改成了 wk.config.js
  - 这个时候我们通过--config 来指定对应的配置文件
    - `webpack --config wk.config.js`
- 但是每次这样执行命令来对源码进行编译，会非常繁琐，所以我们可以在 package.json 中将脚本修改下即可

## webpack 依赖图

- webpack 到底是如何对我们的项目进行打包的呢？
  - 事实上 webpack 在处理应用程序时，他会根据命令或者配置文件找到入口文件
  - 从入口开始，会生成一个依赖关系图，这个依赖关系图会包含应用程序中所需的所有模块（比如.js 文件、css 文件、图片、字体等）
  - 然后遍历图结构，打包一个个模块（根据文件的不同使用不同的 loader 来解析）

## 编写和打包 css 文件

## 编写和打包 LESS 文件

## postcss 工具处理 css
