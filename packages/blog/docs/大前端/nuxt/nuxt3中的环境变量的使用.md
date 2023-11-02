---
title: nuxt3中的环境变量的使用
tags:
  - nuxt3
  - env
date: 2023-09-28
cover: https://s2.loli.net/2023/09/28/XiCqftcskKdZ7mT.jpg
---

# nuxt3中的环境变量的使用

在 nuxt 3 框架中，`.env` 文件会在开发生产的时候自动的加载到项目中，比如我们创建一个 `.env` 文件：

```txt
//.env
NUXT_MY_APP=我的app
```

```js
// nuxt.config.ts
console.log(process.env.NUXT_MY_APP)
```

![Snipaste_2023-11-01_11-32-47.png](https://s2.loli.net/2023/11/01/pO8sZKdaLxeGbX5.png)

但是如果我们在 app.vue 中使用的话是不能使用的，因为 `process.env` 是 node 的一个属性，在浏览器中是不能使用的，如果要在浏览器中使用则需要在 nuxt 的 config 中进行配置：

```js
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      myApp: process.env.NUXT_MY_APP
    }
  }
})
//app.vue
const runtimeConfig = useRuntimeConfig()
console.log('🚀 ~ file: app.vue:9 ~ runtimeConfig:', runtimeConfig)
```

但是在 `nuxt3` 中无无法在 `package.json` 中直接改变环境的 mode

- `nuxt dev` 的 mode 固定是 development
- `nuxt build` 的 mode 是固定的 production

## nuxt 3 中多环境配置

### 使用 vite 的多环境方案

原理为依靠 `vite` 中的 `import.meta.env` 会自动读取 `process.env` 中 `VITE` 开头的 `env` 信息，因此只需要把 `env` 中的信息添加到 `process.env` 里面即可

```js
//nuxt.config.js
import { loadEnv } from 'vite'

const envName = process.env.npm_lifecycle_script.match(/--mode\s(.*)/)?.[1]
const envData = loadEnv(envName, process.cwd())
Object.assign(process.env, envData)
```

```json
{
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "test": "nuxt dev --mode test",
    "pro": "nuxt dev --mode production",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  }
}
```

再项目中使用的时候直接调用 `import.meta.env` 即可获取到变量。

env 文件中的变量需要使用 `VITE` 开头才能读取到。
