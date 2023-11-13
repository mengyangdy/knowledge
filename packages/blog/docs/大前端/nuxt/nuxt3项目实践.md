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

```txt
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

```txt
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

```txt
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

```txt
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

## middleware 中间件

Nuxt 的中间件机制，被细分为两种：

- Route middleware：路由中间件
- Server middleware：服务器中间件

### 路由中间件

路由中间件并不是一定运行在客户端的中间件，而是运行在 Nuxt 应用中 Vue 渲染部分，路由中间件会在进入路由之前被调用，如果是 SSR，这个执行时刻既可能在服务端（首屏），也可能在客户端。

路由中间件根据影响范围和使用方式的不同，又分为三种：

- 匿名中间件：只影响一个页面，不可复用
- 具名中间件：指定若干影响页面，可复用、组合
- 全局中间件：影响所有页面，文件名需要加后缀 global

#### 内置匿名路由中间件

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

#### 具名路由中间件

```js
definePageMeta({
  middleware: ['amid', 'bmid']
})
```

#### 命名路由中间件

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

#### 全局路由中间件

放置在 middleware 目录中带有. global 后缀的文件，每次路由更改的时候会自动运行。

```txt
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

### 服务端中间件

每当请求到达服务器时，会在处理其他路由之前先执行中间件。因此可以用服务端中间件做一些诸如：请求头检测、请求日志、扩展请求上下文对象等等任务。

#### 服务端中间件使用

Nuxt 会自动读取 ~/server/middleware 中的文件作为服务端中间件，例如下面请求日志中间件：

```js
export default defineEventHandler(event => {
  console.log('New request: ' + event.node.req.url)
})
```

中间件还可以执行审查、扩展上下文或抛出错误：

```js
export default defineEventHandler((event) => {
  // 扩展上下文对象
  event.context.userInfo = { user: ‘cunzhang’ }
  // 审查请求信息
  const id = parseInt(event.context.params.id) as number
  if (!Number.isInteger(id)) {
    // 抛出错误
    return sendError(createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    }))
  }
})
```

#### 示例：保护指定服务端接口

下面我们完成一个接口保护的需求：用户如果未登录，不能调用 `/api/detail/xxx`。

首先实现一个 server 中间件，检查指定接口请求中是否包含 token，~/server/middleware/auth.ts：

```js
import { H3Event } from "h3";

export default defineEventHandler((event) => {
  // 请求不被允许时返回响应错误
  const isAllowed = protectAuthRoute(event);
  if (!isAllowed) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Unauthorized" })
    );
  }
});

function protectAuthRoute(event: H3Event) {
  const protectedRoutes = ["/api/detail"];
  // path 不以 protectedRoutes 中任何项为起始则允许请求
  if (
    !event?.path ||
    !protectedRoutes.some((route) => event.path?.startsWith(route))
  ) {
    return true;
  }
  return authCheck(event);
}

// 检查是否已认证
function authCheck(event: H3Event) {
  const token = getHeader(event, "token");
  if (!token) {
    return false;
  }
  return true;
}
```

对应的，客户端详情页 `[id].vue` 不再需要中间件保护，同时需要在请求时携带令牌，并且处理可能的响应错误：

```js
// definePageMeta({
//   middleware: ["auth"],
// });

const route = useRoute()
const router = useRouter()
const store = useUser()
const fetchPost = () =>
  $fetch(`/api/detail/${route.params.id}`, {
    // 如果已登录，请求时携带令牌
    headers: store.isLogin ? { token: 'abc' } : {},
    onResponseError: ({ response }) => {
      // 如果响应 401 错误，重新登录
      if (response.status === 401) {
        router.push('/login?callback=' + route.path)
      }
    }
  })
```

## pinia 使用

### 引入 pinia

终端安装 @pinia/nuxt

```bash
pnpm add @pinia/nuxt
```

在 nuxt.config.ts 上配置

```js
export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@pinia/nuxt',
    {
      autoImports: [
        // 自动引入 `defineStore(), storeToRefs()`
        'defineStore',
        'storeToRefs'
      ]
    }
  ]
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

## Nuxt 生命周期

### Nuxt 生命周期分类

由于 Nuxt 整合了 Vue、Nitro 前后端两个运行时，再加上它自身的创建过程，因此框架生命周期钩子分为三类：

- Nuxt 钩子
- Vue App 钩子
- Nitro App 钩子

#### Nuxt 钩子

