/* eslint-disable global-require */
/* eslint-disable prefer-rest-params */
import glob from 'fast-glob'
import matter from 'gray-matter'
import fs from 'fs'
import { execSync, spawn, spawnSync } from 'child_process'
import path from 'path'
import type { SiteConfig, UserConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { formatDate } from '../../utils'
import type { Theme } from './composables/config/index'

import {MermaidMarkdown, MermaidPlugin} from 'vitepress-plugin-mermaid'
import * as https from "https";
import src from "./index";
import {log} from "util";

const checkKeys = ['themeConfig']

export function getThemeConfig(cfg?: Partial<Theme.BlogConfig>) {
  /**
   * process.argv 对象是一个全局变量，它提供了当前nodejs进程的相关信息
   * process.argv 第一个属性是node的执行路径
   * 第二个属性是当前执行js的文件路径
   * 剩余参数是命令行参数
   * 这个是获取到路径
   */

  const srcDir = cfg?.srcDir || process.argv.slice(2)?.[1] || '.'
  //srcDir:docs

  /**
   * glob.sync 用于获取符合特定模式的文件路径
   * https://www.python100.com/html/IY934K6G4WR9.html
   * https://blog.51cto.com/u_15524602/5359163?u_atoken=86e90dff-7c3d-495a-bc5d-b75f7353196d&u_asession=01doymHma6brbZk0HNHS_kc0r5cvUs8jmelSmERq7aQk8yp-ljZCSNz3yRyjm_-JJQX0KNBwm7Lovlpxjd_P_q4JsKWYrT3W_NKPr8w6oU7K9VXxzopFKtoWkzbk0H-PqeoqYap4IcfpCWBPy06QojUWBkFo3NEHBv0PZUm6pbxQU&u_asig=05UHfmQX1ntO6dvjZFc9Yg8KqZDCrh8kZ-C0hvbVTg9D6eosReojsIQ1OmhlTvcJeKo38TIwgRFg0dG19TBD-c1YcfcaahHfhNBLxoCKMlgDkC2APL-uJ6v25FrN-9uRlhimOkBPlzhqT_r0WR6uAv7nTqOBBEAKax2Z9KW2B16LT9JS7q8ZD7Xtz2Ly-b0kmuyAKRFSVJkkdwVUnyHAIJzZ-WHsKuTUaSvMZ65NCkOeXmJZWhaRIFCoPPiv2vwv0kXlXp3azFSZNAdq4krLXsk-3h9VXwMyh6PgyDIVSG1W_kYUPJU85dPVnM8u9Gu-V2xr0WYCw1urewJhJe4X-DGCD9X-uiFSdIqiaRGzCPfsyIFhN-JYTdqSNMi41m3AwlmWspDxyAEEo4kbsryBKb9Q&u_aref=U2493DHCJn5Z8cJL1hB97H16TOo%3D
   *获取到所写的md文件
   */
  const files = glob.sync(`${srcDir}/**/*.md`, { ignore: ['node_modules'] })

  const data = files
    .map((v) => {
      // 处理文件后缀名
      let route = v.replace('.md', '')
      // 去除 srcDir 处理目录名
      if (route.startsWith('./')) {
        route = route.replace(
          new RegExp(`^\\.\\/${path.join(srcDir, '/').replace(new RegExp(`\\${path.sep}`, 'g'), '/')}`), ''
        )
      } else {
        route = route.replace(
          new RegExp(`^${path.join(srcDir, '/').replace(new RegExp(`\\${path.sep}`, 'g'), '/')}`), ''
        )
      }

      //获取到文章的内容
      const fileContent = fs.readFileSync(v, 'utf-8')

      /**
       * data 获取的是文章的头部 --- --- 之间的内容
       */
      const meta: Partial<Theme.PageMeta> = {
        ...matter(fileContent).data
      }
      //如果md文件中--- ---没有写title的话 重新设置下 没写为''
      if (!meta.title) {
        meta.title = getDefaultTitle(fileContent)
      }
      //如果没有写时间的话 获取下提交到git上的时间
      if (!meta.date) {
        meta.date = getFileBirthTime(v)
      } else {
        const timeZone = cfg?.timeZone ?? 8
        meta.date = formatDate(
          new Date(`${new Date(meta.date).toUTCString()}+${timeZone}`)
        )
      }

      // 处理tags
      meta.tags = typeof meta.tags === 'string' ? [meta.tags] : meta.tags

      // @ts-ignore
      meta.tag = [meta.tag || []]
        .flat()
        .concat([
          ...new Set([...(meta.tags || [])])
        ])

      // 获取摘要信息
      //摘要信息获取的有点问题
      const wordCount = 100
      meta.description =
        meta.description || getTextSummary(fileContent, wordCount)
      // 获取封面图
      meta.cover =
        meta.cover ??
        (fileContent.match(/[!]\[.*?\]\((https:\/\/.+)\)/)?.[1] || '')

      // 是否发布 默认发布
      if (meta.publish === false) {
        meta.hidden = true
        meta.recommend = false
      }
      return {
        route: `/${route}`,
        meta
      }
    })
    .filter((v) => v.meta.layout !== 'home')

  const extraConfig: any = {}

  if (
    cfg?.search === 'pagefind' ||
    (cfg?.search instanceof Object && cfg.search.mode === 'pagefind')
  ) {
    checkKeys.push('vite')

    let resolveConfig: any
    extraConfig.vite = {
      plugins: [
        {
          name: '@sugarar/theme-plugin-pagefind',
          enforce: 'pre',
          configResolved(config: any) {
            if (resolveConfig) {
              return
            }
            resolveConfig = config

            const vitepressConfig: SiteConfig = config.vitepress
            if (!vitepressConfig) {
              return
            }

            // 添加 自定义 vitepress 的钩子
            const selfBuildEnd = vitepressConfig.buildEnd
            vitepressConfig.buildEnd = (siteConfig: any) => {
              // 调用自己的
              selfBuildEnd?.(siteConfig)
              // 调用pagefind
              const ignore: string[] = [
                // 侧边栏内容
                'div.aside',
                // 标题锚点
                'a.header-anchor'
              ]
              const { log } = console
              log()
              log('=== pagefind: https://pagefind.app/ ===')
              let command = `npx pagefind --source ${path.join(
                process.argv.slice(2)?.[1] || '.',
                '.vitepress/dist'
              )}`

              if (ignore.length) {
                command += ` --exclude-selectors "${ignore.join(', ')}"`
              }

              log(command)
              log()
              execSync(command, {
                stdio: 'inherit'
              })
            }
          },
          // 添加检索的内容标识
          transform(code: string, id: string) {
            if (id.endsWith('theme-default/Layout.vue')) {
              return code.replace(
                '<VPContent>',
                '<VPContent data-pagefind-body>'
              )
            }
            return code
          }
        }
      ]
    }
  }
  const markdownPlugin: any[] = []
  // tabs支持
  if (cfg?.tabs) {
    markdownPlugin.push(tabsMarkdownPlugin)
  }

  // 流程图支持
  if (cfg) {
    cfg.mermaid = cfg?.mermaid ?? true
  }
  if (cfg?.mermaid !== false) {

    markdownPlugin.push(MermaidMarkdown)
  }

  // 注册markdown插件
  if (markdownPlugin.length) {
    extraConfig.markdown = {
      config(...rest: any[]) {
        markdownPlugin.forEach((plugin) => {
          plugin?.(...rest)
        })
      }
    }
  }
  return {
    themeConfig: {
      blog: {
        pagesData: data as Theme.PageData[],
        ...cfg
      },
      ...(cfg?.blog !== false && cfg?.recommend !== false
        ? {
          sidebar: [
            {
              text: '',
              items: []
            }
          ]
        }
        : undefined)
    },
    ...extraConfig
  }
}

export function getDefaultTitle(content: string) {
  const title =
    clearMatterContent(content)
      .split('\n')
      ?.find((str) => {
        return str.startsWith('# ')
      })
      ?.slice(2)
      .replace(/^\s+|\s+$/g, '') || ''
  return title
}

export function clearMatterContent(content: string) {
  let first___: unknown
  let second___: unknown
  const lines = content.split('\n').reduce<string[]>((pre, line) => {
    //获取到每一行的内容后如果去除空白字符为空的话，并且是第一次返回空数组
    if (!line.trim() && pre.length === 0) {
      return pre
    }
    //如果是第一行或者最后一行  获取到第一行的索引 获取到最后一行的索引
    if (line.trim() === '---') {
      if (first___ === undefined) {
        first___ = pre.length
      } else if (second___ === undefined) {
        second___ = pre.length
      }
    }
    pre.push(line)
    return pre
  }, [])
  return (
    // 获取到 ---
    lines.slice((second___ as number) || 0).join('\n')
  )
}

export function getFileBirthTime(url: string) {
  let date = new Date()

  try {
    // 参考 vitepress 中的 getGitTimestamp 实现
    const infoStr = spawnSync('git', ['log', '-1', '--pretty="%ci"', url])
      .stdout?.toString()
      .replace(/["']/g, '')
      .trim()
    if (infoStr) {
      date = new Date(infoStr)
    }
  } catch (error) {
    return formatDate(date)
  }

  return formatDate(date)
}

// export function getGitTimestamp(file: string) {
//   //new Map  有的话就返回
//   const cached = cache.get(file)
//   if (cached) return cached
//
//   return new Promise<number>((resolve, reject) => {
//     //获取到目录名
//     const cwd = dirname(file)
//     if (!fs.existsSync(cwd)) return resolve(0)
//     const fileName = basename(file)
//     const child = spawn('git', ['log', '-1', '--pretty="%ai"', fileName], {
//       cwd
//     })
//     let output = ''
//     child.stdout.on('data', (d) => (output += String(d)))
//     child.on('close', () => {
//       const timestamp = +new Date(output)
//       cache.set(file, timestamp)
//       resolve(timestamp)
//     })
//     child.on('error', reject)
//   })
// }

// export function getGitTimestamp(file: string) {
//   return new Promise((resolve, reject) => {
//     const child = spawn('git', ['log', '-1', '--pretty="%ci"', file])
//     let output = ''
//     child.stdout.on('data', (d) => {
//       output += String(d)
//     })
//     child.on('close', () => {
//       resolve(+new Date(output))
//     })
//     child.on('error', reject)
//   })
// }

function getTextSummary(text: string, count = 100) {
  return (
    clearMatterContent(text)
      .match(/^# ([\s\S]+)/m)?.[1]
      // 除去标题
      ?.replace(/#/g, '')
      // 除去图片
      ?.replace(/!\[.*?\]\(.*?\)/g, '')
      // 除去链接
      ?.replace(/\[(.*?)\]\(.*?\)/g, '$1')
      // 除去加粗
      ?.replace(/\*\*(.*?)\*\*/g, '$1')
      ?.split('\n')
      ?.filter((v) => !!v)
      ?.slice(1)
      ?.join('\n')
      ?.replace(/>(.*)/, '')
      ?.slice(0, count)
  )
}

export function assignMermaid(config: any) {
  if (!config?.mermaid) return

  if (!config.vite) config.vite = {}
  if (!config.vite.plugins) config.vite.plugins = []
  config.vite.plugins.push(MermaidPlugin(config.mermaid))
  if (!config.vite.resolve) config.vite.resolve = {}
  if (!config.vite.resolve.alias) config.vite.resolve.alias = {}

  config.vite.resolve.alias = [
    ...aliasObjectToArray({
      ...config.vite.resolve.alias,
      'cytoscape/dist/cytoscape.umd.js': 'cytoscape/dist/cytoscape.esm.js',
      mermaid: 'mermaid/dist/mermaid.esm.mjs'
    }),
    { find: /^dayjs\/(.*).js/, replacement: 'dayjs/esm/$1' }
  ]
}
function aliasObjectToArray(obj: Record<string, string>) {
  return Object.entries(obj).map(([find, replacement]) => ({
    find,
    replacement
  }))
}
export function defineConfig(config: UserConfig<Theme.Config>): any {
  // 兼容低版本主题配置
  // @ts-ignore
  if (config.themeConfig?.themeConfig) {
    config.extends = checkKeys.reduce((pre, key) => {
      // @ts-ignore
      pre[key] = config.themeConfig[key]
      // @ts-ignore
      delete config.themeConfig[key]
      return pre
    }, {})
  }
  // @ts-ignore
  const extendThemeConfig = (config.extends?.themeConfig?.blog ||
    {}) as Theme.BlogConfig

  // 开关支持Mermaid
  const resultConfig =
    extendThemeConfig.mermaid === false
      ? config
      : {
        ...config,
        mermaid:
          extendThemeConfig.mermaid === true ? {} : extendThemeConfig.mermaid
      }
  assignMermaid(resultConfig)

  // 处理markdown插件
  if (!resultConfig.markdown) resultConfig.markdown = {}
  // @ts-ignore
  if (config.extends?.markdown?.config) {
    const markdownExtendsConfigOriginal =
      // @ts-ignore
      config.extends?.markdown?.config
    const selfMarkdownConfig = resultConfig.markdown?.config

    resultConfig.markdown.config = (...rest: any[]) => {
      // @ts-ignore
      selfMarkdownConfig?.(...rest)
      markdownExtendsConfigOriginal?.(...rest)
    }
  }
  return resultConfig
}

export { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
