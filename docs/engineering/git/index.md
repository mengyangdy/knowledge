---
title: 工作中常用的一些git命令
tag: git
cover: https://s2.loli.net/2023/08/15/XrUdNqOIHRkFb4D.jpg
---

# 工作中常用的一些git命令

<a name="s6vIa"></a>
## 初始化仓库
```bash
git init
``[index.md](..%2F..%2FfrontEnd%2Fvitepress%2Findex.md)`

<a name="n2MyU"></a>
## 本地连接远程仓库
```bash
git remote add origin https://gitee.com/mengyang94982/git-demo.git
git push -u origin "master"
```

<a name="ZT4QS"></a>
## 新建分支
```bash
git checkout -b dev

# 它是下面两条命令的简写
git branch dev
$ git checkout dev
```

<a name="ZDDyQ"></a>
## 新建的分支与远程关联
```bash
# 这里只是在远程创建一个dev分支 本地的dev分支和远程的dev分支并未关联
git push origin dev:dev

# 本地分支与远程关联
git push -u origin dev
# -u 是--set-upstream的缩写
```

<a name="xQneI"></a>
## 将dev分支修改合并到master分支
```bash
git checkout master
git merge dev
```

<a name="aEchf"></a>
## 删除本地分支与远程分支
```bash
# 确保当前分支不再要删除的分支上
# 切换分支
git checkout master

# 如果分支已经合并
git branch -d dev

# 强制删除分支
git branch -D dev

# 删除远程的分支
git push origin --delete dev

# 更新本地的远程跟踪分支列表
git fetch -p
```

