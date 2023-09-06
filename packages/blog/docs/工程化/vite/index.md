---
title: vite 学习
tag:
  - vite
date: 2023-08-27
cover: https://s2.loli.net/2023/08/28/RJIPrjOkfFGNDAl.jpg
---

# vite 学习

## vite 介绍

### 什么是 vite ?

Vite（法语意为 "快速的"，发音  `/vit/`，发音同 "veet"）是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：

- 一个开发服务器，它基于  [原生 ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)  提供了  [丰富的内建功能](https://cn.vitejs.dev/guide/features.html)，如速度快到惊人的  [模块热更新（HMR）](https://cn.vitejs.dev/guide/features.html#hot-module-replacement)
- 一套构建指令，它使用  [Rollup](https://rollupjs.org/)  打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

### vite 特点

- 使用简单
- 快
- 便于扩展（可以使用 rollup 插件）

### vite 和其他构建工具的区别

- High Level API
  - 其他的构建工具更关注与细节功能的实现：文件如何加载、文件如何编译等等
- 不包含自己编译能力
  - vite 的编译能力源自于 ES6 和 rollup，vite 并不参与编译，他只是集成了 rollup 功能，他只是在中间进行一个串联的作用。
- 完全是基于 ESM 加载方式的开发时

## vite 基本使用

### vite 对 css 的支持

- vite 可以直接支持 css 的处理
  - 直接导入 css 即可
- vite 可以直接支持 css 预处理器，比如 less
  - 直接导入 less 文件即可
  - 之后安装 less 编译器
  - `npm install less -D`
- vite 直接支持 postcss 的转换：
  - 只需要安装 postcss，并且配置 postcss.config.js 的配置文件即可
  - `npm install postcss postcss-preset-env -D`

```JavaScript
module.exports = {
  plugins: [require("postcss-preset-env")],
}
```

### vite 对 TypeScript 的支持

- vite 对 TypeScript 是原生支持的，它会直接使用 ESBuild 来完成编译：
  - 只需要直接导入
- 如果我们查看浏览器中的请求，会发现请求的依然是 ts 的代码
  - 这是因为 vite 中的服务器 Connect 会对我们的请求进行转发
  - 获取 ts 编译后的代码，给浏览器返回，浏览器可以直接进行解析
- 注意：在 vite2 中，已经不再使用 Koa 了，而是使用 Connect 来搭建的服务器

### vite 对 vue 的支持

- vite 对 vue 提供第一优先级支持：
  - Vue3 单文件组件支持：`@vitejs/plugin-vue`
  - Vue3JSX 支持：`@vitejs/plugin-vue-jsx`
  - Vue2 支持：`underfin/vite-plugin-vue2`
- 安装支持 vue 的插件：
  - `npm install vite-plugin-vue2 -D`
- 在 vite.config.js 中配置插件:

```JavaScript
import { createVuePlugin } from "vite-plugin-vue2"

export default {
  plugins: [createVuePlugin()],
}
```

### vite 对 react 的支持

- .jsx 和.tsx 文件同样开箱即用，他们也是通过 ESBuild 来完成编译
  - 所以我们只需要直接编写 react 的代码即可
  - 注意：在 index.html 加载 main.js 时，我们需要将 main.js 的后缀，修改为 majn.jsx 作为后缀名
