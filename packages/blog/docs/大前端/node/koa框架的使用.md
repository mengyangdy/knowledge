---
title: koa框架的使用
tags:
  - node
  - koa
date: 2023-10-18
cover: https://s2.loli.net/2023/10/18/DhscHPiRQNxdnrW.jpg
---

# koa 框架的使用

## koa 的基本使用

### 认识 Koa

- 前面我们已经学习了 express，另外一个非常流行的 Node Web 服务器框架就是 Koa
- Koa 官方介绍：
  - koa：next generation web framework for nodejs
  - koa: nodejs 的下一代 web 框架
- 事实上，koa 是 express 同一个团队开发的一个新的 web 框架
  - 目前团队的核心开发着 TJ 的主要经历也在维护 Koa，express 已经交给了团队维护了
  - koa 旨在为 web 应用程序和 api 提供更小、更丰富和更强大的能力
  - 相对于 express 具有更强的异步处理能力
  - koa 的核心代码只有 1600+行，是一个更加轻量级的框架
  - 我们可以根据需要安装和使用中间件

### koa 使用

- 我们来体验一下 koa 的 web 服务器，创建一个接口
  - koa 也是通过注册中间件来完成请求操作的
- koa 注册的中间件提供了两个参数
- ctx: 上下文 Context 对象
  - koa 并没有 express 一样，将 req 和 res 分开，而是将他们作为 ctx 的属性
  - ctx 代表一次请求的上下文对象
  - ctx. request 获取请求对象
  - ctx. reponse 获取响应对象
- next，本质上是一个 dispatch，类似与之前的 next
  - 后续我们可以看一下这个函数

```js
const koa = require('koa')
const app = new Koa()

app.use((ctx, next) => {
  next()
})
app.use((ctx, next) => {
  ctx.response.body = 'hellp'
})
app.listen(8000, () => {
  console.log('服务器启动了')
})
```

### koa 中间件

- koa 通过创建的 app 对象，注册中间件只能通过 use 方法
  - koa 并没有提供 methods 的方式来注册中间件
  - 也没有提供 path 中间件来匹配路径
- 但是真实开发中我们如何将路径和 method 分离呢？
  - 方式一：根据 request 自己判断
  - 方式二：使用第三方路由中间件

```js
app.use((ctx,next)=>{
  if(ctx.request.path=== '/login'){
	  if(ctx.request.method === 'POST'){
		...
	  }
  }
})
```

### 路由的使用

- koa 官方并没有给我们提供路由的库，我们可以使用第三方的库：koa-router

```shell
npm install @koa/router
```

- 我们可以先封装一个 user. router. js 的文件
- 在 app 中将 router. routes ()注册为中间件
- 注意：allowedMethods 用于判断某一个 method 是否支持
  - 如果我们请求 get，那么是正常的请求，因为我们有实现 get
  - 如果我们请求 put、delete、patch、那么就自动报错：Method Not Allowed: 状态码 405
  - 如果我们请求 link、copy、lock，那么就自动报错，Not Implemented，状态码 501

```js
const userRouter = new KoaRouter({ prefix: '/users' })
userRouter.get('/', (ctx, next) => {
  ctx.body = '用户列表'
})
userRouter.post('/', (ctx, next) => {
  ctx.status = 201
  ctx.body = '用户创建'
})

app.use(userRouter.routes)
app.use(userRouter.allowedMethods())
```

## koa 的参数解析

### params - query

- 请求地址/user/123
  - 获取 params:

```js
const userRouter = new Router({ prefix: '/user' })
userRouter.get('/:id', () => {
  console.log(ctx.params.id)
  ctx.body = 'hello'
})
```

- 请求地址/user? username=aaa&password=123
  - 获取 query

```js
app.use((ctx, next) => {
  console.log(ctx.request.query)
  ctx.body = 'hello'
})
```

### json

- 请求地址/login
- body 是 json 格式

```js
{
	"username":"dylan",
	"pasword":"123"
}
```

- 获取 json 数据
  - 安装依赖：`npm install koa-bodyparser`
  - 使用 koa-bodyparser 的中间件

```js
app.ue(bodyParser())

app.use((ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = 'hello'
})
```

### x- www-form-urlencoded

- 请求地址：/user
- body 是 x- www-form-urlencoded格式
- 获取数据 (和 json 是一致的)
  - 安装依赖：`npm install koa-bodyParser`
  - 使用 koa-boyParser 的中间件

```js
app.use((ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = 'hello'
})
```

### form-data

- 请求地址：/login
- body 是 form-data 格式
- 解析 body 中的数据我们需要使用 multer
- 使用 multer 中间件

```js
const upload = multer({})

app.use(upload.any())
app.use((cyx, next) => {
  console.log(ctx.req.body)
  ctx.boy = 'hello'
})
```

### 使用 multer 上传文件

```js
 const storage=multer.diskStorage({
	 destination:(req,file,cb)=>{
		 cb(null,'./uploads/')
	 },
	 filename:(req,file,cb)=>{
	 cb(null,Date.now()+path.extname(file.originalname))
	 }
 })
cons upload=nulter({
storage
})
const fileouter=new Router()
fileRouter.post('/upload',upload.single('avatar'),(ctx,next)=>{
	console.log(ctx.req.file)
})
```

## koa 的响应和错误

- 输出结果：body 将响应主体设置为一下之一：
  - string：字符串数据
  - Buffer：Buffer 数据
  - Stream：数据流
  - Object Arra：对象或数组
  - null：不输出任何内容
  - 如果 respone. status 尚未设置，koa 会自动将状态设置为 200 或者 204
- 请求状态：status

```js
ctx.body = 'aaa'
ctx.body = {}
ctx.body = []

ctx.status = 201
ctx.response.status = 204
```

### 错误处理

```js
const Koa = require('koa')
const app = new Koa()

app.use((ctx, next) => {
  ctx.app.emit('error', new Error('错误'), ctx)
})
app.on('error', (err, ctx) => {
  ctx.response.body = '哈哈'
})
app.listen(8000, () => {
  console.log('错误')
})
```

## koa 静态服务器

- koa 并没有内置部署相关的功能，所以我们需要使用第三方库

```shell
npm install koa-static
```

- 部署的过程类似于 express

```js
const Koa = require('koa')
const static = require('koa-static')
const app = new Koa()
app.use(static('./build'))
app.listen(8000, () => {
  console.log('静态服务器')
})
```

## koa 源码

## 和 express 对比
