---
title: 解释Babel插件和预设(presets)的区别和用法
tags:
  - 构建打包工具
  - 面试题
date: 2024-05-29
---
# 一 解释Babel插件和预设(presets)的区别和用法

> Babel 是一个强大的转译器，它能够将使用现代 JavaScript 语法编写的代码转换为向后兼容的版本，以便在不同的浏览器和环境中执行。在 Babel 的配置中，**插件（plugins）** 和 **预设（presets）** 是两个核心概念，它们有各自的作用和用法：

## 1.1 插件（Plugins）

**插件** 是 Babel 的核心组成部分，每个插件都是一个独立的功能模块，负责转换特定的 JavaScript 语法或特性。例如，一个插件可以负责将箭头函数转换为传统的函数表达式，另一个插件则可能负责处理 async/await 语法。插件通过操作抽象语法树（AST）来实现代码的转换。

**用法**： 插件在 Babel 配置文件（`.babelrc`、`babel.config.js` 等）的 `plugins` 数组中指定。每个插件通常以字符串形式列出，对于需要配置的插件，可以使用数组内的数组形式，其中第一个元素是插件名称，第二个元素是配置对象。例如：

```json
{
  "plugins": [
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/plugin-transform-runtime"
  ]
}
```

## 1.2 预设（Presets）

**预设** 是一组插件的集合，旨在简化配置过程，它们代表了针对特定环境或需求的一揽子解决方案。预设通常针对一组常见的需求（如支持最新的 ES 标准、转换 TypeScript、React JSX 语法等）预配置好了一系列插件及其选项。使用预设可以避免逐个配置每个插件的繁琐工作。

**用法**： 预设在 Babel 配置文件的 `presets` 数组中指定。与插件类似，预设也可以携带配置对象。预设列表按照数组的逆序执行，这是为了确保后面的预设可以覆盖前面预设的配置。例如：

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": "> 0.25%, not dead" }],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}
```

在这个例子中，`@babel/preset-env` 用于根据目标浏览器的兼容性自动选择需要的转译规则，`@babel/preset-react` 处理 React 的 JSX 语法，而 `@babel/preset-typescript` 则用于转译 TypeScript 代码。

## 1.3 总结

- **插件** 是单一功能转换器，针对性地处理特定的语法或特性。
- **预设** 是插件的组合，为特定目标或环境提供一整套的配置，简化配置过程。
- 插件在 Babel 配置中直接指定，而预设则是插件的高级组织形式，使得配置更加高效和便捷。
