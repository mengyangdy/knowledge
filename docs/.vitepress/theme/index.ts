import BlogTheme from '@dy/vitepress-theme'
import type { EnhanceAppContext } from 'vitepress'

export default {
  ...BlogTheme,
  enhanceApp: (ctx: EnhanceAppContext) => {
    BlogTheme?.enhanceApp?.(ctx)
    // const { app } = ctx
  }
}
