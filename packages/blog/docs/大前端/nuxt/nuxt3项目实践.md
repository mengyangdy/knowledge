---
title: nuxt3项目实践
tags:
  - vue
  - nuxt3
date: 2023-09-20
cover: https://s2.loli.net/2023/09/20/uIfN2EAd1wFzUXL.jpg
---

# nuxt3项目实践

## 常用的项目目录

| 序号 | 文件        | 描述                                                                          |
| ---- | ----------- | ----------------------------------------------------------------------------- |
| 1    | .nuxt       | 开发环境下自动生成的 vue 应用程序配置                                         |
| 2    | dist        | 打包构建的应用程序目录                                                        |
| 3    | assets      | 静态资源目录，页面和组件使用的使用以~开头，外部不能访问                       |
| 4    | components  | 组件文件夹，子目录会自动导入                                                  |
| 5    | composables | 公共函数文件，只有顶层的才会自动导入                                          |
| 6    | layouts     | 项目布局组件                                                                  |
| 7    | middleware  | 路由中间件                                                                    |
| 8    | pages       | 页面文件，根据路径自动生成路由                                                |
| 9    | plugins     | 插件文件，引用第三方插件再此配置                                              |
| 10   | public      | 公共资源文件，页面和组件使用以/开头，外部可以访问，如果配置了 basUrl 需要加上 |
| 11   | server      | 服务端处理代码文件，分为多个子目录类型管理                                    |
| 12   | utils       | 工具函数文件                                                                  |

## 页面和路由

根据在 pages 文件夹下面的所有文件，将会自动的创建出来一个路由。

这是因为 `nuxt` 提供了一个基于文件的路由，使用 `vue-router` 在底层创建路由，`pages/index.vue` 文件将会被映射到路由中。

如果项目中还在使用 `app.vue` 文件的话，确保 `app.vue` 中使用 `<NuxtPage />` 组件才能显示出来 `page/index.vue` 页面。

### 页面跳转

可以使用 `NuxtLink` 跳转，也可以使用编程式路由跳转：

```vue
<template>
  <div class="app">
    这个是首页
    <NuxtLink to="/company">跳转到company</NuxtLink>
    <span @click="goto">到company</span>
  </div>
</template>

<script setup lang="ts">
function goto() {
  navigateTo(`/company`)
  navigateTo({
    path: '/company',
    query: {
      id: 1
    }
  })
}
</script>
```

如果不需要传递参数的话我们可以使用 `NuxtLink` 来跳转，这种比较便捷，如果需要传递参数的话可以使用点击事件进行编程式导航。

### 动态路由

在 xxx 的文件夹下，创建/[id/]. vue 文件

