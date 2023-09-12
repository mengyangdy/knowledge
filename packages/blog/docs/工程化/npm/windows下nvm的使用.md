---
title: windows下nvm的使用
tags:
  - npm
  - nvm
date: 2023-09-12
cover: https://s2.loli.net/2023/09/12/XLQcPkv4u3tTmyz.jpg
---
# windows 下 nvm 的使用

## Nvm 是什么？

> Nvm 英文为 `node.js version management`,它是一个 node 的版本管理工具，方便我们快速的切换使用不同的 node 版本，有的项目所用的 node 版本低，有的项目所用的 node 版本高，如果每次都卸载重装太过于麻烦，所以我们就需要一个 node 版本管理工具

## 下载 nvm

Nvm 的 GitHub 下载地址为：[GitHub地址](https://github.com/coreybutler/nvm-windows/releases)

一般我们下载的都是 `[nvm-setup.exe](https://github.com/coreybutler/nvm-windows/releases/download/1.1.11/nvm-setup.exe)` 版本，这样我们就免去了一些配置。

安装的话就按照默认的路径安装即可，安装成功后命令行输入 `nvm` 就会出现打印信息。

## Nvm 命令

- `nvm arch`：显示 node 是运行在 32 位还是 64 位
- `nvm install <version> [arch]`：安装 node，version 是我们想安装的 node 版本号，可选参数 arch 指定安装 32 位还是 64 位版本，默认是系统位数。可以添加–insecure 绕过远程服务器的 SSL
- `nvm list [available]`：显示已安装的 node 版本的列表，可选参数 available 显示可安装的所有版本。List 可以简化为 ls
- `nvm on`：开启 nodejs 版本管理
- `nvm off`：关闭 nodejs 版本管理
- `nvm proxy [url]`：设置下载代理，不加可选参数，显示当前代理，将 url 参数设置为 none 则移除代理
- `nvm node_mirror [url]`：设置 node 镜像，默认是 `https://nodejs.org/dist/`,如果不写 url，则使用默认 url，设置后可以到安装目录 `settings.txt` 文件查看
- `nvm npm_mirror [url]`：设置 npm 镜像，默认为 `https://github.com/npm/cli/archive/`，如果不写 url，则使用默认 url，设置后可以到安装目录 `settings.txt` 文件查看，也可以直接在该文件操作
- `nvm uninstall <version>`：卸载指定版本 node
- `nvm use [version] [arch]`：使用某一版本 node，可指定 32、64 位
- `nvm root [path]`：设置存储不同版本 node 的目录，如果未设置，默认使用当前目录
- `nvm version`：显示 nvm 的版本，version 可以简化为 v
- `nvm install latest`：安装最新版本的 node
- `nvm install stable`：安装最新的稳定版本

## 设置 npm 的全局安装地址和缓存为止

Npm 安装包的默认位置是 C 盘，如果全局安装的依赖过多，会占用过多 C 盘空间。

**查看全局安装和缓存位置**

```bash
# 查看npm 全局安装地址
npm config get prefix

# 查看npm 缓存位置
npm config get cache
```

**设置全局安装地址及缓存位置**

```bash
# 设置npm安装的地址
npm config set prefix "E:\software\front_end\nodejs\node_global"

# npm 缓存位置设置
npm config set cache "E:\software\front_end\nodejs\node_cache"
```

将这两个文件夹添加到环境变量里面即可

## 配置 npm 淘宝加速镜像

查看镜像

```bash
npm config set registry
```

设置淘宝镜像

```bash
npm config set registry https://registry.npmmirror.com
```