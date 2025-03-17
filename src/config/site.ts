import { SiteConfig } from "@/types/siteConfig";

const siteMetaData: SiteConfig = {
  name: "blog | 前端 | 开发者",
  description:
    "我是幸运的蜗牛，一名充满热情的前端开发工程师。我热衷于探索和体验最新技术，特别是人工智能（AI），并在日常工作中去使用它们，来提升我的工作效率。我的目标是积极参与开源社区，为开源项目贡献自己的力量。正如我的名字，我相信越努力，越幸运",
  author: "Dylan",
  email: "466879168@qq.com",
  locale: "zh-CN",
  navigationItems: [
    {
      href: "/",
      text: "首页",
    },
    {
      href: "/posts",
      text: "博客",
    },
    {
      href: "/list",
      text: "项目",
    },
    {
      href: "/my",
      text: "关于我",
    },
    {
      href: "/ssr",
      text: "rss",
    },
  ],
  social: [
    {
      href: "https://github.com/chaseFunny",
      text: "github",
      icon: "GitHubIcon",
    },
    {
      href: "wx",
      text: "微信",
      isPicture: true,
      icon: "WxIcon",
    },
    {
      href: "466879168@qq.com",
      text: "邮箱",
      icon: "MailIcon",
    },
    {
      href: "qq",
      text: "QQ",
      isPicture: true,
      hide: true,
      icon: "QqIcon",
    },
    {
      href: "https://juejin.cn/user/3606868169065389",
      text: "掘金",
      icon: "JueJinIcon",
    },
    {
      href: "https://x.com/haozhan05554957",
      text: "推特（X）",
      icon: "XIcon",
    },
    {
      href: "https://www.zhihu.com/people/axing-zh",
      text: "知乎",
      icon: "ZhihuIcon",
    },
    {
      href: "https://space.bilibili.com/1695997565",
      text: "哔哩哔哩",
      icon: "BilibiliIcon",
    },
    {
      href: "https://www.youtube.com/@lucky2snail",
      text: "YouTube",
      hide: true,
      icon: "YouTubeIcon",
    },
    {
      href: "douyin",
      text: "抖音",
      isPicture: true,
      hide: true,
      icon: "TiktokIcon",
    },
    {
      href: "https://www.xiaohongshu.com/user/profile/5e2d938d000000000100ac82",
      text: "小红书",
      hide: true,
      icon: "RedBookIcon",
    },
  ],
  moreItems: {
    "/more": [
      {
        href: "/icon",
        text: "图标库",
      },
      {
        href: "/admin",
        text: "管理",
      },
    ],
  },
};

export default siteMetaData;
