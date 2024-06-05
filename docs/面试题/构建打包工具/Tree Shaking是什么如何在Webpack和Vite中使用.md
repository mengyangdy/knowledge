---
title: Tree Shaking是什么如何在Webpack和Vite中使用?
tags:
  - 构建打包工具
  - 面试题
date: 2024-05-29
---
# 一 Tree Shaking是什么?如何在Webpack和Vite中使用?

> Tree Shaking 是一种代码优化技术，用于消除 JavaScript 代码中未使用的导出（dead code）。这一过程依赖于 ES2015（ES6）模块系统提供的静态导入和导出语法，因为这种语法使得模块间的依赖关系在编译时就可以被静态分析确定。简而言之，Tree Shaking 会“摇晃”代码树，将未被引用的代码“摇落”，从而减小最终打包产物的体积，提高应用程序的加载和运行效率。

## 1.1 在 Webpack 中使用 Tree Shaking

Webpack 从 v2 开始支持 Tree Shaking，到了 v4 和 v5 版本，Tree Shaking 的功能更加成熟和完善。要在 Webpack 中启用 Tree Shaking，请遵循以下步骤：

1. **使用 ES6 模块语法**：确保你的代码使用 `import` 和 `export` 而非 CommonJS（如 `require` 和 `module.exports`）语法。
    
2. **配置 Webpack**：在大多数情况下，Webpack 在生产模式 (`mode: 'production'`) 下会自动启用 Tree Shaking。但你也可以通过配置 `optimization.usedExports: true` 明确开启此功能。

```js
    module.exports = {
    mode: 'production',
    optimization: {
      usedExports: true, // 明确开启 Tree Shaking
    },
    };
```
    
3. **避免副作用**：对于具有副作用的模块，你可以在其 `package.json` 文件中添加 `"sideEffects": false` 属性，告诉 Webpack 这个模块没有副作用，可以安全地进行 Tree Shaking。如果模块有副作用，应明确列出副作用文件。
    

## 1.2 在 Vite 中使用 Tree Shaking

Vite 是一个现代的前端构建工具，它利用了 ES 模块的原生能力，因此天生就对 Tree Shaking 支持良好。Vite 默认配置已经为 Tree Shaking 提供了良好的支持，你通常不需要额外配置即可享受 Tree Shaking 带来的优化。以下是一些建议：

1. **使用 ES 模块**：同样，确保你的代码使用 ES6 的 `import` 和 `export` 语法。
    
2. **配置 Vite**：Vite 在开发模式下就非常注重速度和按需编译，对于 Tree Shaking，Vite 会自动处理，通常不需要额外配置。在生产构建时（通过 `vite build`），Vite 自动应用各种优化，包括 Tree Shaking。
    
3. **模块分析**：Vite 提供了很好的开发时体验，你可以在开发过程中观察到 Tree Shaking 的效果，通过 Vite 的 HMR 和快速反馈机制，可以看到改动后的即时影响。
    

总的来说，无论是 Webpack 还是 Vite，只要确保使用 ES6 模块语法，并且遵循最佳实践，就能充分利用 Tree Shaking 来优化代码。对于特定的高级配置或特殊情况，查阅官方文档或社区指南可以获得更详细的帮助。
