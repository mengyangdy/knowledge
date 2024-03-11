---
title: Nuxt服务端渲染：接口token验证
tags:
  - nuxt3
  - token
date: 2023-10-25
cover: https://s2.loli.net/2023/10/25/Q83ruKjBwyJc2aC.jpg
---

# Nuxt 服务端渲染：接口 token 验证

> 今天在做项目的时候遇到个问题，刷新页面重新请求接口，在服务端发送请求获取不到 token 从而引发报错，研究了之后才知道是服务端获取不到 localStorage 里面的 token 导致的，记录下今天研究的内容。

## Nuxt 项目的请求方式

Nuxt 服务端渲染解决了 Vue SPA 页面不能 SEO 的缺点，但是在权限认证上因为多了一层服务端渲染所以需要进行一些多余的处理，服务端和客户端渲染是不同的方式如下：

![iShot_2023-10-25_22.53.25.png](https://s2.loli.net/2023/10/25/swnRvZ1WYc5xNDt.png)

- 当我们刷新页面或者第一次进入页面，走的是进入页面的逻辑
- 当我们点击按钮等发送请求时走的是下面用户行为触发 ajax 请求，直接从服务端请求数据

## nuxt 身份验证

- 对于 nuxt 项目，服务端渲染需要的数据是从 nuxt 服务器发出的，此时是在服务器环境下发送的请求是获取不到客户端也就是浏览器的一切内容，比如说 windows、document、localStorage 等等，所以这种请求是无法获取到 `localstorage` 里面的 `token` 的
- 解决办法就是利用 `cookie`，我们可以把 `token` 存储在浏览器的 `cookie` 中，这样浏览器发送的页面请求就会自动带上 `cookie`，而 `token` 是存储在 `cookie` 中，所以我们可以在服务端接口请求中使用 `cookie` 里面的 `token` 即可。

- 根据 [https://wintc.top/article/68](https://wintc.top/article/68) 文章里面的的做法是：
  - 1.  在服务端中间件里面获取到 `cookie`
  - 2.  定义一个获取 token 接口判断是在服务端还是客户端
  - 在接口请求里面带上这个获取的 `token`

```js
//server/middleware/cookie
export default function ({ req }) {
  if (process.server) {
    serverCookieCache.set(req.headers.cookie || '')
  }
}

//utils/server/index.ts
const serverCookieCache = {
  cookie: '',
  set(value) {
    serverCookieCache.cookie = value
  }
}

function getCookie(cookie, key) {
  if (!cookie) return ''
  let cookieList = cookie.split('; ')
  let keyInfo = cookieList.reduce((info, cookieItem) => {
    let [key, value] = cookieItem.split('=')
    info[key] = value
    return info
  }, {})
  return keyInfo[key] || ''
}

export function getToken() {
  const cookies = process.server ? serverCookieCache.cookie : document.cookie
  return getCookie(cookies, 'token')
}

//useFetch请求里面设置一下
const customHeaders = { Authorization: `Bearer ${getToken()}`, ...headers }
```

但是我使用的时候发现并不能设置上 `token`，所以说这种方法对我来说是不合适的，于是就又想到一个方法，就是使用官方定义的 `useCookie` 方法来进行 `cookie` 的设置。

> Within your pages, components and plugins you can use `useCookie`, an SSR-friendly composable to read and write cookies
> 在您的页面、组件和插件中，您可以使用 `useCookie` SSR 友好的可组合项来读取和写入 cookie

看官方的介绍是可以在 SSR 中使用的，所以感觉可行就使用了一下：

```ts
//useUserSore
// token存cookie里面
const tokenCookie = useCookie('token', {
  httpOnly: true
})
tokenCookie.value = token

//request
const token = useCookie('token')
const customHeaders = { Authorization: `Bearer ${token.value}`, ...headers }
```

至此，从浏览器和服务器发送出来的请求都带上了 `token` 进行身份验证了
