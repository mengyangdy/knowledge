---
title: 切换tab后fixed定位的元素跳动
tags:
  - vue
  - 定位
date: 2023-09-12
cover: https://s2.loli.net/2023/09/12/pcHjCE4Bga5TFk9.jpg
---
# 切换 tab 后 fixed 定位的元素跳动

## Bug 的出现

![](https://s2.loli.net/2023/09/12/DGzRWur3ZaK2XnF.png)

在页面底部使用了 `position:fixed;` 制作了一个按钮组件，每个 tab 页面的底部按钮还是不一样的，在切换 tab 的时候下面的按钮总会出现在上面然后在定位到最下面。

## Fixed 定位

`position:fixed;` 是固定定位的意思，把一个 div 定位到一个固定的位置，无论页面上的内容如何滚动，页面上定位的元素不会动的。

## 切换 tab 后会抖动

当元素祖先的 transform/perspective/filter 或者 backdrap-filter 属性非 `none` 时，容器由视口改为该祖先元素。

也就是说当 fixed 的元素的父级元素有任意一个 transform/perspective/filter 或者 backdrop-filter 不为空，则会基于这个容器而定位，而不是浏览器窗口了。

因为在 tab 切换的时候使用了 transform 这个属性，所以定位的父级元素就发生了变化。

## 解决

自定义一个组件，将我们需要 fixed 定位的元素放到这个组件里面，在组件的渲染和卸载的生命周期函数中分别将组件这个组件的元素插入到 body 中和在 body 中删除这个元素。

```vue
<template>
  <div ref="insertBodyEl">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const insertBodyEl = ref(null)
onMounted(() => {
  document.body.appendChild(insertBodyEl.value)
})
onBeforeUnmount(() => {
  document.body.removeChild(insertBodyEl.value)
})
</script>

<style scoped></style>
```

这段代码的作用是将 vue 组件的内容渲染并且插入到页面 `body` 元素中。在组件的 `mounted` 中插入元素，在 unmounted 中把元素从 body 中删除。

在 onUnmount 中获取到的 ref 是空的，所以需要在 onBeforeUnmount 里面把元素删除。组件卸载的时候一定要删除元素，要不元素会越来越多。