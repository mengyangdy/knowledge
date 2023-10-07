---
title: node学习
tags:
  - node
date: 2023-10-03
cover: https://s2.loli.net/2023/10/03/1G62fTqipIz9Wgu.jpg
---

# node 学习

## 常用的内置模块

### path 模块

- `path模块` 用于对路径和文件进行处理，提供了很多好用的方法。
- 我们知道在 Mac、Linux 和 Window 上的路径是不一样的
  - window 上会使用\或者\\来作为文件路径的分隔符，当让目前也支持了/。
  - 在 Mac、Linux 的 Unix 操作系统上使用/来作为文件路径的分隔符。
- 如果我们在 windw 上使用\来作为分隔符开发了一个应用程序，要部署到 Liunx 上面应该怎么弄：
  - 路径显示会出现一些问题
  - 所以为了屏蔽他们之间的差异，在开发中对于路径的操作我们可以使用 path 模块
- 可移植操作系统接口（英语：Portable Operating System interface，缩写为 POSIX）
  - Linux 和 Mac 都实现了 POSIX 接口
  - Window 部分电脑实现了 POSIX 接口

#### 常见的 API

- 从路径中获取信息
  - dirname：获取文件的父文件夹
  - basename：获取文件名
  - extname：获取文件扩展名
- 路径的拼接
  - 如果我们希望将多个路径进行拼接，但是不同的操作系统可能使用的是不同的分隔符
  - 这个时候我们可以使用 path. join 函数
- 将文件和某个文件夹拼接
  - 如果我们希望将某个文件和文件夹拼接，可以使用 path. reslove
  - resolve 函数会判断我们拼接的路径前面是否有/或者../或者./
  - 如果有表示是一个绝对路径，会返回对应的的拼接路径
  - 如果没有，那么会和当前执行文件所在的文件夹进行路径的拼接

#### 使用

```js
const path=require('path')
cont resolve=dir=>path.resolve(__dirname,dir)

alias:{
  '@':resolve('src')
}
```

### fs 模块

- fs 是 file System 的缩写，表示文件系统
- 对于任何一个为服务器端服务的语言或者框架通常都会有自己的文件系统
  - 因为服务器需要将各种数据、文件等放置到不同的地方
  - 比如用户数据可能大多数是放到数据库中的
  - 比如某些配置文件或者用户资源都是以文件的形式存在于操作系统上的
- node 也有自己的文件操作系统模块，就是 fs
  - 借助于 node 帮我们封装的文件系统，我们可以在任何的操作系统上面直接操作文件
  - 这也是 node 可以开发服务器的一大原因，也是它可以成为前端自动化脚本的热门工具的原因

#### 常见的 API

- Node 文件系统的 API 非常的多：
  - https://nodejs.org/dist/latest-v18.x/docs/api/fs.html
  - API 非常的多，我们需要将上面的网址作为一个 API 查询的手册，用到的时候查询即可。
- 这些 API 大多数都提供三种操作方式：
  - 方式一：同步操作文件：代码会被阻塞，不会继续执行。
  - 方式二：异步回调函数操作文件，代码不会被阻塞，需要传入回调函数，当获取到结果后，回调函数被执行。
  - 方式三：异步 Promise 操作文件，代码不会被阻塞，通过 fs. promies 调用方法操作，会返回一个 Promsie，可以通过 then、catch 进行处理。

#### 使用

```js
// 同步获取
const state = fs.statSync('../foo.txt')
console.log(state)
console.log('后续代码执行')

// 异步读取
fs.stat('../foo.txt', (err, state) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(state)
})
console.log('后续代码的执行')

//promise的方式
fs.promises
  .stat('../foo.txt')
  .then(state => {
    conosle.log('state')
  })
  .catch(err => {
    console.log(err)
  })
console.log('后续代码的执行')
```

#### 文件描述符

- 文件描述符（File descriptors）是什么？
  - 在 POSIX 系统上，对于每个进程，内核都维护者一张当前打开着的文件和资源的表格
  - 每个打开的文件都分配了一个称为文件描述符的简单的数组标识符
  - 在系统层，所有文件系统操作都是用额抓拍文件描述符来标识和跟踪每个特定的文件
  - window 系统使用了一个虽然不同但是概念上类似的机制来跟踪资源
- 为了简化用户的工作，node 抽象是操作系统之间的特定差异，并为所有打开的文件分配一个数字型的文件描述符
- fs. open ()方法用于分配新的文件描述符
  - 一旦被分配，则文件描述符可用于从文件读取数据、向文件写入数据、或请求关于文件的信息

```js
fs.open('../foo.txt', (err, fd) => {
  fs.stat(fd, (err, state) => {
    console.log(state)
  })
})
```

#### 文件的读写

- 如果我们希望对文件的内容进行操作，这个时候可以使用文件的读写：
  - fs. readFile (path,[, options], callback)：读写文件的内容
  - fs. writeFile (file, data[, options], callback)：在文件中写入内容

```js
const fs = require('fs')
fs.writeFile('../foo.txt', 'aaa', { flag: 'a+' }, err => {
  console.log(err)
})
```

- flag 大括号里面常用的有两个参数：
  - flag：写入的参数
    - flag 的值有很多：
      - w：打开文件写入，默认值
      - w+：打开文件进行读写，如果不存在则
      - r+：打开文件进行读写，如果不存在那么抛出异常
      - r：打开文件读取，读取时的默认值
      - a：打开要写入的文件，将流放在文件末尾，如果不存在则创建文件
      - a+：打开文件以进行读写，将流放在文件末尾，如果不存在则创建文件
  - encoding：字符的编码
    - 目前基本上使用的都是 UTF-8 编码，如果不填写这个选项，则返回的是 Buffer

#### 文件夹操作

- 新建一个文件夹
  - 使用 fs. mkdir ()或者 fs. mkdirSync ()创建一个新文件夹
- 获取文件夹的内容
  - fs. readdir
- 文件夹重命名
  - fs. rename

### events 模块

- Node 中的核心 API 都是基于异步事件驱动的：
  - 在这个体系中，某些对象（发射器 (Emitters)）发出某一个事件
  - 我们可以监听这个事件（监听器 Listeners），并且传入的回调函数，这个回调函数会在监听到事件时调用
- 发出事件和监听事件都是通过 EventEmitter 类来完成的，他们都属于 events 对象
  - emitter. on (eventName, lisener): 监听事件，也可以使用 addListener
  - emitter. off (eventName, listener): 移除事件监听，也可以使用 removeListener
  - emitter. emit (eventName[,... args])：发出事件，可以携带一些参数
- 常见的属性
  - emitter. eventNames ()：反抗者当前 EventEmitter 对象注册的事件字符串数组
  - emitter. getMaxListeners (): 返回当前 EventEmitter 对象的最大监听器数量，可以通过 setMaxListeners ()来修改，默认是 10
  - emitter. listenerCount (事件名称)：返回当前 EventEmitter 对象某一个事件名称，监听器的个数
  - emittr. listeners (事件名称)：返回当前 EventEmitter 对象某个事件监听器上所有的监听器数组
  - emitter.once (eventName, listener): 事件监听一次
  - emitter. prependListener (): 将监听事件添加的到最前面
  - emitter. prependOnceListener ()：将监听事件添加到最前面，但是只监听一次
  - .emitter. removeAllListeners ([eventName])：移除所有的监听器

```js
const EventEmmiter = require('events')
const bus = new EventEmmiter()

bus.on('click', clickHandle)
```
