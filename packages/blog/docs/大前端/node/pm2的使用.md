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

- pm2 启动进程
  - pm2 start index.js node 服务器单进程启动如果容器是 node，可以不写
  - pm2 start java --name jtcp -- ~/jtcp.java java tcp 服务器单进程启动。双减号后无空格参数是 pm2参数，有空格的是脚本参数
  - pm2 start server.min.js -i 4 多进程集群启动，启动4个 server 后台进程，4也可以赋值'max'，max 等于 Cpu 的核心数
  - pm2 start index.js --name server 1 使用名字启动进程
  - pm2 start 18 使用 pm2 list 里面的进程 id 启动进程
  - pm2 start server 1 使用 pm2 list 里面的进程 name 启动进程
  - pm2 start ~/.pm 2.json 使用 pm2 配置文件启动
- pm2 停止进程 停止并退出进程，不清除 pm2 进程信息缓存
  - pm2 stop all 停止所有的进程
  - pm2 stop 18 停止指定进程 id 的进程
  - pm2 stop server 1 使用指定进程 name 停止进程
- pm2 删除进程 停止并退出进程，清除 pm2 进程信息缓存
  - pm2 delete all 删除所有进程
  - pm2 delete 18 删除指定进程 id 的进程
  - pm2 delete server 1 删除指定进程 name 停止进程
- pm2 重启进程 相当于一个进程执行 stop，在执行 start 两个操作的集合
  - pm2 restart all 重启所有进程
  - pm2 restart 18 重启指定进程 id 的进程
  - pm2 restart server 1 重启指定进程 name 停止进程
- pm2 重载进程 相当于一个进程执行 delete，再执行 start 两个操作的集合，此过程会刷新启动配置文件
  - pm2 reload all 重载所有进程
  - pm2 reload 18 重载指定进程 id 的进程
  - pm2 relaod server1 重载指定进程 name 停止进程
- pm2 监控进程
  - pm2 list 显示所有进程状态
  - pm2 monit 监视所有进程
  - pm2 monitor 实时页面监控
  - pm2 describe 18 查询指定进程 id 的进程详细信息
  - pm2 describe server1 查询指定进程 name 的进程详细信息
- pm2 日志管理
  - pm2 start index.js -o "/var/logs/out.log" -e "/var/logs/err.log" 启动进程时指定日志输出目录
  - pm2 log 显示所有进程日志
  - pm2 log server1 显示指定进程 name 的日志
  - pm2 log --err 查看错误日志
  - pm2 log --out 查看常规运行日志
  - pm 2 log | grep "xxx" 筛选想查看的日志

## 其他配置

注意事项：

- restart 命令会杀死并重启进程，所以会短时间内服务不可用，生产环境推荐使用 reload
