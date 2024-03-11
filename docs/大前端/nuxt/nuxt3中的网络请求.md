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

在 nuxt3 中，`useAsyncData` 可以看做是一个异步获取数据的方法，我们可以主动去调用这个函数，而且也不用在意是在服务端使用还是在客户端使用，其中的差异 nuxt 官方已经给我们做好了，我们不用担心。

```js
const {
	data:Ref<DataT>,//返回的数据结果
	pending:Ref(boolean),//是否在请求状态中
	refresh:(force?:boolean)=>Promise<voild>,//强制刷新数据
	error?:any//请求失败返回的错误信息
	status:Ref<AsyncDataRequestStatus>//  指示数据请求状态的字符串
}=useAsyncData(
	key:string,//一个唯一的键，以确保数据获取可以跨请求正确地去重，如果没有会自动生成一个值
	fn:()=>Object,//一个异步函数，必须返回一个真值，如果返回null或者undefined可能会重复执行
	options?:{lazy:boolean,server:boolean}
	//server  是否在服务端请求数据，默认为true
	//lazy  是否在加载路由后才请求该异步方法 默认为false
	//immediate 是否立即调用异步函数请求数据 默认为true
	//transform 对请求之后的数据进行解析
	//default  异步请求前设置数据data默认值的工厂函数（对lazy：true选项有用）
	//transform  更改fn返回结果的函数
	//pick  只从数组中制定的key进行缓存
)
```

在页面中使用：

```vue
<script setup>
import { getCustomPage } from '~/api'
const route = useRoute()
const id = ref(route.query.id)

const { data } = await useAsyncData('detail', () => getCustomPage(id.value))
// 这里我们就可以在页面上使用data了
</script>
```

### useFetch

在 nuxt2 中 fetch 方法用于在渲染页面之前把数据存在 store 中，fetch 和 asyncData 的区别就是 fetch 不会设置组件的数据

```vue
<template>
  <h1>{{ $store.state.name }}</h1>
</template>

<script>
export default {
  fetch({ store, params }) {
    return axios.get('http://localhost:8000').then(res => {
      store.commit('setName', res.data)
    })
  }
}
</script>
```

在 nuxt3 中，`useFetch` 主要是对 `useAsyncData` 和 `$fetch` 的组合封装成的一个 API，相比于 `useAsyncData`，主要是做了以下的改变：

- 根据 url 和 fetch 的参数自动生成一个 key，同时推断出 API 的响应类型，所以我们不需要手动的设置 key 了
- 实现了服务端和客户端的网络请求，使用 `$fetch` 发送请求

```js
//useFetch用法
const {
  data: Ref<DataT | null>//传入的异步函数的结果
  pending: Ref<boolean>//一个布尔值，指示是否仍在获取数据
  refresh: (opts?: AsyncDataExecuteOptions) => Promise<void>//可用于刷新函数返回的数据的函数
  execute: (opts?: AsyncDataExecuteOptions) => Promise<void>//
  error: Ref<ErrorT | null>//如果数据获取失败，则返回错误对象
  status: Ref<AsyncDataRequestStatus>//指示数据请求状态的字符串
}=useFetch(url:string,options?)
//method 请求方法
//query  查询搜索参数
//params  别名query
//body  请求正文
//headers  请求标头
//baseURL 请求的基本 URL
// ...
```

注意：因为 `useFetch` 是对 `useAsyncData` 的一个封装，所以我们页面上请求数据的时候，不使用 `useAsyncData` 直接使用我们封装好的接口请求也可以

```vue
<template>
  <div class="pb-120px bg-#fff">
    <div>这个是测试的页面</div>
    <div v-if="data">这个是data的数据</div>
  </div>
</template>

<script setup lang="ts">
import { testData } from '~/api'

// const { data } = await useAsyncData('text', () => testData())
const { data } = await testData()
</script>
```

### 对 useFetch 进行封装

```js
export function createRequest(config: any) {
  const fetch = async (url: string, options?: any, headers?: any) => {
    try {
      const reqUrl = config.url + url
      // 设置key
      const key = hash(options + url)
      const userStore = useUserStore()
      // 可以设置默认headers例如，token的获取最好用useState返回一个useCookie
      const customHeaders = {Authorization: `Bearer ${userStore.token || ''}`, ...headers}
      const {data} = await useFetch(reqUrl, {
        ...options,
        key,
        headers: customHeaders,
        // onRequest相当于请求拦截
        // onRequest() {
          // console.log("-> request", request);
          // console.log(options, 'options')
          // 设置请求头
          // options.headers = {...options.headers, authorization: 'xxx'};
        // },
        // onResponse相当于响应拦截
        onResponse({response}) {
          if (response.status >= 400) {
            ElMessage({
              type: 'error',
              message: response._data.message
            })
            return response._data
          }
        },
        // onRequestError({request, options, error}) {
        // 处理请求错误
        // },
        // onResponseError({request, response, options}) {
        // 处理响应错误
        // }
      })
      return Promise.resolve(unref(data))
    } catch (e) {
      return Promise.reject(e)
    }
  }

  const get = (url: string, params?: any, headers?: any) => {
    return fetch(url, {method: 'get', params}, headers)
  }

  const post = (url: string, body?: any, headers?: any) => {
    return fetch(url, {method: 'post', body}, headers)
  }

  const put = (url: string, body?: any, headers?: any) => {
    return fetch(url, {method: 'put', body}, headers)
  }


  const handleDelete = (url: string, body?: any, headers?: any) => {
    return fetch(url, {method: 'delete', body}, headers)
  }

  return {
    get,
    post,
    put,
    delete: handleDelete
  }
}
```

## 项目中常用的场景

### 对返回的数据进行处理

在真实的项目中我们的返回的数据都是带有状态码，或者是 message 的数据，这样的话我们返回的数据还得需要处理才能使用：

```js
useFetch(url, {
  // onResponse相当于响应拦截
  onResponse({ response }) {
    // response._data = {
    //   ...response._data.data
    // }
  }
})

//第二种方法
// transform: (res) => {
//   return res.data
// },
```

### 只在客户端发送请求

一般我们要做静态化构建部署的时候，我们就需要只在客户端发送请求，这样我们就可以使用 `server:false` 这个参数：

```js
//异步获取数据
const data = await useAsyncData('text', () => testData())
```

注意：这种情况下在 script 内是获取不到 data 的内部值的，官方文档说明：

> if you have not fetched data on the server (for example, with `server: false`), then the data will not be fetched until hydration completes. This means even if you await useFetch on client-side, data will remain null within `<script setup>`.

如果要获取数据的话：

- 通过 watch 监听 data 数据变化然后使用数据
- 使用 fetch 发送请求

### 将响应式结构转化为非响应的数据

我们使用 `useFetch` 请求数据后默认返回的是一个 ref 对象，我们使用的时候还得加上 `.value`，所以我们可以把数据转化为非响应式的

```js
const data = await useAsyncData('text', () => testData())
const userInfo = unref(data)
```
