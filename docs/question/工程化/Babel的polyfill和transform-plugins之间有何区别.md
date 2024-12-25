---
title: Babel的polyfill和transform-plugins之间有何区别?
tags:
  - 构建打包工具
  - 面试题
date: 2024-05-29
---
# 一 Babel的polyfill和transform-plugins之间有何区别?

> Babel 的 `polyfill` 和 `transform-runtime` 插件服务于不同的目的，旨在帮助开发者编写的新 JavaScript 代码在较旧的环境中运行。下面是它们的主要区别：

## 1.1 @babel /polyfill（已废弃，推荐使用 `core-js` 和 `regenerator-runtime`）

- **目标**：@babel/polyfill（现在已经被废弃，推荐的做法是分别直接使用 `core-js` 和 `regenerator-runtime`）原本是一个包，它提供了许多垫片（polyfills）来模拟新的 JavaScript 语言特性和 API，确保这些特性能在不支持它们的环境中工作。例如，它会提供 `Promise`、新的数组方法（如 `Array.from`）、新的字符串方法等的实现。使用 @babel/polyfill 会将这些实现注入全局作用域，使得整个应用能够使用这些特性。
    
- **影响**：由于 @babel/polyfill 将所有可能需要的垫片都包含进来，这可能导致最终打包的代码体积增大，即便应用中并未使用到所有的特性。同时，它会污染全局作用域，可能与其他库产生冲突。
    

## 1.2 @babel /plugin-transform-runtime

- **目标**：与 @babel/polyfill 不同，@babel/plugin-transform-runtime 及其配套的 @babel/runtime 库提供了一种更为精细的方法来处理垫片，以避免全局污染和代码重复。它通过在编译时引入对 @babel/runtime 中共享函数的引用，而不是直接将这些函数内联到每个文件中。这样做可以减少打包后代码的大小，并保持全局命名空间的清洁。
    
- **运作方式**：当你在代码中使用了新的语法特性或 API 时，@babel/plugin-transform-runtime 会确保在编译时引入必要的运行时支持，而不是每次使用时都重复包含。例如，它会重用 `regeneratorRuntime` 而不是为每个使用 generator 或 async/await 的函数都生成一份。
    

## 1.3 总结

- **适用场景**：如果你正在构建一个库或者关心代码体积的项目，@babel/plugin-transform-runtime 是更好的选择，因为它可以避免全局污染并减少代码重复。而对于一个完整的应用程序，特别是不需要严格控制输出体积，且不介意全局作用域增加的场景，原先的 @babel/polyfill（现在推荐分开使用 `core-js` 和 `regenerator-runtime`）提供了一种简便的全局兼容方案。

总的来说，两者都是为了兼容性，但采用不同的策略来达到目的：@babel/polyfill 更倾向于全局解决方案，而 @babel/plugin-transform-runtime 注重局部和效率。
