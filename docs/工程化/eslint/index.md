---
title: ESLint常用的配置
tags:
  - eslint
date: 2023-09-13
cover: https://s2.loli.net/2023/09/13/AR3YBuNesrpClGc.jpg
---

# ESLint 常用的配置

## 什么是 ESLint

[ESLint](https://zh-hans.eslint.org/) 是一个代码检查工具，用于帮助我们识别和报告 `JavaScript` 代码中潜在的问题和不一致之处，它会分析代码、检查错误、检查编码风格和潜在的 `bug`，然后提供警告和错误信息，帮助我们编写更干净的、高质量的代码。

我们可以定义自己的规则、加载各种定义好的规则集，来定制属于自己的自定义 `ESLint`，统一团队的编码风格。

## ESLint 的好处

- `代码质量提升`
- `编码风格统一`
- `更早的错误检测`
- `提高开发效率`

## 安装 ESLint

```bash
pnpm install eslint -D
```

## VSCode 保存自动修复

```json
"eslint.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": true
  }
```

## 配置文件

我们可以手动的创建配置文件进行配置，也可以使用 `init` 命令进行初始化配置。

```
npx eslint --init
```

按照提示就可以生成配置文件：

```bash
（1）How would you like to use ESLint?  //怎样使用eslint呢？
To check syntax only  //只检查语法
To check syntax and find problems //检查语法并查找错误
To check syntax, find problems, and enforce code styles //检查语法找到错误并且强制执行

（2）What type of modules dos your project use?  //项目使用的模块是那种？
JavaScript modules //es6模块
CommonJS  //commonJS模块
None of these  //都不使用

（2）Which framework does you project use?  //项目使用那个框架？
React
Vue.js
None of these  //都不使用

（4）Does your project use TypeScript? //是否在项目中使用typescript
yes/no

（5）Where does you code run? //项目在那种环境中运行？
Browser //浏览器
Node  //node

（6）How would you like to define a styles for your project? //喜欢用什么风格的代码?
Use a popular styles guide //使用一个市面上主流的风格
Answer questions about your styles //通过问题回答 形成一个风格

（7）Which styles guide do you want to follow? //想使用那种风格的？
Standard: https://github.com/standard/eslint-config-standard-with-typescript
XO: https://github.com/xojs/eslint-config-xo-typescript

（8）What format do you want your config file to be in? // eslint配置使用那种文件？
JavaScript
yaml
json
```

如果我们的项目中的 `package.json` 的 `"type":“module”` 时，后缀要使用 `.eslintrc.cjs`

我们也可以不适用配置文件，直接的 `package.json` 文件中添加 `eslintConfig` 字段进行 `eslint` 配置

```json
{
  "name": "demo",
  "version": "1.0.0",
  "devDependencies": {
    "eslint": "^8.49.0"
  },
  "eslintConfig": {
    "plugins": [],
    "env": {}
  }
}
```

配置文件格式不太一样，但是 `ESLnt` 只会使用一个配置文件，优先级如下：

```bash
.eslintrc.js
.eslintrc.cjs
.eslintrc.yaml
.eslintrc.yml
.eslintrc.json
package.json
```

## 忽略指定的文件和目录

如果项目中有些文件或者目录不希望让 `ESLint` 做校验，可以在跟目录下创建 `.eslintignore` 文件，来让 `ESLint` 跳过这些文件的校验。

```bash
dist/*
public/*
```

如果文件中的某一行或者整个文件都不需要 `ESLint` 校验的话，可以这样写：

```JavaScript
/* eslint-disable */  在文件的最顶部 整个文件都不校验
console.log('a')

/* eslint-enable */  被注释包裹的代码不被校验
console.log('a')
/* eslint-enable */

/* eslint-disable no-console */
console.log('a')  全局针对指定规则进行禁用
// 只针对当前行 eslint-disable-next-line 后跟规则
console.log('a')// eslint-disable-next-line no-console
// eslint-disable-next-line no-console
console.log('a')
```

## 配置解析

### 环境变量（env）

指定代码运行的宿主环境，这些环境并不是互斥的，所以我们可以一次性定义多个环境，如启动浏览器环境、ES 6 环境、NodeJS 环境等等。

```javascript
module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    }
}```

如果想在某个插件中使用某个特定的环境，并且只希望在此插件下生效而不是全局，先在 `plugins` 中安装插件，然后在配置 `env`，变量前通过 `/` 添加插件名

```javascript
"plugins": [
        "vue"
    ],
"env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "vue/commonjs":true
},
````

可选属性有：

- `browser` - 浏览器环境中的全局变量
- `node` - nodejs 全局变量和 nodejs 作用域
- `commonjs` - commonjs 全局变量和 commonjs 作用于（用于使用 Browserify/WebPack 的纯浏览器代码）
- `shared-node-browser` - nodejs 和浏览器通用的全局变量
- `es6` - 启用除了 modules 以外的所有 ECMAScript 6 的特性（该选项会自动设置 ecmaVersion 解析器为 6）
- `worker` - Web workers 全局变量
- `amd` - 将 reuqire() 和 define()定义为像 amd 一样的全局变量
- `mocha` - 添加所有的 Mocha 测试全局变量
- `jasmine` - 添加所有的 Jasmine 版本 1.3 和 2.0 的测试全局变量
- `jest` - Jest 全局变量
- `phantomjs` - PnhatomJS 全局变量
- `protractor` - Protractor 全局变量
- `qunit` - Qunit 全局变量
- `jquery` - jQuery 全局变量
- `prototypejs` - Prototype. Js 全局变量
- `shelljs` - Shelljs 全局变量
- `meteor` - Meteor 全局变量
- `mongo` -MongoDB 全局变量
- `applescript` - AppleScript 全局变量
- `nashorn` - Java 8 Nashorn 全局变量
- `serviceworker` - Service Worker 全局变量
- `atomtest` - Atom 测试全局变量
- `embertest` - Ember 测试全局变量
- `webextensions` - WebExtensions 全局变量
- `greasemonkey` - GreaseMonkey 全局变量

### 全局变量（globls）

在 `ESLint` 中，可以使用 `globals` 配置项来定义全局变量，这些全局变量都是在代码中声明的但是没有明确定义的一些变量，我们通过配置全局变量来避免它们被视为未定义的变量。

因为 `ESLint` 的一些核心的规则依赖于代码在运行时可用的一些全局变量，因为这些变量在不同的环境中会有很大的不同，而且在运行时也会被修改，所以 `ESLint` 不会对执行环境中的全局变量进行假设，如果想要明确的告诉 `ESLint` 有哪些全局变量，就可以在这个字段中定义。

- 可读可写：`writeable`
- 可读不可写：`readonly`
- 禁用：`"off"`

```json
"globals":{
  "var1":"writable",// 允许变量被覆盖
  "var2":"readonly",// 禁止覆盖 仅可读
  "Promise":"off"//在一个环境中，可以使用大多数 ES2015 全局变量，但不可以使用 Promise，那么你就可以使用这个配置
}
```

### 覆盖（overrides）

覆盖一组文件中的规则，通过 `overrides` 和 `filtes` 配置。

例如：某些文件中你认为这样写是对的，但是 ESLint 报错了，这样你就可以配置覆盖规则，这些文件就用你自己写的规则。

例如：为特定类型的文件执行一些处理器，指定一些规则。

同一个配置文件中的多个覆盖只有最后一个具有最高的优先级。

```javascript
"overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "excludedFiles":"*.test.js"
            "parserOptions": {
                "sourceType": "script"
            }
        },
        // 为md文件指定使用a-plugin插件处理,注意要安装特定的插件
         {
             "files": ["*.md"],
             "processor": "a-plugin/markdown"
         }
}
```

### 解析器（parser）

解析器（parser）是用于分析和理解我们写的代码的工具，解析器将代码转化为抽象语法树，为了让 `ESLint` 能够在其上面执行静态分析和规则检查。

`ESLint` 支持多个解析器，每个解析器都有自己的适用范围：

- `Espree`: Espree 是一个轻量级、快速的解析器，由 `ESLint` 团队开发，基于 `Esprima`,并且与 `ESLint` 高度集成，它支持 `ES6`、`ES7` 等多个 ES 版本
- `Babel-ESLint`：使用 babel 进行代码转换，以支持最新的 js 语法，他可以处理 `ES6+` 的代码转换为 `ES5` 语法，然后由 `ESLint` 进行检查
- `@typescript-eslint/parser`：它是一个用于解析 TS 的解析器，可以处理 ts 的语法和类型注解，并与 `@typescript-eslint` 插件集成
- `vue-eslint-parser`：专门解析 vue 单文件组件的解析器，用于解析 vue 模板、js 和样式，并提供对 vue 特定语法的支持

```js
parser: 'vue-eslint-parser'
```

### 解析器选项（parserOptions）

解析器选项（parserOptions）用于配置解析器的行为和语法选项，这些选项可以帮助解析器正确的解析代码，并提供更准确的静态分析和规则检查

- `ecmaVersion`：指定所使用的 ES 版本，可以为一个数字，也可以为 ES 版本号
- `sourceType`：制定代码的模块类型，可以设置为 `script默认` 或者 `module`，表示代码是一个独立的脚本还是 ES 模块
- `ecmaFeatures`：启用一些特定的语言功能，这是一个对象，其中额刷卡用于启用或禁用某些特定的语言功能

```js
parserOptions: {
        // 这个自定义解析器中，使用@typescript-eslint/parser作为<script>标记。
        parser: '@typescript-eslint/parser',
        //  设置为 "script"（默认值）或 "module"（如果代码是 ECMAScript 模块）。
        sourceType : 'script',
        // 设置为 3、5（默认）、6、7、8、9、10、11、12 或 13，以指定你要使用的 ECMAScript 语法的版本
        // 你也可以设置为 2015（6）、2016（7）、2017（8）、2018（9）、2019（10）、2020（11）、2021（12）或 2022（13）来使用基于年份的命名。你也可以设置 "latest" 来使用受支持的最新版本。
        //  支持es6语法（但不支持新的 ES6 全局变量或类型，如Set）
        ecmaVersion: 'latest',
        jsxPragma: 'React',
        // 表示你想使用哪些额外的语言特性的对象, value 均为 true/false
        ecmaFeatures: {
          // 启用 JSX
          jsx: true,
          globalReturn: true, // 允许在全局作用域下使用 return 语句
        },
    },
