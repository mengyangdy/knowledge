---
title: ajax原理是什么?
tags:
  - 场景题
  - 面试题
date: 2024-06-12
---

# 一 ajax原理是什么?

## 1.1 是什么

AJAX 全称(Async Javascript and XML)

即异步的 JavaScript 和 XML ，是⼀种创建交互式⽹⻚应⽤的⽹⻚开发技术，可以在不重新加载整个⽹⻚的情况下，与服务器交换数据，并且更新部分⽹⻚

Ajax 的原理简单来说通过 XmlHttpRequest 对象来向服务器发异步请求，从服务器获得数据，然后⽤ JavaScript 来操作 DOM ⽽更新⻚⾯

流程图如下：

![](https://f.pz.al/pzal/2024/06/12/8fafda478a414.png)

下⾯举个例⼦：

领导想找⼩李汇报⼀下⼯作，就委托秘书去叫⼩李，⾃⼰就接着做其他事情，直到秘书告诉他⼩李已经到了，最后⼩李跟领导汇报⼯作

Ajax 请求数据流程与“领导想找⼩李汇报⼀下⼯作”类似，上述秘书就相当于 XMLHttpRequest对象，领导相当于浏览器，响应数据相当于⼩李

浏览器可以发送 HTTP 请求后，接着做其他事情，等收到 XHR 返回来的数据再进⾏操作

## 1.2 实现过程
实现 Ajax 异步交互需要服务器逻辑进⾏配合，需要完成以下步骤：
- 创建 Ajax 的核⼼对象 XMLHttpRequest 对象
- 通过 XMLHttpRequest 对象的 open() ⽅法与服务端建⽴连接
- 构建请求所需的数据内容，并通过 XMLHttpRequest 对象的 send() ⽅法发送给服务器端
- 通过 XMLHttpRequest 对象提供的 onreadystatechange 事件监听服务器端你的通信状
- 态接受并处理服务端向客⼾端响应的数据结果
- 将处理结果更新到 HTML ⻚⾯中

### 1.2.1 创建XMLHttpRequest对象

通过 XMLHttpRequest() 构造函数⽤于初始化⼀个 XMLHttpRequest 实例对象

```JS
const xhr = new XMLHttpRequest();
```

### 1.2.2 与服务器建⽴连接

通过 XMLHttpRequest 对象的 open() ⽅法与服务器建⽴连接

```JS
xhr.open(method, url, [async][, user][, password])
```

参数说明：
- method ：表⽰当前的请求⽅式，常⻅的有 GET 、 POST
- url ：服务端地址
- async ：布尔值，表⽰是否异步执⾏操作，默认为 true
- user : 可选的⽤⼾名⽤于认证⽤途；默认为`null
- password : 可选的密码⽤于认证⽤途，默认为`null

### 1.2.3 给服务端发送数据

通过 XMLHttpRequest 对象的 send() ⽅法，将客⼾端⻚⾯的数据发送给服务端

```JS
xhr.send([body])
```

body : 在 XHR 请求中要发送的数据体，如果不传递数据则为 null

如果使⽤ GET 请求发送数据的时候，需要注意如下：
- 将请求数据添加到 open() ⽅法中的 url 地址中
- 发送请求数据中的 send() ⽅法中参数设置为 null

### 1.2.4 绑定onreadystatechange事件

onreadystatechange 事件⽤于监听服务器端的通信状态，主要监听的属性为XMLHttpRequest.readyState,关于 XMLHttpRequest.readyState 属性有五个状态，如下图显⽰

![](https://f.pz.al/pzal/2024/06/12/81b72468ef3ed.png)

只要 readyState 属性值⼀变化，就会触发⼀次 readystatechange 事件

XMLHttpRequest.responseText 属性⽤于接收服务器端的响应结果

举个例⼦：

```JS
 const request = new XMLHttpRequest()
 request.onreadystatechange = function(e){
 if(request.readyState === 4){ // 整个请求过程完毕
 if(request.status >= 200 && request.status <= 300){
 console.log(request.responseText) // 服务端返回的结果
 }else if(request.status >=400){
 console.log("错误信息：" + request.status)
 }
 }
 }
 request.open('POST','http://xxxx')
 request.send()
```

## 1.3 封装
通过上⾯对 XMLHttpRequest 对象的了解，下⾯来封装⼀个简单的 ajax 请求

```JS
 //封装⼀个ajax请求
 function ajax(options) {
 //创建XMLHttpRequest对象
 const xhr = new XMLHttpRequest()
 //初始化参数的内容
 options = options || {}
 options.type = (options.type || 'GET').toUpperCase()
 options.dataType = options.dataType || 'json'
 const params = options.data
 //发送请求
 if (options.type === 'GET') {
 xhr.open('GET', options.url + '?' + params, true)
 xhr.send(null)
 } else if (options.type === 'POST') {
 xhr.open('POST', options.url, true)
 xhr.send(params)
 //接收请求
 xhr.onreadystatechange = function () {
 if (xhr.readyState === 4) {
 let status = xhr.status
 if (status >= 200 && status < 300) {
 options.success && options.success(xhr.responseText,
xhr.responseXML)
 } else {
 options.fail && options.fail(status)
 }
 }
 }
 }
```

使⽤⽅式如下

```JS
 ajax({
 type: 'post',
 dataType: 'json',
 data: {},
 url: 'https://xxxx',
 success: function(text,xml){//请求成功后的回调函数
 console.log(text)
 },
 fail: function(status){////请求失败后的回调函数
 console.log(status)
 }
 })
```
