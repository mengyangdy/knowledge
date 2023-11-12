---
title: 手写vite
tags:
  - vite
date: 2023-11-11
cover:
---

# 手写 vite

## 实现 no-bundle 开发服务

首先，我们会进行开发环境的搭建，安装必要的依赖，并搭建项目的构建脚本，同时完成 cli 工具的初始化代码。

然后我们正式开始实现依赖预构建的功能，通过 Esbuild 实现依赖扫描和依赖构建的功能。

接着开始搭建 Vite 的插件机制，也就是开  
发 PluginContainer 和 PluginContext 两个主要的对象。

搭建完插件机制之后，我们将会开发一系列的插件来实现 no-bundle 服务的编译构建能力，包括入口 HTML 处理、 TS/TSX/JS/TSX 编译、CSS 编译和静态资源处理。

最后，我们会实现一套系统化的模块热更新的能力，从搭建模块依赖图开始，逐步实现 HMR 服务端和客户端的开发

### 开发环境搭建

首先，你可以执行 pnpm init -y 来初始化项目，然后安装一些必要的依赖，执行命令如下:

> 对于各个依赖的具体作用，大家先不用纠结，我将会在后面使用到依赖的时候介绍

```js
// 运行时依赖
pnpm i @babel/core cac chokidar connect debug es-module-lexer esbuild fs-extra magic-string picocolors react-refresh resolve rollup sirv ws
// 开发环境依赖
pnpm i @types/connect @types/debug @types/fs-extra @types/resolve @types/ws tsup
```

Vite 本身使用的是 Rollup 进行自身的打包，但之前给大家介绍的 tsup 也能够实现库打包的功能，并且内置 esbuild 进行提速，性能上更加强悍，因此在这里我们使用 tsup 进行项目的构建。

为了接入 tsup 打包功能，你需要在 package.json 中加入这些命令:

```js
"scripts": {
    "start": "tsup --watch",
    "build": "tsup --minify"
},
```

同时，你需要在项目根目录新建 tsconfig.json 和 tsup.config.ts 这两份配置文件，内容分别如下:

```js
// tsconfig.json
{
  "compilerOptions": {
// 支持 commonjs 模块的 default import，如 import path from 'path' // 否则只能通过 import * as path from 'path' 进行导入 "esModuleInterop": true,
"target": "ES2020",
    "moduleResolution": "node",
    "module": "ES2020",
    "strict": true
} }
// tsup.config.ts
import { defineConfig } from "tsup";
export default defineConfig({ // 后续会增加 entry
entry: {
    index: "src/node/cli.ts",
  },
// 产物格式，包含 esm 和 cjs 格式 format: ["esm", "cjs"],
// 目标语法
target: "es2020",
// 生成 sourcemap
sourcemap: true,
// 没有拆包的需求，关闭拆包能力 splitting: false,
});
```

接着新建 src/node/cli.ts 文件，我们进行 cli 的初始化:

```js
// src/node/cli.ts
import cac from 'cac'
const cli = cac()
// [] 中的内容为可选参数，也就是说仅输入 `vite` 命令下会执行下面的逻辑
cli
  .command('[root]', 'Run the development server')
  .alias('serve')
  .alias('dev')
  .action(async () => {
    console.log('测试 cli~')
  })
cli.help()
cli.parse()
```

现在你可以执行 pnpm start 来编译这个 mini-vite 项目，tsup 会生成产物目录 dist ，然后你可以新建 bin/mini-vite 文件来引用产物:

```js
#! /use/bin/env node
require('../dist/index.js')
```

同时，你需要在 package.json 中注册 `mini-vite` 命令，配置如下:

```js
{
"bin": {
    "mini-vite": "bin/mini-vite"
  }
}
```

如此一来，我们就可以在业务项目中使用 `mini-vite` 这个命令了。在小册的 Github 仓库中我为你准备了一个示例的 `playground` 项目，你可以拿来进行测试。
将 `playground` 项目放在 `mini-vite` 目录中，然后执行 `pnpm i `，由于项目的 `dependencies` 中已经声明了 `mini-vite` :

```js
{
  "devDependencies": {
    "mini-vite": '../'
  }
}
```

那么 `mini-vite` 命令会自动安装到测试项目的 `node_modules/.bin` 目录中:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311112242434.png)

接着我们在 `playground` 项目中执行 `pnpm dev` 命令(内部执行 `mini-vite` )，可以看到如下的 log 信息：

```txt
测试 cli~
```

接着，我们把 `console.log` 语句换成服务启动的逻辑:

```diff
import cac from "cac";
+ import { startDevServer } from "./server";
const cli = cac();
cli
  .command("[root]", "Run the development server")
  .alias("serve")
  .alias("dev")
  .action(async () => {
- +
console.log('测试 cli~');
   await startDevServer();
});
```

现在你需要新建 `src/node/server/index.ts `，内容如下:

```js
// connect 是一个具有中间件机制的轻量级 Node.js 框架。
// 既可以单独作为服务器，也可以接入到任何具有中间件机制的框架中，如 Koa、Express
import connect from 'connect'
// picocolors 是一个用来在命令行显示不同颜色文本的工具
import { blue, green } from 'picocolors'
export async function startDevServer() {
  const app = connect()
  const root = process.cwd()
  const startTime = Date.now()
  app.listen(3000, async () => {
    console.log(green(' No-Bundle 服务已经成功启动!'), `耗时: ${Date.now() - startTime}ms`)
    console.log(`> 本地访问路径: ${blue('http://localhost:3000')}`)
  })
}
```

再次执行 pnpm dev ，你可以发现终端出现如下的启动日志:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311112245148.png)

### 依赖预构建

现在我们来进入依赖预构建阶段的开发。

首先我们新建 `src/node/optimizer/index.ts` 来存放依赖预构建的逻辑:

```js
export async function optimize(root: string) { // 1. 确定入口
// 2. 从入口处扫描依赖
// 3. 预构建依赖
}
```

然后在服务入口中引入预构建的逻辑:

```js
// src/node/server/index.ts
import connect from "connect";
import { blue, green } from "picocolors";
+ import { optimize } from "../optimizer/index";
export async function startDevServer() {
  const app = connect();
  const root = process.cwd();
  const startTime = Date.now();
  app.listen(3000, async () => {
+
await optimize(root);
console.log(
green(" No-Bundle 服务已经成功启动!"), `耗时: ${Date.now() - startTime}ms`
);
console.log(`> 本地访问路径: ${blue("http://localhost:3000")}`); });
}
```

接着我们来开发依赖预构建的功能，从上面的代码注释你也可以看出，我们需要完成三部分的逻辑：

- 确定预构建入口
- 从入口开始扫描出用到的依赖
- 对依赖进行预构建

首先是确定入口，为了方便理解，这里我直接约定为 src 目录下的 `main.tsx` 文件:

```js
// 需要引入的依赖
import path from 'path'
// 1. 确定入口
const entry = path.resolve(root, 'src/main.tsx')
```

第二步是扫描依赖:

```js
// 需要引入的依赖
import { build } from "esbuild";
import { green } from "picocolors";
import { scanPlugin } from "./scanPlugin";
// 2. 从入口处扫描依赖
const deps = new Set<string>(); await build({
  entryPoints: [entry],
  bundle: true,
  write: false,
  plugins: [scanPlugin(deps)],
});
console.log( `${green("需要预构建的依赖")}:\n${[...deps]
  .map(green)
  .map((item) => `  ${item}`)
  .join("\n")}`
);
```

依赖扫描需要我们借助 Esbuild 插件来完成，最后会记录到 deps 这个集合中。接下来我们来着眼于 Esbuild 依赖扫描插件的开发，你需要在 `optimzier` 目录中新建 `scanPlguin.ts` 文件，内容如下:

```js
// src/node/optimizer/scanPlugin.ts
import { Plugin } from "esbuild";
import { BARE_IMPORT_RE, EXTERNAL_TYPES } from "../constants";
export function scanPlugin(deps: Set<string>): Plugin { return {
name: "esbuild:scan-deps", setup(build) {
// 忽略的文件类型
build.onResolve(
{ filter: new RegExp(`\\.(${EXTERNAL_TYPES.join("|")})$`) }, (resolveInfo) => {
return {
path: resolveInfo.path, // 打上 external 标记 external: true,
}; }
);
// 记录依赖
build.onResolve(
        {
          filter: BARE_IMPORT_RE,
        },
        (resolveInfo) => {
const { path: id } = resolveInfo; // 推入 deps 集合中
deps.add(id);
return {
path: id,
            external: true,
          };
} );
}, };
}
```

需要说明的是，文件中用到了一些常量，在 `src/node/constants.ts ` 中定义，内容如下:

```js
export const EXTERNAL_TYPES = [
  'css',
  'less',
  'sass',
  'scss',
  'styl',
  'stylus',
  'pcss',
  'postcss',
  'vue',
  'svelte',
  'marko',
  'astro',
  'png',
  'jpe?g',
  'gif',
  'svg',
  'ico',
  'webp',
  'avif'
]
export const BARE_IMPORT_RE = /^[\w@][^:]/
```

插件的逻辑非常简单，即把一些无关的资源进行 external，不让 esbuild 处理，防止 Esbuild 报错，同时将 `bare import` 的路径视作第三方包，推入 deps 集合中。

现在，我们在 `playground` 项目根路径中执行 `pnpm dev` ，可以发现依赖扫描已经成功执行：

当我们收集到所有的依赖信息之后，就可以对每个依赖进行打包，完成依赖预构建了:

```js
// src/node/optimizer/index.ts
// 需要引入的依赖
import { preBundlePlugin } from "./preBundlePlugin"; import { PRE_BUNDLE_DIR } from "../constants";
// 3. 预构建依赖 await build({
  entryPoints: [...deps],
  write: true,
  bundle: true,
  format: "esm",
  splitting: true,
  outdir: path.resolve(root, PRE_BUNDLE_DIR),
  plugins: [preBundlePlugin(deps)],
});
```

在此，我们引入了一个新的常量 `PRE_BUNDLE_DIR` ，定义如下:

```js
// src/node/constants.ts
// 增加如下代码
import path from 'path'
// 预构建产物默认存放在 node_modules 中的 .m-vite 目录中
export const PRE_BUNDLE_DIR = path.join('node_modules', '.m-vite')
```

接着，我们继续开发预构建的 Esbuild 插件:

```js
import { Loader, Plugin } from "esbuild"; import { BARE_IMPORT_RE } from "../constants"; // 用来分析 es 模块 import/export 语句的库 import { init, parse } from "es-module-lexer"; import path from "path";
// 一个实现了 node 路径解析算法的库
import resolve from "resolve";
// 一个更加好用的文件操作库
import fs from "fs-extra";
// 用来开发打印 debug 日志的库
import createDebug from "debug";
const debug = createDebug("dev");
export function preBundlePlugin(deps: Set<string>): Plugin { return {
name: "esbuild:pre-bundle", setup(build) {
      build.onResolve(
        {
          filter: BARE_IMPORT_RE,
        },
(resolveInfo) => {
const { path: id, importer } = resolveInfo; const isEntry = !importer;
// 命中需要预编译的依赖
if (deps.has(id)) {
// 若为入口，则标记 dep 的 namespace return isEntry
?{
path: id,
                  namespace: "dep",
                }
:{
} }
);
// 因为走到 onResolve 了，所以这里的 path 就是绝对路径了
  path: resolve.sync(id, { basedir: process.cwd() }),
};
// 拿到标记后的依赖，构造代理模块，交给 esbuild 打包 build.onLoad(
{
filter: /.*/, namespace: "dep",
  },
  async (loadInfo) => {
await init;
const id = loadInfo.path;
const root = process.cwd();
const entryPath = resolve.sync(id, { basedir: root }); const code = await fs.readFile(entryPath, "utf-8"); const [imports, exports] = await parse(code);
let proxyModule = [];
// cjs
if (!imports.length && !exports.length) {
// 构造代理模块
// 下面的代码后面会解释
const res = require(entryPath); const specifiers = Object.keys(res); proxyModule.push(
              `export { ${specifiers.join(",")} } from "${entryPath}"`,
              `export default require("${entryPath}")`
            );
} else {
// esm 格式比较好处理，export * 或者 export default 即可 if (exports.includes("default")) {
              proxyModule.push(`import d from "${entryPath}";export default d`);
            }
            proxyModule.push(`export * from "${entryPath}"`);
          }
debug("代理模块内容: %o", proxyModule.join("\n")); const loader = path.extname(entryPath).slice(1); return {
loader: loader as Loader, contents: proxyModule.join("\n"), resolveDir: root,
}; }
); },
}; }
```

值得一提的是，对于 CommonJS 格式的依赖，单纯用`export default require('入口路径')`
是有局限性的，比如对于 React 而言，用这样的方式生成的产物最后只有 default 导出:

```js
// esbuild 的打包产物
// 省略大部分代码
export default react_default
```

那么用户在使用这个依赖的时候，必须这么使用:

```js
// 正确
import React from 'react'
const { useState } = React
// 报错
import { useState } from 'react'
```

那为什么上述会报错的语法在 Vite 是可以正常使用的呢?原因是 Vite 在做 import 语句分析的时候，自动将你的代码进行改写了:

```js
// 原来的写法
import { useState } from 'react'
// Vite 的 importAnalysis 插件转换后的写法类似下面这样
import react_default from '/node_modules/.vite/react.js'
const { useState } = react_default
```

那么，还有没有别的方案来解决这个问题?没错，上述的插件代码中已经用另一个方案解决了这个问题，我们不妨把目光集中在下面这段代码中:

```js
if (!imports.length && !exports.length) {
  // 构造代理模块
  // 通过 require 拿到模块的导出对象
  const res = require(entryPath)
  // 用 Object.keys 拿到所有的具名导出
  const specifiers = Object.keys(res)
  // 构造 export 语句交给 Esbuild 打包
  proxyModule.push(`export { ${specifiers.join(',')} } from "${entryPath}"`, `export default require("${entryPath}")`)
}
```

