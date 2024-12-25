---
title: WebSocket连接如何处理心跳和断线重连
tags:
  - 计算机网络
  - 面试题
date: 2024-06-03
---
# 一 WebSocket连接如何处理心跳和断线重连

WebSocket连接中的心跳和断线重连机制是确保通信稳定性和可靠性的两个重要策略。下面分别介绍它们的处理方法：

## 1.1 心跳（Heartbeat）

心跳机制用来检测客户端与服务端之间的连接是否仍然活跃。通常，心跳由客户端和/或服务端定期发送简单的控制消息（如"ping"和"pong"）来完成。

**客户端心跳**: 客户端周期性地向服务端发送心跳包，以维持连接活跃状态。示例如下：

```js
let heartbeatInterval;

function startHeartbeat() {
    heartbeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send('{"event":"ping","content":"heartbeat"}');
        } else {
            console.log("WebSocket连接未打开，无法发送心跳");
        }
    }, heartbeatIntervalMilliseconds); // 设定心跳间隔，如30000ms（30秒）
}
```

**服务端心跳响应**: 服务端接收到客户端的心跳后，应响应一个心跳确认包，如"pong"。服务端的实现取决于所使用的WebSocket库，但一般都会提供类似的回调机制。

## 1.2 断线重连（Reconnection）

当检测到连接中断或关闭时，客户端应该自动尝试重新建立连接，以恢复通信。

**实现断线重连**:

```js
let reconnectAttempts = 0;
const maxReconnectAttempts = 5; // 最大重试次数
let reconnectInterval;

function reconnect() {
    reconnectAttempts++;
    if (reconnectAttempts > maxReconnectAttempts) {
        console.error("重连尝试次数超过限制，不再尝试");
        return;
    }
    
    console.log("尝试重新连接...");
    reconnectInterval = setInterval(() => {
        if (socket.readyState !== WebSocket.OPEN) {
            socket = new WebSocket(wsUrl);
            setupWebSocketEvents(); // 重新绑定事件监听器
        } else {
            clearInterval(reconnectInterval);
            console.log("重连成功");
        }
    }, reconnectIntervalMilliseconds); // 设定重连间隔，如5000ms（5秒）
}
```

在`close`事件监听器中触发重连函数：

```js
socket.addEventListener('close', () => {
    console.log("连接已关闭，准备重连");
    reconnect();
});
```

## 1.3 注意事项

- **避免无限循环重连**：应设置最大重连次数，避免因网络问题导致的无限循环尝试。
- **延迟重试**：每次重连尝试之间应增加延迟，以防短时间内频繁重试。
- **资源管理**：确保在不需要连接时清理心跳计时器和重连计时器，避免内存泄漏。

结合心跳检测和断线重连机制，可以显著提高WebSocket连接的健壮性和用户体验。

