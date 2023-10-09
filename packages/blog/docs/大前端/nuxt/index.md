---
title: nuxt3项目新建的时候报错的解决方案
tags:
  - vue
  - nuxt3
date: 2023-09-19
cover: https://s2.loli.net/2023/09/19/uZSpKVlnYP4z3H7.jpg
---

# nuxt3项目新建的时候报错的解决方案

新建 nuxt3 的时候一直报错 `Error: Failed to download template from registry: fetch failed`，也就是说 `无法从注册表下载模板：获取失败`。

查看 [官网](https://nuxt.com/docs/getting-started/installation) 的新建模板操作：

```bash
pnpm dlx nuxi@latest init <project-name>
```

然后使用这个命令创建项目的时候一直报错：

```text
 Desktop  pnpm dlx nuxi@latest init nuxtdemo
Packages: +1
+
Progress: resolved 2, reused 1, downloaded 0, added 1, done

 ERROR  Error: Failed to download template from registry: fetch failed

NativeCommandExitException: Program "node.exe" ended with non-zero exit code: 1.
```

因为 nuxt 的项目是从 git 上下载的，可能是因为我们网络不通的问题导致的，我们 ping 一下网站看下是否可以 ping 通：

```shell
ping raw.githubusercontent.com
```

然后终端报错：

```shell
Ping 请求找不到主机 raw.githubusercontent.com。请检查该名称，然后重试。
```

发现了确实是因为访问不到网站导致的，我们前往 [ipaddress](https://sites.ipaddress.com/raw.githubusercontent.com/) 的网站上查看 `githubusercontent` 的 `ip` 地址：

![](https://s2.loli.net/2023/09/19/ZpKaRs8i2Nl1gf4.png)

然后在电脑的 `hosts` 文件中添加一行：

windows 上 `hosts` 文件的地址是在 `C:\Windows\System32\drivers\etc`

mac 上的 `hosts` 文件的地址是在 `/etc/hosts`

```shell
185.199.108.133 raw.githubusercontent.com
```

然后再次在终端 ping 一下看看能不能通了：

```
ping raw.githubusercontent.com
```

![](https://s2.loli.net/2023/09/19/S12Ymb9yJZnpf8i.png)

如果通了的话我们就可以再次执行新建项目的命令看下能不能下载下来：

下载项目的话会让我们做出一些选择：

![](https://s2.loli.net/2023/09/19/NYbq1JXmIld8rPU.png)

这个意思是用那个包管理工具，我们选择 `pnpm`

![](https://s2.loli.net/2023/09/19/65kXvhHmJCyzsAg.png)

然后就可以看到已经下载好了通过 cd 到目标文件夹就可以开始了。

## 造成的原因

我们可以从 nuxt 的 issue 中的 [issue](https://github.com/nuxt/cli/issues/159) 中找到类似的情况，nuxt 的脚手架 nuxi 使用了 [giget](https://github.com/unjs/giget) 来从 [nuxt 模板仓库](https://github.com/nuxt/starter)中获取文件。

giget 所做的事情就是利用 node 从 github 上的仓库中拉去模板，giget 和 [degit](https://github.com/Rich-Harris/degit) 都可以从 github 上拉去仓库内容，不同的是 degit 支持自动从环境变量中获取 `https_proxy` 进行代理，而 giget 没有做处理。

## 其他解决方法

### 手动克隆模板仓库

```bash
git clone -b v3 https://github.com/nuxt/starter.git nuxt3-demo
```

-b 是指定分支，现在最新的 nuxt 3 是在 v3 的分支上

### 使用 degit 拉取代码

```bash
degit 'nuxt/starter#v3' nuxt3-demo
```

`#v3` 代表下载相应的分支。