Nuxt 钩子在构建时执行，贯穿初始化和构建过程中各种工具和引擎，例如 Nuxi、Vite、Webpack、Nitro 等，主要用于编写模块时构建上下文。

基本用法如下：

```js
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup (options, nuxt) {
    nuxt.hook('ready', async (nuxt: Nuxt) => {
      // 在这里配置 nuxt
    })
  }
})
```

我们做一个实际应用作为演示：在整合 NaiveUI 时，如果按照官方操作自动导入，则无法获得 TS 类型支持。

这个需求可以用一个模块来完成：这里利用了 prepare:types 这个钩子配置 ts：

```js
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup (options, nuxt) {
    nuxt.hook('prepare:types', ({ tsConfig, references }) => {
      tsConfig.compilerOptions!.types.push('naive-ui/volar')
      references.push({
        path: resolve(nuxt.options.buildDir, 'types/naive-ui.d.ts'),
      })
    })
  }
})
```

#### Vue App 钩子

会在运行时调用，主要用于编写插件，从而可以在渲染生命周期中插入代码逻辑。基本用法如下：

```js
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('app:created', vueApp => {
    // 可以在这里修改 vue 实例
  })
})
```

我们做一个实际应用作为演示：给 Vue 添加一个全局的方法 $alert。

这个需求可以用一个插件来完成：这里利用了 app:created 这个钩子配置 Vue 实例：

```js
// plugins/alert.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:created", (vueApp) => {
    vueApp.config.globalProperties.$alert = (msg: string) => {
      const message = useMessage();
      message.warning(msg);
    };
  });
});
```

试用一下，index.vue：

```js
const ins = getCurrentInstance()
onMounted(() => {
  ins?.proxy?.$alert('component mounted！')
})
```

#### Nitro App 钩子

会在 Nitro 引擎运行时调用，用于编写服务端插件，从而可以修改或扩展引擎的默认行为。

例如下面插件利用 render:html 钩子修改了最终渲染的 html 内容，并在响应时打了一条日志：

```js
export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    console.log('render:html', html)
    html.bodyAppend.push('<hr>Appended by custom plugin')
  })
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    console.log('render:response', response)
  })
})
```

#### 可用钩子列表

