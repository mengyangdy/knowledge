---
title: express框架学习
tags:
  - node
  - express
date: 2023-10-18
cover:
---

# express 框架学习

## 认识 express

前面我们使用了 node 的内置模块 `HTTP` 来搭建 web 服务器，但是会比较繁琐，所有我们需要学习 `express` 来进行快速开发，而不是自己处理一些路由和数据存储等问题。

`express` 整个框架的核心就是中间件，理解了中间件就可以掌握框架！

### express 安装

- express 的使用过程有两种方式：
  - 方式一：通过 express 提供的脚手架，直接创建一个应用的骨架
  - 方式二：从零搭建自己的 express 应用结构
- 方式一：

```shell
# 安装脚手架
npm install -g express-generator
# 创建项目
express expresss-demo
# 安装依赖
npm install
# 启动项目
node bin/www
```

- 方式二：从零搭建自己的 express 应用结构

```shell
npm init -y

npm install express -D
```

### 基本使用

- 我们创建第一个 express 项目：
  - 我们会发现，之后的开发过程中，可以方便的将请求进行分离
  - 无论是不同的 URL 还是 get、post 请求方式
  - 这样的方式非常的方便我们已经进行维护和扩展
  - 当然，这只是初体验，接下来我们来探索更多的玩法
- 请求的路径中如果有一些参数，可以这样表达
  - /users/:userId
  - 在 request 对象中要获取这个参数的话可以通过 req.params.userId
- 返回数据，我们可以方便的使用 json
  - res.json（数据）方式
  - 可以支持其他的方式，需要的话请查看[文档](https://www.expressjs.com.cn/guide/routing.html)

```js
const express = require('express')

//创建服务器
const app = express()

//home的get请求处理
app.get('/home', (req, res) => {
  res.end('home路径')
})

app.post('/login', (req, res) => {
  res.end('login路径')
})

app.listen(8000, () => {
  console.log('服务器启动了')
})
```

## express 中间件

### 认识中间件

- express 是一个由路由和中间件组成的 web 框架，它本身的功能是非常的少的：
  - express 应用程序本质上是一系列的中间件函数的调用
- 中间件是什么呢？
  - 中间件的本质是传递给 express 的一个回调函数
  - 这个回调函数接受三个参数：
    - 请求对象（request 对象）
    - 响应对象（response 对象）
    - next 函数（在 express 中定义的用于执行下一个中间件的函数）
- 中间件中可以执行那些任务？
  - 执行任何代码
  - 更改请求（request）和响应（response）对象
  - 结束请求-响应周期（返回数据）
  - 调用栈中的下一个中间件
-

## express 请求响应

## express 路由

## express 错误处理

## express 源码解析
