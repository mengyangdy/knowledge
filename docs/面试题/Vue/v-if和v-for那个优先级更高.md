---
title: v-if和v-for那个优先级更高?
tags:
  - vue
  - 面试题
date: 2024-05-24
---
# 一 v-if和v-for那个优先级更高?

- 在 Vue 2 中解析时，先解析 v-for 在解析 v-if，会导致先循环后在对每一项进行判断，浪费性能
- 在 Vue 3 中 v-if 的优先级高于 v-for

## 1.1 测试 vue 2

![image.png](https://i.imgur.com/VXV6qN0.png)

## 1.2 测试 vue 3

![image.png](https://i.imgur.com/xA9dzLp.png)
