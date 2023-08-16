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

### fetch返回格式

