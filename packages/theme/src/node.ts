import type {Theme} from './typings'

export function getThemeConfig (cfg?:Partial<Theme.BlogConfig>) {
  return {
    themeConfig: {
      blog: {
        ...cfg
      },
    },
  }
}