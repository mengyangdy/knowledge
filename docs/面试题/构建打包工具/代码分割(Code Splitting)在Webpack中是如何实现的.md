---
title: 代码分割(Code Splitting)在Webpack中是如何实现的?
tags:
  - 构建打包工具
  - 面试题
date: 2024-05-29
---
# 一 代码分割(Code Splitting)在Webpack中是如何实现的?

在Webpack中，代码分割（Code Splitting）是一种优化策略，它允许将代码库分解成多个较小的“chunks”（块），以便按需加载，而不是一次性加载整个应用的所有代码。这有助于减少初始加载时间，提升用户体验。Webpack提供了多种方式来实现代码分割，以下是一些关键技术和步骤：

## 1.1 动态导入（Dynamic Imports）

自从ES2020正式标准化了动态导入语法（`import()`表达式），这是实现代码分割的首选方法。动态导入是异步的，可以让你在运行时按需加载模块。例如：

```js
import('./myModule.js').then((module) => {
  // 使用模块
});
```

Webpack会自动检测到这样的动态导入并据此创建新的代码块（chunks）。

## 1.2 SplitChunksPlugin

`SplitChunksPlugin`是Webpack内置的一个插件，用于自动地将公共的、可复用的模块分割到单独的chunk中。可以通过在Webpack配置文件中设置`optimization.splitChunks`来配置其行为。例如，可以配置它来分割 Vendor（第三方库）代码，或者基于某些规则（如模块大小、共享模块等）自动分割代码。

## 1.3 入口点分割

可以直接在Webpack的配置文件中为每个入口点指定额外的依赖，这样Webpack会为这些依赖生成独立的chunk。这可以通过在`entry`配置中使用对象形式来实现，为每个入口指定一个数组，数组中包含主入口文件和其他需要分割的模块。

## 1.4 魔法注释

在一些特殊场景下，可以通过在`import`语句后面添加所谓的“魔法注释”来指导Webpack如何分割代码。例如，可以指示Webpack将某个模块打入特定的chunk中，或者强制创建一个新的chunk。

```js
import(/* webpackChunkName: "my-chunk-name" */ './myModule.js');
```

## 1.5 配置示例

在`webpack.config.js`中，可以配置`optimization.splitChunks`如下：

```js
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  // ...
};
```

这段配置会将来自`node_modules`的模块分割到名为`vendors`的chunk中，同时也会根据一定的条件（如至少被两个chunk共享）对其他模块进行自动分割。

通过这些方法，Webpack能够智能地分析依赖关系，按需加载代码，从而提高应用的加载速度和运行效率。

