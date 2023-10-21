---
title: express框架学习
tags:
  - node
  - express
date: 2023-10-18
cover: https://s2.loli.net/2023/10/18/FklTJ8oOZHev3L4.jpg
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

- express 是一个由路由和中间件集合组成的 web 框架，它本身的功能是非常的少的：
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
- 如果当前中间件功能没有结束请求-响应周期，则必须调用 next () 将控制权传递给下一个中间件功能，否则，请求将被挂起

![](https://s2.loli.net/2023/10/18/5RwIQO49pkY7PTC.png)

### 应用中间件-自己编写

- name 如何将一个中间件应用到我们的应用程序中呢？
  - exporess 主要提供了两种方式：
    - app/router. use
    - app/router. methods（app.get/app.post）
  - 可以是 app，也可以是 router，router 方式的我们后续再学习
  - methods 指的是常用的请求方式，比如：app. get 或者 app. post

#### 案例一：最普通的中间件

```js
const express = require('express')

const app = express()

//总结:当express接收到客户端发送的网络请求时，在所有中间件开始进行匹配
// 当匹配到第一个符合要求的中间件时，那么就会执行这个中间件
// 后续的中间件是否会执行，取决与上一个中间件有没有执行next

//通过use方法注册的中间件是最普通/最简单的中间件
//最普通的中间件
//通过use注册的中间件，无论是什么请求方式都可以匹配上
app.use((req, res, next) => {
  console.log('meddleware~')
})

app.listen(8000, () => {
  console.log(`成功了`)
})
```

#### 案例二：path 匹配中间件

```js
const express = require('express')

const app = express()

// 注册路径匹配的中间件
// 路径匹配的中间件是不会对请求方式做限制的
app.use('/home', (req, res, next) => {
  console.log('/home meddleware')
})

app.listen(8000, () => {
  console.log('启动了')
})
```

#### 案例三：path 和 method 匹配中间件

```js
const express = require('express')

const app = express()

//注册中间件：对path/method都有限制
app.get('/home', (req, res, next) => {
  console.log('path/method meddleware')
})

app.listen(8000, () => {
  console.log('启动了')
})
```

#### 案例四：注册多个中间件

```js
const express = require('express')

const app = express()

//多个中间件作用
//1. 参数
//2. 验证身份
//3. 查询数据库
//4. 返回数据

app.get(
  '/home',
  (req, res, next) => {
    console.log('meddleware1')
    next()
  },
  (req, res, next) => {
    console.log('meddleware2')
  }
)

app.listen(8000, () => {
  console.log('启动了')
})
```

### body 解析

- 并非是所有的中间件都需要我们从零去编写
  - express 有内置一些帮助我们完成对 request 解析的中间件
  - registry 仓库中也有很多可以辅助我们开发的中间件
- 在客户端发送 post 请求时，会将数据放到 body 中
  - 客户端可以通过 json 的方式传递
  - 也可以通过 form 表单的方式传递

#### 自己解析

自己编写一个中间件来解析传过来的 body 数据：

```js
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'application/json') {
    req.on('data', data => {
      const userInfo = JSON.parse(data.toString())
      req.body = userInfo
    })
    req.on('end', () => {
      next()
    })
  } else {
    next()
  }
})

app.post('/login', (req, res, next) => {
  console.log(req.body)
  res.end('登录成功')
})
```

#### express 提供的应用中间件

事实上我们可以使用 express 内置的中间件或者使用 body-parse 来完成对 body 的解析

```js
app.use(express.json())
app.post('/login', (req, res, next) => {
  console.log(req.body)
  res.end('登录成功')
})
```

如果解析的不是 json 而是 application/x- www/form/urlencoded ：

```diff
app.use(express.json())
+ app.use(express.urlencoded({extended:true}))
```

注意：如果我们只使用 app.use(express.urlencoded())进行解析的话，终端会报一个警告，因为默认使用的是 querystring 对参数进行解析的，而 querystring 这个库是已经不推荐使用了，所有我们需要加上 extended:true 这个参数，来使用第三方的库（qs 库）进行解析。

#### 第三方中间件

- 如果我们希望将请求日志记录下来，那么可以使用 express 官网开发的第三方哭 morgan
  - 注意：需要单独安装

```js
const loggerWriter = fs.createWriteStream('./log/access.log', {
  flafs: 'a+'
})
app.use(morgan('combined', { stream: loggerWriter }))
```

- 上传文件，我们可以使用 express 提供的 multer 来完成：

```js
const upload = multer({
  dest: 'uploads/'
})
app.post('/upload', uplpad.single('file'), (req, res, next) => {
  console.log(req.file.buffer)
  res.end('文件上传成功')
})
```

#### 上传文件后缀名

- 因为默认上传的文件是没有后缀名的，我们看不了上传的图片，所以我们要对上传文件修改后缀名，我们可以使用 express 提供的 multer 来完成：

```js
const storage = nulter.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = nulter({
  storage
})
app.post(
  '/upload',
  upload.single('file', (req, res, next) => {
    console.log(req.file.buffer)
    res.end('文件上传成功')
  })
)
```

#### 使用 multer 解析 form-data

如果我们希望借助于 multer 帮助我们解析一些 form-data 中的普通数据，那么我们可以使用 any:

```js
const upload = multer()
app.use(upload.any())

app.use('/login', (req, res, next) => {
  console.log(req.body)
})
```

## express 请求响应

### 客户端发送请求的方式

- 客户端传递到服务器参数的方法常见的是 5 种：
  - 方式一：通过 get 请求中的 URL 的 params
  - 方式二：通过 get 请求中的 URL 的 query
  - 方式三：通过 post 请求中的 body 的 json 格式
  - 方式四：通过 post 请求中的 body 的 x- www-form-urlencoded格式
  - 方式五：通过 post 请求中的 form-data 格式

### 传递参数 params 和 query

- 请求地址：/login/abc/def
- 获取参数

```js
app.use('/login/:id/:name', (req, res, next) => {
  console.log(req.params)
  res.json('请求成功')
})
```

- 请求地址：/login?username=abc&password=def
- 获取参数

```js
app.use('/login', (req, res, next) => {
  console.log(req.query)
  res.json('请求成功')
})
```

### 响应数据

- end 方法
  - 类似于 http 中的 response.end 方法，用法是一致的
- json 方法
  - json 方法中可以传入很多的类型：object、array、string、boolean、number、null 等，他们会被转化为 json 格式返回
- status 方法
  - 用于设置一个状态码
  - 注意：这里是一个函数，而不是属性赋值
- 更多响应的方式：
  - https://www.expressjs.com.cn/4x/api.html

## express 路由

- 如果我们将所有的代码逻辑都写在 app 中，那么 app 会变得越来越复杂：
  - 一方面完整的 web 服务器包含非常多的处理逻辑
  - 另一方便有些处理逻辑其实是一个整体，我们应该将他们放在一起，比如对 users 相关的处理
    - 获取用户列表
    - 获取一个用户信息
    - 创建一个新的用户
    - 删除一个用户
    - 更新一个用户
  - 我们可以使用 express.Router 来创建一个路由处理程序：
    - 一个 Router 实例拥有完整的中间件和路由系统
    - 因此，他也被称之为迷你应用程序（mini-app）

### 静态资源服务器

- 部署静态资源我们可以选择很多方式：
  - node 也可以作为静态资源服务器，并且 express 给我们提供了方便部署静态资源的方法：

```js
const express = require('express')

const app = express()

app.use(express.static('./build'))

app.listen(8000, () => {
  console.log('静态服务器启动')
})
```

## express 错误处理

```js
app.use((err, req, res, next) => {
  const message = err.message
  switch (message) {
    case 'USER DOES NOT EXISTS':
      res.status(400).join({ message })
  }
})
```

## express 源码解析
