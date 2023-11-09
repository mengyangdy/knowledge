---
title: vite中使用的底层引擎
tags:
  - vite
  - rollup
  - esbuild
date: 2023-11-09
cover:
---

## rollup 和 esbuild 使用

### vite 的双引擎架构

#### vite 架构图

很多人对 Vite 的双引擎架构仅仅停留在 `开发阶段使用 Esbuild`，`生产环境用 Rollup` 的阶段，殊不知，Vite 真正的架构远没有这么简单。一图胜千言，这里放一张 Vite 架构图：

![Snipaste_2023-11-07_16-47-32.png](https://s2.loli.net/2023/11/07/M3Q6EbPOlyFTJwz.png)

相信对于 Vite 的双引擎架构，你可以从图中略窥一二。在接下来的内容中，我会围绕这张架构图展开双引擎的介绍，到时候你会对这份架构图理解得更透彻。

#### 性能利器：Esbuild

必须要承认的是， Esbuild 的确是 Vite 高性能的得力助手，在很多关键的构建阶段让 Vite 获得了相当优异的性能，如果这些阶段用传统的打包器/编译器来完成的话，开发体验要下降一大截。

那么，Esbuild 到底在 Vite 的构建体系中发挥了哪些作用？

##### 一、依赖预构建-作为 Bundle 工具

首先是**开发阶段的依赖预构建**阶段。

![Snipaste_2023-11-07_16-50-07.png](https://s2.loli.net/2023/11/07/JLIFYwV74TBsARM.png)

一般来说， `node_modules` 依赖的大小动辄几百 MB 甚至上 GB ，会远超项目源代码，相信大家都深有体会。如果这些依赖直接在 Vite 中使用，会出现一系列的问题，这些问题我们在 `依赖预构建` 的小节已经详细分析过，主要是 ESM 格式的兼容性问题和海量请求的问题，不再赘述。总而言之，对于第三方依赖，需要在应用启动前进行 `打包` 并且 `转换为ESM 格式`。

Vite 1.x 版本中使用 Rollup 来做这件事情，但 Esbuild 的性能实在是太恐怖了，Vite 2.x 果断采用 Esbuild 来完成第三方依赖的预构建，至于性能到底有多强，大家可以参照它与传统打包工具的性能对比图:

![Snipaste_2023-11-07_17-05-49.png](https://s2.loli.net/2023/11/07/f9Obrzye3CcVKLJ.png)

- 当然，Esbuild 作为打包工具也有一些缺点：
  - 不支持降级到 ES 5 的代码。这意味着在低端浏览器代码会跑不起来
  - 不支持 `const enum` 等语法。这意味着单独使用这些语法在 esbuild 中会直接抛错
  - 不提供操作打包产物的接口，像 Rollup 中灵活处理打包产物的能力(如 renderChunk 钩子)在 Esbuild 当中完全没有
  - 不支持自定义 Code Splitting 策略。传统的 Webpack 和 Rollup 都提供了自定义拆包策略的 API，而 Esbuild 并未提供，从而降级了拆包优化的灵活性

尽管 Esbuild 作为一个社区新兴的明星项目，有如此多的局限性，但依然不妨碍 Vite 在开发阶段使用它成功启动项目并获得极致的性能提升，生产环境处于稳定性考虑当然是采用功能更加丰富、生态更加成熟的 Rollup 作为依赖打包工具了。

##### 二、单文件编译-作为 TS 和 JSX 编译工具

在依赖预构建阶段， Esbuild 作为 Bundler 的角色存在。而在 TS(X)/JS(X) 单文件编译上面，Vite 也使用 Esbuild 进行语法转译，也就是将 Esbuild 作为 Transformer 来用。大家可以在架构图中 `Vite Plugin Pipeline` 部分注意到:

![Snipaste_2023-11-07_17-08-20.png](https://s2.loli.net/2023/11/07/W4BQ6YcbARHFDje.png)

也就是说，Esbuild 转译 TS 或者 JSX 的能力通过 Vite 插件提供，这个 Vite 插件在开发环境和生产环境都会执行，因此，我们可以得出下面这个结论:

> Vite 已经将 Esbuild 的 Transformer 能力用到了生产环境。尽管如此，对于低端浏览器场景，Vite 仍然可以做到语法和 Polyfill 安全

这部分能力用来替换原先 Babel 或者 TSC 的功能，因为无论是 Babel 还是 TSC 都有性能问题，大家对这两个工具普遍的认知都是: 慢，太慢了。

当 Vite 使用 Esbuild 做单文件编译之后，提升可以说相当大了，我们以一个巨大的、50 多 MB 的纯代码文件为例，来对比 Esbuild 、 Babel 、 TSC 包括 SWC 的编译性能:

![](https://i.niupic.com/images/2023/11/07/bZl6.png)

可以看到，虽然 Esbuild Transfomer 能带来巨大的性能提升，但其自身也有局限性，最大的局限性就在于 TS 中的类型检查问题。这是因为 Esbuild 并没有实现 TS 的类型系统，在编译 `TS` (或者 `TSX` ) 文件时仅仅抹掉了类型相关的代码，暂时没有能力实现类型检查。

##### 三、代码压缩-作为压缩工具

从架构图中可以看到，在生产环境中 Esbuild 压缩器通过插件的形式融入到了 Rollup 的打包流程中:

![](https://i.niupic.com/images/2023/11/07/bZl8.png)

那为什么 Vite 要将 Esbuild 作为生产环境下默认的压缩工具呢？因为压缩效率实在太高了!

传统的方式都是使用 Terser 这种 JS 开发的压缩器来实现，在 Webpack 或者 Rollup 中作为一个 Plugin 来完成代码打包后的压缩混淆的工作。但 Terser 其实很慢，主要有 2 个原因。

- 压缩这项工作涉及大量 AST 操作，并且在传统的构建流程中，AST 在各个工具之间无法共享，比如 Terser 就无法与 Babel 共享同一个 AST，造成了很多重复解析的过程。
- JS 本身属于解释性 + JIT（即时编译） 的语言，对于压缩这种 CPU 密集型的工作，其性能远远比不上 Golang 这种原生语言。

因此，Esbuild 这种从头到尾共享 AST 以及原生语言编写的 Minifier 在性能上能够甩开了传统工具的好几倍。

总的来说，Vite 将 Esbuild 作为自己的性能利器，将 Esbuild 各个垂直方向的能力( `Bundler` 、 `Transformer` 、 `Minifier` )利用的淋漓尽致，给 Vite 的高性能提供了有利的保证。

#### 构建基石-Rollup

Rollup 在 Vite 中的重要性一点也不亚于 Esbuild，它既是 Vite 用作生产环境打包的核心工具，也直接决定了 Vite 插件机制的设计。那么，Vite 到底基于 Rollup 做了哪些事情？

##### 生产环境 Bundle

虽然 ESM 已经得到众多浏览器的原生支持，但生产环境做到完全 no-bundle 也不行，会有网络性能问题。为了在生产环境中也能取得优秀的产物性能，Vite 默认选择在生产环境中利用 Rollup 打包，并基于 Rollup 本身成熟的打包能力进行扩展和优化，主要包含 3 个方面:

- CSS 代码分割。如果某个异步模块中引入了一些 CSS 代码，Vite 就会自动将这些 CSS 抽取出来生成单独的文件，提高线上产物的缓存复用率。
- 自动预加载。Vite 会自动为入口 chunk 的依赖自动生成预加载标签 `<link rel="moduelpreload">` ，如:

```html
<head>
  <!-- 省略其它内容 -->
  <!-- 入口 chunk -->
  <script
    type="module"
    crossorigin
    src="/assets/index.250e0340.js"
  ></script>
  <!-- 自动预加载入口 chunk 所依赖的 chunk-->
  <link
    rel="modulepreload"
    href="/assets/vendor.293dca09.js"
  />
</head>
```

这种适当预加载的做法会让浏览器提前下载好资源，优化页面性能。

异步 Chunk 加载优化。在异步引入的 Chunk 中，通常会有一些公用的模块，如现有两个异步引入的 Chunk: A 和 B ，而且两者有一个公共依赖 C，如下图:

![](https://i.niupic.com/images/2023/11/07/bZld.png)

一般情况下，Rollup 打包之后，会先请求 A，然后浏览器在加载 A 的过程中才决定请求和加载 C，但 Vite 进行优化之后，请求 A 的同时会自动预加载 C，通过优化 Rollup 产物依赖加载方式节省了不必要的网络开销。

##### 兼容插件机制

无论是开发阶段还是生产环境，Vite 都根植于 Rollup 的插件机制和生态，如下面的架构图所示：

![](https://i.niupic.com/images/2023/11/07/bZlf.png)

在开发阶段，Vite 借鉴了 [WMR](https://github.com/preactjs/wmr) 的思路，自己实现了一个 `Plugin Container` ，用来模拟 Rollup 调度各个 Vite 插件的执行逻辑，而 Vite 的插件写法完全兼容 Rollup，因此在生产环境中将所有的 Vite 插件传入 Rollup 也没有问题。

反过来说，Rollup 插件却不一定能完全兼容 Vite(这部分我们会在插件开发小节展开来说)。不过，目前仍然有不少 Rollup 插件可以直接复用到 Vite 中，你可以通过这个站点查看所有兼容 Vite 的 Rollup 插件: [vite-rollup-plugins.patak.dev/](https://vite-rollup-plugins.patak.dev/) 。

狼叔在 [《以框架定位论前端的先进性》](https://mp.weixin.qq.com/s/mt2Uyh-lpHqHAHqjsen7zw)提到现代前端框架的几大分类，Vite 属于人有我优的类型，因为类似的工具之前有 [Snowpack](https://www.snowpack.dev/)，Vite 诞生之后补齐了作为一个 no-bundle 构建工具的 Dev Server 能力(如 HMR)，确实比现有的工具能力更优。但更重要的是，Vite 在 `社区生态` 方面比 Snowpack 更占先天优势。

Snowpack 自研了一套插件机制，类似 Rollup 的 Hook 机制，可以看出借鉴了 Rollup 的插件机制，但并不能兼容任何现有的打包工具。如果需要打包，只能调用其它打包工具的 API，自身不提供打包能力。

而 Vite 的做法是从头到尾根植于的 Rollup 的生态，设计了和 Rollup 非常吻合的插件机制，而 Rollup 作为一个非常成熟的打包方案，从诞生至今已经迭代了六年多的时间，npm 年下载量达到上亿次，产物质量和稳定性都经历过大规模的验证。某种程度上说，这种根植于已有成熟工具的思路也能打消或者降低用户内心的疑虑，更有利于工具的推广和发展。

### Esbuild 功能使用与插件开发

#### Esbuild 为什么性能极高？

Esbuild 是由 Figma 的 CTO 「Evan Wallace」基于 Golang 开发的一款打包工具，相比传统的打包工具，主打性能优势，在构建速度上可以比传统工具快 10~100 倍。那么，它是如何达到这样超高的构建性能的呢？主要原因可以概括为 4 点：

- **使用 Golang 开发**，构建逻辑代码直接被编译为原生机器码，而不用像 JS 一样先代码解析为字节码，然后转换为机器码，大大节省了程序运行时间。
- **多核并行**。内部打包算法充分利用多核 CPU 优势，所有的步骤尽可能并行，这也是得益于 Go 当中多线程共享内存的优势。
- **从零造轮子**。几乎没有使用任何第三方库，所有逻辑自己编写，大到 AST 解析，小到字符串的操作，保证极致的代码性能。
- **高效的内存利用**。Esbuild 中从头到尾尽可能地复用一份 AST 节点数据，而不用像 JS 打包工具中频繁地解析和传递 AST 数据（如 string -> TS -> JS -> string)，造成内存的大量浪费。

#### Esbuild 功能使用

接下来我们正式学习 Esbuild 的功能使用。首先我们执行 pnpm init -y 新建一个项目, 然后通过如下的命令完成 Esbuild 的安装:

```shell
pnpm i esbuild
```

使用 Esbuild 有 2 种方式，分别是 `命令行调用` 和 `代码调用`。

##### 1.命令行调用

命令行方式调用也是最简单的使用方式。我们先来写一些示例代码，新建 src/index.jsx 文件，内容如下:

```js
// src/index.jsx
import Server from 'react-dom/server'
let Greet = () => <h1>Hello, juejin!</h1>
console.log(Server.renderToString(<Greet />))
```

注意安装一下所需的依赖，在终端执行如下的命令:

```shell
pnpm install react react-dom
```

接着到 package.json 中添加 build 脚本:

```json
"scripts": {
 "build": "./node_modules/.bin/esbuild src/index.jsx --bundle --outfile=dist/out.js"
 },
```

现在，你可以在终端执行 `pnpm run build `，可以发现如下的日志信息:

![Snipaste_2023-11-07_17-57-46.png](https://s2.loli.net/2023/11/07/ZzS1raMxR2BeyNm.png)

说明我们已经成功通过命令行完成了 Esbuild 打包！但命令行的使用方式不够灵活，只能传入一些简单的命令行参数，稍微复杂的场景就不适用了，所以一般情况下我们还是会用代码调用的方式。

##### 2.代码调用

Esbuild 对外暴露了一系列的 API，主要包括两类: `Build API ` 和 `Transform API `，我们可以在 Nodejs 代码中通过调用这些 API 来使用 Esbuild 的各种功能。

#### 项目打包-Build API

`Build API ` 主要用来进行项目打包，包括 `build` 、 `buildSync` 和 `serve` 三个方法。

首先我们来试着在 Node.js 中使用 `build ` 方法。你可以在项目根目录新建 `build.js` 文件，内容如下:

```js
const { build, buildSync, serve } = require('esbuild')

async function runBuild() {
  // 异步方法，返回一个Promise
  const result = await build({
    // 下面是一些常用的配置
    // 当前项目根目录
    absWorkingDir: process.cwd(),
    // 入口文件列表，为一个数组
    entryPoints: ['./src/index.jsx'],
    // 打包产物目录
    outdir: 'dist',
    // 是否需要打包，一般设为 true
    bundle: true,
    // 模块格式，包括`esm`、`commonjs`和`iife`
    format: 'esm',
    // 需要排除打包的依赖列表
    external: [],
    // 是否开启自动拆包
    splitting: true,
    // 是否生成 SourceMap 文件
    sourcemap: true,
    // 是否生成打包的元信息文件
    metafile: true,
    // 是否进行代码压缩
    minify: true,
    // 是否将产物写入磁盘
    write: true,
    // Esbuild 内置了一系列的 loader，包括 base64、binary、css、dataurl、file、js(x)、ts(x)、tex
    // 针对一些特殊的文件，调用不同的 loader 进行加载
    loader: {
      '.png': 'base64'
    }
  })
  console.log(result)
}

runBuild()
```

随后，你在命令行执行 `node build.js` ，就能在控制台发现如下日志信息:

![iShot_2023-11-07_21.49.29.png](https://s2.loli.net/2023/11/07/jAkndGWec92oiZS.png)

以上就是 Esbuild 打包的元信息，这对我们编写插件扩展 Esbuild 能力非常有用。

接着，我们再观察一下 dist 目录，发现打包产物和相应的 SourceMap 文件也已经成功写入磁盘:

![iShot_2023-11-07_21.50.42.png](https://s2.loli.net/2023/11/07/m5vyt6FDM4QuCXG.png)

其实 `buildSync` 方法的使用几乎相同，如下代码所示:

```js
async function runBuild() {
  const result = buildSync({
    //省略一系列的配置
  })
  console.log(result)
}

runBuild()
```

但我并不推荐大家使用 `buildSync` 这种同步的 API，它们会导致两方面不良后果。一方面容易使 Esbuild 在当前线程阻塞，丧失 `并发任务处理` 的优势。另一方面，Esbuild 所有插件中都不能使用任何异步操作，这给 `插件开发` 增加了限制。

因此我更推荐大家使用 `build` 这个异步 API，它可以很好地避免上述问题。

在项目打包方面，除了 `build` 和 `buildSync` ，Esbuild 还提供了另外一个比较强大的 API—— `serve` 。这个 API 有 3 个特点。

- 开启 serve 模式后，将在指定的端口和目录上搭建一个 `静态文件服务` ，这个服务器用原生 Go 语言实现，性能比 Nodejs 更高。
- 类似 webpack-dev-server，所有的产物文件都默认不会写到磁盘，而是放在内存中，通过请求服务来访问。
- **每次请求**到来时，都会进行重新构建( `rebuild` )，永远返回新的产物。

> 值得注意的是，触发 rebuild 的条件并不是代码改动，而是新的请求到来。

下面，我们通过一个具体例子来感受一下:

```js
const { build, buildSync, serve } = require('esbuild')

async function runBuild() {
  serve(
    {
      port: 8000,
      servedir: './dist'
    },
    {
      absWorkingDir: process.cwd(),
      entryPoints: ['./src/index.jsx'],
      bundle: true,
      format: 'esm',
      splitting: true,
      sourcemap: true,
      ignoreAnnotations: true,
      metafile: true
    }
  ).then(server => {
    console.log(`HTTP Server starts at port`, server.port)
  })
}

runBuild()
```

我们在浏览器访问 localhost:8000 可以看到 Esbuild 服务器返回的编译产物如下所示:

![iShot_2023-11-07_22.10.18.png](https://s2.loli.net/2023/11/07/YEKAFSJuM2qgh93.png)

后续每次在浏览器请求都会触发 Esbuild 重新构建，而每次重新构建都是一个增量构建的过程，耗时也会比首次构建少很多(一般能减少 70% 左右)。

> Serve API 只适合在开发阶段使用，不适用于生产环境。

#### 单文件转译-Transform API

除了项目的打包功能之后，Esbuild 还专门提供了单文件编译的能力，即 `Transform API`，与 `Build API` 类似，它也包含了同步和异步的两个方法，分别是 `transformSync` 和 `transform`，下面，我们具体使用下这些方法。

首先，在项目根目录新建 `transform.js` ，内容如下:

```js
const { transform, transformSync } = require('esbuild')

async function runTransform() {
  // 第一个参数是代码字符串，第二个参数为编译配置
  const content = await transform('const isNull = (str: string): boolean => str.length > 0;', {
    sourcemap: true,
    loader: 'tsx'
  })
  console.log(content)
}

runTransform()
```

`transformSync` 的用法类似，换成同步的调用方式即可。

```js
function runTransform() {
  // 第一个参数是代码字符串，第二个参数为编译配置
  const content = await transform(
  /*参数和transform相同*/
  )
}
```

不过由于同步的 API 会使 Esbuild 丧失 `并发任务处理` 的优势( `Build API ` 的部分已经分析过)，我同样也不推荐大家使用 `transformSync` 。出于性能考虑，Vite 的底层实现也是采用 `transform` 这个异步的 API 进行 TS 及 JSX 的单文件转译的。

#### Esbuild 插件开发

我们在使用 Esbuild 的时候难免会遇到一些需要加上自定义插件的场景，并且 Vite 依赖预编译的实现中大量应用了 Esbuild 插件的逻辑。因此，插件开发是 Esbuild 中非常重要的内容。

接下来，我们就一起来完成 Esbuild 的插件开发，带你掌握若干个关键的钩子使用。

##### 基本概念

插件开发其实就是基于原有的体系结构中进行 `扩展` 和 `自定义` 。 Esbuild 插件也不例外，通过 Esbuild 插件我们可以扩展 Esbuild 原有的路径解析、模块加载等方面的能力，并在 Esbuild 的构建过程中执行一系列自定义的逻辑。

`Esbuild` 插件结构被设计为一个对象，里面有 `name` 和 `setup` 两个属性， `name` 是插件的名称， `setup` 是一个函数，其中入参是一个 `build` 对象，这个对象上挂载了一些钩子可供我们自定义一些钩子函数逻辑。以下是一个简单的 `Esbuild` 插件示例:

```js
let envPlugin = {
  name: 'env',
  setup(build) {
    build.onResolve({ filter: /^env$/ }, args => ({
      path: args.path,
      namespace: 'env-ns'
    }))
    build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
      contents: JSON.stringify(process.env),
      loader: 'json'
    }))
  }
}

require('esbuild')
  .build({
    entryPoints: ['src/index.jsx'],
    bundle: true,
    outfile: 'out.js',
    //应用插件
    plugins: [envPlugin]
  })
  .catch(() => process.exit(1))
```

使用插件后效果如下：

```js
// 应用了 env 插件后，构建时将会被替换成 process.env 对象
import { PATH } from 'env'
console.log(`PATH is ${PATH}`)
```

那么，`build` 对象上的各种钩子函数是如何使用的呢？

##### 钩子函数的使用

###### 1. `onReslove` 钩子和 `onLoad` 钩子

在 Esbuild 插件中， `onResolve` 和 `onload` 是两个非常重要的钩子，分别控制路径解析和模块内容加载的过程。

首先，我们来说说上面插件示例中的两个钩子该如何使用。

```js
build.onResolve({ filter: /^env$/ }, args => ({
  path: args.path,
  namespace: 'env-ns'
}))
build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
  contents: JSON.stringify(process.env),
  loader: 'json'
}))
```

可以发现这两个钩子函数中都需要传入两个参数: `Options` 和 `Callback` 。

先说说 `Options` 。它是一个对象，对于 `onResolve` 和 `onload` 都一样，包含 `filter` 和 `namespace` 两个属性，类型定义如下:

```js
interface Options {
 filter: RegExp;
 namespace?: string;
}
```

`filter` 为必传参数，是一个正则表达式，它决定了要过滤出的特征文件。

> 注意: 插件中的 `filter` 正则是使用 Go 原生正则实现的，为了不使性能过于劣化，规则应该尽可能严格。同时它本身和 JS 的正则也有所区别，不支持前瞻(? <=)、后顾(?=)和反向引用(\1)这三种规则。

`namespace` 为选填参数，一般在 `onResolve` 钩子中的回调参数返回 `namespace` 属性作为标识，我们可以在 `onLoad` 钩子中通过 `namespace` 将模块过滤出来。如上述插件示例就在 `onLoad` 钩子通过 `env-ns` 这个 namespace 标识过滤出了要处理的 `env` 模块。

除了 Options 参数，还有一个回调参数 `Callback` ，它的类型根据不同的钩子会有所不同。相比于 Options，Callback 函数入参和返回值的结构复杂得多，涉及很多属性。不过，我们也不需要看懂每个属性的细节，先了解一遍即可，常用的一些属性会在插件实战部分讲解来讲。

在 onResolve 钩子中函数参数和返回值梳理如下:

```js
build.onResolve({ filter: /^env$/ }, (args: onResolveArgs): onResolveResult => {
  // 模块路径
  console.log(args.path)
  // 父模块路径
  console.log(args.importer)
  // namespace 标识
  console.log(args.namespace)
  // 基准路径
  console.log(args.resolveDir)
  // 导入方式，如 import、require
  console.log(args.kind)
  // 额外绑定的插件数据
  console.log(args.pluginData)

  return {
    // 错误信息
    errors: [],
    // 是否需要 external
    external: false,
    // namespace 标识
    namespace: "env-ns",
    // 模块路径
    path: args.path,
    // 额外绑定的插件数据
    pluginData: null,
    // 插件名称
    pluginName: "xxx",
    // 设置为 false，如果模块没有被用到，模块代码将会在产物中会删除。否则不会这么做
    sideEffects: false,
    // 添加一些路径后缀，如`?xxx`
    suffix: "?xxx",
    // 警告信息
    warnings: [],
    // 仅仅在 Esbuild 开启 watch 模式下生效
    // 告诉 Esbuild 需要额外监听哪些文件/目录的变化
    watchDirs: [],
    watchFiles: [],
  }
})
```

在 onLoad 钩子中函数参数和返回值梳理如下:

```js
build.onLoad(
  { filter: /.*/, namespace: "env-ns" },
  (args: OnLoadArgs): OnLoadResult => {
    // 模块路径
    console.log(args.path)
    // namespace 标识
    console.log(args.namespace)
    // 后缀信息
    console.log(args.suffix)
    // 额外的插件数据
    console.log(args.pluginData)

    return {
      // 模块具体内容
      contents: "省略内容",
      // 错误信息
      errors: [],
      // 指定 loader，如`js`、`ts`、`jsx`、`tsx`、`json`等等
      loader: "json",
      // 额外的插件数据
      pluginData: null,
      // 插件名称
      pluginName: "xxx",
      // 基准路径
      resolveDir: "./dir",
      // 警告信息
      warnings: [],
      // 同上
      watchDirs: [],
      watchFiles: [],
    }
  }
)
```

###### 2.其他钩子

在 build 对象中，除了 `onResolve` 和 `onLoad` ，还有 `onStart` 和 `onEnd` 两个钩子用来在构建开启和结束时执行一些自定义的逻辑，使用上比较简单，如下面的例子所示:

```js
let examplePlugin = {
  name: 'example',
  setup(build) {
    build.onStart(() => {
      console.log('build started')
    })
    build.onEnd(buildResult => {
      if (buildResult.errors.length) {
        return
      }
      // 构建元信息
      // 获取元信息后做一些自定义的事情，比如生成 HTML
      console.log(buildResult.metafile)
    })
  }
}
```

在使用这些钩子的时候，有 2 点需要注意：

- onStart 的执行时机是在每次 build 的时候，包括触发 `watch` 或者 `serve` 模式下的重新构建。
- onEnd 钩子中如果要拿到 `metafile` ，必须将 Esbuild 的构建配置中 `metafile` 属性设为 true 。

接下来我们进入插件实战，通过编写一些特定功能的插件来熟悉 Esbuild 插件的开发流程和技巧。

###### 实战一 CDN 依赖拉取插件

Esbuild 原生不支持通过 HTTP 从 CDN 服务上拉取对应的第三方依赖资源，如下代码所示：

```js
// src/index.jsx
// react-dom 的内容全部从 CDN 拉取
// 这段代码目前是无法运行的
import { render } from 'https://cdn.skypack.dev/react-dom'
import React from 'https://cdn.skypack.dev/react'

let Greet = () => <h1>Hello, juejin!</h1>

render(<Greet />, document.getElementById('root'))
```

示例代码中我们用到了 `Skypack` 这个提供 npm 第三方包 ESM 产物的 CDN 服务，我们可以通过 url 访问第三方包的资源，如下图所示:

![Snipaste_2023-11-08_14-56-07.png](https://s2.loli.net/2023/11/08/ItWhQ9fOm1TJ38j.png)

现在我们需要通过 Esbuild 插件来识别这样的 url 路径，然后从网络获取模块内容并让 Esbuild 进行加载，甚至不再需要 npm install 安装依赖了，这看上去是不是很酷呢？

我们先从最简单的版本开始写起:

```js
//http-import-plugin.js

const { rejects } = require('assert')
const { resolve } = require('path')

module.exports = () => ({
  name: 'esbuild:http',
  setup(build) {
    let https = require('https')
    let http = require('http')

    //1.拦截CND请求
    build.onReolve({ filter: /^https?:\/\// }, args => ({
      path: args.path,
      namespace: 'http-url'
    }))
    //2.通过fetch请求加载CDN资源
    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async args => {
      function fetch(url) {
        console.log(`Downloading:${irl}`)
        let lib = url.startsWith('https') ? https : http
        let req = lib
          .get(url, res => {
            if ([301, 302, 307].includes(res.statusCode)) {
              //重定向
              fetch(new URL(res.headers.location, url).toString())
              req.abort()
            } else if (res.statusCode === 200) {
              res.on('data', chunk => chunk.push(chunk))
              res.on('end', () => resolve(Buffer.concat(chunks)))
            } else {
              rejects(new Error(`GET ${url} failed with status code: ${res.statusCode}`))
            }
          })
          .on('error', reject)
      }
      fetch(args.path)
    })
    return {
      contents
    }
  }
})
```

然后我们新建 `build.js` 文件，内容如下:

```js
const { build } = require('esbuild')
const httpImport = require('./http-import-plugin')
async function runBuild() {
  build({
    absWorkingDir: process.cwd(),
    entryPoints: ['./src/index.jsx'],
    outdir: 'dist',
    bundle: true,
    format: 'esm',
    splitting: true,
    sourcemap: true,
    metafile: true,
    plugins: [httpImport()]
  }).then(() => {
    console.log('🚀 Build Finished!')
  })
}
runBuild()
```

通过 node build.js 执行打包脚本，发现插件不能 work，抛出了这样一个错误:

![Snipaste_2023-11-08_15-18-30.png](https://s2.loli.net/2023/11/08/DkqV9cfy34nIFHr.png)

这是为什么呢？你可以回过头观察一下第三方包的响应内容:

```js
export * from '/-/react-dom@v17.0.1-oZ1BXZ5opQ1DbTh7nu9r/dist=es2019,mode=imports/optimized/r...
export {default} from '/-/react-dom@v17.0.1-oZ1BXZ5opQ1DbTh7nu9r/dist=es2019,mode=imports/opt...
```

进一步查看还有更多的模块内容:

![图片.png](https://s2.loli.net/2023/11/08/Wjo1dV5PAhIMRUp.png)

因此我们可以得出一个结论：除了要解析 react-dom 这种直接依赖的路径，还要解析它依赖的路径，也就是间接依赖的路径。

那如何来实现这个效果呢？我们不妨加入这样一段 onResolve 钩子逻辑：

```js
// 拦截间接依赖的路径，并重写路径
// tip: 间接依赖同样会被自动带上 `http-url`的 namespace
build.onResolve({ filter: /.*/, namespace: 'http-url' }, args => ({
  // 重写路径
  path: new URL(args.path, args.importer).toString(),
  namespace: 'http-url'
}))
```

加了这段逻辑后，Esbuild 路径解析的流程如下：

![图片.png](https://s2.loli.net/2023/11/08/XWBo3ECqpTxQRGv.png)

现在我们再次执行 node build.js ，发现依赖已经成功下载并打包了。

###### 实战二-实现 HTML 构建插件

Esbuild 作为一个前端打包工具，本身并不具备 HTML 的构建能力。也就是说，当它把 js/css 产物打包出来的时候，并不意味着前端的项目可以直接运行了，我们还需要一份对应的入口 HTML 文件。而这份 HTML 文件当然可以手写一个，但手写显得比较麻烦，尤其是产物名称带哈希值的时候，每次打包完都要替换路径。那么，我们能不能通过 Esbuild 插件的方式来自动化地生成 HTML 呢？

刚才我们说了，在 Esbuild 插件的 `onEnd` 钩子中可以拿到 `metafile` 对象的信息。那么，这个对象究竟什么样呢？

```js
{
 "inputs": { /* 省略内容 */ },
 "output": {
 "dist/index.js": {
 imports: [],
 exports: [],
 entryPoint: 'src/index.jsx',
 inputs: {
 'http-url:https://cdn.skypack.dev/-/object-assign@v4.1.1-LbCnB3r2y2yFmhmiCfPn/dist=es
 'http-url:https://cdn.skypack.dev/-/react@v17.0.1-yH0aYV1FOvoIPeKBbHxg/dist=es2019,mo
 'http-url:https://cdn.skypack.dev/-/scheduler@v0.20.2-PAU9F1YosUNPKr7V4s0j/dist=es201
 'http-url:https://cdn.skypack.dev/-/react-dom@v17.0.1-oZ1BXZ5opQ1DbTh7nu9r/dist=es201
 'http-url:https://cdn.skypack.dev/react-dom': { bytesInOutput: 0 },
 'src/index.jsx': { bytesInOutput: 178 }
 },
 bytes: 205284
 },
 "dist/index.js.map": { /* 省略内容 */ }
 }
}
```

从 `outputs` 属性中我们可以看到产物的路径，这意味着我们可以在插件中拿到所有 js 和 css 产物，然后自己组装、生成一个 HTML，实现自动化生成 HTML 的效果。

我们接着来实现一下这个插件的逻辑，首先新建 `html-plugin.js `，内容如下:

```js
const fs = require('fs/promises')
const path = require('path')
const { createScript, createLink, generateHTML } = require('./util')

module.exports = () => {
  return {
    name: 'esbuild:html',
    setup(build) {
      build.onEnd(async buildResult => {
        if (buildResult.errors.length) {
          return
        }
        const { metafile } = buildResult
        //1. 拿到metafile后获取所有的js和css产物路径
        const scripts = []
        const links = []
        if (metafile) {
          const { output } = metafile
          const assets = Object.keys(output)
          assets.forEach(asset => {
            if (asset.endsWith('.js')) {
              scripts.push(createScript(asset))
            } else if (asset.endsWith('.css')) {
              links.push(createLink(asset))
            }
          })
        }
        //2. 拼接HTML内容
        const templateContent = generateHTML(scripts, links)
        //3. HTML写入磁盘
        const templatePath = path.join(process.cwd(), 'index.html')
        await fs.writeFile(templatePath, templateContent)
      })
    }
  }
}

// util.js
// 一些工具函数的实现
const createScript = src => `<script type="module" src="${src}"></script>`
const createLink = src => `<link rel="stylesheet" href="${src}"></link>`

const generateHTML = (scripts, links) => `
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8" />
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 <title>Esbuild App</title>
 ${links.join('\n')}
</head>
<body>
 <div id="root"></div>
 ${scripts.join('\n')}
</body>
</html>
`
```

现在我们在 build.js 中引入 html 插件:

```js
const html = require("./html-plugin");
// esbuild 配置
plugins: [
 // 省略其它插件
 html()
],
```

然后执行 node build.js 对项目进行打包，你就可以看到 index.html 已经成功输出到根目录。接着，我们通过 serve 起一个本地静态文件服务器:

```shell
// 1. 全局安装 serve
npm i -g serve
// 2. 在项目根目录执行
serve .
```

可以看到如下界面：

![Snipaste_2023-11-08_15-43-20.png](https://s2.loli.net/2023/11/08/j2CNo9cTG6HtBE1.png)

再访问 localhost:3000 ，会默认访问到 index.html 的内容：

![Snipaste_2023-11-08_15-44-40.png](https://s2.loli.net/2023/11/08/3lmhEf168jduRJY.png)

这样一来，应用的内容就成功显示了，也说明 HTML 插件正常生效了。当然，如果要做一个足够通用的 HTML 插件，还需要考虑诸多的因素，比如 `自定义 HTML 内容` 、 `自定义公共前缀(publicPath)` 、 `自定义 script 标签类型` 以及 `多入口打包 ` 等等，大家感兴趣的话可以自行扩展。(可参考这个[开源插件](https://github.com/sanyuan0704/ewas/blob/main/packages/esbuild-plugin-html/src/index.ts)))

### Rollup 打包的基本概念

#### 快速上手

首先让我们用 `npm init -y` 新建一个项目，然后安装 `rollup` 依赖：

```shell
pnpm init

pmpm i rollup
```

接着新增 src/index.js 和 src/util.js 和 rollup.config.js 三个文件，目录结构如下所示:

```txt
├── package.json
├── pnpm-lock.yaml
├── rollup.config.js
└── src
 ├── index.js
 └── util.js
```

文件的内容分别如下：

```js
// src/index.js
import { add } from './util'
console.log(add(1, 2))

// src/util.js
export const add = (a, b) => a + b
export const multi = (a, b) => a * b

// rollup.config.js
// 以下注释是为了能使用 VSCode 的类型提示
/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
  input: ['src/index.js'],
  output: {
    // 产物输出目录
    dir: 'dist/es',
    // 产物格式
    format: 'esm'
  }
}
export default buildOptions
```

你可以在 `package.json` 中加入如下的构建脚本：

```json
{
  // rollup 打包命令，`-c` 表示使用配置文件中的配置
  "build": "rollup -c"
}
```

接着在终端执行一下 npm run build ，可以看到如下的命令行信息:

![Snipaste_2023-11-08_10-25-53.png](https://s2.loli.net/2023/11/08/KfimCLRQehSX2pd.png)

OK，现在你已经成功使用 Rollup 打出了第一份产物! 我们可以去 dist/es 目录查看一下产物的内容:

```js
// dist/es/index.js
const add = (a, b) => a + b

console.log(add(1, 2))
```

同时你也可以发现， `util.js ` 中的 `multi` 方法并没有被打包到产物中，这是因为 Rollup 具有天然的 `Tree Shaking` 功能，可以分析出未使用到的模块并自动擦除。

所谓 `Tree Shaking` (摇树)，也是计算机编译原理中 `DCE` (Dead Code Elimination，即消除无用代码) 技术的一种实现。由于 ES 模块依赖关系是确定的，和运行时状态无关。因此 Rollup 可以在编译阶段分析出依赖关系，对 AST 语法树中没有使用到的节点进行删除，从而实现 Tree Shaking。

#### 常用配置解读

##### 1.多产物配置

在打包 JavaScript 类库的场景中，我们通常需要对外暴露出不同格式的产物供他人使用，不仅包括 `ESM` ，也需要包括诸如 `CommonJS` 、 `UMD` 等格式，保证良好的兼容性。那么，同一份入口文件，如何让 Rollup 给我们打包出不一样格式的产物呢？我们基于上述的配置文件来进行修改:

```js
// rollup.config.js
/**
 * @type { import('rollup').RollupOptions }
 */

const buildOptions = {
  input: ['src/index.js'],
  output: [
    {
      dir: 'dist/es',
      format: 'esm'
    },
    {
      dir: 'dist/cjs',
      format: 'cjs'
    }
  ]
}

export default buildOptions
```

从代码中可以看到，我们将 output 属性配置成一个数组，数组中每个元素都是一个描述对象，决定了不同产物的输出行为。

##### 2.多入口配置

除了多产物配置，Rollup 中也支持多入口配置，而且通常情况下两者会被结合起来使用。接下来，就让我们继续改造之前的配置文件，将 input 设置为一个数组或者一个对象，如下所示:

```js
{
 input: ["src/index.js", "src/util.js"]
}
// 或者
{
 input: {
 index: "src/index.js",
 util: "src/util.js",
 },
}
```

通过执行 npm run build 可以发现，所有入口的不同格式产物已经成功输出:

![Snipaste_2023-11-08_10-34-12.png](https://s2.loli.net/2023/11/08/nC3BDP4ydL5iafs.png)

如果不同入口对应的打包配置不一样，我们也可以默认导出一个配置数组，如下所示：

```js
// rollup.config.js
/**
 * @type { import('rollup').RollupOptions }
 */
const buildIndexOptions = {
  input: ['src/index.js'],
  output: [
    // 省略 output 配置
  ]
}
/**
 * @type { import('rollup').RollupOptions }
 */
const buildUtilOptions = {
  input: ['src/util.js'],
  output: [
    // 省略 output 配置
  ]
}
export default [buildIndexOptions, buildUtilOptions]
```

如果是比较复杂的打包场景(如 [Vite 源码本身的打包](https://github.com/vitejs/vite/blob/main/packages/vite/rollup.config.ts))，我们需要将项目的代码分成几个部分，用不同的 Rollup 配置分别打包，这种配置就很有用了。

##### 3.自定义 output 配置

刚才我们提到了 input 的使用，主要用来声明入口，可以配置成字符串、数组或者对象，使用比较简单。而 output 与之相对，用来配置输出的相关信息，常用的配置项如下:

```js
output: {
 // 产物输出目录
 dir: path.resolve(__dirname, 'dist'),
 // 以下三个配置项都可以使用这些占位符:
 // 1. [name]: 去除文件后缀后的文件名
 // 2. [hash]: 根据文件名和文件内容生成的 hash 值
 // 3. [format]: 产物模块格式，如 es、cjs
 // 4. [extname]: 产物后缀名(带`.`)
 // 入口模块的输出文件名
 entryFileNames: `[name].js`,
 // 非入口模块(如动态 import)的输出文件名
 chunkFileNames: 'chunk-[hash].js',
 // 静态资源文件输出文件名
 assetFileNames: 'assets/[name]-[hash][extname]',
 // 产物输出格式，包括`amd`、`cjs`、`es`、`iife`、`umd`、`system`
 format: 'cjs',
 // 是否生成 sourcemap 文件
 sourcemap: true,
 // 如果是打包出 iife/umd 格式，需要对外暴露出一个全局变量，通过 name 配置变量名
 name: 'MyBundle',
 // 全局变量声明
 globals: {
 // 项目中可以直接用`$`代替`jquery`
 jquery: '$'
 }
}
```

##### 4.依赖 external

对于某些第三方包，有时候我们不想让 Rollup 进行打包，也可以通过 external 进行外部化：

```js
{
  external: ['react', 'react-dom']
}
```

##### 5.接入插件能力

在 Rollup 的日常使用中，我们难免会遇到一些 Rollup 本身不支持的场景，比如 `兼容CommonJS 打包`、`注入环境变量`、`配置路径别名`、`压缩产物代码` 等等。这个时候就需要我们引入相应的 Rollup 插件了。接下来以一个具体的场景为例带大家熟悉一下 Rollup 插件的使用。

虽然 Rollup 能够打包 `输出` 出 `CommonJS` 格式的产物，但对于 `输入` 给 Rollup 的代码并不支持 CommonJS，仅仅支持 ESM。你可能会说，那我们直接在项目中统一使用 ESM 规范就可以了啊，这有什么问题呢？需要注意的是，我们不光要考虑项目本身的代码，还要考虑第三方依赖。目前为止，还是有不少第三方依赖只有 CommonJS 格式产物而并未提供 ESM 产物，比如项目中用到 `lodash` 时，打包项目会出现这样的报错：

![Snipaste_2023-11-08_10-41-07.png](https://s2.loli.net/2023/11/08/P5GQo8kOnUtDwB2.png)

因此，我们需要引入额外的插件去解决这个问题。

首先需要安装两个核心的插件包:

```shell
pnpm i @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

- `@rollup/plugin-node-resolve ` 是为了允许我们加载第三方依赖，否则像 `import React from 'react'` 的依赖导入语句将不会被 Rollup 识别。
- `@rollup/plugin-commonjs` 的作用是将 CommonJS 格式的代码转换为 ESM 格式

然后让我们在配置文件中导入这些插件:

```js
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
/**
 * @type { import('rollup').RollupOptions }
 */
export default {
  input: ['src/index.js'],
  output: [
    {
      dir: 'dist/es',
      format: 'esm'
    },
    {
      dir: 'dist/cjs',
      format: 'cjs'
    }
  ],
  // 通过 plugins 参数添加插件
  plugins: [resolve(), commonjs()]
}
```

现在我们以 `lodash` 这个只有 CommonJS 产物的第三方包为例测试一下:

```shell
pnpm i lodash
```

在 `src/index.js` 加入如下的代码:

```js
import { merge } from 'lodash'

console.log(merge)
```

然后执行 npm run build ，你可以发现产物已经正常生成了：

![Snipaste_2023-11-08_10-49-23.png](https://s2.loli.net/2023/11/08/AjnbkUvi2qV1Gep.png)

在 Rollup 配置文件中， `plugins` 除了可以与 `output` 配置在同一级，也可以配置在 output 参数里面，如:

```js
// rollup.config.js
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
export default {
  output: {
    // 加入 terser 插件，用来压缩代码
    plugins: [terser()]
  },
  plugins: [resolve(), commonjs()]
}
```

> 当然，你可以将上述的 terser 插件放到最外层的 plugins 配置中。

需要注意的是， `output.plugins` 中配置的插件是有一定限制的，只有使用 `Output 阶段` 相关钩子(具体内容将在下一节展开)的插件才能够放到这个配置中，大家可以去[这个站点](https://github.com/rollup/awesome#output)查看 Rollup 的 Output 插件列表。

另外，这里也给大家分享其它一些比较常用的 Rollup 插件库:

- [@rollup/plugin-json](https://github.com/rollup/plugins/tree/master/packages/json)： 支持 `.json` 的加载，并配合 `rollup` 的 `Tree Shaking` 机制去掉未使用的部分，进行按需打包。
- [@rollup/plugin-babel](https://github.com/rollup/plugins/tree/master/packages/babel):在 Rollup 中使用 Babel 进行 JS 代码的语法转译。
- [@rollup/plugin-typescript](https://github.com/rollup/plugins/tree/master/packages/typescript): 支持使用 TypeScript 开发。
- [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias)：支持别名配置。
- [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace)：在 Rollup 进行变量字符串的替换。
- [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer): 对 Rollup 打包产物进行分析，自动生成产物体积可视化分析图。

#### JS API 方式调用

以上我们通过 `Rollup` 的配置文件结合 `rollup -c ` 完成了 Rollup 的打包过程，但有些场景下我们需要基于 Rollup 定制一些打包过程，配置文件就不够灵活了，这时候我们需要用到对应 JavaScript API 来调用 Rollup，主要分为 `rollup.rollup` 和 `rollup.watch` 两个 API，接下来我们以具体的例子来学习一下。

首先是 `rollup.rollup` ，用来一次性地进行 Rollup 打包，你可以新建 `build.js `，内容如下:

```js
// build.js
const rollup = require('rollup')
// 常用 inputOptions 配置
const inputOptions = {
  input: './src/index.js',
  external: [],
  plugins: []
}
const outputOptionsList = [
  // 常用 outputOptions 配置
  {
    dir: 'dist/es',
    entryFileNames: `[name].[hash].js`,
    chunkFileNames: 'chunk-[hash].js',
    assetFileNames: 'assets/[name]-[hash][extname]',
    format: 'es',
    sourcemap: true,
    globals: {
      lodash: '_'
    }
  }
  // 省略其它的输出配置
]
async function build() {
  let bundle
  let buildFailed = false
  try {
    // 1. 调用 rollup.rollup 生成 bundle 对象
    bundle = await rollup.rollup(inputOptions)
    for (const outputOptions of outputOptionsList) {
      // 2. 拿到 bundle 对象，根据每一份输出配置，调用 generate 和 write 方法分别生成和写入产物
      const { output } = await bundle.generate(outputOptions)
      await bundle.write(outputOptions)
    }
  } catch (error) {
    buildFailed = true
    console.error(error)
  }
  if (bundle) {
    // 最后调用 bundle.close 方法结束打包
    await bundle.close()
  }
  process.exit(buildFailed ? 1 : 0)
}
build()
```

主要的执行步骤如下：

- 通过 `rollup.rollup` 方法，传入 `inputOptions` ，生成 bundle 对象
- 调用 bundle 对象的 generate 和 write 方法，传入 `outputOptions` ，分别完成产物和生成和磁盘写入。
- 调用 bundle 对象的 close 方法来结束打包。

接着你可以执行 node build.js ，这样，我们就可以完成了以编程的方式来调用 Rollup 打包的过程。

除了通过 `rollup.rollup` 完成一次性打包，我们也可以通过 `rollup.watch` 来完成 `watch` 模式下的打包，即每次源文件变动后自动进行重新打包。你可以新建 `watch.js` 文件，内容入下:

```js
// watch.js
const rollup = require('rollup')
const watcher = rollup.watch({
  // 和 rollup 配置文件中的属性基本一致，只不过多了`watch`配置
  input: './src/index.js',
  output: [
    {
      dir: 'dist/es',
      format: 'esm'
    },
    {
      dir: 'dist/cjs',
      format: 'cjs'
    }
  ],
  watch: {
    exclude: ['node_modules/**'],
    include: ['src/**']
  }
})
// 监听 watch 各种事件
watcher.on('restart', () => {
  console.log('重新构建...')
})
watcher.on('change', id => {
  console.log('发生变动的模块id: ', id)
})
watcher.on('event', e => {
  if (e.code === 'BUNDLE_END') {
    console.log('打包信息:', e)
  }
})
```

现在你可以通过执行 node watch.js 开启 Rollup 的 watch 打包模式，当你改动一个文件后可以看到如下的日志，说明 Rollup 自动进行了重新打包，并触发相应的事件回调函数:

```txt
发生生变动的模块id: /xxx/src/index.js
重新构建...
打包信息: {
 code: 'BUNDLE_END',
 duration: 10,
 input: './src/index.js',
 output: [
 // 输出产物路径
 ],
 result: {
 cache: { /* 产物具体信息 */ },
 close: [AsyncFunction: close],
 closed: false,
 generate: [AsyncFunction: generate],
 watchFiles: [
 // 监听文件列表
 ],
 write: [AsyncFunction: write]
 }
}
```

基于如上的两个 JavaScript API 我们可以很方便地在代码中调用 Rollup 的打包流程，相比于配置文件有了更多的操作空间，你可以在代码中通过这些 API 对 Rollup 打包过程进行定制，甚至是二次开发。

#### Rollup 插件机制

仅仅使用 Rollup 内置的打包能力很难满足项目日益复杂的构建需求。对于一个真实的项目构建场景来说，我们还需要考虑到 `模块打包` 之外的问题，比如路径别名(alias) 、全局变量注入和代码压缩等等。

可要是把这些场景的处理逻辑与核心的打包逻辑都写到一起，一来打包器本身的代码会变得十分臃肿，二来也会对原有的核心代码产生一定的侵入性，混入很多与核心流程无关的代码，不易于后期的维护。因此，Rollup 设计出了一套完整的 `插件机制`，将自身的核心逻辑与插件逻辑分离，让你能按需引入插件功能，提高了 Rollup 自身的可扩展性。

Rollup 的打包过程中，会定义一套完整的构建生命周期，从开始打包到产物输出，中途会经历一些 `标志性的阶段`，并且在不同阶段会自动执行对应的插件钩子函数(Hook)。对 Rollup 插件来讲，最重要的部分是钩子函数，一方面它定义了插件的执行逻辑，也就是"做什么"；另一方面也声明了插件的作用阶段，即"什么时候做"，这与 Rollup 本身的构建生命周期息息相关。

##### Rollup 整体构建阶段

在执行 `rollup` 命令之后，在 cli 内部的主要逻辑简化如下:

```js
// Build 阶段
const bundle = await rollup.rollup(inputOptions)
// Output 阶段
await Promise.all(outputOptions.map(bundle.write))
// 构建结束
await bundle.close()
```

Rollup 内部主要经历了 `Build` 和 `Output` 两大阶段：

![Snipaste_2023-11-08_11-23-16.png](https://s2.loli.net/2023/11/08/gLd7bPGlIJjwpCx.png)

首先，Build 阶段主要负责创建模块依赖图，初始化各个模块的 AST 以及模块之间的依赖关系。下面我们用一个简单的例子来感受一下:

```js
// src/index.js
import { a } from './module-a'
console.log(a)
// src/module-a.js
export const a = 1
```

然后执行如下的构建脚本:

```js
const rollup = require('rollup')
const util = require('util')
async function build() {
  const bundle = await rollup.rollup({
    input: ['./src/index.js']
  })
  console.log(util.inspect(bundle))
}
build()
```

可以看到这样的 bundle 对象信息：

```js
{
 cache: {
 modules: [
 {
 ast: 'AST 节点信息，具体内容省略',
 code: 'export const a = 1;',
 dependencies: [],
 id: '/Users/code/rollup-demo/src/data.js',
 // 其它属性省略
 },
 {
 ast: 'AST 节点信息，具体内容省略',
 code: "import { a } from './data';\n\nconsole.log(a);",
 dependencies: [
 '/Users/code/rollup-demo/src/data.js'
 ],
 id: '/Users/code/rollup-demo/src/index.js',
 // 其它属性省略
 }
 ],
 plugins: {}
 },
 closed: false,
 // 挂载后续阶段会执行的方法
 close: [AsyncFunction: close],
 generate: [AsyncFunction: generate],
 write: [AsyncFunction: write]
}
```

从上面的信息中可以看出，目前经过 Build 阶段的 `bundle` 对象其实并没有进行模块的打包，这个对象的作用在于存储各个模块的内容及依赖关系，同时暴露 `generate` 和 `write` 方法，以进入到后续的 `Output` 阶段（ `write` 和 `generate` 方法唯一的区别在于前者打包完产物会写入磁盘，而后者不会）。

所以，真正进行打包的过程会在 `Output` 阶段进行，即在 `bundle` 对象的 `generate` 或者 `write` 方法中进行。还是以上面的 demo 为例，我们稍稍改动一下构建逻辑:

```js
const rollup = require('rollup')
async function build() {
  const bundle = await rollup.rollup({
    input: ['./src/index.js']
  })
  const result = await bundle.generate({
    format: 'es'
  })
  console.log('result:', result)
}
build()
```

执行后可以得到如下的输出:

```js
{
  output: [
    {
      exports: [],
      facadeModuleId: '/Users/code/rollup-demo/src/index.js',
      isEntry: true,
      isImplicitEntry: false,
      type: 'chunk',
      code: 'const a = 1;\n\nconsole.log(a);\n',
      dynamicImports: [],
      fileName: 'index.js'
      // 其余属性省略
    }
  ]
}
```

这里可以看到所有的输出信息，生成的 `output` 数组即为打包完成的结果。当然，如果使用 `bundle.write` 会根据配置将最后的产物写入到指定的磁盘目录中。

因此，**对于一次完整的构建过程而言， Rollup 会先进入到 Build 阶段，解析各模块的内容及依赖关系，然后进入 `Output` 阶段，完成打包及输出的过程**。对于不同的阶段，Rollup 插件会有不同的插件工作流程，接下来我们就来拆解一下 Rollup 插件在 Build 和 Output 两个阶段的详细工作流程。

##### 拆解插件工作流

###### 谈谈插件 Hook 类型

在具体讲述 Rollup 插件工作流之前，我想先给大家介绍一下不同插件 Hook 的类型，这些类型代表了不同插件的执行特点，是我们理解 Rollup 插件工作流的基础，因此有必要跟大家好好拆解一下。

通过上文的例子，相信你可以直观地理解 Rollup 两大构建阶段（ `Build` 和 `Output` ）各自的原理。可能你会有疑问，这两个阶段到底跟插件机制有什么关系呢？实际上，插件的各种 Hook 可以根据这两个构建阶段分为两类: `Build Hook ` 与 `Output Hook` 。

- `Build Hook` 即在 `Build` 阶段执行的钩子函数，在这个阶段主要进行模块代码的转换、AST 解析以及模块依赖的解析，那么这个阶段的 Hook 对于代码的操作粒度一般为 `模块` 级别，也就是单文件级别。
- `Ouput Hook` (官方称为 `Output Generation Hook` )，则主要进行代码的打包，对于代码而言，操作粒度一般为 chunk 级别(一个 `chunk` 通常指很多文件打包到一起的产物)

除了根据构建阶段可以将 Rollup 插件进行分类，根据不同的 Hook 执行方式也会有不同的分类，主要包括 `Async` 、 `Sync` 、 `Parallel` 、 `Squential` 、 `First` 这五种。在后文中我们将接触各种各样的插件 Hook，但无论哪个 Hook 都离不开这五种执行方式。

###### 1.Async&Sync

首先是 `Async` 和 `Sync` 钩子函数，两者其实是相对的，分别代表 `异步` 和 `同步` 的钩子函数，两者最大的区别在于同步钩子里面不能有异步逻辑，而异步钩子可以有。

###### 2.Parallel

这里指并行的钩子函数。如果有多个插件实现了这个钩子的逻辑，一旦有钩子函数是异步逻辑，则并发执行钩子函数，不会等待当前钩子完成(底层使用 Promise.all )。

比如对于 `Build` 阶段的 `buildStart` 钩子，它的执行时机其实是在构建刚开始的时候，各个插件可以在这个钩子当中做一些状态的初始化操作，但其实插件之间的操作并不是相互依赖的，也就是可以并发执行，从而提升构建性能。反之，对于需要依赖其他插件处理结果的情况就不适合用 `Parallel` 钩子了，比如 `transform` 。

###### 3.Sequential

**Sequential** 指串行的钩子函数。这种 Hook 往往适用于插件间处理结果相互依赖的情况，前一个插件 Hook 的返回值作为后续插件的入参，这种情况就需要等待前一个插件执行完 Hook，获得其执行结果，然后才能进行下一个插件相应 Hook 的调用，如 `transform` 。

###### 4.First

如果有多个插件实现了这个 Hook，那么 Hook 将依次运行，直到返回一个非 null 或非 undefined 的值为止。比较典型的 Hook 是 `resolveId` ，一旦有插件的 resolveId 返回一个路径，将停止执行后续插件的 resolveId 逻辑。

刚刚我们介绍了 Rollup 当中不同插件 Hook 的类型，实际上不同的类型是可以叠加的， `Async` / `Sync` 可以搭配后面三种类型中的任意一种，比如一个 Hook 既可以是 `Async` 也可以是 `First` 类型，接着我们将来具体分析 Rollup 当中的插件工作流程，里面会涉及到具体的一些 Hook，大家可以具体地感受一下。

###### Build 阶段工作流

首先，我们来分析 Build 阶段的插件工作流程。对于 Build 阶段，插件 Hook 的调用流程如下图所示。流程图的最上面声明了不同 Hook 的类型，也就是我们在上面总结的 5种 Hook 分类，每个方块代表了一个 Hook，边框的颜色可以表示 Async 和 Sync 类型，方块的填充颜色可以表示 `Parallel` 、 `Sequential` 和 `First` 类型。

![图片.png](https://s2.loli.net/2023/11/08/V8mzwpK1WXkrRTh.png)

乍一看是不是感觉这张图非常复杂？没关系，接下来我会和你一步步分析 `Build Hooks` 的工作流程，你可以对照着图一起看。

- 首先经历 `options` 钩子进行配置的转换，得到处理后的配置对象。
- 随之 Rollup 会调用 `buildStart` 钩子，正式开始构建流程。
- Rollup 先进入到 `resolveId` 钩子中解析文件路径。(从 `input` 配置指定的入口文件开始)。
- Rollup 通过调用 `load` 钩子加载模块内容。
- 紧接着 Rollup 执行所有的 `transform` 钩子来对模块内容进行进行自定义的转换，比如 babel 转译。
- 现在 Rollup 拿到最后的模块内容，进行 AST 分析，得到所有的 import 内容，调用 moduleParsed 钩子:
  - **6.1** 如果是普通的 import，则执行 `resolveId` 钩子，继续回到步骤 3 。
  - **6.2** 如果是动态 import，则执行 `resolveDynamicImport` 钩子解析路径，如果解析成功，则回到步骤 `4` 加载模块，否则回到步骤 `3` 通过 `resolveId` 解析路径。
- 直到所有的 import 都解析完毕，Rollup 执行 buildEnd 钩子，Build 阶段结束。

当然，在 Rollup 解析路径的时候，即执行 `resolveId` 或者 `resolveDynamicImport` 的时候，有些路径可能会被标记为 `external` (翻译为 `排除` )，也就是说不参加 Rollup 打包过程，这个时候就不会进行 `load` 、 `transform` 等等后续的处理了。

在流程图最上面，不知道大家有没有注意到 `watchChange` 和 `closeWatcher` 这两个 Hook，这里其实是对应了 rollup 的 `watch` 模式。当你使用 `rollup --watch` 指令或者在配置文件配有 `watch: true` 的属性时，代表开启了 Rollup 的 `watch` 打包模式，这个时候 Rollup 内部会初始化一个 `watcher` 对象，当文件内容发生变化时，watcher 对象会自动触发 `watchChange` 钩子执行并对项目进行重新构建。在当前打包过程结束时，Rollup 会自动清除 watcher 对象调用 `closeWacher` 钩子。

###### Output 阶段工作流

好，接着我们来看看 Output 阶段的插件到底是如何来进行工作的。这个阶段的 Hook 相比于 Build 阶段稍微多一些，流程上也更加复杂。需要注意的是，其中会涉及的 Hook 函数比较多，可能会给你理解整个流程带来一些困扰，因此我会在 Hook 执行的阶段解释其大致的作用和意义，关于具体的使用大家可以去 Rollup 的官网自行查阅，毕竟这里的主线还是分析插件的执行流程，掺杂太多的使用细节反而不易于理解。下面我结合一张完整的插件流程图和你具体分析一下：

![dsadasddasdjlask.png](https://s2.loli.net/2023/11/08/JQXedf4gNlxFYrc.png)

![dsadsadsafe.png](https://s2.loli.net/2023/11/08/QxcDwsAOrlzmqdL.png)

执行所有插件的 `outputOptions` 钩子函数，对 `output` 配置进行转换。

执行 `renderStart` ，并发执行 renderStart 钩子，正式开始打包。

并发执行所有插件的 `banner` 、 `footer` 、 `intro` 、 `outro` 钩子(底层用 Promise.all 包裹所有的这四种钩子函数)，这四个钩子功能很简单，就是往打包产物的固定位置(比如头部和尾部)插入一些自定义的内容，比如协议声明内容、项目介绍等等。

从入口模块开始扫描，针对动态 import 语句执行 `renderDynamicImport` 钩子，来自定义动态 import 的内容。

对每个即将生成的 chunk ，执行 augmentChunkHash 钩子，来决定是否更改 chunk 的哈希值，在 watch 模式下即可能会多次打包的场景下，这个钩子会比较适用。

如果没有遇到 import.meta 语句，则进入下一步，否则:

- **6.1** 对于 `import.meta.url` 语句调用 `resolveFileUrl` 来自定义 url 解析逻辑
- 6.2 对于其他 `import.meta` 属性，则调用 `resolveImportMeta` 来进行自定义的解析。

接着 Rollup 会生成所有 chunk 的内容，针对每个 chunk 会依次调用插件的 `renderChunk` 方法进行自定义操作，也就是说，在这里时候你可以直接操作打包产物了。

随后会调用 `generateBundle` 钩子，这个钩子的入参里面会包含所有的打包产物信息，包括 `chunk` (打包后的代码)、 `asset` (最终的静态资源文件)。你可以在这里删除一些 chunk 或者 asset，最终这些内容将不会作为产物输出。

前面提到了 `rollup.rollup` 方法会返回一个 `bundle` 对象，这个对象是包含 `generate` 和 `write` 两个方法，两个方法唯一的区别在于后者会将代码写入到磁盘中，同时会触发 `writeBundle` 钩子，传入所有的打包产物信息，包括 chunk 和 asset，和 `generateBundle` 钩子非常相似。不过值得注意的是，这个钩子执行的时候，产物已经输出了，而 generateBundle 执行的时候产物还并没有输出。顺序如下图所示：

![Snipaste_2023-11-08_15-57-10.png](https://s2.loli.net/2023/11/08/Svy39cVbPleaz8X.png)

当上述的 `bundle` 的 `close` 方法被调用时，会触发 `closeBundle` 钩子，到这里 Output 阶段正式结束。

> 注意: 当打包过程中任何阶段出现错误，会触发 renderError 钩子，然后执行 closeBundle 钩子结束打包。

#### 常用 Hook

> 实际上开发 Rollup 插件就是在编写一个个 Hook 函数，你可以理解为一个 Rollup 插件基本就是各种 Hook 函数的组合。因此，接下来我会详细介绍一些常用的 Hook，并以一些官方的插件实现为例，从 Hook 的特性、应用场景、入参和返回值的意义及实现代码示例这几个角度带你掌握各种 Hook 实际的使用

##### 路径解析 resolveld

resolveId 钩子一般用来解析模块路径，为 `Async + First` 类型即 `异步优先` 的钩子。这里我们拿官方的 [alias 插件](https://github.com/rollup/plugins/blob/master/packages/alias/src/index.ts) 来说明，这个插件用法演示如下:

```js
// rollup.config.js
import alias from '@rollup/plugin-alias'
module.exports = {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [
    alias({
      entries: [
        // 将把 import xxx from 'module a'
        // 将把 import xxx from module-a
        // 转换为 import xxx from './module-a'
        { find: 'module-a', replacement: './module-a.js' }
      ]
    })
  ]
}
```

插件的代码简化后如下:

```js
export default alias(options) {
  // 获取 entries 配置
  const entries = getEntries(options)
  return {
    // 传入三个参数，当前模块路径、引用当前模块的模块路径、其余参数
    resolveId(importee, importer, resolveOptions) {
      // 先检查能不能匹配别名规则
      const matchedEntry = entries.find((entry) =>
        matches(entry.find, importee)
      )
      // 如果不能匹配替换规则，或者当前模块是入口模块，则不会继续后面的别名替换流程
      if (!matchedEntry || !importerId) {
        // return null 后，当前的模块路径会交给下一个插件处理
        return null
      }
      // 正式替换路径
      const updatedId = normalizeId(
        importee.replace(matchedEntry.find, matchedEntry.replacement)
      )
      // 每个插件执行时都会绑定一个上下文对象作为 this
      // 这里的 this.resolve 会执行所有插件(除当前插件外)的 resolveId 钩子
      return this.resolve(
        updatedId,
        importer,
        Object.assign({ skipSelf: true }, resolveOptions)
      ).then((resolved) => {
        // 替换后的路径即 updateId 会经过别的插件进行处理
        let finalResult: PartialResolvedId | null = resolved
        if (!finalResult) {
          // 如果其它插件没有处理这个路径，则直接返回 updateId
          finalResult = { id: updatedId }
        }
        return finalResult
      })
    },
  }
}
```

从这里你可以看到 resolveId 钩子函数的一些常用使用方式，它的入参分别是 `当前模块路径` 、 `引用当前模块的模块路径` 、 `解析参数` ，返回值可以是 null、string 或者一个对象，我们分情况讨论。

- 返回值为 null 时，会默认交给下一个插件的 resolveId 钩子处理
- 返回值为 string 时，则停止后续插件的处理。这里为了让替换后的路径能被其他插件处理，特意调用了 this.resolve 来交给其它插件处理，否则将不会进入到其它插件的处理。
- 返回值为一个对象，也会停止后续插件的处理，不过这个对象就可以包含[更多的信息](https://rollupjs.org/plugin-development/#resolveid)了，包括解析后的路径、是否被 enternal、是否需要 tree-shaking 等等，不过大部分情况下返回一个 string 就够用了。

##### load

load 为 `Async + First` 类型，即 `异步优先` 的钩子，和 resolveId 类似。它的作用是通过 resolveId 解析后的路径来加载模块内容。这里，我们以官方的 [image 插件](https://github.com/rollup/plugins/blob/master/packages/image/src/index.js)为例来介绍一下 load 钩子的使用。源码简化后如下所示:

```js
const mimeTypes = {
  '.jpg': 'image/jpeg'
  // 后面图片类型省略
}
export default function image(opts = {}) {
  const options = Object.assign({}, defaults, opts)
  return {
    name: 'image',
    load(id) {
      const mime = mimeTypes[extname(id)]
      if (!mime) {
        // 如果不是图片类型，返回 null，交给下一个插件处理
        return null
      }
      // 加载图片具体内容
      const isSvg = mime === mimeTypes['.svg']
      const format = isSvg ? 'utf-8' : 'base 64'
      const source = readFileSync(id, format).replace(/[\r\n]+/gm, '')
      const dataUri = getDataUri({ format, isSvg, mime, source })
      const code = options.dom ? domTemplate({ dataUri }) : constTemplate({ dataUri })
      return code.trim()
    }
  }
}
```

从中可以看到，load 钩子的入参是模块 id，返回值一般是 null、string 或者一个对象：

- 如果返回值为 null，则交给下一个插件处理
- 如果返回值为 string 或者对象，则终止后续插件的处理，如果是对象可以包含 SourceMap、AST 等[更详细的信息](https://rollupjs.org/plugin-development/#load)。

##### 代码转换 transform

`transform` 钩子也是非常常见的一个钩子函数，为 `Async + Sequential` 类型，也就是 `异步串行` 钩子，作用是对加载后的模块内容进行自定义的转换。我们以官方的 `replace` 插件为例，这个插件的使用方式如下:

```js
// rollup.config.js
import replace from '@rollup/plugin-replace'
module.exports = {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [
    // 将会把代码中所有的 __TEST__ 替换为 1
    replace({
      __TEST__: 1
    })
  ]
}
```

内部实现也并不复杂，主要通过字符串替换来实现，核心逻辑简化如下:

```js
import MagicString from 'magic-string'
export default function replace(options = {}) {
  return {
    name: 'replace',
    transform(code, id) {
      // 省略一些边界情况的处理
      // 执行代码替换的逻辑，并生成最后的代码和 SourceMap
      return executeReplacement(code, id)
    }
  }
}
function executeReplacement(code, id) {
  const magicString = new MagicString(code)
  // 通过 magicString.overwrite 方法实现字符串替换
  if (!codeHasReplacements(code, id, magicString)) {
    return null
  }
  const result = { code: magicString.toString() }
  if (isSourceMapEnabled()) {
    result.map = magicString.generateMap({ hires: true })
  }
  // 返回一个带有 code 和 map 属性的对象
  return result
}
```

[transform 钩子](https://rollupjs.org/plugin-development/#transform)的入参分别为模块代码、模块 ID ，返回一个包含 code (代码内容)和 map (SourceMap 内容) 属性的对象，当然也可以返回 null 来跳过当前插件的 transform 处理。需要注意的是，**当前插件返回的代码会作为下一个插件 transform 钩子的第一个入参**，实现类似于瀑布流的处理。

##### Chunk 级代码修改: renderChunk

这里我们继续以 replace 插件举例，在这个插件中，也同样实现了 renderChunk 钩子函数:

```js
export default function replace(options = {}) {
  return {
    name: 'replace',
    transform(code, id) {
      // transform 代码省略
    },
    renderChunk(code, chunk) {
      const id = chunk.fileName
      // 省略一些边界情况的处理
      // 拿到 chunk 的代码及文件名，执行替换逻辑
      return executeReplacement(code, id)
    }
  }
}
```

可以看到这里 replace 插件为了替换结果更加准确，在 renderChunk 钩子中又进行了一次替换，因为后续的插件仍然可能在 transform 中进行模块内容转换，进而可能出现符合替换规则的字符串。

这里我们把关注点放到 renderChunk 函数本身，可以看到有两个入参，分别为 `chunk 代码内容`、[chunk 元信息](https://rollupjs.org/plugin-development/#generatebundle)，返回值跟 `transform` 钩子类似，既可以返回包含 code 和 map 属性的对象，也可以通过返回 null 来跳过当前钩子的处理。

##### 产物生成最后一步: generateBundle

generateBundle 也是 `异步串行` 的钩子，你可以在这个钩子里面自定义删除一些无用的 chunk 或者静态资源，或者自己添加一些文件。这里我们以 Rollup 官方的 `html` 插件来具体说明，这个插件的作用是通过拿到 Rollup 打包后的资源来生成包含这些资源的 HTML 文件，源码简化后如下所示:

```js
export default function html(opts: RollupHtmlOptions = {}): Plugin {
 // 初始化配置
 return {
 name: 'html',
 async generateBundle(output: NormalizedOutputOptions, bundle: OutputBundle) {
 // 省略一些边界情况的处理
 // 1. 获取打包后的文件
 const files = getFiles(bundle);
 // 2. 组装 HTML，插入相应 meta、link 和 script 标签
 const source = await template({ attributes, bundle, files, meta, publicPath, title});
 // 3. 通过上下文对象的 emitFile 方法，输出 html 文件
 const htmlFile: EmittedAsset = {
 type: 'asset',
 source,
 name: 'Rollup HTML Asset',
 fileName
 };
 this.emitFile(htmlFile);
 }
 }
}
```

相信从插件的具体实现中，你也能感受到这个钩子的强大作用了。入参分别为 `output 配置` 、[所有打包产物的元信息对象](https://rollupjs.org/plugin-development/#generatebundle)，通过操作元信息对象你可以删除一些不需要的 chunk 或者静态资源，也可以通过插件上下文对象的 `emitFile` 方法输出自定义文件。
