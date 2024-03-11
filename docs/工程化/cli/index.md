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
    cli.command(command, desc).action(action).allowUnknownOptions()
  }

  cli.parse()
}
```

其中`allowUnknownOptions()`这个命令是为了让我们命令行输入未定义的命令不报错，如果没有这个函数执行，当输入未知的命令的时候，cli将会报错。

以下为各个命令的解析：

### git-commit命令

git-commit命令主要接受了两个参数：一个是我们定义的提交类型，一个是我们定义的提交范围。

git-commit主要是通过`enquirer`库来生成选择器和输入信息，当这些信息都输入完之后，我们通过字符串拼接将其拼接成一个字符串，然后通过执行git commit -m <字符串>来提交这些信息。

```js
export async function gitCommit(
  gitCommitTypes: CliOption['gitCommitTypes'],
  gitCommitScopes: CliOption['gitCommitScopes']
) {
  const typesChoices = gitCommitTypes.map(([name, title]) => {
    const nameWithSuffix = `${name}:`
    const message = `${nameWithSuffix.padEnd(12)}${title}`
    return {
      name,
      message
    }
  })
  const scopesChoices = gitCommitScopes.map(([name, title]) => ({
    name,
    message: `${name.padEnd(30)} (${title})`
  }))
  const result = await enquirer.prompt<PromptObject>([
    {
      name: 'types',
      type: 'select',
      message: '请选择提交的类型',
      choices: typesChoices
    },
    {
      name: 'scopes',
      type: 'select',
      message: '选择一个scope',
      choices: scopesChoices
    },
    {
      name: 'description',
      type: 'text',
      message: '请输入提交描述',
    }
  ])
  const commitMsg = `${result.types}(${result.scopes}): ${result.description}`
  await execCommand('git', ['commit', '-m', commitMsg], {stdio: 'inherit'})
}
```

execCommand方法是封装的一个主要执行各种命令的方法,通过`execa`这个库来执行各种命令：

```js
import type {Options} from 'execa'

