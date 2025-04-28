---
title: 学习tsup打包工具
description: tsup是一个基于esbuild的ts库打包工具，无需配置即可使用，也可以支持多种打包工具和目标环境，还可以自定义配置文件、输出文件、代码分割等，同时还提供了类型检查、压缩、源码映射等功能。
tags: [tsup]
date: 2025-04-11
---

## 是什么？

tsup宣称是不用配置文件就可以打包ts文件，他的底层是esbuild。

能打包什么文件？

1. js
2. ts
3. json
4. mjs
5. cjs
6. ...

我想做一个项目常用的工具库，都是用ts写的所以选择了tsup，简单易用，而不是unbuild

## 用法

### 安装

```bash
pnpm install tsup -D
```

### 打包

默认用法就是`tsup [...files]`,它默认打包到`./dist`文件夹中，可以自动的排除`node_modules`文件夹，默认打包的格式为`commonjs`



### 配置文件

如果我们需要更多的打包选项就可以创建一个配置文件：

以tsup.config为开头，后缀为以下集中都可以：

1. js
2. ts
3. cjs
4. json

```js
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  clean: true,
  dts: true,
  format: ["cjs", "esm", "iife"],
  shims: true,
  cjsInterop: true,
  minify: true,
});

```

它也可以像vite.confiog那样通过一个函数返回值来作为配置选项：

```javascript
export default defineConfig((options)=>{
return {
...
}
})
```

### 多入口打包

```javascript
export default defineConfig({
  // entry: ["index.ts", "cli.ts"],
  entry: {
    a: "index.ts",
    b: "cli.ts",
  },
});
```

## 配置项解析

### dts

生成类型声明文件

### sourcemap

生成sourcemap文件

### clean

打包之前先清空dist文件夹

### format

生成不同的格式，有三种：

```ts
type Format = 'cjs' | 'esm' | 'iife';
```

```javascript
format: ["cjs", "esm","iife"],
```

### 自定义输出文件

```javascript
export default defineConfig({
  entry: ["index.ts"],
  clean: true,
  outExtension({ format }) {
    console.log("🚀 ~ :5 ~ outExtension ~ format:", format);// cjs
    return {
      js: `.${format}.js`,
    };
  },
});
```

输出的文件名为：index.cjs.js

### 代码分割

默认只支持esm类型的，并且是默认开启的，cjs需要--splitting手动开启

```javascript
splitting: true, // 拆分代码，生成多个文件，每个文件都有自己的依赖
```

### 产物目标环境

target选项配置构建产物的目标环境，默认是node16

可选的配置：

- chrome
- deno
- dege
- es2015
- es2016
- es2017
- es2018
- es2019
- es2020
- es2021
- es2022
- es2023
- es2024
- es3
- es5
- es6
- esnext
- firefox
- hermes
- ie
- ios
- node
- opera
- rhino
- safari

### 低版本支持

esm是不支持es5的，它的转化是tsup先转化为es2020，然后通过swc转成es5

### 监听模式

```javascript
watch: true,// 监听文件变化，自动编译
ignoreWatch: ["node_modules"],// 忽略监听的文件
```

### minify

压缩产物

```javascript
minify: true, // 压缩代码    生产环境下使用
```

默认是使用esbuild压缩的，也可以用terser压缩，安装之后就可以使用terser压缩

### tree shaking

esbuild默认开始了树摇，也可以使用rollup来进行树摇

```javascript
treeshake: true, // 使用 rollup tree shaking
```

### shims

垫片，类似于补丁的意思，比如说`__dirname`只能在cjs模块中使用，`import.meta.url`只能在esm中使用，打完补丁后，esm中也可以使用`__dirname`了