```

### 共享配置（extends）

继承一份别人写好的 `ESLint` 配置到自己的项目中，它是一个字符串数组。

继承分为如下几种情况：

- 从 ESLint 本身继承
- 从 `eslint-config-xxx` 的 npm 包上继承
- 从 ESLint 插件中继承

#### 继承自 ESLint

> Recommended: 表示引入 ESLint 的核心功能，并且报告一些常见的共同错误

```js
"extends":[
	"eslint:recommended"
]
```

> all:引入当前版本的所有核心规则，这些规则会随着 ESLint 版本进行改变

```js
"extends":[
	"eslint:all"
]
```

#### 从 npm 上下载的一些共享的配置

常见的共享配置都是在 npm 上的一个包，它们主要输出了一个配置对象，是别人整理好的一些规则，例如：`eslint-config-xxx`，我们在使用的时候可以直接忽略掉前缀`eslint-config-`

```js
"extends":[
	"xxx"
]
```

#### eslint 插件的配置

`plugin` 也是一个 npm 的包，主要是定义好了一些规则让我们和项目中的 `ESLint` 集成在一起。

```js
extend: ['plugin:@typescript-eslint/recommended']
```

#### 引入 file 文件

我们可以从一些文件中引入配置，可以是绝对路径，也可以是相对路径，ESLint 解析一个相对于使用它的配置文件的基本配置文件的相对路径。

```js
"extends": [
     "./node_modules/coding-standard/.eslintrc-jsx"
 ]
