import type { DefaultTheme } from 'vitepress'

export namespace BlogPopover {
  export interface Title {
    type: 'title'
    content: string
    style?: string
  }

  export interface Text {
    type: 'text'
    content: string
    style?: string
  }

  export interface Image {
    type: 'image'
    src: string
    style?: string
  }

  export interface Button {
    type: 'button'
    link: string
    content: string
    style?: string
    props?: any
  }

  export type Value = Title | Text | Image | Button
}

export type ThemeableImage = string | { src: string; alt?: string } | { light: string; dark: string; alt?: string }

export namespace Theme {
  export interface PageMeta {
    title: string
    date: string
    tag?: string[]
    type: string
    description?: string
    descriptionHTML?: string
    cover?: string
    hiddenCover?: boolean
    readingTime?: boolean
    sticky?: number
    author?: string
    hidden?: boolean
    layout?: string
    tags?: string[]
    // 文章首页置顶
    top?: number
    // 手动控制相关文章的顺序
    recommend?: number | false
    // 时间线
    timeline: string
    // 专栏 合集
    album: string
    // 是否发布
    publish?: boolean
  }

  export interface PageData {
    route: string
    meta: PageMeta
  }

  export interface activeTag {
    label: string
    type: string
  }

  export interface GiscusConfig {
    repo: string
    repoId: string
    category: string
    categoryId: string
    mapping?: string
    inputPosition?: 'top' | 'bottom'
    lang?: string
    loading?: 'lazy' | 'auto' | 'eager'
  }

  export interface CommentConfig extends GiscusConfig {
    // default '评论'
    label?: string
    // 自定义图标
    icon?: string
    // 移动端最小化按钮
    mobileMinify?: boolean
  }

  export interface HotArticle {
    title?: string
    pageSize?: number
    nextText?: string
    empty?: string | boolean
  }

  export interface RecommendArticle {
    title?: string
    pageSize?: number
    nextText?: string
    // 是否展示当前正在浏览的文章在左侧
    showSelf?: boolean
    filter?: (page: Theme.PageData) => boolean
    /**
     * 自定义排序
     *
     * @default 'date'
     */
    sort?: 'date' | 'filename' | ((a: Theme.PageData, b: Theme.PageData) => number)
    empty?: string | boolean
    style?: 'card' | 'sidebar'
  }

  export interface HomeBlog {
    name?: string
    motto?: string
    inspiring?: string | string[]
    inspiringTimeout?: number
    pageSize?: number
    author?: string | boolean
    logo?: string | boolean
    /** @default 'card' */
    avatarMode?: 'card' | 'split'
  }

  export interface ArticleConfig {
    readingTime?: boolean
    /**
     * 阅读时间分析展示位置
     *
     * @default 'inline'
     */
    readingTimePosition?: 'inline' | 'newLine' | 'top'
    hiddenCover?: boolean
  }

  export interface Alert {
    type: 'success' | 'warning' | 'info' | 'error'
    duration: number
    title?: string
    description?: string
    closable?: boolean
    center?: boolean
    closeText?: string
    showIcon?: boolean
    html?: string
  }

  export interface Popover {
    title: string
    /** 细粒度的时间控制 默认展示时间，-1 只展示1次，其它数字为每次都展示，一定时间后自动消失，0为不自动消失 配置改变时，会重新触发展示 */
    duration: number
    /**
     * 移动端自动最小化
     *
     * @default false
     */
    mobileMinify?: boolean
    body?: BlogPopover.Value[]
    footer?: BlogPopover.Value[]
    /**
     * 手动重新打开
     *
     * @default true
     */
    reopen?: boolean
    /**
     * 设置展示图标，svg
     *
     * @recommend https://iconbuddy.app/search?q=fire
     */
    icon?: string
    /**
     * 设置关闭图标，svg
     *
     * @recommend https://iconbuddy.app/search?q=fire
     */
    closeIcon?: string
  }

  export interface FriendConfig {
    list: FriendLink[]
    /**
     * 是否随机展示
     *
     * @default false
     */
    random?: boolean
    /** 是否限制展示数量（超出自动切换） */
    limit?: number
    /**
     * 滚动速度(ms)，设置为 0 不滚动直接截取
     *
     * @default '动态计算'
     */
    scrollSpeed?: number
  }

  export interface FriendLink {
    nickname: string
    des: string
    url: string
    avatar: ThemeableImage
  }

