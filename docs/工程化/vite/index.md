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
Vite（法语意为 "快速的"，发音 `/vit/`，发音同 "veet"）是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：
- 一个开发服务器，它基于 [原生 ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 提供了 [丰富的内建功能](https://cn.vitejs.dev/guide/features.html)，如速度快到惊人的 [模块热更新（HMR）](https://cn.vitejs.dev/guide/features.html#hot-module-replacement)
- 一套构建指令，它使用 [Rollup](https://rollupjs.org/) 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

### vite 特点
- 使用简单
- 快
- 便于扩展（可以使用rollup插件）

### vite 和其他构建工具的区别
- High Level API
	- 其他的构建工具更关注与细节功能的实现：文件如何加载、文件如何编译等等
- 不包含自己编译能力
	- vite的编译能力源自于ES6和rollup，vite 并不参与编译，他只是集成了rollup功能，他只是在中间进行一个串联的作用。
- 完全是基于ESM加载方式的开发时

