import {getThemeConfig} from "@dy/vitepress-theme/node";
import {defineConfig} from "vitepress";

const blogTheme=getThemeConfig({
  popover: {
    title: '公告',
    body: [
      { type: 'text', content: '👇公众号👇---👇 微信 👇' },
      {
        type: 'image',
        src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210'
      },
      {
        type: 'text',
        content: '欢迎大家私信&加群交流'
      },
      {
        type: 'button',
        content: '关于作者',
        link: '/aboutme'
      },
      {
        type: 'button',
        content: '加群交流',
        props: {
          type: 'success'
        },
        link: '/group',
      }
    ],
    duration: -1
  },
})

export default defineConfig({
  extends: blogTheme,
  themeConfig:{
    lastUpdatedText: '上次更新于',
    logo: '/logo.png',
  }
})