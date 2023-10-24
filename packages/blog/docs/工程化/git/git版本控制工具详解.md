---
title: git版本控制工具详解
tags:
  - git
date: 2023-10-23
cover: https://s2.loli.net/2023/10/23/Wye9snUJOxqMgrC.jpg
---

# git 版本控制工具详解

## 什么是版本控制工具

### 认识版本控制

- 什么是版本控制？
  - 版本控制的英文是 Version Control
  - 是维护工程蓝图的标准做法，能追踪工程蓝图从诞生一直到定案的过程
  - 版本控制也是一种软件工程技巧，借此能在软件开发的过程中，确保由不同人所编辑的同一程序文件都得到同步
- 简单来说，版本控制在软件开发中，可以帮助程序员进行代码的追踪、维护、控制等等一系列的操作

![第4页-9.PNG](https://s2.loli.net/2023/10/23/RcAHVwrQbkzfCOa.png)

### 版本控制的功能

- 对于我们日常开发，我们尝尝面临如下的一些问题，通过版本控制可以很好的解决
- 不同版本的存储管理：
  - 一个项目会不断进行版本的迭代，来修复之前的一些问题，增加新的功能、需求，甚至包括项目的重构
  - 如果我们通过手动来维护一系列的项目备份，简直是异常噩梦
- 重大版本的备份维护：
  - 对于很多重大的版本，我们会进行备份管理
- 恢复之前的项目版本
  - 当我们开发过程中发生一些严重的问题时，想要恢复之前的操作或者回到之前的某个版本
- 记录项目的点点滴滴
  - 如果我们每一个功能的修改、bug 的修复、新的需求更新都需要记录下来，版本控制可以很好的解决
- 多人开发的代码合并
  - 项目中通常都是多人开发，将多人代码进行合并，并且在出现冲突时更好的进行处理

### 版本控制的历史

- 版本控制的史前时代（没有版本控制）
  - 人们通常通过文件备份的方式来进行管理，再通过 diff 命令来对比两个文件的差异
- CVS（Concurrent Versions Ststem）
  - 第一个被大规模使用的版本控制工具，诞生于 1985 年
  - 由荷兰阿姆斯特丹 VU 大学的 Dick Grune 教授实现的，也算是 SVN 的前身（SVN 的出现就是为了取代 CVS 的）
- SVN（Subversion）
  - 因其命令行工具名为 svn 因此通常被简称为 SVN
  - SVN 由 CollabNet 公司于 2000 年资助并发起开发，目的是取代 CVS，对 CVS 进行了很多的优化
  - SVN 和 CVS 一样，也属于集中式版本控制工具
  - SVN 和早期公司开发中使用率非常高，但是目前已经被 git 取代
- git（Linus 的作品）
  - 早期的时候，Linux 社区使用的是 BitKeeper 来进行版本控制
  - 但是因为一些原因，BitKeeper 想要收回对 Linux 社区的免费授权
  - 于是 Linux 用了大概一周的时间，开发了 git 用来取代 BitKeeper
  - Linus 完成了 git 的核心设计，在之后 Linux 功成身退，将 git 交由另外一个 Git 的主要贡献者 JunioC Hamano 来维护

## 集中式和分布式的区别

### 集中式版本管理

- CVS 和 SVN 都是属于集中式版本控制系统（Centralized Version Systems,简称 CVCS）
  - 他们的主要特点是单一的集中管理的服务器，保存所有文件的修订版本
  - 协同开发人员通过客户端连接到这台服务器，取出最新的文件或者提交更新

![第4页-9.PNG](https://s2.loli.net/2023/10/23/RcAHVwrQbkzfCOa.png)

- 这种做法带来了许多好处，特别是相较于老式的本地管理来说，每个人都可以在一定程度上看到项目中的其他人正在做什么
- 但是集中式版本控制也有一个核心的问题：中央服务器不能出现故障
  - 如果宕机一小时，那么在这一小时内，谁都无法提交更新，也就无法协同工作
  - 如果中心数据库所在的磁盘发生损坏，又没有做恰当备份，毫无疑问你将丢失所有数据

### 分布式版本控制

- git 是属于分布式版本控制系统（Distributed Version Control System，简称 DVCS）
  - 客户端并不只是提取最新版本的文件快照，而是把代码仓库完整地镜像下来，包括完整的历史记录
  - 这么一来，任何一处协同工作用的服务器发生故障，事后都可以用使用一个镜像出来的本地仓库恢复
  - 因为每一次的克隆操作，实际上都是一次对代码仓库的完整备份
- 目前在公司开发中我们都是使用 git 来管理项目的

![第8页-11.PNG](https://s2.loli.net/2023/10/23/eCv7jrysmSAoT6E.png)

## git 环境的安装搭建

### git 安装

- 电脑上想要使用 git，我们需要先对 git 进行安装
  - git 的官网： https://git-scm.com/downloads
  - 根据自己的操作系统下载 git 即可
- 在 window 操作系统按照默认配置全局安装即可

![第9页-12.PNG](https://s2.loli.net/2023/10/23/iHqUPo4NYatVyI8.png)

### Bash-CMD-GUI 的区别

- Bash，Unix shell 的一种，Linux 与 Mac OS X 都将它作为默认的 shell
  - git bash 就是一个 shell，是 window 下的命令行工具，可以执行 Linux 命令
  - git bash 是基于 CMD 的，在 CMD 的基础上增添一些新的命令与功能
  - 所以建议在使用的时候，用 bash 更加方便
- git CMD
  - 命令行提示符（CMD）是 windows 操作系统上的命令行解释程序
  - 当你在 windows 上安装 git 并且习惯使用命令行时，可以使用 cmd 来运行 git 命令
- git GUI
  - 基本上针对那些不喜欢黑屏（命令行）编码的人
  - 他提供了一个图形化用户界面来运行 git 命令

### git 的配置分类

- 既然已经在系统上安装了 git，你会需要做几件事情来定制你的 git 环境
  - 每台计算机上只需要配置一次，程序升级时会保留配置信息
  - 你可以在任何时候再次通过运行命令来修改他们
- git 自带一个 git config 的工具来帮助设置 git 外观和行为的配置变量
  - /etc/gitconfig 文件：包含系统上每一个用户及他们仓库的通用配置
    - 如果在执行 git config 时带上 --system 选项，那么它就会读写该文件中的配置变量
    - 由于他是系统配置文件，因此你需要管理员或超级用户的权限来修改它
  - ~/.gitconfig 或 C/用户/username/.gitconfig 文件（.git/config）：针对该仓库
    - 你可以传递--local 选项让 git 强制读取此文件，虽然默认情况下用的就是他

```txt
[user]
	name = dylan
	email = 466879168@qq.com
```

- 安装 git 后，要做的第一件事就是设置你的用户名和邮箱地址
  - 这一点很重要，因为每一个 git 提交都会使用这些信息，他们会写入到你的每一次提交中，不可更改
  - 如果使用了--global 选项，那么该命令只需要运行一次，因为之后无论你在该系统上做任何事情，git 都会使用设置的这些信息

```shell
git config --global user.name "dylan"
git comfig --global user.email "466879168@qq.com"
```

- 检查当前的配置信息：`git config --list`

![Snipaste_2023-10-24_11-49-48.png](https://s2.loli.net/2023/10/24/AxZluQ3PNehqpWE.png)

```shell
git config user.name
```

![Snipaste_2023-10-24_11-50-31.png](https://s2.loli.net/2023/10/24/bWDQ3wK2YxhXtBH.png)

### git 的命令（alias）

- git 并不会在你输入部分命令时自动推断出你想要的命令
  - 如果不想每次输入完整的 git 命令，可以通过 git config 文件来轻松的为每一个命令设置一个别名

```shell
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.cm commit
git config --global alias.br branch
```

## git 初始化本地仓库-git init/git clone

- 我们需要一个 git 来管理源代码，那么我们本地也需要有一个 git 仓库
- 通常有两种获取 git 项目仓库的方式
  - 方式一：初始化一个 git 仓库，并且可以将当前项目的文件都都添加到 git 仓库中（目前很多的脚手架在创建项目时都会默认创建一个 git 仓库）
  - 方式二：从其他服务器克隆一个已存在的 git 仓库
- 方式一：初始化 git 仓库
  - 该命令将创建一个名为.git 的子目录，这个子目录含有你初始化的 git 仓库中所有的必须文件，这些文件是 git 仓库的核心
  - 但是，在这个时候，我们仅仅是做了一个初始化的操作，你的项目里的文件还没有被跟踪

```shell
git init
initialized empty Git repository
```

- 方式二：从 git 远程仓库

```shell
git clone https://github.com/mengyang44253/dylan-cli.git
```

## git 记录更新变化过程

### 文件的状态划分

- 现在我们的电脑上已经有了一个 git 仓库：
  - 在实际开发中，你需要将某些文件交由这个 git 仓库来管理
  - 并且我们之后会修改文件的内容，当达成某一个目标时，想要记录下来这次操作，就会将它提交到仓库中
- 那么我们需要对文件来划分不同的状态，以确定这个文件是否已经归于 git 仓库的管理
  - 未跟踪：默认情况下，git 仓库下的文件也没有添加到 git 仓库管理中，我们需要通过 add 命令来操作
  - 已跟踪：添加到 git 仓库管理的文件处于已跟踪状态，git 可以对其进行各种跟踪管理
- 已跟踪的文件又可以进行细分状态划分
  - staged：暂缓区中的文件状态
  - Unmodified：commit 命令，可以将 staged 中文件提交到 git 仓库
  - Modified：修改了某个文件后，会处于 Modified 状态
- 在工作时，你可以选择性地将这些修改过的文件放入暂存区
- 然后提交所有已暂存的修改，如此反复

![第15页-21.PNG](https://s2.loli.net/2023/10/24/F3BToQ2MLH7AK1W.png)

### git 操作流程图

![第16页-22.PNG](https://s2.loli.net/2023/10/24/SpN3y2M9vYCXHfg.png)

### 检测文件的状态 - git status

- 我们在有 git 仓库的目录下新建一个文件，查看文件的状态：
- `git status`

![Snipaste_2023-10-24_15-04-46.png](https://s2.loli.net/2023/10/24/r31wzE2egdqMTZb.png)

- Untracked Files：未跟踪的文件
  - 未跟踪的文件意味着 git 在之前的提交中没有这些文件
  - git 不会自动将之纳入跟踪范围，除非你明明白白的告诉它我需要跟踪该文件
- 我们也可以查看更加简介的状态信息：
  - `git status -s`
  - `git status --short`

![Snipaste_2023-10-24_15-06-43.png](https://s2.loli.net/2023/10/24/AjpDdfSrmIsBXoz.png)

- 左栏指明了暂存区的状态，右栏指明了工作区的状态

### 文件添加到暂存区 - git add

- 跟踪新文件命令
  - `git add index.js`
  - 使用命令 git add 开始跟踪一个文件
- 跟踪修改的文件命令
  - 如果我们已经跟踪了某一个文件，这个时候修改了文件也需要重新添加到暂存区

![Snipaste_2023-10-24_15-06-43.png](https://s2.loli.net/2023/10/24/AVN3GQvOgI7HmWS.png)

- 通过 git add . 将所有的文件添加到暂存区中：
  - `git add .`

### git 忽略文件

- 一般我们总会有些文件无需纳入 git 的管理，也不希望他们总出现在未跟踪文件列表
  - 通常都是一些自动生成的文件，比如日志文件，或者编译过程中创建的临时文件
  - 我们可以创建一个名为.gitignore 的文件，列出要忽略的文件的模式
- 在实际开发中，这个文件通常不需要手动的创建，在必要的时候添加自己的忽略内容即可
- 比如一些常见的文件夹、本地环境变量、日志文件、编辑器自动生成的文件

### 文件更新提交 - git commit

- 现在的暂存区已经准备就绪了，可以提交了
  - 每次准备提交前，先用 git status 看下，你所需要的文件是不是都已暂存取来了
  - 在运行提交命令 git commit
  - 可以在 commit 命令后面添加 -m 选项，将提交信息与命令放在同一行
  - `git commit -m '提交信息'`
- 如果我们修改文件的 add 操作，加上 commit 的操作有点繁琐，那么可以将两个命令结合来使用

## git 远程仓库和验证

## git 的标签 tag 的用法

## git 分支的使用

## 工作中的 Git Flow

## git 远程分支的管理

## git rebase 的使用

## git 常见的命令
