---
title: new-Vue过程中做了些什么?
tags:
  - vue
  - 面试题
date: 2024-05-24
---
# 一 new-Vue过程中做了些什么?

- 在 new Vue 的时候内部会进行初始化操作
- 内部会初始化组件绑定的事件，初始化组件的父子关系 `$parent` / `$root`
- 初始化响应式数据 data/computed/props/watch,同时也初始化了 provide 和 inject 方法，内部会对数据进行劫持对象采用 defineProperty 数组采用重写方法
- 在看一下用户是否传入了 el 属性和 template 或者 render，render 的优先级更高，如果用户写的是 template，会做模板编译，最终就拿到了 render 函数
- 内部挂载的时候会产生一个 watcher，会调用 render 函数会触发依赖收集，内部还会给所有的响应式数据增加 dep 属性，让属性记录当前的 watcher（用户后续修改的时候可以触发 watcher 重新渲染）
- vue 更新的时候采用虚拟 DOM 的方式进行 diff 算法更新