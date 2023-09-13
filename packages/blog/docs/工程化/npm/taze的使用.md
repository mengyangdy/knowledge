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

### 非 monorepo 模式

#### Taze

Taze 默认只匹配 `minor/patch`，也就是主版本号是不会匹配的

![](https://s2.loli.net/2023/09/13/7Pvb3mxhgSJBuXD.png)

我们可以看到打印的信息是非常全面的，包含了当前版本是多少年以前的，最新的 `minor` 版本是多少时间以前更新的，最新的大版本是多少等等。

#### Taze major

匹配 `major` 版本的更新记录

![](https://s2.loli.net/2023/09/13/1DlGbpSevOqfMEL.png)

#### Taze minor

匹配 `minor` 版本的更新记录

![](https://s2.loli.net/2023/09/13/lJPXVWHbgwUmRi1.png)

#### Taze patch

匹配 `patch` 的更新记录

![](https://s2.loli.net/2023/09/13/XEKGIC9lRmNQFBP.png)

#### 更新依赖

以上的几个命令都只是查看依赖的更新状况，如果要执行更新的话，只需在各个命令后面加上 `-w` 即可。

![](https://s2.loli.net/2023/09/13/W6BHfvJrVqoz2nR.png)

### Monorepo 模式

#### 检查依赖更新

> 命令只需后面追加 `-r` 即可

```bash
taze major -r
```

#### 执行更新

后面追加 `-w` 即可

```bash
taze major -r -w
```

### 选择更新哪些依赖

上下+空格键切换选择

```bash
taze -I
```

### 只匹配 dependencies

```bash
taze -P
```

### 只匹配 devDependencies

```bash
taze -D
```

### Include 包含哪些依赖

```bash
taze major -n vue
```

### 去除哪些依赖

```bash
taze major -x eslint
```

### 更新 package.Json 后立即安装

```bash
taze -w -i
```

## 配置文件

```javascript
import { defineConfig } from 'taze'

export default defineConfig({
  // 忽略某个包
  exclude: [
    'webpack'
  ],
  // 获取最新的包信息，而不是从缓存中
  force: true,
  // 修改package.json
  write: true,
  // 修改后使用npm install 或yarn install立即安装
  install: true,
  // 为每个包使用不同的更新模式
  packageMode: {
    'typescript': 'major',
    'unocss': 'ignore',
    '/vue/': 'latest'
  }
})
```