![](https://s2.loli.net/2023/09/20/V6xe8HOCYicPKMB.png)

```vue
<template>
  <div class="app">
    这个是首页
    <NuxtLink to="/detail/1">跳转到detail</NuxtLink>
    <span @click="goto">到detail</span>
  </div>
</template>

<script setup lang="ts">
function goto() {
  navigateTo({
    path: '/detail/1'
  })
}
</script>
```

在详情页获取这个参数：

```vue
<template>
  <div class="">这个是detail某个id的页面{{ $route.params.id }}</div>
  <div>
    {{ id }}
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = ref(route.params.id)
</script>
```

### 多层动态路由

只要放在方括号里面的内容，就会被转换为路由参数，这样我们就可以在文件名或目录中混合和匹配多个参数：

```text
-| pages/
---| index.vue
---| users-[group]/
-----| [id].vue
```

这样的页面布局会生成以下的路由：

```js
{
    "name": "users-group-id",
    "path": "/users-:group()/:id()",
    "component": "~/pages/users-[group]/[id].vue"
}
```

### 嵌套路由

如果想制作嵌套路由的话，只需要目录和文件名相同，就制作成了一个嵌套路由：

```text
-| pages/
---| company/
------| child.vue
---| company.vue
```

```vue
company页面
<div>
    企业页面
    <NuxtLink to="/company/child">跳转到company/child</NuxtLink>
    <NuxtPage></NuxtPage>
  </div>

child页面
<div>
  这个是企业的child页面
</div>
```

这个时候生成的路由为：

```js
{
    path: '/parent',
    component: '~/pages/parent.vue',
    name: 'parent',
    children: [
    {
        path: 'child',
        component: '~/pages/parent/child.vue',
        name: 'parent-child'
    }
    ]
}
```

### 定义每个页面的元数据

如果要为每个路由定义自己的元数据，可以使用 definePageMeta 来实现：

```vue
<script setup>
definePageMeta({
  title: '这个页面的title'
})

const route = useRoute()
console.log(route.meta.title) //这个页面的title
</script>
```

## layout 布局模板

`Nuxt` 提供了一个布局的框架，可以在整个项目中使用，可以让我们将常见的组件抽离到一个可复用的组件中，布局组件一般都放在 layouts 文件夹下面，使用的时候通过异步导入加载。

### 默认布局

在 layouts 目录下面添加 default.vue 文件就是默认的布局文件，如果只需要一个布局文件的话，可以在 App 里面即可。

在布局文件中，布局的内容将加载在 slot 中：

```vue
<template>
  <div>
    <slot />
  </div>
</template>
```

如果项目中还使用 App 文件的话，需要在 App 文件中添加：

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
    // 在app.vue中没有NuxtLayout这个组件的话，内容将显示不出来
  </NuxtLayout>
</template>
```

### 配置布局

在 layouts 中新建的其他 vue 文件就是一些自定义配置的布局文件：

```text
-| layouts/
---| default.vue
---| custom.vue
```

我们想要使用的话可以分为两种情况，一种是所有的页面都使用这个配置文件, 可以在 NuxtLayout 中添加 name 属性来覆盖默认的布局：

```vue
<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const layout = ref('custom')
</script>
```

在这里我们可以做一些判断来给 layout 赋不同的值。

第二种是某个页面用某一个布局：

```vue
<template>
  <div>
    企业页面？
    <NuxtLink to="/company/child"></NuxtLink>
    <NuxtLink to="/company/child">跳转到company/child</NuxtLink>
    <NuxtPage></NuxtPage>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'custom'
})
```

## components 组件

默认情况下, `Nuxt` 会自动导入 components 目录下面的任何一个组件，组件名会基于这个组件的路径、目录和文件名:

```text
| components/
--| common
----| Upload.vue
```

该组件的组件名为：`commonUpload`

如果只想根据组件的名称引入而不是路径自动导入，那么需要在 `nux.config.ts` 文件中配置 `pathPrefix: false` 即可：

```js
export default defineNuxtConfig({
  devtools: { enabled: false },
  srcDir: 'src/',
  modules: ['@unocss/nuxt', '@pinia/nuxt'],
  components: [
    {
      path: '~/components/',
      pathPrefix: false
    }
  ]
})
```

这样我们的 Upload 组件名为：`Upload`

### 不使用自动导入

只需要在 `nuxt.config.js` 中配置 path，只有 path 路径下的组件才会被自动导入：

```js
export default defineNuxtConfig({
  devtools: { enabled: false },
  srcDir: 'src/',
  modules: ['@unocss/nuxt', '@pinia/nuxt'],
  components: [
    {
      path: '~/components/common'
    }
  ]
})
```

此时只有 `/components/common` 文件夹下的文件将会自动导入。

也可以将 components 设置为 false，此时 components 下任何组件都不会被自动导入。

### 手动导入

我们也可以手动从 components 文件夹下面导入组件：

```html
<script setup>
  import { LazyMyImg } from '#components'
</script>
```

### 惰性加载组件

要惰性的导入一个组件，则需要在组件名称前面添加 `Lazy` 的前缀，通过使用 `Lazy` 前缀，你可以延迟加载组件代码，直到合适的时刻：

```vue
<template>
  <div>
    <Upload />
    <LazyUpload />
  </div>
</template>
```

### 仅在客户端使用

要在客户端使用某个组件，需要在客户端插件中中注册此组件：

```vue
<template>
  <div>
    <ClientOnly>
      <!-- 此组件仅在客户端显示 -->
      <Upload />
    </ClientOnly>
  </div>
</template>
```

## composables 目录

composables 目录主要是一些通用的业务逻辑代码，比如说显示当前时间，这种的我们就可以编写成一个单独的代码段，然后在每个项目中引用。

composables 文件夹中只有顶层文件会被引入，我们可以写一个 `index.ts` 文件引入那些不在顶层的函数。

```js
// composables/count
export function useCount() {
  return 10
}

//index.vue

