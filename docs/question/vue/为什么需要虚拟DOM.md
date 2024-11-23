为什么需要虚拟DOM

# Vue为什么需要虚拟DOM？

## 1.1 基本概念

> 基本上所有框架都引入了虚拟 dom 来对真实 dom 进行抽象，也就是现在大家所熟知的 `VNode` 和 `VDOM`

> virtual dom 就是用 js 对象来描述真实 dom，是对真实 dom 的抽象，由于直接操作 dom 性能低但是 js 层的操作效率高，可以将 dom 操作转化成对象操作，最终通过 diff 算法比对差异进行更新 dom（减少了对真实 dom 的操作）
> 虚拟 dom 不依赖真实平台环境从而也可以实现跨平台

## 1.2 Vue为什么使用虚拟 DOM?

## 1.2 VDOM 时如何生成的？

- 在 vue 中我们常常会为组件编写模板-template
- 这个模板会被编译器编译为渲染函数-render
- 在接下来的挂载过程中中调用 render 函数，返回的对象就是虚拟 dom
- 会在后续的 patch 过程中进一步转化为真实 dom

## 1.3 VDOM 如何做 diff 的？

- 挂载过程结束后，会记录第一次生成的 VDOM-oldVnode
- 当响应式数据发生变化后，将会引起组件重新 render，此时就会生成新的 VDOM-newVnode
- 使用 oldVnode 与 newVnode 做 diff 操作，将更改的部分应用到真实 dom 上，从而转换为最小量的 dom 操作，高效更新视图

## 1.4 虚拟 DOM 的解析过程是怎么样的?
