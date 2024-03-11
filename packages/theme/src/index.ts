import type {Theme} from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import {enhanceAppWithTabs} from 'vitepress-plugin-tabs/client'

import {withConfigProvider} from "./shared/blog";

import BlogApp from './modules/BlogApp.vue'

const BlogTheme:Theme={
  ...DefaultTheme,
  Layout:withConfigProvider(BlogApp),
  enhanceApp(ctx){
    enhanceAppWithTabs(ctx.app as any)
    DefaultTheme.enhanceApp(ctx)
  }
}
export * from './shared/index'
// export * from './utils'

export default BlogTheme