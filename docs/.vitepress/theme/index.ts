import BlogTheme from '@dy/vitepress-theme'
import type {EnhanceAppContext} from 'vitepress'

export default {
  ...BlogTheme,
  enhanceApp:(ctx:EnhanceAppContext)=> {
    const {app}=ctx
  }
}