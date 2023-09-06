import './styles/index.scss'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import {Theme} from "vitepress";
import DefaultTheme from 'vitepress/theme'
import App from './components/App.vue'
import {withConfigProvider} from "./composables/config/blog";

import TimeLinePage from "./components/TimeLinePage.vue";
import UserWorksPage from "./components/UserWorksPage.vue";

export const BlogTheme:Theme={
  ...DefaultTheme,
  Layout:withConfigProvider(App),
  enhanceApp(ctx){
    DefaultTheme.enhanceApp(ctx)
    ctx.app.component('TimelinePage',TimeLinePage)
    ctx.app.component('UserWorksPage',UserWorksPage)
  }
}

export * from './composables/config'

export default BlogTheme