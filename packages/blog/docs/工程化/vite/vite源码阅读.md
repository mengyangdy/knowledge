---
title:
---
# vite 源码阅读

## 配置文件在 Vite 内部的处理

### 流程梳理

我们先来梳理整体的流程，Vite 中的配置解析由 [resolveConfig]( https://github.com/vitejs/vite/blob/main/packages/vite/src/node/config.ts#L255 ) 函数来实现，你可以对照源码一起学习。

#### 1.加载配置文件

进行一些必要的变量声明后，我们进入到解析配置逻辑中：

```js
let { configFile } = config
if (configFile !== false) {
 // 默认都会走到下面加载配置文件的逻辑，除非你手动指定 configFile 为 false
 const loadResult = await loadConfigFromFile(
 configEnv,
 configFile,
 config.root,
 config.logLevel
 )
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
const resolvedRoot = normalizePath(
 config.root ? path.resolve(config.root) : process.cwd()
)
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
const envDir = config.envDir
 ? normalizePath(path.resolve(resolvedRoot, config.envDir))
 : resolvedRoot
const userEnv =
 inlineConfig.envFile !== false &&
 loadEnv(mode, envDir, resolveEnvPrefix(config))
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
const assetsFilter = config.assetsInclude
 ? createFilter(config.assetsInclude)
 : () => false
```

Vite 后面会将用户传入的 assetsInclude 和内置的规则合并:

```js
assetsInclude(file: string) {
 return DEFAULT_ASSETS_RE.test(file) || assetsFilter(file)
}
```

这个配置决定是否让 Vite 将对应的后缀名视为 `静态资源文件` （asset）来处理。

#### 路径解析器工厂

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
 ? path.resolve(
 resolvedRoot,
 typeof publicDir === 'string' ? publicDir : 'public'
 )
 : ''
```

至此，配置已经基本上解析完成，最后通过 resolved 对象来整理一下:

