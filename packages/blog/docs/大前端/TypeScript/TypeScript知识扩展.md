---
title: TypeScript知识扩展
tags:
  - ts
date: 2023-10-23
cover:
---

# TypeScript 知识扩展

## TypeScript 模块使用

### TypeScript 模块化

- JS 由一个很长的处理模块化的历史，TS 从 2012 年开始跟进，现在已经实现支持了很多格式，但是随着时间流逝，社区和 JS 规范已经使用了名为 ES Module 的格式，这也就是我们所知的 import/export 语法
  - ES 模块在 2015 年被添加到 JS 规范中，到 2020 年，大部分的 web 浏览器和 JS 运行环境都已经广泛支持
  - 所以在 TS 中最主要使用的模块化方案就是 ES Module

```ts
export function add(){...}
```

### 非模块（Non-modules）

- 我们需要先理解 TS 认为什么是一个模块
  - JS 规范声明任何没有 export 的 JavaScript 文件都应该被认为是一个脚本，而非一个模块
  - 在一个脚本文件中，变量和类型会被声明在共享的全局作用域，将多个输入文件合并成一个输出文件，或者在 HTML 使用多个 script 标签加载这些文件
- 如果你有一个文件，现在没有任何 import 或者 export，但是你希望它被作为模块处理，添加这行代码：`export{}`
- 这会把文件改成一个莫有导出任何内容的模块，这个语法可以生效，无论你的模块目标是什么

### 内置类型导入（Inline type imports）

- TypeScript 4.5 也允许单独的导入，你需要使用 type 前缀，表明被导入的是一个类型：

```ts
import {type IFoo,type IDType} from './foo'
const id：IDType=100
const foo:IFoo={
	name:'why',
	age:1
}
```

## TypeScript 命名空间

- ts 有它自己的模块格式，名为 namespaces，它在 ES 模块标准之前出现
  - 命名空间在 typeScript 早期时，称之为内部模块，目的是将一个模块内部在进行作用域的划分，防止一些命名冲突的问题
  - 虽然命名空间没有被废弃，但是由于 ES 模块已经拥有了命名空间的大部分特性，因此更推荐使用 ES 模块，这样才能与 JavaScript 的发展方向保持一致

```ts
export namespace Time {
  export function format(time: string) {
    return '2022-10-20'
  }
}
```

## 声明文件的使用

### 类型的查找

- 之前我们所有的 typeScript 中的类型，几乎都是我们自己编写的，但是我们也有用到一些其他的类型
  - `const imageEl=document.getElementById('image') as HTMLImageElement`
- 大家是否会奇怪，我们的 HTMLImageElement 类型来自哪里呢？甚至是 document 为什么可以有 getElementById 的方法呢？
  - 其实这里就涉及到 ts 对类型的管理和查找规则了
- 我们这里先给大家介绍下另外的一种 typeScript 文件：.d.ts 文件
  - 我们之前编写的 typeScript 文件都是.ts 文件，这些文件最终会输出.js 文件，也是我们通常编写代码的地方
  - 还有另外一种文件.d.ts 文件，他是用来做类型的声明（declare），称之为类型声明（Type Declaration）或者类型定义（Type Definition）文件
  - 它仅仅用来做类型检测，告知 typeScript 我们有那些类型
- 那么 typeScript 会在哪里查找我们的类型声明呢？
  - 内置类型声明
  - 外部定义的类型声明
  - 自己定义的类型声明

### 内置类型声明

- 内置类型声明是 ts 自带的，版主我们内置了 JS 运行时的一些标准化 API 的声明文件
  - 包括比如 Function、String、Math、Date 等内置类型
  - 也包括运行环境中的 DOM API，比如 window、Document 等
- typeScript 使用模式命名这些声明文件 lib.[something].d.ts
- 内置类型声明通常在我们安装 typeScript 的环境中带有的
  - https://github.com/microsoft/TypeScript/tree/main/lib
- 我们可以通过 target 和 lib 来决定那些内置类型声明是可以使用的
  - 例如：startWith 字符串方法只能从 ECMAScript 6 的 JavaScript 版本开始使用
- 我们可以通过 target 的编译选项来配置：TypeScript 通过 lib 根据您的 target 设置更改默认包含的文件来帮助解决次问题
  - https://www.typescriptlang.org/tsconfig#lib

