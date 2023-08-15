---
title: 使用vitepress创建博客并自动部署
tag: 博客
description: 本篇文章将代理大家从0到1搭建vitepress博客，并且使用Github Actions部署到阿里云oss上
cover: https://s2.loli.net/2023/08/14/LBN8qORPXKHrc5j.jpg
---

# 使用vitepress创建博客并自动部署

## 项目搭建
首先先创建一个目录并进入：
```bash
mkdir vitepress-blog && cd vitepress-blog
```
接着使用包管理工具pnpm对项目进行初始化：
```bash
pnpm init
```
对`package.josn`进行修改，添加对`ESModule`支持：
```json
"name": "vitepress-blog",
"version": "1.0.0",
"description": "",
"type": "module",
```
项目初始化后，使用pnpm将vitepress安装为开发依赖：
```bash
pnpm add vitepress -D

# 如果使用的是pnpm作为包管理工具的话，需要在package.json中添加以下代码
# 主要作用是消除警告

"pnpm": {
  "peerDependencyRules": {
    "ignoreMissing": [
      "@algolia/client-search",
      "search-insights"
    ]
  }
}
```
vitepress附带了一个命令行的向导，来帮助我们构建一个简单的项目：
```bash
pnpm dlx vitepress init
```
命令执行后有几个选项：<br />![](https://s2.loli.net/2023/08/12/pnmVZthPKDAzU9B.png#id=W7yhg&originHeight=486&originWidth=541&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />只需将第一个设置为`./docs`即可，意思是将vitepress配置文件等放在这个目录下面，其他选项默认即可。<br />生成的目录结构为：
```
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ api-examples.md
│  ├─ markdown-examples.md
│  └─ index.md
└─ package.json
```
到这里我们的项目就已经创建好了，运行`pnpm run docs:dev`即可在浏览器看到项目了。
> 注：我把`package.json`中的vitepress命令从`docs:dev`改为了`dev`，`build`命令和`preview`同样更改了

![](https://s2.loli.net/2023/08/12/TjFWRUdXZ3gi89M.png#id=YLbaB&originHeight=882&originWidth=1471&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />记得添加`.gitignore`文件，将`node_nodules`、`docs/.vitepress/dist`、`docs/.vitepress/cache`文件夹忽略
<a name="IAltr"></a>
## Github Page部署

<a name="FhGHn"></a>
## 阿里云OSS部署
默认已经有域名和SSL证书了。
<a name="Mz5jz"></a>
### 创建OSS
进入阿里云对象存储OSS控制台，点击`创建Bucket`，区域选择`中国香港`（国内节点绑定自定义域名需要备案，香港的不需要），读写权限选择公共读。<br />![](https://s2.loli.net/2023/08/12/nYOqhXCMSdbUN3x.png#id=BOnf1&originHeight=803&originWidth=1432&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />创建完成之后，点击进入刚创建的存储桶，点击`数据管理->静态页面`，设置首页和404页面<br />![](https://s2.loli.net/2023/08/12/EG5IFqOtmAQXei1.png#id=BuT7q&originHeight=587&originWidth=1223&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />在`Bucket配置->域名管理`，绑定自定义域名<br />![](https://s2.loli.net/2023/08/12/s9Ylu3LXP28ISmO.png#id=NSxb0&originHeight=667&originWidth=1420&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="U7d4z"></a>
### 创建Accesskeys
阿里云控制台鼠标悬浮头像，选择`AccessKeys管理`，点击`创建AccessKey`，获取到`AccessKeyID`和`AccessKeySecret`<br />![](https://s2.loli.net/2023/08/12/AtHdBVybzMkhsDC.png#id=QxklU&originHeight=421&originWidth=328&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />如果Github没有这个项目的仓库，需要先创建仓库，把id和secret设置到这个仓库的`Secrets and variables`里面的`Actions`<br />![](https://s2.loli.net/2023/08/12/J5CIpMvbmkAq1hz.png#id=m7EmZ&originHeight=810&originWidth=1334&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="z3DMA"></a>
### 创建Github Action自动部署脚本

1. 创建脚本文件
```shell
# 使用mkdir创建目录(windows可以手动建）
mkdir -p .github/workflows
# 使用touch 创建配置文件，名称随意，后缀名为 ".yml" （window可以手动建立文件）
touch oss.yml
```
workflows下面的每一个文件就是一个工作流，可以有多个，都会执行。

2. 编写脚本
```shell
# workflow的名称，会显示在工作流运行页面
name: upload to Ali OSS
# 触发事件：push到master分支的时候出发这个工作流
on:
  push:
    branches:
      - master
jobs:
  deploy:
    name: 部署到阿里云对象存储
    # 部署的一个虚拟环境
    runs-on: ubuntu-latest
    # 步骤 可以有多个步骤
    steps:
      - name: 更新代码/获取源码
        # uses是使用action的意思 我们可以使用别人编号的action引入到这里直接使用，不用自己再书写
        # actions/checkout@master actions开头的是官方编写的action 这个action的意思是获取到源码
        # 如果想查找别人写好的action 可以去官方的action市场查找：https://github.com/marketplace?type=actions
        uses: actions/checkout@master

      - name: 安装Node
        # 在我们上面runs-on部署的虚拟环境上安装node 后面的@v3 是第三个版本 v1是node12版本 v2是16版本 当前我本地使用的是18版本，所以用的v3,如果以后版本不合适了请前往上面的官方action库查找有没有v4 v5版本
        uses: actions/setup-node@v3
        with:
          # 锁定下node版本
          node-version: "18"

      - name: 构建HTML
        # 这里就是安装依赖 执行build打包，这里的要和package.json定义的scripts名称一致，如果是docs:build的话 请修改下面命令
        run: |
          npm i
          npm run build

      - name: 连接OSS
        # 使用别人写好的action来连接oss
        uses: manyuanrong/setup-ossutil@v3.0
        with:
          # 地域节点，在控制台查看
          # https://help.aliyun.com/zh/oss/user-guide/regions-and-endpoints
          endpoint: oss-cn-hongkong.aliyuncs.com
          # 这里就是我们刚才在仓库的Secrets and variables里面设置的id和secret名字，设置的时候定义的什么名字 这里就用什么
          access-key-id: ${{ secrets.OSS_ACCESS_KEY_ID }}
          access-key-secret: ${{ secrets.OSS_ACCESS_KEY_SECRET }}

      - name: 发布到OSS
        # 固定的写法 ossutil cp -rf 要上传的文件夹 oss://存储桶名字
        run: ossutil cp -rf docs/.vitepress/dist/ oss://vitepress-blog

```

