---
title: 描述WebSocket的握手过程
tags:
  - 计算机网络
  - 面试题
date: 2024-06-03
---
# 一 描述WebSocket的握手过程

WebSocket的握手过程是建立一个WebSocket连接的初始化阶段，它允许从传统的HTTP连接转换为WebSocket协议的双向通信连接。以下是WebSocket握手的详细步骤：

1. **建立TCP连接**： 客户端首先通过TCP协议与服务器建立一个连接。这是所有后续通信的基础。
    
2. **发送HTTP Upgrade请求**： 客户端随后发送一个HTTP GET请求到服务器，这个请求包含了特殊的头部信息，表明其意图升级（Upgrade）当前的HTTP连接到WebSocket连接。关键的头部字段包括：
    
    - `Upgrade`: 设置为`websocket`，表示客户端希望升级协议。
    - `Connection`: 设置为`Upgrade`，表示请求一个协议升级。
    - `Sec-WebSocket-Key`: 包含一个Base64编码的随机字符串，服务器将用这个字符串和一个固定的GUID一起通过SHA-1哈希并Base64编码来生成`Sec-WebSocket-Accept`响应头的值，作为握手验证的一部分。
    - `Sec-WebSocket-Version`: 指定客户端支持的WebSocket协议版本，通常是13，代表RFC 6455版本的WebSocket协议。
    - 可选的`Origin`、`Host`、`Sec-WebSocket-Protocol`（用于指定子协议）和`Sec-WebSocket-Extensions`（用于扩展协商）等头部。
3. **服务器响应**： 服务器在收到请求后，如果支持WebSocket并同意连接，则会返回一个HTTP响应，关键的响应头部包括：
    
    - `HTTP/1.1 101 Switching Protocols`：状态码表示服务器同意切换协议。
    - `Upgrade`: 同样设置为`websocket`，确认协议升级。
    - `Connection`: 设置为`Upgrade`，确认连接升级。
    - `Sec-WebSocket-Accept`: 包含服务器计算出的应答，该值基于客户端提供的`Sec-WebSocket-Key`加上一个固定的字符串"258EAFA5-E914-47DA-95CA-C5AB0DC85B11"进行SHA-1哈希并Base64编码得到。
    - 可能还包括对客户端请求的`Sec-WebSocket-Protocol`和`Sec-WebSocket-Extensions`的确认或协商结果。
4. **连接建立**： 一旦客户端验证了服务器的响应符合预期（比如检查`Sec-WebSocket-Accept`头部的值），就认为握手成功，此时TCP连接被视为WebSocket连接，并且双方可以开始发送和接收WebSocket数据帧，进行全双工通信。
    

整个握手过程设计成与现有HTTP基础设施兼容，使得WebSocket能够穿越大多数防火墙和代理服务器，而且可以在标准的HTTP端口（通常是80和443）上工作，无需额外的网络配置。