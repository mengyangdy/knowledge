import { getThemeConfig } from '@dy/vitepress-theme/node'
import { defineConfig } from 'vitepress'
import NavData from './nav'

const blogTheme = getThemeConfig({
  author: 'Dylan',
  comment: {
    repo: 'mengyang94982/knowledge',
    repoId: 'R_kgDOKF80Gg',
    category: 'Announcements',
    categoryId: 'DIC_kwDOKF80Gs4CaZPc',
    inputPosition: 'top'
  },
  popover: {
    title: '公告',
    body: [
      { type: 'text', content: ' 公众号 ---  微信' },
      // {
      //   type: 'image',
      //   src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210'
      // },
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
        link: '/group'
      }
    ],
    duration: -1
  },
  recommend: {
    showSelf: true,
    nextText: '下一页',
    style: 'sidebar'
  },
  authorList: [
    {
      nickname: 'Dylan',
      url: 'https://mengyang.online',
      des: '前端成长之路'
    }
  ],
  footer: {
    copyright: `Dylan 2023 - ${new Date().getFullYear()}`,
    icpRecord: {
      name: '豫ICP备2023033003',
      link: 'https://beian.miit.gov.cn/'
    }
  }
})

export default defineConfig({
  extends: blogTheme,
  title: '前端成长之路',
  description: 'Dylan的个人博客，记录随笔与学习笔记，大前端相关的知识，高频面试题，个人面经等',
  ignoreDeadLinks: true,
  lang: 'zh-cn',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: 'https://my-vitepress-blog.sh1a.qingstor.com/202403132225889.ico',
        type: 'image/png',
        sizes: '32x32'
      }
    ]
  ],
  vite: {
    server: {
      port: 3200,
      host: '0.0.0.0'
    },
    optimizeDeps: {
      include: ['element-plus'],
      exclude: ['@dy/vitepress-theme']
    }
  },
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: 'local'
    },
    lastUpdatedText: '上次更新于',
    logo: 'https://my-vitepress-blog.sh1a.qingstor.com/202403131543188.jpg',
    editLink: {
      pattern: 'https://github.com/mengyang94982/knowledge/tree/master/packages/blog/docs/:path',
      text: '去 GitHub 上编辑内容'
    },
    outline: {
      level: 'deep',
      label: '目录'
    },
    outlineTitle: '目录',
    nav: NavData,
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/mengyang94982'
      }
    ]
  }
})
