---
title: node版本管理工具fnm的使用
tags:
  - node
  - fnm
  - npm
date: 2024-04-13
---

## 一 安装fnm

### 1.1 在windows上安装fnm

1. 用管理员模式打开终端
2. 执行如下命令

```shell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

这段命令是用来下载chocolatey的，chocolatey是Windows下面的一个包管理工具。

3. 测试choco是否安装成功：

```shell
choco -v
```

如果打印出版本号的话就证明成功了。

提示：choco安装软件，都需要使用管理员模式打开终端安装。

然后执行命令安装fnm：

```shell
choco install fnm
```

测试fnm是否安装成功：

```shell
fnm -h
```

## 二 fnm配置

### 2.1 在Windows上的PowerShell配置fnm

首先我们需要执行命令创建PowerShell的配置文件：

```shell
notepad $profile
```

如果没有配置文件，则会创建一个，然后将一下内容添加到配置文件的末尾：

```txt
fnm env --use-on-cd | Out-String | Invoke-Expression
```

## 三 fnm常用命令

### 3.1 查看当前node版本

```shell
fnm current
```

### 3.2 列出所有已安装的node版本

```shell
fnm ls
fnm list
```

### 3.3 安装某一版本的node

```shell
fnm install <version>
```

### 3.4 删除某一版本的node

```shell
fnm uninstall <version>
```

### 3.5 切换node版本

```shell
fnm use <version>|<alias>
```

### 3.6 将某一个版本设为默认

```shell
fnm default <version>
```

### 3.7 设置node版本别名

```shell
fnm alias <version> <alias>
```

### 3.8 移除node版本别名

```shell
fnm unalias <alias>
```

### 3.9 安装最新版本的node

```shell
fnm install --latest
```

### 3.10 安装lts版本的node

```shell
fnm install --lts
```

### 3.11 列出所有可供下载的node版本

```shell
fnm ls-remote
```

## 四 卸载fnm

首先我们需要找到fnm的安装目录：

```shell
fnm env
```

此处变量FNM_DIR指示的位置就是FNM的安装位置，把fnm文件夹删除了就可以了。