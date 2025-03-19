---
title: git保姆级教程
description: 系统讲解Git从入门到进阶的使用技巧，涵盖常用命令、分支管理、版本控制核心概念及实战操作，提供交互式学习工具推荐，助力开发者高效掌握代码协作与版本管理
tags: [git]
date: 2025-03-18
---

## 常用命令

掌握以下常用的命令就可以在项目中应对90%以上的需求了，可以看下[](https://www.atlassian.com/zh/git/glossary#commands)这个网站的教程

1. git init
2. git clone
3. git config
4. git branch
5. git checkout
6. git status
7. git add
8. git commit
9. git push
10. git pull
11. git log
12. git tag
13. .gitignore

### git init

> 创建新文件夹，初始化git仓库

```bash
git init
```

### git clone

> 从服务器上拉取代码克隆到本地

```bash
git clone https://github.com/mengyangdy/knowledge
```

### git config

> 配置开发者的用户名和邮箱以及代理等

```bash
git config user.name "mengyang"
git config user.email "466879168@qq.com"

# http代理
git config --global http.proxy "http://127.0.0.1:7890"
git config --global https.proxy "https://127.0.0.1:7890"

## 代理服务使用SOCKS4/SOCKS5协议
git config --global http.proxy "socks5://127.0.0.1:socks5端口号"
git config --global https.proxy "socks5://127.0.0.1:socks5端口号"

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy

# 查看当前的git配置
# git config --global --list
```

### git branch

> 创建、重命名、查看、删除分支，项目开发中我们都是在开发分支上开发，开发完毕后合并到主分支上

```bash
git branch
```

不带参数的branch命令可以列出当前项目的分支列表

```bash
git branch develop
```

创建一个名为`develop`的分支

```bash
git branch -m develop dev
```

如果觉得之前的分支名不太合适就可以使用-m命令来修改分支名称

```bash
git branch -d dev
```

如果分支已经开发完成了可以通过`-d`参数来把这个分支给删除了

### git checkout

> 常用于切换分支

```bash
git checkout dev
```

从当前分支切换到dev分支

```bash
git checkout -b test
```

创建一个新的分支`test`并且切换到`test`分支

```bash
git checkout -f test
```

强制切换，忽略未提交的更改

### git status

> 查看文件的变动状态

```bash
git status
```

通过status命令可以看到我们修改的文件当前在什么区域

### git add

> 添加修改的文件到暂存区

```bash
git add file.vue
```

如果使用指定文件名的话就是将这一个文件提交到暂存区，如果想添加所有的文件可以使用`git add .`命令

### git commit

> 提交修改的文件到版本区

```bash
git commit -m '提交的原因'
```

通过`-m`这个参数可以在命令行中输入我们的提交原因

### git push

> 将本地修改的代码推送到服务器上

```bash
git push 

git push origin master

# -u参数与--set-upstream参数一个意思 如果本地新建分支远程没有这个分支就用这个命令
git push --set-upstream origin v1
```

origin是远程仓库的默认名字

### git pull

> 将服务器上的最新代码拉取到本地

```bash
git pull origin master
```

如果有其他的项目成员对项目进行了更改变提交到了远程服务器，这个时候我们就需要将更新同步到本地

### git log

> 查看版本的提交记录

```bash
git log
```

通过log命令我们可以查看整个项目的提交记录

### git tag

> 为项目设置标签

```bash
# 轻量标签
git tag v1.0.0

# 附注标签
git tag -a v1.0.0 -m "release version"

# 列出所有标签
git tag

# 推送单个标签到远程
git push origin v1.0.0

# 推送所有本地未同步的标签
git push origin --tags

# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
```

### .gitignore

> 设置哪些内容不需要推送到服务器，一般是在项目的根目录中

```markdown
node_modules/
build
.next
.vscode
```

## 深入理解

### 基本的概念

#### 工作区(workspace)

工作区就是我们在电脑上能看到的一个包含了.git文件的文件夹，这个就是工作区

#### 暂存区(staging area)

暂存区是位于Git本地仓库的一个中间区域，它相当于一个缓冲区，用于存储想要提交到版本库的修改

#### 本地版本库(local repository)

工作区有一个隐藏目录`.git`这个就是本地的版本库

#### 远程版本库(Remote Repository)

一般就是我们git所对应的远程仓库

![](http://cdn.mengyang.online/20250318145026123.png)

#### 分支

分支是为了将修改记录的整个流程区分开来存储，让各个分支都不会受到其他分支更改的影响，所以我们一个项目可以几个几十个人同时修改一个项目

![](http://cdn.mengyang.online/20250318151558977.png)

#### 主分支

当我们创建一个git仓库的时候`git`自动为我们创建的第一个分支就是主分支，其他分支开发完成后都是要合并到master

![](http://cdn.mengyang.online/20250318151912360.png)

#### 标签

标签是用来标记特定的点或者是提交的记录，通常是在版本发布的时候标记版本的

#### HEAD

HEAD就是当前活跃分支的游标，也就是说你现在在哪，HEAD就指向了哪，当然HEAD并非只能指向分支的最前端，也可以指向任何一个节点，它就是Git内部用来追踪当前位置的一个东西

而小写的head是什么呢？head就是你每个分支的最新的一次提交

### git commit 

直接提交多行的内容：

```bash
git commit -m '第一行提交内容' -m '第二行提交原因'
```

将暂存区`修改`或`删除`的内容提交到本地版本库，`新增`的文件不会被提交

```bash
git commit -am '提交原因'
```

修改最新一条提交记录的提交原因

```bash
git commit -amend -m '提交原因'
```

将当前文件改动提交到 HEAD 或当前分支的历史ID

```bash
git commit -c HEAD
```

### git merge

> 将两个分支或者多个分支的历史记录合并在一起

### git reset

如果我们的项目使用了`git add .`将文件从工作区存储到暂存区中该怎么重置呢？

```bash
git reset HEAD .
```

如果我们的项目使用了`git commit -m '提交记录'`将文件从暂存区存储到Git本地仓库了该怎么重置呢？

```bash
# 将文件从暂存区取出来  但是还是在git add 的状态
git reset --soft HEAD^

# 将文件从暂存区中取出来，回到git add.之前的状态
git reset HEAD^

# 将文件恢复到上一次提交的状态， 所有的修改都不见
git reset --hard HEAD^
```

如果已经提交到远程仓库的话怎么重置呢？

```bash
git reset --hard <commit_id>
```

### git switch

> `git switch`是一个新的命令，用来切换分支

分支切换：从当前分支切换到develop分支

```bash 
git switch develop
```

创建新分支：创建feature-branch分支

```bash
# 创建分支
git switch feature-branch

# 创建并切换分支
git switch -c feature-branch
```

快速切换到上次访问的分支：

```bash
git switch -
```


