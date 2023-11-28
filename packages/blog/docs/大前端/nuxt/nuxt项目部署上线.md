---
title: nuxt项目部署上线
tags:
  - nuxt3
  - pm2
  - nginx
date: 2023-11-08
cover: https://s2.loli.net/2023/11/08/V6muZDATbXw15LF.jpg
---

# nuxt 项目部署上线

## 打包项目部署到服务器

执行打包命令，将项目打包后的 `.output` 文件夹放到服务器的某一个目录下面：

```shell
pnpm run build
```

![Snipaste_2023-11-08_09-56-20.png](https://s2.loli.net/2023/11/08/MWZPQ3gi89zcYlD.png)

## 服务器安装依赖

首先服务器上安装上 node，因为我们需要使用 `npm` 来全局的安装 `pm2` 来守护我们的进程：

> `pm2` 一定要全局安装，这样的话在服务器上任意一个命令窗口都可以使用，要不在某个命令行窗口会找不到 `pm2`

```shell
npm install pm2 -g
```

## 启动服务

在服务器的 `.output` 文件夹同级创建一个 `ecosystem.config.js` 文件，里面写入以下内容：

```js
module.exports = {
  apps: [
    {
      name: 'NuxtAppName',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
```

然后执行一下命令启动服务：

```js
pm2 start ecosystem.config.js
//然后使用下边的命令看一下启动的服务列表
pm2 list
```

服务是 online 说明启动成功了。

## 设置自动重启

当服务器故障或者重启的时候，pm2 服务能自动重启，而不是每次都需要人为的敲代码去重启 pm 2 服务

保存启动的服务器列表状态：

```shell
// 这一步是必不可少的
pm2 save

// 设置服务器开启自启
pm2 startup
```

## pm 2 常见的配置

```js
// 配置pm2
module.exports = {
  apps: [
    {
      name: 'BlogHomeNuxt',
      script: 'output/server/index.mjs',
      args: '', // 传递给脚本的参数
      watch: true, // 开启监听文件变动重启
      ignore_watch: ['node_modules', 'public', 'logs'], // 不用监听的文件
      exec_mode: 'fork', // 自家主机window cluster_mode 模式下启动失败
      instances: '2', // max表示最大的 应用启动实例个数，仅在 cluster 模式有效 默认为 fork
      autorestart: true, // 默认为 true, 发生异常的情况下自动重启
      max_memory_restart: '1G',
      // error_file: './logs/app-err.log', // 错误日志文件
      // out_file: './logs/app-out.log', // 正常日志文件
      merge_logs: true, // 设置追加日志而不是新建日志
      log_date_format: 'YYYY-MM-DD HH:mm:ss', // 指定日志文件的时间格式
      min_uptime: '60s', // 应用运行少于时间被认为是异常启动
      max_restarts: 30, // 最大异常重启次数
      restart_delay: 60, // 异常重启情况下，延时重启时间
      env: {
        // 环境参数，当前指定为开发环境
        NODE_ENV: 'development',
        PORT: '5050'
      },
      env_production: {
        // 环境参数,当前指定为生产环境
        NODE_ENV: 'production', //使用production模式 pm2 start ecosystem.config.js --env production
        PORT: '5050'
      },
      env_test: {
        // 环境参数,当前为测试环境
        NODE_ENV: 'test'
      }
    }
  ]
}
```

执行环境变量：

```js
pm2 start ecosystem.config.js --env production
```

|                        |                              |
| ---------------------- | ---------------------------- |
| pm2 list               | 查看启动的服务列表           |
| pm2 restart nuxtjsDemo | 重启名为nuxtjsDemo的服务     |
| pm2 stop nuxtjsDemo    | 终止名为nuxtjsDemo的服务     |
| pm2 delete nuxtjsDemo  | 删除名为nuxtjsDemo的服务     |
| pm2 kill               | 杀掉服务                     |
| pm2 logs nuxtjsDemo    | 查看名为nuxtjsDemo的服务日志 |

## nginx 转发配置

```nginx
server {
    listen       80 ;
    server_name  nuxtApp;

    error_log    /var/log/nginx/tinkink_error.log;
    access_log    /var/log/nginx/tinkink_accss.log;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host  $http_host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_http_version 1.1;
        # Node.js的本机地址，注意端口
        proxy_pass    http://localhost:3000;
    }
}
```