export async function execCommand(cmd: string, args: string[], options?: Options) {
  const {execa} = await import ('execa')
  const res = await execa(cmd, args, options)
  return res?.stdout?.trim() || ''
}
```

### init-simple-git-hooks命令

此命令的作用是为了生成git hooks文件夹的。

此命令执行的时候主要做了以下几件事：

- 先在项目根目录中获取下.husky文件夹
- 判断下.husky这个目录存在不存在
- 然后获取下项目根目录的.git文件夹下面的hooks文件夹
- 如果.husky文件夹存在的话就将`core.hooksPath`配置为.husky,git运行的时候将查找位于当前工作目录下的 .husky 文件夹中的钩子文件
- 然后清空git的hooks文件夹，执行`npx simple-git-hooks`命令

```js
export async function initSimpleGitHooks(cwd = process.cwd()) {
  // 获取.husky文件夹路径
  const huskyDir = path.join(cwd, '.husky')
  // 判断目录存在不存在
  const existHusky = existsSync(huskyDir)
  // 获取git/hooks目录路径
  const gitHooksDir = path.join(cwd, 'git', 'hooks')
  // 如果.husky目录存在的话,就把这个目录设置为git的hooks目录
  if (existHusky) {
    await rimraf(huskyDir)
    await execCommand('git', ['config', 'core.hooksPath', gitHooksDir], { stdio: 'inherit' })
  }

  // 先清空目录
  await rimraf(gitHooksDir)
  await execCommand('npx', ['simple-git-hooks'], { stdio: 'inherit' })
}
```

**注意：**

此命令需要在执行 `pnpm install` 的时候就对项目进行 hooks 初始化，所以我们需要在项目的 scripts 里面写上 `"prepare": "dy init-simple-git-hooks"`,此命令主要是在初始化的时候执行此命令初始化

并且需要提前安装开发依赖：`simple-git-hooks`

另外还需在`.package.json`里面配置如下选项：

```json
{
  "devDependencies":{
    ...
  },
  "simple-git-hooks": {
    "commit-msg": "pnpm dy git-commit-verify",
    "pre-commit": "pnpm dy lint-staged"
  }
}
```

这样在每次执行git-commit的时候就会执行上面的两个命令。

### git-commit-verify命令

这个命令实在每次执行git-commit的时候校验提交的commit信息是否符合规范，如果不符合规范的话就抛出错误，符合规范的话就继续执行。

```js
export async function gitCommitVerify() {
  // 获取目录 C:/Users/my466/Desktop/git-demo
  const gitPath = await execCommand('git', ['rev-parse', '--show-toplevel'])
  // 获取当前目录下的.git文件夹下面的COMMIT_EDITMSG文件
  const gitMsgPath = path.join(gitPath, '.git', 'COMMIT_EDITMSG')
  // feat(projects)：kkk  获取的是最后一次的提交信息
  const commitMsg = readFileSync(gitMsgPath, 'utf-8').trim()
  const REG_EXP = /(?<type>[a-z]+)(\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i
  if (!REG_EXP.test(commitMsg)) {
    throw new Error(
      `${bgRed(' ERROR ')} ${red('Git提交信息不符合 Angular 规范!\n\n')}${green(
        '推荐使用命令 pnpm commit 生成符合规范的Git提交信息'
      )}`
    )
  }
}
```

### lint-staged命令

这个命令是为了执行 `lint-staged` 的，`lint-staged` 是一个前端的文件过滤工具，它仅过滤 git 代码暂存区文件，当执行 git-commit 的时候，`pre-commit` 狗子会启动，执行 `lint-staged` 命令。

````js
export async function execLintStaged(config: Record<string, string | string[]>) {
  const lintStaged = (await import('lint-staged')).default

  return lintStaged({
    config,
    allowEmpty: true
  })
}```

传入的参数为：

```js
action:async ()=>{
    const passed = await       execLintStaged(cliOptions.lintStagedConfig).catch(() => {
    process.exitCode = 1
    })
    process.exitCode = passed ? 0 : 1
}
````

### cleanup 命令

此命令的主要作用是为了删除 `node_modules` 和 `dist` 等的文件夹。

````js
import {rimraf} from "rimraf"

export async function cleanup(paths: string[]) {
  await rimraf(paths, {glob: true})
}```

传入的参数为：

````

// 执行清空依赖项命令后需要删除的文件夹
cleanupDirs: [
'**/dist',
'**/package-lock.json',
'**/yarn.lock',
'**/pnpm-lock.yaml',
'**/node_modules',
'!node_modules/**'
]

````

### prettier-write 命令

此命令的作用是执行 `prettier` 命令，并且传入设置好的参数，格式化那些文件夹。

**注意：**

这个 `prettier` 命令并不会格式化我们常用的 vue、ts、js 等文件夹，这些文件夹的格式化交给了 `eslint`

```js
import {execCommand} from "../shared";

export async function prettierWrite(writeGlob: string[]) {
  await execCommand('npx', ['prettier', '--write', '.', ...writeGlob], {
    stdio: 'inherit'
  })
}```

它的参数不包含我们常用的文件夹和不需要格式化的文件夹：

```js
const eslintExt = '*.{js,jsx,mjs,cjs,json,ts,tsx,mts,cts,vue,svelte,astro}'
prettierWriteGlob: [
    `!**/${eslintExt}`,
    '!*.min.*',
    '!CHANGELOG.md',
    '!dist',
    '!LICENSE*',
    '!output',
    '!coverage',
    '!public',
    '!temp',
    '!package-lock.json',
    '!pnpm-lock.yaml',
    '!yarn.lock',
    '!.github',
    '!__snapshots__',
    '!node_modules'
  ]```

### taze 命令

这个命令主要是执行 `taze` 命令，用来升级各种的依赖包。

```js
import { execCommand } from "../shared";

export async function taze() {
  const args=process.argv.slice(3)
  execCommand("npx", ["taze", ...args], { stdio: "inherit" });
}
````

`taze` 的命令跟在命令行的后面即可。这就是我们需要使用 `process.argv.slice` 截取的意思，从第三个参数后面的就是 `taze` 的参数。

### changelog 命令

这个命令主要是为了生成 `changelog.md` 文件。因为方法比较多，就另外写了一个包 `@dylanjs/changelog`，这个包以后再讲。

````js
import { generateChangelog, generateTotalChangelog } from '@dylanjs/changelog';
import type { ChangelogOption } from '@dylanjs/changelog';

export async function genChangelog(options?: Partial<ChangelogOption>, total = false) {
  if (total) {
    await generateTotalChangelog(options);
  } else {
    await generateChangelog(options);
  }
}```

如果有参数也就是穿 `--total` 的时候，会根据所有的 tag 生成所有的 changelog，而不传的话则会生成最后一个 tag 的 changelog。

### release 命令

这个命令的主要作用是使用 `bumpp` 包自动生成版本号、tag，自动提交等等的动作,，也可以自行一些自定义的命令：

```js
import versionBump from 'bumpp';

export async function release() {
  await versionBump({
    files: ['**/package.json', '!**/node_modules'],
    execute: 'npx dy changelog',
    all: true,
    tag: true,
    commit: 'chore(projects): release v%s',
    push: true
  });
}
````
