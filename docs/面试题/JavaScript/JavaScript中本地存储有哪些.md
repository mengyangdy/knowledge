---
title: JavaScript中本地存储有哪些？
tags:
  - js
  - 面试题
date: 2024-04-23
---
# 一 JavaScript中本地存储有哪些？

## 1.1 方式

javaScript 本地缓存的⽅法我们主要讲述以下四种：
- cookie
- sessionStorage
- localStorage
- indexedDB

### 1.1.1 cookie

Cookie ，类型为「⼩型⽂本⽂件」，指某些⽹站为了辨别⽤⼾⾝份⽽储存在⽤⼾本地终端上的数据。是为了解决 HTTP ⽆状态导致的问题

作为⼀段⼀般不超过 4KB 的⼩型⽂本数据，它由⼀个名称（Name）、⼀个值（Value）和其它⼏个⽤于控制 cookie 有效期、安全性、使⽤范围的可选属性组成

但是 cookie 在每次请求中都会被发送，如果不使⽤ HTTPS 并对其加密，其保存的信息很容易被窃取，导致安全⻛险。举个例⼦，在⼀些使⽤ cookie 保持登录态的⽹站上，如果 cookie 被窃取，他⼈很容易利⽤你的 cookie 来假扮成你登录⽹站

关于 cookie 常⽤的属性如下：
- Expires ⽤于设置 Cookie 的过期时间

```JS
Expires=Wed, 21 Oct 2015 07:28:00 GMT
```

- Max-Age ⽤于设置在 Cookie 失效之前需要经过的秒数（优先级⽐ Expires ⾼）

```JS
Max-Age=604800
```

- Domain 指定了 Cookie 可以送达的主机名
- Path 指定了⼀个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie⾸部

```JS
Path=/docs # /docs/Web/ 下的资源会带 Cookie ⾸部
```

- 标记为 Secure 的 Cookie 只应通过被 HTTPS 协议加密过的请求发送给服务端

通过上述，我们可以看到 cookie ⼜开始的作⽤并不是为了缓存⽽设计出来，只是借⽤了 cookie的特性实现缓存

关于 cookie 的使⽤如下：

```JS
document.cookie = '名字=值';
```

关于 cookie 的修改，⾸先要确定 domain 和 path 属性都是相同的才可以，其中有⼀个不同得时候都会创建出⼀个新的 cookie

```JS
Set-Cookie:name=aa; domain=aa.net; path=/ # 服务端设置
document.cookie =name=bb; domain=aa.net; path=/ # 客⼾端设置
```

最后 cookie 的删除，最常⽤的⽅法就是给 cookie 设置⼀个过期的事件，这样 cookie 过期后会被浏览器删除

### 1.1.2 localStorage

HTML5 新⽅法，IE8及以上浏览器都兼容

#### 1.1.2.1 特点

- ⽣命周期：持久化的本地存储，除⾮主动删除数据，否则数据是永远不会过期的
- 存储的信息在同⼀域中是共享的
- 当本⻚操作（新增、修改、删除）了 localStorage 的时候，本⻚⾯不会触发 storage 事件,但是别的⻚⾯会触发 storage 事件。
- ⼤⼩：5M（跟浏览器⼚商有关系）
- localStorage 本质上是对字符串的读取，如果存储内容多的话会消耗内存空间，会导致⻚⾯变卡
- 受同源策略的限制

下⾯再看看关于 localStorage 的使⽤

设置

```JS
localStorage.setItem('username','cfangxu');
```

获取

```JS
localStorage.getItem('username')
```

获取键名

```JS
localStorage.key(0) //获取第⼀个键名
```

删除

```JS
localStorage.removeItem('username')
```

⼀次性清除所有存储

```JS
localStorage.clear()
```

localStorage 也不是完美的，它有两个缺点：
- ⽆法像 Cookie ⼀样设置过期时间
- 只能存⼊字符串，⽆法直接存对象

```JS
localStorage.setItem('key', {name: 'value'});
console.log(localStorage.getItem('key')); // '[object, Object]'
```

