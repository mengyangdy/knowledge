---
title: 制作自己的脚手架cli
tag:
  - 脚手架
  - cli
date: 2023-09-01
cover: https://s2.loli.net/2023/09/01/714nHtUfrzYWSqJ.jpg
---

# 制作自己的脚手架 cli

> 在现在的前端开发中，CLI（Command Line Interface）脚手架已经成为了提高效率、规范团队开发的一个重要工具。通过预设不同的功能，为项目提供了一致性和高质量的开发体验。

## 脚手架第三方依赖

```txt
- bumpp 版本控制工具，用于更新npm包的时候生成友好和可定制的版本变更信息，也可以在运行中执行git tag、git push或自定义命令
- enquirer 与prompts/inquirer同为实现命令行交互界面的工具。比如：输入、密码、上下选择等
- execa 用于替代Node.js中原生的child_precess模块，用于执行外部命令
- kolorist  一个简单的输出各种文字颜色、背景颜色的苦
- c12  用于合并加载各种配置的库
- cac  用于构建cli应用的库，与commander、yargs同为构建命令行工具
- lint-staged  对暂存区（git add .）的文件执行脚本、检测、校验
- npm-check-updates 检查项目package版本是否有更新的工具库
- rimraf  以包的方式包装rm -rf命令，用来删除文件和文件夹，无论文件夹是否为空，都可以删除
- ofetch  一个好用的fetchAPI，可以用于Node.js/浏览器/workers上
- cli-progress  显示进度条的工具，与progress功能类似
- convert-gitmoji  将字符串转化为图标
```

## 初始化项目

我们使用 pnpm 的 workspace 来生成 monorepo 工程文件夹。
monorepo 风格的工程可以包含有多个子工程，且每个子工程都可以独立编译打包然后发布到 npm。

1. 新建文件夹执行`pnpm init` 命令进行初始化项目
2. 在新建的项目根目录创建pnpm-workspace.yaml文件并写入以下命令：

```yaml
packages:
  - 'packages/*'
```

3. 在项目根目录中创建packages文件夹，此文件夹下的每一个目录都是一个子工程

### 编写入口文件

在packages中创建cli文件夹并通过`pnpm init`初始化文件夹，在cli中创建src/index.ts文件作为入口文件。

入口文件的第一行要写上`#!/usr/bin/env node`标识，这行命令是为了告诉操作系统用node环境执行文件。

```JavaScript
#!/usr/bin/env node

console.log('cli 第一行的打印')
```

我们经常在命令行执行的命令vite、vue等都是在package.sjon中的bin字段配置的。

```json
"bin": {
  "dylan": "dist/index.cjs",
  "dy": "dist/index.cjs"
  },
```

当我们在命令行中执行dy命令的时候将会查找dist/index.cjs文件进行执行。

### 本地调试

在项目目录中运行`npm link`命令把当前项目中的package.json文件中的`bin`字段连接到全局变量，这样我们就可以在没有发布npm包的时候本地调用`dy`命令调试了。

### 打包

如果需要打包的话`dy`命令指向打包后的文件，如果不需要打包直接指向`src/index.ts`文件即可。

每次只有打包后的文件为最新的，所以为了我们调试方便，我们可以使用打包工具`unbuild`的`--stub`命令来执行一下，这样我们打包后的`dist/index.cjs`文件并不是最新的文件，而是指向`src/index.ts`文件，这样我们就不用每次更新代码后打包下文件，只需要发布的时候打包一下即可。

## 第一个脚手架

> 制作这个脚手架的目的主要是为了聚合工作中常用的一些命令，比如：ESLint、Prettier、git hooks等等。

### 项目目录

```txt
├─build.config.ts   //打包配置
├─CHANGELOG.md      //自动生成的更新日志
├─package.json      //配置文件
├─tsconfig.json     //TS配置
├─typings           //类型文件
|    └pkg.d.ts      //lint-staged类型文件
├─src               //入口文件
|  └index.ts
├─lib               //项目
|  ├─index.ts
|  ├─types         //类型文件
|  |   └index.ts
|  ├─shared        //工具文件
|  |   └index.ts
|  ├─config        //生成的默认配置
|  |   └index.ts
|  ├─command       //各种命令的执行函数
|  |    ├─cleanup.ts
|  |    ├─gen-changelog.ts
|  |    ├─git-commit-verify.ts
|  |    ├─git-commit.ts
|  |    ├─index.ts
|  |    ├─init-simple-git-hooks.ts
|  |    ├─lint-staged.ts
|  |    ├─ncu.ts
|  |    ├─prettier-white.ts
|  |    └release.ts
```

### 入口函数setupCli

`lib/index.ts`中其实只执行了setupCli函数，我们来看下setupCli做了什么事情：

```JavaScript
export async function setupCli() {
  //获取默认的配置，例如：cwd=process.cwd()获取当前项目所在的目录、git commit提交的类型、提交的范围 prettier执行的范围等等
  const cliOptions = await loadCliOptions()
  // 构建cli命令程序，传入当前版本加上--help参数等
  const cli = cac('dylan')
  cli
    .version(version)
    .option('--total', 'Generate changelog by total tags')
    .help()
  //需要执行的各种参数写在一起到下面循环执行
  const commands: CommandWithAction<CommandArg> = {
    'git-commit': {
      desc: '生成符合 Conventional Commits 规范的提交信息',
      action: async () => {
        await gitCommit(cliOptions.gitCommitTypes, cliOptions.gitCommitScopes)
      }
    },
    'git-commit-verify': {
      desc: "校验 git 提交信息是否符合 Conventional Commits 规范",
      action: async () => {
        await gitCommitVerify()
      }
    },
    cleanup: {
      desc: '清空依赖项和构建文件',
      action: async () => {
        await cleanup(cliOptions.cleanupDirs)
      }
    },
    'init-simple-git-hooks': {
      desc: '初始化 simple-git-hooks 钩子',
      action: async () => {
        await initSimpleGitHooks(cliOptions.cwd)
      }
    },
    ncu: {
      desc: '命令 npm-check-updates，升级依赖',
      action: async () => {
        await ncu(cliOptions.ncuCommandArgs)
      }
    },
    'prettier-write': {
      desc: "执行 prettier --write 格式化",
      action: async () => {
        await prettierWrite(cliOptions.prettierWriteGlob)
      }
    },
    "lint-staged": {
      desc: '执行lint-staged',
      action: async () => {
        const passed = await execLintStaged(cliOptions.lintStagedConfig).catch(() => {
          process.exitCode = 1
        })
        process.exitCode = passed ? 0 : 1
      }
    },
    'changelog': {
      desc: "生成changelog",
      action: async (args) => {

        await genChangelog(cliOptions.changelogOptions, args?.total)
      }
    },
    release:{
      desc:'发布：更新版本号、生成changelog、提交代码',
      action:release
    }
  }
  //循环上面的命令
  for await (const [command, {desc, action}] of Object.entries(commands)) {
    cli.command(command, desc).action(action)
  }

  cli.parse()
}
```
