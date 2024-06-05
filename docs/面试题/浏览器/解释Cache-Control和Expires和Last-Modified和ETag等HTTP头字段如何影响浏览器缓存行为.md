---
title: 解释Cache-Control和Expires和Last-Modified和ETag等HTTP头字段如何影响浏览器缓存行为?
tags:
  - 浏览器
  - 面试题
date: 2024-06-03
---
# 一 解释Cache-Control和Expires和Last-Modified和ETag等HTTP头字段如何影响浏览器缓存行为?

**Cache-Control**

`Cache-Control` 是一个非常重要的HTTP头部字段，它允许服务器向客户端传达关于如何缓存特定响应的详细指令。这个字段是HTTP/1.1引入的，优先级高于HTTP/1.0中的`Expires`字段。它能够提供比`Expires`更为精确和灵活的缓存控制方式。主要指令包括：

- `max-age=<seconds>`：指示客户端可以将响应缓存多长时间，从接收到响应开始计算。
- `public` 或 `private`：分别指示响应可以被任何缓存（包括共享缓存，如代理服务器）或者只能被私有缓存（如浏览器缓存）缓存。
- `no-cache`：不是指不缓存，而是要求在使用前必须进行验证，确认内容没有改变。
- `no-store`：指示不应存储任何版本的响应或请求。
- `must-revalidate`：指示如果缓存的响应变得陈旧，必须向服务器验证其新鲜度。
- `s-maxage=<seconds>`：类似于`max-age`，但仅适用于共享缓存。

**Expires**

`Expires` 是HTTP/1.0中的字段，用于指定一个具体的日期和时间，告诉客户端在这个时间点之前，响应可以被认为是新鲜的，无需再次向服务器验证。例如，`Expires: Thu, 15 Feb 2018 08:10:23 GMT`。然而，由于依赖于客户端和服务器时间的一致性，以及不如`Cache-Control`灵活，现代应用更多采用`Cache-Control`。

**Last-Modified**

`Last-Modified` 代表资源在服务器上的最后修改时间。当客户端再次请求该资源时，它会在请求头中包含一个`If-Modified-Since`字段，值为上一次请求时得到的`Last-Modified`时间。服务器比较这个时间与资源的实际最后修改时间，如果资源没有变化，则返回一个304 Not Modified状态码，告诉客户端可以继续使用缓存的版本；如果有变化，则返回新的资源内容。

**ETag (Entity Tag)**

ETag 是资源的实体标签，是一个唯一的标识符，通常基于资源的内容生成。当客户端再次请求资源时，它会在请求头中包含一个`If-None-Match`字段，值为之前接收的ETag。服务器根据当前资源的ETag与请求中的If-None-Match做对比，如果匹配，则意味着资源没有改变，返回304 Not Modified；如果不匹配，则返回新的资源内容。

总结来说，`Cache-Control`和`Expires`控制缓存的生命周期，前者优先级更高且提供了更多的控制选项；`Last-Modified`和`ETag`则用于协商缓存，即在缓存过期后，验证资源是否需要更新。这些机制共同作用，确保了高效的数据利用和最小化的网络传输，提升了网页的加载速度和用户体验。