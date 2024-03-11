import BlogTheme from "@dy/vitepress-theme";
import {h} from 'vue'

export default {
  ...BlogTheme,
  Layout:h(BlogTheme.Layout,undefined,{}),
  enhanceApp(ctx:any) {
    BlogTheme?.enhanceApp?.(ctx)
  }
}