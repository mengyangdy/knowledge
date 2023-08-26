---
title: 使用nvm管理NodeJS版本
tag:
  - nvm
  - node
date: 2023-08-26
cover: https://s2.loli.net/2023/08/26/E7hD4MzjXyGLxdP.jpg
---

# 使用 nvm 管理 NodeJS 版本

> nvm 是 node 的版本管理工具，也就是说 nvm 可以在一台电脑上使用多个版本的 node

## 下载

nvm for windows 下载地址：[https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)

选择 exe 文件：

![https://s2.loli.net/2023/08/26/Nf9hRLcpJ6wHQVt.png](https://s2.loli.net/2023/08/26/Nf9hRLcpJ6wHQVt.png)

下载后点击安装，无需配置，安装完成后测试是否安装成功

```bash
nvm -v
```

输出版本就是安装成功了

## nvm 常用的命令

### 1. 安装指定版本的 node:nvm install 版本号

```bash
nvm install 18.17.1
```

### 2. 安装最新版本的 node

```bash
npm install latest
```

### 3. 安装最新的稳定版本

```bash
npm install stable
```

### 4. 切换到指定版本的 node

```bash
npm use 18.17.1
```

### 5. 显示本地所有已安装的 node 版本

```bash
npm list
```

### 6. 显示远程可安装的列表

```bash
nvm list available
```

### 7. 卸载指定版本的node

```bash
nvm uninstall 18.17.1
```
