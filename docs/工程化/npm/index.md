---
title: pnpm + workspace 搭建 monorepo 项目
tag:
  - pnpm
  - workspace
  - monorepo
date: 2023-08-27
cover: https://s2.loli.net/2023/08/27/HJI8cYkWluUBEh4.jpg
---

# pnpm + workspace 搭建 monorepo 项目

## 搭建项目

### 安装pnpm

```bash
npm install -g pnpm
```

### 项目初始化

在项目根目录中新建`pnpm-workspace.yaml`文件，里面写入以下内容，将packages下的所有文件当做子工程：

```json
packages:
- 'packages/*'
```

为了演示，先在项目根目录中创建packages目录，并在packages中创建两个文件夹pkg1和pkg2，这两个文件夹就代表着两个不同的工程。分别在这两个文件夹中使用`pnpm init`
初始化项目，并在package.json中的name字段命名为`@组织名/pkg1`（组织为npm上创建的）。

如果使用ts开发的话安装ts使用tsc初始化下tsconfig.json文件。具体内容等以后cli的文章讲解。

我们发包的话只需要将pkg1和pkg2发布出去，为了防止根目录被发布出去，需要在根目录中package.json中配置`private`为`true`

### 安装依赖包

在workspace中安装包分为以下几种情况：

#### 全局包

- 全局的公共依赖包，比如说打包用的`rollup`、`unbuild`、`typescript`等等

pnpm中提供了[#-w, --workspace-root](https://pnpm.io/zh/pnpm-cli#-w---workspace-root)
参数，不管node目录是在哪个子包中，带上这个参数会将依赖安装到项目的根目录中，作为所有的package的公共依赖使用。
比如：

```bash
pnpm install/add unbuild typescript -w
```

这个命令会将依赖安装到生产依赖中，如果需要安装的是一个开发依赖，可以加上`-D`这个参数,会把依赖安装到`package.json`
中的`devDependencies`中：

```bash
pnpm add rollup -wD
```

#### 给package中某个项目安装

`pnpm`提供了[--filter](https://pnpm.io/zh/filtering)命令，允许将命令限制到特定的一个子集。比如：给pkg1安装`commander`:

```bash
pnpm add cpmmander --filter @dylan/pkg1
```

`@dylan/pkg1`这个参数为子包的package.json中的`name`属性的值。

#### 子包之间的互相依赖

这种也是我们开发中常用到的场景，比如pkg1中将pkg2作为依赖安装：

```
pnpm install @dylanjs/pkg2 --filter @dylanjs/pkg1
```

此时我们查看`pkg1`的`package.json`中的`dependencies`中已经有`pkg2`了

设置依赖的时候我们可以使用`workspace:*`,这样就可以使用最新的版本了，不需要每次都手动的修改版本，当执行`npm publish`
命令的时候，会自动将`pckage.json`中的`workspace`修改为正确的版本。
