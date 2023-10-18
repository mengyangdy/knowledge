---
title: nuxt3中的网络请求
tags:
  - vue
  - nuxt3
date: 2023-10-18
cover: https://s2.loli.net/2023/10/18/FBMDIrA93aZ28qW.jpg
---

# nuxt3中的网络请求

在 nuxt3 中我们请求数据既可以用官方封装的 fetch 也可以使用我们在 vue 项目中经常使用的 axios，这两者的区别：

- 官方封装的 fetch 在使用的时候考虑到了服务端渲染和客户端之间的差异，做了一些兼容性处理
- axios 使用起来比较熟悉，方便，上手比较快一点

## nuxt3 的请求数据方法

nuxt3 提供了四种方法可以使我们获取异步数据：

- useAsyncData
- useLazyAsyncData(useAsyncData+lazy:true)
- useFetch
- useLazyFetch(useFetch+lazy:true)

nuxt 提供的这四种方法中，核心的就是 `useAsyncData` 和 `useFetch`，这两个方法和 nuxt2 中的 `asyncData` 和 `fetch` 是不同的用法。

### useAsyncData

在 nuxt2 中，`asyncData` 方法相当于是一个生命周期函数方法，在服务端或者是路由更新之前调用，方法的参数是当前页面的上下文对象，我们一般是用 `asyncData` 请求数据给当前的组件使用，这样就可以让页面在服务器就拼接好。

```js
export default{
  asyncData(context){
	  return ...
  }
}
```

在 nuxt3 中
