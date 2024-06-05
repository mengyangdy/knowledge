---
title: 如何使用Webpack来处理css和sass?
tags:
  - 构建打包工具
  - 面试题
date: 2024-05-29
---
# 一 如何使用Webpack来处理css和sass?

> 使用Webpack处理CSS和SASS主要涉及到配置合适的loaders，这些loaders会将非JavaScript资源转换为Webpack可以理解的模块。以下是基本步骤，以Webpack 5为例，展示如何设置以处理CSS和SASS文件：

## 1.1 安装必要的依赖

首先，确保你的项目中已经安装了Webpack以及相关的loader。如果没有，可以通过npm或yarn安装以下依赖：

```bash
npm install webpack webpack-cli css-loader style-loader sass-loader node-sass webpack-dev-server --save-dev
# 或者使用Yarn
yarn add webpack webpack-cli css-loader style-loader sass-loader node-sass webpack-dev-server --dev
```

注意：`node-sass` 是 `sass-loader` 的一个依赖，用于编译SASS到CSS。如果你更倾向于使用Dart Sass，可以直接安装 `sass` 而不是 `node-sass`。

## 1.2 配置Webpack

接下来，在你的项目根目录下创建或修改 `webpack.config.js` 文件，添加对CSS和SASS的支持：

```js
const path = require('path');

module.exports = {
  mode: 'development', // 根据需要可以切换到 'production'
  entry: './src/index.js', // 你的主入口文件
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 匹配 .css 文件
        use: ['style-loader', 'css-loader'] // 使用这两个loader处理CSS
      },
      {
        test: /\.(sa|sc)ss$/, // 匹配 .sass 和 .scss 文件
        use: ['style-loader', 'css-loader', 'sass-loader'] // 使用这三个loader处理SASS
      }
    ]
  },
  devServer: {
    contentBase: './dist' // 开发服务器的根目录
  }
};
```

## 1.3 使用CSS和SASS

现在，你可以在JavaScript文件中直接导入CSS和SASS文件了：

```js
// 在你的JS文件中，比如index.js
import './styles/main.css'; // 导入CSS文件
import './styles/main.scss'; // 导入SASS文件
```

## 1.4 构建和开发

- **开发模式**：使用Webpack的开发服务器实时查看更改。

```js
npx webpack serve --open
# 或者如果你使用Yarn
yarn webpack serve --open
```

- **生产构建**：当准备部署到生产环境时，切换到production模式并构建。

```js
npx webpack --mode production
# 或者如果你使用Yarn
yarn webpack --mode production
```

以上步骤应该能让你成功地使用Webpack处理CSS和SASS文件。根据具体需求，你还可以进一步配置，比如使用`MiniCssExtractPlugin`将CSS从JS中分离出来生成单独的CSS文件，或者利用`postcss-loader`和`autoprefixer`自动添加浏览器前缀等。

