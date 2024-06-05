---
title: Vue中如何进行依赖收集?
tags:
  - vue
  - 面试题
date: 2024-05-24
---
# 一 Vue中如何进行依赖收集?

## 1.1 依赖收集的流程

- 每个属性都拥有自己的 `dep` 属性，存放他所依赖的 watcher，当属性变化后会通知自己对应的 watcher 去更新
- 默认在初始化时会调用 render 函数，此时会触发依赖收集 `dep.depend`
- 当属性发生修改时会触发 `watcher` 更新 `dep.notify`

![](https://i.imgur.com/Qj8mWcw.png)

## 1.2 vue 3 的依赖收集

- vue 3 中会通过 Map 结构将属性和 effect 映射起来
- 默认在初始化的时候调用 render 函数，此时会触发属性依赖收集 track
- 当属性发生修改时候会找到对应的 effect 列表一次执行 trigger