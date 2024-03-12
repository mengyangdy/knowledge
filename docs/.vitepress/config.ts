import {getThemeConfig} from "@dy/vitepress-theme/node";
import {defineConfig} from "vitepress";
import NavData from './nav'
import HeadData from './head'

const blogTheme=getThemeConfig({
  author: 'Dylan',
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
  authorList: [
    {
      nickname: 'Dylan',
      url: 'http://mengyang.online',
      des: '前端成长之路'
    }
  ],
  footer: {
    copyright: `粥里有勺糖 2018 - ${new Date().getFullYear()}`,
    icpRecord: {
      name: '蜀ICP备19011724号',
      link: 'https://beian.miit.gov.cn/'
    }
  },
})

export default defineConfig({
  extends: blogTheme,
  title: '前端成长之路',
  description: 'Dylan的个人博客，记录随笔与学习笔记，大前端相关的知识，高频面试题，个人面经等',
  ignoreDeadLinks: true,
  lang: 'zh-cn',
  head:HeadData,
  vite: {
    server: {
      port: 3200,
      host: '0.0.0.0'
    },
    optimizeDeps: {
      include: ['naive-ui'],
      exclude: ['@dy/vitepress-theme']
    }
  },
  lastUpdated: true,
  themeConfig:{
    lastUpdatedText: '上次更新于',
    logo: '/logo.png',
    editLink: {
      pattern: 'https://github.com/mengyang94982/knowledge/tree/master/packages/blog/docs/:path',
      text: '去 GitHub 上编辑内容'
    },
    outline: {
      level: 'deep',
      label: '目录'
    },
    outlineTitle: '目录',
    nav:NavData,
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/mengyang94982'
      }
    ]
  }
})