如此一来，Esbuild 预构建的产物中便会包含 CommonJS 模块中所有的导出信息:

```js
// 预构建产物导出代码 export {
react_default as default, useState,
useEffect,
// 省略其它导出
}
```

接下来让我们来测试一下预构建整体的功能。在 `playground` 项目中执行 `pnpm dev`，接着去项目的 `node_modules` 目录中，可以发现新增了 `.m-vite` 目录及 `react`、`react-dom` 的预构建产物:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311112258242.png)

### 插件机制实现

在完成了依赖预构建的功能之后，我们开始搭建 Vite 的插件机制，实现插件容器和插件上下文对象。

首先，你可以新建 `src/node/pluginContainer.ts` 文件，增加如下的类型定义:

```js
import type {
LoadResult,
PartialResolvedId, SourceDescription,
PluginContext as RollupPluginContext, ResolvedId,
} from "rollup";
export interface PluginContainer {
resolveId(id: string, importer?: string): Promise<PartialResolvedId | null>; load(id: string): Promise<LoadResult | null>;
transform(code: string, id: string): Promise<SourceDescription | null>;
}
```

另外，由于插件容器需要接收 Vite 插件作为初始化参数，因此我们需要提前声明插件的类型，你可以继续新建 `src/node/plugin.ts` 来声明如下的插件类型:

```js
import { LoadResult, PartialResolvedId, SourceDescription } from "rollup"; import { ServerContext } from "./server";
export type ServerHook = ( server: ServerContext
) => (() => void) | void | Promise<(() => void) | void>;
// 只实现以下这几个钩子 export interface Plugin {
  name: string;
  configureServer?: ServerHook;
  resolveId?: (
id: string,
    importer?: string
  ) => Promise<PartialResolvedId | null> | PartialResolvedId | null;
  load?: (id: string) => Promise<LoadResult | null> | LoadResult | null;
  transform?: (
    code: string,
    id: string
  ) => Promise<SourceDescription | null> | SourceDescription | null;
  transformIndexHtml?: (raw: string) => Promise<string> | string;
}
```

对于其中的 ServerContext，你暂时不用过于关心，只需要在 `server/index.ts` 中简单声明一下类型即可:

```js
// src/node/server/index.ts
// 增加如下类型声明
export interface ServerContext {}
```

接着，我们来实现插件机制的具体逻辑，主要集中在 `createPluginContainer` 函数中:

```js
// src/node/pluginContainer.ts
// 模拟 Rollup 的插件机制
export const createPluginContainer = (plugins: Plugin[]): PluginContainer => {
// 插件上下文对象
// @ts-ignore 这里仅实现上下文对象的 resolve 方法 class Context implements RollupPluginContext {
async resolve(id: string, importer?: string) {
let out = await pluginContainer.resolveId(id, importer); if (typeof out === "string") out = { id: out };
return out as ResolvedId | null;
} }
// 插件容器
const pluginContainer: PluginContainer = {
async resolveId(id: string, importer?: string) { const ctx = new Context() as any;
for (const plugin of plugins) {
if (plugin.resolveId) {
const newId = await plugin.resolveId.call(ctx as any, id, importer); if (newId) {
id = typeof newId === "string" ? newId : newId.id;
return { id }; }
} }
return null; },
async load(id) {
const ctx = new Context() as any; for (const plugin of plugins) {
if (plugin.load) {
const result = await plugin.load.call(ctx, id); if (result) {
return result; }
} }
return null; },
async transform(code, id) {
const ctx = new Context() as any; for (const plugin of plugins) {
if (plugin.transform) {
const result = await plugin.transform.call(ctx, code, id);
if (!result) continue;
if (typeof result === "string") {
code = result;
} else if (result.code) {
            code = result.code;
          }
} }
return { code }; },
};
return pluginContainer; };
```

上面的代码比较容易理解，并且关于插件钩子的执行原理和插件上下文对象的作用，在小册第 22 节中也有详细的分析，这里就不再赘述了。

接着，我们来完善一下之前的服务器逻辑:

```diff
/ src/node/server/index.ts
import connect from "connect";
import { blue, green } from "picocolors";
import { optimize } from "../optimizer/index";
+ import { resolvePlugins } from "../plugins";
+ import { createPluginContainer, PluginContainer } from "../pluginContainer";
export interface ServerContext {
+  root: string;
+  pluginContainer: PluginContainer;
+  app: connect.Server;
+  plugins: Plugin[];
}
export async function startDevServer() {
  const app = connect();
  const root = process.cwd();
  const startTime = Date.now();
+  const plugins = resolvePlugins();
+  const pluginContainer = createPluginContainer(plugins);
+  const serverContext: ServerContext = {
+    root: process.cwd(),
+    app,
+    pluginContainer,
+    plugins,
+  };
+  for (const plugin of plugins) {
+    if (plugin.configureServer) {
+ +} +}
await plugin.configureServer(serverContext);
app.listen(3000, async () => {
    await optimize(root);
    console.log(
green(" No-Bundle 服务已经成功启动!"),
`耗时: ${Date.now() - startTime}ms` );
console.log(`> 本地访问路径: ${blue("http://localhost:3000")}`); });
}
```

其中 `resolvePlugins` 方法我们还未定义，你可以新建 `src/node/plugins/index.ts` 文件，内容如下:

```js
import { Plugin } from "../plugin";
export function resolvePlugins(): Plugin[] { // 下一部分会逐个补充插件逻辑
return [];
}
```

### 入口 HTML 加载

现在我们基于如上的插件机制，来实现 Vite 的核心编译能力。

首先要考虑的就是入口 HTML 如何编译和加载的问题，这里我们可以通过一个服务中间件，配合插件机制来实现。具体而言，你可以新建 `src/node/server/middlewares/indexHtml.ts` ，内容如下:

```js
import { NextHandleFunction } from "connect"; import { ServerContext } from "../index";
import path from "path";
import { pathExists, readFile } from "fs-extra";
export function indexHtmlMiddware( serverContext: ServerContext
): NextHandleFunction {
return async (req, res, next) => {
if (req.url === "/") {
const { root } = serverContext;
// 默认使用项目根目录下的 index.html
const indexHtmlPath = path.join(root, "index.html"); if (await pathExists(indexHtmlPath)) {
const rawHtml = await readFile(indexHtmlPath, "utf8");
let html = rawHtml;
// 通过执行插件的 transformIndexHtml 方法来对 HTML 进行自定义的修改 for (const plugin of serverContext.plugins) {
if (plugin.transformIndexHtml) {
html = await plugin.transformIndexHtml(html);
} }
res.statusCode = 200; res.setHeader("Content-Type", "text/html"); return res.end(html);
} }
return next(); };
}
```

然后在服务中应用这个中间件:

```js
// src/node/server/index.ts
// 需要增加的引入语句
import { indexHtmlMiddware } from './middlewares/indexHtml'
// 省略中间的代码
// 处理入口 HTML 资源
app.use(indexHtmlMiddware(serverContext))
app.listen(3000, async () => {
  // 省略
})
```

接下来通过 `pnpm dev` 启动项目，然后访问 http://localhost:3000 ，从网络面板中你可以查看到 HTML 的内容已经成功返回:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311112305983.png)

不过当前的页面并没有任何内容，因为 HTML 中引入的 TSX 文件并没有被正确编译。接下来，我们就来处理 TSX 文件的编译工作。

### JS/TS/JSX/TSX 编译能力

首先新增一个中间件 `src/node/server/middlewares/transform.ts `，内容如下:

```js
import { NextHandleFunction } from "connect"; import {
  isJSRequest,
cleanUrl,
} from "../../utils";
import { ServerContext } from "../index"; import createDebug from "debug";
const debug = createDebug("dev");
export async function transformRequest( url: string,
serverContext: ServerContext
){
const { pluginContainer } = serverContext;
url = cleanUrl(url);
// 简单来说，就是依次调用插件容器的 resolveId、load、transform 方法 const resolvedResult = await pluginContainer.resolveId(url); let transformResult;
if (resolvedResult?.id) {
let code = await pluginContainer.load(resolvedResult.id); if (typeof code === "object" && code !== null) {
      code = code.code;
    }
if (code) {
transformResult = await pluginContainer.transform(
code as string,
        resolvedResult?.id
      );
} }
return transformResult; }
export function transformMiddleware( serverContext: ServerContext
): NextHandleFunction {
return async (req, res, next) => {
if (req.method !== "GET" || !req.url) { return next();
}
const url = req.url; debug("transformMiddleware: %s", url); // transform JS request
if (isJSRequest(url)) {
// 核心编译函数
let result = await transformRequest(url, serverContext); if (!result) {
return next(); }
if (result && typeof result !== "string") { result = result.code;
}
// 编译完成，返回响应给浏览器
res.statusCode = 200;
res.setHeader("Content-Type", "application/javascript"); return res.end(result);
next(); };
}
```

同时，我们也需要补充如下的工具函数和常量定义:

```js
// src/node/utils.ts
import { JS_TYPES_RE } from './constants.ts'
export const isJSRequest = (id: string): boolean => { id = cleanUrl(id);
if (JS_TYPES_RE.test(id)) {
return true; }
if (!path.extname(id) && !id.endsWith("/")) { return true;
}
return false; };
export const cleanUrl = (url: string): string => url.replace(HASH_RE, "").replace(QEURY_RE, "");
// src/node/constants.ts
export const JS_TYPES_RE = /\.(?:j|t)sx?$|\.mjs$/; export const QEURY_RE = /\?.*$/s;
export const HASH_RE = /#.*$/s;
```

从如上的核心编译函数 `transformRequest` 可以看出，Vite 对于 JS/TS/JSX/TSX 文件的编译流程主要是依次调用插件容器的如下方法:

- resolveld
- load
- transform

其中会经历众多插件的处理逻辑，那么，对于 TSX 文件的编译逻辑，也分散到了各个插件当中，具体来说主要包含以下的插件:

- 路径解析插件
- Esbuild 语法编译插件
- import 分析插件

#### 1.路由解析插件

当浏览器解析到如下的标签时:

```js
<script
  type="module"
  src="/src/main.tsx"
></script>
```

会自动发送一个路径为 ` /src/main.tsx` 的请求，但如果服务端不做任何处理，是无法定位到源文件的，随之会返回 404 状态码:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311112309651.png)

因此，我们需要开发一个路径解析插件，对请求的路径进行处理，使之能转换真实文件系统中的路径。你可以新建文件 `src/node/plugins/resolve.ts` ，内容如下:

```js
import resolve from "resolve";
import { Plugin } from "../plugin";
import { ServerContext } from "../server/index"; import path from "path";
import { pathExists } from "fs-extra";
import { DEFAULT_EXTERSIONS } from "../constants"; import { cleanUrl } from "../utils";
export function resolvePlugin(): Plugin { let serverContext: ServerContext; return {
name: "m-vite:resolve", configureServer(s) {
// 保存服务端上下文
      serverContext = s;
    },
async resolveId(id: string, importer?: string) { // 1. 绝对路径
if (path.isAbsolute(id)) {
if (await pathExists(id)) { return { id };
}
// 加上 root 路径前缀，处理 /src/main.tsx 的情况 id = path.join(serverContext.root, id);
if (await pathExists(id)) {
return { id }; }
}
// 2. 相对路径
else if (id.startsWith(".")) {
if (!importer) {
throw new Error("`importer` should not be undefined");
}
const hasExtension = path.extname(id).length > 1; let resolvedId: string;
// 2.1 包含文件名后缀
// 如 ./App.tsx
if (hasExtension) {
resolvedId = resolve.sync(id, { basedir: path.dirname(importer) }); if (await pathExists(resolvedId)) {
return { id: resolvedId }; }
}
// 2.2 不包含文件名后缀 // 如 ./App
else {
          // ./App -> ./App.tsx
for (const extname of DEFAULT_EXTERSIONS) { try {
const withExtension = `${id}${extname}`; resolvedId = resolve.sync(withExtension, {
                basedir: path.dirname(importer),
              });
if (await pathExists(resolvedId)) { return { id: resolvedId };
}
} catch (e) {
continue; }
} }
}
return null; },
}; }
```

这样对于 `/src/main.tsx` ，在插件中会转换为文件系统中的真实路径，从而让模块在 load 钩子中能够正常加载(加载逻辑在 Esbuild 语法编译插件实现)。

接着我们来补充一下目前缺少的常量:

```js
// src/node/constants.ts
export const DEFAULT_EXTERSIONS = ['.tsx', '.ts', '.jsx', 'js']
```

#### 2.Esbuild 语法编译插件

这个插件的作用比较好理解，就是将 JS/TS/JSX/TSX 编译成浏览器可以识别的 JS 语法，可以利用 Esbuild 的 Transform API 来实现。你可以新建 `src/node/plugins/esbuild.ts` 文件，内容如下:

```js
import { readFile } from "fs-extra"; import { Plugin } from "../plugin"; import { isJSRequest } from "../utils"; import esbuild from "esbuild";
import path from "path";
export function esbuildTransformPlugin(): Plugin { return {
name: "m-vite:esbuild-transform", // 加载模块
async load(id) {
if (isJSRequest(id)) { try {
const code = await readFile(id, "utf-8");
return code; } catch (e) {
return null; }
} },
async transform(code, id) { if (isJSRequest(id)) {
const extname = path.extname(id).slice(1);
const { code: transformedCode, map } = await esbuild.transform(code, {
target: "esnext",
format: "esm",
sourcemap: true,
loader: extname as "js" | "ts" | "jsx" | "tsx",
}); return {
          code: transformedCode,
map, };
}
return null; },
}; }
```

#### 3.import 分析插件

在将 TSX 转换为浏览器可以识别的语法之后，是不是就可以直接返回给浏览器执行了呢?

显然不是，我们还考虑如下的一些问题:

- 对于第三方依赖路径(bare import)，需要重写为预构建产物路径
- 对于绝对路径和相对路径，需要借助之前的路径解析插件进行解析

