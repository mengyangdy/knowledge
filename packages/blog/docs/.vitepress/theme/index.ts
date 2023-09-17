import BlogTheme from "@dylanjs/vitepress-theme";

export default {
  ...BlogTheme,
  enhanceApp(ctx:any){
    BlogTheme?.enhanceApp?.(ctx)
  }
}