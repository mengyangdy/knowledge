import type {Theme} from '../../shared'
import {getArticles} from "../node";

export function getThemeConfig(cfg?:Partial<Theme.BlogConfig>){
  const pagesData=getArticles(cfg)
  const extraVPConfig:any={}

  // const vitePlugins=getVitePlugins(cfg)
  //
  // registerVitePlugins(extraVPConfig, vitePlugins)
  //
  // const markdownPlugin = getMarkdownPlugins(cfg)
  //
  // registerMdPlugins(extraVPConfig, markdownPlugin)
  //
  // // patch extraVPConfig
  // patchMermaidPluginCfg(extraVPConfig)
  // patchOptimizeDeps(extraVPConfig)

  return {
    themeConfig:{
      blog:{
        pagesData,
        ...cfg
      },
    },
    ...extraVPConfig
  }
}