好，接下来，我们就在 import 分析插件中一一解决这些问题:

```js
// 新建 src/node/plugins/importAnalysis.ts import { init, parse } from "es-module-lexer"; import {
  BARE_IMPORT_RE,
  DEFAULT_EXTERSIONS,
  PRE_BUNDLE_DIR,
} from "../constants"; import {
cleanUrl,
isJSRequest,
} from "../utils";
// magic-string 用来作字符串编辑
import MagicString from "magic-string";
import path from "path";
import { Plugin } from "../plugin";
import { ServerContext } from "../server/index"; import { pathExists } from "fs-extra";
import resolve from "resolve";
export function importAnalysisPlugin(): Plugin { let serverContext: ServerContext;
return {
name: "m-vite:import-analysis", configureServer(s) {
// 保存服务端上下文
      serverContext = s;
    },
async transform(code: string, id: string) { // 只处理 JS 相关的请求
if (!isJSRequest(id)) {
return null; }
await init;
// 解析 import 语句
const [imports] = parse(code); const ms = new MagicString(code); // 对每一个 import 语句依次进行分析 for (const importInfo of imports) {
// 举例说明: const str = `import React from 'react'`
// str.slice(s, e) => 'react'
const { s: modStart, e: modEnd, n: modSource } = importInfo; if (!modSource) continue;
// 第三方库: 路径重写到预构建产物的路径
if (BARE_IMPORT_RE.test(modSource)) {
const bundlePath = path.join( serverContext.root, PRE_BUNDLE_DIR, `${modSource}.js`
);
ms.overwrite(modStart, modEnd, bundlePath);
} else if (modSource.startsWith(".") || modSource.startsWith("/")) {
// 直接调用插件上下文的 resolve 方法，会自动经过路径解析插件的处理 const resolved = await this.resolve(modSource, id);
if (resolved) {
            ms.overwrite(modStart, modEnd, resolved.id);
          }
}
}

return {
code: ms.toString(), // 生成 SourceMap
map: ms.generateMap(),

}; },

}; }
```

现在，我们便完成了 JS 代码的 import 分析工作。接下来，我们把上面实现的三个插件进行注册:

```js
// src/node/plugin/index.ts
import { esbuildTransformPlugin } from "./esbuild"; import { importAnalysisPlugin } from "./importAnalysis"; import { resolvePlugin } from "./resolve";
import { Plugin } from "../plugin";
export function resolvePlugins(): Plugin[] {
return [resolvePlugin(), esbuildTransformPlugin(), importAnalysisPlugin()];
}
```

然后在 `playground` 项目下执行 `pnpm dev` ，在浏览器里面访问 http://localhost:3000 ，你可以在网络面板中发现 `main.tsx` 的内容以及被编译为下面这样:

同时，页面内容也能被渲染出来了:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311112314722.png)

### CSS 编译插件

首先，我们可以看看项目中 CSS 代码是如何被引入的:

```js
// playground/src/main.tsx
import './index.css'
```

为了让 CSS 能够在 no-bundle 服务中正常加载，我们需要将其包装成浏览器可以识别的模块格式，也就是 `JS 模块` ，其中模块加载和转换的逻辑我们可以通过插件来实现。当然，首先我们需要在 transform 中间件中允许对 CSS 的请求进行处理，代码如下:

```js
// src/node/server/middlewares/transform.ts // 需要增加的导入语句
+ import { isCSSRequest } from '../../utils';
export function transformMiddleware(
  serverContext: ServerContext
): NextHandleFunction {
  return async (req, res, next) => {
    if (req.method !== "GET" || !req.url) {
      return next();
    }
    const url = req.url;
    debug("transformMiddleware: %s", url);
    // transform JS request
     if (isJSRequest(url)) {
     if (isJSRequest(url) || isCSSRequest(url)) {
// 后续代码省略 }
next(); };
}
```

然后我们来补充对应的工具函数：

```js
// src/node/utils.ts
export const isCSSRequest = (id: string): boolean => cleanUrl(id).endsWith(".css");
```

现在我们来开发 CSS 的编译插件，你可以新建 `src/node/plugins/css.ts` 文件，内容如下：

```js
import { readFile } from "fs-extra"; import { Plugin } from "../plugin";
export function cssPlugin(): Plugin { return {
name: "m-vite:css", load(id) {
// 加载
if (id.endsWith(".css")) {
return readFile(id, "utf-8"); }
},
// 转换逻辑
async transform(code, id) {
if (id.endsWith(".css")) { // 包装成 JS 模块
const jsContent = `
const css = "${code.replace(/\n/g, "")}"; const style = document.createElement("style"); style.setAttribute("type", "text/css"); style.innerHTML = css; document.head.appendChild(style);
export default css;
`.trim();
return {
code: jsContent,
}; }
return null; },
};
}
```

这个插件的逻辑比较简单，主要是将封装一层 JS 样板代码，将 CSS 包装成一个 ES 模块，当浏览器执行这个模块的时候，会通过一个 style 标签将 CSS 代码作用到页面中，从而使样式代码生效。

接着我们来注册这个 CSS 插件：

```js
// src/node/plugins/index.ts
import { cssPlugin } from "./css";
export function resolvePlugins(): Plugin[] {
  return [
 }
// 省略前面的插件
cssPlugin(),
];
```

现在，你可以通过 `pnpm dev` 来启动 playground 项目，不过在启动之前，需要保证 TSX 文件已经引入了对应的 CSS 文件:

```js
// playground/src/main.tsx
import './index.css'
// playground/src/App.tsx
import './App.css'
```

在启动项目后，打开浏览器进行访问，可以看到样式已经正常生效:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311112319459.png)

### 静态资源加载

在完成 CSS 加载之后，我们现在继续完成静态资源的加载。以 playground 项目为例，我们来支持 svg 文件的加载。首先，我们看看 svg 文件是如何被引入并使用的:

```js
// playground/src/App.tsx
import logo from './logo.svg'
function App() {
  return (
    <img
      className="App-logo"
      src={logo}
      alt=""
    />
  )
}
```

站在 no-bundle 服务的角度，从如上的代码我们可以分析出静态资源的两种请求:

- import 请求。如 `import logo from "./logo.svg"`
- 资源内容请求。如 img 标签将资源 url 填入 src，那么浏览器会请求具体的资源内容

因此，接下来为了实现静态资源的加载，我们需要做两手准备: 对静态资源的 import 请求返回资源的 url;对于具体内容的请求，读取静态资源的文件内容，并响应给浏览器。

首先处理 import 请求，我们可以在 TSX 的 import 分析插件中，给静态资源相关的 import 语句做一个标记:

```js
// src/node/plugins/importAnalysis.ts
async transform(code, id) {
// 省略前面的代码
for (const importInfo of imports) {
+ + + + + +
}
const { s: modStart, e: modEnd, n: modSource } = importInfo;
if (!modSource) continue;
// 静态资源
if (modSource.endsWith(".svg")) {
} }
// 加上 ?import 后缀
const resolvedUrl = path.join(path.dirname(id), modSource); ms.overwrite(modStart, modEnd, `${resolvedUrl}?import`);
continue;
```

编译后的 App.tsx 内容如下:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311112321816.png)

接着浏览器会发出带有 `?import ` 后缀的请求，我们在 transform 中间件进行处理:

```js
// src/node/server/middlewares/transform.ts
// 需要增加的导入语句
+ import { isImportRequest } from '../../utils';
export function transformMiddleware(
  serverContext: ServerContext
): NextHandleFunction {
  return async (req, res, next) => {
    if (req.method !== "GET" || !req.url) {
      return next();
    }
    const url = req.url;
    debug("transformMiddleware: %s", url);
    // transform JS request
     if (isJSRequest(url) || isCSSRequest(url)) {
     if (isJSRequest(url) || isCSSRequest(url) || isImportRequest(url)) {
// 后续代码省略 }
next(); };
}
```

然后补充对应的工具函数:

```js
// src/node/utils.ts
export function isImportRequest(url: string): boolean { return url.endsWith("?import");
}
```

此时，我们就可以开发静态资源插件了。新建 `src/node/plugins/assets.ts` ，内容如下:

```js
import { Plugin } from "../plugin";
import { cleanUrl, removeImportQuery } from "../utils";
export function assetPlugin(): Plugin { return {
name: "m-vite:asset", async load(id) {
const cleanedId = removeImportQuery(cleanUrl(id)); // 这里仅处理 svg
if (cleanedId.endsWith(".svg")) {
return {
// 包装成一个 JS 模块
code: `export default "${cleanedId}"`,
}; }
}, };
}
```

接着来注册这个插件:

```js
// src/node/plugins/index.ts
+ import { assetPlugin } from "./assets";
export function resolvePlugins(): Plugin[] {
  return [
+ }
// 省略前面的插件 assetPlugin(),
];
```

OK，目前我们处理完了静态资源的 import 请求，接着我们还需要处理非 import 请求，返回资源的具体内容。我们可以通过一个中间件来进行处理:

```js
// src/node/server/middlewares/static.ts
import { NextHandleFunction } from "connect"; import { isImportRequest } from "../../utils"; // 一个用于加载静态资源的中间件
import sirv from "sirv";
export function staticMiddleware(): NextHandleFunction { const serveFromRoot = sirv("/", { dev: true });
return async (req, res, next) => {
if (!req.url) { return;
}
// 不处理 import 请求
if (isImportRequest(req.url)) {
return; }
serveFromRoot(req, res, next); };
}
```

然后在服务中注册这个中间件:

```js
// src/node/server/index.ts
// 需要添加的引入语句
+ import { staticMiddleware } from "./middlewares/static";
export async function startDevServer() { // 前面的代码省略
+  app.use(staticMiddleware());
app.listen(3000, async () => { // 省略实现
}); }
```

现在，你可以通过 `pnpm dev` 启动 playground 项目，在浏览器中访问，可以发现 `svg` 图片已经能够成功显示了:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311112324066.png)

其实不光是 svg 文件，几乎所有格式的静态资源都可以按照如上的思路进行处理:

通过加入 `?import` 后缀标识 import 请求，返回将静态资源封装成一个 JS 模块，即 `export default xxx` 的形式，导出资源的真实地址。

对非 import 请求，响应静态资源的具体内容，通过 `Content-Type` 响应头告诉浏览器资源的类型(这部分工作 sirv 中间件已经帮我们做了)。

### HMR 实现

#### 模块依赖图开发

模块依赖图在 no-bundle 构建服务中是一个不可或缺的数据结构，一方面可以存储各个模块的信息，用于记录编译缓存，另一方面也可以记录各个模块间的依赖关系，用于实现 HMR。

接下来我们来实现模块依赖图，即 `ModuleGraph` 类，新建 `src/node/ModuleGraph.ts` ，内容如下:

```js
import { PartialResolvedId, TransformResult } from "rollup"; import { cleanUrl } from "./utils";
export class ModuleNode { // 资源访问 url
url: string;
// 资源绝对路径
id: string | null = null;
importers = new Set<ModuleNode>(); importedModules = new Set<ModuleNode>(); transformResult: TransformResult | null = null; lastHMRTimestamp = 0;
constructor(url: string) {
    this.url = url;
  }
}
export class ModuleGraph {
// 资源 url 到 ModuleNode 的映射表 urlToModuleMap = new Map<string, ModuleNode>(); // 资源绝对路径到 ModuleNode 的映射表 idToModuleMap = new Map<string, ModuleNode>();
constructor(
private resolveId: (url: string) => Promise<PartialResolvedId | null>
) {}
getModuleById(id: string): ModuleNode | undefined { return this.idToModuleMap.get(id);
}
async getModuleByUrl(rawUrl: string): Promise<ModuleNode | undefined> { const { url } = await this._resolve(rawUrl);
return this.urlToModuleMap.get(url);
}
async ensureEntryFromUrl(rawUrl: string): Promise<ModuleNode> { const { url, resolvedId } = await this._resolve(rawUrl);
// 首先检查缓存
if (this.urlToModuleMap.has(url)) {
return this.urlToModuleMap.get(url) as ModuleNode; }
// 若无缓存，更新 urlToModuleMap 和 idToModuleMap
const mod = new ModuleNode(url);
mod.id = resolvedId; this.urlToModuleMap.set(url, mod); this.idToModuleMap.set(resolvedId, mod); return mod;
}
async updateModuleInfo(
mod: ModuleNode,
importedModules: Set<string | ModuleNode>
){
const prevImports = mod.importedModules; for (const curImports of importedModules) {
const dep =
typeof curImports === "string"
? await this.ensureEntryFromUrl(cleanUrl(curImports))
: curImports; if (dep) {
mod.importedModules.add(dep);
dep.importers.add(mod); }
}
// 清除已经不再被引用的依赖
for (const prevImport of prevImports) {
if (!importedModules.has(prevImport.url)) { prevImport.importers.delete(mod);
} }
}
// HMR 触发时会执行这个方法 invalidateModule(file: string) {
const mod = this.idToModuleMap.get(file); if (mod) {
// 更新时间戳
mod.lastHMRTimestamp = Date.now(); mod.transformResult = null; mod.importers.forEach((importer) => {
this.invalidateModule(importer.id!); });
} }
private async _resolve( url: string
): Promise<{ url: string; resolvedId: string }> { const resolved = await this.resolveId(url); const resolvedId = resolved?.id || url;
return { url, resolvedId };
} }
```

首先在服务启动前，我们需要初始化 ModuleGraph 实例:

```diff
// src/node/server/index.ts
+ import { ModuleGraph } from "../ModuleGraph";
export interface ServerContext {
  root: string;
  pluginContainer: PluginContainer;
  app: connect.Server;
  plugins: Plugin[];
+  moduleGraph: ModuleGraph;
}
export async function startDevServer() {
+  const moduleGraph = new ModuleGraph((url) => pluginContainer.resolveId(url));
  const pluginContainer = createPluginContainer(plugins);
  const serverContext: ServerContext = {
    root: process.cwd(),
    app,
    pluginContainer,
    plugins,
+    moduleGraph
  };
}
```