![Snipaste_2023-10-23_15-00-38.png](https://s2.loli.net/2023/10/23/OIH7WZShTAPCQtk.png)

### 第三方库的声明文件

- 外部类型声明通常是我们使用一些库，需要的一些类型声明
- 这些库通常有两种类型声明方式：
  - 方式一：在自己库中进行类型声明（编写.d.ts），比如 axios
  - 方式二：通过社区的一个共有库 DefinitelyTyped 存放类型声明文件
    - 该库的 github 地址： https://github.com/DefinitelyTyped/DefinitelyTyped/
    - 比如我们安装 react 的类型声明 `npm i @types/react --save-dev`

### 自定义声明文件

- 什么情况下需要自己来定义声明文件呢？
  - 情况一：我们使用的第三方库是一个纯的 JavaScript 库，没有对应的声明文件，比如说 lodash
  - 情况二：我们给自己的代码中声明一些类型，方便在其他地方直接进行使用
- 我们也可以声明模块，比如 lodash 模块默认不能使用的情况，可以自己来声明这个模块

```ts
declare module 'lodash' {
  export function join(args: any[]): any
}
```

- 声明模块的语法：declare module "模块名"{}
  - 在声明模块的内部，我们可以通过 export 导出对应的苦的类、函数等
- 在某些情况下，我们也可以声明文件
  - 比如在开发 vue 的过程中，默认是不识别我们的.vue 文件的，那么我们就需要对其进行文件的声明
  - 比如在开发中我们使用了 jpg 这类图片文件，默认 typeScript 也是不支持的，也需要对其进行声明

```ts
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module '*.jpg' {
  const src: string
  export default src
}
```

### declare 命名空间

- 比如我们在 index.html 中直接引入了 jQuery
  - CDN 地址： https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
- 我们可以进行命名空间的声明：

```ts
declare namespace $ {
  function ajax(setting: any): void
}
```

- 在 main.ts 中就可以使用了

```ts
$.ajax({
  url: 'localhosy:8000',
  success: (res: any) => {
    console.log(res)
  }
})
```

## tsconfig 配置文件解析

- 什么是 tsconfig.json 文件呢？
  - 当目录中出现了 tsconfig.json 文件，则说明该目录是 typeScript 项目的根目录
  - tsconfig.json 文件指定了编译项目所需的根目录下的文件以及编译选项
- tsconfig.json 文件有两个作用：
  - 作用一：让 typeScript Compiler 在编译的时候，知道如何去编译 typeScript 代码和进行类型检测
    - 比如是否允许不明确的 this 选项，是否允许隐式的 any 类型
    - 将 typeScript 代码编译成什么版本的 JavaScript 代码
  - 作用二：让编辑器可以按照正确的方式识别 typeScript 代码
    - 对于那些语法进行提示、类型错误检测等等
- JavaScript 项目可以使用 jsconfig.json 文件，他的作用于 tsconfig.join 基本相同，只是默认启用了一些 JavaScript 相关的编译选项

- tsconfig.json 在编译时如何被使用呢？
  - 在调用 tsc 命令并且没有其他输入文件参数时，编译器将由当前目录开始向父级目录寻找包含 tsconfig 文件的目录
  - 调用 tsc 命令并且没有其他输入文件参数，可以使用--project（或者只是-p）的命令行选项来指定包含了 tsconfig.json 的目录
  - 当命令行中指定了输入文件参数，tsconfig 文件会被忽略
- webpack 中使用 ts-loader 进行打包时，也会自动读取 tsconfig 文件，根据配置编译 typeScript 代码
- tsconfig.json 文件包含哪些选项呢?
  - 查看文档对于某一个选项的解释： https://www.typescriptlang.org/tsconfig

### tsconfig.json 顶层选项

![第17页-27.PNG](https://s2.loli.net/2023/10/23/yR9cjUzx67bwvEK.png)
![第17页-28.PNG](https://s2.loli.net/2023/10/23/heKDCtdxAcaOkin.png)

### compilerOptions 常见配置

```json
{
  "compilerOptions": {
    // 目标代码
    "target": "ESNext",
    // 生成代码使用的模块化
    "module": "commonjs",
    // 打开所有严格模式检查
    "strict": true,
    "allowJs": false,
    "noImplicitAny": false,
    // jsx的处理方式（保留原有的jsx格式）
    "jsx": "preserve",
    // 是否包住导入一些需要的功能模块
    "importHelpers": true,
    // 按照node的模块解析规则
    "moduleResolution": "node",
    // 跳过对整个库进行检测，而仅仅检测你用到的类型
    "skipLibCheck": true,
    // 可以让es module 和commonjs相互调用
    "esModuleInterop": true,
    //允许合成默认模块导出
    //import * as react from 'react' :false    //import react from 'react' :true    "allowSyntheticDefaultImports": true,
    //是否要生成sourcemap文件
    "sourceMap": true,
    // 文件路径在解析时的基本url
    "baseUrl": ".",
    // 指定types文件需要加载那些（默认是都会进行加载的）
    "types": ["webpack-env"],
    //路径的映射设置，类似于webpack中的别名
    "paths": {
      "@/*": ["src/*"]
    },
    //指定我们需要使用到的库（也可以不配置，根据根据target来获取）
    "lib": ["ESNext", "DOM", "DOM.Iterable", "ScriptHost"]
  },
  "include": [],
  "exclude": ["node_modules"]
}
```
