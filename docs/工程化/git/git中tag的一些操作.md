---
title: git中tag的一些操作
tags:
  - git
  - tag
date: 2023-09-09
cover: https://s2.loli.net/2023/09/29/R3NMgTX2dAGsjWz.jpg
---

# git 中 tag 的一些操作

## tag 的作用

> tag 是 git 仓库里面某分支某次 commit 的一个标记，本质上是 commit 的一个别名

## tag 的使用

### 1. 查看本地所有的 tag

```bash
git tag
# or
git tag -l
```

### 2. 查看仓库所有的 tag

```bash
git ls-remote --tags origin
```

### 3. 创建本地 tag

```bash
git tag -a <标签名> -m '标签内容的文字描述'
```

### 4. 创建仓库 tag

将本地的 tag 推送到仓库就是仓库的 tag

```bash
git push origin <标签名>
```

如果本地的 tg 比较多，可以一次全部推送

```bash
git push origin --tags
```

### 5. 为某个 commit 打 tag

> 提交代码后，忘了打 tag，后面又有提交了之后，需要给上一次的提交打上 tag

查看当前分支的提交历史，里面包含了 commit id

```bash
git log --pretty=oneline
git tag -a <标签名>
# or
git tag -a <标签名> <commitId> -m '标签内容的文字描述'
```

### 6. 删除本地 tag

```bash
git tag -d <标签名>
```

### 7. 删除仓库的 tag

```bash
git push origin :refs/tags/<标签名>
```

### 将代码切换到某个标签

```bash
git checkout -b <tagName>
```
