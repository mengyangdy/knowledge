---
title: 讲述一下如何使用WebSocketAPI实现一个简单的聊天应用
tags:
  - 计算机网络
  - 面试题
date: 2024-06-03
---
# 一讲述一下如何使用WebSocketAPI实现一个简单的聊天应用

使用WebSocket API实现一个简单的聊天应用涉及前端和后端的配合，以下是一个基本的实现流程：

## 1.1 后端服务器搭建

这里以Node.js为例，使用`ws`库搭建WebSocket服务器：

**安装依赖**:

```bash
npm install ws express
```

**服务器代码** (`server.js`):

```js
const WebSocket = require('ws');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
        // 广播给所有客户端
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.use(express.static('public')); // 假设前端静态文件位于public目录

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

## 1.2 前端应用

使用HTML、CSS和JavaScript创建聊天界面，并使用WebSocket API与后端通信。

**index.html**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>WebSocket Chat</title>
    <style>
        /* 简单样式 */
        #messages { height: 300px; overflow-y: scroll; border: 1px solid #ccc; padding: 10px; }
        #inputMessage { width: 90%; }
    </style>
</head>
<body>
<div id="messages"></div>
<input type="text" id="inputMessage" />
<button onclick="sendMessage()">Send</button>

<script>
    const socket = new WebSocket('ws://localhost:3000'); // 替换为你的WebSocket服务器地址
    const messagesDiv = document.getElementById('messages');
    const inputMessage = document.getElementById('inputMessage');

    socket.addEventListener('message', (event) => {
        const message = document.createElement('div');
        message.textContent = event.data;
        messagesDiv.appendChild(message);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

    function sendMessage() {
        if (inputMessage.value) {
            socket.send(inputMessage.value);
            inputMessage.value = '';
        }
    }
</script>
</body>
</html>
```

## 1.3 运行应用

- 启动后端服务器：在终端中运行`node server.js`。
- 打开浏览器访问`http://localhost:3000/index.html`（或根据你的实际端口和路径调整）。

现在，你应该可以看到一个简单的聊天界面，可以输入消息并发送，所有连接的客户端都能实时看到彼此的消息。

注意，这只是一个非常基础的实现，实际应用中可能还需要考虑用户身份验证、消息持久化存储、更复杂的用户界面和错误处理机制等。