const count = useCount()
```

也就是说我们在使用的时候不需要再引入 `useCount` 这个方法了。

## middleware 路由中间件

nuxt3 中提供了路由中间件的概念，我们可以在整个项目中使用它，目的是为了在导航到某一个页面之前执行一些代码，路由守卫就可以基于这个实现。

### 内置路由中间件

直接在页面中定义的路由中间件：

```js
<script setup lang="ts">
definePageMeta({
  layout: 'custom',
  middleware:[
    defineNuxtRouteMiddleware((to,from)=>{
      console.log(to)
      console.log(from)
      console.log('这个是页面中的路由中间件')
    })
  ]
})
</script>
```

### 命名路由中间件

放置在 middleware 目录中，在页面上使用时会通过异步导入自动加载，命名方式为以-分隔的名称，而不是驼峰。

```js
//middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  console.log("要去那个页面:" + to.path)
  console.log("来自那个页面:" + from.path)
  // 逻辑处理 例如：未登录判断等
  // const user = useUser();
  // console.log("useUser", user.value)
  // 用户未登录跳转登录页
  // if (!user.value) {
  //   return navigateTo('/login')
  // }
})

//页面中使用
<script setup lang="ts">
definePageMeta({
  layout: 'custom',
  middleware:['auth']
})
</script>
```

### 全局路由中间件

放置在 middleware 目录中带有. global 后缀的文件，每次路由更改的时候会自动运行。

```text
-| middleware/
---| auth.global.ts
```

> 带. global 后缀的全局路由中间件，执行顺序优先于 app. vue

nuxt 提供了两个全局可用的辅助函数，他们可以直接从中间件返回：

- `navigateTo` 在插件或者中间件中重定向到给定的路由，也可以直接调用它来执行页面导航
- `aboutNavigation` 终止导航，并显示一条可选的错误信息

nuxt 的中间件不像 vue-router 中的导航守卫一样，没有第三个参数 `next()`,重定向或路由取消是通过从中间件返回值处理的：可能的返回值有：

- `nothing` 不会阻塞导航，并且会移动到下一个中间件功能，或者完成路由导航
- `return navidateTo('/')` 重定向到给定的路径，并且重定向代码设置为 302 Found
- `return navigateTo('/', { redirectCode: 301 })` 重定向到给定的路径，并将重定向代码设置为 301 Moved permanent

## pinia 使用

### 引入 pinia

终端安装 @pinia/nuxt

```bash
pnpm add @pinia/nuxt
```

在 nuxt.config.ts 上配置

```js
export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '@pinia/nuxt']
})
```

创建 store 文件夹，在文件夹中创建状态管理模块：

```js
import {defineStore} from "pinia";

export const useUserStore=defineStore('user',{
  state:()=>({
    userInfo:{
      user_id:111
    }
  })
})

// 在页面中使用
<script setup lang="ts">
import {useUserStore} from "~/store/user";

const user = useUserStore()
console.log(user.userInfo)

</script>
```

## plugins 插件

nuxt 会自动读取 plugins 目录中的文件，并且在创建 vue 应用程序的时候加载它们，可以在文件名中使用 `.server` 或者 `.client` 后缀来只在服务器还是客户端加载插件。

只有在 plugins 目录的顶层的文件才会被注册为插件。

传递给插件的唯一参数是 nuxtApp，我们可以注册 message 插件：

```js
import { message } from 'ant-design-vue'
import 'ant-design-vue/es/message/style/css'
//vite只能用 ant-design-vue/es 而非 ant-design-vue/lib

export default defineNuxtPlugin(() => {
  return {
    provide: {
      message
    }
  }
})
```

在页面中试用：

```vue
<button type="primary" @click="$message.info('测试提示')">
    弹出 antd-message 提示
</button>
```

在中间件中使用：

```js
export default defineNuxtRouteMiddleware(async to => {
  const nuxtApp = useNuxtApp()
  const { $message } = nuxtApp
  $message.error('服务器异常，请稍后重试')
})
```

## 错误处理

nuxt 中有以下几种错误来源：

- Vue 渲染声明周期中的错误（SSR+SPA）
- API 或服务器生命周期中的错误
- 服务器和客户端启动错误（SSR+SPA）
- 下载 js 错误

### 渲染一个错误页面

当 nuxt 遇到致命的错误时，无论在服务器生命周期还是在 vue 应用程序，他们都会程序一个 JSON 响应或一个 html 错误的页面，我们可以在应用程序的目录中的 app.vue 同级添加一个 error.vue 来自定义这个错误页面，这个页面有一个单一的 props-error，他是一个错误信息。

```vue
<template>
  <result
    status="error"
    :title="error.statusCode"
    :sub-title="error.message || error.statusMessage || '服务器发生错误，请联系管理员'"
  >
    <template #extra>
      <button
        key="console"
        type="primary"
      >
        Go Console
      </button>
      <button key="buy">Buy Again</button>
    </template>
    <div v-html="error.stack"></div>
  </result>
</template>

<script>
const props = defineProps({
  error: Object
})

const { error } = toRefs(props)
</script>
```
