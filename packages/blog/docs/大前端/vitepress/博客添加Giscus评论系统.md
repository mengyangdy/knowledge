---
title: 博客添加Giscus评论系统
tags:
  - vitepress
  - giscus
date: 2023-10-24
cover: https://s2.loli.net/2023/10/24/FvWXwdo5nSgqA9T.jpg
---

# 博客添加 Giscus 评论系统

## Giscus 是什么？

> Giscus 是一个轻量级的开源评论系统，可以轻松的添加到静态站点、博客、项目文档等其他类型的网站上，Giscus 是利用 GitHub Discussions 实现的评论系统，只需要简单的几步即可接入到自己的网站上。

## 开始接入 Giscus

### 创建仓库

我们可以新建一个仓库，设置仓库的权限为 Public，这样的话仓库才能被别人看到，仓库对应的 Discussions 才能被访问，Giscus 才能正常的接入。

![Snipaste_2023-10-24_15-37-21.png](https://s2.loli.net/2023/10/24/JVcKHgFD42WRQsp.png)

因为此项目就在 github 上，所以就用这个仓库作为 Giscus 的仓库即可。

### 打开新建仓库的 Discussions

打开仓库的 `Settings` 页面，下面的 `Features` 属性里面的 `Discussions` 选项勾选上即可

![Snipaste_2023-10-24_15-41-20.png](https://s2.loli.net/2023/10/24/S6k3nurAsUqb1Cf.png)

![Snipaste_2023-10-24_15-43-14.png](https://s2.loli.net/2023/10/24/6jvxogKYWArqLcp.png)

### 安装 Giscus 的 App

为新建的这个仓库安装上 Giscus 的 Github App

点击 [链接](https://github.com/apps/giscus)，打开 Github App 的页面，点击 `Install` 安装，安装的时候可以选择是安装所有的仓库还是某一个仓库

![Snipaste_2023-10-24_15-46-13.png](https://s2.loli.net/2023/10/24/xMFZkmqfNX4uaSp.png)

我选择只在某一个项目安装：

![Snipaste_2023-10-24_15-53-31.png](https://s2.loli.net/2023/10/24/akzx4oTC9n8DVE7.png)

然后点击 [链接](https://giscus.app/zh-CN) 前往 Gisucs App 的页面，输入 `用户名/仓库名`,然后选择下分类

![微信图片_20231024155603.png](https://s2.loli.net/2023/10/24/2CQEB4jbuMNlHrp.png)

然后继续往下来找到启用 giscus 复制生成的 script 标签的内容：

![Snipaste_2023-10-24_15-57-04.png](https://s2.loli.net/2023/10/24/UoLhtuZaysH52In.png)

### 项目中安装

不同的项目使用的是不同的模块，使用方法也有点不一样，大家可以来 [https://github.com/giscus/giscus-component](https://github.com/giscus/giscus-component) 查看下不同的框架怎么使用
