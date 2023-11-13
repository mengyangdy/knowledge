---
title: pm2的使用
tags:
  - node
  - pm2
date: 2023-11-13
cover: https://my-vitepress-blog.sh1a.qingstor.com/202311131739308.jpg
---

# pm2的使用

## pm2 介绍

> pm 2 是一个带有负载均衡功能的 Node 应用的多进程管理器，虽然是为 node 开发的，但也能管理其他程序进程，比如 Java，go 项目。

pm2 主要特性：

- 后台运行：相较于普通的启动方式（如 node index.js），PM2可以在关闭终端后依然保持进程运行。
- 自动重启：PM2可以监听某些文件的改动，并在需要时自动重启对应的应用。
- 停止不稳定的进程：当一个进程的稳定性达到一定程度并且重启次数超过上限时，PM2会自动停止该进程。
- 0秒停机重启：在集群模式下，可以实现在不停止服务的情况下进行重启。
- 日志管理：PM2可以收集应用程序的日志，并有插件可以帮助进行日志管理。
- 负载均衡：在cluster模式下，PM2可以自动使用轮询的方式进行负载均衡，从而减轻服务器的压力。
- 提供实时接口：PM 2 的插件可以提供实时的接口，返回服务器与进程的信息

## pm2 常用命令

- pm 2 启动进程
  - pm2 start index.js
  - pm 2 start java --name jtcp -- ~/jtcp.java
  - pm 2 start server.min.js -i 4
  - pm 2 start index.js --name server 1
  - pm 2 start 18
  - pm 2 start server 1
  - pm 2 start ~/.pm 2.json
- pm 2 停止进程
  - pm 2 stop all
  - pm 2 stop 18
  - pm 2 stop server 1
- pm 2 删除进程
  - pm 2 delete all
  - pm 2 delete 18
  - pm 2 delete server 1
- pm 2 重启进程
  - pm 2 restart all
  - pm 2 restart 18
  - pm 2 restart server 1
- pm 2 重载进程
  - pm 2 reload all
  - pm 2 reload 18
  - pm 2 relaod server 1
- pm 2 监控进程
  - pm 2 list
  - pm 2 monit
  - pm 2 monitor
  - pm 2 describe 18
  - pm 2 describe server 1
-

## pm 2 日志