然后在加载完模块后，也就是调用插件容器的 load 方法后，我们需要通过 `ensureEntryFromUrl` 方法注册模块:

```js
// src/node/server/middlewares/transform.ts
let code = await pluginContainer.load(resolvedResult.id); if (typeof code === "object" && code !== null) {
  code = code.code;
}
+ const { moduleGraph }  = serverContext;
+ mod = await moduleGraph.ensureEntryFromUrl(url);
```

当我们对 JS 模块分析完 import 语句之后，需要更新模块之间的依赖关系:

```diff
// src/node/plugins/importAnalysis.ts
export function importAnalysis() {
+ + +
return {
  transform(code: string, id: string) {
// 省略前面的代码
const { moduleGraph } = serverContext;
const curMod = moduleGraph.getModuleById(id)!; const importedModules = new Set<string>();
for(const importInfo of imports) {
// 省略部分代码
if (BARE_IMPORT_RE.test(modSource)) {
// 省略部分代码
} }
       importedModules.add(bundlePath);
    } else if (modSource.startsWith(".") || modSource.startsWith("/")) {
      const resolved = await resolve(modSource, id);
      if (resolved) {
        ms.overwrite(modStart, modEnd, resolved);
         importedModules.add(resolved);
  }
   moduleGraph.updateModuleInfo(curMod, importedModules);
// 省略后续 return 代码 }
```

现在，一个完整的模块依赖图就能随着 JS 请求的到来而不断建立起来了。另外，基于现在的模块依赖图，我们也可以记录模块编译后的产物，并进行缓存。让我们回到 transform 中间件中:

```js
export async function transformRequest(
  url: string,
  serverContext: ServerContext
){
const { moduleGraph, pluginContainer } = serverContext; url = cleanUrl(url);
+ let mod = await moduleGraph.getModuleByUrl(url); + if (mod && mod.transformResult) {
+ return mod.transformResult;
+}
  const resolvedResult = await pluginContainer.resolveId(url);
  let transformResult;
  if (resolvedResult?.id) {
let code = await pluginContainer.load(resolvedResult.id); if (typeof code === "object" && code !== null) {
      code = code.code;
    }
    mod = await moduleGraph.ensureEntryFromUrl(url);
    if (code) {
      transformResult = await pluginContainer.transform(
        code as string,
        resolvedResult?.id
); }
}
+ if (mod) {
+ mod.transformResult = transformResult; +}
  return transformResult;
}
```

在搭建好模块依赖图之后，我们把目光集中到最重要的部分——HMR 上面。

#### HMR 服务端

HMR 在服务端需要完成如下的工作:

- 创建文件监听器，以监听文件的变动
- 创建 WebSocket 服务端，负责和客户端进行通信
- 文件变动时，从 ModuleGraph 中定位到需要更新的模块，将更新信息发送给客户端

首先，我们来创建文件监听器:

```js
// src/node/server/index.ts
import chokidar, { FSWatcher } from 'chokidar'
export async function startDevServer() {
  const watcher = chokidar.watch(root, {
    ignored: ['**/node_modules/**', '**/.git/**'],
    ignoreInitial: true
  })
}
```

接着初始化 WebSocket 服务端，新建 `src/node/ws.ts `，内容如下:

```js
import connect from "connect";
import { red } from "picocolors";
import { WebSocketServer, WebSocket } from "ws"; import { HMR_PORT } from "./constants";
export function createWebSocketServer(server: connect.Server): { send: (msg: string) => void;
close: () => void;
}{
let wss: WebSocketServer;
wss = new WebSocketServer({ port: HMR_PORT });
wss.on("connection", (socket) => {
socket.send(JSON.stringify({ type: "connected" })); });
wss.on("error", (e: Error & { code: string }) => { if (e.code !== "EADDRINUSE") {
console.error(red(`WebSocket server error:\n${e.stack || e.message}`)); }
});
return {
send(payload: Object) {
const stringified = JSON.stringify(payload);
wss.clients.forEach((client) => {
if (client.readyState === WebSocket.OPEN) { client.send(stringified);
}
}); },
close() { wss.close();
}, };
}
```

同时定义 `HMR_PORT` 常量:

```js
// src/node/constants.ts
export const HMR_PORT = 24678
```

接着我们将 WebSocket 服务端实例加入 no-bundle 服务中:

```diff
// src/node/server/index.ts
export interface ServerContext {
  root: string;
  pluginContainer: PluginContainer;
  app: connect.Server;
  plugins: Plugin[];
  moduleGraph: ModuleGraph;
+  ws: { send: (data: any) => void; close: () => void };
+  watcher: FSWatcher;
}
export async function startDevServer() { + // WebSocket 对象
+ const ws = createWebSocketServer(app);
// // 开发服务器上下文
const serverContext: ServerContext = {
    root: process.cwd(),
    app,
    pluginContainer,
    plugins,
    moduleGraph,
+    ws,
+    watcher
};
}
```

下面我们来实现当文件变动时，服务端具体的处理逻辑，新建 `src/node/hmr.ts` :

```js
import { ServerContext } from "./server/index";
import { blue, green } from "picocolors";
import { getShortName } from "./utils";
export function bindingHMREvents(serverContext: ServerContext) {
const { watcher, ws, root } = serverContext;
watcher.on("change", async (file) => {
console.log(` ${blue("[hmr]")}${green(file)}changed`); const { moduleGraph } = serverContext;
// 清除模块依赖图中的缓存
await moduleGraph.invalidateModule(file);
// 向客户端发送更新信息
ws.send({
      type: "update",
      updates: [
{
type: "js-update",
timestamp: Date.now(),
path: "/" + getShortName(file, root), acceptedPath: "/" + getShortName(file, root),
}, ],
}); });
}
```

注意补充一下缺失的工具函数:

```js
// src/node/utils.ts
export function getShortName(file: string, root: string) {
return file.startsWith(root + "/") ? path.posix.relative(root, file) : file;
}
```

接着我们在服务中添加如下代码:

```js
// src/node/server/index.ts
+  import { bindingHMREvents } from "../hmr";
// 开发服务器上下文
const serverContext: ServerContext = {
  root: process.cwd(),
  app,
  pluginContainer,
  plugins,
  moduleGraph,
ws,
watcher, };
+ bindingHMREvents(serverContext);
```

#### HMR 客户端

HMR 客户端指的是我们向浏览器中注入的一段 JS 脚本，这段脚本中会做如下的事情:

- 创建 WebSocket 客户端，用于和服务端通信
- 在收到服务端的更新信息后，通过动态 import 拉取最新的模块内容，执行 accept 更新回调
- 暴露 HMR 的一些工具函数，比如 import.meta.hot 对象的实现

首先我们来开发客户端的脚本内容，你可以新建 `src/client/client.ts` 文件，然后在 `tsup.config.ts` 中增加如下的配置:

```js
import { defineConfig } from "tsup";
export default defineConfig({
  entry: {
});
index: "src/node/cli.ts",
+  client: "src/client/client.ts",
},
```

> 注: 改动 tsup 配置之后，为了使最新配置生效，你需要在 `mini-vite` 项目中执行 `pnpm start` 重新进行构建

客户端脚本的具体实现如下:

```js
// src/client/client.ts
console.log("[vite] connecting...");
// 1. 创建客户端 WebSocket 实例
// 其中的 __HMR_PORT__ 之后会被 no-bundle 服务编译成具体的端口号
const socket = new WebSocket(`ws://localhost:__HMR_PORT__`, "vite-hmr");
// 2. 接收服务端的更新信息 socket.addEventListener("message", async ({ data }) => {
handleMessage(JSON.parse(data)).catch(console.error); });
// 3. 根据不同的更新类型进行更新
async function handleMessage(payload: any) {
switch (payload.type) { case "connected":
console.log(`[vite] connected.`);
// 心跳检测
setInterval(() => socket.send("ping"), 1000); break;
case "update":
// 进行具体的模块更新 payload.updates.forEach((update: Update) => {
if (update.type === "js-update") { // 具体的更新逻辑，后续来开发
}
});
break; }
}
```

关于客户端具体的 JS 模块更新逻辑和工具函数的实现，你暂且不用过于关心。我们先把这段比较简单的 HMR 客户端代码注入到浏览器中，首先在新建 `src/node/plugins/clientInject.ts` ，内容如下:

```js
import { CLIENT_PUBLIC_PATH, HMR_PORT } from "../constants"; import { Plugin } from "../plugin";
import fs from "fs-extra";
import path from "path";
import { ServerContext } from "../server/index";
export function clientInjectPlugin(): Plugin { let serverContext: ServerContext;
return {
name: "m-vite:client-inject", configureServer(s) {
      serverContext = s;
    },
resolveId(id) {
if (id === CLIENT_PUBLIC_PATH) {
return { id }; }
return null; },
async load(id) {
// 加载 HMR 客户端脚本
if (id === CLIENT_PUBLIC_PATH) {
const realPath = path.join( serverContext.root, "node_modules", "mini-vite",
"dist",
          "client.mjs"
);
const code = await fs.readFile(realPath, "utf-8"); return {
// 替换占位符
code: code.replace("__HMR_PORT__", JSON.stringify(HMR_PORT)), };
} },
transformIndexHtml(raw) {
// 插入客户端脚本
// 即在 head 标签后面加上 <script type="module" src="/@vite/client"></script> // 注: 在 indexHtml 中间件里面会自动执行 transformIndexHtml 钩子
return raw.replace(
        /(<head[^>]*>)/i,
        `$1<script type="module" src="${CLIENT_PUBLIC_PATH}"></script>`
      );
},
}}
```

同时添加相应的常量声明:

```js
// src/node/constants.ts
export const CLIENT_PUBLIC_PATH = '/@vite/client'
```

接着我们来注册这个插件:

```js
// src/node/plugins/index.ts
+ import { clientInjectPlugin } from './clientInject';
export function resolvePlugins(): Plugin[] {
  return [
+ }
clientInjectPlugin() // 省略其它插件
]
```

需要注意的是， `clientInject` 插件最好放到最前面的位置，以免后续插件的 load 钩子干扰客户端脚本的加载。

接下来你可以在 playground 项目下执行 `pnpm dev` ，然后查看页面，可以发现控制台出现了如下的 log 信息

![](https://my-vitepress-blog.sh1a.qingstor.com/202311120010443.png)

查看网络面板，也能发现客户端脚本的请求被正常响应:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311120011612.png)

OK，接下来我们就来继续完善客户端脚本的具体实现。

值得一提的是，之所以我们可以在代码中编写类似 `import.meta.hot.xxx` 之类的方法，是因为 Vite 帮我们在模块最顶层注入了 `import.meta.hot` 对象，而这个对象由 `createHotContext` 来实现，具体的注入代码如下所示:

```js
import { createHotContext as __vite__createHotContext } from '/@vite/client'
import.meta.hot = __vite__createHotContext('/src/App.tsx')
```

下面我们在 import 分析插件中做一些改动，实现插入这段代码的功能:

```js
import { init, parse } from "es-module-lexer";
import {
  BARE_IMPORT_RE,
  CLIENT_PUBLIC_PATH,
  PRE_BUNDLE_DIR,
} from "../constants";
import {
  cleanUrl,
+  getShortName,
  isJSRequest,
} from "../utils";
import MagicString from "magic-string";
import path from "path";
import { Plugin } from "../plugin";
import { ServerContext } from "../server/index";
export function importAnalysisPlugin(): Plugin {
  let serverContext: ServerContext;
  return {
+
name: "m-vite:import-analysis",
configureServer(s) {
  serverContext = s;
},
async transform(code: string, id: string) {
   if (!isJSRequest(id) || isInternalRequest(id)) {
    return null;
  }
  await init;
  const importedModules = new Set<string>();
  const [imports] = parse(code);
  const ms = new MagicString(code);
+
+
+
+
+        );
+        if (!resolved) {
const resolve = async (id: string, importer?: string) => {
  const resolved = await this.resolve(
id, importer
+}
+        const cleanedId = cleanUrl(resolved.id);
+        const mod = moduleGraph.getModuleById(cleanedId);
+        let resolvedId = `/${getShortName(resolved.id, serverContext.root)}`;
+        if (mod && mod.lastHMRTimestamp > 0) {
return;
+
+}
+ return resolvedId; + };
resolvedId += "?t=" + mod.lastHMRTimestamp;
const { moduleGraph } = serverContext;
const curMod = moduleGraph.getModuleById(id)!;
for (const importInfo of imports) {
const { s: modStart, e: modEnd, n: modSource } = importInfo; if (!modSource || isInternalRequest(modSource)) continue;
// 静态资源
if (modSource.endsWith(".svg")) {
// 加上 ?import 后缀
const resolvedUrl = path.join(path.dirname(id), modSource); ms.overwrite(modStart, modEnd, `${resolvedUrl}?import`); continue;
}
// 第三方库: 路径重写到预构建产物的路径 if (BARE_IMPORT_RE.test(modSource)) {
    const bundlePath = path.join(
      serverContext.root,
      PRE_BUNDLE_DIR,
      `${modSource}.js`
    );
    ms.overwrite(modStart, modEnd, bundlePath);
    importedModules.add(bundlePath);
  } else if (modSource.startsWith(".") || modSource.startsWith("/")) {
     const resolved = await resolve(modSource, id);
    if (resolved) {
      ms.overwrite(modStart, modEnd, resolved);
      importedModules.add(resolved);
} }
}
// 只对业务源码注入
+
+
+
+
+
+
+
+ ); +}
if (!id.includes("node_modules")) { // 注入 HMR 相关的工具函数 ms.prepend(
`import { createHotContext as __vite__createHotContext } from "${CLIENT_PUBLIC_PAT
  `import.meta.hot = __vite__createHotContext(${JSON.stringify(
    cleanUrl(curMod.url)
  )});`
      moduleGraph.updateModuleInfo(curMod, importedModules);
      return {
        code: ms.toString(),
        map: ms.generateMap(),
}; },
}; }
```

接着启动 playground，打开页面后你可以发现 import.meta.hot 的实现代码已经被成功插入：

![](https://my-vitepress-blog.sh1a.qingstor.com/202311120015373.png)

现在，我们回到客户端脚本的实现中，来开发 `createHotContext` 这个工具方法:

```js
interface HotModule {
id: string;
callbacks: HotCallback[];
}
interface HotCallback {
deps: string[];
fn: (modules: object[]) => void;
}
// HMR 模块表
const hotModulesMap = new Map<string, HotModule>();
// 不在生效的模块表
const pruneMap = new Map<string, (data: any) => void | Promise<void>>();
export const createHotContext = (ownerPath: string) => { const mod = hotModulesMap.get(ownerPath);
if (mod) {
    mod.callbacks = [];
  }
function acceptDeps(deps: string[], callback: any) {
const mod: HotModule = hotModulesMap.get(ownerPath) || {
      id: ownerPath,
      callbacks: [],
    };
// callbacks 属性存放 accept 的依赖、依赖改动后对应的回调逻辑 mod.callbacks.push({
deps,
      fn: callback,
    });
hotModulesMap.set(ownerPath, mod); }
return {
accept(deps: any, callback?: any) {
// 这里仅考虑接受自身模块更新的情况
// import.meta.hot.accept()
if (typeof deps === "function" || !deps) {
acceptDeps([ownerPath], ([mod]) => deps && deps(mod)); }
},
// 模块不再生效的回调
// import.meta.hot.prune(() => {}) prune(cb: (data: any) => void) {
pruneMap.set(ownerPath, cb); },
}; };
```

在 accept 方法中，我们会用 `hotModulesMap` 这张表记录该模块所 accept 的模块，以及 accept 的模块更新之后回调逻辑。

接着，我们来开发客户端热更新的具体逻辑，也就是服务端传递更新内容之后客户端如何来派发更新。实现代码如下:

```js
async function fetchUpdate({ path, timestamp }: Update) { const mod = hotModulesMap.get(path);
if (!mod) return;
const moduleMap = new Map();
const modulesToUpdate = new Set<string>(); modulesToUpdate.add(path);
await Promise.all( Array.from(modulesToUpdate).map(async (dep) => {
const [path, query] = dep.split(`?`); try {
// 通过动态 import 拉取最新模块 const newMod = await import(
          path + `?t=${timestamp}${query ? `&${query}` : ""}`
        );
moduleMap.set(dep, newMod); } catch (e) {}
}) );
return () => {
// 拉取最新模块后执行更新回调
for (const { deps, fn } of mod.callbacks) {
fn(deps.map((dep: any) => moduleMap.get(dep))); }
console.log(`[vite] hot updated: ${path}`); };
}
```

现在，我们可以来初步测试一下 HMR 的功能，你可以暂时将 main.tsx 的内容换成下面这样：

```js
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
const App = () => <div>hello 123123</div>
ReactDOM.render(<App />, document.getElementById('root'))
// @ts-ignore
import.meta.hot.accept(() => {
  ReactDOM.render(<App />, document.getElementById('root'))
})
```

启动 playground，然后打开浏览器，可以看到如下的文本:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311120017258.png)

现在回到编辑器中，修改文本内容，然后保存，你可以发现页面内容也跟着发生了变化，并且网络面板发出了拉取最新模块的请求，说明 HMR 已经成功生效:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311120018593.png)

