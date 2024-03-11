---
title: vite中设置环境变量
tags:
  - vite
  - env
date: 2023-09-28
cover: https://s2.loli.net/2023/09/28/9ub4IxODtTi7ZPk.jpg
---

# vite 中设置环境变量

## 什么是环境变量

根据当前的代码环境变化的变量就叫做环境变量，比如在生产环境和开发环境中的 `BASE_URL` 就会设置为不同的值，用来请求不同地址的接口。

环境变量一般都可以在全局访问到，在我们用 webpack 中，经常会看到这样的代码：

```js
// webpack.config.js
module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}
```

`process.env.NODE_ENV` 就是一个环境变量。

> process. env 是 NodeJS 提供的一个 API，返回了一个对象，包含了当前 shell 的所有的环境变量。

## vite 中使用环境变量

### 环境变量和 process.env

首先我们需要知道，环境变量的使用，是由浏览器来识别的，是浏览器根据不同的环境变量进行不同的逻辑判断识别的。

> 在 vue 2 中，webpack 帮我们做了处理，使浏览器可以直接识别到 node 中的 process. env 变量，从而实现了浏览器差识别环境变量的功能。

在 vite 中，我们的代码是运行在浏览器环境中的，因此是无法识别到 `process.env` 的。

`vite.confif.js` 是运行在 node 环境中的，所以在这个文件中是可以识别到的。

### vite 中的环境变量

vite 给我们提供了一个特殊的对象， `import.meta.env` 对象上暴露了我们的环境变量，这个对象上有一些已经定义好的环境变量：

- `import.meta.env.MODE`：应用运行的模式
- `import.meta.env.BASE_URL`：部署应用的基本 URL
- `import.meta.env.PROD`：应用是否运行在生产环境
- `import.meta.env.DEV`：应用是否运行在开发环境（永远与 import. meta, env. PROD 相反）
- `import.meta.env.SSR`：应用是否运行在 server 上

这几项打印出来为：

![](https://s2.loli.net/2023/09/28/VmnGNBj54bawhZp.png)

注意：这些变量是运行在环境中的，vite.config.js 中无法访问这些变量。如果要在 viteConfig 中使用的话需要特殊的处理。

### vite 中自定义环境变量

vite 中内置了 dotenv 这个第三方库，dotenv 会自动读取.env 文件，dotenv 从你的环境目录中的下列文件中加载额外的环境变量：

- .env 所有情况下都会加载
- .env.[mode] 只有在指定模式下加载

默认情况下：

- npm run dev 会加载.env 和.env. development 的配置
- npm run dev 会加载.env 和.env.production 内的配置
- mode 可以通过命令行 --mode 选项来重写

为了防止意外地将一些环境变量泄露出去，只有以 `VITE_` 为前缀的变量才会暴露给 vite 处理

我们在项目的根目录中创建 `.env` 和 `.env.development` 和 `.env.production` 三个文件：在 main 中打印下 `import.meta.env` 先运行下 `pnpm run dev`:

![Snipaste_2023-11-01_10-09-10.png](https://s2.loli.net/2023/11/01/pWtHBbRrsUKQYcV.png)

因为运行 `pnpm run dev` 默认运行的是 env 文件和 env.development 文件

我们再运行下 build 看下打印：

![Snipaste_2023-11-01_10-11-42.png](https://s2.loli.net/2023/11/01/XCDoMyR43wemkpV.png)

可以看到 build 默认运行的是 production 里面的内容

### 加载自定义的 env 文件

我们在项目中除了可以加载开发模式（development）和生产模式（production）以外，还可以加载自定义环境，比如说我们想加载 test 环境的 env 文件：

1. 指定具体运行的 mode 模式

> 具体可以参考官网对 mode 的配置 [https://vitejs.cn/vite3-cn/config/shared-options.html#mode](https://vitejs.cn/vite3-cn/config/shared-options.html#mode)

```json
{
  "scripts": {
    "test": "vite --mode test"
  }
}
```

2. 根目录下创建 `.env.test` 文件并写入变量

```txt
// .env.test
VITE_API='111'
```

### 更改 env 加载的地址

现在我们的 env 文件都是在根目录创建的，如果 env 文件太多的话，会显得我们的目录太乱了,我们也可以专门创建一个文件夹来放置我们的所有的 env 文件：

可以通过 envDir 来配置这个地址，可以参考：[https://vitejs.cn/vite3-cn/config/shared-options.html#envdir](https://vitejs.cn/vite3-cn/config/shared-options.html#envdir)

```js
export default defineConfig({
  envDir: 'env'
})
```

然后，所有的.env.xxx 文件就可以放到了项目根目录下的 env 文件夹下了

### 更改环境变量 vite\_前缀

如果觉得 VITE\_前面不够自定义，我们想更换这个前缀可以使用 `envPrefix` 配置来改变：[https://vitejs.cn/vite3-cn/config/shared-options.html#envdir](https://vitejs.cn/vite3-cn/config/shared-options.html#envdir)