文档中有一个比较详细的可用钩子列表，大家可以参考：[https://nuxt.com/docs/api/advanced/hooks](https://nuxt.com/docs/api/advanced/hooks 'https://nuxt.com/docs/api/advanced/hooks')

## plugins 插件

nuxt 会自动读取 plugins 目录中的文件，并且在创建 vue 应用程序的时候加载它们，可以在文件名中使用 `.server` 或者 `.client` 后缀来只在服务器还是客户端加载插件。

只有在 plugins 目录的顶层的文件才会被注册为插件。

- 实际上只注册 plugins 目录下根文件和子目录下的 index 文件
- 插件的执行顺序可以用数字来控制，因为插件之间可能有依赖关系
- 可在文件名上使用 `.server` 或 `.client` 后缀使插件仅作用于服务端或者客户端

### Nuxt 上下文：NuxtApp

我们看到定义插件时，可以获取到 nuxtApp 对象，该对象是 NuxtApp 的实例，实际上是 Nuxt 提供的运行时上下文，可以同时用于客户端和服务端，并能帮我们访问 Vue 实例、运行时钩子、运行时配置的变量、内部状态等。

我们需要了解 nuxtApp 一些重要的方法和属性以便使用

- `provide (name, value)`：定义全局变量和方法
- `hook(name, cb)`：定义 nuxt 钩子函数
- `vueApp`：获取 vue 实例
- `ssrContext`：服务端渲染时的上下文
- `payload`：从服务端到客户端传递的数据和状态
- `isHydrating`：用于检测是否正在客户端注水过程中

### 示例：访问 Vue 实例

```js
export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.hook("app:created", (vueApp) => {
  //   vueApp.config.globalProperties.$alert = (msg: string) => {
  //     const message = useMessage();
  //     message.warning(msg);
  //   };
  // });
  nuxtApp.vueApp.config.globalProperties.$alert = (msg: string) => {
    const message = useMessage();
    message.warning(msg);
  };
});
```

### 添加全局帮助方法

```js
import dayjs from "dayjs";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("format", (date?: Date, template?: string) => {
    return dayjs(date).format(template);
  });
});
```

#### 给注入方法提供类型支持

通过模块扩展可以给注入的方法、属性提供类型支持，例如前面创建的`format()`方法，创建 ~/types/index.d.ts：

```js
declare module '#app' {
  interface NuxtApp {
    $format (date?: Date, msg?: string): string
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $format (date?: Date, msg?: string): string
  }
}

export { }
```

### 示例：添加 message 方法

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

### Vue 渲染过程中的错误

首先看一下 Vue 层面的处理方法：`onErrorCaptured`，这是 Vue 实例提供的全局配置选项，可以这样配置：

```js
app.config.errorHandler = (error, context) => {}
```

现在的问题是如何获得 Vue 实例，方法是通过 Nuxt 提供的插件机制获取：

```js
export default defineNuxtPlugin(nuxtApp => {
  // 通过 nuxtApp.vueApp 获取 Vue 实例
  nuxtApp.vueApp.config.errorHandler = (error, context) => {
    // ...
  }
})
```

下面我们在项目中添加错误捕获功能，创建 ~/plugins/error.ts：

```js
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.config.errorHandler = (..._args) => {
    console.log('vue error handler')
  }
})
```

### 利用 Nuxt 钩子处理错误

还有一种处理方式，是利用 Nuxt 层级的钩子捕获来自 Vue 传播上来的错误。可用的钩子有两个：

- app:error：整个应用层面的错误捕获
- vue:error：仅 Vue 层面的错误捕获

添加两个钩子 `app:error`, `vue:error`，plugins/error.ts。

```js
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('app:error', (..._args) => {
    console.log('app:error')
  })
  nuxtApp.hook('vue:error', (..._args) => {
    console.log('app:error')
  })
})
```

观察错误输出：三个错误处理都触发了，而且有自下而上的先后顺序 errorHandler -> vue:error -> app:error。

### 服务端错误处理

如果错误发生在服务端，比如 API Route 或 Nitro 服务器内部发生的错误，此时服务端会有一个 JSON 响应或者 HTML 错误页面。

前面的页面对开发者友好，对用户却不怎么友好，因此我们可以在服务端自定义错误信息。

大家可以使用 `createError` 方法抛出异常，然后在客户端处理，就像下面这样：

```js
export default defineEventHandler((event) => {
  // 参数类型有问题就抛出异常
  const id = parseInt(event.context.params.id) as number
  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID 应该是一个整数',
    })
  }
  return 'ok'
})
```

错误示例：

```js
export default defineEventHandler(async event => {
  // ...省略部分代码
  // 判断 fullPath 是否可以访问
  try {
    fs.accessSync(fullPath)
    // ...省略读取文章内容部分代码
  } catch (err) {
    // 没有此文件或没有访问权限
    throw createError({
      statusCode: 404,
      statusMessage: '文章不存在'
    })
  }
})
```

相应的，客户端要处理该异常，我们看一下 [id].vue 中如何处理：可以获取 `useAsyncData` 返回的 `error` 并显示：

```js
<template>
  <div class="p-5">
    <!-- 显示错误信息 -->
    <div v-if="error">{{ errorMsg }}</div>
    <div v-else-if="pending">加载中...</div>
    <div v-else>
      <!-- ...省略部分代码 -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { NuxtError } from "#app";
const fetchPost = () => $fetch(`/api/detail/${route.params.id}`);
// 添加 error
const { data, pending, error } = await useAsyncData("post", fetchPost);
// 获取服务端返回的错误信息
const errorMsg = computed(() => (error.value as NuxtError).statusMessage)
</script>
```

### 自定义一个错误页面

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

#### 显示错误页面

Nuxt 提供了 showError 方法显示全屏错误，传递一个字符串或者错误对象即可。

```js
showError('文件不存在')
showError(new Error('文件不存在'))
```

报错是在当前页显示错误信息，如果想要全屏显示，可以调用 showError 方法：

```js
const { data, pending, error } = await useAsyncData("post", fetchPost);
const errorMsg = computed(() => (error.value as NuxtError).statusMessage)
// 显示全屏错误页
watchEffect(() => {
  // error 存在，则显示错误页
  if (unref(error)) {
    showError(errorMsg.value as string);
  }
});
```

### 组件级错误处理

Nuxt 还有一个组件级的错误处理组件， **专门用于处理客户端错误** NuxtErrorBoundary：

我们可以把 `<NuxtErrorBoundary>` 作为容器组件将内容包起来，其默认插槽中发生的错误会被捕获，避免向上冒泡，并且渲染 error 插槽。我们可以像下面这样使用 ：

```js
<template>
  <NuxtErrorBoundary @error="errorLogger">
    <!-- 默认插槽放置要渲染的内容 -->
    <!-- ... -->
    <!-- error 插槽处理错误，接收 error 为错误信息 -->
    <template #error="{ error }">
      这里显示错误信息
      <button @click="error = null">
        设置 error = null 清除错误，显示内容
      </button>
    </template>
  </NuxtErrorBoundary>
</template>
```

## Nuxt 配置

Nuxt 应用中有三种常见的配置方式：

- nuxt.config.ts：覆盖或扩展默认 Nuxt 配置
- app.config.ts：配置公共变量
- 外部配置文件：配置项目中其他方面

### nuxt.config.ts

Nuxt 其实有一套默认配置，能够应付大部分需要。但是当我们需要覆盖或扩展默认 Nuxt 配置时，我们就可以在项目根目录下创建一个 nuxt.config.ts，它默认导出 defineNuxtConfig() 的执行结果，再和默认 nuxt 配置合并并最终生效，例如我们前面增加的模块配置：

```js
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@huntersofbook/naive-ui-nuxt']
})
```

### app.config.ts

如果需要配置一些项目需要的公共变量，可以在项目根目录创建 app.config.ts，这些变量是响应式的，不仅在运行时可以访问，还可以改变。例如下面的配置范例：

```js
export default defineAppConfig({
  title: 'Hello Nuxt',
  theme: {
    dark: true,
    colors: {
      primary: '#ff0000'
    }
  }
})
```

访问 app.config.ts 中的变量：

```js
const appConfig = useAppConfig()
```

### 外部配置文件

Nuxt 只认 `nuxt.config.ts`，因此一些大家熟悉的独立配置文件会被忽略，作为替代，nuxt.config.ts 中会有对应的配置项，我们来看一下都有哪些：

- ~~nitro.config.ts~~ ：不能使用，使用 nitro 选项配置；
- ~~postcss.config.js~~ ：不能使用，使用 postcss 选项配置；
- ~~vite.config.ts~~ ：不能使用，使用 vite 选项配置；
- ~~webpack.config.ts~~ ：不能使用，使用 webpack 选项配置。

当然，还有一些配置文件依然可以使用：

- tsconfig.json
- .eslintrc.js
- .prettieerrc.json
- .stylelintrc.json
- tailwind.config.js
- vitest.config.js

### 配置打包文件

Nuxt 支持 Vite、Webpack 两种打包工具，默认使用 Vite。我们可以根据项目需要选择，设置 builder 即可。

下面配置设置打包工具为 Webpack：

```js
export default defineNuxtConfig({
  builder: 'webpack'
})
```

注意：需要安装 @nuxt/webpack-builder。

相应的，如果要修改对应打包工具配置，可以使用 Vite 或 Webpack 选项：

```js
export default defineNuxtConfig({
  vite: {},
  webpack: {}
})
```

### 配置渲染模式

Nuxt 默认渲染模式是 SSR 模式。

可以通过设置 `ssr: false` 修改渲染模式为 SPA，nuxt.config.ts：

```js
export default defineNuxtConfig({
  ssr: false
})
```

可以通过设置 `nitro.presets` 选项修改渲染模式为非 node 模式，nuxt.config.ts：

```js
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel'
  }
})
```

### 端口号

配置了端口号为 8080，避免和其他本地服务端口冲突，package.json:

```js
{
  "scripts": {
    "dev": "nuxt dev --port=8080"
  }
}
```

### 配置 Meta 信息

我们常常因为 SEO 等需求需要修改页头等 Meta 信息，Nuxt 提供三种修改 Meta 信息的方法：

- 全局配置页头信息
- composables 方法
- 内置组件修改

#### 全局配置页头信息

通过 `app.head` 可以全局配置网站页头信息：

```js
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8', // 快捷方式
      viewport: 'width=device-width, initial-scale=1', // 快捷方式
      title: 'My App',
      meta: [
        { name: 'description', content: 'My amazing site.' },
        { name: 'charset', content: 'utf-8' }
      ],
      link: [],
      style: [],
      script: []
    }
  }
})
```

#### composables 方法

Nuxt 提供了一个 useHead() 可以在组件内修改 meta 信息：

```js
<script setup lang="ts">
useHead({
  title: 'My App',
  meta: [
    { name: 'description', content: 'My amazing site.' }
  ],
  bodyAttrs: {
    class: 'test'
  },
  script: [ { children: 'console.log('Hello world')' } ]
})
</script>
```

#### 设置各个子页面标题

设置首页标题，index.vue

```js
useHead({
  title: '文章列表'
})
```

这样虽然生效，但之前设置的网站名称被覆盖了：

可以设置标题模板解决此问题，app.vue：

```js
<script setup lang="ts">
useHead({
  titleTemplate: (s) => {
    return s ? `${s} - 村长的技术空间` : "村长的技术空间";
  },
});
</script>
```

再去详情页设置页面标题，[id].vue：

```js
const route = useRoute();
// 设置为当前文章id
useHead({
  title: route.params.id as string
});
```

#### 内置组件修改

Nuxt 还提供了多种组件可以在模板中设置具体页面页头信息：`<Title>`, `<Base>`, `<NoScript>`, `<Style>`, `<Meta>`, `<Link>`, `<Body>`, `<Html>` , `<Head>`，像下面这样使用：

```js
script setup>
const title = ref('Hello World')
</script>

<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="title" />
    </Head>
  </div>
</template>
```

## Nuxt 自动导入

- Nuxt 3 中会处理以下依赖的自动导入
  - Nuxt 自动导入：数据访问 useFetch、状态管理 useState、App 上下文 useNuxtApp、运行时配置 useRuntimeConfig 等等
  - Vue 自动导入：ref、reactive、computed 等等
  - 基于路径自动导入：
    - 组件目录：/components
    - hooks 目录：/composables
    - 工具库目录：/utils

### 组件自动导入

Nuxt 中约定把组件放在 `components/` 目录中，这些组件只要被用在页面或其他组件中，就会自动导入并注册。

没有嵌套的组件会以文件名直接导入，如果存在嵌套关系，那么 **组件名称将会基于路径和文件名以大驼峰方式连起来** ，比如 `base/foo/Button.vue` 注册名称将会是 `BaseFooButton`，用起来将会像下面这样：

```js
<BaseFooButton />
```

Nuxt3 默认只扫描根目录中模块，可以通过设置 nuxt.config.ts 中 `imports` 选项自定义扫描目录：

```js
 export default defineNuxtConfig({
imports: {
  dirs: [
    // 扫描顶层目录中模块
    'composables',
    // 扫描内嵌一层深度的模块，指定特定文件名和后缀名
    'composables/*/index.{ts,js,mjs,mts}',
    // 扫描给定目录中所有模块
    'composables/**'
    //store自动导入
    'store'
  ]
}
})
```

## 自行编写接口并返回数据

使用 Nuxt3 提供的 API Route 自己编写接口，主要包括以下知识点：

- 创建服务端 API
- 处理请求参数
- 返回响应数据

### 创建服务端 API

Nuxt 项目下 `~/server/api` 目录下的文件会被注册为服务端 API，并约定在这些文件中导出一个默认函数 `defineEventHandler(handler)`，handler 中可以直接返回 JSON 数据或 Promise，当然也可以使用 `event.node.res.end()` 发送响应，虽然这没有必要。

下面我们创建一个 server/api/hello.ts 测试一下：这里我们返回给用户一个 json 数据：

```js
export default defineEventHandler(event => {
  return {
    message: 'hello，nuxt3！'
  }
})
```

这个接口可以使用 `$fetch('/api/hello')` 请求，创建一个 hello.vue：

```js
<template>
  <div>
    {{ message }}
  </div>
</template>

<script setup lang="ts">
const { message } = await $fetch('/api/hello')
</script>
```

### 处理请求参数

常用的请求参数形式有三种：

- 路由参数，例如：/api/hello/[name].ts
- 请求体，例如：post 请求中的 data
- 查询参数，例如：/api/hello?name=cunzhang

#### 获取路由参数

假如创建 API 接口文件 server/api/detail/[id].ts，可以通过 `getRouterParam(event, 'id')` 获取参数 id：

```js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

// 文章目录
const postsDir = path.join(process.cwd(), 'content')

export default defineEventHandler(async event => {
  const fileName = getRouterParam(event, 'id') + '.md'

  // 获取文章内容
  const fullPath = path.join(postsDir, fileName)
  const fileContent = fs.readFileSync(fullPath, 'utf-8')

  // 解析扉页信息
  const matterInfo = matter(fileContent)

  // 转换markdown为HTML
  const processedContent = await remark().use(html).process(matterInfo.content)
  const content = processedContent.toString()

  return {
    title: matterInfo.data.title,
    content
  }
})
```

接下来，当我们跳转到 detail 页面时，就可以获取这篇文章内容并显示，detail.vue：

```vue
<template>
  <div class="p-5">
    <h1 class="text-2xl">{{ title }}</h1>
    <div v-html="content"></div>
  </div>
</template>

<script setup lang="ts">
const router = useRoute()
const { title, content } = await $fetch(`/api/detail/${router.params.id}`)
</script>
```

#### 获取请求体

用户发送 post 类型的请求提交数据的时候，请求数据通常通过 request body，类似这样：

```js
$fetch('/api/create-post', { method: 'post', body: { id: 'new id' } })
```

在 Nuxt 中，服务端可以通过 `readBody(event)` 获取 request body 数据：

```js
export default defineEventHandler(async event => {
  const body = await readBody(event)
  return { body }
})
```

#### 获取查询参数

用户发送类似 `/api/query?param1=a&param2=b` 这样的包含查询参数的请求时，可以通过 `getQuery(event)` 获取参数：

```js
export default defineEventHandler(event => {
  const query = getQuery(event)
  return { a: query.param1, b: query.param2 }
})
```

Nitro 的底层实现基于 [h3](http://github.com/unjs/h3 ' http://github.com/unjs/h3')，除了前面介绍的 getRouterParam()、readBody()、getQuery() 等还有不少非常有用[工具方法]([ https://www.jsdocs.io/package/h3#package-index- ](https://www.jsdocs.io/package/h3#package-index- ' https://www.jsdocs.io/package/h3#package-index-') functions)，例如：getCookie()、 getMethod()、getHeader() 等，大家可以先看文档探索一下，后续范例和项目中都会陆续用到。

## 打包部署

与传统服务端渲染只能发布于 Node.js 服务不同，Nuxt 应用不仅可以发布在 Node.js 服务上，还能预渲染内容做为静态服务，Nuxt3

甚至可以发布在 serverless 或 cdn 等云服务环境。

打包 Nuxt 项目可以用`nuxt build`或`nuxt generate`，根据配置不同，可分为以下几种方式：

- SSR：`nuxt build`。代码会被打包到`.output`目录，打包产物分为 public 和 server 两部分。入口为 index.mjs，可以使用 node 或 pm2 等进程管理工具启动服务，也可以配合`nuxt preview`启动预览服务。
- SPA：`ssr:false` \+ `nuxt generate`。产物只有 .output/public 中的静态文件，发布 .output/public 即可。但是 SPA 需要在运行时访问接口获取数据，因此仍然需要提供接口服务才能正常显示页面。
   * SSG：`nuxt generate`。产物只有 .output/public 中的静态文件，发布 .output/public 即可。这种方式会在创建时生成页面内容，因此只需要提供静态服务即可预览。
   * 其他服务：`presets`，可用于其他非 node 运行时打包，例如 deno，serverless，edge worker 等。产物根据预设不同会有不同，部署需要按照对应的平台进行操作。

### 打包 SSR

默认情况下，直接执行 `nuxt build`：

```js
pnpm build
```

### 打包 SSG

默认情况下直接执行 `nuxt generate`：

```js
pnpm generate
```

打包的结果中server 是空的，只有 public 中的静态内容。

### 打包 SPA

配置 `ssr: false`，然后执行 `nuxt generate`：

```js
export default defineNuxtConfig({
  ssr: false,
})

pnpm generate
```

打包后的结果中 server 是空的，跟 SSG 略有不同，动态的 detail 没有了，会作为前端动态路由出现。

### 使用 presets

配置 `nitro.preset` 选项即可

```js
export default defineNuxtConfig({
  // ssr:false
  nitro: {
    preset: 'azure'
  }
})
```

例如，我们准备发布到 vercel，可以设置 `nitro.preset` 为 `vercel` 或 `vercel edge`。

### 部署为 Node.js 服务

针对前面介绍的 SSR 方式打包，访问页面需要服务器实时渲染，因此需要启动 node server。

#### 启动 node.js 服务

执行如下命令启动服务：

```shell
node .output/server/index.mjs
```

这意味着我们只需要将 `.output` 中的内容上传至服务器并启动 node 服务即可。

#### 运行时配置

服务器上可能有多个应用，因此需要配置端口号等。传递环境变量可以修改端口号等的默认配置，例如：

- PORT：端口号；

- HOST：服务地址；

- NITRO_SSL_CERT 和 NITRO_SSL_KEY：启用 HTTPS。

下面我们修改端口号为 8080：

```js
PORT=8080 node .output/server/index.mjs
```

#### 进程管理

服务器一般会有 pm 2 之类的工具便于管理多个服务进程，可以配置 ecosystem.config.js：

```js
module.exports = {
  apps: [
    {
      name: 'czblog',
      port: '8080',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
```

```js
pm2 start ecosystem.config.js
```

```shell
# 安装 pm2
npm i pm2 -g
```

### 部署静态服务

如果生成的是 SPA 或 SSG，则仅需上传 public 中的内容到服务器，并启动一个静态服务即可，例如 nginx。

作为演示，我们这里使用 serve：

```js
cd .output/public
# 需要先安装 serve 包
serve
```

### 部署到云服务

Nuxt 应用可以部署在 serverless 或 edge 环境，但是打包时需要 Nuxt 有对应的 present 支持，目前官方提供了 13
个云服务提供商的 presents：

1. Azure；
2. Vercel；
3. Netlify；
4. StormKit；
5. Cloudflare；
6. AWS Lamda；
7. Firebase；
8. Cleavr；
9. DigitalOcean；
10. Edgio；
11. Heroku；
12. Layer 0；
13. Render.com。

列表中前五个是支持零配置的，比较推荐。很遗憾暂时没有国内的提供商，如果想要发布需要更多的配置。

### 部署到 Vercel

Vercel 是 next.js 东家，大名鼎鼎，对 Nuxt 应用发布支持也是最好的。

这里就以 Vercel 为例给大家演示 Nuxt 应用发布过程：

1. 修改预设为 `vercel`，nuxt.config.ts：

```js
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel'
  }
})
```

2. 发布项目代码到 github

3. 前往 [vercel](https://vercel.com/new) 导入项目：

![](https://my-vitepress-blog.sh1a.qingstor.com/202311131650168.png)

4.  发布项目：配置会自动导入，点击 Deploy 发布。

![](https://my-vitepress-blog.sh1a.qingstor.com/202311131651469.png)

5. 部署成功

![](https://my-vitepress-blog.sh1a.qingstor.com/202311131651210.png)

6. 预览项目：虽然部署成功，但是数据获取失败了，这是因为我们的代码需要访问文件系统，这是 Serverless Function 不支持的。

因此，我们可以修改“创建命令”为 `nuxt generate`，使我们应用成为全静态网站：

![](https://my-vitepress-blog.sh1a.qingstor.com/202311131652088.png)

修改完成再次执行发布任务，你可以：

- 修改代码并 push 到 github 触发；
- 在 Vercel 控制台 Deployments 发布记录中点击右侧三个点 - Redeploy。

![](https://my-vitepress-blog.sh1a.qingstor.com/202311131652881.png)

等待发布结束，观察是否已经变为静态输出，大家看下图中已经没有 Serverless Functions 了。

还有一个问题是这是由于 SSG 采用爬虫方式抓取要生成的内容，页面中如果没有链接则无从获取，比如上面的“上一页”、“下一页”按钮，执行的是 JS 代码获取，因此这些页面既不会生成，点击也不能正常显示。这要求我们实现时必须明确地在页面中出现链接，我们可以尝试做如下修改方案：

- 分页采用明确的页码链接列表
- 把文章分成各种分类，增加一个页面显示分类文章列表

可以看到比起 SPA的部署，其他渲染模式部署真是复杂多了！但是这会让我们被迫学习更多服务端知识，思考服务器运行方式，还能实践很多部署运维操作，可谓收获多多！如果你一时记不住这些知识，可以在打包前想一下自己的需要，问自己几个问题：

- 我这个网站纯静态行不行？可以了当然好，这是性能最优，部署最简单的方式。
- 如果不能纯静态，是否看重 SEO，可以打包为 SPA 吗？可以了也不错，性能很好，部署简单。
- 如果都不行，那就服务端渲染，此时还可以问自己将来准备部署到哪？如果自己有 ECS 之类的服务器，可以随便折腾，需要什么运行环境都可以安装，或者索性用 docker 做个镜像。
- 如果要部署为云函数那就麻烦了，目前 Nuxt 就提供了国外十几个供应商的 preset，国内的没有整合，可能不太能接受国外的，自己折腾又是个黑盒子，preset 开发暂时也没有文档。这种方式如果要考虑，就要选在国内有分店的，比如我知道 azure 就有。

## layers 使用

### Layers 使用场景

以下情况下比较适合使用 layers：

- 共享可重用配置项；
- 使用 components 目录共享组件库；
- 使用 composables 和 utils 目录共享工具函数；
- 创建 Nuxt 主题；
- 创建模块预设；
- 共享标准初始化步骤。

### Layers 使用方法

我们可以在 nuxt.config.ts 中配置 `extends` 选项从而继承一个 layers 配置。

有三种配置 layers 方式：

- 相对地址：从本地继承；
- Npm 包名：从 npm 安装；
- Github URL：从 Github 下载。

就像下面这样配置，nuxt.config.ts：

```js
export default defineNuxtConfig({
  extends: [
    '../base', // 从本地继承
    '@my-themes/awesome', // 从 npm 安装
    'github:my-themes/awesome#v1' // 从 github 下载
  ]
})
```

### 示例：使用 docus 建设文档网站

社区有个用于文档建设的项目叫 docus，提供了 50 多个组件和设计系统便于创建文档类页面。docus 完全基于 layers 方式创建，因此可以快速在已存在的 Nuxt 项目中引入。

首先安装 docus：

```js
pnpm add @nuxt-themes/docus
```

接下来只需要在项目中添加 extends 选项，nuxt.config.ts：

```js
defineNuxtConfig({
  extends: '@nuxt-themes/docus'
})
```

下面在 content 目录创建一个页面试试，content/index.md：

```js
---
title: "Get Started"
description: "Let's learn how to use my amazing module."
aside: true
bottom: true
toc: true
---

# Get Started
Let's learn how to use my amazing module.
go to [installed](/install) page.

## 使用组件

### alert 组件
::alert{type="info"}
Check out an **info** alert with `code`.
::

## 配置页面

### layout
```

然后打开项目就可以看到了。

### 定制一个 layers

#### 基本示例

下面我们重构之前案例为如下结构：nuxt-docus 是之前的 docus 项目， base 基于 layers 结构存放公用资源，nuxt-app 使用 base 中的资源。

```js
base/
nuxt-app/
nuxt-docus/
```

base 中至少应该存放一个 nuxt.config.ts 文件，存放一些通用配置，这指明当前目录是一个 layers 结构:

```js
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Extending configs by layers',
      meta: [{ name: 'description', content: 'I am using the extends feature in nuxt3!' }]
    }
  }
})
```

同时我们再创建一个公用组件 BaseButton.vue:

```js
<template>
  <button class="text-white px-4 py-2 flex-1 flex items-center justify-center shadow-lg rounded bg-sky-500 hover:bg-sky-600">
    <slot>按钮</slot>
  </button>
</template>
```

准备就绪，我们在 nuxt-app 中配置该继承 base：

```js
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  extends: ['../base']
})
```

现在 app.vue 中可以直接使用 BaseButton：

```html
<BaseButton></BaseButton>
```

#### 从模版项目开始定制 layers

Nuxi 有个命令可以初始化一个 layer 结构让我们快速开始：

```js
npx nuxi init --template layer nuxt-layer
```

## 其他配置

### package.json 中的 scripts 命令的含义

- build：打包创建项目；
- dev：启动开发服务器；
- generate：生成静态网站；
- preview：启动预览服务；
- postinstall：生成 .nuxt 目录。

### 资源目录

Nuxt 项目存放样式、图片等静态资源的目录默认有两个：

- public：会被作为应用程序根目录提供给用户，打包工具不会处理，访问时添加 `/` 即可，例如：`/logo.png`
- assets：打包工具会处理，访问时以 `~` 开头，例如：`~/assets/logo.png`

除了 `~`，Nuxt3 还有一些其他的默认别名：

```js
{
  "~~": "/<rootDir>",
  "@@": "/<rootDir>",
  "~": "/<rootDir>",
  "@": "/<rootDir>",
  "assets": "/<rootDir>/assets",
  "public": "/<rootDir>/public"
}
```

对于全局样式有两种方式可以配置：

- 配置文件 nuxt.config.ts
- app.vue 中引入

```js
//nuxt.config.js
export default defineNuxtConfig({
  css: [
    'assets/global.css'
  ]
})

//app引入
<script>
import "~/assets/global.css";
</script>
```

引入全局的 sass 变量：

```js
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['assets/global.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/_variables.scss";'
        }
      }
    }
  }
})
```

### 引入模块

添加模块到 nuxt.config.ts 文件 `modules` 选项中，有两种添加方式：

- 字符串：此方式仅引入，不配置

```js
modules: ['@nuxtjs/color-mode']
```

- 数组：此方式在引入模块同时添加行内配置

```js
modules: [['@nuxtjs/color-mode', { preference: 'dark' }]]
```

- 有的模块还可以通过独立配置项配置：

```js
modules: ['@nuxtjs/color-mode'],
colorMode: {
  preference: "dark"
}
```
