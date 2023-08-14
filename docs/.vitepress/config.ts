import {defineConfig} from 'vitepress'
import {getThemeConfig} from "../../theme/src/node";

// https://vitepress.dev/reference/site-config

const blogTheme = getThemeConfig({
  author: 'Dylan',
  comment: {
    repo: 'ATQQ/sugar-blog',
    repoId: 'MDEwOlJlcG9zaXRvcnkyNDEyNDUyOTk',
    category: 'Announcements',
    categoryId: 'DIC_kwDODmEcc84COVc6',
    inputPosition: 'top'
  },
  popover: {
    title: '公告',
    body: [
      {type: 'text', content: '👇公众号👇---👇 微信 👇'},
      {
        type: 'image',
        src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210'
      },
      {
        type: 'text',
        content: '欢迎大家私信交流'
      }
    ],
    duration: -1
  },
  friend: [
    {
      nickname: '冴羽',
      des: '冴羽的JavaScript博客',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTYyNjQ4MzkxMzIxMA==626483913210',
      url: 'https://github.com/mqyqingfeng/Blog'
    },
    {
      nickname: 'Linbudu',
      des: '未来的不可知，是前进的原动力',
      avatar:
        'https://linbudu-img-store.oss-cn-shenzhen.aliyuncs.com/img/48507806.jfif',
      url: 'https://linbudu.top/'
    },
    {
      nickname: '小九',
      des: '日益努力，而后风生水起',
      avatar: 'https://jiangly.com/favicon.ico',
      url: 'https://jiangly.com/'
    },
    {
      nickname: '花喵电台      ',
      des: '曹豪侠和余湾湾还有两只猫的生活记录~',
      avatar:
        'https://pic.fmcat.top/head.jpg?x-oss-process=image/auto-orient,1/resize,m_fill,w_110,h_110/quality,q_90',
      url: 'https://www.fmcat.top'
    },
    {
      nickname: '张成威的网络日志',
      des: '知不足而奋进，望远山而前行',
      avatar: 'https://www.zhangchengwei.work/logo.png',
      url: 'https://www.zhangchengwei.work'
    }
  ],
  search: false,
  recommend: {
    showSelf: true,
    nextText: '下一页',
    style: 'sidebar'
  },
  authorList: [
    {
      nickname: '粥里有勺糖',
      url: 'https://sugarat.top/aboutme.html',
      des: '你的指尖,拥有改变世界的力量'
    }
  ]

})

export default defineConfig({
  // extends:blogTheme,
  title: "Dylan Blog",
  description: "Dylan的个人博客，记录随笔与学习笔记，大前端相关的知识，高频面试题，个人面经等",
  ignoreDeadLinks: true,
  lang: 'zh-cn',
  vite: {
    server: {
      port: 3000,
      host: '0.0.0.0'
    }
  },
  lastUpdated: true,
  head: [
    [
      'meta',
      {
        name: 'theme-color',
        content: '#ffffff'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico',
        type: 'image/png'
      }
    ],
    [
      'link',
      {
        rel: 'alternate icon',
        href: '/favicon.ico',
        type: 'image/png',
        sizes: '16x16'
      }
    ],
    [
      'meta',
      {
        name: 'author',
        content: 'Dylan'
      }
    ],
    [
      'link',
      {
        rel: 'mask-icon',
        href: '/favicon.ico',
        color: '#ffffff'
      }
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        href: '/favicon.ico',
        sizes: '180x180'
      }
    ]
  ],
  themeConfig: {
    // search:{
    //
    // },
    lastUpdatedText: '上次更新于',
    footer: {},
    logo: '/logo.png',
    nav: [
      {
        text: '大前端',
        items:[
          {
            text:'vitepress',
            link:'/frontEnd/vitepress/'
          }
        ]
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/mengyang94982'
      }
    ]
  }
})



