import type {Theme} from './typings'
import type {UserConfig} from "vitepress";

import {getArticles,patchVPThemeConfig} from "./utils/node/theme";
import {getVitePlugins,registerVitePlugins} from './utils/node/vitePlugins'

export function getThemeConfig (cfg?:Partial<Theme.BlogConfig>) {
  const pagesData=getArticles(cfg)
  const extraVPConfig: any = {}

  // 获取要加载的vite插件
  const vitePlugins = getVitePlugins(cfg)
  // 注册Vite插件
  registerVitePlugins(extraVPConfig, vitePlugins)

  // 获取要加载的markdown插件
  // const markdownPlugin = getMarkdownPlugins(cfg)
  // 注册markdown插件
  // registerMdPlugins(extraVPConfig, markdownPlugin)

  // patch extraVPConfig
  // patchMermaidPluginCfg(extraVPConfig)
  // patchOptimizeDeps(extraVPConfig)

  return {
    themeConfig: {
      blog: {
        pagesData,
        ...cfg
      },
      ...patchVPThemeConfig(cfg)
    },
    ...extraVPConfig
  }
}

export function defineConfig(config: UserConfig<Theme.Config>): any {
  return config
}