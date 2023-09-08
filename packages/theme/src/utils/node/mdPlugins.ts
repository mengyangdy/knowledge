import type {Theme} from '../../composables/config/index'
import {tabsMarkdownPlugin} from 'vitepress-plugin-tabs'
import {UserConfig} from "vitepress";
import {aliasObjectToArray} from "./index";

/**
 * 需要添加那些插件
 * @param cfg
 */
export function getMarkdownPlugins(cfg?: Partial<Theme.BlogConfig>) {
  const markdownPlugin: any[] = []
  // tabs支持
  if (cfg?.tags) {
    markdownPlugin.push(tabsMarkdownPlugin)
  }

  // 添加mermaid markdown插件
  if (cfg) {
    cfg.mermaid = cfg?.mermaid ?? true
    if (cfg?.mermaid !== false) {
      const {MermaidMarkdown} = require('vitepress-plugin-mermaid')
      markdownPlugin.push(MermaidMarkdown)
    }
  }
  return markdownPlugin
}

export function registerMdPlugins(vpCfg: any, plugins: any[]) {
  if (plugins.length) {
    vpCfg.mardown = {
      config(...rest: any[]) {
        plugins.forEach(plugin => {
          plugin?.(...rest)
        })
      }
    }
  }
}

export function wrapperCfgWithMermaid(config: UserConfig<Theme.Config>): any {
  const extendThemeConfig = (config.extends?.themeConfig?.blog || {}) as Theme.BlogConfig

  // 开关支持mermaid
  const resultConfig = extendThemeConfig.mermaid === false ? config : {
    ...config,
    mermaid: extendThemeConfig.mermaid === true ? {} : extendThemeConfig.mermaid
  }

  assignMermaid(resultConfig)
  return resultConfig
}

export function assignMermaid(config: any) {
  if (!config?.mermaid) return
  if (!config.vite) config.vite = {}
  if (!config.vite.plugins) config.vite.plugins = []
  const {MermaidPlugin} = require('vitepress-plugin-mermaid')
  config.vite.plugins.push(MermaidPlugin(config.mermaid))
  if (!config.vite.resolve) config.vite.resolve = {}
  if (!config.vite.resolve.alias) config.vite.resolve.alias = {}

  config.vite.resolve.alias = [
    ...aliasObjectToArray({
      ...config.vite.resolve.alias,
      'cytoscape/dist/cytoscape.umd.js': 'cytoscape/dist/cytoscape.esm.js',
      mermaid: 'mermaid/dist/mermaid.esm.mjs'
    }),
    {find: /^dayjs\/(.*).js/, replacement: 'dayjs/esm/$1'}
  ]
}

export function supportRunExtendsPlugin(config: UserConfig<Theme.Config>) {
  if (!config.markdown) config.markdown = {}
  if (config.extends?.markdown?.config) {
    const markdownExtendsConfigOriginal = config.extends?.markdown?.config
    const selfMarkdownConfig = config.markdown?.config
    config.markdown.config = (...rest: any[]) => {
      selfMarkdownConfig?.(...rest)
      markdownExtendsConfigOriginal?.(...rest)
    }
  }
}