同时，当你再次刷新页面，看到的仍然是最新的页面内容。这一点非常重要，之所以能达到这样的效果，是因为我们在文件改动后会调用 ModuleGraph 的 invalidateModule 方法，这个方法会清除热更模块以及所有上层引用方模块的编译缓存:

```js
// 方法实现 invalidateModule(file: string) {
const mod = this.idToModuleMap.get(file); if (mod) {
mod.lastHMRTimestamp = Date.now(); mod.transformResult = null; mod.importers.forEach((importer) => {
this.invalidateModule(importer.id!); });
} }
```

这样每次经过 HMR 后，再次刷新页面，渲染出来的一定是最新的模块内容。

当然，我们也可以对 CSS 实现热更新功能，在客户端脚本中添加如下的工具函数:

```js
const sheetsMap = new Map();
export function updateStyle(id: string, content: string) {
let style = sheetsMap.get(id); if (!style) {
// 添加 style 标签
style = document.createElement("style");
style.setAttribute("type", "text/css"); style.innerHTML = content; document.head.appendChild(style);
} else {
// 更新 style 标签内容 style.innerHTML = content;
}
sheetsMap.set(id, style); }
export function removeStyle(id: string): void { const style = sheetsMap.get(id);
if (style) {
document.head.removeChild(style); }
sheetsMap.delete(id); }
```

紧接着我们调整一下 CSS 编译插件的代码:

```js
import { readFile } from "fs-extra";
import { CLIENT_PUBLIC_PATH } from "../constants"; import { Plugin } from "../plugin";
import { ServerContext } from "../server";
import { getShortName } from "../utils";
export function cssPlugin(): Plugin { let serverContext: ServerContext; return {
name: "m-vite:css", configureServer(s) { serverContext = s;
}, load(id) {
if (id.endsWith(".css")) { return readFile(id, "utf-8");
} },
// 主要变动在 transform 钩子中 async transform(code, id) {
if (id.endsWith(".css")) { // 包装成 JS 模块
const jsContent = `
import { createHotContext as __vite__createHotContext } from "${CLIENT_PUBLIC_PATH}";
import.meta.hot = __vite__createHotContext("/${getShortName(id, serverContext.root)}");
import { updateStyle, removeStyle } from "${CLIENT_PUBLIC_PATH}"
const id = '${id}';
const css = '${code.replace(/\n/g, "")}';
updateStyle(id, css);
import.meta.hot.accept();
export default css;
import.meta.hot.prune(() => removeStyle(id));`.trim();
return {
code: jsContent,
}; }
return null; },
}; }
```

最后，你可以重启 playground 项目，本地尝试修改 CSS 代码，可以看到热更新效果。

## 手写 Bundler: 实现 JavaScript AST 解析器——词法分析、语义分析

### 搭建开发测试环境

首先通过 `pnpm init -y` 新建项目，安装测试工具 `vitest` :

```js
pnpm i vitest -D
```

新建 `src/__test__` 目录，之后所有的测试代码都会放到这个目录中。我们不妨先尝试编写一个测试文件：

```js
// src/__test__/example.test.ts
import { describe, test, expect } from 'vitest'
describe('example test', () => {
  test('should return correct result', () => {
    expect(2 + 2).toBe(4)
  })
})
```

然后在 `.packagejson` 中增加如下的 `scripts` :

```js
"test": "vitest"
```

接着在命令行执行，如果你可以看到如下的终端界面，说明测试环境已经搭建成功：

![](https://my-vitepress-blog.sh1a.qingstor.com/202311120026026.png)

### 词法分析器开发

接下来，我们正式进入 AST 解析器的开发，主要分为两个部分来进行: `词法分析器` 和 `语法分析器`

首先是词法分析器，也叫分词器(Tokenizer)，它的作用是将代码划分为一个个词法单元，便于进行后续的语法分析，比如下面的这段代码：

```js
let foo = function () {}
```

在经过分词之后，代码会被切分为如下的 token 数组:

```js
;['let', 'foo', '=', 'function', '(', ')', '{', '}']
```

从中你可以看到，原本一行普通的代码字符串被拆分成了拥有语法属性的 token 列表，不同的 token 之间也存在千丝万缕的联系，而后面所要介绍的 `语法分析器` ，就是来梳理各个 token 之间的联系，整理出 AST 数据结构。

当下我们所要实现的词法分析器，本质上是 `对代码字符串进行逐个字符的扫描，然后根据 一定的语法规则进行分组`。其中，涉及到几个关键的步骤:

- 确定语法规则，包括语言内置的关键词、单字符、分隔符等
- 逐个代码字符扫描，根据语法规则进行 token 分组

接下来我们以一个简单的语法为例，来初步实现如上的关键流程。需要解析的示例代码如下:

```js
let fo = function () {}
```

#### 1.确定语法规则

新建 `src/Tokenizer.ts` ，首先声明一些必要的类型:

```js
export enum TokenType { // let
Let = "Let",
// =
Assign = "Assign",
// function
Function = "Function", // 变量名
Identifier = "Identifier", // (
LeftParen = "LeftParen", // )
RightParen = "RightParen", // {
LeftCurly = "LeftCurly", // }
RightCurly = "RightCurly", }
export type Token = { type: TokenType; value?: string; start: number;
end: number;
  raw?: string;
};
```

然后定义 Token 的生成器对象:

```js
const TOKENS_GENERATOR: Record<string, (...args: any[]) => Token> = {
let(start: number) {
return { type: TokenType.Let, value: "let", start, end: start + 3 }; },
assign(start: number) {
return { type: TokenType.Assign, value: "=", start, end: start + 1 };
},
function(start: number) {
return {
type: TokenType.Function, value: "function",
start,
end: start + 8,
}; },
leftParen(start: number) {
return { type: TokenType.LeftParen, value: "(", start, end: start + 1 };
},
rightParen(start: number) {
return { type: TokenType.RightParen, value: ")", start, end: start + 1 }; },
leftCurly(start: number) {
return { type: TokenType.LeftCurly, value: "{", start, end: start + 1 };
},
rightCurly(start: number) {
return { type: TokenType.RightCurly, value: "}", start, end: start + 1 }; },
identifier(start: number, value: string) { return {
type: TokenType.Identifier, value,
start,
end: start + value.length,
}; },
}
type SingleCharTokens = "(" | ")" | "{" | "}" | "=";
// 单字符到 Token 生成器的映射
const KNOWN_SINGLE_CHAR_TOKENS = new Map<
SingleCharTokens,
typeof TOKENS_GENERATOR[keyof typeof TOKENS_GENERATOR] >([
  ["(", TOKENS_GENERATOR.leftParen],
  [")", TOKENS_GENERATOR.rightParen],
  ["{", TOKENS_GENERATOR.leftCurly],
  ["}", TOKENS_GENERATOR.rightCurly],
  ["=", TOKENS_GENERATOR.assign],
]);
```

#### 2.代码字符扫描、分组

现在我们开始实现 Tokenizer 对象:

```js
export class Tokenizer {
private _tokens: Token[] = []; private _currentIndex: number = 0; private _source: string; constructor(input: string) {
    this._source = input;
  }
tokenize(): Token[] {
while (this._currentIndex < this._source.length) {
let currentChar = this._source[this._currentIndex]; const startIndex = this._currentIndex;
// 根据语法规则进行 token 分组 }
return this._tokens; }
}
```

在扫描字符的过程，我们需要对不同的字符各自进行不同的处理，具体的策略如下:

- 当前字符为分隔符，如空格，直接跳过，不处理
- 当前字符为字母，需要继续扫描，获取完整的单词
  - 如果单词为语法关键字，则新建相应关键字的 Token
  - 否则视为普通的变量名
- 当前字符为单字符，如 { 、 } 、 ( 、 ) ，则新建单字符对应的 Token

接着我们在代码中实现:

```js
// while 循环内部
let currentChar = this._source[this._currentIndex]; const startIndex = this._currentIndex;
const isAlpha = (char: string): boolean => {
return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
}
// 1. 处理空格
if (currentChar === ' ') {
  this._currentIndex++;
continue; }
// 2. 处理字母
else if (isAlpha(currentChar)) {
let identifier = ''; while(isAlpha(currentChar)) {
    identifier += currentChar;
    this._currentIndex ++;
    currentChar = this._source[this._currentIndex];
}
let token: Token;
if (identifier in TOKENS_GENERATOR) { // 如果是关键字
token =
TOKENS_GENERATOR[identifier as keyof typeof TOKENS_GENERATOR]( startIndex
); } else {
// 如果是普通标识符
    token = TOKENS_GENERATOR["identifier"](startIndex, identifier);
  }
this._tokens.push(token);
continue; }
// 3. 处理单字符
else if(KNOWN_SINGLE_CHAR_TOKENS.has(currentChar as SingleCharTokens)) {
const token = KNOWN_SINGLE_CHAR_TOKENS.get( currentChar as SingleCharTokens
)!(startIndex); this._tokens.push(token); this._currentIndex++; continue;
}
```

OK，接下来我们来增加测试用例，新建 `src/__test__/tokenizer.test.ts` ，内容如下:

```js
describe('testTokenizerFunction', () => {
  test('test example', () => {
    const result = [
      { type: 'Let', value: 'let', start: 0, end: 3 },
      { type: 'Identifier', value: 'a', start: 4, end: 5 },
      { type: 'Assign', value: '=', start: 6, end: 7 },
      { type: 'Function', value: 'function', start: 8, end: 16 },
      { type: 'LeftParen', value: '(', start: 16, end: 17 },
      { type: 'RightParen', value: ')', start: 17, end: 18 },
      { type: 'LeftCurly', value: '{', start: 19, end: 20 },
      { type: 'RightCurly', value: '}', start: 20, end: 21 }
    ]
    const tokenizer = new Tokenizer('let a = function() {}')
    expect(tokenizer.tokenize()).toEqual(result)
  })
})
```

然后在终端执行 pnpm test ，可以发现如下的测试结果:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311120033948.png)

说明此时一个简易版本的分词器已经被我们开发出来了，不过目前的分词器还比较简陋，
仅仅支持有限的语法，不过在明确了核心的开发步骤之后，后面继续完善的过程就比较简
单了。

### 语法分析器开发

