---
title:
---

# vite 源码阅读

## 配置文件在 Vite 内部的处理

### 流程梳理

我们先来梳理整体的流程，Vite 中的配置解析由 [resolveConfig](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/config.ts#L255) 函数来实现，你可以对照源码一起学习。

#### 1.加载配置文件

进行一些必要的变量声明后，我们进入到解析配置逻辑中：

```js
let { configFile } = config
if (configFile !== false) {
  // 默认都会走到下面加载配置文件的逻辑，除非你手动指定 configFile 为 false
  const loadResult = await loadConfigFromFile(configEnv, configFile, config.root, config.logLevel)
  if (loadResult) {
    // 解析配置文件的内容后，和命令行配置合并
    config = mergeConfig(loadResult.config, config)
    configFile = loadResult.path
    configFileDependencies = loadResult.dependencies
  }
}
```

第一步是解析配置文件的内容(这部分比较复杂，本文后续单独分析)，然后与命令行配置合并。值得注意的是，后面有一个记录 `configFileDependencies` 的操作。因为配置文件代码可能会有第三方库的依赖，所以当第三方库依赖的代码更改时，Vite 可以通过 HMR 处理逻辑中记录的 `configFileDependencies` 检测到更改，再重启 DevServer ，来保证当前生效的配置永远是最新的。

#### 2.解析用户插件

第二个重点环节是解析用户插件。首先，我们通过 `apply 参数` 过滤出需要生效的用户插件。为什么这么做呢？因为有些插件只在开发阶段生效，或者说只在生产环境生效，我们可以通过 `apply: 'serve' 或 'build'` 来指定它们，同时也可以将 `apply` 配置为一个函数，来自定义插件生效的条件。解析代码如下：

```js
// resolve plugins
const rawUserPlugins = (config.plugins || []).flat().filter((p) => {
 if (!p) {
 return false
 } else if (!p.apply) {
 return true
 } else if (typeof p.apply === 'function') {
 // apply 为一个函数的情况
 return p.apply({ ...config, mode }, configEnv)
 } else {
 return p.apply === command
 }
}) as Plugin[]
// 对用户插件进行排序
const [prePlugins, normalPlugins, postPlugins] =
 sortUserPlugins(rawUserPlugins)
```

接着，vite 会拿到这些过滤且排序完成的插件，依次调用插件 config 钩子，进行配置合并：

```js
// run config hooks
const userPlugins = [...prePlugins, ...normalPlugins, ...postPlugins]
for (const p of userPlugins) {
  if (p.config) {
    const res = await p.config(config, configEnv)
    if (res) {
      // mergeConfig 为具体的配置合并函数，大家有兴趣可以阅读一下实现
      config = mergeConfig(config, res)
    }
  }
}
```

然后解析项目的根目录即 `root` 参数，默认取 `process.cwd()` 的结果：

```js
// resolve root
const resolvedRoot = normalizePath(config.root ? path.resolve(config.root) : process.cwd())
```

紧接着处理 `alias` ，这里需要加上一些内置的 alias 规则，如 `@vite/env 、@vite/client` 这种直接重定向到 Vite 内部的模块:

```js
// resolve alias with internal client alias
const resolvedAlias = mergeAlias(
 clientAlias,
 config.resolve?.alias || config.alias || []
)
const resolveOptions: ResolvedConfig['resolve'] = {
 dedupe: config.dedupe,
 ...config.resolve,
 alias: resolvedAlias
}
```

#### 3.加载环境变量

现在，我们进入第三个核心环节: 加载环境变量，它的实现代码如下:

```js
// load .env files
const envDir = config.envDir ? normalizePath(path.resolve(resolvedRoot, config.envDir)) : resolvedRoot
const userEnv = inlineConfig.envFile !== false && loadEnv(mode, envDir, resolveEnvPrefix(config))
```

loadEnv 其实就是扫描 `process.env` 与 `.env` 文件，解析出 env 对象，值得注意的是，这个对象的属性最终会被挂载到 `import.meta.env` 这个全局对象上。

解析 env 对象的实现思路如下：

- 遍历 process.env 的属性，拿到指定前缀开头的属性（默认指定为 `VITE_` ），并挂载 env 对象上
- 遍历 .env 文件，解析文件，然后往 env 对象挂载那些以指定前缀开头的属性，遍历的文件先后顺序如下(下面的 `mode` 开发阶段为 `development` ，生产环境为 `production` ):
  - .env.${mode}.local
  - .env.${mode}
  - .env.local
  - .env

> 特殊情况: 如果中途遇到 NODE_ENV 属性，则挂到 `process.env.VITE_USER_NODE_ENV` ，Vite 会优先通过这个属性来决定是否走生产环境的构建。

接下来是对资源公共路径即 `base URL` 的处理，逻辑集中在 resolveBaseUrl 函数当中:

```js
// 解析 base url
const BASE_URL = resolveBaseUrl(config.base, command === 'build', logger)
// 解析生产环境构建配置
const resolvedBuildOptions = resolveBuildOptions(config.build)
```

`resolveBaseUrl` 里面有这些处理规则需要注意:

- 空字符或者 `./` 在开发阶段特殊处理，全部重写为 `/`
- `.` 开头的路径，自动重写为 `/`
- 以 `http(s)://` 开头的路径，在开发环境下重写为对应的 pathname
- 确保路径开头和结尾都是 `/`

当然，还有对 `cacheDir` 的解析，这个路径相对于在 Vite 预编译时写入依赖产物的路径:

```js
// resolve cache directory
const pkgPath = lookupFile(resolvedRoot, [`package.json`], true /* pathOnly */)
// 默认为 node_module/.vite
const cacheDir = config.cacheDir
  ? path.resolve(resolvedRoot, config.cacheDir)
  : pkgPath && path.join(path.dirname(pkgPath), `node_modules/.vite`)
```

紧接着处理用户配置的 `assetsInclude` ，将其转换为一个过滤器函数:

```js
const assetsFilter = config.assetsInclude ? createFilter(config.assetsInclude) : () => false
```

Vite 后面会将用户传入的 assetsInclude 和内置的规则合并:

```js
assetsInclude(file: string) {
 return DEFAULT_ASSETS_RE.test(file) || assetsFilter(file)
}
```

这个配置决定是否让 Vite 将对应的后缀名视为 `静态资源文件` （asset）来处理。

#### 4.路径解析器工厂

接下来，进入到第四个核心环节: **定义路径解析器工厂**。这里所说的 `路径解析器`，是指调用插件容器进行路径解析的函数。代码结构是这个样子的:

```js
const createResolver: ResolvedConfig['createResolver'] = (options) => {
 let aliasContainer: PluginContainer | undefined
 let resolverContainer: PluginContainer | undefined
 // 返回的函数可以理解为一个解析器
 return async (id, importer, aliasOnly, ssr) => {
 let container: PluginContainer
 if (aliasOnly) {
 container =
 aliasContainer ||
 // 新建 aliasContainer
 } else {
  container =
 resolverContainer ||
 // 新建 resolveContainer
 }
 return (await container.resolveId(id, importer, undefined, ssr))?.id
 }
}
```

这个解析器未来会在 `依赖预构建` 的时候用上，具体用法如下:

```js
const resolve = config.createResolver()
// 调用以拿到 react 路径
rseolve('react', undefined, undefined, false)
```

这里有 `aliasContainer` 和 `resolverContainer` 两个工具对象，它们都含有 `resolveId` 这个专门解析路径的方法，可以被 Vite 调用来获取解析结果。

> 两个工具对象的本质是 `PluginContainer` ，我们将在「编译流水线」小节详细介绍 `PluginContainer` 的特点和实现

接着会顺便处理一个 public 目录，也就是 Vite 作为静态资源服务的目录:

```js
const { publicDir } = config
const resolvedPublicDir =
  publicDir !== false && publicDir !== ''
    ? path.resolve(resolvedRoot, typeof publicDir === 'string' ? publicDir : 'public')
    : ''
```

至此，配置已经基本上解析完成，最后通过 resolved 对象来整理一下:

```js
const resolved: ResolvedConfig = {
 ...config,
 configFile: configFile ? normalizePath(configFile) : undefined,
 configFileDependencies,
 inlineConfig,
 root: resolvedRoot,
 base: BASE_URL
 // 其余配置不再一一列举
}
```

#### 5.生成插件流水线

最后，我们进入第五个环节: `生成插件流水线`。代码如下:

```js
;(resolved.plugins as Plugin[]) = await resolvePlugins(
 resolved,
 prePlugins,
 normalPlugins,
 postPlugins
)
// call configResolved hooks
await Promise.all(userPlugins.map((p) => p.configResolved?.(resolved)))
```

先生成完整插件列表传给 `resolve.plugins` ，而后调用每个插件的 `configResolved` 钩子函数。其中 `resolvePlugins` 内部细节比较多，插件数量比较庞大，我们暂时不去深究具体实现，编译流水线这一小节再来详细介绍。

至此，所有核心配置都生成完毕。不过，后面 Vite 还会处理一些边界情况，在用户配置不合理的时候，给用户对应的提示。比如：用户直接使用 `alias` 时，Vite 会提示使用`resolve.alias` 。
最后， `resolveConfig` 函数会返回 resolved 对象，也就是最后的配置集合，那么配置解析服务到底也就结束了。

### 加载配置文件详解

配置解析服务的流程梳理完，但刚开始 `加载配置文件(loadConfigFromFile) ` 的实现我们还没有具体分析，先来回顾下代码：

```js
const loadResult = await loadConfigFromFile(/*省略传参*/)
```

这里的逻辑稍微有点复杂，很难梳理清楚，所以我们不妨借助刚才梳理的配置解析流程，深入 `loadConfigFromFile` 的细节中，研究下 Vite 对于配置文件加载的实现思路。

首先，我们来分析下需要处理的配置文件类型，根据`文件后缀`和`模块格式`可以分为下面这几类:

- TS+ESM 格式
- TS+CommonJS 格式
- JS+ESM 格式
- JS+CommonJS 格式

那么，Vite 是如何加载配置文件的？一共分两个步骤:

- 识别出配置文件的类别
- 根据不同的类别分别解析出配置内容

##### 1.识别配置文件的类别

首先 Vite 会检查项目的 package.json ，如果有 `type: "module"` 则打上 `isESM` 的标识:

```js
try {
  const pkg = lookupFile(configRoot, ['package.json'])
  if (pkg && JSON.parse(pkg).type === 'module') {
    isMjs = true
  }
} catch (e) {}
```

然后，Vite 会寻找配置文件路径，代码简化后如下：

```js
let isTS = false
let isESM = false
let dependencies: string[] = []
// 如果命令行有指定配置文件路径
if (configFile) {
 resolvedPath = path.resolve(configFile)
 // 根据后缀判断是否为 ts 或者 esm，打上 flag
 isTS = configFile.endsWith('.ts')
 if (configFile.endsWith('.mjs')) {
 isESM = true
 }
} else {
 // 从项目根目录寻找配置文件路径，寻找顺序:
 // - vite.config.js
 // - vite.config.mjs
 // - vite.config.ts
 // - vite.config.cjs
 const jsconfigFile = path.resolve(configRoot, 'vite.config.js')
 if (fs.existsSync(jsconfigFile)) {
 resolvedPath = jsconfigFile
 }
 if (!resolvedPath) {
 const mjsconfigFile = path.resolve(configRoot, 'vite.config.mjs')
 if (fs.existsSync(mjsconfigFile)) {
 resolvedPath = mjsconfigFile
 isESM = true
 }
 }
 if (!resolvedPath) {
 const tsconfigFile = path.resolve(configRoot, 'vite.config.ts')
 if (fs.existsSync(tsconfigFile)) {
 resolvedPath = tsconfigFile
 isTS = true
 }
 }

 if (!resolvedPath) {
 const cjsConfigFile = path.resolve(configRoot, 'vite.config.cjs')
 if (fs.existsSync(cjsConfigFile)) {
 resolvedPath = cjsConfigFile
 isESM = false
 }
 }
}
```

在寻找路径的同时， Vite 也会给当前配置文件打上 `isESM` 和 `isTS` 的标识，方便后续的解析。

##### 2.根据类别解析配置

###### ESM 格式

对于 ESM 格式配置的处理代码如下：

```js
let userConfig: UserConfigExport | undefined
if (isESM) {
 const fileUrl = require('url').pathToFileURL(resolvedPath)
 // 首先对代码进行打包
 const bundled = await bundleConfigFile(resolvedPath, true)
 dependencies = bundled.dependencies
 // TS + ESM
 if (isTS) {
 fs.writeFileSync(resolvedPath + '.js', bundled.code)
 userConfig = (await dynamicImport(`${fileUrl}.js?t=${Date.now()}`))
 .default
 fs.unlinkSync(resolvedPath + '.js')
 debug(`TS + native esm config loaded in ${getTime()}`, fileUrl)
 }
 // JS + ESM
 else {
 userConfig = (await dynamicImport(`${fileUrl}?t=${Date.now()}`)).default
 debug(`native esm config loaded in ${getTime()}`, fileUrl)
 }
 }
```

首先通过 Esbuild 将配置文件编译打包成 js 代码:

```js
const bundled = await bundleConfigFile(resolvedPath, true)
// 记录依赖
dependencies = bundled.dependencies
```

对于 TS 配置文件来说，Vite 会将编译后的 js 代码写入 `临时文件`，通过 Node 原生 ESM Import 来读取这个临时的内容，以获取到配置内容，再直接删掉临时文件:

```js
fs.writeFileSync(resolvedPath + '.js', bundled.code)
userConfig = (await dynamicImport(`${fileUrl}.jst=${Date.now()}`)).default
fs.unlinkSync(resolvedPath + '.js')
```

> 以上这种先编译配置文件，再将产物写入临时目录，最后加载临时目录产物的做法，也是 AOT (Ahead Of Time)编译技术的一种具体实现

而对于 JS 配置文件来说，Vite 会直接通过 Node 原生 ESM Import 来读取，也是使用 dynamicImport 函数的逻辑。 `dynamicImport` 的实现如下:

```js
export const dynamicImport = new Function('file', 'return import(file)')
```

你可能会问，为什么要用 new Function 包裹？这是为了避免打包工具处理这段代码，比如 `Rollup` 和 `TSC` ，类似的手段还有 `eval` 。

你可能还会问，为什么 import 路径结果要加上时间戳 query？这其实是为了让 devserver 重启后仍然读取最新的配置，避免缓存。

###### CommonJS 格式

对于 CommonJS 格式的配置文件，Vite 集中进行了解析:

```js
// 对于 js/ts 均生效
// 使用 esbuild 将配置文件编译成 commonjs 格式的 bundle 文件
const bundled = await bundleConfigFile(resolvedPath)
dependencies = bundled.dependencies
// 加载编译后的 bundle 代码
userConfig = await loadConfigFromBundledFile(resolvedPath, bundled.code)
```

`bundleConfigFile` 的逻辑上文中已经说了，主要是通过 Esbuild 将配置文件打包，拿
到打包后的 bundle 代码以及配置文件的依赖(dependencies)。

而接下来的事情就是考虑如何加载 bundle 代码了，这也是
`loadConfigFromBundledFile` 要做的事情。我们来看一下这个函数具体的实现:

```js
async function loadConfigFromBundledFile(
 fileName: string,
 bundledCode: string
): Promise<UserConfig> {
 const extension = path.extname(fileName)
 const defaultLoader = require.extensions[extension]!
 require.extensions[extension] = (module: NodeModule, filename: string) => {
 if (filename === fileName) {
 ;(module as NodeModuleWithCompile)._compile(bundledCode, filename)
 } else {
 defaultLoader(module, filename)
 }
 }
 // 清除 require 缓存
 delete require.cache[require.resolve(fileName)]
 const raw = require(fileName)
 const config = raw.__esModule ? raw.default : raw
 require.extensions[extension] = defaultLoader
 return config
}
```

大体的思路是通过拦截原生 require.extensions 的加载函数来实现对 bundle 后配置代码的加载。代码如下:

```js
// 默认加载器
const defaultLoader = require.extensions[extension]!
// 拦截原生 require 对于`.js`或者`.ts`的加载
require.extensions[extension] = (module: NodeModule, filename: string) => {
 // 针对 vite 配置文件的加载特殊处理
 if (filename === fileName) {
 ;(module as NodeModuleWithCompile)._compile(bundledCode, filename)
 } else {
 defaultLoader(module, filename)
 }
}
```

而原生 require 对于 js 文件的加载代码是这样的:

```js
Module._extensions['.js'] = function (module, filename) {
  var content = fs.readFileSync(filename, 'utf8')
  module._compile(stripBOM(content), filename)
}
```

Node.js 内部也是先读取文件内容，然后编译该模块。当代码中调用 `module._compile` 相当于手动编译一个模块，该方法在 Node 内部的实现如下:

```js
Module.prototype._compile = function (content, filename) {
  var self = this
  var args = [self.exports, require, self, filename, dirname]
  return compiledWrapper.apply(self.exports, args)
}
```

等同于下面的形式:

```js
;(function (exports, require, module, __filename, __dirname) {
  // 执行 module._compile 方法中传入的代码
  // 返回 exports 对象
})
```

在调用完 `module._compile` 编译完配置代码后，进行一次手动的 require，即可拿到配置对象:

```js
const raw = require(fileName)
const config = raw.__esModule ? raw.default : raw
// 恢复原生的加载方法
require.extensions[extension] = defaultLoader
// 返回配置
return config
```

> 这种运行时加载 TS 配置的方式，也叫做 `JIT` (即时编译)，这种方式和 `AOT` 最大的区别在于不会将内存中计算出来的 js 代码写入磁盘再加载，而是通过拦截 Node.js 原生 require.extension 方法实现即时加载。

至此，配置文件的内容已经读取完成，等后处理完成再返回即可:

```js
// 处理是函数的情况
const config = await (typeof userConfig === 'function' ? userConfig(configEnv) : userConfig)
if (!isObject(config)) {
  throw new Error(`config must export or return an object.`)
}
// 接下来返回最终的配置信息
return {
  path: normalizePath(resolvedPath),
  config,
  // esbuild 打包过程中搜集的依赖
  dependencies
}
```

## Vite 打包详解

### 预构建核心流程

> 关于预构建所有的实现代码都在 optimizeDeps 函数当中，也就是在仓库源码的 [packages/vite/src/node/optimizer/index.ts](https://github.com/vitejs/vite/blob/v2.7.0/packages/vite/src/node/optimizer/index.ts) 文件中，你可以对照着来学习。

#### 缓存判断

首先是预构建缓存的判断。Vite 在每次预构建之后都将一些关键信息写入到了 `_metadata.json` 文件中，第二次启动项目时会通过这个文件中的 hash 值来进行缓存的判断，如果命中缓存则不会进行后续的预构建流程，代码如下所示:

```js
// _metadata.json 文件所在的路径
const dataPath = path.join(cacheDir, "_metadata.json");
// 根据当前的配置计算出哈希值
const mainHash = getDepHash(root, config);
const data: DepOptimizationMetadata = {
 hash: mainHash,
 browserHash: mainHash,
 optimized: {},
};
// 默认走到里面的逻辑
if (!force) {
 let prevData: DepOptimizationMetadata | undefined;
 try {
 // 读取元数据
 prevData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
 } catch (e) {}
 // 当前计算出的哈希值与 _metadata.json 中记录的哈希值一致，表示命中缓存，不用预构建
 if (prevData && prevData.hash === data.hash) {
 log("Hash is consistent. Skipping. Use --force to override.");
 return prevData;
 }
}
```

值得注意的是哈希计算的策略，即决定哪些配置和文件有可能影响预构建的结果，然后根据这些信息来生成哈希值。这部分逻辑集中在 getHash 函数中，我把关键信息放到了注释中：

```js
const lockfileFormats = ["package-lock.json", "yarn.lock", "pnpm-lock.yaml"];
function getDepHash(root: string, config: ResolvedConfig): string {
 // 获取 lock 文件内容
 let content = lookupFile(root, lockfileFormats) || "";
 // 除了 lock 文件外，还需要考虑下面的一些配置信息
 content += JSON.stringify(
 {
 // 开发/生产环境
 mode: config.mode,
 // 项目根路径
 root: config.root,
 // 路径解析配置
 resolve: config.resolve,
 // 自定义资源类型
 assetsInclude: config.assetsInclude,
 // 插件
 plugins: config.plugins.map((p) => p.name),
 // 预构建配置
 optimizeDeps: {
 include: config.optimizeDeps?.include,
 exclude: config.optimizeDeps?.exclude,
 },
 },
 // 特殊处理函数和正则类型
 (_, value) => {
 if (typeof value === "function" || value instanceof RegExp) {
 return value.toString();
 }
 return value;
 }
 );
 // 最后调用 crypto 库中的 createHash 方法生成哈希
 return createHash("sha256").update(content).digest("hex").substring(0, 8);
}
```

#### 依赖扫描

如果没有命中缓存，则会正式地进入依赖预构建阶段。不过 Vite 不会直接进行依赖的预构建，而是在之前探测一下项目中存在哪些依赖，收集依赖列表，也就是进行 `依赖扫描` 的过程。这个过程是必须的，因为 Esbuild 需要知道我们到底要打包哪些第三方依赖。关键代码如下:

```js
;({ deps, missing } = await scanImports(config))
```

在 `scanImports` 方法内部主要会调用 Esbuild 提供的 `build` 方法:

```js
const deps: Record<string, string> = {};
// 扫描用到的 Esbuild 插件
const plugin = esbuildScanPlugin(config, container, deps, missing, entries);
await Promise.all(
 // 应用项目入口
 entries.map((entry) =>
 build({
 absWorkingDir: process.cwd(),
 // 注意这个参数
 write: false,
 entryPoints: [entry],
 bundle: true,
 format: "esm",
 logLevel: "error",
 plugins: [...plugins, plugin],
 ...esbuildOptions,
 })
 )
);
```

值得注意的是，其中传入的 `write` 参数被设为 false，表示产物不用写入磁盘，这就大大节省了磁盘 I/O 的时间了，也是 `依赖扫描` 为什么往往比 `依赖打包` 快很多的原因之一。

接下来会输出预打包信息：

```js
if (!asCommand) {
  if (!newDeps) {
    logger.info(chalk.greenBright(`Pre-bundling dependencies:\n ${depsString}`))
    logger.info(`(this will be run only when your dependencies or config have changed)`)
  }
} else {
  logger.info(chalk.greenBright(`Optimizing dependencies:\n ${depsString}`))
}
```

这时候你可以明白，为什么第一次启动时会输出预构建相关的 log 信息了，其实这些信息都是通过`依赖扫描`阶段来搜集的，而此时还并未开始真正的依赖打包过程。

可能你会有疑问，为什么对项目入口打包一次就收集到所有依赖信息了呢？大家可以注意到 `esbuildScanPlugin` 这个函数创建 `scan 插件` 的时候就接收到了 `deps` 对象作为入参，这个对象的作用不可小觑，在 scan 插件里面就是解析各种 import 语句，最终通过它来记录依赖信息。由于解析的过程比较复杂，我们放到下一个部分具体讲解，这里你只需要知道核心的流程即可。

#### 依赖打包

收集完依赖之后，就正式地进入到`依赖打包`的阶段了。这里也调用 Esbuild 进行打包并写入产物到磁盘中，关键代码如下：

```js
const result = await build({
 absWorkingDir: process.cwd(),
 // 所有依赖的 id 数组，在插件中会转换为真实的路径
 entryPoints: Object.keys(flatIdDeps),
 bundle: true,
 format: "esm",
 target: config.build.target || undefined,
 external: config.optimizeDeps?.exclude,
 logLevel: "error",
 splitting: true,
 sourcemap: true,
 outdir: cacheDir,
 ignoreAnnotations: true,
 metafile: true,
 define,
 plugins: [
 ...plugins,
 // 预构建专用的插件
 esbuildDepPlugin(flatIdDeps, flatIdToExports, config, ssr),
 ],
 ...esbuildOptions,
});
// 打包元信息，后续会根据这份信息生成 _metadata.json
const meta = result.metafile!;
```

#### 元信息写入磁盘

在打包过程完成之后，Vite 会拿到 Esbuild 构建的元信息，也就是上面代码中的 meta 对象，然后将元信息保存到 `_metadata.json` 文件中：

```js
const data: DepOptimizationMetadata = {
 hash: mainHash,
 browserHash: mainHash,
 optimized: {},
};
// 省略中间的代码
for (const id in deps) {
 const entry = deps[id];
 data.optimized[id] = {
 file: normalizePath(path.resolve(cacheDir, flattenId(id) + ".js")),
 src: entry,
 // 判断是否需要转换成 ESM 格式，后面会介绍
 needsInterop: needsInterop(
 id,
 idToExports[id],
 meta.outputs,
 cacheDirOutputPath
 ),
 };
}
// 元信息写磁盘
writeFile(dataPath, JSON.stringify(data, null, 2));
```

到这里，预构建的核心流程就梳理完了，可以看到总体的流程上面并不复杂，但实际上为了方便你理解，在 `依赖扫描` 和 `依赖打包` 这两个部分中，我省略了很多的细节，每个细节代表了各种复杂的处理场景，因此，在下面的篇幅中，我们就来好好地剖析一下这两部分的应用场景和实现细节。

### 依赖扫描详细分析

#### 1.如何获取入口

现在让我们把目光聚焦在 `scanImports` 的实现上。大家可以先想一想，在进行依赖扫描之前，需要做的第一件事是什么？很显然，是找到入口文件。但入口文件可能存在于多个配置当中，比如 `optimizeDeps.entries` 和 `build.rollupOptions.input` ，同时需要考虑数组和对象的情况；也可能用户没有配置，需要自动探测入口文件。那么，在 scanImports 是如何做到的呢？

```js
const explicitEntryPatterns = config.optimizeDeps.entries;
const buildInput = config.build.rollupOptions?.input;
if (explicitEntryPatterns) {
 // 先从 optimizeDeps.entries 寻找入口，支持 glob 语法
 entries = await globEntries(explicitEntryPatterns, config);
} else if (buildInput) {
 // 其次从 build.rollupOptions.input 配置中寻找，注意需要考虑数组和对象的情况
 const resolvePath = (p: string) => path.resolve(config.root, p);
 if (typeof buildInput === "string") {
 entries = [resolvePath(buildInput)];
 } else if (Array.isArray(buildInput)) {
 entries = buildInput.map(resolvePath);
 } else if (isObject(buildInput)) {
 entries = Object.values(buildInput).map(resolvePath);
 } else {
 throw new Error("invalid rollupOptions.input value.");
 }
} else {
 // 兜底逻辑，如果用户没有进行上述配置，则自动从根目录开始寻找
 entries = await globEntries("**/*.html", config);
}
```

其中 `globEntries` 方法即通过 `fast-glob` 库来从项目根目录扫描文件。

接下来我们还需要考虑入口文件的类型，一般情况下入口需要是` js/ts` 文件，但实际上像 html、vue 单文件组件这种类型我们也是需要支持的，因为在这些文件中仍然可以包含 script 标签的内容，从而让我们搜集到依赖信息。

在源码当中，同时对 `html` 、 `vue` 、 `svelte` 、 `astro` (一种新兴的类 html 语法)四种后缀的入口文件进行了解析，当然，具体的解析过程在依赖扫描阶段的 Esbuild 插件中得以实现，接着就让我们在插件的实现中一探究竟。

```js
const htmlTypesRE = /.(html|vue|svelte|astro)$/;
function esbuildScanPlugin(/* 一些入参 */): Plugin {
 // 初始化一些变量
 // 返回一个 Esbuild 插件
 return {
 name: "vite:dep-scan",
 setup(build) {
 // 标记「类 HTML」文件的 namespace
 build.onResolve({ filter: htmlTypesRE }, async ({ path, importer }) => {
 return {
 path: await resolve(path, importer),
 namespace: "html",
 };
 });
 build.onLoad(
 { filter: htmlTypesRE, namespace: "html" },
 async ({ path }) => {
 // 解析「类 HTML」文件
  }
 );
 },
 };
}
```

这里来我们以 `html` 文件的解析为例来讲解，原理如下图所示:

![Snipaste_2023-11-10_16-58-42.png](https://s2.loli.net/2023/11/10/YaRdGDBroA5w4Su.png)

在插件中会扫描出所有带有 `type=module` 的 script 标签，对于含有 src 的 `script` 改写为一个 import 语句，对于含有具体内容的 script，则抽离出其中的脚本内容，最后将所有的 script 内容拼接成一段 js 代码。接下来我们来看具体的代码，其中会以上图中的 html 为示例来拆解中间过程:

```js
const scriptModuleRE =
 /(<script\b[^>]*type\s*=\s*(?: module |'module')[^>]*>)(.*?)</script>/gims
export const scriptRE = /(<script\b(?:\s[^>]*>|>))(.*?)</script>/gims
export const commentRE = /<!--(.|[\r\n])*?-->/
const srcRE = /\bsrc\s*=\s*(?: ([^ ]+) |'([^']+)'|([^\s' >]+))/im
const typeRE = /\btype\s*=\s*(?: ([^ ]+) |'([^']+)'|([^\s' >]+))/im
const langRE = /\blang\s*=\s*(?: ([^ ]+) |'([^']+)'|([^\s' >]+))/im
// scan 插件 setup 方法内部实现
build.onLoad(
 { filter: htmlTypesRE, namespace: 'html' },
 async ({ path }) => {
 let raw = fs.readFileSync(path, 'utf-8')
 // 去掉注释内容，防止干扰解析过程
 raw = raw.replace(commentRE, '<!---->')
 const isHtml = path.endsWith('.html')
 // HTML 情况下会寻找 type 为 module 的 script
 // 正则：/(<script\b[^>]*type\s*=\s*(?: module |'module')[^>]*>)(.*?)</script>/gims
 const regex = isHtml ? scriptModuleRE : scriptRE
 regex.lastIndex = 0
 let js = ''
 let loader: Loader = 'js'
 let match: RegExpExecArray | null
 // 正式开始解析
 while ((match = regex.exec(raw))) {
 // 第一次: openTag 为 <script type= module src= /src/main.ts >, 无 content
 // 第二次: openTag 为 <script type= module >，有 content
 const [, openTag, content] = match
 const typeMatch = openTag.match(typeRE)
 const type =
 typeMatch && (typeMatch[1] || typeMatch[2] || typeMatch[3])
 const langMatch = openTag.match(langRE)
 const lang =
 langMatch && (langMatch[1] || langMatch[2] || langMatch[3])
 if (lang === 'ts' || lang === 'tsx' || lang === 'jsx') {
 // 指定 esbuild 的 loader
 loader = lang
 }
 const srcMatch = openTag.match(srcRE)
 // 根据有无 src 属性来进行不同的处理
 if (srcMatch) {
 const src = srcMatch[1] || srcMatch[2] || srcMatch[3]
 js += `import ${JSON.stringify(src)}\n`
 } else if (content.trim()) {
 js += content + '\n'
 }
 }
 return {
 loader,
 contents: js
 }
)
```

这里对源码做了一定的精简，省略了 `vue / svelte` 以及 `import.meta.glob` 语法的处理，但不影响整体的实现思路，这里主要是让你了解即使是 html 或者类似这种类型的文件，也是能作为 Esbuild 的预构建入口来进行解析的。

#### 2.如何记录依赖

入口的问题解决了，接下来还有一个问题: 如何在 Esbuild 编译的时候记录依赖呢？Vite 中会把 `bare import` 的路径当做依赖路径，关于 `bare import` ，你可以理解为直接引入一个包名，比如下面这样:

```js
import React from 'react'
```

而以 . 开头的相对路径或者以 / 开头的绝对路径都不能算 `bare import` :

```js
// 以下都不是 bare import
import React from '../node_modules/react/index.js'
import React from '/User/sanyuan/vite-project/node_modules/react/index.js'
```

对于解析 `bare import` 、记录依赖的逻辑依然实现在 `scan` 插件当中:

```js
build.onResolve(
  {
    // avoid matching windows volume
    filter: /^[\w@][^:]/
  },
  async ({ path: id, importer }) => {
    // 如果在 optimizeDeps.exclude 列表或者已经记录过了，则将其 externalize (排除)，直接 return
    // 接下来解析路径，内部调用各个插件的 resolveId 方法进行解析
    const resolved = await resolve(id, importer)
    if (resolved) {
      // 判断是否应该 externalize，下个部分详细拆解
      if (shouldExternalizeDep(resolved, id)) {
        return externalUnlessEntry({ path: id })
      }
      if (resolved.includes('node_modules') || include?.includes(id)) {
        // 如果 resolved 为 js 或 ts 文件
        if (OPTIMIZABLE_ENTRY_RE.test(resolved)) {
          // 注意了! 现在将其正式地记录在依赖表中
          depImports[id] = resolved
        }
        // 进行 externalize，因为这里只用扫描出依赖即可，不需要进行打包，具体实现后面的部分会讲到
        return externalUnlessEntry({ path: id })
      } else {
        // resolved 为 「类 html」 文件，则标记上 'html' 的 namespace
        const namespace = htmlTypesRE.test(resolved) ? 'html' : undefined
        // linked package, keep crawling
        return {
          path: path.resolve(resolved),
          namespace
        }
      }
    } else {
      // 没有解析到路径，记录到 missing 表中，后续会检测这张表，显示相关路径未找到的报错
      missing[id] = normalizePath(importer)
    }
  }
)
```

顺便说一句，其中调用到了 `resolve` ，也就是路径解析的逻辑，这里面实际上会调用各个插件的 resolveId 方法来进行路径的解析，代码如下所示：

```js
const resolve = async (id: string, importer?: string) => {
 // 通过 seen 对象进行路径缓存
 const key = id + (importer && path.dirname(importer));
 if (seen.has(key)) {
 return seen.get(key);
 }
 // 调用插件容器的 resolveId
 // 关于插件容器下一节会详细介绍，这里你直接理解为调用各个插件的 resolveId 方法解析路径即可
 const resolved = await container.resolveId(
 id,
 importer && normalizePath(importer)
 );
 const res = resolved?.id;
 seen.set(key, res);
 return res;
};
```

#### 3.external 的规则如何制定？

上面我们分析了在 Esbuild 插件中如何针对 ` bare import` 记录依赖，那么在记录的过程中还有一件非常重要的事情，就是决定哪些路径应该被排除，不应该被记录或者不应该被 Esbuild 来解析。这就是 `external 规则` 的概念。

在这里，我把需要 external 的路径分为两类: `资源型`和`模块型`。

首先，对于资源型的路径，一般是直接排除，在插件中的处理方式如下：

```js
// data url，直接标记 external: true，不让 esbuild 继续处理
build.onResolve({ filter: dataUrlRE }, ({ path }) => ({
  path,
  external: true
}))
// 加了 ?worker 或者 ?raw 这种 query 的资源路径，直接 external
build.onResolve({ filter: SPECIAL_QUERY_RE }, ({ path }) => ({
  path,
  external: true
}))
// css & json
build.onResolve(
  {
    filter: /.(css|less|sass|scss|styl|stylus|pcss|postcss|json)$/
  },
  // 非 entry 则直接标记 external
  externalUnlessEntry
)
// Vite 内置的一些资源类型，比如 .png、.wasm 等等
build.onResolve(
  {
    filter: new RegExp(`\.(${KNOWN_ASSET_TYPES.join('|')})$`)
  },
  // 非 entry 则直接标记 external
  externalUnlessEntry
)
```

其中 `externalUnlessEntry` 的实现也很简单:

```js
const externalUnlessEntry = ({ path }: { path: string }) => ({
 path,
  // 非 entry 则标记 external
 external: !entries.includes(path),
});
```

其次，对于模块型的路径，也就是当我们通过 resolve 函数解析出了一个 JS 模块的路径，如何判断是否应该被 externalize 呢？这部分实现主要在 shouldExternalizeDep 函数中，之前在分析 bare import 埋了个伏笔，现在让我们看看具体的实现规则:

```js
export function shouldExternalizeDep(
 resolvedId: string,
 rawId: string
): boolean {
 // 解析之后不是一个绝对路径，不在 esbuild 中进行加载
 if (!path.isAbsolute(resolvedId)) {
 return true;
 }
 // 1. import 路径本身就是一个绝对路径
 // 2. 虚拟模块(Rollup 插件中约定虚拟模块以`\0`开头)
 // 都不在 esbuild 中进行加载
 if (resolvedId === rawId || resolvedId.includes("\0")) {
 return true;
 }
 // 不是 JS 或者 类 HTML 文件，不在 esbuild 中进行加载
 if (!JS_TYPES_RE.test(resolvedId) && !htmlTypesRE.test(resolvedId)) {
 return true;
 }
 return false;
}
```

### 依赖打包详细分析

#### 1.如何达到扁平化的产物文件结构

一般情况下，esbuild 会输出嵌套的产物目录结构，比如对 vue 来说，其产物在 `dist/vue.runtime.esm-bundler.js` 中，那么经过 esbuild 正常打包之后，预构建的产物目录如下：

```js
node_modules/.vite
├── _metadata.json
├── vue
│ └── dist
│ └── vue.runtime.esm-bundler.js
```

由于各个第三方包的产物目录结构不一致，这种深层次的嵌套目录对于 Vite 路径解析来说，其实是增加了不少的麻烦的，带来了一些不可控的因素。为了解决嵌套目录带来的问题，Vite 做了两件事情来达到扁平化的预构建产物输出:

- 嵌套路径扁平化， `/` 被换成下划线，如 `react/jsx-dev-runtime` ，被重写为 `react_jsx-dev-runtime`
- 用虚拟模块来代替真实模块，作为预打包的入口，具体的实现后面会详细介绍

回到 `optimizeDeps` 函数中，其中在进行完依赖扫描的步骤后，就会执行路径的扁平化操作:

```js
const flatIdDeps: Record<string, string> = {};
const idToExports: Record<string, ExportsData> = {};
const flatIdToExports: Record<string, ExportsData> = {};
// deps 即为扫描后的依赖表
// 形如: {
// react : /Users/sanyuan/vite-project/react/index.js }
// react/jsx-dev-runtime : /Users/sanyuan/vite-project/react/jsx-dev-runtime.js
// }
for (const id in deps) {
 // 扁平化路径，`react/jsx-dev-runtime`，被重写为`react_jsx-dev-runtime`；
 const flatId = flattenId(id);
 // 填入 flatIdDeps 表，记录 flatId -> 真实路径的映射关系
 const filePath = (flatIdDeps[flatId] = deps[id]);
 const entryContent = fs.readFileSync(filePath, "utf-8");
 // 后续代码省略
}
```

对于虚拟模块的处理，大家可以把目光放到 esbuildDepPlugin 函数上面，它的逻辑大致如下:

```js
export function esbuildDepPlugin(/* 一些传参 */) {
 // 定义路径解析的方法
 // 返回 Esbuild 插件
 return {
 name: 'vite:dep-pre-bundle',
 set(build) {
 // bare import 的路径
 build.onResolve(
 { filter: /^[\w@][^:]/ },
 async ({ path: id, importer, kind }) => {
 // 判断是否为入口模块，如果是，则标记上`dep`的 namespace，成为一个虚拟模块
 }
 }
 build.onLoad({ filter: /.*/, namespace: 'dep' }, ({ path: id }) => {
 // 加载虚拟模块
  }
 }
}
```

如此一来，Esbuild 会将虚拟模块作为入口来进行打包，最后的产物目录会变成下面的扁平结构:

```js
node_modules/.vite
├── _metadata.json
├── vue.js
├── react.js
├── react_jsx-dev-runtime.js
```

#### 2.代理模块加载

虚拟模块代替了真实模块作为打包入口，因此也可以理解为 `代理模块`，后面也统一称之为 `代理模块`。我们首先来分析一下代理模块究竟是如何被加载出来的，换句话说，它到底了包含了哪些内容。

拿 `import React from "react"` 来举例，Vite 会把 `react` 标记为 `namespace` 为 `dep` 的虚拟模块，然后控制 Esbuild 的加载流程，对于真实模块的内容进行重新导出。

那么第一步就是确定真实模块的路径：

```js
// 真实模块所在的路径，拿 react 来说，即`node_modules/react/index.js`
const entryFile = qualified[id]
// 确定相对路径
let relativePath = normalizePath(path.relative(root, entryFile))
if (!relativePath.startsWith('./') && !relativePath.startsWith('../') && relativePath !== '.') {
  relativePath = `./${relativePath}`
}
```

确定了路径之后，接下来就是对模块的内容进行重新导出。这里会分为几种情况:

- CommonJS 模块
- ES 模块

那么，如何来识别这两种模块规范呢？

我们可以暂时把目光转移到 `optimizeDeps` 中，实际上在进行真正的依赖打包之前，Vite 会读取各个依赖的入口文件，通过 es-module-lexer 这种工具来解析入口文件的内容。这里稍微解释一下 `es-module-lexer` ，这是一个在 Vite 被经常使用到的工具库，主要是为了解析 ES 导入导出的语法，大致用法如下:

```js
import { init, parse } from 'es-module-lexer'
// 等待`es-module-lexer`初始化完成
await init
const sourceStr = `
 import moduleA from './a';
 export * from 'b';
 export const count = 1;
 export default count;
`
// 开始解析
const exportsData = parse(sourceStr)
// 结果为一个数组，分别保存 import 和 export 的信息
const [imports, exports] = exportsData
// 返回 `import module from './a'`
sourceStr.substring(imports[0].ss, imports[0].se)
// 返回 ['count', 'default']
console.log(exports)
```

值得注意的是, `export * from` 导出语法会被记录在 `import` 信息中。

接下来我们来看看 `optimizeDeps` 中如何利用 `es-module-lexer` 来解析入口文件的，实现代码如下：

```js
import { init, parse } from "es-module-lexer";
// 省略中间的代码
await init;
for (const id in deps) {
 // 省略前面的路径扁平化逻辑
 // 读取入口内容
 const entryContent = fs.readFileSync(filePath, "utf-8");
 try {
 exportsData = parse(entryContent) as ExportsData;
 } catch {
 // 省略对 jsx 的处理
 }
 for (const { ss, se } of exportsData[0]) {
 const exp = entryContent.slice(ss, se);
 // 标记存在 `export * from` 语法
 if (/export\s+*\s+from/.test(exp)) {
 exportsData.hasReExports = true;
 }
  }
 // 将 import 和 export 信息记录下来
 idToExports[id] = exportsData;
 flatIdToExports[flatId] = exportsData;
}
```

OK，由于最后会有两张表记录下 ES 模块导入和导出的相关信息，而 `flatIdToExports` 表会作为入参传给 Esbuild 插件:

```js
// 第二个入参
esbuildDepPlugin(flatIdDeps, flatIdToExports, config, ssr)
```

如此，我们就能根据真实模块的路径获取到导入和导出的信息，通过这份信息来甄别 CommonJS 和 ES 两种模块规范。现在可以回到 Esbuild 打包插件中 `加载代理模块` 的代码:

```js
let contents = ''
// 下面的 exportsData 即外部传入的模块导入导出相关的信息表
// 根据模块 id 拿到对应的导入导出信息
const data = exportsData[id]
const [imports, exports] = data
if (!imports.length && !exports.length) {
  // 处理 CommonJS 模块
} else {
  // 处理 ES 模块
}
```

如果是 CommonJS 模块，则导出语句写成这种形式:

```js
let contents = ''
contents += `export default require( ${relativePath} );`
```

如果是 ES 模块，则分 `默认导出` 和 `非默认导出` 这两种情况来处理:

```js
// 默认导出，即存在 export default 语法
if (exports.includes('default')) {
  contents += `import d from ${relativePath} ;export default d;`
}
// 非默认导出
if (
  // 1. 存在 `export * from` 语法，前文分析过
  data.hasReExports ||
  // 2. 多个导出内容
  exports.length > 1 ||
  // 3. 只有一个导出内容，但这个导出不是 export default
  exports[0] !== 'default'
) {
  // 凡是命中上述三种情况中的一种，则添加下面的重导出语句
  contents += `\nexport * from ${relativePath} `
}
```

现在，我们组装好了 `代理模块` 的内容，接下来就可以放心地交给 Esbuild 加载了:

```js
let ext = path.extname(entryFile).slice(1);
if (ext === "mjs") ext = "js";
return {
 loader: ext as Loader,
 // 虚拟模块内容
 contents,
 resolveDir: root,
};
```

#### 3.代理模块为什么要和真是模块分离

现在，相信你已经清楚了 Vite 是如何组装代理模块，以此作为 Esbuild 打包入口的，整体的思路就是先分析一遍模块真实入口文件的 `import` 和 `export` 语法，然后在代理模块中进行重导出。这里不妨回过头来思考一下: 为什么要对真实文件先做语法分析，然后重导出内容呢？

对此，大家不妨注意一下代码中的这段注释:

```js
// It is necessary to do the re-exporting to separate the virtual proxy
// module from the actual module since the actual module may get
// referenced via relative imports - if we don't separate the proxy and
// the actual module, esbuild will create duplicated copies of the same
// module!
```

翻译过来即：

> 这种重导出的做法是必要的，它可以分离虚拟模块和真实模块，因为真实模块可以通过相对地址来引入。如果不这么做，Esbuild 将会对打包输出两个一样的模块。

刚开始看的确不太容易理解，接下来我会通过对比的方式来告诉你这种设计到底解决了什么问题。

假设我不像源码中这么做，在虚拟模块中直接将真实入口的内容作为传给 Esbuild 可不可以呢？也就是像这样：

```js
build.onLoad({ filter: /.*/, namespace: 'dep' }, ({ path: id }) => {
 // 拿到查表拿到真实入口模块路径
 const entryFile = qualified[id];
 return {
 loader: 'js',
 contents: fs.readFileSync(entryFile, 'utf8');
 }
}
```

那么，这么实现会产生什么问题呢？我们可以先看看正常的预打包流程（以 React 为例）:

![Snipaste_2023-11-10_17-22-16.png](https://s2.loli.net/2023/11/10/XBcU8WbyAuk2rMo.png)

Vite 会使用 `dep:react` 这个代理模块来作为入口内容在 Esbuild 中进行加载，与此同时，其他库的预打包也有可能会引入 React，比如 `@emotion/react` 这个库里面会有`require('react')`的行为。那么在 Esbuild 打包之后， `react.js` 与 `@emotion_react.js`的代码中会引用同一份 Chunk 的内容，这份 Chunk 也就对应 React 入口文件( `node_modules/react/index.js` )。

这是理想情况下的打包结果，接下来我们来看看上述有问题的版本是如何工作的:

![Snipaste_2023-11-10_17-23-52.png](https://s2.loli.net/2023/11/10/5NVsx3dW7HOjDen.png)

现在如果代理模块通过文件系统直接读取真实模块的内容，而不是进行重导出，因此由于此时代理模块跟真实模块并没有任何的引用关系，这就导致最后的 `react.js` 和 `@emotion/react.js` 两份产物并不会引用同一份 Chunk，Esbuild 最后打包出了内容完全相同的两个 Chunk！

## Vite 插件的使用和组织

### 插件容器

在生产环境中 Vite 直接调用 Rollup 进行打包，所以 Rollup 可以调度各种插件。

在开发环境中，Vite 模拟了 Rollup 的插件机制，设计了一个 `PluginContainer` 对象来调度各个插件。

`PluginContainer` (插件容器)对象非常重要，前两节我们也多次提到了它，接下来我们就把目光集中到这个对象身上，看看 Vite 的插件容器机制究竟是如何实现的。

`PluginContainer` 的 `实现` 基于借鉴于 WMR 中的 `rollup-plugin-container.js` ，主要分为 2 个部分:

- 实现 Rollup 插件钩子的调度
- 实现插件钩子内部的 Context 上下文对象

首先，你可以通过 [container 的定义](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/pluginContainer.ts#L463)来看看各个 Rollup 钩子的实现方式，代码精简后如下:

```js
const container = {
 // 异步串行钩子
 options: await (async () => {
 let options = rollupOptions
 for (const plugin of plugins) {
 if (!plugin.options) continue
 options =
 (await plugin.options.call(minimalContext, options)) || options
 }
 return options;
 })(),
 // 异步并行钩子
 async buildStart() {
 await Promise.all(
 plugins.map((plugin) => {
 if (plugin.buildStart) {
 return plugin.buildStart.call(
 new Context(plugin) as any,
 container.options as NormalizedInputOptions
 )
 }
 })
 )
 },
 // 异步优先钩子
 async resolveId(rawId, importer) {
 // 上下文对象，后文介绍
 const ctx = new Context()
 let id: string | null = null
 const partial: Partial<PartialResolvedId> = {}
 for (const plugin of plugins) {
 const result = await plugin.resolveId.call(
 ctx as any,
 rawId,
 importer,
 { ssr }
 )
 if (!result) continue;
 return result;
 }
 }
 // 异步优先钩子
 async load(id, options) {
 const ctx = new Context()
 for (const plugin of plugins) {
 const result = await plugin.load.call(ctx as any, id, { ssr })
 if (result != null) {
 return result
 }
 }
 return null
 },
 // 异步串行钩子
 async transform(code, id, options) {
 const ssr = options?.ssr
 // 每次 transform 调度过程会有专门的上下文对象，用于合并 SourceMap，后文会介绍
 const ctx = new TransformContext(id, code, inMap as SourceMap)
 ctx.ssr = !!ssr
 for (const plugin of plugins) {
 let result: TransformResult | string | undefined
 try {
 result = await plugin.transform.call(ctx as any, code, id, { ssr })
 } catch (e) {
 ctx.error(e)
 }
 if (!result) continue;
 // 省略 SourceMap 合并的逻辑
 code = result;
 }
 return {
 code,
 map: ctx._getCombinedSourcemap()
 }
 },
 // close 钩子实现省略
}
```

不过值得注意的是，在各种钩子被调用的时候，Vite 会强制将钩子函数的 `this` 绑定为一个上下文对象，如:

```js
const ctx = new Context()
const result = await plugin.load.call(ctx as any, id, { ssr })
```

这个对象究竟是用来干什么的呢？

我们知道，在 Rollup 钩子函数中，我们可以调用 `this.emitFile` 、 `this.resolve` 等诸多的上下文方法([详情地址](https://rollupjs.org/plugin-development/#plugin-context))，因此，Vite 除了要模拟各个插件的执行流程，还需要模拟插件执行的上下文对象，代码中的 Context 对象就是用来完成这件事情的。我们来看看 Context 对象的具体实现:

```js
import { RollupPluginContext } from 'rollup';
type PluginContext = Omit<
 RollupPluginContext,
 // not documented
 | 'cache'
 // deprecated
 | 'emitAsset'
 | 'emitChunk'
 | 'getAssetFileName'
 | 'getChunkFileName'
 | 'isExternal'
 | 'moduleIds'
 | 'resolveId'
 | 'load'
>
const watchFiles = new Set<string>()
class Context implements PluginContext {
 // 实现各种上下文方法
 // 解析模块 AST(调用 acorn)
 parse(code: string, opts: any = {}) {
 return parser.parse(code, {
 sourceType: 'module',
 ecmaVersion: 'latest',
 locations: true,
 ...opts
 })
 }
 // 解析模块路径
 async resolve(
 id: string,
 importer?: string,
 options?: { skipSelf?: boolean }
 ) {
 let skip: Set<Plugin> | undefined
 if (options?.skipSelf && this._activePlugin) {
 skip = new Set(this._resolveSkips)
 skip.add(this._activePlugin)
 }
 let out = await container.resolveId(id, importer, { skip, ssr: this.ssr })
 if (typeof out === 'string') out = { id: out }
 return out as ResolvedId | null
 }
 // 以下两个方法均从 Vite 的模块依赖图中获取相关的信息
 // 我们将在下一节详细介绍模块依赖图，本节不做展开
 getModuleInfo(id: string) {
 return getModuleInfo(id)
 }
 getModuleIds() {
 return moduleGraph
 ? moduleGraph.idToModuleMap.keys()
 : Array.prototype[Symbol.iterator]()
 }

 // 记录开发阶段 watch 的文件
 addWatchFile(id: string) {
 watchFiles.add(id)
 ;(this._addedImports || (this._addedImports = new Set())).add(id)
 if (watcher) ensureWatchedFile(watcher, id, root)
 }
 getWatchFiles() {
 return [...watchFiles]
 }

 warn() {
 // 打印 warning 信息
 }

 error() {
 // 打印 error 信息
 }

 // 其它方法只是声明，并没有具体实现，这里就省略了
}
```

很显然，Vite 将 Rollup 的 PluginContext 对象重新实现了一遍，因为只是开发阶段用到，所以去除了一些打包相关的方法实现。同时，上下文对象与 Vite 开发阶段的 ModuleGraph 即模块依赖图相结合，是为了实现开发时的 HMR。 HMR 实现的细节，我们将在下一节展开介绍。

另外，transform 钩子也会绑定一个插件上下文对象，不过这个对象和其它钩子不同，实现代码精简如下:

```js
class TransformContext extends Context {
 constructor(filename: string, code: string, inMap?: SourceMap | string) {
 super()
 this.filename = filename
 this.originalCode = code
 if (inMap) {
 this.sourcemapChain.push(inMap)
 }
 }
 _getCombinedSourcemap(createIfNull = false) {
 return this.combinedMap
 }
 getCombinedSourcemap() {
 return this._getCombinedSourcemap(true) as SourceMap
 }
}
```

可以看到， `TransformContext` 继承自之前所说的 `Context` 对象，也就是说 transform 钩子的上下文对象相比其它钩子只是做了一些扩展，增加了 sourcemap 合并的功能，将不同插件的 transform 钩子执行后返回的 sourcemap 进行合并，以保证 sourcemap 的准确性和完整性。

### 插件工作流概览

在分析配置解析服务的小节中，我们提到过生成插件流水线即 `resolvePlugins` 的逻辑，但没有具体展开，这里我们就来详细拆解一下 Vite 在这一步究竟做了啥。

让我们把目光集中在 `resolvePlugins` 的[实现](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/index.ts#L22)上，Vite 所有的插件就是在这里被收集起来的。具体实现如下:

```js
export async function resolvePlugins(
 config: ResolvedConfig,
 prePlugins: Plugin[],
 normalPlugins: Plugin[],
 postPlugins: Plugin[]
): Promise<Plugin[]> {
 const isBuild = config.command === 'build'
 // 收集生产环境构建的插件，后文会介绍
 const buildPlugins = isBuild
 ? (await import('../build')).resolveBuildPlugins(config)
 : { pre: [], post: [] }
 return [
 // 1. 别名插件
 isBuild ? null : preAliasPlugin(),
 aliasPlugin({ entries: config.resolve.alias }),
 // 2. 用户自定义 pre 插件(带有`enforce: "pre"`属性)
 ...prePlugins,
 // 3. Vite 核心构建插件
 // 数量比较多，暂时省略代码
 // 4. 用户插件（不带有 `enforce` 属性）
 ...normalPlugins,
 // 5. Vite 生产环境插件 & 用户插件(带有 `enforce: "post"`属性)
 definePlugin(config),
 cssPostPlugin(config),
 ...buildPlugins.pre,
 ...postPlugins,
 ...buildPlugins.post,
 // 6. 一些开发阶段特有的插件
 ...(isBuild
 ? []
 : [clientInjectionsPlugin(config), importAnalysisPlugin(config)])
 ].filter(Boolean) as Plugin[]
}
```

从上述代码中我们可以总结出 Vite 插件的具体执行顺序。

- 别名插件包括 ·vite:pre-alias 和 `@rollup/plugin-alias` ，用于路径别名替换。用户自定义 pre 插件，也就是带有 enforce: "pre" 属性的自定义插件。
- Vite 核心构建插件，这部分插件为 Vite 的核心编译插件，数量比较多，我们在下部分一一拆解。
- 用户自定义的普通插件，即不带有 enforce 属性的自定义插件。
- Vite 生产环境插件和用户插件中带有 enforce: "post" 属性的插件。
- 一些开发阶段特有的插件，包括环境变量注入插件 clientInjectionsPlugin 和 import 语句分析及重写插件 importAnalysisPlugin 。

那么，在执行过程中 Vite 到底应用了哪些插件，以及这些插件内部究竟做了什么？我们来一一梳理一下。

### 插件功能梳理

除用户自定义插件之外，我们需要梳理的 Vite 内置插件有下面这几类:

- 别名插件
- 核心构建插件
- 生产环境特有插件
- 开发环境特有插件

#### 1.别名插件

别名插件有两个，分别是 `vite:pre-alias` 和 `@rollup/plugin-alias`。前者主要是为了将 bare import 路径重定向到预构建依赖的路径，如:

```js
// 假设 React 已经过 Vite 预构建
import React from 'react'
// 会被重定向到预构建产物的路径
import React from '/node_modules/.vite/react.js'
```

后者则是实现了比较通用的路径别名(即 resolve.alias 配置)的功能，使用的是 [Rollup 官方 Alias 插件](https://github.com/rollup/plugins/tree/master/packages/alias#rollupplugin-alias)

#### 2.核心构建插件

##### 2.1 module preload 特性的 Polyfill

当你在 Vite 配置文件中开启下面这个配置时：

```js
{
  build: {
    polyfillModulePreload: true
  }
}
```

Vite 会自动应用 `modulePreloadPolyfillPlugin` 插件，在产物中注入 module preload 的 Polyfill 代码，[具体实现](https://github.com/vitejs/vite/blob/2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0/packages/vite/src/node/plugins/modulePreloadPolyfill.ts#L7)摘自之前我们提到过的 es-module-shims 这个库，实现原理如下:

扫描出当前所有的 modulepreload 标签，拿到 link 标签对应的地址，通过执行 fetch 实现预加载；

同时通过 MutationObserver 监听 DOM 的变化，一旦发现包含 modulepreload 属性的 link 标签，则同样通过 fetch 请求实现预加载。

> 由于部分支持原生 ESM 的浏览器并不支持 module preload，因此某些情况下需要注入相应的 polyfill 进行降级。

##### 2.2 路径解析插件

路径解析插件(即 `vite:resolve` )是 Vite 中比较核心的插件，几乎所有重要的 Vite 特性都离不开这个插件的实现，诸如依赖预构建、HMR、SSR 等等。同时它也是实现相当复杂的插件，一方面实现了 Node.js 官方的 resolve 算法，另一方面需要支持前面所说的各项特性，可以说是专门给 Vite 实现了一套路径解析算法。

##### 2.3 内联脚本加载插件

对于 HTML 中的内联脚本，Vite 会通过 `vite:html-inline-script-proxy` 插件来进行加载。比如下面这个 script 标签:

```js
<script type="module">import React from 'react'; console.log(React)</script>
```

这些内容会在后续的 `build-html` 插件从 HTML 代码中剔除，并且变成下面的这一行代码插入到项目入口模块的代码中:

```js
import '/User/xxx/vite-app/index.html?http-proxy&index=0.js'
```

而 `vite:html-inline-script-proxy` 就是用来加载这样的模块，实现如下:

```js
const htmlProxyRE = /\?html-proxy&index=(\d+)\.js$/
export function htmlInlineScriptProxyPlugin(config: ResolvedConfig): Plugin {
 return {
 name: 'vite:html-inline-script-proxy',
 load(id) {
 const proxyMatch = id.match(htmlProxyRE)
 if (proxyMatch) {
 const index = Number(proxyMatch[1])
 const file = cleanUrl(id)
 const url = file.replace(normalizePath(config.root), '')
 // 内联脚本的内容会被记录在 htmlProxyMap 这个表中
 const result = htmlProxyMap.get(config)!.get(url)![index]
 if (typeof result === 'string') {
 // 加载脚本的具体内容
 return result
 } else {
 throw new Error(`No matching HTML proxy module found from ${id}`)
 }
 }
 }
 }
}
```

##### 2.4 CSS 编译插件

即名为 `vite:css` 的插件，主要实现下面这些功能：

- CSS 预处理器的编译
- CSS Modules
- Postcss 编译
- 通过@import 记录依赖，便于 HMR

这个插件的核心在于 `compileCSS` 函数的实现，可以阅读下[源码](https://github.com/vitejs/vite/blob/2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0/packages/vite/src/node/plugins/css.ts#L568)

##### 2.5 Esbuild 转译插件

即名为 `vite:esbuild` 的插件，用来进行` .js` 、 `.ts` 、 `.jsx` 和 `tsx` ，代替了传统的Babel 或者 TSC 的功能，这也是 Vite 开发阶段性能强悍的一个原因。插件中主要的逻辑是 `transformWithEsbuild` 函数，顾名思义，你可以通过这个函数进行代码转译。当然，Vite 本身也导出了这个函数，作为一种通用的 transform 能力，你可以这样来使用:

```js
import { transformWithEsbuild } from 'vite'
// 传入两个参数: code, filename
transformWithEsbuild('<h1>hello</h1>', './index.tsx').then(res => {
  // {
  // warnings: [],
  // code: '/* @__PURE__ */ React.createElement("h1", null, "hello");\n',
  // map: {/* sourcemap 信息 */}
  // }
  console.log(res)
})
```

##### 2.6 静态资源加载插件

静态资源加载插件包括如下几个:

- vite:json 用来加载 JSON 文件，通过 `@rollup/pluginutils` 的 `dataToEsm` 方法可实现 JSON 的按名导入，具体实现见[链接](https://github.com/vitejs/vite/blob/2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0/packages/vite/src/node/plugins/json.ts#L30)
- vite:wasm 用来加载 .wasm 格式的文件，具体实现见[链接](https://github.com/vitejs/vite/blob/2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0/packages/vite/src/node/plugins/wasm.ts#L45)
- vite:worker 用来 Web Worker 脚本，插件内部会使用 Rollup 对 Worker 脚本进行打包，具体实现见[链接](https://github.com/vitejs/vite/blob/2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0/packages/vite/src/node/plugins/worker.ts)
- vite:asset，开发阶段实现了其他格式静态资源的加载，而生产环境会通过 `renderChunk` 钩子将静态资源地址重写为产物的文件地址，如 `./img.png` 重写为 https://cdn.xxx.com/assets/img.91ee297e.png

值得注意的是，Rollup 本身存在 [asset cascade](https://bundlers.tooling.report/hashing/asset-cascade/) 问题，即静态资源哈希更新，引用它的 JS 的哈希并没有更新([issue 链接](https://github.com/rollup/rollup/issues/3415))。因此 Vite 在静态资源处理的时候，并没有交给 Rollup 生成资源哈希，而是自己根据资源内容生成哈希([源码实现](https://github.com/vitejs/vite/blob/2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0/packages/vite/src/node/plugins/asset.ts#L306))，并手动进行路径重写，以此避免 asset-cascade 问题。

#### 3.生产环境特有插件

##### 3.1 全局变量替换插件

提供全局变量替换功能，如下面的这个配置:

```js
// vite.config.ts
const version = '2.0.0'
export default {
  define: {
    __APP_VERSION__: `JSON.stringify(${version})`
  }
}
```

全局变量替换的功能和我们之前在 Rollup 插件小节中提到的 [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace) 差不多，当然在实现上 Vite 会有所区别:

- 开发环境下，Vite 会通过将所有的全局变量挂载到 `window` 对象，而不用经过 define 插件的处理，节省编译开销
- 生产环境下，Vite 会使用[ define 插件](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/define.ts)，进行字符串替换以及 sourcemap 生成。

> 特殊情况: SSR 构建会在开发环境经过这个插件，仅替换字符串

##### 3.2 CSS 后处理器

CSS 后处理插件即 `name` 为 `vite:css-post` 的插件，它的功能包括`开发阶段 CSS 响应结果处理`和`生产环境 CSS 文件生成`

首先，在开发阶段，这个插件会将之前的 CSS 编译插件处理后的结果，包装成一个 ESM 模块，返回给浏览器，[点击查看实现代码](https://github.com/vitejs/vite/blob/2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0/packages/vite/src/node/plugins/css.ts#L284)

其次，生产环境中，Vite 默认会通过这个插件进行 CSS 的 code splitting，即对于每个异步 chunk，Vite 会将其依赖的 CSS 代码单独打包成一个文件，关键代码如下[源码链接](https://github.com/vitejs/vite/blob/2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0/packages/vite/src/node/plugins/css.ts#L400)

```js
const fileHandle = this.emitFile({
  name: chunk.name + '.css',
  type: 'asset',
  source: chunkCSS
})
```

如果 CSS 的 code splitting 功能被关闭(通过 ` build.cssCodeSplit` 配置)，那么 Vite 会将所有的 CSS 代码打包到同一个 CSS 文件中，[点击查看实现](https://github.com/vitejs/vite/blob/2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0/packages/vite/src/node/plugins/css.ts#L433)。

最后，插件会调用 Esbuild 对 CSS 进行压缩，实现在 minifyCSS 函数中，[点击查看实现](https://github.com/vitejs/vite/blob/2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0/packages/vite/src/node/plugins/css.ts#L905)。

##### 3.3HTML 构建插件

`HTML` 构建插件即` build-html`插件。之前我们在`内联脚本加载插件`中提到过，项目根目
录下的 html 会转换为一段 JavaScript 代码，如下面的这个例子:

```js
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta http-equiv="X-UA-Compatible" content="IE=edge">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Document</title>
</head>
<body>
 // 普通方式引入
 <script src="./index.ts"></script>
 // 内联脚本
 <script type="module">
 import React from 'react';
 console.log(React)
 </script>
</body>
</html>
```

首先，当 Vite 在生产环境 transform 这段入口 HTML 时，会做 3 件事情:

对 HTML 执行各个插件中带有 enforce: "pre" 属性的 transformIndexHtml 钩子

> 我们知道插件本身可以带有 `enforce: "pre"|"post"` 属性，而 transformIndexHtml 本身也可以带有这个属性，用于在不同的阶段进行 HTML 转换。后文会介绍 transformIndexHtml 钩子带有 `enforce: "post"` 时的执行时机。

将其中的 script 标签内容删除，并将其转换为 `import 语句`如`import'./index.ts'`，并记录下来；

在 transform 钩子中返回记录下来的 import 内容，将 import 语句作为模块内容进行加载。也就是说，虽然 Vite 处理的是一个 HTML 文件，但最后进行打包的内容却是一段 JS 的内容，[点击查看具体实现](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/html.ts#L233)。代码简化后如下所示:

```js
export function buildHtmlPlugin() {
 name: 'vite:build',
 transform(html, id) {
 if (id.endsWith('.html')) {
 let js = '';
 // 省略 HTML AST 遍历过程(通过 @vue/compiler-dom 实现)
 // 收集 script 标签，转换成 import 语句，拼接到 js 字符串中
 return js;
 }
 }
}
```

其次，在生成产物的最后一步即 generateBundle 钩子中，拿到入口 Chunk，分析入口 Chunk 的内容, 分情况进行处理。

如果只有 import 语句，先通过 Rollup 提供的 `chunk` 和 `bundle` 对象获取入口 chunk 所有的依赖 chunk，并将这些 chunk 进行后序排列，如 `a 依赖 b`，`b 依赖 c` ，最后的依赖数组就是 [c,b,a] 。然后依次将 c，b, a 生成三个 script 标签，插入 HTML 中。最后，Vite 会将入口 chunk 的内容从 bundle 产物中移除，因此它的内容只要 import 语句，而它 import 的 chunk 已经作为 script 标签插入到了 HTML 中，那入口 Chunk 的存在也就没有意义了。

如果除了 import 语句，还有其它内容， Vite 就会将入口 Chunk 单独生成一个 `script标签` ，分析出依赖的后序排列(和上一种情况分析手段一样)，然后通过注入 `<linkrel="modulepreload">` 标签对入口文件的依赖 chunk 进行预加载。

最后，插件会调用用户插件中带有 `enforce: "post"` 属性的 transformIndexHtml 钩子，对 HTML 进行进一步的处理。[点击查看具体实现](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/html.ts#L471)。

##### 3.3 CommonJS 转换插件

我们知道，在开发环境中，Vite 使用 Esbuild 将 Commonjs 转换为 ESM，而生产环境中，Vite 会直接使用 Rollup 的官方插件 [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs)。

##### 3.4 date-uri 插件

date-uri 插件用来支持 import 模块中含有 Base64 编码的情况，如:

```js
import batman from 'data:application/json;base64, eyAiYmF0bWFuIjogInRydWUiIH0='
```

[点击查看实现](https://github.com/vitejs/vite/blob/2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0/packages/vite/src/node/plugins/dataUri.ts#L14)

##### 3.5 dynamic-import-vars 插件

用于支持在动态 import 中使用变量的功能，如下示例代码:

```js
function importLocale(locale) {
  return import(`./locales/${locale}.js`)
}
```

内部使用的是 Rollup 的官方插件 [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars)。

##### 3.6 import-meta-url 支持插件

用来转换如下格式的资源 URL:

```js
new URL('./foo.png', import.meta.url)
```

将其转换为生产环境的 URL 格式，如:

```js
// 使用 self.location 来保证低版本浏览器和 Web Worker 环境的兼容性
new URL('./assets.a4b3d56d.png, self.location)
```

同时，对于动态 import 的情况也能进行支持，如下面的这种写法:

```js
function getImageUrl(name) {
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

Vite 识别到 `./dir/${name}.png` 这样的模板字符串，会将整行代码转换成下面这样:

```js
function getImageUrl(name) {
  return import.meta.globEager('./dir/**.png')[`./dir/${name}.png`].default
}
```

[点击查看具体实现](https://github.com/vitejs/vite/blob/2b7e836f84b56b5f3dc81e0f5f161a9b5f9154c0/packages/vite/src/node/plugins/assetImportMetaUrl.ts#L18)
