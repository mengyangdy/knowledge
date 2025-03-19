---
title: 使用ssh链接git远程仓库
description: 本文介绍下如何配置和使用SSH秘钥进行代码拉取和推送
tags: [ssh, git]
date: 2025-03-18
---

ssh协议可以实现安全的免密认证，并且性能比HTTPS协议更好，下面就介绍一下如何使用

## 前提条件

电脑已经安装了git并且版本大于1.9

电脑需要安装OpenSSH客户端(win10已经内置了)

## 查看是否存在秘钥

在生成新的秘钥前需要看一下本地是否已经有秘钥了，一般存放在本地用户的根目录里面：

### ED25519算法

```bash
cat ~/.ssh/id_ed25519.pub
```

### RSA算法

```bash
cat ~/.ssh/id_rsa.pub
```

如果返回的有一串以`ssh-ed2519`或者是`ssh-rsa`开头的字符串，说明本地已经存在秘钥了，直接使用即可。

## 生成秘钥

1. 打开我们电脑的终端，运行`ssh-keygen -t`
2. 输入秘钥算法类型和可选的注释，注释一般会出现在`.pub`文件中，一般可以使用邮箱作为注释内容

**基于ED25519算法，生成秘钥对命令如下：**

```bash
ssh-keygen -t ed25519 -C "<注释内容>"
```

**基于RSA算法，生成秘钥的命令如下：**

```bash
ssh-keygen -t rsa -C "<注释内容>"
```

3. 点击回车，选择SSH秘钥生成路径

以**ED25519算法**为例，默认路径如下：

```bash
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/user/.ssh/id_ed25519):
```

密钥默认生成路径：`/home/user/.ssh/id_ed25519`，公钥与之对应为：`/home/user/.ssh/id_ed25519.pub` 

以**RSA算法**为例，默认路径如下：

```bash
Generating public/private rsa key pair.
Enter file in which to save the key (/home/user/.ssh/id_rsa):
```

秘钥默认生成路径：`/home/user/.ssh/id_rsa`，公钥与之对应为：`/home/user/.ssh/id_rsa.pub`

4. 设置一个秘钥口令

```bash
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

口令默认为空，可以选择使用口令保护私钥文件，如果你不想每次使用SSH访问仓库时都需要输入用于保护私钥文件的口令的话，可以在创建口令的时候直接回车。

5. 一直回车，完成秘钥对创建

## 拷贝公钥

### 使用命令打印出来公钥信息

```bash
cat ~/.ssh/id_ed25519.pub
```

打印出来之后手动复制到github等地方

### 拷贝公钥到粘贴板中

#### window下使用

```bash
cat ~/.ssh/id_ed25519.pub | clip
```

#### mac下使用

```bash
tr -d '\n' < ~/.ssh/id_ed25519.pub | pbcopy
```

#### GUN/Linux中使用

```bash
xclip -sel clip < ~/.ssh/id_ed25519.pub
```