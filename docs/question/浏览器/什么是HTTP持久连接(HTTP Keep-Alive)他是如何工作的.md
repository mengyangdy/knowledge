---
title: 什么是HTTP持久连接(HTTP Keep-Alive)他是如何工作的?
tags:
  - 计算机网络
  - 面试题
date: 2024-05-29
---
# 一什么是HTTP持久连接(HTTP Keep-Alive)?他是如何工作的?

HTTP持久连接（HTTP Keep-Alive）是一种优化HTTP协议性能的机制，也称为HTTP连接复用。在HTTP/1.0中，默认情况下，每个HTTP请求完成后，客户端与服务器之间的TCP连接就会关闭。如果客户端需要再次请求资源，就需要重新建立TCP连接。这种做法对于频繁请求资源的情况效率较低，因为每次建立和断开TCP连接都需要时间。

HTTP Keep-Alive的工作原理如下：

1. **连接保持**：当客户端和服务器之间启用Keep-Alive时，客户端发起第一个HTTP请求，并在请求头中包含一个`Connection: Keep-Alive`字段。这表示客户端希望在当前请求完成后保持TCP连接的打开状态，以便后续请求可以复用这个连接，而不是为每个请求新建连接。
    
2. **服务器响应**：服务器收到带有`Keep-Alive`指示的请求后，会在响应头中包含相应的信息，比如可能会设置`Keep-Alive: timeout=15`，这意味着服务器同意保持连接开启，并且如果没有新的请求在这15秒内发生，它将自动关闭连接。服务器还可以通过`Keep-Alive: max=100`来指定单个连接上允许的最大请求数。
    
3. **复用连接**：在初始请求之后，客户端可以继续通过同一个TCP连接发送更多的HTTP请求，而不需要再次经历TCP三次握手和慢启动过程，从而显著提高了通信效率，减少了延迟。
    
4. **连接关闭**：当达到预设的超时时间或最大请求数，或者客户端显式发送一个带有`Connection: close`的请求来结束会话时，服务器会关闭这个连接。
    

从HTTP/1.1开始，Keep-Alive成为了默认行为，除非请求或响应中明确指定了`Connection: close`，否则连接会被默认保持打开状态。然而，现代Web开发中，HTTP/2和HTTP/3提供了更高效的多路复用和连接管理机制，进一步优化了资源加载速度和网络效率。

