---
title: vite中的高级应用
tags:
  - vite
date: 2023-11-09
cover: https://my-vitepress-blog.sh1a.qingstor.com/202311131423374.jpg
---

## vite 实战

### vite 插件开发

#### 简单的插件实例

Vite 插件与 Rollup 插件结构类似，为一个 `name` 和各种插件 Hook 的对象:

```js
{
 // 插件名称
 name: 'vite-plugin-xxx',
 load(code) {
 // 钩子逻辑
 },
}
```

> 如果插件是一个 npm 包，在 package.json 中的包命名也推荐以 vite-plugin 开头。

一般情况下因为要考虑到外部传参，我们不会直接写一个对象，而是实现一个返回插件对象的 `工厂函数 `，如下代码所示:

```js
// myPlugin.js
export function myVitePlugin(options) {
  console.log(options)
  return {
    name: 'vite-plugin-xxx',
    load(id) {
      // 在钩子逻辑中可以通过闭包访问外部的 options 传参
    }
  }
}
// 使用方式
// vite.config.ts
import { myVitePlugin } from './myVitePlugin'
export default {
  plugins: [
    myVitePlugin({
      /* 给插件传参 */
    })
  ]
}
```

#### 插件 Hook 介绍

##### 1.通用 Hook

Vite 开发阶段会模拟 Rollup 的行为:

其中 Vite 会调用一系列与 Rollup 兼容的钩子，这个钩子主要分为三个阶段:

- **服务器启动阶段**: `options` 和 `buildStart` 钩子会在服务启动时被调用。
- **请求响应阶段**: 当浏览器发起请求时，Vite 内部依次调用 `resolveId` 、 `load` `和transform` 钩子。
- **服务器关闭阶段**: Vite 会依次执行 `buildEnd` 和 `closeBundle` 钩子。

除了以上钩子，其他 Rollup 插件钩子(如 `moduleParsed` 、 `renderChunk` )均不会在 Vite 开发阶段调用。而生产环境下，由于 Vite 直接使用 Rollup，Vite 插件中所有 Rollup 的插件钩子都会生效。

##### 2.独有的 Hook

接下来给大家介绍 Vite 中特有的一些 Hook，这些 Hook 只会在 Vite 内部调用，而放到 Rollup 中会被直接忽略。

###### 2.1 给配置再加点料：config

Vite 在读取完配置文件（即 `vite.config.ts` ）之后，会拿到用户导出的配置对象，然后执行 config 钩子。在这个钩子里面，你可以对配置文件导出的对象进行自定义的操作，如下代码所示:

```js
// 返回部分配置（推荐）
const editConfigPlugin = () => ({
  name: 'vite-plugin-modify-config',
  config: () => ({
    alias: {
      react: require.resolve('react')
    }
  })
})
```

官方推荐的姿势是在 config 钩子中返回一个配置对象，这个配置对象会和 Vite 已有的配置进行深度的合并。不过你也可以通过钩子的入参拿到 config 对象进行自定义的修改，如下代码所示：

```js
const mutateConfigPlugin = () => ({
  name: 'mutate-config',
  // command 为 `serve`(开发环境) 或者 `build`(生产环境)
  config(config, { command }) {
    // 生产环境中修改 root 参数
    if (command === 'build') {
      config.root = __dirname
    }
  }
})
```

在一些比较深层的对象配置中，这种直接修改配置的方式会显得比较麻烦，如 `optimizeDeps.esbuildOptions.plugins` ，需要写很多的样板代码，类似下面这样:

```txt
// 防止出现 undefined 的情况
config.optimizeDeps = config.optimizeDeps || {}
config.optimizeDeps.esbuildOptions = config.optimizeDeps.esbuildOptions || {}
config.optimizeDeps.esbuildOptions.plugins = config.optimizeDeps.esbuildOptions.plugins || []
```

因此这种情况下，建议直接返回一个配置对象，这样会方便很多:

```js
config() {
 return {
 optimizeDeps: {
 esbuildOptions: {
 plugins: []
 }
 }
 }
}
```

###### 2.2 记录最终配置：configResolved

Vite 在解析完配置之后会调用 configResolved 钩子，这个钩子一般用来记录最终的配置信息，而不建议再修改配置，用法如下图所示:

```js
const exmaplePlugin = () => {
  let config
  return {
    name: 'read-config',
    configResolved(resolvedConfig) {
      // 记录最终配置
      config = resolvedConfig
    },
    // 在其他钩子中可以访问到配置
    transform(code, id) {
      console.log(config)
    }
  }
}
```

###### 2.3 获取 Dev Server 实例：configureServer

这个钩子仅在 `开发阶段` 会被调用，用于扩展 Vite 的 Dev Server，一般用于增加自定义 server 中间件，如下代码所示:

```js
const myPlugin = () => ({
  name: 'configure-server',
  configureServer(server) {
    // 姿势 1: 在 Vite 内置中间件之前执行
    server.middlewares.use((req, res, next) => {
      // 自定义请求处理逻辑
    })
    // 姿势 2: 在 Vite 内置中间件之后执行
    return () => {
      server.middlewares.use((req, res, next) => {
        // 自定义请求处理逻辑
      })
    }
  }
})
```

###### 2.4 转换 HTML 内容：transformIndexHtml

这个钩子用来灵活控制 HTML 的内容，你可以拿到原始的 html 内容后进行任意的转换:

```js
const htmlPlugin = () => {
 return {
 name: 'html-transform',
 transformIndexHtml(html) {
 return html.replace(
 /<title>(.*?)</title>/,
 `<title>换了个标题</title>`
 )
 }
 }
}
// 也可以返回如下的对象结构，一般用于添加某些标签
const htmlPlugin = () => {
 return {
 name: 'html-transform',
 transformIndexHtml(html) {
 return {
 html,
 // 注入标签
 tags: [
 {
 // 放到 body 末尾，可取值还有`head`|`head-prepend`|`body-prepend`，顾名思义
 injectTo: 'body',
 // 标签属性定义
 attrs: { type: 'module', src: './index.ts' },
 // 标签名
 tag: 'script',
 },
 ],
 }
 }
 }
}
```

###### 2.5 热更新处理：handleHotUpdate

这个钩子会在 Vite 服务端处理热更新时被调用，你可以在这个钩子中拿到热更新相关的上下文信息，进行热更模块的过滤，或者进行自定义的热更处理。下面是一个简单的例子:

```js
const handleHmrPlugin = () => {
  return {
    async handleHotUpdate(ctx) {
      // 需要热更的文件
      console.log(ctx.file)
      // 需要热更的模块，如一个 Vue 单文件会涉及多个模块
      console.log(ctx.modules)
      // 时间戳
      console.log(ctx.timestamp)
      // Vite Dev Server 实例
      console.log(ctx.server)
      // 读取最新的文件内容
      console.log(await read())
      // 自行处理 HMR 事件
      ctx.server.ws.send({
        type: 'custom',
        event: 'special-update',
        data: { a: 1 }
      })
      return []
    }
  }
}
// 前端代码中加入
if (import.meta.hot) {
  import.meta.hot.on('special-update', data => {
    // 执行自定义更新
    // { a: 1 }
    console.log(data)
    window.location.reload()
  })
}
```

以上就是 Vite 独有的五个钩子，我们来重新梳理一下:

- `config` : 用来进一步修改配置
- `configResolved` : 用来记录最终的配置信息
- `configureServer` : 用来获取 Vite Dev Server 实例，添加中间件
- `transformIndexHtml` : 用来转换 HTML 的内容
- `handleHotUpdate` : 用来进行热更新模块的过滤，或者进行自定义的热更新处理

##### 3.插件 Hook 执行顺序

我们来复盘一下上述的两类钩子，并且通过一个具体的代码示例来汇总一下所有的钩子。我们可以在 Vite 的脚手架工程中新建 `test-hooks-plugin.ts` :

```js
// test-hooks-plugin.ts
// 注: 请求响应阶段的钩子
// 如 resolveId, load, transform, transformIndexHtml在下文介绍
// 以下为服务启动和关闭的钩子
export default function testHookPlugin () {
 return {
 name: 'test-hooks-plugin',
 // Vite 独有钩子
 config(config) {
 console.log('config');
 },
 // Vite 独有钩子
 configResolved(resolvedCofnig) {
 console.log('configResolved');
 },
 // 通用钩子
 options(opts) {
 console.log('options');
 return opts;
 },
 // Vite 独有钩子
 configureServer(server) {
 console.log('configureServer');
 setTimeout(() => {
 // 手动退出进程
 process.kill(process.pid, 'SIGTERM');
 }, 3000)
 },
 // 通用钩子
 buildStart() {
 console.log('buildStart');
 },
 // 通用钩子
 buildEnd() {
 console.log('buildEnd');
 },
 // 通用钩子
 closeBundle() {
 console.log('closeBundle');
 }
}
```

将插件加入到 Vite 配置文件中，然后启动，你可以观察到各个 Hook 的执行顺序:

