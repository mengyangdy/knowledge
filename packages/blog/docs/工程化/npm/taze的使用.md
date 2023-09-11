---
title: taze的使用
tag:
  - taze
date: 2023-09-11
cover: https://s2.loli.net/2023/09/05/7r8UFMQuoc39da5.jpg
---

# taze 的使用

> 在制作 cli 的时候，想实现一个更新依赖的功能，本来想使用`npm-check-updates`这个包的，但是又搜到了`taze`这个由`antfu`大佬开源的包，优化了`check`这个包的缺点，所以还是用新的吧

## npm-check-upadtes的缺点

由于历史的原因，check包有如下的缺点：
- 不支持`monorepo`
- 无法在`major/minor/patch`模式之间切换

## taze安装

> A modern cli tool that keeps your deps fresh
> 一个现代的 cli 工具，让您的部门保持新鲜感

```bash
npm i taze -g
```

## 常用的命令

### 非monorepo模式


