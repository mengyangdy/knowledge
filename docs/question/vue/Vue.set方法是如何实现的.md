---
title: Vue.set方法是如何实现的？
tags:
  - vue
  - 面试题
date: 2024-05-24
---
# 一 Vue.set方法是如何实现的？

Vue 不允许在已经创建的实例上动态的添加响应式数据，所以就需要 set 方法

```js
export function set(target, key, value) {
  // 1 是开发环境 target没定义或者是基础类型则报错
  if (
    ProcessingInstruction.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    // warn(...)
  }
  // 2 如果是数组 Vue.set(arr, 1, 100),调用我们重写的数组splice方法 这样可以更新视图

  //3 如果是对象本身的属性 则直接添加即可

  // 4. 如果是Vue实例 或者根数据data的时候 报错

  // 5如果不是响应式的数据 也不需要将其定义为响应式的属性

  // 将属性定义为响应式的

  // 通知视图更新
}
```