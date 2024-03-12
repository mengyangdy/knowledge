import type {Theme} from '../../typings'

export function getVitePlugins(cfg?:Partial<Theme.BlogConfig>){
  const plugins:any[]=[]
  // Build完后运行的一系列方法
  // const buildEndFn:any[]=[]
  // 执行自定义的 buildEnd 钩子
  // plugins.push(inlineBuildEndPlugin(buildEndFn))
  // plugins.push(coverImgTransform())

  return plugins
}

export function registerVitePlugins(vpCfg: any, plugins: any[]) {
  vpCfg.vite = {
    plugins
  }
}