```

### 插件（plugins）

随着前端项目越来越多样化，`ESLint` 默认的一些内置规则就已经不够用了，所以就出现了 `plugins`，我们可以理解为扩展了 `ESLint` 的能力。

例如：在现在的 vue 项目中，我们需要对. vue 文件进行一些校验，而 eslint 默认的规则已经不满足我们的需求了，这个时候我们就需要引入能够校验 vue 代码的规则 `eslint-plugin-vue`。

首先我们需要安装这个插件 `pnpm install eslint-plugins-vue -D`

在 `ESLint` 配置文件中声明我们安装的插件：

```js
"plugins":["eslint-plugin-vue"]
```

### 规则（rules）

`ESLint` 中附带有大量的规则，用于定义代码的规范和风格。这些规则大家需要那个或者是有那个不知道的话可以来这个网站来查询：[更多规则](https://zh-hans.eslint.org/docs/latest/rules/)

规则的等级：

- `off/0` - 关闭规则
- `warn/1` - 启用并视作警告（不影响退出）
- `error/2` - 启用并视作错误（触发时退出代码为 1）

### reportUnusedDisableDirectives 参数

这个参数表示是否应该跟踪和报告未用的禁用指令的布尔值，设置为 true 表示为跟踪

## 命令行的一些参数

`ESLint` 执行的时候可以传递一些参数：

```bash
eslint [options] [file|dir|glob]*
```

常用的一些命令有：

```bash
//单独的校验这一个文件
npx eslint indexjs

// 校验多个文件
npx eslint index.js index1.js

// 校验多个目录
npx eslint src build dist

// 检查多种文件类型
npx eslint --ext .js,.vue

// 只报告错误，而不报告警告
npx eslint --quiet src

// 修复问题
npx eslint --fix src

// 缓存 对只有改变的文件进行操作
npx eslint --cache src

// 启用/禁用彩色输出
npx eslint --no-color/--color index.js

// 这个选项指定了控制台的输出格式 需要安装插件 npm install -D eslint-formatter-codeframe
// https://eslint.bootcss.com/docs/user-guide/formatters/
npx eslint -f html index.js

// 该选项将调试信息输出到控制台。在 ESLint 的命令行中加入这个标志，以便在命令运行时获得额外的调试信息。
npx eslint --debug test.js

```
