---
title: Node中的Http模块
tags:
  - http
  - node
date: 2023-10-15
cover: https://s2.loli.net/2023/10/15/62IfAtcgbrnJ3zV.jpg
---

# Node 中的 Http 模块

## web 服务器

- 什么是 web 服务器？
  - 当应用程序（客户端）需要某一个资源时，可以向一台服务器，通过 http 请求获取到这个资源，提供资源的这个服务器，就是 web 服务器。

![](https://s2.loli.net/2023/10/15/klUWtye9MZ6zbcH.png)

- 目前有很多的开源的 web 服务器：Nginx、Apache（静态）、Apche Tomcat (静态、动态)、NodeJS

web 服务器体验：

```js
const http = require('http')
const HTTP_PORT = 8000
const server = http.createServer((req, res) => {
  res.end('hello world')
})

server.listen(8000, () => {
  console.log(`服务器在${HTTP_PORT}启动`)
})
```

## 创建服务器

- 创建服务器对象，我们是通过 createServer 来完成的：
  - http. createServer 会返回服务器的对象
  - 底层其实使用直接 new Server 对象

```js
function createServer(opts, requestListener) {
  return new Server(opts, requestListener)
}
```

- 那么，我们也可以自己来创建这个对象：

```js
const server2 = new http.Server((req, res) => {
  res.end('htello server2')
})
server2.listen(9000, () => {
  console.log(`服务器启动成功`)
})
```

- 创建 Server 时候会传入一个回调函数，这个回调函数在被调用时会传入两个参数
  - req: request 请求对象，包含请求相关的信息
  - res：response 响应对象，包含我们要发送给客户端的信息

### 监听主机和端口号

- Server 通过 listen 方法来开启服务器，并且在某一个主机和端口上监听网络请求
  - 也就是当我们通过 ip: port 的方式发送到我们监听的 web 服务器上时
  - 我们就恶意对其进行相关的处理
- Listen 函数有三个参数：
  - 端口 port：可以不传，系统会默认分配，后续项目中哦我们会写入到环境变量中
  - 主机 host: 通常可以传入 localhost、ip 地址 127.0.0.1、或者 ip 地址 0.0.0.0，默认是 0.0.0.0
    - localhost: 本质上是一个域名，通常情况下会被解析成 127.0.0.1
    - 127.0.0.1：回环地址（Loop Back Address）, 表达的意思其实是我们主机自己发出去额包，直接被自己接收
      - 正常的数据库包经常应用层-传输层-网络层-数据链路层-物理层
      - 而回环地址，是在网络层直接就被获取到了，是不会经常数据链路层和物理层
      - 比如我们监听 127.0.0.1 时，在同一个网段下的主机中，通过 ip 地址是不能访问的
    - 0.0.0.0
      - 监听 IPV 4 所有的地址，再根据端口找到不同的应用程序
      - 比如谁哦们监听 0.0.0.0 时，在同一个网段下的主机中，通过 ip 地址是不能访问的
  - 回调函数，服务器启动成功时的回调函数

### request 对象

- 在向服务器发送请求时，我们会携带很多信息，比如：
  - 本次请求的 URL，服务器要根据不同的 URL 进行不同的处理
  - 本次请求的请求方式，比如 get、post 请求传入的参数和处理的方式是不同的
  - 本次请求的 headers 中也会携带一些信息，比如客户端信息、接收数据的格式、支持的编码格式等
- 这些信息，node 会帮助我们封装到一个 request 的对象中，我们可以直接来处理这个 request 对象

```js
const server = http.createServer((req, res) => {
  //request对象
  console.log(req.url)
  console.log(req.method)
  console.log(req.headers)
  res.end('hello world')
})
```

## URL 处理

- 客户端在发送请求时，会请求不同的数据，那么会传入不同的请求地址：
  - 比如 http://localhost:8000/login
  - 比如 http://localhost:8000/products
- 服务器需要根据不同的请求地址，做出不同的响应

```js
const server=http.createSerer((req,res)=>{
    const url=req.url
    if(url === '/login'){
	    res.end('welcome back')
    }else if(url === /products){
	    res.end('products')
    }else{
        res.end('error')
    }
})
```

### URL 的解析

- 那么如果用户发送的地址中还携带一些额外的参数呢？
  - http://localhost:8000/login?name=dylan
  - 这个时候，url 的值是/login? name=dylan
- 我们如何对他进行解析呢？使用内置的模块 url

```js
const parseInfo = url.parse(req.url)
console.log(parseInfo)
```

- 但是 query 信息如何获取呢？

```js
const { name, query } = url.parse(req.url)
const queryObj = qs.parse(query)
console.log(queryObj.name)
```

### method 的处理

- 在 Restful 规范（设计风格）中，我们对于数据的增删改查应该通过不同的请求方式：
  - GET：查询数据
  - POST：新建数据
  - PATCH：更新数据
  - DELETE：删除数据
- 所以，我们可以通过判断不同的请求方式进行不同的处理
  - 比如创建一个用户
  - 请求接口为/users
  - 请求会为 POST 请求
  - 携带数据 name

### 创建用户接口

- 在我们程序中如何进行判断以及获取对应的数据呢？
  - 这里我们需要判断接口是/users，并且请求方式是 POST 方法去获取传入的数据
  - 获取这种 body 携带的数据，我们需要通过监听 req 的 data 事件来获取

```js
req.setEncoding('utf-8')
req.on('data', data => {
  const { username, password } = JSON.parse(data)
})
req.on('end', () => {
  console.log('传输结束')
})
res.end('create user')
```

- 将 JSON 字符串格式转成对象类型，通过 JSON. parse 方法即可。

## headers 属性

- 在 request 对象的 header 中也包含很多有用的信息，客户端会默认传递过来一些信息
- content-type 是这次请求携带的数据的类型
  - application/json 表示是一个 json 类型
  - text/plain 表示是文本类型
  - application/xml 表示 xml 类型
  - multipart/form-data 表示是上传文件
- content-length：文件的大小和长度
- keep-alive
  - http 是基于 TCP 协议的，但是通常进行一次请求和响应结束后会立刻终端
  - 在 http 1.0 中，如果想要继续保持连接
    - 浏览器需要在请求头中添加 connection: keep-alive
    - 服务器需要在响应头中添加 connection: keep-alive
    - 当客户端再次放请求时，就会使用同一个连接，直接一方中断连接
  - 在 http 1.1 中，所有连接默认是 connection: keep-alive 的
    - 不同的 web 服务器会有不同的保持 keep-alive 的时间
    - node 中默认是 5 s 的
- accept-encoding：告知服务器，客户端支持的文件压缩格式，比如 js 文件可以使用 gzip 编码，对应. gz 文件
- acdept: 告知服务器，客户端可接受文件的格式类型
- user-agent：客户端相关的信息

## 返回响应数据

- 如果我们希望给客户端响应的结果数据，可以通过两种方式
  - write 方法：这种方式成直接写出数据，但是并没有关闭流
  - end 方法：这种方式是写出最后的数据，并且写出后会关闭流

```js
//响应数据的方式有两种
res.write('hello world')
res.write('hello response')
res.end('message end')
```

- 如果我们没有调用 end 和 close，客户端将会一直等待结果
  - 所以客户端在发送网络请求时，都会设置超时时间

### 返回状态码

- http 状态码（http status code）是用来表示 http 响应状态的数字代码
  - http 状态码非常多，可以根据不同的情况，给客户端返回不同的状态码
  - 创建的状态码是下面这些（后续项目中，也会用到其中的状态码）
- 设置状态码创建的有两种方式：

```js
res.statusCode = 400
res.writeHead(200)
```

### 响应头文件

- 返回头部信息，主要有两种方式：
  - res. setHeader: 一次写入一个头部信息
  - res. writeHead: 同时写入 header 和 status

```js
res.setHeader('Content-Type', 'application/json;charset=utf8')
res.writeHead(200, {
  'Content-Type': 'application/json;charset=utf8'
})
```

- Header 设置 Content-Type 有什么作用呢？- 默认客户端收到的是字符串，客户端会按照自己默认的方式进行处理
  ![](https://s2.loli.net/2023/10/15/v3WbnMOmNR9Fs7Z.png)

### http 请求

- axios 库可以在浏览器中使用，也可以在 node 中使用：
  - 在浏览器中，axios 使用的是封装的 xhr
  - 在 node 中，使用的是 http 内置模块

## 文件上传
