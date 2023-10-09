---
title: nuxt3+pinia实现数据持久化
tags:
  - nuxt3
  - pinia
  - 持久化
date: 2023-10-09
cover: https://s2.loli.net/2023/10/09/AE71CNKb6RMi8vz.jpg
---

# nuxt3+pinia 实现数据持久化

> 在 nuxt 3 项目中，我们使用 pinia 存储数据时，如果刷新页面的话数据就消失了，所以我们需要做数据持久化。

## 配置 pinia

安装相关的依赖：

```bash
pnpm add pinia @pinia/nuxt
```

然后在 nuxt.config.ts 中进行修改位置：

```js
export default defineNuxtConfig({
+  modules: [
+    '@pinia/nuxt'
+  ]
})
```

在项目中使用：

```js
import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: '',
    token:'',
  }),
  getters: {},
  actions: {
    async userLogin(data: any) {
      this.loginLoading = true
    }
  }
})
```

## 使用 pinia 插件实现持久化

项目中使用的比较多的就是实用插件来实现持久化，在 pinia 中有个下载量比较多的插件 `pinia-plugin-persistedstate`，插件官网为：[pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/)

安装插件：

```shell
pnpm add @pinia-plugin-persistedstate/nuxt
```

配置下 nuxt.config.ts:

```js
modules: ['@unocss/nuxt', '@pinia/nuxt', '@element-plus/nuxt','@pinia-plugin-persistedstate/nuxt'],
piniaPersistedstate: {
    storage: 'localStorage',
},
```

在需要持久化的 store 里面添加一行：

```js
export const useUserStore = defineStore('user', {
  state: () => ({
    loginLoading: false
  }),
  getters: {},
  actions: {},
  persist: true
})
```

设置为 true，表示这个 store 要进行持久化处理。

## 使用 vueuse

`vueuse` 中有个 `storage` 相关的 hook,我们可以使用 hook 来保存 `store`。刷新的时候从 `storage` 中读取数据，就达到了数据保存的效果。

我们先安装依赖：

```bash
pnpm i -D @vueuse/nuxt @vueuse/core
```

然后配置 nuxt.config.ts 文件：

```js
modules: ['@vueuse/nuxt']
```

然后我们就可以在项目中使用了，要使用的 `useStorage` 方法所在官网位置为：[useStorage](https://vueuse.org/core/useStorage/)

我们需要修改原来的 store 使用方式：

```js
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
  const state = useStorage('text-demo', {
    name: 'aaa',
    count: 0
  })
  const setState = () => {
    console.log(state)
    state.value.count++
  }

  return {
    state,
    setState
  }
})
```

在页面中使用：

```vue
<template>
  <div>
    <client-only>
      <div>
        {{ userStore.state.count }}
      </div>
    </client-only>
    <div>
      <button @click="userStore.setState">点击count</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
</script>
```

我们可以发现这样是可以使用的，但是当页面刷新的时候，我们会发现 storage 里面存储的 count 已经变为了 0

具体的原因我们可以去 [官网](https://pinia.vuejs.org/cookbook/composables.html#ssr) 上查找为啥会报错，因为在 SSR 环境下使用 `composables` 需要额外处理

当我们在 SSR 下使用 `useStorage` 的时候，需要考虑 `hydrate` 阶段的处理，`state` 的值应该是从浏览器读取，而不需要再 `hydrate` 阶段进行激活，所以我们需要对这些字段跳过处理：

```js
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import { skipHydrate } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const state = useStorage('text-demo', {
    name: 'aaa',
    count: 0
  })
  const setState = () => {
    console.log(state)
    state.value.count++
  }

  return {
    state: skipHydrate(state),
    setState
  }
})
```

使用 `skipHydrate` 方法，来进行标记 `state` 属性不能被激活，需要到浏览器中读取数值，这样处理后再页面刷新的时候也能保持数据的内容了

https://juejin.cn/post/7216174863445737528?searchId=202310091642037E1BAAE2D7E7422BF746#heading-6
