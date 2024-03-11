import type {Theme} from 'vitepress'
import DefaultTheme from "vitepress/theme";

import {withConfigProvider} from "./shared";

import App from './app.vue'

import './styles/index.scss'

const BlogTheme:Theme={
  ...DefaultTheme,
  Layout:withConfigProvider(App)
}

export * from './typings'
export * from './shared'

export default BlogTheme