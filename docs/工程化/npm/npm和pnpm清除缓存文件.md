---
title: npm和pnpm清除缓存文件
tags:
  - npm
  - pnpm
date: 2023-09-12
cover: https://s2.loli.net/2023/09/12/Icw6mLTa9AHrMNl.jpg
---

# npm 和 pnpm 清除缓存文件

## Npm 清除缓存

### 查看缓存路径

```shell
npm config get cache
```

## Yarn 清除缓存

### 查看缓存列表

```bash
yarn cache list
```

### 查看缓存路径

```bash
yarn cache dir
```

### 清除缓存

```bash
yarn cache clean
```

## Pnpm 清除缓存

### 查看缓存路径

要查看 pnpm 的缓存路径，可以执行一下命令：

```bash
pnpm store path
```

> 您可以手动删除该路径下的文件，以清除 pnpm 的缓存。注: 请注意，删除缓存文件后，pnpm 可能会在未来的安装过程中速度变慢，因为它需要重新下载被删除的文件

### 清除缓存

执行如下命令：

```bash
pnpm store prune
```