在解析出词法 token 之后，我们就可以进入语法分析阶段了。在这个阶段，我们会依次遍历 token，对代码进行语法结构层面的分析，最后的目标是生成 AST 数据结构。至于代码的 AST 结构到底是什么样子，你可以去 [AST Explorer](https://astexplorer.net/) 网站进行在线预览:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311120035131.png)

接下来，我们要做的就是将 token 数组转换为上图所示的 AST 数据

首先新建 `src/Parser.ts` ，添加如下的类型声明代码及 `Parser` 类的初始化代码:

```js
export enum NodeType {
Program = "Program",
VariableDeclaration = "VariableDeclaration", VariableDeclarator = "VariableDeclarator", Identifier = "Identifier", FunctionExpression = "FunctionExpression", BlockStatement = "BlockStatement",
}
export interface Identifier extends Node { type: NodeType.Identifier;
name: string;
}
interface Expression extends Node {} interface Statement extends Node {}
export interface Program extends Node { type: NodeType.Program;
body: Statement[];
}
export interface VariableDeclarator extends Node { type: NodeType.VariableDeclarator;
id: Identifier;
init: Expression;
}
export interface VariableDeclaration extends Node { type: NodeType.VariableDeclaration;
kind: "var" | "let" | "const";
declarations: VariableDeclarator[];
}
export interface FunctionExpression extends Node { type: NodeType.FunctionExpression;
id: Identifier | null;
params: Expression[] | Identifier[];
body: BlockStatement; }
export interface BlockStatement extends Node { type: NodeType.BlockStatement;
body: Statement[];
}
export type VariableKind = "let";
export class Parser {
private _tokens: Token[] = []; private _currentIndex = 0; constructor(token: Token[]) {
    this._tokens = [...token];
  }
  parse(): Program {
const program = this._parseProgram();
return program; }
private _parseProgram(): Program { const program: Program = {
type: NodeType.Program, body: [],
start: 0,
end: Infinity,
};
// 解析 token 数组
return program; }
}
```

从中你可以看出，解析 AST 的核心逻辑就集中在 `_parseProgram` 方法中，接下来让我们一步步完善一个方法：

```js
export class Parser { private _parseProgram {
// 省略已有代码
while (!this._isEnd()) {
const node = this._parseStatement(); program.body.push(node);
if (this._isEnd()) {
        program.end = node.end;
      }
}
return program; }
// token 是否已经扫描完 private _isEnd(): boolean {
return this._currentIndex >= this._tokens.length; }
// 工具方法，表示消费当前 Token，扫描位置移动到下一个 token private _goNext(type: TokenType | TokenType[]): Token {
const currentToken = this._tokens[this._currentIndex]; // 断言当前 Token 的类型，如果不能匹配，则抛出错误
if (Array.isArray(type)) {
if (!type.includes(currentToken.type)) { throw new Error(
`Expect ${type.join(",")}, but got ${currentToken.type}` );
}
} else {
if (currentToken.type !== type) {
throw new Error(`Expect ${type}, but got ${currentToken.type}`);
} }
    this._currentIndex++;
return currentToken; }
private _checkCurrentTokenType(type: TokenType | TokenType[]): boolean { if (this._isEnd()) {
return false; }
const currentToken = this._tokens[this._currentIndex]; if (Array.isArray(type)) {
return type.includes(currentToken.type); } else {
return currentToken.type === type; }
}
private _getCurrentToken(): Token { return this._tokens[this._currentIndex];
}
private _getPreviousToken(): Token {
return this._tokens[this._currentIndex - 1];
} }
```

一个程序(Program)实际上由各个语句(Statement)来构成，因此在 `_parseProgram` 逻辑中，我们主要做的就是扫描一个个语句，然后放到 Program 对象的 body 中。那么，接下来，我们将关注点放到语句的扫描逻辑上面。

从之前的示例代码:

```js
let a = function () {}
```

我们可以知道这是一个变量声明语句，那么现在我们就在 `_parseStatement` 中实现这类语句的解析:

```js
export enum NodeType {
Program = "Program",
VariableDeclarator = "VariableDeclarator",
}
export class Parser {
private _parseStatement(): Statement {
// TokenType 来自 Tokenizer 的实现中
if (this._checkCurrentTokenType(TokenType.Let)) {
return this._parseVariableDeclaration(); }
throw new Error("Unexpected token"); }
private _parseVariableDeclaration(): VariableDeclaration { // 获取语句开始位置
const { start } = this._getCurrentToken();
// 拿到 let
const kind = this._getCurrentToken().value;
this._goNext(TokenType.Let);
// 解析变量名 foo
const id = this._parseIdentifier();
// 解析函数表达式
const init = this._parseFunctionExpression(); const declarator: VariableDeclarator = {
type: NodeType.VariableDeclarator, id,
init,
start: id.start,
      end: init ? init.end : id.end,
    };
// 构造 Declaration 节点
const node: VariableDeclaration = {
type: NodeType.VariableDeclaration, kind: kind as VariableKind, declarations: [declarator],
start,
end: this._getPreviousToken().end, };
return node; }
}
```

接下来主要的代码解析逻辑可以梳理如下:

- 发现 `let` 关键词对应的 token，进入 `_parseVariableDeclaration`
- 解析变量名，如示例代码中的 `foo`
- 解析函数表达式，如示例代码中的 `function() {}`

其中，`解析变量名的过程我们通过_parseIdentifier` 方法实现，解析函数表达式的过程由 `_parseFunctionExpression` 来实现，代码如下:

```js
// 1. 解析变量名
private _parseIdentifier(): Identifier {
const token = this._getCurrentToken(); const identifier: Identifier = {
type: NodeType.Identifier, name: token.value!, start: token.start,
end: token.end,
}; this._goNext(TokenType.Identifier); return identifier;
}
// 2. 解析函数表达式
private _parseFunctionExpression(): FunctionExpression {
const { start } = this._getCurrentToken(); this._goNext(TokenType.Function);
let id = null;
if (this._checkCurrentTokenType(TokenType.Identifier)) { id = this._parseIdentifier();
}
const node: FunctionExpression = {
type: NodeType.FunctionExpression, id,
params: [],
body: {
type: NodeType.BlockStatement, body: [],
start: start,
end: Infinity,
    },
    start,
    end: 0,
};
return node; }
// 用于解析函数参数
private _parseParams(): Identifier[] | Expression[] {
// 消费 "("
this._goNext(TokenType.LeftParen);
const params = [];
// 逐个解析括号中的参数
while (!this._checkCurrentTokenType(TokenType.RightParen)) {
let param = this._parseIdentifier();
params.push(param); }
// 消费 ")"
this._goNext(TokenType.RightParen); return params;
}

// 用于解析函数体
private _parseBlockStatement(): BlockStatement {
const { start } = this._getCurrentToken(); const blockStatement: BlockStatement = {
type: NodeType.BlockStatement, body: [],
start,
end: Infinity,
};
// 消费 "{"
this._goNext(TokenType.LeftCurly);
while (!this._checkCurrentTokenType(TokenType.RightCurly)) {
// 递归调用 _parseStatement 解析函数体中的语句(Statement) const node = this._parseStatement(); blockStatement.body.push(node);
}
blockStatement.end = this._getCurrentToken().end; // 消费 "}"
this._goNext(TokenType.RightCurly);
return blockStatement;
}
```

OK，一个简易的 Parser 现在就已经搭建出来了，你可以用如下的测试用例看看程序运行的效果，代码如下:

```js
// src/__test__/parser.test.ts
describe('testParserFunction', () => {
  test('test example code', () => {
    const result = {
      type: 'Program',
      body: [
        {
          type: 'VariableDeclaration',
          kind: 'let',
          declarations: [
            {
              type: 'VariableDeclarator',
              id: {
                type: 'Identifier',
                name: 'a',
                start: 4,
                end: 5
              },
              init: {
                type: 'FunctionExpression',
                id: null,
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [],
                  start: 19,
                  end: 21
                },
                start: 8,
                end: 21
              },
              start: 0,
              end: 21
            }
          ],
          start: 0,
          end: 21
        }
      ],
      start: 0,
      end: 21
    }
    const code = `let a = function() {};`
    const tokenizer = new Tokenizer(code)
    const parser = new Parser(tokenizer.tokenize())
    expect(parser.parse()).toEqual(result)
  })
})
```

## 手写 Bundler: 实现代码打包、 Tree Shaking

### 实现思路梳理

首先我们来梳理一下整体的实现思路，如下图所示:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311120043419.png)

第一步我们需要获取模块的内容并解析模块 AST，然后梳理模块间的依赖关系，生成一张模块依赖图( ModuleGraph )。

接下来，我们根据模块依赖图生成拓扑排序后的模块列表，以保证最后的产物中各个模块的顺序是正确的，比如模块 A 依赖了模块 B，那么在产物中，模块 B 的代码需要保证在模块 A 的代码之前执行。

当然，Tree Shaking 的实现也是很重要的一环，我会带你实现一个基于 import/export 符号分析的 Tree Shaking 效果，保证只有被 import 的部分被打包进产物。最后，我们便可以输出完整的 Bundle 代码，完成模块打包。

### 开发环境搭建

我们先来搭建一下项目的基本开发环境，首先新建目录 `my-bundler` ，然后进入目录中执行 `pnpm init -y` 初始化，安装一些必要的依赖:

> 建议 fork 小册的 Github 仓库，从项目根目录下创建项目，因为需要使用仓库中的 ast-parser

```shell
pnpm i magic-string -S
pnpm i @types/node tsup typescript typescript-transform-paths -D
```

新建 tsconfig.json ，内容如下:

```js
{
  "compilerOptions": {
    "target": "es2016",
    "allowJs": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "baseUrl": "src",
    "rootDir": "src",
    "declaration": true,
    "plugins": [
{
"transform": "typescript-transform-paths"/* 支持别名 */
},
{
        "transform": "typescript-transform-paths",
"afterDeclarations": true/* 支持类型文件中的别名 */
}
],
"paths": {
"*": ["./*"],
"ast-parser": ["../../ast-parser"]/* AST 解析器的路径*/
} },
  "include": ["src"],
  "references": [{ "path": "../ast-parser" }]
}
```

然后在 package.json 中添加如下的构建脚本:

```js
"scripts": {
  "dev": "tsup ./src/rollup.ts --format cjs,esm --dts --clean --watch",
  "build": "tsup ./src/rollup.ts --format cjs,esm --dts --clean --minify"
},
```

接下来，你可以在 `src` 目录下新建 `index.ts` ，内容如下:

```js
// src/index.ts
import { Bundle } from './Bundle';
export interface BuildOptions { input: string;
}
export function build(options: BuildOptions) { const bundle = new Bundle({
    entry: options.input
  });
return bundle.build().then(() => { return {
generate: () => bundle.render() };
}); }
```

由此可见，所有核心的逻辑我们封装在了 Bundle 对象中，接着新建 `Bundle.ts` 及其依赖的 `Graph.ts` ，添加如下的代码骨架:

```js
// Bundle.ts
export class Bundle {
graph: Graph;
constructor(options: BundleOptions) {
// 初始化模块依赖图对象 this.graph = new Graph({
      entry: options.entry,
      bundle: this
    });
}
async build() {
// 模块打包逻辑，完成所有的 AST 相关操作 return this.graph.build();
render() {
// 代码生成逻辑，拼接模块 AST 节点，产出代码
}
getModuleById(id: string) {
return this.graph.getModuleById(id);
}
addModule(module: Module) {
return this.graph.addModule(module);
} }
// Graph.ts
// 模块依赖图对象的实现
import { dirname, resolve } from 'path'; export class Graph {
entryPath: string;
basedir: string;
moduleById: Record<string, Module> = {}; modules: Module[] = [];
constructor(options: GraphOptions) { const { entry, bundle } = options; this.entryPath = resolve(entry); this.basedir = dirname(this.entryPath); this.bundle = bundle;
}
async build() {
// 1. 获取并解析模块信息
// 2. 构建依赖关系图
// 3. 模块拓扑排序
// 4. Tree Shaking, 标记需要包含的语句
}
getModuleById(id: string) { return this.moduleById[id];
}
addModule(module: Module) {
if (!this.moduleById[module.id]) {
      this.moduleById[module.id] = module;
this.modules.push(module); }
} }
```

接下来，我们就正式开始实现打包器的模块解析逻辑。

### 模块 AST 解析

我们基于目前的 `Graph.ts` 继续开发，首先在 Graph 对象中初始化模块加载器 (ModuleLoader):

```js
// src/Graph.ts
import { dirname, resolve } from 'path'; export class Graph {
constructor(options: GraphOptions) {
// 省略其它代码
// 初始化模块加载器对象
this.moduleLoader = new ModuleLoader(bundle);
}
async build() {
// 1. 获取并解析模块信息，返回入口模块对象
const entryModule = await this.moduleLoader.fetchModule(
      this.entryPath,
      null,
      true
); }
}
```

然后添加 `ModuleLoader.ts` ，代码如下:

```js
// src/ModuleLoader.ts
export class ModuleLoader {
bundle: Bundle;
resolveIdsMap: Map<string, string | false> = new Map(); constructor(bundle: Bundle) {
    this.bundle = bundle;
  }
// 解析模块逻辑
resolveId(id: string, importer: string | null) {
const cacheKey = id + importer;
if (this.resolveIdsMap.has(cacheKey)) {
return this.resolveIdsMap.get(cacheKey)!; }
const resolved = defaultResolver(id, importer); this.resolveIdsMap.set(cacheKey, resolved); return resolved;
}
// 加载模块内容并解析 async fetchModule(
id: string,
importer: null | string, isEntry = false,
bundle: Bundle = this.bundle, loader: ModuleLoader = this
): Promise<Module | null> {
const path = this.resolveId(id, importer);
// 查找缓存
const existModule = this.bundle.getModuleById(path); if (existModule) {
return existModule; }
const code = await readFile(path, { encoding: 'utf-8' }); // 初始化模块，解析 AST
const module = new Module({
      path,
      code,
      bundle,
      loader,
      isEntry
});
this.bundle.addModule(module);
// 拉取所有的依赖模块
await this.fetchAllDependencies(module); return module;
}
async fetchAllDependencies(module: Module) { await Promise.all(
module.dependencies.map((dep) => {
return this.fetchModule(dep, module.path);
}) );
} }
```

