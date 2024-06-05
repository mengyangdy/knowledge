---
title: 如何将template转换为render函数?
tags:
  - vue
  - 面试题
date: 2024-05-24
---
# 一 如何将template转换为render函数？

Vue 中含有模板编译的功能，它的主要作用是将用户编写的 template 编译为 js 中可执行的 render 函数

1. 将 template 模板转换成 ast 语法树 - parserHTML
2. 对静态语法做静态标记-markUp diff 来做优化的静态节点跳过 diff 操作
3. 重新生成代码- codeGen

> Vue 3 中的模板转化，做了更多的优化操作，Vue 2 仅仅时标记了静态节点

## 1.1 转换过程

```js
// 将模板编译为render函数
const { render, staticRenderFns } = compileToFunctions(template,options//省略}, this)

```

### 1.1.1 调用 parse 方法将 template 转化为 ast(抽象语法树)

```js
constast = parse(template.trim(), options)
```

- **parse 的目标**：把tamplate转换为AST树，它是一种用 JavaScript对象的形式来描述整个模板
- **解析过程**：利用正则表达式顺序解析模板，当解析到开始标签、闭合标签、文本的时候都会分别执行对应的 回调函数，来达到构造AST树的目的。

### 1.1.2 对静态节点做优化

```js
optimize(ast,options)
```

这个过程主要分析出哪些是静态节点，给其打一个标记，为后续更新渲染可以直接跳过静态节点做优化

深度遍历AST，查看每个子树的节点元素是否为静态节点或者静态节点根。如果为静态节点，他们生成的DOM永远不会改变，这对运行时模板更新起到了极大的优化作用。

### 1.1.3 生成代码

```js
const code = generate(ast, options)
```

generate将 ast抽象语法树编译成 render字符串并将静态部分放到 staticRenderFns 中，最后通过 `new Function(`` render ``)` 生成render函数。

## 1.2 CompileToFunctions 主要逻辑

1. 调用 `parse()` 方法将 `template` 转化为 `ast` (抽象语法树）
2. `optimize()` 方法对转化为的 `ast`，进行优化，找出静态节点（该静态节点生成的 `dom` 树永不改变，对运行时模板更新起到了极大的优化作用）
3. 最后 `generate()` 将 `ast` 编译成 `render` 字符串，通过 `new Function(render)`,生成 `render` 函数