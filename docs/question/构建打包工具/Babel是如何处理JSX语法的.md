---
title: Babel是如何处理JSX语法的?
tags:
  - 构建打包工具
  - 面试题
date: 2024-05-29
---
# 一 Babel是如何处理JSX语法的?

Babel 处理 JSX 语法主要通过一个特定的插件 `@babel/plugin-transform-react-jsx`。这个插件能够将 JSX 语法转换为普通的 JavaScript 函数调用，通常是 `React.createElement()` 方法的调用，因为 JSX 最初是为 React 框架设计的。以下是处理过程的概览：

1. **解析 JSX 语法**：当 Babel 遇到一个文件中包含 JSX 代码时，它首先使用解析器（如 `@babel/parser`）将 JSX 代码转换为抽象语法树（AST）的形式。在 AST 中，JSX 元素被表示为特定类型的节点，便于后续的转换操作。
    
2. **转换 JSX 节点**：`@babel/plugin-transform-react-jsx` 插件会遍历这个 AST，并寻找代表 JSX 元素的节点。对于每一个这样的节点，它会生成相应的 `React.createElement()` 调用。例如，对于一个简单的 JSX 元素 `<div className="container">Hello</div>`，Babel 会将其转换为 `React.createElement('div', {className: 'container'}, 'Hello')`。
    
3. **处理属性和子元素**：在转换过程中，插件还会处理 JSX 元素的属性，确保它们被正确地转换为 `React.createElement()` 的第二个参数（一个对象，包含属性键值对）。子元素也会被递归处理，转换成对应的参数传递给 `React.createElement()`。
    
4. **displayName 的推断**：在处理 React 组件时，Babel 还会自动推断并添加 `displayName` 属性到由 `React.createClass` 或 ES6 类定义的组件上，以增强调试信息。
    
5. **React 17+ 的新 JSX 转换**：从 React 17 开始，Babel 提供了一个新的 JSX 转换选项，允许更灵活地使用 JSX，包括在不直接依赖 React 的情况下使用 JSX。这个新的转换模式通过 `@babel/preset-react` 预设中的 `runtime: 'automatic'` 或 `useBuiltIns: true` 配置启用，它改变了 JSX 的编译方式，使编译后的代码在运行时动态导入必要的运行时帮助函数。
    

通过上述步骤，Babel 将原本浏览器无法直接理解的 JSX 语法转换成了标准的 JavaScript 代码，确保了在不支持 JSX 的环境中也能正常运行。开发者在编写代码时可以享受到 JSX 的简洁和直观性，同时保持代码的兼容性和可执行性。

# 二 Vite 是如何处理 JSX 语法的?

Vite 处理 JSX 语法主要是通过插件系统来实现的，特别是使用官方推荐的 `@vitejs/plugin-vue-jsx` 插件。这个插件使得在使用 Vue 3 和 Vite 进行开发时，能够支持 JSX 语法。以下是处理流程的简要说明：

1. **安装插件**： 首先，你需要通过 npm 或 yarn 安装 `@vitejs/plugin-vue-jsx` 插件作为项目的开发依赖：

```bash
npm i @vitejs/plugin-vue-jsx -D
```
    
2. **配置 Vite**： 在项目的 `vite.config.js` 配置文件中，你需要引入并应用这个插件。通常的配置如下：

```js
    import { defineConfig } from 'vite';
    import vue from '@vitejs/plugin-vue';
    import vueJsx from '@vitejs/plugin-vue-jsx';
    
    export default defineConfig({
      plugins: [
        vue(),
        vueJsx(), // 添加对 Vue JSX 的支持
      ],
    });
```
    
    这段代码告诉 Vite 使用 `vueJsx` 插件来处理任何遇到的 JSX 代码。
    
3. **编译过程**： 当你运行 Vite 开发服务器或构建命令时，`@vitejs/plugin-vue-jsx` 会介入工作。它利用 Babel 或其他编译器在幕后将 JSX 语法转换为 Vue 或标准 JavaScript 可以识别的代码。这一过程包括将 JSX 标签转换为 `h()` 函数调用（在 Vue 中 `h` 是创建虚拟 DOM 节点的函数），以及处理属性和事件绑定等。
    
4. **开发与构建**： 在开发模式下，Vite 提供了快速的热模块替换（HMR），使得 JSX 的更改可以立即反映在浏览器中。而在构建生产版本时，Vite 使用 Rollup 打包并将编译后的代码进行优化，确保最终产物既高效又兼容目标浏览器。
    

通过这样的配置和处理流程，Vite 使开发者能够在 Vue 项目中无缝地使用 JSX 语法，享受到其带来的简洁性和开发效率的提升。