主要由 `fetchModule` 方法完成模块的加载和解析，流程如下:

- 调用 resolveId 方法解析模块路径
- 初始化模块实例即 Module 对象，解析模块 AST
- 递归初始化模块的所有依赖模块

其中，最主要的逻辑在于第二步，即 Module 对象实例的初始化，在这个过程中，模块代码将会被进行 AST 解析及依赖分析。接下来，让我们把目光集中在 Module 对象的实现上。

```js
// src/Module.ts
export class Module {
isEntry: boolean = false;
id: string;
path: string;
bundle: Bundle;
moduleLoader: ModuleLoader;
code: string;
magicString: MagicString;
statements: Statement[];
imports: Imports;
exports: Exports;
reexports: Exports;
exportAllSources: string[] = [];
exportAllModules: Module[] = [];
dependencies: string[] = [];
dependencyModules: Module[] = [];
referencedModules: Module[] = [];
constructor({ path, bundle, code, loader, isEntry = false }: ModuleOptions) {
this.id = path;
this.bundle = bundle;
this.moduleLoader = loader;
this.isEntry = isEntry;
this.path = path;
this.code = code;
this.magicString = new MagicString(code); this.imports = {};
this.exports = {};
this.reexports = {};
this.declarations = {};
try {
const ast = parse(code) as any;
const nodes = ast.body as StatementNode[];
// 以语句(Statement)的维度来拆分 Module，保存 statement 的集合，供之后分析 this.statements = nodes.map((node) => {
const magicString = this.magicString.snip(node.start, node.end); // Statement 对象将在后文中介绍具体实现
return new Statement(node, magicString, this);
});
} catch (e) {
console.log(e);
throw e; }
// 分析 AST 节点
this.analyseAST(); }
analyseAST() {
// 以语句为最小单元来分析 this.statements.forEach((statement) => {
// 对 statement 进行分析 statement.analyse();
// 注册顶层声明
if (!statement.scope.parent) {
statement.scope.eachDeclaration((name, declaration) => { this.declarations[name] = declaration;
}); }
});
// 注册 statement 的 next 属性，用于生成代码使用，next 即下一个 statement 的起始位置 const statements = this.statements;
let next = this.code.length;
for (let i = statements.length - 1; i >= 0; i--) {
      statements[i].next = next;
      next = statements[i].start;
    }
} }
```

OK，我们可以来梳理一下解析 AST 节点主要做了哪些事情:

- 调用 ast-parser 将代码字符串解析为 AST 对象
- 遍历 AST 对象中的各个语句，以语句的维度来进行 AST 分析，通过语句的分析结果来构造作用域链和模块依赖关系

ast-parser 的解析部分我们已经详细介绍过，这里不再赘述。接下来我们将重点放到 Statement 对象的实现上。你可以新建 `src/Statement.ts` ，内容如下:

```js
// src/Statement.ts
// 以下为三个工具函数
// 是否为函数节点
function isFunctionDeclaration(node: Declaration): boolean {
if (!node) return false; return (
    // function foo() {}
node.type === 'FunctionDeclaration' ||
// const foo = function() {}
(node.type === NodeType.VariableDeclarator &&
node.init &&
node.init.type === NodeType.FunctionExpression) || // export function ...
// export default function
((node.type === NodeType.ExportNamedDeclaration ||
node.type === NodeType.ExportDefaultDeclaration) && !!node.declaration &&
node.declaration.type === NodeType.FunctionDeclaration)
); }
// 是否为 export 声明节点
export function isExportDeclaration(node: ExportDeclaration): boolean {
return /^Export/.test(node.type); }
// 是否为 import 声明节点
export function isImportDeclaration(node: any) {
return node.type === 'ImportDeclaration'; }
export class Statement {
node: StatementNode;
magicString: MagicString;
module: Module;
scope: Scope;
start: number;
next: number;
isImportDeclaration: boolean;
isExportDeclaration: boolean;
isReexportDeclaration: boolean;
isFunctionDeclaration: boolean;
isIncluded: boolean = false;
defines: Set<string> = new Set();
modifies: Set<string> = new Set();
dependsOn: Set<string> = new Set();
references: Reference[] = [];
constructor(node: StatementNode, magicString: MagicString, module: Module) {
this.magicString = magicString; this.node = node;
this.module = module; this.scope = new Scope({
      statement: this
    });
this.start = node.start;
this.next = 0;
this.isImportDeclaration = isImportDeclaration(node); this.isExportDeclaration = isExportDeclaration(node as ExportDeclaration); this.isReexportDeclaration =
      this.isExportDeclaration &&
!!(node as ExportAllDeclaration | ExportNamedDeclaration).source; this.isFunctionDeclaration = isFunctionDeclaration(
node as FunctionDeclaration );
}
analyse() {
if (this.isImportDeclaration) return;
// 1、构建作用域链，记录 Declaration 节点表
buildScope(this);
// 2. 寻找引用的依赖节点，记录 Reference 节点表
findReference(this);
} }
```

在 Statement 节点的分析过程中主要需要做两件事情:

- 构建作用域链。这是为了记录当前语句中声明的变量。
- 记录引用的依赖节点。这是为了记录当前语句引用了哪些变量以及这些变量对应的 AST 节点

而无论是构建作用域链还是记录引用节点，我们都离不开一个最基本的操作，那就是对 AST 进行遍历操作。你可以新建 `src/utils/walk.ts` ，用来存放 AST 节点遍历的逻辑，代码可以去 [Github 仓库链接](https://github.com/sanyuan0704/juejin-book-vite/blob/main/bundler/src/utils/walk.ts)获取，由于这部分内容并不属于本文的重点，就不再详细赘述了，感兴趣的同学可以研究一下实现细节。接下来我们主要通过这个遍历器来完成 Statement 节点的分析。

对于作用域链的分析，我们先来新建一个 Scope 对象，封装作用域相关的基本信息:

```js
// src/utils/Scope.ts
import { Statement } from 'Statement';
import { Declaration } from 'ast/Declaration';
interface ScopeOptions { parent?: Scope; paramNodes?: any[]; block?: boolean; statement: Statement; isTopLevel?: boolean;
}
export class Scope {
// 父作用域
parent?: Scope;
// 如果是函数作用域，则需要参数节点 paramNodes: any[];
// 是否为块级作用域
isBlockScope?: boolean;
// 作用域对应的语句节点
statement: Statement;
// 变量/函数 声明节点，为 Scope 的核心数据 declarations: Record<string, Declaration> = {}; constructor(options: ScopeOptions) {
const { parent, paramNodes, block, statement } = options; this.parent = parent;
this.paramNodes = paramNodes || [];
this.statement = statement;
this.isBlockScope = !!block; this.paramNodes.forEach(
(node) =>
(this.declarations[node.name] = new Declaration(
          node,
          true,
          this.statement
)) );
}
addDeclaration(node: any, isBlockDeclaration: boolean) {
// block scope & var, 向上追溯，直到顶层作用域
if (this.isBlockScope && !isBlockDeclaration && this.parent) {
this.parent.addDeclaration(node, isBlockDeclaration); } else {
// 否则在当前作用域新建声明节点(Declaration)
const key = node.id && node.id.name;
this.declarations[key] = new Declaration(node, false, this.statement);
} }

// 遍历声明节点(Declaration)
eachDeclaration(fn: (name: string, dec: Declaration) => void) {
Object.keys(this.declarations).forEach((key) => { fn(key, this.declarations[key]);
}); }

contains(name: string): Declaration { return this.findDeclaration(name);
}
findDeclaration(name: string): Declaration { return (
      this.declarations[name] ||
(this.parent && this.parent.findDeclaration(name)) );
} }
```

Scope 的核心在于声明节点(即 `Declaration` )的收集与存储，而上述的代码中并没有 Declaration 对象的实现，接下来我们来封装一下这个对象:

```js
// src/ast/Declaration.ts
import { Module } from '../Module'; import { Statement } from '../Statement'; import { Reference } from './Reference';
export class Declaration {
isFunctionDeclaration: boolean = false;
functionNode: any;
statement: Statement | null;
name: string | null = null;
isParam: boolean = false;
isUsed: boolean = false;
isReassigned: boolean = false;
constructor(node: any, isParam: boolean, statement: Statement | null) {
// 考虑函数和变量声明两种情况 if (node) {
if (node.type === 'FunctionDeclaration') { this.isFunctionDeclaration = true; this.functionNode = node;
} else if (
node.type === 'VariableDeclarator' && node.init && /FunctionExpression/.test(node.init.type)
){
this.isFunctionDeclaration = true; this.functionNode = node.init;
} }
    this.statement = statement;
    this.isParam = isParam;
  }
addReference(reference: Reference) { reference.declaration = this; this.name = reference.name;
} }
```

既然有了声明节点，那么我们如果感知到哪些地方使用了这些节点呢?这时候就需要 Reference 节点登场了，它的作用就是记录其它节点与 Declaration 节点的引用关系，让我们来简单实现一下:

```js
import { Scope } from './Scope';
import { Statement } from '../Statement'; import { Declaration } from './Declaration';
export class Reference {
node: any;
scope: Scope;
statement: Statement;
// declaration 信息在构建依赖图的部分补充 declaration: Declaration | null = null; name: string;
start: number;
end: number;
objectPaths: any[] = [];
constructor(node: any, scope: Scope, statement: Statement) {
this.node = node;
this.scope = scope;
this.statement = statement;
this.start = node.start;
this.end = node.end;
let root = node;
this.objectPaths = [];
while (root.type === 'MemberExpression') {
this.objectPaths.unshift(root.property);
      root = root.object;
    }
this.objectPaths.unshift(root);
    this.name = root.name;
  }
}
```

OK，前面铺垫了这么多基础的数据结构，让大家了解到各个关键对象的作用及其联系，接下来我们正式开始编写构建作用域链的代码。

你可以新建 `src/utils/buildScope.ts`，内容如下:

```js
import { walk } from 'utils/walk'; import { Scope } from 'ast/Scope'; import { Statement } from 'Statement'; import {
NodeType,
Node, VariableDeclaration, VariableDeclarator
} from 'ast-parser';
import { FunctionDeclaration } from 'ast-parser';

export function buildScope(statement: Statement) { const { node, scope: initialScope } = statement; let scope = initialScope;
// 遍历 AST
walk(node, {
// 遵循深度优先的原则，每进入和离开一个节点会触发 enter 和 leave 钩子
// 如 a 的子节点为 b，那么触发顺序为 a-enter、b-enter、b-leave、a-leave enter(node: Node) {
      // function foo () {...}
if (node.type === NodeType.FunctionDeclaration) { scope.addDeclaration(node, false);
}
      // var let const
if (node.type === NodeType.VariableDeclaration) {
const currentNode = node as VariableDeclaration;
const isBlockDeclaration = currentNode.kind !== 'var'; currentNode.declarations.forEach((declarator: VariableDeclarator) => {
scope.addDeclaration(declarator, isBlockDeclaration); });
}
let newScope;
      // function scope
if (node.type === NodeType.FunctionDeclaration) { const currentNode = node as FunctionDeclaration; newScope = new Scope({
          parent: scope,
          block: false,
          paramNodes: currentNode.params,
          statement
}); }
      // new block scope
if (node.type === NodeType.BlockStatement) { newScope = new Scope({
          parent: scope,
          block: true,
          statement
}); }
// 记录 Scope 父子关系 if (newScope) {
Object.defineProperty(node, '_scope', { value: newScope,
configurable: true
});
        scope = newScope;
      }
},
leave(node: any) {
// 更新当前作用域
// 当前 scope 即 node._scope
if (node._scope && scope.parent) {
scope = scope.parent;
} }
}); }
```

从中可以看到，我们会对如下类型的 AST 节点进行处理:

- 变量声明节点。包括 `var` 、 `let` 和 con·st 声明对应的节点。对 let 和 const ，我们需要将声明节点绑定到当前作用域中，而对于 var ，需要绑定到全局作用域
- 函数声明节点。对于这类节点，我们直接创建一个新的作用域。
- 块级节点。即用 { } 包裹的节点，如 if 块、函数体，此时我们也创建新的作用域。

在构建完作用域完成后，我们进入下一个环节: **记录引用节点**。

新建 `src/utils/findReference.ts` ，内容如下:

```js
import { Statement } from 'Statement'; import { walk } from 'utils/walk';
import { Reference } from 'ast/Reference';
function isReference(node: any, parent: any): boolean {
if (node.type === 'MemberExpression' && parent.type !== 'MemberExpression') {
return true; }
if (node.type === 'Identifier') {
// 如 export { foo as bar }, 忽略 bar
if (parent.type === 'ExportSpecifier' && node !== parent.local)
return false;
// 如 import { foo as bar } from 'xxx', 忽略 bar
if (parent.type === 'ImportSpecifier' && node !== parent.imported) {
return false; }
return true; }
return false; }
export function findReference(statement: Statement) {
const { references, scope: initialScope, node } = statement; let scope = initialScope;
walk(node, {
enter(node: any, parent: any) {
if (node._scope) scope = node._scope; if (isReference(node, parent)) {
// 记录 Reference 节点
const reference = new Reference(node, scope, statement);
references.push(reference);
} },
leave(node: any) {
if (node._scope && scope.parent) {
        scope = scope.parent;
      }
} });
}
```

至此，我们就完成了模块 AST 解析的功能。

### 模块依赖图绑定

回到 Graph 对象中，接下来我们需要实现的是模块依赖图的构建:

```js
// src/Graph.ts
export class Graph { async build() {
// (完成) 1. 获取并解析模块信息
// 2. 构建依赖关系图 this.module.forEach(module => module.bind()); // 3. 模块拓扑排序
// 4. Tree Shaking, 标记需要包含的语句 }
}
```

现在我们在 Module 对象的 AnalyzeAST 中新增依赖绑定的代码:

```js
// src/Module.ts
analyzeAST() {
// 如果语句为 import/export 声明，那么给当前模块记录依赖的标识符 this.statements.forEach((statement) => {
if (statement.isImportDeclaration) { this.addImports(statement);
} else if (statement.isExportDeclaration) { this.addExports(statement);
} });
}
// 处理 import 声明 addImports(statement: Statement) {
const node = statement.node as any;
const source = node.source.value;
// import
node.specifiers.forEach((specifier: Specifier) => {
// 为方便理解，本文只处理具名导入
const localName = specifier.local.name;
const name = specifier.imported.name;
    this.imports[localName] = { source, name, localName };
  });
this._addDependencySource(source); }
// 处理 export 声明 addExports(statement: Statement) {
const node = statement.node as any;
const source = node.source && node.source.value; // 为方便立即，本文只处理具名导出
if (node.type === 'ExportNamedDeclaration') {
    // export { a, b } from 'mod'
if (node.specifiers.length) { node.specifiers.forEach((specifier: Specifier) => {
const localName = specifier.local.name;
const exportedName = specifier.exported.name; this.exports[exportedName] = {
localName,
          name: exportedName
        };
if (source) { this.reexports[localName] = {
            statement,
            source,
            localName,
            name: localName,
            module: undefined
          };
          this.imports[localName] = {
            source,
            localName,
            name: localName
};
this._addDependencySource(source); }
});
} else {
const declaration = node.declaration;
let name;
if (declaration.type === 'VariableDeclaration') {
        // export const foo = 2;
name = declaration.declarations[0].id.name; } else {
        // export function foo() {}
        name = declaration.id.name;
      }
      this.exports[name] = {
        statement,
        localName: name,
        name
}; }
} else if (node.type === 'ExportAllDeclaration') { // export * from 'mod'
if (source) {
this.exportAllSources.push(source);
this.addDependencySource(source);
} }
}
private _addDependencySource(source: string) { if (!this.dependencies.includes(source)) {
this.dependencies.push(source); }
}
```

在记录完 import 和 export 的标识符之后，我们根据这些标识符绑定到具体的模块对象，新增 `bind` 方法，实现如下:

```js
bind() {
// 省略已有代码
// 记录标识符对应的模块对象
this.bindDependencies();
/// 除此之外，根据之前记录的 Reference 节点绑定对应的 Declaration 节点 this.bindReferences();
}
bindDependencies() {
[...Object.values(this.imports), ...Object.values(this.reexports)].forEach(
(specifier) => {
specifier.module = this._getModuleBySource(specifier.source!);
} );
this.exportAllModules = this.exportAllSources.map( this._getModuleBySource.bind(this)
);
// 建立模块依赖图
this.dependencyModules = this.dependencies.map(
this._getModuleBySource.bind(this) );
this.dependencyModules.forEach((module) => { module.referencedModules.push(this);
}); }
bindReferences() { this.statements.forEach((statement) => {
statement.references.forEach((reference) => {
// 根据引用寻找声明的位置
// 寻找顺序: 1. statement 2. 当前模块 3. 依赖模块 const declaration =
reference.scope.findDeclaration(reference.name) ||
this.trace(reference.name); if (declaration) {
declaration.addReference(reference); }
}); });
}
private _getModuleBySource(source: string) {
const id = this.moduleLoader.resolveId(source!, this.path) as string;
return this.bundle.getModuleById(id); }
```

现在，我们便将各个模块间的依赖关系绑定完成了。

### 模块拓扑排序

接下来，我们将所有的模块根据依赖关系进行拓扑排序:

```js
// src/Graph.ts
export class Graph { async build() {
// (完成) 1. 获取并解析模块信息
// (完成) 2. 构建依赖关系图
// 3. 模块拓扑排序
this.orderedModules = this.sortModules(entryModule!); // 4. Tree Shaking, 标记需要包含的语句
}
sortModules(entryModule: Module) {
// 拓扑排序模块数组
const orderedModules: Module[] = []; // 记录已经分析过的模块表
const analysedModule: Record<string, boolean> = {}; // 记录模块的父模块 id
const parent: Record<string, string> = {};
// 记录循环依赖
const cyclePathList: string[][] = [];
// 用来回溯，用来定位循环依赖
function getCyclePath(id: string, parentId: string): string[] {
const paths = [id];
let currrentId = parentId; while (currrentId !== id) {
paths.push(currrentId);
// 向前回溯
currrentId = parent[currrentId];
} paths.push(paths[0]); return paths.reverse();
}
// 拓扑排序核心逻辑，基于依赖图的后序遍历完成
function analyseModule(module: Module) {
if (analysedModule[module.id]) { return;
}
for (const dependency of module.dependencyModules) {
// 检测循环依赖
// 为什么是这个条件，下文会分析
if (parent[dependency.id]) {
if (!analysedModule[dependency.id]) { cyclePathList.push(getCyclePath(dependency.id, module.id));
}
continue; }
        parent[dependency.id] = module.id;
analyseModule(dependency); }
      analysedModule[module.id] = true;
orderedModules.push(module); }
// 从入口模块开始分析 analyseModule(entryModule);
// 如果有循环依赖，则打印循环依赖信息 if (cyclePathList.length) {
cyclePathList.forEach((paths) => { console.log(paths);
});
process.exit(1); }
return orderedModules; }
}
```

拓扑排序的核心在于对依赖图进行后续遍历，将被依赖的模块放到前面，如下图所示:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311120103023.png)