  export interface UserWork {
    title: string
    description: string
    time:
      | string
      | {
          start: string
          end?: string
          lastupdate?: string
        }
    status?: {
      text: string
      type?: 'tip' | 'warning' | 'danger'
    }
    url?: string
    github?:
      | string
      | {
          owner: string
          repo: string
          branch?: string
          path?: string
        }
    cover?:
      | string
      | string[]
      | {
          urls: string[]
          layout?: 'swiper' | 'list'
        }
    links?: {
      title: string
      url: string
    }[]
    tags?: string[]
    top?: number
  }

  export type SearchConfig =
    | boolean
    | 'pagefind'
    | {
        btnPlaceholder?: string
        placeholder?: string
        emptyText?: string
        heading?: string
        mode?: boolean | 'pagefind'
      }

  export interface UserWorks {
    title: string
    description?: string
    topTitle?: string
    list: UserWork[]
  }

  export type ThemeColor =
    | 'vp-default'
    | 'vp-green'
    | 'vp-yellow'
    | 'vp-red'
    | 'el-blue'
    | 'el-yellow'
    | 'el-green'
    | 'el-red'

  export interface BlogConfig {
    blog?: false
    /**
     * 内置一些主题色
     *
     * @default 'vp-default'
     */
    themeColor?: ThemeColor
    pagesData: PageData[]
    srcDir?: string
    author?: string
    hotArticle?: HotArticle
    home?: HomeBlog
    /** 本地全文搜索定制 内置pagefind 实现， VitePress 官方提供 minisearch 实现， 社区提供 flexsearch 实现 */
    search?: SearchConfig
    /** 配置评论 power by https://giscus.app/zh-CN */
    comment?: CommentConfig | false
    /** 阅读文章左侧的推荐文章（替代默认的sidebar） */
    recommend?: RecommendArticle | false
    article?: ArticleConfig
    /** el-alert */
    alert?: Alert
    popover?: Popover
    friend?: FriendLink[] | FriendConfig
    authorList?: Omit<FriendLink, 'avatar'>[]
    /**
     * 启用 [vitepress-plugin-tabs](https://www.npmjs.com/package/vitepress-plugin-tabs)
     *
     * @default false
     */
    tabs?: boolean
    works?: UserWorks
    /**
     * https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
     *
     * @default true
     */
    mermaid?: any
    /**
     * 设置解析 frontmatter 里 date 的时区
     *
     * @default 8 => 'UTC+8'
     */
    timeZone?: number
    /** 首页页脚 */
    footer?: Footer | Footer[]
    /**
     * 文章作者，标签等信息插入位置
     *
     * @default 'h1'
     */
    docMetaInsertSelector?: string
    /**
     * 文章作者，标签等信息插入位置
     *
     * @default 'after'
     */
    docMetaInsertPosition?: 'before' | 'after'
    /**
     * 配置内置的 markdown-it-task-checkbox 插件，设置 false 则关闭 详见 https://github.com/linsir/markdown-it-task-checkbox
     *
     * @default true
     */
    taskCheckbox?: TaskCheckbox | boolean
    /**
     * 支持 markdown 时间线语法，在 vitepress 中使用 markdown 渲染时间线（时间轴）样式。 详见
     * https://github.com/HanochMa/vitepress-markdown-timeline
     *
     * @default true
     */
    timeline?: boolean
    /**
     * 回到顶部
     *
     * @default true
     */
    backToTop?: boolean | BackToTop
  }

  export interface BackToTop {
    /**
     * 距离顶部多少距离出现
     *
     * @default 450
     */
    top?: number

    /**
     * 设置展示图标，svg
     *
     * @recommend https://iconbuddy.app/search?q=fire
     */
    icon?: string
  }

  export interface TaskCheckbox {
    disabled?: boolean
    divWrap?: boolean
    divClass?: string
    idPrefix?: string
    ulClass?: string
    liClass?: string
  }

  export interface Footer {
    /** 自定义补充信息（支持配置为HTML） */
    message?: string | string[]
    /** 是否展示主题版本信息 */
    version?: boolean
    /** copyright */
    copyright?:
      | string
      | {
          message: string
          link?: string
          icon?: boolean | string
        }
    /** ICP 备案信息 */
    icpRecord?: {
      name: string
      link: string
      icon?: boolean | string
    }
    /** 公安备案信息 */
    securityRecord?: {
      name: string
      link: string
      icon?: boolean | string
    }
  }

  export interface Config extends DefaultTheme.Config {
    blog?: BlogConfig
  }
}
