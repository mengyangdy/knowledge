---
title: fetch的使用
tag: fetch
date: 2023-08-16
cover: https://s2.loli.net/2023/08/16/DUF7zejJROh5Ift.jpg
---

# fetch 的使用

> fetch 是一种新型的浏览器 API，用于发送网络请求，与传统的 AJAX 相比，fetch 更加的简单，并且具备现代化的功能（也就是不支持低版本浏览器）

## fetch 的配置

```bash
let promise实例(p) = fetch(请求地址，配置项)
```

- 当请求成功，p 的状态是 fulfilled，值是请求回来的内容，如果请求失败，p 的状态是 rejected，值是失败的原因
- fetch 和 axios 有一个不一样的地方：
  - 在 fetch 中，只要服务器有反馈信息（不论 HTTP 状态码是多少），都说明网络请求成功，最后的视频 p 都是 fullfilled，只有服务器没有任何反馈（例如：请求终端、请求超时、断网等），实例 p 才是 rejected 状态
  - 在 axios 中，只有返回的状态码是以 2 开头的，才会让实例是成功态
- fetch 配置项
  - method：请求的方法，默认是 GET 方法[GET、HEAD、DELETE、OPTIONS、POST、PUT、PATCH]
  - cache：缓存模式[*default、no-cache、reload、force-cache、only-if-cached]
  - credentials：资源凭证（例如 cookie）[includes,*same-origin,omit],fetch 默认情况下，跨域请求中，是不允许携带资源凭证的，只有同源下才允许
    - includes：同源和跨域下都可以
    - same-origin：只有同源才可以
    - omit：都不可以
  - headers：普通对象{}/Headers 实例
    - 自定义请求头信息
  - body：设置请求主体信息
    - body 只适用于 POST 系列请求，在 GET 系列请求中设置 body 会报错（让返回的实例变为失败态）
    - body 内容的格式是有要求的，并且需要指定 Content-Type 请求头信息
    - JSON 字符串 application/json `{name:'xxx',age:'xxx'}`
    - URLENCODED 字符串 application/x-www-form-urlencoded `xxx=xxx&xxx=xxx`
    - 普通字符串 text/plain
    - FormData 对象 multipart/form-data 主要运用在文件上传或者表单提交的操作中
  - 相比较 axios 来说，fetch 没有对 GET 系列请求的问号传参的信息做特殊的处理，需要手动拼接到 URL 的末尾才可以

## fetch 发送请求

### fetch 返回格式

> fetch 发送请求成功之后，返回的是一个 Response 对象，它对应的就是服务器返回的数据。数据需要通过异步的方式获取，因为它返回的是一个 Promise 对象，也有一些同步的属性可以直接获取。

#### Response.ok

`ok`属性返回的是一个布尔值，表示请求是否成功，`true`对应的 HTTP 请求的状态码是 200-299,`false`对应的是其他的 HTTP 状态码

#### Response.status

`status`属性返回的是一个 HTTP 的状态码

#### Response.statusText

`statusText`属性返回的是一个字符串，表示 HTTP 回应的信息，比如成功后返回的是 OK

#### Response.url

`url`属性返回的是请求的 URL

#### Response.type

`type`属性返回请求的类型，其值有下：

- basic:同源请求
- cors:跨域请求
- error:网络错误
- opaque:如果 fetch()请求的`type`属性设置为`no-cors`，就会返回这个值
- opaqueredicret:如果 fetch()请求的 redirect 属性设置为`manual`，就会返回这个值

#### Response.headers

`headers`属性指向一个 Headers 对象，对应了 HTTP 回应的所有标头，我们可以自己使用 for...of 方法循环 headers，也可以使用 headers 对象提供的方法来操作：

- get():通过键名返回获取的键值
- has():返回一个布尔值，表示是否包含某个标头
- set():设置新的键值，如果该键名不存在则添加
- append():添加标头
- delete():删除标头
- keys():遍历所有的键名
- values():返回所有的键值
- entries():返回键值对
- forEach():循环

### 读取 Response 返回的数据

- response.text()：得到文本字符串
- response.json()：得到 JSON 对象
- response.blob()：得到二进制 Blob 对象
- response.formData()：得到 FormData 表单对象
- response.arrayBuffer()：得到二进制 ArrayBuffer 对象

### get 请求

```js
fetch("http://localhost:3000/api")
  .then((res) => {
    return res.text()
  })
  .then((res) => {
    return res
  })
```

### post 请求

```js
fetch("http://localhost:3000/api", {
  method: "POST",
  headers: {
    Authentication: "secret",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "dylan",
  }),
})
  .then((res) => {
    return res.json()
  })
  .then((res) => {
    return res
  })
```

### 中止请求

fetch 请求想要中止的话需要一个特殊的内置对象：AbortController，它不仅可以中止`fetch`，还可以中止其他异步任务

```js
//创建一个控制器
let ctrol = new AbortController()
fetch("http://localhost:3000/api", {
  //请求中断的信号
  signal: ctrol.signal,
})
  .then((response) => {
    let { status, statusText } = response
    if (/^(2|3)\d{2}$/.test(status)) return response.json()
    return Promise.reject({
      code: -100,
      status,
      statusText,
    })
  })
  .then((value) => {
    //最终的结果
    return value
  })
  .catch((reason) => {
    console.dir(reason)
  })

//立即中断请求
ctrol.abort()
```

### 对fetch封装
```js

```