其中 A 依赖 B 和 C，B 和 C 依赖 D，D 依赖 E，那么最后的拓扑排序即。但也有一种特殊情况，就是出现循环的情况，如下面这张图所示:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311120103650.png)

上图中的依赖关系呈现了 `B->C->D->B` 的循环依赖，这种情况是我们需要避免的。那么如何来检测出循环依赖呢?

由于 `analyseModule` 函数中采用后序的方式来遍历依赖，也就是说一旦某个模块被记录到 `analysedModule` 表中，那么也就意味着其所有的依赖模块已经被遍历完成了:

```js
function analyseModule(module: Module) { if (analysedModule[module.id]) {
return; }
for (const dependency of module.dependencyModules) { // 检测循环依赖的代码省略
parent[dependency.id] = module.id; analyseModule(dependency);
}
analysedModule[module.id] = true; orderedModules.push(module);
}
```

如果某个模块没有被记录到 analysedModule 中，则表示它的依赖模块并没有分析完，在这个前提下中，如果再次遍历到这个模块，说明已经出现了循环依赖，你可以对照下图理解:

![](https://my-vitepress-blog.sh1a.qingstor.com/202311120104774.png)

因此检测循环依赖的条件应该为下面这样:

```js
for (const dependency of module.dependencyModules) {
  // 检测循环依赖
  // 1. 不为入口模块
  if (parent[dependency.id]) {
    // 2. 依赖模块还没有分析结束
    if (!analysedModule[dependency.id]) {
      cyclePathList.push(getCyclePath(dependency.id, module.id))
    }
    continue
  }
  parent[dependency.id] = module.id
  analyseModule(dependency)
}
```

OK，到目前为止，我们完成了第三步 `模块拓扑排序` 的步骤，接下来我们进入 Tree Shaking 功能的开发:

```js
// src/Graph.ts
export class Graph {
  async build() {
    // (完成) 1. 获取并解析模块信息
    // (完成) 2. 构建依赖关系图
    // (完成) 3. 模块拓扑排序
    // 4. Tree Shaking, 标记需要包含的语句
  }
}
```

### 实现 Tree Shaking

相信 Tree Shaking 对于大家并不陌生，它主要的作用就是在打包产物中摇掉没有使用的代码，从而优化产物体积。而得益于 ES 模块的静态特性，我们可以基于 import/export 的符号可达性来进行 Tree Shaking 分析，如:

```js
// index.ts
import { a } from './utils'
console.log(a)
// utils.ts
export const a = 1
export const b = 2
```

由于在如上的代码中我们只使用到了 a，则 a 属于可达符号，b 属于不可达符号，因此最后的代码不会包含 b 相关的实现代码。

接下来我们就来实现这一功能，即基于符号可达性来进行无用代码的删除。

```js
// src/Graph.ts

export class Graph {
async build() {
//1. 获取并解析模块信息 (完成)
//2. 构建依赖关系图 (完成)
//3. 模块拓扑排序
//4. Tree Shaking, 标记需要包含的语句 从入口处分析
entryModule!.getExports().forEach((name) => {
const declaration = entryModule!.traceExport(name);
declaration!.use(); });
} }
```

在 Module 对象中，我们需要增加 `getExports` 和 `traceExport` 方法来获取和分析模块的导出：

```js
// 拿到模块所有导出 getExports(): string[] {

return [ ...Object.keys(this.exports), ...Object.keys(this.reexports), ...this.exportAllModules
.map(module => module.getExports())
.flat() ];
}

// 从导出名追溯到 Declaration 声明节点 traceExport(name: string): Declaration | null {
// 1. reexport
// export { foo as bar } from './mod'
const reexportDeclaration = this.reexports[name]; if (reexportDeclaration) {
// 说明是从其它模块 reexport 出来的
// 经过 bindDependencies 方法处理，现已绑定 module
const declaration = reexportDeclaration.module!.traceExport(
      reexportDeclaration.localName
    );
if (!declaration) { throw new Error(
        `${reexportDeclaration.localName} is not exported by module ${
          reexportDeclaration.module!.path
        }(imported by ${this.path})`
      );
}
return declaration; }
// 2. export
// export { foo }
const exportDeclaration = this.exports[name]; if (exportDeclaration) {
const declaration = this.trace(name);
if (declaration) { return declaration;
} }
  // 3. export all
for (let exportAllModule of this.exportAllModules) { const declaration = exportAllModule.trace(name); if (declaration) {
return declaration; }
}
return null; }
trace(name: string) {
if (this.declarations[name]) {
// 从当前模块找
return this.declarations[name]; }
// 从依赖模块找
if (this.imports[name]) {
const importSpecifier = this.imports[name];
const importModule = importSpecifier.module!;
const declaration = importModule.traceExport(importSpecifier.name); if (declaration) {
return declaration; }
}
return null; }
```

当我们对每个导出找到对应的 Declaration 节点之后，则对这个节点进行标记，从而让其代码能够在代码生成阶段得以保留。那么如何进行标记呢?

我们不妨回到 Declaration 的实现中，增加 `use` 方法:

```js
use() {
// 标记该节点被使用
this.isUsed = true;
// 对应的 statement 节点也应该被标记 if (this.statement) {
this.statement.mark(); }
}
// 另外，你可以加上 render 方法，便于后续代码生成的步骤 render() {
return this.name; }
```

接下来我们到 Statement 对象中，继续增加 mark 方法，来追溯被使用过的 Declaration 节点:

```js
// src/Statement.ts
mark() {
if (this.isIncluded) {
return; }
this.isIncluded = true; this.references.forEach(
(ref: Reference) => ref.declaration && ref.declaration.use() );
}
```

这时候，Reference 节点的作用就体现出来了，由于我们之前专门收集到 Statement 的 Reference 节点，通过 Reference 节点我们可以追溯到对应的 Declaration 节点，并调用其 use 方法进行标记。

### 代码生成

如此，我们便完成了 Tree Shaking 的标记过程，接下来我们看看如何来进行代码生成，直观地看到 Tree Shaking 的效果。

我们在 Module 对象中增加 `render` 方法，用来将模块渲染为字符串:

```js
render() {
const source = this.magicString.clone().trim(); this.statements.forEach((statement) => {
    // 1. Tree Shaking
if (!statement.isIncluded) { source.remove(statement.start, statement.next); return;
}
// 2. 重写引用位置的变量名 -> 对应的声明位置的变量名 statement.references.forEach((reference) => {
const { start, end } = reference;
const declaration = reference.declaration; if (declaration) {
const name = declaration.render();
source.overwrite(start, end, name!); }
});
// 3. 擦除/重写 export 相关的代码
if (statement.isExportDeclaration && !this.isEntry) {
      // export { foo, bar }
if (
statement.node.type === 'ExportNamedDeclaration' && statement.node.specifiers.length
){
source.remove(statement.start, statement.next);
}
// remove `export` from `export const foo = 42`
else if (
statement.node.type === 'ExportNamedDeclaration' && (statement.node.declaration!.type === 'VariableDeclaration' ||
statement.node.declaration!.type === 'FunctionDeclaration') ){
source.remove( statement.node.start, statement.node.declaration!.start
); }
      // remove `export * from './mod'`
else if (statement.node.type === 'ExportAllDeclaration') { source.remove(statement.start, statement.next);
} }
});
return source.trim(); }
```

接着，我们在 Bundle 对象也实现一下 render 方法，用来生成最后的产物代码:

```js
render(): { code: string } {
let msBundle = new MagicString.Bundle({ separator: '\n' }); // 按照模块拓扑顺序生成代码 this.graph.orderedModules.forEach((module) => {
msBundle.addSource({ content: module.render()
}); });
return {
code: msBundle.toString(),
}; }
```

OK，现在我们终于可以来测试目前的 Bundler 功能了，测试代码如下:

```js
// test.js
const fs = require('fs')
const { build } = require('./dist/index')
async function buildTest() {
  const bundle = await build({
    input: './test/index.js'
  })
  const res = bundle.generate()
  fs.writeFileSync('./test/bundle.js', res.code)
}
buildTest()
// test/index.js
import { a, add } from './utils.js'
export const c = add(a, 2)
// test/utils.js
export const a = 1
export const b = 2
export const add = function (num1, num2) {
  return num1 + num2
}
```

在终端执行 `node test.js` ，即可将产物代码输出到 test 目录下的 `bundle.js` 中:

```js
// test/bundle.js
const a = 1
const add = function (num1, num2) {
  return num1 + num2
}
export const c = add(a, 2)
```

可以看到，最后的产物代码已经成功生成，变量 b 相关的代码已经完全从产出中擦除， 实现了基于符号可达性的 Tree Shaking 的效果。
