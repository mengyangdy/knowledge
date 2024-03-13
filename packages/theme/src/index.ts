import type {Theme} from 'vitepress'
import DefaultTheme from "vitepress/theme";

import {withConfigProvider} from "./shared";

import App from './app.vue'

// override style
import './styles/index.scss'

// element-ui
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// 内置一些特殊的主题色
import './styles/theme/inline-theme.var.css'

const BlogTheme:Theme={
  ...DefaultTheme,
  Layout:withConfigProvider(App)
}

export * from './typings'
export * from './shared'

export default BlogTheme