![Snipaste_2023-11-08_16-40-17.png](https://s2.loli.net/2023/11/08/KwbULZ4zBDrlkci.png)

由此我们可以梳理出 Vite 插件的执行顺序:

![图片.png](https://s2.loli.net/2023/11/08/cdkqlDuofemJPyw.png)

- 服务启动阶段: `config` 、 `configResolved` 、 `options` 、 `configureServer` 、`buildStart`
- 请求响应阶段: 如果是 `html` 文件，仅执行 `transformIndexHtml` 钩子；对于非 HTML 文件，则依次执行 `resolveId` 、 `load` 和 `transform` 钩子。相信大家学过 Rollup 的插件机制，已经对这三个钩子比较熟悉了。
- 热更新阶段: 执行 `handleHotUpdate` 钩子。
- 服务关闭阶段: 依次执行 `buildEnd` 和 `closeBundle` 钩子。

#### 插件应用位置

梳理完 Vite 的各个钩子函数之后，接下来让我们来了解一下 Vite 插件的 `应用情景` 和 `应用顺序`。

默认情况下 Vite 插件同时被用于开发环境和生产环境，你可以通过 `apply` 属性来决定应用场景。

```js
{
  // 'serve' 表示仅用于开发环境，'build'表示仅用于生产环境
  apply: 'serve'
}
```

`apply` 参数还可以配置成一个函数，进行更灵活的控制:

```js
apply(config, { command }) {
 // 只用于非 SSR 情况下的生产环境构建
 return command === 'build' && !config.build.ssr
}
```

同时，你也可以通过 `enforce` 属性来指定插件的执行顺序:

```js
{
  // 默认为`normal`，可取值还有`pre`和`post`
  enforce: 'pre'
}
```

Vite 中插件的执行顺序如下图所示:

![Snipaste_2023-11-08_16-46-18.png](https://s2.loli.net/2023/11/08/AdSvyaY5jc9rNXT.png)

Vite 会依次执行如下的插件:

- Alias (路径别名)相关的插件
- ⭐️ 带有 `enforce: 'pre'` 的用户插件
- Vite 核心插件
- ⭐️ 没有 enforce 值的用户插件，也叫 `普通插件`
- Vite 生产环境构建用的插件
- ⭐️ 带有 `enforce: 'post'` 的用户插件
- Vite 后置构建插件(如压缩插件)

#### 插件开发

##### 虚拟模块加载

首先我们来实现一个虚拟模块的加载插件，可能你会有疑问: 什么是虚拟模块呢？

作为构建工具，一般需要处理两种形式的模块，一种存在于真实的磁盘文件系统中，另一种并不在磁盘而在内存当中，也就是 `虚拟模块` 。通过虚拟模块，我们既可以把自己手写的一些代码字符串作为单独的模块内容，又可以将内存中某些经过计算得出的变量作为模块内容进行加载，非常灵活和方便。接下来让我们通过一些具体的例子来实操一下，首先通过脚手架命令初始化一个 `react + ts` 项目:

```shell
npm init vite
```

然后通过 `pnpm i` 安装依赖，接着新建 `plugins` 目录，开始插件的开发:

```js
// plugins/virtual-module.ts
import { Plugin } from 'vite';
// 虚拟模块名称
const virtualFibModuleId = 'virtual:fib';
// Vite 中约定对于虚拟模块，解析后的路径需要加上`\0`前缀
const resolvedFibVirtualModuleId = '\0' + virtualFibModuleId;
export default function virtualFibModulePlugin(): Plugin {
 let config: ResolvedConfig | null = null;
 return {
 name: 'vite-plugin-virtual-module',
 resolveId(id) {
 if (id === virtualFibModuleId) {
 return resolvedFibVirtualModuleId;
 }
 },
 load(id) {
 // 加载虚拟模块
 if (id === resolvedFibVirtualModuleId) {
 return 'export default function fib(n) { return n <= 1 ? n : fib(n - 1) + fib(n - 2);
 }
 }
 }
}
```

接着我们在项目中来使用这个插件:

```js
// vite.config.ts
import virtual from './plugins/virtual-module.ts'
// 配置插件
{
  plugins: [react(), virtual()]
}
```

然后在 `main.tsx ` 中加入如下的代码:

```js
import fib from 'virtual:fib'
alert(`结果: ${fib(10)}`)
```

这里我们使用了 `virtual:fib` 这个虚拟模块，虽然这个模块不存在真实的文件系统中，但你打开浏览器后可以发现这个模块导出的函数是可以正常执行的:

![Snipaste_2023-11-08_16-57-35.png](https://s2.loli.net/2023/11/08/AkgW32sHyoMB9xU.png)

接着我们来尝试一下如何通过虚拟模块来读取内存中的变量，在 virtual-module.ts 中增加如下代码:

```diff
import { Plugin, ResolvedConfig } from 'vite';
const virtualFibModuleId = 'virtual:fib';
const resolvedFibVirtualModuleId = '\0' + virtualFibModuleId;
+ const virtualEnvModuleId = 'virtual:env';
+ const resolvedEnvVirtualModuleId = '\0' + virtualEnvModuleId;
export default function virtualFibModulePlugin(): Plugin {
+ let config: ResolvedConfig | null = null;
 return {
 name: 'vite-plugin-virtual-fib-module',
+ configResolved(c: ResolvedConfig) {
+ config = c;
+ },
 resolveId(id) {
 if (id === virtualFibModuleId) {
 return resolvedFibVirtualModuleId;
 }
+ if (id === virtualEnvModuleId) {
+ return resolvedEnvVirtualModuleId;
+ }
 },
 load(id) {
 if (id === resolvedFibVirtualModuleId) {
 return 'export default function fib(n) { return n <= 1 ? n : fib(n - 1) + fib(n - 2);
 }
+ if (id === resolvedEnvVirtualModuleId) {
+ return `export default ${JSON.stringify(config!.env)}`;
+ }
 }
 }
}
```

在新增的这些代码中，我们注册了一个新的虚拟模块 virtual:env ，紧接着我们去项目去使用：

```js
// main.tsx
import env from 'virtual:env'
console.log(env)
```

`virtual:env ` 一般情况下会有类型问题，我们需要增加一个类型声明文件来声明这个模块:

```js
// types/shim.d.ts
declare module 'virtual:*' {
 export default any;
}
```

这样就解决了类型报错的问题。接着你可以去浏览器观察一下输出的情况:

![Snipaste_2023-11-08_16-59-18.png](https://s2.loli.net/2023/11/08/amNGodi4HQI7u81.png)

Vite 环境变量能正确地在浏览器中打印出来，说明在内存中计算出来的 virtual:env 模块的确被成功地加载了。从中你可以看到，虚拟模块的内容完全能够被动态计算出来，因此它的灵活性和可定制程度非常高，实用性也很强，在 Vite 内部的插件被深度地使用，社区当中也有不少知名的插件(如 vite-plugin-windicss 、 vite-plugin-svg-icons 等)也使用了虚拟模块的技术。

##### Svg 组件形式加载

在一般的项目开发过程中，我们有时候希望能将 svg 当做一个组件来引入，这样我们可以很方便地修改 svg 的各种属性，相比于 img 标签的引入方式也更加优雅。但 Vite 本身并不支持将 svg 转换为组件的代码，需要我们通过插件来实现。

接下来我们就来写一个 Vite 插件，实现在 React 项目能够通过组件方式来使用 svg 资源。首先安装一下需要的依赖:

```shell
pnpm i resolve @svgr/core -D
```

接着在 plugins 目录新建 svgr.ts :

```js
import { Plugin } from 'vite';
import * as fs from 'fs';
import * as resolve from 'resolve';
interface SvgrOptions {
 // svg 资源模块默认导出，url 或者组件
 defaultExport: 'url' | 'component';
}
export default function viteSvgrPlugin(options: SvgrOptions) {
 const { defaultExport='url' } = options;
 return {
 name: 'vite-plugin-svgr',
 async transform(code ,id) {
 // 转换逻辑: svg -> React 组件
 }
 }
}
```

让我们先来梳理一下开发需求，用户通过传入 `defaultExport` 可以控制 svg 资源的默认导出:

- 当 `defaultExport` 为 `component` ，默认当做组件来使用，即:

```js
import Logo from './Logo.svg'
// 在组件中直接使用
;<Logo />
```

- 当 `defaultExports` 为 `url` ，默认当做 url 使用，如果需要用作组件，可以通过 `具名导入` 的方式来支持:

```js
import logoUrl, { ReactComponent as Logo } from './logo.svg';

// url 使用
<img src={logoUrl} />
// 组件方式使用
<Logo />
```

明确了需求之后，接下来让我们来整理一下插件开发的整体思路，主要逻辑在 transform 钩子中完成，流程如下:

- 根据 id 入参过滤出 svg 资源
- 读取 svg 文件内容
- 利用 `@svgr/core` 将 svg 转换为 React 组件代码
- 处理默认导出为 url 的情况
- 将组件的 jsx 代码转译为浏览器可运行的代码

下面是插件的完整的代码，你可以参考学习:

```js
import { Plugin } from 'vite';
import * as fs from 'fs';
import * as resolve from 'resolve';
interface SvgrOptions {
 defaultExport: 'url' | 'component';
}
export default function viteSvgrPlugin(options: SvgrOptions): Plugin {
 const { defaultExport='component' } = options;
 return {
 name: 'vite-plugin-svgr',
 async transform(code, id) {
 // 1. 根据 id 入参过滤出 svg 资源；
 if (!id.endsWith('.svg')) {
 return code;
 }
 const svgrTransform = require('@svgr/core').transform;
 // 解析 esbuild 的路径，后续转译 jsx 会用到，我们这里直接拿 vite 中的 esbuild 即可
 const esbuildPackagePath = resolve.sync('esbuild', { basedir: require.resolve('vite') }
 const esbuild = require(esbuildPackagePath);
 // 2. 读取 svg 文件内容；
 const svg = await fs.promises.readFile(id, 'utf8');
 // 3. 利用 `@svgr/core` 将 svg 转换为 React 组件代码
 const svgrResult = await svgrTransform(
 svg,
 {},
 { componentName: 'ReactComponent' }
 );
 // 4. 处理默认导出为 url 的情况
 let componentCode = svgrResult;
 if (defaultExport === 'url') {
 // 加上 Vite 默认的 `export default 资源路径`
 componentCode += code;
 componentCode = svgrResult.replace('export default ReactComponent', 'export { ReactCo
 }
 // 5. 利用 esbuild，将组件中的 jsx 代码转译为浏览器可运行的代码;
 const result = await esbuild.transform(componentCode, {
 loader: 'jsx',
 });
 return {
 code: result.code,
 map: null // TODO
 };
 },
 };
}
```

接下来让我们在项目中使用这个插件:

```js
// vite.config.ts
import svgr from './plugins/svgr'
// 返回的配置
{
  plugins: [
    // 省略其它插件
    svgr()
  ]
}
```

接着我们在项目中用组件的方式引入 svg:

```js
// App.tsx
import Logo from './logo.svg'
function App() {
  return (
    <>
      <Logo />
    </>
  )
}
export default App
```

打开浏览器，可以看到组件已经正常显示：

![Snipaste_2023-11-08_17-06-09.png](https://s2.loli.net/2023/11/08/tp1ImzGAQjoYrd8.png)

#### 调试技巧

另外，在开发调试插件的过程，我推荐大家在本地装上 vite-plugin-inspect 插件，并在 Vite 中使用它:

```js
// vite.config.ts
import inspect from 'vite-plugin-inspect'
// 返回的配置
{
  plugins: [
    // 省略其它插件
    inspect()
  ]
}
```

这样当你再次启动项目时，会发现多出一个调试地址:

![Snipaste_2023-11-08_17-07-27.png](https://s2.loli.net/2023/11/08/LeD1PgYXOrqI5dx.png)

你可以通过这个地址来查看项目中各个模块的编译结果：

![Snipaste_2023-11-08_17-08-01.png](https://s2.loli.net/2023/11/08/EpeowIhSO8NM19l.png)

点击特定的文件后，你可以看到这个模块经过各个插件处理后的中间结果

### HMR API 以及原理

有个日常开发中的问题：在代码变更之后，如何实时看到更新后的页面效果呢？

很久之前通过 live reload 也就是自动刷新页面的方式来解决的。不过随着前端工程的日益庞大，开发场景也越来越复杂，这种 `live reload` 的方式在诸多的场景下却显得十分鸡肋，简单来说就是 `模块局部更新 + 状态保存` 的需求在 `live reload` 的方案没有得到满足，从而导致开发体验欠佳。当然，针对部分场景也有一些临时的解决方案，比如状态存储到浏览器的本地缓存(localStorage 对象)中，或者直接 mock 一些数据。但这些方式未免过于粗糙，无法满足通用的开发场景，且实现上也不够优雅。

那么，如果在改动代码后，想要进行模块级别的局部更新该怎么做呢？业界一般使用 HMR 技术来解决这个问题，像 Webpack、Parcel 这些传统的打包工具底层都实现了一套 HMR API，而我们今天要讲的就是 Vite 自己所实现的 HMR API，相比于传统的打包工具，Vite 的 HMR API 基于 ESM 模块规范来实现，可以达到毫秒级别的更新速度，性能非常强悍。接下来，让我们一起来谈谈在 Vite 当中，这一套 HMR 相关的 API 是如何设计的，以及我们可以通过这些 API 实现哪些功能。

#### HMR 简介

HMR 的全称叫做 `Hot Module Replacement` ，即 `模块热替换` 或者 `模块热更新`。在计算机领域当中也有一个类似的概念叫 `热插拔` ，我们经常使用的 USB 设备就是一个典型的代表，当我们插入 U 盘的时候，系统驱动会加载在新增的 U 盘内容，不会重启系统，也不会修改系统其它模块的内容。HMR 的作用其实一样，就是在页面模块更新的时候，直接把**页面中发生变化的模块替换为新的模块**，同时不会影响其它模块的正常运作。具体来说，你可以观察下面这个实现 HMR 的例子。

![图片.png](https://s2.loli.net/2023/11/08/w1TjWrtGIPARloS.png)

在这里，我改变了页面的一个状态 `count` ，当我对页面再次进行调整的时候，比如把最上面的 Logo 图片去掉，这个时候大家可以实时地看到图片消失了，但其他的部分并没有发生改变，包括组件此时的一些数据。

如此一来，通过 HMR 的技术我们就可以实现 `局部刷新` 和 `状态保存`，从而解决之前提到的种种问题。

#### 深入 HMR API

Vite 作为一个完整的构建工具，本身实现了一套 HMR 系统，值得注意的是，这套 HMR 系统基于原生的 ESM 模块规范来实现，在文件发生改变时 Vite 会侦测到相应 ES 模块的变化，从而触发相应的 API，实现局部的更新。

Vite 的 HMR API 设计也并非空穴来风，它基于一套完整的 [ESM HMR 规范](https://github.com/FredKSchott/esm-hmr)来实现，这个规范由同时期的 no-bundle 构建工具 Snowpack、WMR 与 Vite 一起制定，是一个比较通用的规范。

我们可以直观地来看一看 HMR API 的类型定义:

```js
interface ImportMeta {
 readonly hot?: {
 readonly data: any
 accept(): void
accept(cb: (mod: any) => void): void
 accept(cb: (mod: any) => void): void
 accept(dep: string, cb: (mod: any) => void): void
 accept(deps: string[], cb: (mods: any[]) => void): void
 prune(cb: () => void): void
 dispose(cb: (data: any) => void): void
 decline(): void
 invalidate(): void
 on(event: string, cb: (...args: any[]) => void): void
 }
}
```

这里稍微解释一下， `import.meta` 对象为现代浏览器原生的一个内置对象，Vite 所做的事情就是在这个对象上的 `hot` 属性中定义了一套完整的属性和方法。因此，在 Vite 当中，你就可以通过 `import.meta.hot` 来访问关于 HMR 的这些属性和方法，比如 `import.meta.hot.accept()` 。接下来，我们就来一一熟悉这些 API 的使用方式。

##### 模块更新时逻辑：hot.accept

在 `import.meta.hot` 对象上有一个非常关键的方法 `accept` ，因为它决定了 Vite 进行热更新的边界，那么如何来理解这个 accept 的含义呢?

从字面上来看，它表示接受的意思。没错，它就是用来 `接受模块更新` 的。一旦 Vite 接受了这个更新，当前模块就会被认为是 HMR 的边界。那么，Vite 接受谁的更新呢?这里会有三种情况:

- 接受 `自身模块` 的更新
- 接受 `某个子模块` 的更新
- 接受 `多个子模块` 的更新

这三种情况分别对应 accept 方法三种不同的使用方式，下面我们就一起来分析一下。

###### 1.接受自身更新

当模块接受自身的更新时，则当前模块会被认为 HMR 的边界。也就是说，除了当前模块，其他的模块均未受到任何影响。下面是我准备的一张示例图，你可以参考一下:

![iShot_2023-11-08_21.13.09.png](https://s2.loli.net/2023/11/08/uZIamXTLF9y8sWj.png)

为了加深你的理解，这里我们以一个实际的例子来操练一下。这个例子已经放到  
了 [Github 仓库](https://github.com/sanyuan0704/juejin-book-vite/tree/main/13-hmr-api) 中，你可以把这个链接克隆到本地，然后跟着我一步步添加内容。首先展示一下整体的目录结构:

```txt
.
├── favicon.svg
├── index.html
├── node_modules
│   └── ...
├── package.json
├── src
│ ├── main.ts
│   ├── render.ts
│   ├── state.ts
│   ├── style.css
│   └── vite-env.d.ts
└── tsconfig.json
```

这里我放出一些关键文件的内容，如下面的 `index.html `:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link
      rel="icon"
      type="image/svg+xml"
      href="favicon.svg"
    />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <p>
      count:
      <span id="count">0</span>
    </p>
    <script
      type="module"
      src="/src/main.ts"
    ></script>
  </body>
</html>
```

里面的 DOM 结构比较简单，同时引入了 `/src/main.ts` 这个文件，内容如下:

```js
import { render } from './render'
import { initState } from './state'
render()
initState()
```

文件依赖了 `render.ts` 和 `state.ts` ，前者负责渲染文本内容，而后者负责记录当前的页面状态:

```js
// src/render.ts
// 负责渲染文本内容
import './style.css'
export const render = () => {
const app = document.querySelector<HTMLDivElement>('#app')! app.innerHTML = `
    <h1>Hello Vite!</h1>
    <p target="_blank">This is hmr test.123</p>
  `
}
// src/state.ts
// 负责记录当前的页面状态 export function initState() {
let count = 0; setInterval(() => {
let countEle = document.getElementById('count');
    countEle!.innerText =  ++count + '';
  }, 1000);
}
```

好了，仓库当中关键的代码就目前这些了。现在，你可以执行 `pnpm i` 安装依赖，然后 `npm run dev` 启动项目，在浏览器访问可以看到这样的内容:

![iShot_2023-11-08_21.19.23.png](https://s2.loli.net/2023/11/08/RCdoyImvFf1QlOU.png)

同时，每隔一秒钟，你可以看到这里的 `count` 值会加一。OK，现在你可以试着改动一下 `render.ts` 的渲染内容，比如增加一些文本:

```js
// render.ts
export const render = () => {
}
const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
<h1>Hello Vite!</h1>
<p target="_blank">This is hmr test.123 这是增加的文本</p>
`
}
```

效果如下所示：

![iShot_2023-11-08_21.21.04.png](https://s2.loli.net/2023/11/08/nxzuZg9l6cYqEoH.png)

页面的渲染内容是更新了，但不知道你有没有注意到最下面的 `count` 值瞬间被置零了，并且查看控制台，也有这样的 log:

```txt
[vite] page reload src/render.ts
```

很明显，当 `render.ts` 模块发生变更时，Vite 发现并没有 HMR 相关的处理，然后直接刷新页面了。

现在让我们在 `render.ts` 中加上如下的代码:

```js
// 条件守卫
+ if (import.meta.hot) {
+ import.meta.hot.accept((mod) => mod.render())
+ }
```

`import.meta.hot` 对象只有在开发阶段才会被注入到全局，生产环境是访问不到的，另外增加条件守卫之后，打包时识别到 if 条件不成立，会自动把这部分代码从打包产物中移除，来优化资源体积。因此，我们只需要增加这个条件守卫语句。

接下来，可以注意到我们对于 `import.meta.hot.accept` 的使用:

```js
import.meta.hot.accept(mod => mod.render())
```

这里我们传入了一个回调函数作为参数，入参即为 Vite 给我们提供的更新后的模块内容，在浏览器中打印 mod 内容如下，正好是 render 模块最新的内容:

![iShot_2023-11-08_21.25.44.png](https://s2.loli.net/2023/11/08/yA27KvxTRs45hfg.png)

我们在回调中调用了一下 `mod.render` 方法，也就是当模块变动后，每次都重新渲染一遍内容。这时你可以试着改动一下渲染的内容，然后到浏览器中注意一下 `count` 的情况，并没有被重新置零，而是保留了原有的状态:

![iShot_2023-11-08_21.27.27.png](https://s2.loli.net/2023/11/08/vX59ehMycAKxkOg.png)

没错，现在 `render` 模块更新后，只会重新渲染这个模块的内容，而对于 state 模块的内容并没有影响，并且控制台的 log 也发生了变化:

```txt
[vite] hmr update /src/render.ts
```

现在我们算是实现了初步的 HMR，也在实际的代码中体会到了 accept 方法的用途。当然，在这个例子中我们传入了一个回调函数来手动调用 render 逻辑，但事实上你也可以什么参数都不传，这样 vite 只会把 `render` 模块的最新内容执行一遍，但 `render` 模块内部只声明了一个函数，因此直接调用 `import.meta.hot.accept()` 并不会重新渲染页面。

###### 2.接受依赖模块的更新

上面介绍了 `接受自身模块更新` 的情况，现在来分析一下 `接受依赖模块更新` 是如何做到的。先给大家放一张原理图，直观地感受一下:

![iShot_2023-11-08_21.30.17.png](https://s2.loli.net/2023/11/08/N78KEzJewfviMIl.png)

还是拿示例项目来举例， `main` 模块依赖 `render` 模块，也就是说， `main` 模块是 `render` 父模块，那么我们也可以在 `main` 模块中接受 `render` 模块的更新，此时 HMR 边界就是 `main` 模块了。

我们将 `render` 模块的 accept 相关代码先删除：

```js
// render.ts
- if (import.meta.hot) {
- import.meta.hot.accept((mod) => mod.render())
- }
```

然后在 `main` 模块增加如下代码：

```js
// main.ts
import { render } from './render';
import './state';
render();

+if (import.meta.hot) {

+  import.meta.hot.accept('./render.ts', (newModule) => {
+    newModule.render();
+  })
+}
```

在这里我们同样是调用 accept 方法，与之前不同的是，第一个参数传入一个依赖的路径，也就是 `render` 模块的路径，这就相当于告诉 Vite: 我监听了 `render` 模块的更新，当它的内容更新的时候，请把最新的内容传给我。同样的，第二个参数中定义了模块变化后的回调函数，这里拿到了 `render` 模块最新的内容，然后执行其中的渲染逻辑，让页面展示最新的内容。

通过接受一个依赖模块的更新，我们同样又实现了 HMR 功能，你可以试着改动 `render` 模块的内容，可以发现页面内容正常更新，并且状态依然保持着原样。

###### 3.接受多个子模块的更新

接下来是最后一种 accept 的情况——接受多个子模块的更新。有了上面两种情况的铺垫，这里再来理解第三种情况就容易多了，我依然先给出原理示意图:

这里的意思是**父模块可以接受多个子模块的更新**，**当其中任何一个子模块更新之后，父模块会成为 HMR 边界**。还是拿之前的例子来演示，现在我们更改 main 模块代码:

```js
// main.ts
import { render } from './render';
import { initState } from './state';
render();
initState();
+if (import.meta.hot) {
+  import.meta.hot.accept(['./render.ts', './state.ts'], (modules) => {
+    console.log(modules);
+  })
+}
```

在代码中我们通过 accept 方法接受了 `render` 和 `state` 两个模块的更新，接着让我们手动改动一下某一个模块的代码，观察一下回调中 `modules` 的打印内容。例如当我改  
动 `state` 模块的内容时，回调中拿到的 modules 是这样的:

![iShot_2023-11-08_21.35.10.png](https://s2.loli.net/2023/11/08/vVXIrtRJ6dFgO5Y.png)

可以看到 Vite 给我们的回调传来的参数 `modules` 其实是一个数组，和我们第一个参数声明的子模块数组一一对应。因此 `modules` 数组第一个元素是 `undefined` ，表示 `render` 模块并没有发生变化，第二个元素为一个 Module 对象，也就是经过变动后 `state` 模块的最新内容。于是在这里，我们根据 `modules` 进行自定义的更新，修改 `main.ts` :

```js
// main.ts
import { render } from './render'
import { initState } from './state'
render()
initState()
if (import.meta.hot) {
  import.meta.hot.accept(['./render.ts', './state.ts'], modules => {
    // 自定义更新
    const [renderModule, stateModule] = modules
    if (renderModule) {
      renderModule.render()
    }
    if (stateModule) {
      stateModule.initState()
    }
  })
}
```

现在，你可以改动两个模块的内容，可以发现，页面的相应模块会更新，并且对其它的模块没有影响。但实际上你会发现另外一个问题，当改动了 `state` 模块的内容之后，页面的内容会变得错乱:

![iShot_2023-11-08_21.37.03.png](https://s2.loli.net/2023/11/08/WlRSX56xrPfvj8F.png)

这是为什么呢?

我们快速回顾一下 `state` 模块的内容:

```js
// state.ts
export function initState() { let count = 0; setInterval(() => {
let countEle = document.getElementById('count');
    countEle!.innerText =  ++count + '';
  }, 1000);
}
```

其中设置了一个定时器，但当模块更改之后，这个定时器并没有被销毁，紧接着我们在 accept 方法调用 `initState` 方法又创建了一个新的定时器，导致 count 的值错乱。那如何来解决这个问题呢?这就涉及到新的 HMR 方法—— `dispose` 方法了。

##### 模块销毁时逻辑：hot.dispose

这个方法相较而言就好理解多了，代表在模块更新、旧模块需要销毁时需要做的一些事情，拿刚刚的场景来说，我们可以通过在 `state` 模块中调用 dispose 方法来轻松解决定时器共存的问题，代码改动如下:

```js
// state.ts
let timer: number | undefined;
if (import.meta.hot) { import.meta.hot.dispose(() => {
if (timer) { clearInterval(timer);
} })
}
export function initState() {
let count = 0;
timer = setInterval(() => {
let countEle = document.getElementById('count');
    countEle!.innerText =  ++count + '';
  }, 1000);
}
```

此时，我们再来到浏览器观察一下 HMR 的效果:

![iShot_2023-11-08_21.40.44.png](https://s2.loli.net/2023/11/08/5mUjWOLXewBxCa3.png)

可以看到，当我稍稍改动一下 `state` 模块的内容(比如加个空格)，页面确实会更新，而且也没有状态错乱的问题，说明我们在模块销毁前清除定时器的操作是生效的。但你又可以很明显地看到一个新的问题: 原来的状态丢失了， count ` ` 的内容从 `64` 突然变成 `1` 。这又是为什么呢?

让我们来重新梳理一遍热更新的逻辑:

![iShot_2023-11-08_21.41.28.png](https://s2.loli.net/2023/11/08/mcHGfJUbhVrIKSM.png)

当我们改动了 `state` 模块的代码， `main` 模块接受更新，执行 accept 方法中的回调，接着会执行 `state` 模块的 `initState` 方法。注意了，此时新建的 `initstate` 方法的确会初始化定时器，但同时也会初始化 `count` 变量，也就是 `count` 从 `0` 开始计数了! 这显然是不符合预期的，我们期望的是每次改动 state `模块`，之前的状态都保存下来。怎么来实现呢?

##### 共享数据：hot.data 属性

这就不得不提到 hot 对象上的 data 属性了，这个属性用来在不同的模块实例间共享一些数据。使用上也非常简单，让我们来重构一下 `state` 模块:

```js
let timer: number | undefined;
if (import.meta.hot) {
+ // 初始化 count
+ if (!import.meta.hot.data.count) { + import.meta.hot.data.count = 0; +}
  import.meta.hot.dispose(() => {
    if (timer) {
      clearInterval(timer);
    }
}) }
export function initState() {
+  const getAndIncCount = () => {
+    const data = import.meta.hot?.data || {
+      count: 0
+    };
+    data.count = data.count + 1;
+    return data.count;
+  };
  timer = setInterval(() => {
    let countEle = document.getElementById('count');
+    countEle!.innerText =  getAndIncCount() + '';
  }, 1000);
}
```

我们在 `import.meta.hot.data` 对象上挂载了一个 `count` 属性，在二次执行 `initState` 的时候便会复用 `import.meta.hot.data` 上记录的 count 值，从而实现状态的保存。

此时，我们终于大功告成，基本实现了这个示例应用的 HMR 的功能。在这个过程中，我们用到了核心的 `accept` 、 `dispose` 和 `data` 属性和方法。当然还有一些方法将会给大家进行介绍，但相较而言就比较简单了，而且用的也不多，大家只需要留下初步的印象，知道这些方法的用途是什么，需要用到的时候再来查阅即可。

##### 其他方法

###### 1.import.meta.hot.decline()

这个方法调用之后，相当于表示此模块不可热更新，当模块更新时会强制进行页面刷新。感兴趣的同学可以继续拿上面的例子来尝试一下。

###### 2.import.meta.hot.invalidate()

这个方法就更简单了，只是用来强制刷新页面。

###### 3.自定义事件

你还可以通过 `import.meta.hot.on` 来监听 HMR 的自定义事件，内部有这么几个事件会自动触发:

- `vite:beforeUpdate`： 当模块更新时触发
- `vite:beforeFullReload`：当即将重新刷新页面时触发
- `vite:beforePrune`： 当不再需要的模块即将被剔除时触发
- `vite:error`： 当发生错误时(例如，语法错误)触发

如果你想自定义事件可以通过上节中提到的 handleHotUpdate 这个插件 Hook 来进行触发:

```js
// 插件 Hook handleHotUpdate({ server }) {
  server.ws.send({
    type: 'custom',
    event: 'custom-update',
    data: {}
})
return [] }
// 前端代码
import.meta.hot.on('custom-update', (data) => {
// 自定义更新逻辑 })
```

### 代码分割

我们将一起分析 `Code Splitting` 解决了单产物打包模式下的哪些问题，然后用具体的项目示例体验一下 Vite 默认自带的 `Code Splitting` 效果。从中，你将了解到 Vite 的默认分包策略，以及底层所使用的 Rollup 拆包 API—— `munaulChunks`。

在实际的项目场景中，只用 Vite 默认的策略是不够的，我们会更深入一步，学习 Rollup 底层拆包的各种高级姿势，实现 `自定义拆包`，同时我也会带大家通过实际案例复现 Rollup 自定义拆包经常遇到的坑—— `循环引用` 问题，一起分析问题出现的原因。

需要注意的是，文中会多次提到 `bundle` 、`chunk`、`vendor` 这些构建领域的专业概念，这里给大家提前解释一下:

- `bundle` 指的是整体的打包产物，包含 JS 和各种静态资源。
- `chunk` 指的是打包后的 JS 文件，是 `bundle` 的子集。
- `vendor` 是指第三方包的打包产物，是一种特殊的 chunk

#### Code Splitting 解决的问题

在传统的单 chunk 打包模式下，当项目代码越来越庞大，最后会导致浏览器下载一个巨大的文件，从页面加载性能的角度来说，主要会导致两个问题:

- 无法做到**按需加载**，即时是当前页面不需要的代码也会进行加载
- 线上 `缓存复用率` 极低，改动一行代码即可导致整个 bundle 产物缓存失效

首先说第一个问题，一般而言，一个前端页面中的 JS 代码可以分为两个部分: `Initital Chunk` 和 `Async Chunk`，前者指页面首屏所需要的 JS 代码，而后者当前页面并不一定需要，一个典型的例子就是 `路由组件`，与当前路由无关的组件并不用加载。而项目被打包成单 bundle 之后，无论是 `Initial Chunk` 还是 `Async Chunk`，都会打包进同一个产物，也就是说，浏览器加载产物代码的时候，会将两者一起加载，导致许多冗余的加载过程，从而影响页面性能。而通过 `Code Splitting` 我们可以将按需加载的代码拆分出单独的 chunk，这样应用在首屏加载时只需要加载 `Initial Chunk` 即可，避免了冗余的加载过程，使页面性能得到提升。

其次，线上的 `缓存命中率` 是一个重要的性能衡量标准。对于线上站点而言，服务端一般在响应资源时加上一些 HTTP 响应头，最常见的响应头之一就是 `cache-control`，它可以指定浏览器的 `强缓存`，比如设置为下面这样:

```js
cache-control: max-age=31536000
```

表示资源过期时间为一年，在过期之前，访问 `相同的资源 url`，浏览器直接利用本地的缓存，并不用给服务端发请求，这就大大降低了页面加载的网络开销。不过，在单 chunk 打包模式下面，一旦有一行代码变动，整个 chunk 的 url 地址都会变化，比如下图所示的场景:

![iShot_2023-11-08_22.23.10.png](https://s2.loli.net/2023/11/08/P7hJktbo6CY5RWO.png)

由于构建工具一般会根据产物的内容生成哈希值，一旦内容变化就会导致整个 chunk 产物的强缓存失效，所以单 chunk 打包模式下的缓存命中率极低，基本为零。

而进行 `Code Splitting ` 之后，代码的改动只会影响部分的 chunk 哈希改动，如下图所示:

![iShot_2023-11-08_22.24.17.png](https://s2.loli.net/2023/11/08/LmAitXEUeDNJVgM.png)

入口文件引用了 `A `、 `B` 、 `C` 、 `D` 四个组件，当我们修改 A 的代码后，变动的 Chunk 就只有 `A` 以及 `依赖 A 的 Chunk` 中，A 对应的 chunk 会变动，这很好理解，后者也会变动是因为相应的引入语句会变化，如这里的入口文件会发生如下内容变动:

```js
import CompA from './A.d3e2f17a.js'
// 更新 import 语句
import CompA from './A.a5d2f82b.js'
```

也就是说，在改动 `A` 的代码后， `B` 、 `C` 、 `D` 的 chunk 产物 url 并没有发生变化，从而可以让浏览器复用本地的强缓存，大大提升线上应用的加载性能。

#### Vite 默认拆包策略

在生产环境下 Vite 完全利用 Rollup 进行构建，因此拆包也是基于 Rollup 来完成的，但 Rollup 本身是一个专注 JS 库打包的工具，对应用构建的能力还尚为欠缺，Vite 正好是补足了 Rollup 应用构建的能力，在拆包能力这一块的扩展就是很好的体现。

在项目中执行 `npm run build` ，接着终端会出现如下的构建信息:

![iShot_2023-11-08_22.28.27.png](https://s2.loli.net/2023/11/08/UIbyV8sHFAlhorE.png)

这里我来解释一下产物的结构:

```txt
.
├── assets
│   ├── Dynamic.3df51f7a.js // Async Chunk
│   ├── Dynamic.f2cbf023.css // Async Chunk (CSS)
│   ├── favicon.17e50649.svg // 静态资源
│   ├── index.1e236845.css // Initial Chunk (CSS)
│   ├── index.6773c114.js // Initial Chunk
│   └── vendor.ab4b9e1f.js // 第三方包产物 Chunk
└── index.html // 入口 HTML
```

对于 Vite 的拆包能力，从产物结构中就可见一斑。

一方面 Vite 实现了自动 **CSS 代码分割**的能力，即实现一个 chunk 对应一个 css 文件，比如上面产物中 `index.js` 对应一份 `index.css` ，而按需加载的 chunk `Danamic.js` 也对应单独的一份 `Danamic.css` 文件，与 JS 文件的代码分割同理，这样做也能提升 CSS 文件的缓存复用率。

而另一方面， Vite 基于 Rollup 的 `manualChunks` API 实现了 `应用拆包` 的策略:

- 对于 `Initital Chunk` 而言，业务代码和第三方包代码分别打包为单独的 chunk，在上述的例子中分别对应 `index.js` 和 `vendor.js` 。需要说明的是，这是 Vite 2.9 版本之前的做法，而在 Vite 2.9 及以后的版本，默认打包策略更加简单粗暴，将所有的 js 代码全部打包到 `index.js ` 中。
- 对于 `Async Chunk` 而言，动态 import 的代码会被拆分成单独的 chunk，如上述的 `Dynacmic` 组件。

小结一下，Vite 默认拆包的优势在于实现了 CSS 代码分割与业务代码、第三方库代码、动态 import 模块代码三者的分离，但缺点也比较直观，第三方库的打包产物容易变得比较臃肿，上述例子中的 `vendor.js ` 的大小已经达到 500 KB 以上，显然是有进一步拆包的优化空间的，这个时候我们就需要用到 Rollup 中的拆包 API —— `manualChunks` 了。

#### 自定义拆包策略

针对更细粒度的拆包，Vite 的底层打包引擎 Rollup 提供了 manualChunks ，让我们能自定义拆包策略，它属于 Vite 配置的一部分，示例如下:

```js
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        // manualChunks 配置
        manualChunks: {}
      }
    }
  }
}
```

`manualChunks` 主要有两种配置的形式，可以配置为一个对象或者一个函数。我们先来看看对象的配置，也是最简单的配置方式，你可以在上述的示例项目中添加如下的 `manualChunks` 配置代码:

```js
// vite.config.ts
{
build: {
    rollupOptions: {
      output: {
// manualChunks 配置
manualChunks: {
// 将 React 相关库打包成单独的 chunk 中
'react-vendor': ['react', 'react-dom'],
// 将 Lodash 库的代码单独打包
'lodash': ['lodash-es'],
// 将组件库的代码打包
    'library': ['antd', '@arco-design/web-react'],
    },
},
}
},
}
```

在对象格式的配置中， `key` 代表 chunk 的名称， `value` 为一个字符串数组，每一项为第三方包的包名。在进行了如上的配置之后，我们可以执行 `npm run build` 尝试一下打包:

![iShot_2023-11-08_22.35.51.png](https://s2.loli.net/2023/11/08/REcDrnXvudk73Yq.png)

你可以看到原来的 vendor 大文件被拆分成了我们手动指定的几个小 chunk，每个 chunk 大概 200 KB 左右，是一个比较理想的 chunk 体积。这样，当第三方包更新的时候，也只会更新其中一个 chunk 的 url，而不会全量更新，从而提高了第三方包产物的缓存命中率。

除了对象的配置方式之外，我们还可以通过函数进行更加灵活的配置，而 Vite 中的默认拆包策略也是通过函数的方式来进行配置的，我们可以在 Vite 的实现中瞧一瞧:

```js
// Vite 部分源码
function createMoveToVendorChunkFn(config: ResolvedConfig): GetManualChunk {
const cache = new Map<string, boolean>() // 返回值为 manualChunks 的配置
return (id, { getModuleInfo }) => {
// Vite 默认的配置逻辑其实很简单
// 主要是为了把 Initial Chunk 中的第三方包代码单独打包成`vendor.[hash].js`
if (
id.includes('node_modules') &&
!isCSSRequest(id) &&
// 判断是否为 Initial Chunk
staticImportedByEntry(id, getModuleInfo, cache)
){
return 'vendor'
}
}
}
```

Rollup 会对每一个模块调用 manualChunks 函数，在 manualChunks 的函数入参中你可以拿到 `模块 id` 及 `模块详情信息` ，经过一定的处理后返回 `chunk 文件的名称` ，这样当前 id 代表的模块便会打包到你所指定的 chunk 文件中。

我们现在来试着把刚才的拆包逻辑用函数来实现一遍:

```js
manualChunks(id) {
if (id.includes('antd') || id.includes('@arco-design/web-react')) {
return 'library'; }
if (id.includes('lodash')) { return 'lodash';
}
if (id.includes('react')) {
return 'react'; }
}
```

打包后结果如下:

![iShot_2023-11-08_22.38.54.png](https://s2.loli.net/2023/11/08/RKxPupeArHyFmZz.png)

看上去好像各个第三方包的 chunk (如 `lodash` 、 `react` 等等)都能拆分出来，但实际上你可以运行 `npx vite preview` 预览产物，会发现产物根本没有办法运行起来，页面出现白屏，同时控制台出现如下的报错:

![iShot_2023-11-08_22.39.47.png](https://s2.loli.net/2023/11/08/yTbFL3S7omYnkE4.png)

这也就是函数配置的坑点所在了，虽然灵活而方便，但稍不注意就陷入此类的产物错误问
题当中。那上面的这个报错究竟是什么原因导致的呢?

从报错信息追溯到产物中，可以发现 react-vendor.js 与 index.js 发生了循环引用:

```js
// react-vendor.e2c4883f.js
import { q as objectAssign } from './index.37a7b2eb.js'
// index.37a7b2eb.js
import { R as React } from './react-vendor.e2c4883f.js'
```

这是很典型的 ES 模块循环引用的场景，我们可以用一个最基本的例子来复原这个场景:

```js
// a.js
import { funcB } from './b.js'
funcB()
export var funcA = () => {
  console.log('a')
}
// b.js
import { funcA } from './a.js'
funcA()
export var funcB = () => {
  console.log('b')
}
```

接着我们可以执行一下 a.js 文件:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <script
      type="module"
      src="/a.js"
    ></script>
  </body>
</html>
```

在浏览器中打开会出现类似的报错:

![iShot_2023-11-08_22.45.02.png](https://s2.loli.net/2023/11/08/5VZUs83zedaRvcQ.png)

代码的执行原理如下:

- JS 引擎执行 `a.js` 时，发现引入了 `b.js` ，于是去执行 `b.js`
- 引擎执行 `b.js `，发现里面引入了 `a.js` (出现循环引用)，认为 `a.js` 已经加载完成，继续往下执行
- 执行到 `funcA()` 语句时发现 funcA 并没有定义，于是报错

![iShot_2023-11-08_22.47.24.png](https://s2.loli.net/2023/11/08/A56wxgWKP7vNnCY.png)

而对于如上打包产物的执行过程也是同理:

![iShot_2023-11-08_22.47.55.png](https://s2.loli.net/2023/11/08/tqxjaO2ybgYrEkh.png)

可能你会有疑问: `react-vendor` 为什么需要引用 `index.js` 的代码呢?其实也很好理解，我们之前在 `munaulChunks` 中仅仅将路径包含 `react` 的模块打包到 `react-vendor` 中，殊不知，像 `object-assign` 这种 react 本身的依赖并没有打包进 `react-vendor` 中，而是打包到另外的 chunk 当中，从而导致如下的循环依赖关系:

那我们能不能避免这种问题呢?当然是可以的，之前的 `manualChunks` 逻辑过于简单粗暴，仅仅通过路径 id 来决定打包到哪个 chunk 中，而漏掉了间接依赖的情况。如果针对像 `object-assign` 这种间接依赖，我们也能识别出它属于 react 的依赖，将其自动打包到 `react-vendor` 中，这样就可以避免循环引用的问题。

我们来梳理一下解决的思路:

- 确定 react 相关包的入口路径
- 在 manualChunks 中拿到模块的详细信息，向上追溯它的引用者，如果命中 react 的路径，则将模块放到 `react-vendor` 中。

接下来让我们进行实际代码的实现:

```js
// 确定 react 相关包的入口路径 const chunkGroups = {
  'react-vendor': [
    require.resolve('react'),
    require.resolve('react-dom')
], }
// Vite 中的 manualChunks 配置
function manualChunks(id, { getModuleInfo }) {
for (const group of Object.keys(chunkGroups)) {
const deps = chunkGroups[group];
if (
id.includes('node_modules') &&
// 递归向上查找引用者，检查是否命中 chunkGroups 声明的包
isDepInclude(id, deps, [], getModuleInfo)
){
return group;
} }
}
```

实际上核心逻辑包含在 `isDepInclude` 函数，用来递归向上查找引用者模块:

```js
// 缓存对象
const cache = new Map();
function isDepInclude (id: string, depPaths: string[], importChain: string[], getModuleInfo):
const key = `${id}-${depPaths.join('|')}`;
// 出现循环依赖，不考虑
if (importChain.includes(id)) {
    cache.set(key, false);
	return false;
}
// 验证缓存
if (cache.has(key)) {
return cache.get(key);
}
// 命中依赖列表
if (depPaths.includes(id)) {
// 引用链中的文件都记录到缓存中
importChain.forEach(item => cache.set(`${item}-${depPaths.join('|')}`, true));
return true;
}
const moduleInfo = getModuleInfo(id);
if (!moduleInfo || !moduleInfo.importers) {
    cache.set(key, false);
	return false;
}
// 核心逻辑，递归查找上层引用者
const isInclude = moduleInfo.importers.some(
importer => isDepInclude(importer, depPaths, importChain.concat(id), getModuleInfo)
);
// 设置缓存
cache.set(key, isInclude);
return isInclude;
};
```

对于这个函数的实现，有两个地方需要大家注意:

- 我们可以通过 manualChunks 提供的入参 `getModuleInfo` 来获取模块的详情 `moduleInfo`，然后通过 `moduleInfo.importers` 拿到模块的引用者，针对每个引用者又可以递归地执行这一过程，从而获取引用链的信息。
- 尽量使用缓存。由于第三方包模块数量一般比较多，对每个模块都向上查找一遍引用链会导致开销非常大，并且会产生很多重复的逻辑，使用缓存会极大加速这一过程。

完成上述 `manualChunks` 的完整逻辑后，现在我们来执行来进行打包,发现可以 `react-vendor` 可以正常拆分出来，查看他的内容：

![iShot_2023-11-08_22.56.33.png](https://s2.loli.net/2023/11/08/AD2numQacO9yBMF.png)

从中你可以看出 `react` 的一些间接依赖已经成功打包到了 `react-vendor` 当中，执行 `npx view preview` 预览产物页面也能正常渲染了:

尽管上述的解决方案已经能帮我们正常进行产物拆包，但从实现上来看，还是显得略微繁
琐，那么有没有开箱即用的拆包方案，能让我们直接用到项目中呢?

答案是肯定的，接下来我就给大家介绍 Vite 自定义拆包的终极解决方案—— `vite-plugin-chunk-split`

首先安装一下这个插件:

```shell
pnpm i vite-plugin-chunk-split -D
```

然后你可以在项目中引入并使用:

```js
// vite.config.ts
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
export default {
chunkSplitPlugin({
// 指定拆包策略
customSplitting: {
// 1. 支持填包名。`react` 和 `react-dom` 会被打包到一个名为`render-vendor`的 chunk 里面
'react-vendor': ['react', 'react-dom'],
// 2. 支持填正则表达式。src 中 components 和 utils 下的所有文件被会被打包为`component-util`
'components-util': [/src\/components/, /src\/utils/]
}
})
}
```

相比于手动操作依赖关系，使用插件只需几行配置就能完成，非常方便。当然，这个插件还可以支持多种打包策略，包括 unbundle 模式打包，你可以去[使用文档](https://github.com/sanyuan0704/vite-plugin-chunk-split/blob/master/README-CN.md) 探索更多使用方式。

### 语法降级与 Polyfill：解决低版本浏览器兼容问题

> 通过 Vite 构建我们完全可以兼容各种低版本浏览器，打包出既支持现代( `Modern` ) 浏览器又支持旧版( `Legacy` )浏览器的产物。

#### 场景复现

首先我们来复现一下问题场景，下面两张图代表了之前我在线上环境真实遇到的报错案例:

![Snipaste_2023-11-09_11-10-34.png](https://f.pz.al/pzal/2023/11/09/413f2cad0232a.png)

某些低版本浏览器并没有提供 `Promise` 语法环境以及对象和数组的各种 API，甚至不支持箭头函数语法，代码直接报错，从而导致线上白屏事故的发生，尤其是需要兼容到 `IE11`、`iOS 9` 、`Android 4.4` 的场景中很容易中遇到。

旧版浏览器的语法兼容问题主要分两类: `语法降级问题` 和 ` Polyfill 缺失问题`。前者比较理解，比如某些浏览器不支持箭头函数，我们就需要将其转换为 `function(){}` 语法；而对后者来说， `Polyfill` 本身可以翻译为 `垫片` ，也就是为浏览器提前注入一些 API 的实现代码，如 `Object.entries` 方法的实现，这样可以保证产物可以正常使用这些 API，防止报错。

这两类问题本质上是通过前端的编译工具链(如 `Babel` )及 JS 的基础 Polyfill 库(如 `corejs` )来解决的，不会跟具体的构建工具所绑定。也就是说，对于这些本质的解决方案，在其它的构建工具(如 Webpack)能使用，在 Vite 当中也完全可以使用。

构建工具考虑的仅仅是如何将这些底层基础设施接入到构建过程的问题，自己并不需要提供底层的解决方案，正所谓 `术业有专攻` ，把专业的事情交给专业的工具去做。接下来的部分，我就来带你熟悉一下所谓专业的工具到底有哪些，以及如何使用这些工具。

#### 底层工具链

##### 1.工具概览

解决上述提到的两类语法兼容问题，主要需要用到两方面的工具，分别包括:

- `编译时工具`：代表工具有 `@babel/preset-env` 和 `@babel/plugin-transformruntime `。
- `运行时基础库`：代表库包括 `core-js` 和 `regenerator-runtime` 。

编译时工具的作用是在代码编译阶段进行 `语法降级` 及 `添加` `polyfill` 代码的引用语句，如:

```js
import 'core-js/modules/es6.set.js'
```

由于这些工具只是编译阶段用到，运行时并不需要，我们需要将其放入 `package.json` 中的 `devDependencies` 中。

而运行时基础库是根据 `ESMAScript` 官方语言规范提供各种 `Polyfill` 实现代码，主要包括 ` core-js` 和 `regenerator-runtime` 两个基础库，不过在 babel 中也会有一些上层的封装，包括：

- [@babel/polyfill](https://babeljs.io/docs/babel-polyfill)
- [@babel/runtime]([@babel/runtime · Babel (babeljs.io)](https://babeljs.io/docs/babel-runtime))
- [@babel/runtime-corejs 2]([@babel/runtime-corejs2 · Babel (babeljs.io)](https://babeljs.io/docs/babel-runtime-corejs2))
- [@babel、runtime-corejs3]([Page Not Found · Babel (babeljs.io)](https://babeljs.io/docs/babel-runtime-corejs3))

看似各种运行时库眼花缭乱，其实都是 c `ore-js` 和 `regenerator-runtime` 不同版本的封装罢了( `@babel/runtime` 是个特例，不包含 `core-js` 的 Polyfill)。这类库是项目运行时必须要使用到的，因此一定要放到 `package.json` 中的 `dependencies` 中！

##### 2.实际使用

先按照如下的命令初始化项目:

```shell
mkdir bael-test
npm init -y
```

然后安装一些必要的依赖：

```shell
pnpm i @babel/cli @babel/core @babel/preset-env
```

- `@babel/cli`：为 babel 官方的脚手架工具，很适合我们练习用
- `@babel/core`：babel 核心编译库
- `@babel/preset-env`：babel 的预设工具集，基本为 babel 必装的库

接着新建 `src` 目录，在目录下增加 `index.js` 文件:

```js
const func = async () => {
  console.log(12123)
}
Promise.resolve().finally()
```

你可以看到，示例代码中既包含了 `高级语法` 也包含现代浏览器的 `API` ，正好可以针对语法降级和 Polyfill 注入两个功能进行测试。

接下来新建 `.babelrc.json` 即 babel 的配置文件，内容如下:

```js
{
 "presets": [
 [
 "@babel/preset-env",
 {
 // 指定兼容的浏览器版本
 "targets": {
 "ie": "11"
 },
 // 基础库 core-js 的版本，一般指定为最新的大版本
 "corejs": 3,
 // Polyfill 注入策略，后文详细介绍
 "useBuiltIns": "usage",
 // 不将 ES 模块语法转换为其他模块语法
 "modules": false
 }
 ]
 ]
}
```

其中有两个比较关键的配置: `targets` 和 `usage` ：

我们可以通过 `targets` 参数指定要兼容的浏览器版本，你既可以填如上配置所示的一个对象:

```js
{
"targets":{
"ie":"11"
}
}
```

也可以用 [GitHub - browserslist/browserslist: 🦔 Share target browsers between different front-end tools, like Autoprefixer, Stylelint and babel-preset-env](https://github.com/browserslist/browserslist) 配置语法:

```js
{
 // ie 不低于 11 版本，全球超过 0.5% 使用，且还在维护更新的浏览器
 "targets": "ie >= 11, > 0.5%, not dead"
}
```

Browserslist 是一个帮助我们设置目标浏览器的工具，不光是 Babel 用到，其他的编译工具如 `postcss-preset-env` 、 `autoprefix` 中都有所应用。对于 `Browserslist` 的配置内容，你既可以放到 Babel 这种特定工具当中，也可以在 `package.json` 中通过 `browserslist` 声明：

```js
// package.json
{
 "browserslist": "ie >= 11"
}

```

或者通过 `.browserslistrc` 进行声明：

```js
//.browserslistrc
ie >= 11
```

在实际的项目中，一般我们可以将使用下面这些最佳实践集合来描述不同的浏览器类型，减轻配置负担:

```txt
// 现代浏览器
last 2 versions and since 2018 and > 0.5%
// 兼容低版本 PC 浏览器
IE >= 11, > 0.5%, not dead
// 兼容低版本移动端浏览器
iOS >= 9, Android >= 4.4, last 2 versions, > 0.2%, not dead
```

对于这些配置对应的具体浏览器列表，大家可以去 [Browserslist](https://browserslist.dev/?q=bGFzdCAyIHZlcnNpb25z) 站点查看:

![Snipaste_2023-11-09_11-56-16.png](https://f.pz.al/pzal/2023/11/09/0c894c2bdd7ef.png)

在说明了目标浏览器的配置之后，接下来我们来看另外一个重要的配置—— `useBuiltIns` ，它决定了添加 Polyfill 策略，默认是 `false` ，即不添加任何的 Polyfill。你可以手动将 `useBuiltIns` 配置为 `entry` 或者 `usage` ，接下来我们看看这两个配置究竟有什么区别。

首先你可以将这个字段配置为 `entry` ，需要注意的是， `entry` 配置规定你必须在入口文件手动添加一行这样的代码:

```js
//index.js开头加上
import 'cpre-js'
```

接着在终端执行下面的命令进行 Babel 编译：

```shell
npx babel src --out-dir dist
```

产物输出在 `dist` 目录中，我们可以去观察一下产物的代码：

![Snipaste_2023-11-09_12-00-02.png](https://f.pz.al/pzal/2023/11/09/120756086eed0.png)

Babel 已经根据 `目标浏览器` 的配置为我们添加了大量的 Polyfill 代码， `index.js` 文件简单的几行代码被编译成近 300 行。实际上，Babel 所做的事情就是将你的 ` import "core-js"` 代码替换成了产物中的这些具体模块的导入代码。

但这个配置有一个问题，即无法做到按需导入，上面的产物代码其实有大部分的 Polyfill 的代码我们并没有用到。接下来我们试试 `useBuiltIns: usage` 这个按需导入的配置，改动配置后执行编译命令:

```shell
npx babel src --out-dir dist
```

同样可以看到产物输出在了 `dist/index.js` 中，内容如下所示:

![Snipaste_2023-11-09_14-07-04.png](https://f.pz.al/pzal/2023/11/09/989f9bb91d19f.png)

> Polyfill 代码主要来自 corejs 和 regenerator-runtime ，因此如果要运行起来，必须要装这两个库。

可以发现 Polyfill 的代码精简了许多，真正地实现了按需 Polyfill 导入。因此，在实际的使用当中，还是推荐大家尽量使用 `useBuiltIns: "usage"` ，进行按需的 Polyfill 注入

我们来梳理一下，上面我们利用 `@babel/preset-env` 进行了目标浏览器语法的降级和 `Polyfill` 注入，同时用到了 `core-js` 和 `regenerator-runtime` 两个核心的运行时库。但 `@babel/preset-env` 的方案也存在一定局限性:

- 如果使用新特性，往往是通过基础库(如 core-js)往全局环境添加 Polyfill，如果是开发应用没有任何问题，如果是开发第三方工具库，则很可能会对 `全局空间造成污染`。
- 很多工具函数的实现代码(如上面示例中的 `_defineProperty` 方法),会在许多哦文件中重新出现，造成文件体积冗余。

##### 3.更优的 Polyfill 注入方案：transform-runtime

接下来要介绍的 `transform-runtime` 方案，就是为了解决 `@babel/preset-env` 的种种局限性：

> 需要提前说明的是， `transform-runtime` 方案可以作为 `@babel/preset-env` 中 `useBuiltIns` 配置的替代品，也就是说，一旦使用 `transform-runtime` 方案，你应该把 `useBuiltIns` 属性设为 `false`

接下来我们来尝试一下这个方案，首先安装必要的依赖:

```shell
pnpm i @babel/plugin-transform-runtime -D
pnpm i @babel/runtime-corejs3 -S
```

我解释一下这两个依赖的作用: 前者是编译时工具，用来转换语法和添加 Polyfill，后者是运行时基础库，封装了 `core-js` 、 `regenerator-runtime` 和各种语法转换用到的 `工具函数` 。

> core-js 有三种产物，分别是 `core-js` 、 `core-js-pure` 和 `core-js-bundle` 。第一种是全局 Polyfill 的做法，@babel/preset-env 就是用的这种产物；第二种不会把 Polyfill 注入到全局环境，可以按需引入；第三种是打包好的版本，包含所有的 Polyfill，不太常用。 `@babel/runtime-corejs3` 使用的是第二种产物。

接着我们对 `.babelrc.json` 做如下的配置：

```js
{
 "plugins": [
 // 添加 transform-runtime 插件
 [
 "@babel/plugin-transform-runtime",
 {
 "corejs": 3
 }
 ]
 ],
 "presets": [
 [
 "@babel/preset-env",
 {
 "targets": {
 "ie": "11"
 },
 "corejs": 3,
 // 关闭 @babel/preset-env 默认的 Polyfill 注入
 "useBuiltIns": false,
 "modules": false
 }
 ]
 ]
}
```

执行终端命令

```shell
npx babel src --out-dir dist
```

我们可以对比一下 @babel/preset-env 下的产物结果:

![Snipaste_2023-11-09_14-28-32.png](https://f.pz.al/pzal/2023/11/09/ab3aabbe3fab0.png)

经过对比我们不难发现， `transform-runtime` 一方面能够让我们在代码中使用`非全局版本` 的 Polyfill，这样就避免全局空间的污染，这也得益于 `core-js` 的 pure 版本产物特性；另一方面对于 asyncToGeneator 这类的工具函数，它也将其转换成了一段引入语句，不再将完整的实现放到文件中，节省了编译后文件的体积。

另外， `transform-runtime` 方案引用的基础库也发生了变化，不再是直接引入 core-js和 regenerator-runtime ，而是引入 `@babel/runtime-corejs3` 。

介绍完了 Babel 语法降级与 Polyfill 注入的底层方案，接下来我们来看看如何在 Vite 中利用这些方案来解决低版本浏览器的兼容性问题。

#### vite 语法降级及 Polyfill 注入

Vite 官方已经为我们封装好了一个开箱即用的方案: `@vitejs/plugin-legacy` ，我们可以基于它来解决项目语法的浏览器兼容问题。这个插件内部同样使用 `@babel/preset-env` 以及 `core-js` 等一系列基础库来进行语法降级和 Polyfill 注入，因此我觉得对于上文所介绍的底层工具链的掌握是必要的，否则无法理解插件内部所做的事情，真正遇到问题时往往会不知所措。

##### 插件使用

首先让我们来安装一下官方的插件：

```shell
pnpm i @viteks/plugin-lehgacy -D
```

随后在项目中使用它：

```js
// vite.config.ts
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'
export default defineConfig({
  plugins: [
    // 省略其它插件
    legacy({
      // 设置目标浏览器，browserslist 配置语法
      targets: ['ie >= 11']
    })
  ]
})
```

我们同样可以通过 targets 指定目标浏览器，这个参数在插件内部会透传给 `@babel/preset-env` 。

在引入插件后，我们可以尝试执行 `npm run build` 对项目进行打包，可以看到如下的产物信息:

![Snipaste_2023-11-09_14-35-56.png](https://f.pz.al/pzal/2023/11/09/7379585ad3f07.png)

相比一般的打包过程，多出了 ` index-legacy.js` 、 `vendor-legacy.js` 以及 `polyfills-legacy.js` 三份产物文件。让我们继续观察一下 `index.html` 的产物内容:

```html
<!DOCTYPE html>
<html lang="en">
 <head>
 <meta charset="UTF-8" />
 <link rel="icon" type="image/svg+xml" href="/assets/favicon.17e50649.svg" />
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 <title>Vite App</title>
 <!-- 1. Modern 模式产物 -->
 <script type="module" crossorigin src="/assets/index.c1383506.js"></script>
 <link rel="modulepreload" href="/assets/vendor.0f99bfcc.js">
 <link rel="stylesheet" href="/assets/index.91183920.css">
 </head>
 <body>
 <div id="root"></div>
 <!-- 2. Legacy 模式产物 -->
 <script nomodule>兼容 iOS nomodule 特性的 polyfill，省略具体代码</script>
 <script nomodule id="vite-legacy-polyfill" src="/assets/polyfills-legacy.36fe2f9e.js"></s
 <script nomodule id="vite-legacy-entry" data-src="/assets/index-legacy.c3d3f501.js">Syste
 </body>
</html>
```

通过官方的 `legacy` 插件， Vite 会分别打包出 `Modern` 模式和 `Legacy` 模式的产物，然后

将两种产物插入同一个 HTML 里面， `Modern` 产物被放到 type="module" 的 script 标签中，而 Legacy 产物则被放到带有 `nomodule` 的 script 标签中。浏览器的加载策略如下图所示:

![Snipaste_2023-11-09_14-37-54.png](https://f.pz.al/pzal/2023/11/09/4f872790d2dc9.png)

这样产物便就能够同时放到现代浏览器和不支持 ` type="module"` 的低版本浏览器当中执行。当然，在具体的代码语法层面，插件还需要考虑语法降级和 Polyfill 按需注入的问题，接下来我们就来分析一下 Vite 的官方 `legacy` 插件是如何解决这些问题的。

##### 插件执行原理

官方的 `legacy` 插件是一个相对复杂度比较高的插件，直接看源码可能会很难理解，这里我梳理了画了一张简化后的流程图，接下来我们就根据这张流程图来一一拆解这个插件在各个钩子阶段到底做了些什么。

![Snipaste_2023-11-09_14-39-39.png](https://f.pz.al/pzal/2023/11/09/5f7380349b76b.png)

首先是在 `configResolved` 钩子中调整了 `output` 属性，这么做的目的是让 Vite 底层使用的打包引擎 Rollup 能另外打包出一份 ` Legacy 模式` 的产物，实现代码如下:

```js
const createLegacyOutput = (options = {}) => {
  return {
    ...options,
    // system 格式产物
    format: 'system',
    // 转换效果: index.[hash].js -> index-legacy.[hash].js
    entryFileNames: getLegacyOutputFileName(options.entryFileNames),
    chunkFileNames: getLegacyOutputFileName(options.chunkFileNames)
  }
}
const { rollupOptions } = config.build
const { output } = rollupOptions
if (Array.isArray(output)) {
  rollupOptions.output = [...output.map(createLegacyOutput), ...output]
} else {
  rollupOptions.output = [createLegacyOutput(output), output || {}]
}
```

接着，在 `renderChunk` 阶段，插件会对 Legacy 模式产物进行语法转译和 Polyfill 收集，值得注意的是，这里并不会真正注入 Polyfill ，而仅仅只是收集 Polyfill :

```js
{
 renderChunk(raw, chunk, opts) {
 // 1. 使用 babel + @babel/preset-env 进行语法转换与 Polyfill 注入
 // 2. 由于此时已经打包后的 Chunk 已经生成
 // 这里需要去掉 babel 注入的 import 语句，并记录所需的 Polyfill
 // 3. 最后的 Polyfill 代码将会在 generateBundle 阶段生成
 }
}
```

由于场景是应用打包，这里直接使用 @babel/preset-env 的 `useBuiltIns: 'usage' `来进行全局 Polyfill 的收集是比较标准的做法。

回到 Vite 构建的主流程中，接下来会进入 `generateChunk` 钩子阶段，现在 Vite 会对之前收集到的 `Polyfill` 进行统一的打包，实现也比较精妙，`主要逻辑集中在buildPolyfillChunk` 函数中:

```js
// 打包 Polyfill 代码
async function buildPolyfillChunk(
 name,
 imports
 bundle,
 facadeToChunkMap,
 buildOptions,
 externalSystemJS
) {
 let { minify, assetsDir } = buildOptions
 minify = minify ? 'terser' : false
 // 调用 Vite 的 build API 进行打包
 const res = await build({
 // 根路径设置为插件所在目录
 // 由于插件的依赖包含`core-js`、`regenerator-runtime`这些运行时基础库
 // 因此这里 Vite 可以正常解析到基础 Polyfill 库的路径
 root: __dirname,
 write: false,
 // 这里的插件实现了一个虚拟模块
 // Vite 对于 polyfillId 会返回所有 Polyfill 的引入语句
 plugins: [polyfillsPlugin(imports, externalSystemJS)],
 build: {
 rollupOptions: {
 // 访问 polyfillId
 input: {
 // name 暂可视作`polyfills-legacy`
 // pofyfillId 为一个虚拟模块，经过插件处理后会拿到所有 Polyfill 的引入语句
 [name]: polyfillId
 },
 }
 }
 });
 // 拿到 polyfill 产物 chunk
 const _polyfillChunk = Array.isArray(res) ? res[0] : res
 if (!('output' in _polyfillChunk)) return
 const polyfillChunk = _polyfillChunk.output[0]
 // 后续做两件事情:
 // 1. 记录 polyfill chunk 的文件名，方便后续插入到 Modern 模式产物的 HTML 中；
 // 2. 在 bundle 对象上手动添加 polyfill 的 chunk，保证产物写到磁盘中
}
```

因此，你可以理解为这个函数的作用即通过 `vite build` 对 `renderChunk` 中收集到 polyfill 代码进行打包，生成一个单独的 chunk:

![Snipaste_2023-11-09_14-42-22.png](https://f.pz.al/pzal/2023/11/09/362c2eac80bd2.png)

> 需要注意的是，polyfill chunk 中除了包含一些 core-js 和 regenerator-runtime 的相关代码，也包含了 `SystemJS` 的实现代码，你可以将其理解为 ESM 的加载器，实现了在旧版浏览器下的模块加载能力。

现在我们已经能够拿到 Legacy 模式的产物文件名及 Polyfill Chunk 的文件名，那么就可以通过 `transformIndexHtml` 钩子来将这些产物插入到 HTML 的结构中

```js
{
 transformIndexHtml(html) {
 // 1. 插入 Polyfill chunk 对应的 <script nomodule> 标签
 // 2. 插入 Legacy 产物入口文件对应的 <script nomodule> 标签
 }
}
```

- 当插件参数中开启了 `modernPolyfills` 选项时，Vite 也会自动对 Modern 模式的产物进行 Polyfill 收集，并单独打包成 `polyfills-modern.js` 的 chunk，原理和 Legacy 模式下处理 Polyfill 一样
- Sarari 10.1 版本不支持 `nomodule` ，为此需要单独引入一些补丁代码，[点击查看](https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc)
- 部分低版本 Edge 浏览器虽然支持 type="module"，但不支持动态 import，为此也需要插入一些[补丁代码](https://github.com/vitejs/vite/pull/3885)，针对这种情况下降级使用 Legacy 模式的产物

### Vite 搭建服务端渲染工程

#### SSR 基本概念

首先我们来分析一下 CSR 的问题，它的 HTML 产物一般是如下的结构：

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title></title>
    <link
      rel="stylesheet"
      href="xxx.css"
    />
  </head>
  <body>
    <!-- 一开始没有页面内容 -->
    <div id="root"></div>
    <!-- 通过 JS 执行来渲染页面 -->
    <script src="xxx.chunk.js"></script>
  </body>
</html>
```

顺便我们也回顾一下浏览器的渲染流程，如下图所示:

![Snipaste_2023-11-09_14-55-03.png](https://f.pz.al/pzal/2023/11/09/22c211ea69da3.png)

当浏览器拿到如上的 HTML 内容之后，其实并不能渲染完整的页面内容，因为此时的 body 中基本只有一个空的 div 节点，并没有填入真正的页面内容。而接下来浏览器开始下载并执行 JS 代码，经历了框架初始化、数据请求、DOM 插入等操作之后才能渲染出完整的页面。也就是说，在 CSR 中完整的页面内容本质上通过 JS 代码执行之后才能够渲染。这主要会导致两个方面的问题：

- **首屏加载速度比较慢**。首屏加载需要依赖 JS 的执行，下载和执行 JS 都可能是非常耗时的操作，尤其是在一些网络不佳的场景，或者性能敏感的低端机下。
- **对 SEO(搜索引擎优化) 不友好**。页面 HTML 没有具体的页面内容，导致搜索引擎爬虫无法获取关键词信息，导致网站排名受到影响。

那么 SSR 是如何解决这些问题呢？

在 SSR 的场景下，服务端生成好 `完整的 HTML 内容`，直接返回给浏览器，浏览器能够根据 HTML 渲染出完整的首屏内容，而不需要依赖 JS 的加载，这样一方面能够降低首屏渲染的时间，另一方面也能将完整的页面内容展现给搜索引擎的爬虫，利于 SEO。

当然，SSR 中只能生成页面的内容和结构，并不能完成事件绑定，因此需要在浏览器中执行 CSR 的 JS 脚本，完成事件绑定，让页面拥有交互的能力，这个过程被称之为 `hydrate`（翻译为 `注水` 或 `激活`）,同时像这样服务端渲染+客户端 hydrate 的应用也被称之为 `同构应用`。

#### SSR 生命周期分析

前面我们提到了 SSR 会在服务端(这里主要指 Node.js 端)提前渲染出完整的 HTML 内容，那这是如何做到的呢？

首先需要保证前端的代码经过编译后放到服务端中能够正常执行，其次在服务端渲染前端组件，生成并组装应用的 HTML。这就涉及到 SSR 应用的两大生命周期: 构建时 和 运行时 ，我们不妨来仔细梳理一下。

我们先来看看 `构建时` 需要做哪些事情:

**解决模块加载问题**。在原有的构建过程之外，需要加入 `SSR 构建` 的过程，具体来说，我们需要另外生成一份 `CommonJS` 格式的产物，使之能在 Node.js 正常加载。当然，随着 Node.js 本身对 ESM 的支持越来越成熟，我们也可以复用前端 ESM 格式的代码，Vite 在开发阶段进行 SSR 构建也是这样的思路。

![Snipaste_2023-11-09_15-10-12.png](https://f.pz.al/pzal/2023/11/09/4e87945dcf4d9.png)

**移除样式代码的引入**。直接引入一行 css 在服务端其实是无法执行的，因为 Node.js 并不能解析 CSS 的内容。但 CSS Modules 的情况除外，如下所示:

```js
import styles from './index.module.css'
// 这里的 styles 是一个对象，如{ "container": "xxx" }，而不是 CSS 代码
console.log(styles)
```

**依赖外部化(external)**。对于某些第三方依赖我们并不需要使用构建后的版本，而是直接从 `node_modules` 中读取，比如 `react-dom` ，这样在 `SSR 构建` 的过程中将不会构建这些依赖，从而极大程度上加速 SSR 的构建。

对于 SSR 的运行时，一般可以拆分为比较固定的生命周期阶段，简单来讲可以整理为以下几个核心的阶段:

- **加载 SSR 入口模块**。在这个阶段，我们需要确定 SSR 构建产物的入口，即组件的入口在哪里，并加载对应的模块。
- **进行数据预取**。这时候 Node 侧会通过查询数据库或者网络请求来获取应用所需的数据。
- **渲染组件**。这个阶段为 SSR 的核心，主要将第 1 步中加载的组件渲染成 HTML 字符串或者 Stream 流。
- HTML 拼接。在组件渲染完成之后，我们需要拼接完整的 HTML 字符串，并将其作为响应返回给浏览器。

从上面的分析中你可以发现，SSR 其实是 `构建` 和 `运行时` 互相配合才能实现的，也就是说，仅靠构建工具是不够的，写一个 Vite 插件严格意义上无法实现 SSR 的能力，我们需要对 Vite 的构建流程做一些整体的调整，并且加入一些服务端运行时的逻辑才能实现。那么接下来，我们就以具体的代码示例来讲解如何在 Vite 中完成 SSR 工程的搭建。

#### 基于 Vite 搭建 SSR 项目

##### 1.SSR 构建 API

首先 Vite 作为一个构建工具，是如何支持 SSR 构建的呢？换句话说，它是如何让前端的代码也能顺利在 Node.js 中成功跑起来的呢？

可以分为两种情况，在开发环境下，Vite 依然秉承 ESM 模块按需加载即 no-bundle 的理念，对外提供了 `ssrLoadModule` API，你可以无需打包项目，`将入口文件的路径传入ssrLoadModule` 即可:

```js
// 加载服务端入口模块
const xxx = await vite.ssrLoadModule('/src/entry-server.tsx')
```

而在生产环境下，Vite 会默认进行打包，对于 SSR 构建输出 CommonJS 格式的产物。我们可以在 package.json 中加入这样类似的构建指令:

```js
{
 "build:ssr": "vite build --ssr 服务端入口路径"
}
```

这样 Vite 会专门为 SSR 打包出一份构建产物。因此你可以看到，大部分 SSR 构建时的事情，Vite 已经帮我们提供了开箱即用的方案，我们后续直接使用即可。

##### 2.项目骨架搭建

接下来我们正式开始 SSR 项目的搭建，你可以通过脚手架初始化一个 `react+ts` 的项目:

```js
npm init vite
pnpm i
```

删除项目自带的 `src/main.ts` ，然后在 src 目录下新建 `entry-client.tsx` 和 `entry.server.tsx` 两个入口文件:

```js
// entry-client.ts
// 客户端入口文件
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
ReactDOM.hydrate(
 <React.StrictMode>
 <App />
 </React.StrictMode>,
 document.getElementById('root')
)
// entry-server.ts
// 导出 SSR 组件入口
import App from "./App";
import './index.css'
function ServerEntry(props: any) {
 return (
 <App/>
 );
}
export { ServerEntry };
```

我们以 Express 框架为例来实现 Node 后端服务，后续的 SSR 逻辑会接入到这个服务中，当然你需要安装以下的依赖:

```js
pnpm i express -S
pnpm i @types/express -D
```

接着新建 `src/ssr-server/index.ts` :

```js
// src/ssr-server/index.ts
// 后端服务
import express from 'express'
async function createServer() {
  const app = express()

  app.listen(3000, () => {
    console.log('Node 服务器已启动~')
    console.log('http://localhost:3000')
  })
}
createServer()
```

然后你可以在 `package.json` 中添加如下的 `scripts` :

```js
{
 "scripts": {
 // 开发阶段启动 SSR 的后端服务
 "dev": "nodemon --watch src/ssr-server --exec 'esno src/ssr-server/index.ts'",
 // 打包客户端产物和 SSR 产物
 "build": "npm run build:client && npm run build:server",
 "build:client": "vite build --outDir dist/client",
 "build:server": "vite build --ssr src/entry-server.tsx --outDir dist/server",
 // 生产环境预览 SSR 效果
 "preview": "NODE_ENV=production esno src/ssr-server/index.ts"
 },
}
```

其中涉及到了两个额外的工具，给大家解释一下：

- `nodemon`：一盒监听文件变化自动重启 node 服务的工具
- `esno`：类似与 `ts-node` 的工具，用来执行 ts 文件，底层基于 ESbuild 实现

同时你也需要安装这两个以来：

```shell
pnpm i esno nodemon -D
```

OK，现在我们就基本上搭建好了基本的项目骨架，接下里我们专注于 SSR 运行时的实现逻辑即可。

##### 3.SSR 运行时实现

SSR 作为一种特殊的后端服务，我们可以将其封装成一个中间件的形式，如以下的代码所示:

```js
import express, { RequestHandler, Express } from 'express';
import { ViteDevServer } from 'vite';
const isProd = process.env.NODE_ENV === 'production';
const cwd = process.cwd();
async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
 let vite: ViteDevServer | null = null;
 if (!isProd) {
 vite = await (await import('vite')).createServer({
 root: process.cwd(),
 server: {
 middlewareMode: 'ssr',
 }
 })
 // 注册 Vite Middlewares
 // 主要用来处理客户端资源
 app.use(vite.middlewares);
 }
 return async (req, res, next) => {
 // SSR 的逻辑
 // 1. 加载服务端入口模块
 // 2. 数据预取
 // 3. 「核心」渲染组件
 // 4. 拼接 HTML，返回响应
 };
}
async function createServer() {
 const app = express();
 // 加入 Vite SSR 中间件
 app.use(await createSsrMiddleware(app));
 app.listen(3000, () => {
 console.log('Node 服务器已启动~')
 console.log('http://localhost:3000');
 });
}
createServer();
```

接下来我们把焦点放在中间件内 SSR 的逻辑实现上，首先实现第一步即加载服务端入口模块:

```js
async function loadSsrEntryModule(vite: ViteDevServer | null) {
 // 生产模式下直接 require 打包后的产物
 if (isProd) {
 const entryPath = path.join(cwd, 'dist/server/entry-server.js');
 return require(entryPath);
 }
 // 开发环境下通过 no-bundle 方式加载
 else {
 const entryPath = path.join(cwd, 'src/entry-server.tsx');
 return vite!.ssrLoadModule(entryPath);
 }
}
```

中间件内的逻辑如下：

```js
async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
 // 省略前面的代码
 return async (req, res, next) => {
 const url = req.originalUrl;
 // 1. 服务端入口加载
 const { ServerEntry } = await loadSsrEntryModule(vite);
 // ...
 }
}
```

接下来我们来实现服务端的数据预取操作，你可以在 `entry-server.tsx` 中添加一个简单的获取数据的函数:

```js
export async function fetchData() {
  return { user: 'xxx' }
}
```

然后在 SSR 中间件中完成数据预取的操作:

```js
// src/ssr-server/index.ts
async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
 // 省略前面的代码
 return async (req, res, next) => {
 const url = req.originalUrl;
 // 1. 服务端入口加载
 const { ServerEntry, fetchData } = await loadSsrEntryModule(vite);
 // 2. 预取数据
 const data = await fetchData();
 }
}
```

接着我们进入到核心的组件渲染阶段:

```js
// src/ssr-server/index.ts
import { renderToString } from 'react-dom/server';
import React from 'react';
async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
 // 省略前面的代码
 return async (req, res, next) => {
 const url = req.originalUrl;
 // 1. 服务端入口加载
 const { ServerEntry, fetchData } = await loadSsrEntryModule(vite);
 // 2. 预取数据
 const data = await fetchData();
 // 3. 组件渲染 -> 字符串
 const appHtml = renderToString(React.createElement(ServerEntry, { data }));
 }
}
```

由于在第一步之后我们拿到了入口组件，现在可以调用前端框架的 `renderToString` API将组件渲染为字符串，组件的具体内容便就此生成了。

OK，目前我们已经拿到了组件的 HTML 以及预取的数据，接下来我们在根目录下的 HTML 中提供相应的插槽，方便内容的替换:

```js
// index.html
<!DOCTYPE html>
<html lang="en">
 <head>
 <meta charset="UTF-8" />
 <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 <title>Vite App</title>
 </head>
 <body>
 <div id="root"><!-- SSR_APP --></div>
 <script type="module" src="/src/entry-client.tsx"></script>
 <!-- SSR_DATA -->
 </body>
</html>
```

紧接着我们在 SSR 中间件中补充 HTML 拼接的逻辑:

```js
// src/ssr-server/index.ts
function resolveTemplatePath() {
 return isProd ?
 path.join(cwd, 'dist/client/index.html') :
 path.join(cwd, 'index.html');
}
async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
 // 省略之前的代码
 return async (req, res, next) => {
 const url = req.originalUrl;
 // 省略前面的步骤
 // 4. 拼接完整 HTML 字符串，返回客户端
 const templatePath = resolveTemplatePath();
 let template = await fs.readFileSync(templatePath, 'utf-8');
 // 开发模式下需要注入 HMR、环境变量相关的代码，因此需要调用 vite.transformIndexHtml
 if (!isProd && vite) {
 template = await vite.transformIndexHtml(url, template);
 }
 const html = template
 .replace('<!-- SSR_APP -->', appHtml)
 // 注入数据标签，用于客户端 hydrate
 .replace(
 '<!-- SSR_DATA -->',
 `<script>window.__SSR_DATA__=${JSON.stringify(data)}</script>`
 );
 res.status(200).setHeader('Content-Type', 'text/html').end(html);
 }
}
```

在拼接 HTML 的逻辑中，除了添加页面的具体内容，同时我们也注入了一个挂载全局数
据的 script 标签，这是用来干什么的呢？

在 SSR 的基本概念中我们就提到过，为了激活页面的交互功能，我们需要执行 CSR 的
JavaScript 代码来进行 hydrate 操作，而客户端 hydrate 的时候需要和服务端`同步预取后的数据`，保证页面渲染的结果和服务端渲染一致，因此，我们刚刚注入的数据 script 标
签便派上用场了。由于全局的 window 上挂载服务端预取的数据，我们可以在 `entry-client.tsx` 也就是客户端渲染入口中拿到这份数据，并进行 hydrate:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
// @ts-ignore
const data = window.__SSR_DATA__
ReactDOM.hydrate(
  <React.StrictMode>
    <App data={data} />
  </React.StrictMode>,
  document.getElementById('root')
)
```

现在，我们基本开发完了 SSR 核心的逻辑，执行 `npm run dev` 启动项目:

![Snipaste_2023-11-09_15-28-37.png](https://f.pz.al/pzal/2023/11/09/cd775dcfbc1bd.png)

打开浏览器后查看页面源码，你可以发现 SSR 生成的 HTML 已经顺利返回了:

![Snipaste_2023-11-09_15-29-38.png](https://f.pz.al/pzal/2023/11/09/bea7848443e52.png)

##### 4.生产环境的 CSR 资源处理

如果你现在执行 `npm run build` 及 `npm run preview` 进行生产环境的预览，会发现 SSR可以正常返回内容，但所有的静态资源及 CSR 的代码都失效了:

不过开发阶段并没有这个问题，这是因为对于开发阶段的静态资源 Vite Dev Server 的中间件已经帮我们处理了，而生产环境所有的资源都已经打包完成，我们需要启用单独的静态资源服务来承载这些资源。这里你可以 `serve-static` 中间件来完成这个服务，首先安装对应第三方包：

```shell
pnpm i serve-static -S
```

接着我们到 server 端注册：

```js
// 过滤出页面请求
function matchPageUrl(url: string) {
 if (url === '/') {
 return true;
 }
 return false;
}
async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
 return async (req, res, next) => {
 try {
 const url = req.originalUrl;
 if (!matchPageUrl(url)) {
 // 走静态资源的处理
 return await next();
 }
 // SSR 的逻辑省略
 } catch(e: any) {
 vite?.ssrFixStacktrace(e);
 console.error(e);
 res.status(500).end(e.message);
 }
 }
}
async function createServer() {
 const app = express();
 // 加入 Vite SSR 中间件
 app.use(await createSsrMiddleware(app));
 // 注册中间件，生产环境端处理客户端资源
 if (isProd) {
 app.use(serve(path.join(cwd, 'dist/client')))
 }
 // 省略其它代码
}
```

这样一来，我们就解决了生产环境下静态资源失效的问题。不过，一般情况下，我们会将
静态资源部上传到 CDN 上，并且将 Vite 的 `base` 配置为域名前缀，这样我们可以通过
CDN 直接访问到静态资源，而不需要加上服务端的处理。不过作为本地的生产环境预览
而言， `serve-static` 还是一个不错的静态资源处理手段。

#### 工程化问题

##### 1.路由管理

在 SPA 场景下，对于不同的前端框架，一般会有不同的路由管理方案，如 Vue 中的 vue-router 、React 的 react-router 。不过归根结底，路由方案在 SSR 过程中所完成的功能都是差不多的:

- 告诉框架现在渲染哪个路由。在 Vue 中我们可以通过 router.push 确定即将渲染的路由，React 中则通过 StaticRouter 配合 location 参数来完成。

- 设置 `base` 前缀。规定路径的前缀，如 `vue-router` 中 [ base 参数](https://router.vuejs.org/zh/guide/migration/#%E7%A7%BB%E5%8A%A8%E4%BA%86-base-%E9%85%8D%E7%BD%AE)、 react-router 中 StaticRouter 组件的 [basename](https://v5.reactrouter.com/web/api/StaticRouter)。

##### 2.全局状态管理

对于全局的状态管理而言，对于不同的框架也有不同的生态和方案，比如 Vue 中
的 `Vuex`、`Pinia`，React 中的 `Redux`、`Recoil`。各个状态管理工具的用法并不是本文的重点，接入 SSR 的思路也比较简单，在`预取数据`阶段初始化服务端的 `store` ，将异步获
取的数据存入 `store` 中，然后在`拼接 HTML` 阶段将数据从 store 中取出放到数据 script
标签中，最后在客户端 hydrate 的时候通过 window 即可访问到预取数据。

> 需要注意的服务端处理许多不同的请求，对于每个请求都需要分别初始化 store，即一个请求一个 store，不然会造成全局状态污染的问题

##### 3.CSR 降级

在某些比较极端的情况下，我们需要降级到 CSR，也就是客户端渲染。一般而言包括如下的降级场景：

- 服务器端预取数据失败，需要降级到客户端获取数据
- 服务器出现异常，需要返回兜底的 CSR 模板，完全降级为 CSR
- 本地开发调试，有时需要跳过 SSR，仅进行 CSR

对于第一种情况，在客户端入口文件中需要有重新获取数据的逻辑，我们可以进行这样的补充:

```js
// entry-client.tsx
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
async function fetchData() {
 // 客户端获取数据
}
async fucntion hydrate() {
 let data;
 if (window.__SSR_DATA__) {
 data = window.__SSR_DATA__;
 } else {
 // 降级逻辑
 data = await fetchData();
 }
 // 也可简化为 const data = window.__SSR_DATA__ ?? await fetchData();
 ReactDOM.hydrate(
 <React.StrictMode>
 <App data={data}/>
 </React.StrictMode>,
 document.getElementById('root')
 )
}
```

对于第二种场景，即 `服务器执行出错`，我们可以在之前的 SSR 中间件逻辑追加 catch 逻辑:

```js
async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
 return async (req, res, next) => {
 try {
 // SSR 的逻辑省略
 } catch(e: any) {
 vite?.ssrFixStacktrace(e);
 console.error(e);
 // 在这里返回浏览器 CSR 模板内容
 }
 }
}
```

对于第三种情况，我们可以通过通过 ?csr 的 url query 参数来强制跳过 SSR，在 SSR中间件添加如下逻辑:

```js
async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
 return async (req, res, next) => {
 try {
 if (req.query?.csr) {
 // 响应 CSR 模板内容
 return;
 }
 // SSR 的逻辑省略
 } catch(e: any) {
 vite?.ssrFixStacktrace(e);
 console.error(e);
 }
 }
}
```

##### 4.浏览器 API 兼容

由于 Node.js 中不能使用浏览器里面诸如 window 、 document 之类的 API，因此一旦在服务端执行到这样的 API 会报如下的错误：

```txt
Error when evaluating SSR module/src/App.tsx:ReferenceError：window is not defined
```

那么如何来解决这个问题呢？首先我们可以通过 `import.meta.env.SSR` 这个 Vite 内置的环境变量来判断是否处于 SSR 环境，以此来规避业务代码在服务端出现浏览器的 API:

```js
if (import.meta.env.SSR) {
  // 服务端执行的逻辑
} else {
  // 在此可以访问浏览器的 API
}
```

当然，我们也可以通过 polyfill 的方式，在 Node 中注入浏览器的 API，使这些 API 能
够正常运行起来，解决如上的问题。我推荐使用一个比较成熟的 polyfill 库 jsdom ，使
用方式如下：

```js
const jsdom = require('jsdom')
const { window } = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`)
const { document } = window
// 挂载到 node 全局
global.window = window
global.document = document
```

##### 5.自定义 Head

在 SSR 的过程中，我们虽然可以在决定组件的内容，即 `<div id="root"></div>`这个容
器 div 中的内容，但对于 HTML 中 head 的内容我们无法根据组件的内部状态来决定，比如对于一个直播间的页面，我们需要在服务端渲染出 title 标签，title 的内容是不同主播的直播间名称，不能在代码中写死，这种情况怎么办？

React 生态中的 react-helmet 以及 Vue 生态中的 vue-meta 库就是为了解决这样的问题，让我们可以直接在组件中写一些 Head 标签，然后在服务端能够拿到组件内部的状态。这里我以一个 react-helmet 例子来说明:

```js
// 前端组件逻辑
import { Helmet } from "react-helmet";
function App(props) {
 const { data } = props;
 return {
 <div>
 <Helmet>
 <title>{ data.user }的页面</title>
 <link rel="canonical" href="http://mysite.com/example" />
 </Helmet>
 </div>
 }
}
// 服务端逻辑
import Helmet from 'react-helmet';
// renderToString 执行之后
const helmet = Helmet.renderStatic();
console.log("title 内容: ", helmet.title.toString());
console.log("link 内容: ", helmet.link.toString())
```

启动服务后访问页面，可以发现终端能打印出如下的信息：

![Snipaste_2023-11-09_15-49-40.png](https://f.pz.al/pzal/2023/11/09/61e4665cd550e.png)

如此一来，我们就能根据组件的状态确定 Head 内容，然后在拼接 HTML 阶段将这些内容插入到模板中。

##### 6.流式渲染

在不同前端框架的底层都实现了流式渲染的能力，即边渲染边响应，而不是等整个组件树渲染完毕之后在响应，这么做可以让响应提前达到浏览器，提升首屏的加载性能，Vue 中的 [renderToNodeStream](https://www.npmjs.com/package/@vue/server-renderer) 和 [renderToNodeStream](https://legacy.reactjs.org/docs/react-dom-server.html#rendertonodestream) 都实现了流式渲染的能力，大致的使用方式如下：

```js
import { renderToNodeStream } from 'react-dom/server'
// 返回一个 Nodejs 的 Stream 对象
const stream = renderToNodeStream(element)
let html = ''
stream.on('data', data => {
  html += data.toString()
  // 发送响应
})
stream.on('end', () => {
  console.log(html) // 渲染完成
  // 发送响应
})
stream.on('error', err => {
  // 错误处理
})
```

不过，流式渲染在我们带来首屏性能提升的同时，也给我们带来了一些限制: `如果我们需要在 HTML 中填入一些与组件状态相关的内容，则不能使用流式渲染`。比如 `react-helmet` 中自定义的 head 内容，即便在渲染组件的时候收集到了 head 信息，但在流式渲染中，此时 HTML 的 head 部分已经发送给浏览器了，而这部分响应内容已经无法更改，因此 `react-helmet` 在 SSR 过程中将会失效。

##### 7.SSR 缓存

SSR 是一种典型的 CPU 密集型操作，为了尽可能降低线上机器的负载，设置缓存是一个非常重要的环节。在 SSR 运行时，缓存的内容可以分为这么几个部分:

- `文件读取缓存`。尽可能避免多次重复读磁盘的操作，每次磁盘 IO 尽可能地复用缓存结果。如下代码所示:

```js
function createMemoryFsRead() {
  const fileContentMap = new Map()
  return async filePath => {
    const cacheResult = fileContentMap.get(filePath)
    if (cacheResult) {
      return cacheResult
    }
    const fileContent = await fs.readFile(filePath)
    fileContentMap.set(filePath, fileContent)
    return fileContent
  }
}
const memoryFsRead = createMemoryFsRead()
memoryFsRead('file1')
// 直接复用缓存
memoryFsRead('file1')
```

- `预取数据缓存` 。对于某些实时性不高的接口数据，我们可以采取缓存的策略，在下次相同的请求进来时复用之前预取数据的结果，这样预取数据过程的各种 IO 消耗，也可以一定程度上减少首屏时间。
- `HTML 渲染缓存`。拼接完成的 HTML 内容是缓存的重点，如果能将这部分进行缓存，那么下次命中缓存之后，将可以节省 renderToString 、 HTML 拼接等一系列的消耗，服务端的性能收益会比较明显。

对于以上的缓存内容，具体的缓存位置可以是：

- `服务器内存`。如果是放到内存中，需要考虑缓存淘汰机制，防止内存过大导致服务宕机，一个典型的缓存淘汰方案是 ` lru-cache` (基于 LRU 算法)。
- Redis 数据库，相当于以传统后端服务器的设计思路来处理缓存。
- CDN 服务。我们可以将页面内容缓存到 CDN 服务上，在下一次相同的请求进来时，使用 CDN 上的缓存内容，而不用消费源服务器的资源。对于 CDN 上的 SSR 缓存，大家可以通过阅读[这篇文章](https://juejin.cn/post/6887884087915184141#heading-8)深入了解

##### 8.性能监控

在实际的 SSR 项目中，我们时常会遇到一些 SSR 线上性能问题，如果没有一个完整的性能监控机制，那么将很难发现和排查问题。对于 SSR 性能数据，有一些比较通用的指标:

- SSR 产物加载时间
- 数据预取的时间
- 组件渲染的时间
- 服务端接受请求到响应的完整时间
- SSR 缓存命中情况
- SSR 成功率、错误日志

我们可以通过 `perf_hooks` 来完成数据的采集，如下代码所示:

```js
import { performance, PerformanceObserver } from 'perf_hooks'
// 初始化监听器逻辑
const perfObserver = new PerformanceObserver(items => {
  items.getEntries().forEach(entry => {
    console.log('[performance]', entry.name, entry.duration.toFixed(2), 'ms')
  })
  performance.clearMarks()
})
perfObserver.observe({ entryTypes: ['measure'] })
// 接下来我们在 SSR 进行打点
// 以 renderToString 为例
performance.mark('render-start')
// renderToString 代码省略
performance.mark('render-end')
performance.measure('renderToString', 'render-start', 'render-end')
```

接着我们启动服务后访问，可以看到如下的打点日志信息:

![Snipaste_2023-11-09_15-59-40.png](https://f.pz.al/pzal/2023/11/09/9c93065b0a04a.png)

同样的，我们可以将其它阶段的指标通过上述的方式收集起来，作为性能日志；另一方
面，在生产环境下，我们一般需要结合具体的性能监控平台，对上述的各项指标进行打点
上报，完成线上的 SSR 性能监控服务。

##### 9.SSG/ISR/SPR

有时候对于一些静态站点(如博客、文档)，不涉及到动态变化的数据，因此我们并不需要
用上服务端渲染。此时只需要在构建阶段产出完整的 HTML 进行部署即可，这种构建阶
段生成 HTML 的做法也叫 SSG (Static Site Generation，静态站点生成)。

SSG 与 SSR 最大的区别就是产出 HTML 的时间点从 SSR 运行时变成了构建时，但核心
的生命周期流程并没有发生变化：

```js
// scripts/ssg.ts
// 以下的工具函数均可以从 SSR 流程复用
async function ssg() {
  // 1. 加载服务端入口
  const { ServerEntry, fetchData } = await loadSsrEntryModule(null)
  // 2. 数据预取
  const data = await fetchData()
  // 3. 组件渲染
  const appHtml = renderToString(React.createElement(ServerEntry, { data }))
  // 4. HTML 拼接
  const template = await resolveTemplatePath()
  const templateHtml = await fs.readFileSync(template, 'utf-8')
  const html = templateHtml
    .replace('<!-- SSR_APP -->', appHtml)
    .replace('<!-- SSR_DATA -->', `<script>window.__SSR_DATA__=${JSON.stringify(data)}</script>`)
  // 最后，我们需要将 HTML 的内容写到磁盘中，将其作为构建产物
  fs.mkdirSync('./dist/client', { recursive: true })
  fs.writeFileSync('./dist/client/index.html', html)
}
ssg()
```

接着你可以在 package.json 中加入这样一段 npm scripts:

```js
{
 "scripts": {
 "build:ssg": "npm run build && NODE_ENV=production esno scripts/ssg.ts"
 }
}
```

这样我们便初步实现了 SSG 的逻辑。当然，除了 SSG，业界还流传着一些其它的渲染模
式，诸如 SPR 、 ISR ，听起来比较高大上，但实际上只是 SSR 和 SSG 所衍生出来的新
功能罢了，这里简单给大家解释一下:

- SPR 即 Serverless Pre Render ，即把 SSR 的服务部署到 Serverless(FaaS) 环境中，实现服务器实例的自动扩缩容，降低服务器运维的成本
- ISR 即 Incremental Site Rendering ，即增量站点渲染，将一部分的 SSG 逻辑从构建时搬到了 SSR 运行时，解决的是大量页面 SSG 构建耗时长的问题

### 如何实现优雅的跨应用代码共享？

在 2020 年上半年，Webpack 提出了一项非常激动人心的特性—— `Module Federation` (译为 `模块联邦` )，这个特性一经推出就获得了业界的广泛关注，甚至被称为前端构建领域的 `Game Changer` 。实际上，这项技术确实很好地解决了多应用模块复用的问题，相比之前的各种解决方案，它的解决方式更加优雅和灵活。但从另一个角度来说，Module Federation 代表的是一种通用的解决思路，并不局限于某一个特定的构建工具，因此，在 Vite 中我们同样可以实现这个特性，并且社区已经有了比较成熟的解决方案。

#### 模块共享之痛

对于一个互联网产品来说，一般会有不同的细分应用，比如`腾讯文档`可以分为 `word` 、
`excel` 、 `ppt` 等等品类，抖音 `PC 站点`可以分为`短视频站点`、`直播站点`、`搜索站点`等子
站点，而每个子站又彼此独立，可能由不同的开发团队进行单独的开发和维护，看似没有
什么问题，但实际上会经常遇到一些模块共享的问题，也就是说不同应用中总会有一些共
享的代码，比如公共组件、公共工具函数、公共第三方依赖等等。对于这些共享的代码，
除了通过简单的复制粘贴，还有没有更好的复用手段？

##### 1.发布 npm 包

发布 npm 包是一种常见的复用模块的做法，我们可以将一些公用的代码封装为一个 npm 包，具体的发布更新流程是这样的:

- 公共库 lib 1 改动，发布到 npm
- 所有的应用安装新的依赖，并进行联调

![Snipaste_2023-11-09_16-10-35.png](https://f.pz.al/pzal/2023/11/09/d776db83f66c0.png)

封装 npm 包可以解决模块复用的问题，但它本身又引入了新的问题:

- **开发效率问题**。每次改动都需要发版，并所有相关的应用安装新依赖，流程比较复杂
- **项目构建问题**。引入了公共库之后，公共库的代码都需要打包到项目最后的产物后，导致产物体积偏大，构建速度相对较慢

因此，这种方案并不能作为最终方案，只是暂时用来解决问题的无奈之举。

##### 2.Git Submodule

通过 `git submodule` 的方式，我们可以将代码封装成一个公共的 Git 仓库，然后复用到
不同的应用中，但也需要经历如下的步骤：

- 公共库 lib 1 改动，提交到 Git 远程仓库
- 所有的应用通过 `git submodule` 命令更新子仓库代码，并进行联调

你可以看到，整体的流程其实跟发 npm 包相差无几，仍然存在 npm 包方案所存在的各
种问题。

##### 3. 依赖外部化（external）+CND 引入

在上一节中我们提到了 `external` 的概念，即对于某些第三方依赖我们并不需要让其参与
构建，而是使用某一份公用的代码。按照这个思路，我们可以在构建引擎中对某些依赖声
明 `external` ，然后在 HTML 中加入依赖的 CDN 地址:

```js
<!DOCTYPE html>
<html lang="en">
 <head>
 <meta charset="UTF-8" />
 <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 <title>Vite App</title>
 </head>
 <body>
 <div id="root"></div>
 <!-- 从 CDN 上引入第三方依赖的代码 -->
 <script src="https://cdn.jsdelivr.net/npm/react@17.0.2/index.min.js"><script>
 <script src="https://cdn.jsdelivr.net/npm/react-dom@17.0.2/index.min.js"><script> </body>
 </html>
```

如上面的例子所示，我们可以对 `react` 和 `react-dom` 使用 CDN 的方式引入，一般使用
`UMD` 格式产物，这样不同的项目间就可以通过 `window.React` 来使用同一份依赖的代码
了，从而达到模块复用的效果。不过在实际的使用场景，这种方案的局限性也很突出:

- `兼容性问题`。并不是所有的依赖都有 UMD 格式的产物，因此这种方案不能覆盖所有的第三方 npm 包
- `依赖顺序问题`。我们通常需要考虑间接依赖的问题，如对于 antd 组件库，它本身也依赖了 react 和 moment，那么 `react` 和 `moment` 也需要 `external` ，并且在 HTML 中引用这些包，同时也要 `严格保证` 引用的顺序，比如说 moment 如果放在了 antd 后面，代码可能无法运行。而第三方包背后的间接依赖数量一般很庞大，如果逐个处理，对于开发者来说简直就是噩梦。
- `产物体积问题`。由于依赖包被声明 `external` 之后，应用在引用其 CDN 地址时，会全量引用依赖的代码，这种情况下就没有办法通过 Tree Shaking 来去除无用代码了，会导致应用的性能有所下降。

##### 4.Monorepo

作为一种新的项目管理方式，Monorepo 也可以很好地解决模块复用的问题。在 Monorepo 架构下，多个项目可以放在同一个 Git 仓库中，各个互相依赖的子项目通过软链的方式进行调试，代码复用显得非常方便，如果有依赖的代码变动，那么用到这个依赖的项目当中会立马感知到。

![Snipaste_2023-11-09_16-16-37.png](https://f.pz.al/pzal/2023/11/09/a7cb67142786f.png)

不得不承认，对于应用间模块复用的问题，Monorepo 是一种非常优秀的解决方案，但
与此同时，它也给团队带来了一些挑战:

- `所有的应用代码必须放到同一个仓库`。如果是旧有项目，并且每个应用使用一个 Git 仓库的情况，那么使用 Monorepo 之后项目架构调整会比较大，也就是说改造成本会相对比较高。
- Monorepo 本身也存在一些天然的局限性，如项目数量多起来之后依赖安装时间会很久、项目整体构建时间会变长等等，我们也需要去解决这些局限性所带来的的开发效率问题。而这项工作一般需要投入专业的人去解决，如果没有足够的人员投入或者基建的保证，Monorepo 可能并不是一个很好的选择。
- 项目构建问题。跟发 npm 包的方案一样，所有的公共代码都需要进入项目的构建流程中，产物体积还是会偏大。

#### MF 核心概念

下面我们就来正式介绍 `Module Federation`，即模块联邦解决方案，看看它到底是如何解决模块复用问题的。

模块联邦中主要有两种模块: `本地模块` 和 `远程模块`。

本地模块即为普通模块，是当前构建流程中的一部分，而远程模块不属于当前构建流程，
在本地模块的运行时进行导入，同时本地模块和远程模块可以共享某些依赖的代码，如下
图所示:

![Snipaste_2023-11-09_16-19-35.png](https://f.pz.al/pzal/2023/11/09/1fbfe532ccd4e.png)

值得强调的是，在模块联邦中，每个模块既可以是`本地模块`，导入其它的`远程模块`，又
可以作为远程模块，被其他的模块导入。如下面这个例子所示:

![Snipaste_2023-11-09_16-20-16.png](https://f.pz.al/pzal/2023/11/09/9a1428906896d.png)

如图，其中 A 模块既可以作为本地模块导入 B，又可以作为远程模块被 C 导入。

以上就是模块联邦的主要设计原理，现在我们来好好分析一下这种设计究竟有哪些优势:

**实现任意粒度的模块共享**。这里所指的模块粒度可大可小，包括第三方 npm 依赖、业务组件、工具函数，甚至可以是整个前端应用！而整个前端应用能够共享产物，代表着各个应用单独开发、测试、部署，这也是一种`微前端`的实现。

**优化构建产物体积**。远程模块可以从本地模块运行时被拉取，而不用参与本地模块的构建，可以加速构建过程，同时也能减小构建产物。

**运行时按需加载**。远程模块导入的粒度可以很小，如果你只想使用 app 1 模块的
`add` 函数，只需要在 app 1 的构建配置中导出这个函数，然后在本地模块中按照诸如 `import('app 1/add')` 的方式导入即可，这样就很好地实现了模块按需加载。

**第三方依赖共享**。通过模块联邦中的共享依赖机制，我们可以很方便地实现在模块间公用依赖代码，从而避免以往的 external + CDN 引入方案的各种问题

从以上的分析你可以看到，模块联邦近乎完美地解决了以往模块共享的问题，甚至能够实现应用级别的共享，进而达到 ` 微前端` 的效果。下面，我们就来以具体的例子来学习在 Vite 中如何使用模块联邦的能力。

#### MF 应用实战

社区中已经提供了一个比较成熟的 Vite 模块联邦方案: `vite-plugin-federation` ，这个方案基于 Vite(或者 Rollup) 实现了完整的模块联邦能力。接下来，我们基于它来实现模块联邦应用。
首先初始化两个 Vue 的脚手架项目 `host` 和 `remote` ，然后分别安装 `vite-plugin-federation` 插件:

```shell
pnpm install @originjs/vite-plugin-federation -D
```

在配置文件中分别加入如下的配置:

```js
// 远程模块配置
// remote/vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";
// https://vitejs.dev/config/
export default defineConfig({
 plugins: [
 vue(),
 // 模块联邦配置
 federation({
 name: "remote_app",
 filename: "remoteEntry.js",
 // 导出模块声明
 exposes: {
 "./Button": "./src/components/Button.js",
 "./App": "./src/App.vue",
 "./utils": "./src/utils.ts",
 },
 // 共享依赖声明
 shared: ["vue"],
 }),
 ],
 // 打包配置
 build: {
 target: "esnext",
 },
});
// 本地模块配置
// host/vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";
export default defineConfig({
 plugins: [
 vue(),
 federation({
 // 远程模块声明
 remotes: {
 remote_app: "http://localhost:3001/assets/remoteEntry.js",
 },
 // 共享依赖声明
 shared: ["vue"],
 }),
 ],
 build: {
 target: "esnext",
 },
});
```

在如上的配置中，我们完成了远程模块的模块导出及远程模块在本地模块的注册，对于远
程模块的具体实现，你可以参考小册的 Github 仓库，这里就不一一赘述了。接下来我们
把关注点放在如何使用远程模块上面。

首先我们需要对远程模块进行打包，在 remote 路径下依赖执行：

```shell
// 打包产物
pnpm run build
// 模拟部署效果，一般会在生产环境将产物上传到 CDN
npx vite preview --port=3001 --strictPort
```

然后我们在 `host` 项目中使用远程模块:

```vue
<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { defineAsyncComponent } from 'vue'
// 导入远程模块
// 1. 组件
import RemoteApp from 'remote_app/App'
// 2. 工具函数
import { add } from 'remote_app/utils'
// 3. 异步组件
const AysncRemoteButton = defineAsyncComponent(() => import('remote_app/Button'))
const data: number = add(1, 2)
</script>
<template>
  <div>
    <img
      alt="Vue logo"
      src="./assets/logo.png"
    />
    <HelloWorld />
    <RemoteApp />
    <AysncRemoteButton />
    <p>应用 2 工具函数计算结果: 1 + 2 = {{ data }}</p>
  </div>
</template>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

启动项目后你可以看到如下的结果:

![Snipaste_2023-11-09_16-28-26.png](https://f.pz.al/pzal/2023/11/09/d21e46cf9a726.png)

应用 2 的组件和工具函数逻辑已经在应用 1 中生效，也就是说，我们完成了远程模块在本地模块的运行时引入。

让我们来梳理一下整体的使用流程:

- 远程模块通过 `exposes` 注册导出的模块，本地模块通过 `remotes` 注册远程模块地址。
- 远程模块进行构建，并部署到云端
- 本地通过 import '远程模块名称/xxx' 的方式来引入远程模块，实现运行时加载

当然，还有几个要点需要给大家补充一下：

在模块联邦中的配置中， exposes 和 remotes 参数其实并不冲突，也就是说一个模块既可以作为本地模块，又可以作为远程模块。

由于 Vite 的插件机制与 Rollup 兼容， vite-plugin-federation 方案在 Rollup 中也是完全可以使用的。

#### MF 实现原理

从以上示例中大家可以看到，Module Federation 使用比较简单，对已有项目来说改造成本并不大。那么，这么强大而易用的特性是如何在 Vite 中得以实现的呢？接下来，我们来深入探究一下 MF 背后的实现原理，分析 vite-plugin-federation 这个插件背后究竟做了些什么。

总体而言，实现模块联邦有三大主要的要素:

- `Host` 模块: 即本地模块，用来消费远程模块
- `Remote` 模块: 即远程模块，用来生产一些模块，并暴露运行时容器供本地模块消费
- `Shared` 依赖: 即共享依赖，用来在本地模块和远程模块中实现第三方依赖的共享

首先，我们来看看本地模块是如何消费远程模块的。之前，我们在本地模块中写过这样的引入语句:

```shell
import RemoteApp from "remote_app/App";
```

我们来看看 Vite 将这段代码编译成了什么样子:

```js
// 为了方便阅读，以下部分方法的函数名进行了简化
// 远程模块表
const remotesMap = {
  remote_app: { url: 'http://localhost:3001/assets/remoteEntry.js', format: 'esm', from: 'vite' },
  shared: { url: 'vue', format: 'esm', from: 'vite' }
}
async function ensure() {
  const remote = remoteMap[remoteId]
  // 做一些初始化逻辑，暂时忽略
  // 返回的是运行时容器
}
async function getRemote(remoteName, componentName) {
  return (
    ensure(remoteName)
      // 从运行时容器里面获取远程模块
      .then(remote => remote.get(componentName))
      .then(factory => factory())
  )
}
// import 语句被编译成了这样
// tip: es2020 产物语法已经支持顶层 await
const __remote_appApp = await getRemote('remote_app', './App')
```

除了 import 语句被编译之外，在代码中还添加了 `remoteMap` 和一些工具函数，它们的目的很简单，就是通过访问远端的`运行时容器`来拉取对应名称的模块。

而运行时容器其实就是指远程模块打包产物 `remoteEntry.js` 的导出对象，我们来看看它的逻辑是怎样的

```js
// remoteEntry.js
const moduleMap = {
 "./Button": () => {
 return import('./__federation_expose_Button.js').then(module => () => module)
 },
 "./App": () => {
 dynamicLoadingCss('./__federation_expose_App.css');
 return import('./__federation_expose_App.js').then(module => () => module);
 },
 './utils': () => {
 return import('./__federation_expose_Utils.js').then(module => () => module);
 }
};
// 加载 css
const dynamicLoadingCss = (cssFilePath) => {
 const metaUrl = import.meta.url;
 if (typeof metaUrl == 'undefined') {
 console.warn('The remote style takes effect only when the build.target option in the vite
 return
 }
 const curUrl = metaUrl.substring(0, metaUrl.lastIndexOf('remoteEntry.js'));
 const element = document.head.appendChild(document.createElement('link'));
 element.href = curUrl + cssFilePath;
 element.rel = 'stylesheet';
};
// 关键方法，暴露模块
const get =(module) => {
 return moduleMap[module]();
};
const init = () => {
 // 初始化逻辑，用于共享模块，暂时省略
}
export { dynamicLoadingCss, get, init }
```

从运行时容器的代码中我们可以得出一些关键的信息：

- `moduleMap` 用来记录导出模块的信息，所有在 `exposes` 参数中声明的模块都会打包成单独的文件，然后通过 `dynamic import` 进行导入。
- 容器导出了十分关键的 `get` 方法，让本地模块能够通过调用这个方法来访问到该远程模块。

至此，我们就梳理清楚了远程模块的运行时容器与本地模块的交互流程，如下图所示：

![Snipaste_2023-11-09_16-35-58.png](https://f.pz.al/pzal/2023/11/09/4345c31331a81.png)

接下来，我们继续分析共享依赖的实现。拿之前的示例项目来说，本地模块设置了
`shared: ['vue']` 参数之后，当它执行远程模块代码的时候，一旦遇到了引入 vue 的情
况，会优先使用本地的 `vue` ，而不是远端模块中的 `vue`

![Snipaste_2023-11-09_16-38-19.png](https://f.pz.al/pzal/2023/11/09/275907a01052e.png)

让我们把焦点放到容器初始化的逻辑中，回到本地模块编译后的 ensure 函数逻辑:

```js
// host
// 下面是共享依赖表。每个共享依赖都会单独打包
const shareScope = {
 'vue':{'3.2.31':{get:()=>get('./__federation_shared_vue.js'), loaded:1}}
};
async function ensure(remoteId) {
 const remote = remotesMap[remoteId];
 if (remote.inited) {
 return new Promise(resolve => {
 .then(lib => {
 // lib 即运行时容器对象
 if (!remote.inited) {
 remote.lib = lib;
 remote.lib.init(shareScope);
 remote.inited = true;
 }
 resolve(remote.lib);
 });
 })
 }
}
```

可以发现， `ensure` 函数的主要逻辑是将共享依赖信息传递给远程模块的运行时容器，并进行容器的初始化。接下来我们进入容器初始化的逻辑 `init` 中:

```js
const init = shareScope => {
  globalThis.__federation_shared__ = globalThis.__federation_shared__ || {}
  // 下面的逻辑大家不用深究，作用很简单，就是将本地模块的`共享模块表`绑定到远程模块的全局 window 对象
  Object.entries(shareScope).forEach(([key, value]) => {
    const versionKey = Object.keys(value)[0]
    const versionValue = Object.values(value)[0]
    const scope = versionValue.scope || 'default'
    globalThis.__federation_shared__[scope] = globalThis.__federation_shared__[scope] || {}
    const shared = globalThis.__federation_shared__[scope]
    ;(shared[key] = shared[key] || {})[versionKey] = versionValue
  })
}
```

当本地模块的 `共享依赖表` 能够在远程模块访问时，远程模块内也就能够使用本地模块的依赖(如 vue )了。现在我们来看看远程模块中对于 ` import { h } from 'vue'` 这种引入代码被转换成了什么样子:

```js
// __federation_expose_Button.js
import { importShared } from './__federation_fn_import.js'
const { h } = await importShared('vue')
```

不难看到，第三方依赖模块的处理逻辑都集中到了 `importShared` 函数，让我们来一探究竟:

```js
// __federation_fn_import.js
const moduleMap = {
  vue: {
    get: () => () => __federation_import('./__federation_shared_vue.js'),
    import: true
  }
}
// 第三方模块缓存
const moduleCache = Object.create(null)
async function importShared(name, shareScope = 'default') {
  return moduleCache[name] ? new Promise(r => r(moduleCache[name])) : getProviderSharedModule(name, shareScope)
}
async function getProviderSharedModule(name, shareScope) {
  // 从 window 对象中寻找第三方包的包名，如果发现有挂载，则获取本地模块的依赖
  if (xxx) {
    return await getHostDep()
  } else {
    return getConsumerSharedModule(name)
  }
}
async function getConsumerSharedModule(name, shareScope) {
  if (moduleMap[name]?.import) {
    const module = (await moduleMap[name].get())()
    moduleCache[name] = module
    return module
  } else {
    console.error(`consumer config import=false,so cant use callback shared module`)
  }
}
```

由于远程模块运行时容器初始化时已经挂载了共享依赖的信息，远程模块内部可以很方便的感知到当前的依赖是不是共享依赖，如果是共享依赖则使用本地模块的依赖代码，否则使用远程模块自身的依赖产物代码。最后我画了一张流程图，你可以参考学习:

![Snipaste_2023-11-09_16-43-00.png](https://f.pz.al/pzal/2023/11/09/0e0165365504b.png)

### ESM：高阶特性&Pure ESM 时代

#### 高阶特性

##### import map

在浏览器中我们可以使用包含 type="module" 属性的 script 标签来加载 ES 模块，而模块路径主要包含三种:

- 绝对路径，如 https://cdn.skypack.dev/react
- 相对路径，如 ./module-a
- `bare import` 即直接写一个第三方包名，如 `react` 、 `lodash`

对于前两种模块路径浏览器是原生支持的，而对于 bare import ，在 Node.js 能直接执行，因为 Node.js 的路径解析算法会从项目的 node_modules 找到第三方包的模块路径，但是放在浏览器中无法直接执行。而这种写法在日常开发的过程又极为常见，除了将bare import 手动替换为一个绝对路径，还有其它的解决方案吗？

答案是有的。现代浏览器内置的 import map 就是为了解决上述的问题，我们可以用一个简单的例子来使用这个特性:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      http-equiv="X-UA-Compatible"
      content="IE=edge"
    />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="importmap">
      {
        "imports": {
          "react": "https://cdn.skypack.dev/react"
        }
      }
    </script>
    <script type="module">
      import React from 'react'
      console.log(React)
    </script>
  </body>
</html>
```

在浏览器中执行这个 HTML，如果正常执行，那么你可以看到浏览器已经从网络中获取
了 react 的内容，如下图所示:

> 注意: importmap 可能存在浏览器兼容性问题，这里出现浏览器报错也属于正常情况，后文会介绍解决方案

![Snipaste_2023-11-09_16-52-46.png](https://f.pz.al/pzal/2023/11/09/461870f0eaa0e.png)

在支持 `import map` 的浏览器中，在遇到`type="importmap"` 的 script 标签时，浏览器会记录下第三方包的路径映射表，在遇到 bare import 时会根据这张表拉取远程的依赖代码。如上述的例子中，我们使用 `skypack` 这个第三方的 ESM CDN 服务，通过
https://cdn.skypack.dev/react 这个地址我们可以拿到 React 的 ESM 格式产物。

`import map` 特性虽然简洁方便，但浏览器的兼容性却是个大问题，在 CanIUse 上的兼容性数据如下:

![Snipaste_2023-11-09_16-54-26.png](https://f.pz.al/pzal/2023/11/09/640b47fdc834c.png)

它只能兼容市面上 89% 左右的浏览器份额，而反观 `type="module"` 的兼容性(兼容 95%
以上的浏览器)， `import map` 的兼容性实属不太乐观。但幸运的是，社区已经有了对应的
Polyfill 解决方案——`es-module-shims`，完整地实现了包含`import map` 在内的各大
ESM 特性，还包括:

- `dynamic import`：即动态导入，部分老版本的 Firefox 和 Edge 不支持。
- `import.meta` 和 `import.meta.url` 。当前模块的元信息，类似 Node.js 中的 `__dirname__` 和 `__filename__`
- `modulepreload` ：以前我们会在 link 标签中加上 rel="preload" 来进行资源预加载，即在浏览器解析 HTML 之前就开始加载资源，现在对于 ESM 也有对应的 modulepreload 来支持这个行为。
- `JSON Modules` 和 `CSS Modules` ，即通过如下方式来引入 `json` 或者 `css` :

```js
<script type="module">
// 获取 json 对象
import json from 'https://site.com/data.json' assert { type: 'json' };
// 获取 CSS Modules 对象
import sheet from 'https://site.com/sheet.css' assert { type: 'css' };
</script>
```

值得一提的是， `es-module-shims` 基于 `wasm` 实现，性能并不差，相比浏览器原生的行
为没有明显的性能下降。

由此可见， `import map` 虽然并没有得到广泛浏览器的原生支持，但是我们仍然可以通过
Polyfill 的方式在支持 `type="module"` 的浏览器中使用 `import map` 。

##### Node.js 包导入导出策略

在 Node.js 中( `>=12.20 版本` )有一般如下几种方式可以使用原生 ES Module:

- 文件以 `.mjs` 结尾
- package.json 中声明 `type:'module'`

那么，Nodejs 在处理 ES Module 导入导出的时候，如果是处理 npm 包级别的情况，其中的细节可能比你想象中更加复杂。

首先来看看如何导出一个包，你有两种方式可以选择: `main` 和 `exports` 属性。这两个属性均来自于 `package.json` ，并且根据 Node 官方的 resolve 算法([查看详情](https://nodejs.cn/api/esm.html#resolver-algorithm-specification))，exports 的优先级比 main 更高，也就是说如果你同时设置了这两个属性，那么 exports 会优先生效。

main 的使用比较简单，设置包的入口文件路径即可，如:

```js
"main"："./src/index.js"
```

需要重点梳理的是 `exports` 属性，它包含了多种导出形式: `默认导出`、`子路径导出` 和 `条件导出`，这些导出形式如以下的代码所示:

```js
// package.json
{
 "name": "package-a",
 "type": "module",
 "exports": {
 // 默认导出，使用方式: import a from 'package-a'
 ".": "./dist/index.js",
 // 子路径导出，使用方式: import d from 'package-a/dist'
 "./dist": "./dist/index.js",
 "./dist/*": "./dist/*", // 这里可以使用 `*` 导出目录下所有的文件
 // 条件导出，区分 ESM 和 CommonJS 引入的情况
 "./main": {
 "import": "./main.js",
 "require": "./main.cjs"
 },
 }
}
```

其中，条件导出可以包括如下常见的属性:

- `node` : 在 Node.js 环境下适用，可以定义为嵌套条件导出，如:

```js
{
 "exports": {
 {
 ".": {
 "node": {
 "import": "./main.js",
 "require": "./main.cjs"
 }
 }
 }
 },
}
```

- `import`：用于 import 方式导入的情况：如 `import('package-a')`
- `require`：用于 require 方式导入的情况，如 `require('package-a')`
- `default`：兜底方案，如果前面的条件都没有命中，则使用 default 导出的路径

当然，条件导出还包含 `types` 、 browser ` `、 `develoment` 、 `production` 等属性，大家可以参考 Node.js 的[详情文档](https://nodejs.org/api/packages.html#conditional-exports)，这里就不一一赘述了。

在介绍完"导出"之后，我们再来看看`"导入"` ，也就是 package.json 中的 `imports` 字
段，一般是这样声明的:

```js
{
 "imports": {
 // key 一般以 # 开头
 // 也可以直接赋值为一个字符串: "#dep": "lodash-es"
 "#dep": {
 "node": "lodash-es",
 "default": "./dep-polyfill.js"
 },
 },
 "dependencies": {
 "lodash-es": "^4.17.21"
 }
}
```

这样你可以在自己的包中使用下面的 import 语句:

```js
// index.js
import { cloneDeep } from '#dep'
const obj = { a: 1 }
// { a: 1 }
console.log(cloneDeep(obj))
```

Node.js 在执行的时候会将 `#dep` 定位到 `lodash-es` 这个第三方包，当然，你也可以将其定位到某个内部文件。这样相当于实现了`路径别名`的功能，不过与构建工具中的 `alias` 功能不同的是，"imports" 中声明的别名必须全量匹配，否则 Node.js 会直接抛错。

#### Pure ESM

说完了 ESM 的一些高级特性之后，我们来聊聊社区中一个叫做 Pure ESM 的概念。

首先，什么是 `Pure ESM `? `Pure ESM` 最初是在 [Github](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) 上的一个帖子中被提出来的，其中有两层含义，一个是让 npm 包都提供 ESM 格式的产物，另一个是仅留下 ESM 产物，抛弃 CommonJS 等其它格式产物。

##### 对 Pure ESM 的态度

当这个概念被提出来之后社区当中出现了很多不同的声音，有人赞成，也有人不满。但不怎么样，社区中的很多 npm 包已经出现了 `ESM First` 的趋势，可以预见的是越来越多的会提供 ESM 的版本，来拥抱社区 ESM 大一统的趋势，同时也有一部分的 npm 包做得更加激进，直接采取 Pure ESM 模式，如大名鼎鼎的 chalk 和 imagemin ，最新版本中只提供 ESM 产物，而不再提供 CommonJS 产物。

> 对于没有上层封装需求的大型框架，如 Nuxt、Umi，在保证能上 Pure ESM 的情况下，直接上不会有什么问题；但如果是一个底层基础库，最好提供好 ESM 和 CommonJS 两种格式的产物。

在 ESM 中，我们可以直接导入 CommonJS 模块，如:

```js
// react 仅有 CommonJS 产物
import React from 'react'
console.log(React)
```

Node.js 执行以上的原生 ESM 代码并没有问题，但反过来，如果你想在 CommonJS 中
require 一个 ES 模块，就行不通了:

```js
const chalk = require('chalk')
console.log(chalk.green('hello world'))
```

其根本原因在于 require 是同步加载的，而 ES 模块本身具有异步加载的特性，因此两者
天然互斥，即我们无法 require 一个 ES 模块。

那是不是在 CommonJS 中无法引入 ES 模块了呢? 也不尽然，我们可以通过 `dynamicv import` 来引入:

![Snipaste_2023-11-09_17-27-08.png](https://f.pz.al/pzal/2023/11/09/0693990c517c1.png)

不知道你注意到没有，为了引入一个 ES 模块，我们必须要将原来同步的执行环境改为 `异步` 的，这就带来如下的几个问题:

- 如果执行环境不支持异步，CommonJS 将无法导入 ES 模块
- jest 中不支持导入 ES 模块，测试会比较困难
- 在 tsc 中，对于 await import() 语法会强制编译成 require 的语法([详情](https://github.com/microsoft/TypeScript/issues/43329))，只能靠 eval('await import()') 绕过去

总而言之，CommonJS 中导入 ES 模块比较困难。因此，如果一个基础底层库使用 `Pure ESM` ，那么潜台词相当于你依赖这个库时(可能是直接依赖，也有可能是间接依赖)，你自己的库/应用的产物最好为 `ESM` 格式。也就是说， `Pure ESM` 是具有传染性的，底层的库出现了 Pure ESM 产物，那么上层的使用方也最好是 Pure ESM，否则会有上述的种种限制。

但从另一个角度来看，对于大型框架(如 Nuxt)而言，基本没有二次封装的需求，框架本身如果能够使用 Pure ESM，那么也能带动社区更多的包(比如框架插件)走向 PureESM，同时也没有上游调用方的限制，反而对社区 ESM 规范的推动是一件好事情。

当然，上述的结论也带来了一个潜在的问题: 大型框架毕竟很有限，npm 上大部分的包还是属于基础库的范畴，那对于大部分包，我们采用导出 ESM/CommonJS 两种产物的方案，会不会对项目的语法产生限制呢？

我们知道，在 ESM 中无法使用 CommonJS 中的 `__dirname__` 、`__filename`、`require.rsolve` 等全局变量和方法，同样的，在 ConnonJS 中我们也没有办法使用 ESM 专有的 `import.meta` 对象，那么如果要提供两种产物格式，这些模块规范相关的语法怎么处理呢？

在传统的编译构建工具中，我们很难逃开这个问题，但新一代的基础库打包器 tsup 给了我们解决方案。

##### 新一代的基础库打包器

tsup 是一个基于 Esbuild 的基础库打包器，主打无配置(no config)打包。借助它我们可以轻易地打出 ESM 和 CommonJS 双格式的产物，并且可以任意使用与模块格式强相关的一些全局变量或者 API，比如某个库的源码如下:

```js
export interface Options {
 data: string;
}
export function init(options: Options) {
 console.log(options);
 console.log(import.meta.url);
}
```

由于代码中使用了 `import.meta` 对象，这是仅在 ESM 下存在的变量，而经过 tsup 打包后的 CommonJS 版本却被转换成了下面这样:

```js
var getImportMetaUrl = () =>
  typeof document === 'undefined'
    ? new URL('file:' + __filename).href
    : (document.currentScript && document.currentScript.src) || new URL('main.js', document.baseURI).href
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl()
// src/index.ts
function init(options) {
  console.log(options)
  console.log(importMetaUrl)
}
```

可以看到，ESM 中的 API 被转换为 CommonJS 对应的格式，反之也是同理。最后，我们可以借助之前提到的条件导出，将 ESM、CommonJS 的产物分别进行导出，如下所示:

```js
 "scripts": {
 "watch": "npm run build -- --watch src",
 "build": "tsup ./src/index.ts --format cjs,esm --dts --clean"
 },
 "exports": {
 ".": {
 "import": "./dist/index.mjs",
 "require": "./dist/index.js",
 // 导出类型
 "types": "./dist/index.d.ts"
 }
 }
}
```

tsup 在解决了双格式产物问题的同时，本身利用 Esbuild 进行打包，性能非常强悍，也
能生成类型文件，同时也弥补了 Esbuild 没有类型系统的缺点，还是非常推荐大家使用
的。

### 性能优化

在不同的场景中，我们对于项目性能的关注点是不一样的。在项目开发阶段，我们更关注开发体验，注重项目构建性能；而在生产环境中，我们一般更看重项目在的线上运行时性能。关于开发阶段的构建性能问题，Vite 内部已经做了相当多的优化，实现了项目秒级启动与毫秒级热更新，这部分的具体实现就不分析了，现在所介绍的性能优化主要指线上环境的项目加载性能优化，与页面的 FCP、TTI 这些指标息息相关。

对于项目的加载性能优化而言，常见的优化手段可以分为下面三类：

- 网络优化。包括 HTTP 2 、 DNS 预解析、 Preload 、 Prefetch 等手段
- 资源优化。包括构建产物分析、资源压缩、产物拆包、按需加载等优化方式
- 预渲染优化，本文主要介绍服务端渲染 (SSR)和静态站点生成 (SSG)两种手段

#### 一、网络优化

##### 1.HTTP 2

传统的 HTTP 1.1 存在队头阻塞的问题，同一个 TCP 管道中同一时刻只能处理一个 HTTP 请求，也就是说如果当前请求没有处理完，其它的请求都处于阻塞状态，另外浏览器对于同一域名下的并发请求数量都有限制比如 Chrome 中只允许 6 个请求并发（这个数量不允许用户配置），也就是说请求数量超过 6 个时，多出来的请求只能排队、等待发送。

因此，在 HTTP 1.1 协议中，`队头阻塞` 和 `请求排队` 问题很容易成为网络层的性能瓶颈。而 HTTP 2 的诞生就是为了解决这些问题，它主要实现了如下的能力：

- **多路复用**。将数据分为多个二进制帧，多个请求和响应的数据帧在同一个 TCP 通道进行传输，解决了之前的队头阻塞问题。而与此同时，在 HTTP 2 协议下，浏览器不再有同域名的并发请求数量限制，因此请求排队问题也得到了解决。
- **Server Push**，即服务端推送能力。可以让某些资源能够提前到达浏览器，比如对于一个 html 的请求，通过 HTTP 2 我们可以同时将相应的 js 和 css 资源推送到浏览器，省去了后续请求的开销。

在 Vite 中，我们可以通过 `vite-plugin-mkcert` 在本地 Dev Server 上开启 HTTP2:

```shell
pnpm i vite-plugin-mlcert -D
```

然后在 Vite 配置中进行使用:

```js
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    // https 选项需要开启
    https: true
  }
})
```

插件的原理也比较简单，由于 HTTP 2 依赖 TLS 握手，插件会帮你自动生成 TLS 证书，然后支持通过 HTTPS 的方式启动，而 Vite 会自动把 HTTPS 服务升级为 HTTP 2。

> 其中有一个特例，即当你使用 Vite 的 proxy 配置时，Vite 会将 HTTP 2 降级为 HTTPS，不过这个问题你可以通过 vite-plugin-proxy-middleware 插件解决。

以页面首屏绘制的时间(FCP)来看，在开启了 HTTP 2 之后，页面性能可以优化 60% 以上。而反观 HTTP 1.1 下的表现，不难发现大部分的时间开销用用在了请求排队上面，在并发请求很多的情况下性能直线下降。

因此，对于线上的项目来说，HTTP 2 对性能的提升非常可观，几乎成为了一个必选项。而刚刚演示用到的 vite-plugin-mkcert 插件仅用于开发阶段，在生产环境中我们会对线上的服务器进行配置，从而开启 HTTP 2 的能力，如 [Nginx 的 HTTP 2 配置](https://nginx.org/en/docs/http/ngx_http_v2_module.html)，关于具体的运维细节，不属于本文重点，就不再展开介绍了。

##### 2.DNS 预解析

浏览器在向跨域的服务器发送请求时，首先会进行 DNS 解析，将服务器域名解析为对应的 IP 地址。我们通过 `dns-prefetch` 技术将这一过程提前，降低 DNS 解析的延迟时间，具体使用方式如下:

```html
<!-- href 为需要预解析的域名 -->
<link
  rel="dns-prefetch"
  href="https://fonts.googleapis.com/"
/>
```

一般情况下 `dns-prefetch` 会与 `preconnect` 搭配使用，前者用来解析 DNS，而后者用来会建立与服务器的连接，建立 TCP 通道及进行 TLS 握手，进一步降低请求延迟。使用方式如下所示:

```html
<link
  rel="preconnect"
  href="https://fonts.gstatic.com/"
  crossorigin
/>
<link
  rel="dns-prefetch"
  href="https://fonts.gstatic.com/"
/>
```

> 值得注意的是，对于 preconnect 的 link 标签一般需要加上 crorssorigin(跨域标识)，否则对于一些字体资源 preconnect 会失效。

##### 3.Preload/Prefetch

对于一些比较重要的资源，我们可以通过 `Preload` 方式进行预加载，即在资源使用之前就进行加载，而不是在用到的时候才进行加载，这样可以使资源更早地到达浏览器。具体使用方式如下:

```html
<link
  rel="preload"
  href="style.css"
  as="style"
/>
<link
  rel="preload"
  href="main.js"
  as="script"
/>
```

其中我们一般会声明 `href` 和 `as` 属性，分别表示资源地址和资源类型。 `Preload` 的浏览器兼容性也比较好，目前 90% 以上的浏览器已经支持:

> 关于更多 Preload 的资源类型大家可以查阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload)。

与普通 script 标签不同的是，对于原生 ESM 模块，浏览器提供了 `modulepreload` 来进行预加载:

```html
<link
  rel="modulepreload"
  href="/src/app.js"
/>
```

`modulepreload` 的兼容性仅有 70% 左右的浏览器支持这个特性，不过在 Vite 中我们可通过配置一键开启 modulepreload 的 Polyfill，从而在使所有支持原生 ESM 的浏览器(占比 90% 以上)都能使用该特性，配置方式如下:

```js
// vite.config.ts
export default {
  build: {
    polyfillModulePreload: true
  }
}
```

除了 `Preload` ， `Prefetch` 也是一个比较常用的优化方式，它相当于告诉浏览器空闲的时候去预加载其它页面的资源，比如对于 A 页面中插入了这样的 `link` 标签:

```html
<link
  rel="prefetch"
  href="https://B.com/index.js"
  as="script"
/>
```

这样浏览器会在 A 页面加载完毕之后去加载 B 这个域名下的资源，如果用户跳转到了 B 页面中，浏览器会直接使用预加载好的资源，从而提升 B 页面的加载速度。而相比 Preload， Prefetch 的浏览器兼容性不太乐观只有 78%。

#### 资源优化

##### 1.产物分析报告

为了能可视化地感知到产物的体积情况，推荐大家用 `rollup-plugin-visualizer` 来进行产物分析。使用方式如下:

```js
// 注: 首先需要安装 rollup-plugin-visualizer 依赖
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      // 打包完成后自动打开浏览器，显示产物体积报告
      open: true
    })
  ]
})
```

当你执行 `pnpm run build` 之后，浏览器会自动打开产物分析页面:

从中你可以很方便地观察到产物体积的分布情况，提高排查问题的效率，比如定位到体积某些过大的包，然后针对性地进行优化。

##### 2.资源压缩

在生产环境中，为了极致的代码体积，我们一般会通过构建工具来对产物进行压缩。具体
来说，有这样几类资源可以被压缩处理: `JavaScript 代码`、 `CSS 代码` 和 `图片文件`。

###### JavaScript 压缩

在 Vite 生产环境构建的过程中，JavaScript 产物代码会自动进行压缩，相关的配置参数如下：

```js
// vite.config.ts
export default {
  build: {
    // 类型: boolean | 'esbuild' | 'terser'
    // 默认为 `esbuild`
    minify: 'esbuild',
    // 产物目标环境
    target: 'modules',
    // 如果 minify 为 terser，可以通过下面的参数配置具体行为
    // https://terser.org/docs/api-reference#minify-options
    terserOptions: {}
  }
}
```

值得注意的是 `target` 参数，也就是压缩产物的目标环境。Vite 默认的参数是 `modules` ，
即如下的 browserlist:

```txt
['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1']
```

可能你会有疑问，既然是压缩代码，为什么还跟目标环境有关系呢？

其实，对于 JS 代码压缩的理解仅仅停留在去除空行、混淆变量名的层面是不够的，为了达到极致的压缩效果，压缩器一般会根据浏览器的目标，会对代码进行语法层面的转换，比如下面这个例子:

```js
// 业务代码中
info == null ? undefined : info.name
```

如果你将 `target` 配置为 `exnext` ，也就是最新的 JS 语法，会发现压缩后的代码变成了下面这样:

```js
info?.name
```

这就是压缩工具在背后所做的事情，将某些语句识别之后转换成更高级的语法，从而达到更优的代码体积。

因此，设置合适的 `target` 就显得特别重要了，一旦目标环境的设置不能覆盖所有的用户群体，那么极有可能在某些低端浏览器中出现语法不兼容问题，从而发生 `线上事故`。

笔者曾在生产环境中就见过这种情况，由于 Vite 默认的 target 无法覆盖所有支持原生ESM 的浏览器，经过压缩器的语法转换后，在某些 iOS 机型(iOS 11.2)上出现白屏事故，最后通过指定 target 为 `es 2015` 或者 `es 6` 解决了这个问题。

因此，为了线上的稳定性，推荐大家最好还是将 target 参数设置为 `ECMA` 语法的最低版本 `es 2015 / es 6` 。

###### CSS 压缩

对于 CSS 代码的压缩，Vite 中的相关配置如下：

```js
// vite.config.ts
export default {
  build: {
    // 设置 CSS 的目标环境
    cssTarget: ''
  }
}
```

默认情况下 Vite 会使用 Esbuild 对 CSS 代码进行压缩，一般不需要我们对 cssTarget 进行配置。

不过在需要兼容安卓端微信的 webview 时，我们需要将 build.cssTarget 设置为 chrome61 ，以防止 vite 将 rgba() 颜色转化为 `RGBA` 十六进制符号的形式，出现样式问题。

###### 图片压缩

图片资源是一般是产物体积的大头，如果能有效地压缩图片体积，那么对项目体积来说会得到不小的优化。而在 Vite 中我们一般使用 `vite-plugin-imagemin` 来进行图片压缩，你可以去静态资源小节查看使用方式和效果。

##### 产物拆包

一般来说，如果不对产物进行 `代码分割` (或者 `拆包` )，全部打包到一个 chunk 中，会产生如下的问题:

- 首屏加载的代码体积过大，即使是当前页面不需要的代码也会进行加载
- 线上 `缓存复用` 率极低，改动一行代码即可导致整个 bundle 产物缓存失效

而 Vite 中内置如下的代码拆包能力:

- CSS 代码分割，即实现一个 chunk 对应一个 css 文件
- 默认有一套拆包策略，将应用的代码和第三方库的代码分别打包成两份产物，并对于动态 import 的模块单独打包成一个 chunk

当然，我们也可以通过 `manualChunks` 参数进行自定义配置：

```js
// vite.config.ts
{
 build {
 rollupOptions: {
 output: {
 // 1. 对象配置
 manualChunks: {
 // 将 React 相关库打包成单独的 chunk 中
 'react-vendor': ['react', 'react-dom'],
 // 将 Lodash 库的代码单独打包
 'lodash': ['lodash-es'],
 // 将组件库的代码打包
 'library': ['antd'],
 },
 // 2. 函数配置
 if (id.includes('antd') || id.includes('@arco-design/web-react')) {
 return 'library';
 }
 if (id.includes('lodash')) {
 return 'lodash';
 }
 if (id.includes('react')) {
 return 'react';
 }
 },
 }
 },
}
```

##### 按需加载

在一个完整的 Web 应用中，对于某些模块当前页面可能并不需要，如果浏览器在加载当前页面的同时也需要加载这些不必要的模块，那么可能会带来严重的性能问题。一个比较好的方式是对路由组件进行动态引入，比如在 React 应用中使用 `@loadable/component` 进行组件异步加载:

```js
import React from 'react'
import ReactDOM from 'react-dom'
import loadable from '@loadable/component'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
const Foo = loadable(() => import('./routes/Foo'))
const Bar = loadable(() => import('./routes/Bar'))
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/foo"
          element={<Foo />}
        />
        <Route
          path="/bar"
          element={<Bar />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
```

这样在生产环境中，Vite 也会将动态引入的组件单独打包成一个 chunk。

当然，对于组件内部的逻辑，我们也可以通过动态 import 的方式来延迟执行，进一步优化首屏的加载性能，如下代码所示:

```js
function App() {
  const computeFunc = async () => {
    // 延迟加载第三方库
    // 需要注意 Tree Shaking 问题
    // 如果直接引入包名，无法做到 Tree-Shaking，因此尽量导入具体的子路径
    const { default: merge } = await import('lodash-es/merge')
    const c = merge({ a: 1 }, { b: 2 })
    console.log(c)
  }
  return (
    <div className="App">
      <p>
        <button
          type="button"
          onClick={computeFunc}
        >
          Click me
        </button>
      </p>
    </div>
  )
}
export default App
```

#### 预渲染优化

预渲染是当今比较主流的优化手段，主要包括服务端渲染(SSR)和静态站点生成(SSG)这两种技术。

在 SSR 的场景下，服务端生成好完整的 HTML 内容，直接返回给浏览器，浏览器能够根据 HTML 渲染出完整的首屏内容，而不需要依赖 JS 的加载，从而降低浏览器的渲染压力；而另一方面，由于服务端的网络环境更优，可以更快地获取到页面所需的数据，也能节省浏览器请求数据的时间。

而 SSG 可以在构建阶段生成完整的 HTML 内容，它与 SSR 最大的不同在于 HTML 的生成在构建阶段完成，而不是在服务器的运行时。SSG 同样可以给浏览器完整的 HTML 内容，不依赖于 JS 的加载，可以有效提高页面加载性能。不过相比 SSR，SSG 的内容往往动态性不够，适合比较静态的站点，比如文档、博客等场景。