### 1.1.3 sessionStorage
sessionStorage 和 localStorage 使⽤⽅法基本⼀致，唯⼀不同的是⽣命周期，⼀旦⻚⾯（会话）关闭， sessionStorage 将会删除数据

### 1.1.4 扩展的前端存储⽅式

indexedDB 是⼀种低级API，⽤于客⼾端存储⼤量结构化数据(包括, ⽂件/ blobs)。该API使⽤索引来实现对该数据的⾼性能搜索

虽然 Web Storage 对于存储较少量的数据很有⽤，但对于存储更⼤量的结构化数据来说，这种⽅法不太有⽤。 IndexedDB 提供了⼀个解决⽅案

#### 1.1.4.1 优点：

- 储存量理论上没有上限
- 所有操作都是异步的，相⽐ LocalStorage 同步操作性能更⾼，尤其是数据量较⼤时
- 原⽣⽀持储存 JS 的对象
- 是个正经的数据库，意味着数据库能⼲的事它都能⼲

#### 1.1.4.2 缺点：
- 操作⾮常繁琐
- 本⾝有⼀定⻔槛

关于 indexedDB 的使⽤基本使⽤步骤如下：
- 打开数据库并且开始⼀个事务
- 创建⼀个 object store
- 构建⼀个请求来执⾏⼀些数据库操作，像增加或提取数据等。
- 通过监听正确类型的 DOM 事件以等待操作完成。
- 在操作结果上进⾏⼀些操作（可以在 request 对象中找到）

关于使⽤ indexdb 的使⽤会⽐较繁琐，⼤家可以通过使⽤ Godb.js 库进⾏缓存，最⼤化的降低操作难度


## 1.2 区别

### 1.2.1 存储位置与大小限制

- `Cookie`:存储的客户端,即用户的浏览器中,由于 Cookie 是通过 HTTP 请求在服务求出和浏览器之间传输的,因此他们的大小有限制,通常不超过 4 KB,大多数浏览器限制在 20 个,有的可能 50 个
- `sessionStorage`:也是存储在客户端的,但是他是一个临时的回话存储对象,sessionStorage 没有严格的大小限制,但是它仅仅在当前浏览器窗口或标签页中有效,并且当窗口或标签页关闭时,存储的数据会被自动删除
- `localStorage`:同样存储在客户端,并且提供了比 Cookie 更大的存储空间,一并来说,浏览器的支持可以达到 5 M,这使得它可以存储更多的数据

### 1.2.2 数据有效性与持久性

- `Cookie`:可以设置过期时间,从而决定其在浏览器中的有效期,一旦过期,Cookie 将被删除,如果没有设置过期时间,默认是关闭浏览器后失效
- `sessionStorage`:数据在页面会话期间保持有效,当页面会话结束时,数据会被清除,它提供了一种在单个会话中跟踪用户数据的方式
- `localStorage`:存储的数据没有过期时间,他们会一直保留在浏览器中,直到被手动删除或清除缓存

### 1.2.3 与服务端的通信

`Cookie`:会在每次 http 请求中发送到服务器,因此他们可以用于在客户端和服务器之间传递数据,这种特性使得 Cookie 成为处理用户身份验证和会话管理的常用机制

`sessionStorage和localStorage`:不与服务器通信,他们主要用于在客户端存储数据,以便在后续的页面请求或者用户交互中使用

### 1.2.4 数据共享与独立性

- `Cookie`:对于同一个域名下的网站,可以共享 Cookie 数据
- `sessionStorage`:数据在不同的窗口或标签页之间不共享
- `localStorage`:在整个浏览器实例中共享数据,无论打开多少个窗口或标签页,都可以访问到相同的 localStorage 数据

### 1.2.5 使用场景

- `Cookie`:适用于需要在客户端和服务器之间传递小量数据的场景,如身份验证和会话管理
- `sessionStorage`:适用于在同一浏览器窗口或标签页中临时存储数据
- `localStorage`:适用于需要在客户端长期大量存储数据的场景
