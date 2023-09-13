---
title: vitepress常用的配置
tags:
  - vitepress
date: 2023-09-13
cover: https://s2.loli.net/2023/09/13/SoUbFK2qHeylRrd.jpg
---
# vitepress 常用的配置

## 基本配置

### 脚本命令

项目默认带有三个命令，分别是本地开发、打包、预览

```json
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs"
  }
```

本地开发的时候使用 `dev` 命令在本地启用了一个小型的服务器，我们可以在浏览器中使用 `localhost:3000` 进行访问

打包命令会在 `docs/.vitepress` 目录下生成一个 `dist` 文件夹，只有有 dist 文件夹后才可以执行 `preview` 预览命令

### 默认的首页配置信息

在首页的 md 文件中, 我们可以填写一些默认的配置，详情如下：
- `home:true`: 标记此页是否为首页
- `lang:zh-CN`: 本页面的语言为 zh-CN (简体中文)
- `heroText`：首页的标题
- `heroImage`：首页的标题图片，路径为 `docs/.vuepress/public/logo.jpg`，默认去 `public` 目录下找静态资源
- `actionText`：首页跳转按钮的内容
- `actionLink`：首页跳转按钮的路径
- `features`：首页的三栏流式布局的内容，固定的格式为 title+details
- `footer`：页面底部内容

### 导航栏

> 导航栏需要在. vitepress/config. ts 文件中进行配置

导航栏需要在 `themeConfig` 属性上进行配置 `nav` 字段，`nav` 字段需要两个属性 `text` 和 `link`，`text` 是导航的文字内容，`link` 是导航的链接。

没有下拉菜单的导航：

```javascript
themeConfig:{
  nav:[
	  { text: '首页', link: '/' },
	  { text: 'ablot', link: '/about' },
  ]
}
```

有下拉菜单的导航：

只需要配置下 `items` 属性即可成为下拉菜单：

```javascript
themeConfig:{
  nav:[
     {
        text: "大前端",
        items: [
          {
            text: "HTML",
            link: "/大前端/html/",
          },
        ],
      },
      {
        text: "工程化",
        items: [
          {
            text: "vite",
            link: "/工程化/vite/",
          },
        ],
      },
  ]
}
```

### 侧边栏

自动生成侧边栏：

```json
themeConfig:{
	sidebar:'auto'
}
```

侧边栏分组展示：

```json
themeConfig:{
	sidebar:[
		{
		    title:"前端",
		    // false为展开这个分组，true为折叠这个分组
		    collapsable:false,
		    children:[
			    '/css/',
			    '/html/',
			    '/javascript/'
		    ]
		}
	]
}
```

禁用侧边栏：

```md
//某一个文件
---
// 开启
sidebar:auto
// 禁用
sidebar:falle
---
```

### 最后更新时间

> 最后更新时间默认不开启，这个时间是基于 git 提交的时间戳来进行转换的

最后更新时间的属性是 `lastUpdated`，默认是 `false`，改为 `true` 即可开启

```json
export default{
  lastUpdated:true
}
```

这个时候我们去页面上看发现是英文的 `last updated` 而不是中文的，我们还需要再 `themeConfig` 中配置 `lastUpdatedText` 字段：

```json
  themeConfig: {
    lastUpdatedText: "上次更新于",
  }
```

### 上一篇和下一篇

上一篇和下一篇通过配置 md 文档中的 `yaml` 的 `prev` 和 `next` 来显示配置，文字和导航地址一样即可：

```md
--- 
prev: /HTML/ 
next: /JavaScript/ 
---
```

### git 仓库和编辑链接

在文章末尾有一个链接需要导航到我们的 gitgub 仓库，我们也需要在 `themeConfig` 中配置：

```JavaScript
themeConfig: {
    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
```

path 就是我们当前页面对应的文件，我们只需要把前面的路径修改为自己的即可，text 为页面展示的点击文本。

