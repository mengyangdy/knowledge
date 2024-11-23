---
title: 如何配置Babel以转译ES6+代码为向后兼容的JavaScript代码?
tags:
  - 构建打包工具
  - 面试题
date: 2024-05-29
---
# 一如何配置Babel以转译ES6+代码为向后兼容的JavaScript代码?

配置 Babel 以转译 ES6+ 代码为向后兼容的 JavaScript 代码通常涉及以下几个步骤：

## 1.1 安装必要的依赖

首先，确保你已经安装了 Node.js。然后，在你的项目根目录下初始化一个新的 `package.json` 文件（如果还没有的话）：

```bash
npm init -y
```

接下来，安装 Babel 的核心库以及预设（presets）和插件（plugins）。常用的预设 `@babel/preset-env` 能够根据目标环境自动选择需要的转换规则。如果你的项目中还包含了 JSX 代码，还需要安装 `@babel/preset-react`。安装命令如下：

```bash
npm install --save-dev @babel/core @babel/preset-env
# 如果你的项目使用了 JSX，还需安装：
npm install --save-dev @babel/preset-react
```

## 1.2 创建 Babel 配置文件

创建一个名为 `.babelrc`（或者使用 `babel.config.js` 或者 `babel.config.cjs`，具体取决于你的 Babel 版本和偏好）的配置文件在项目根目录下。在这个文件中，你可以指定 Babel 应使用的预设和插件。

一个基本的 `.babelrc` 文件内容如下：

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["> 1%, last 2 versions, not dead"]
        },
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ],
  "plugins": []
}
```

在这个例子中，`@babel/preset-env` 预设被配置为针对覆盖至少1%市场份额的浏览器以及最近两个版本的浏览器进行转译，并排除已废弃的浏览器。`useBuiltIns: "usage"` 和 `corejs: 3` 的设置意味着 Babel 将按需引入 `core-js` 的 polyfills，仅当你在代码中使用到需要它们的特性时。

## 1.3 使用 Babel 转译代码

你可以直接在命令行中使用 `babel` 命令手动转译文件，或者在构建工具（如 Webpack、Gulp 或 Rollup）中集成 Babel。

### 1.3.1 手动转译示例：

安装 `@babel/cli` 以在命令行中使用 Babel：

```bash
npm install --save-dev @babel/cli
```

然后转译整个目录下的 `.js` 文件：

```bash
npx babel src --out-dir dist
```

这里，`src` 是你的源代码目录，`dist` 是转译后输出的目录。
### 1.3.2 在 Webpack 中集成 Babel：

安装 `babel-loader`：

```bash
npm install --save-dev babel-loader @babel/preset-env
```

然后，在你的 `webpack.config.js` 文件中配置 loader：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
  // ...
};
```

这样配置之后，Webpack 在打包时就会自动使用 Babel 转译你的 JavaScript 代码了。

以上步骤概括了配置 Babel 以转译 ES6+ 代码的基本流程。根据项目的具体需求，你可能还需要安装额外的插件或调整配置。
