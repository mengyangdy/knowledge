---
title: vue和vite源码中使用的库
tags:
  - vite
  - vue
date: 2023-11-02
cover: https://s2.loli.net/2023/11/02/oYhr3A8puyP1GKm.jpg
---

# vue 和 vite 源码中使用的库

## picocolors

- picocolors 是一个可以在终端修改输出字符样式的 `npm` 包，就是给字符添加颜色

与之相似的就是 `chalk`，但是 `picocolors` 有以下几点优势：

- 无依赖包
- 比 chalk 体积小，速度快
- 支持 CJS 和 ESM 项目

## prompts 和 enquirer 和 inquirer

三者都是用来 `实现命令行交互式界面` 的工具，`vite` 使用的是 `prompts`，vue 3 使用的是 `enquirer`，自己的项目使用 `inquirer` 也是完全足够的

## cac

`cac` 是一个用于构建 CLI 应用程序的 JS 库，就是用来给 cli 工具添加一些自定义的命令，比如 `vue create`，create 这个命令就是通过 cac 添加的。

相似的工具还有：`commander` 和 `gargs`，但是 `cac` 的优势为：

- 轻量级，体积非常小
- 易于学习，使用 `cli.option` / `cli.verson` / `cli.help` / `cli.parse` 即可实现大多数需求
- 功能强大，启用默认命令，可以像使用 git 的命令一样方便去使用它，且有参数和选项的校验、自动生成 help 等完善功能

## npm-run-all

按照顺序执行多个 `npm` 的脚本，主要是用来解决 `npm run clean && npm run build:css && npm run build:js && npm run build:html` 这么长的命令，可以通过 `npm-run-all` 的库简化为 `npm-run-all clean build:*`

- `npm-run-all`:
  - 可以带 `-s` 和 `-p` 参数的简写，分别对应的是串行和并行

```shell
# 依次执行这三个任务命令
npm-run-all clean lint build

# 同时执行这两个任务命令
npm-run-all --parallel lint build

# 先串行执行 a 和 b, 再并行执行 c 和 d
npm-run-all -s a b -p c d
```

- run-s：为 `npm-run-all --serial` 的缩写
- run-p：为 `npm-run-all --parallel` 的缩写

## semver

- `semver` 是一个语义化版本号管理的 `npm` 库，使用的场景是提醒用户不同版本号不同的情况，判断用户版本号过低，`semver` 内置了很多方法，比如判断一个版本是否合法，判断版本命名是否正确，两个版本谁大谁小等等

```shell
const semver = require('semver')

semver.valid('1.2.3') // '1.2.3'
semver.valid('a.b.c') // null
semver.clean('  =v1.2.3   ') // '1.2.3'
semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3') // true
semver.gt('1.2.3', '9.8.7') // false
semver.lt('1.2.3', '9.8.7') // true
semver.minVersion('>=1.0.0') // '1.0.0'
semver.valid(semver.coerce('v2')) // '2.0.0'
semver.valid(semver.coerce('42.6.7.9.3-alpha')) // '42.6.7'
```

## minimist

`minimist` 是一个命令号参数解析的工具

```js
const args = require('minimist')(process.argv.slice(2))
```

```js
# 执行以下命令
vite create app -x 3 -y 4 -n5 -abc --beep=boop foo bar baz

# 将获得
{ _: [ 'foo', 'bar', 'baz' ],
  x: 3,
  y: 4,
  n: 5,
  a: true,
  b: true,
  c: true,
  beep: 'boop' }
```

## fs-extra

`fs-extra` 是一个强大的文件操作库，是 Node.js fs 模块的增强版。

## fast-glob

`fast-glob` 是一个快速批量导入、读取文件的库

- `*` ：匹配除斜杆、影藏文件外的所有文件内容
- `**`：匹配零个或多个层级的目录
- `?`：匹配除斜杆以外的任何单个字符
- `[seq]`：匹配 `[]` 中的任意字符 seq
