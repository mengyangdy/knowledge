import * as vitepress_plugin_rss from 'vitepress-plugin-rss';
import { RSSOptions } from 'vitepress-plugin-rss';
import { DefaultTheme } from 'vitepress';

type RSSPluginOptions = RSSOptions;
declare namespace BlogPopover {
    interface Title {
        type: 'title';
        content: string;
        style?: string;
    }
    interface Text {
        type: 'text';
        content: string;
        style?: string;
    }
    interface Image {
        type: 'image';
        src: string;
        style?: string;
    }
    interface Button {
        type: 'button';
        link: string;
        content: string;
        style?: string;
        props?: any;
    }
    type Value = Title | Text | Image | Button;
}
type ThemeableImage = string | {
    src: string;
    alt?: string;
} | {
    light: string;
    dark: string;
    alt?: string;
};
declare namespace Theme {
    interface PageMeta {
        title: string;
        date: string;
        tag?: string[];
        type: string;
        description?: string;
        descriptionHTML?: string;
        cover?: string;
        hiddenCover?: boolean;
        readingTime?: boolean;
        sticky?: number;
        author?: string;
        hidden?: boolean;
        layout?: string;
        tags?: string[];
        top?: number;
        recommend?: number | false;
        timeline: string;
        album: string;
        publish?: boolean;
    }
    interface PageData {
        route: string;
        meta: PageMeta;
    }
    interface activeTag {
        label: string;
        type: string;
    }
    interface GiscusConfig {
        repo: string;
        repoId: string;
        category: string;
        categoryId: string;
        mapping?: string;
        inputPosition?: 'top' | 'bottom';
        lang?: string;
        loading?: 'lazy' | 'auto' | 'eager';
    }
    interface CommentConfig extends GiscusConfig {
        label?: string;
        icon?: string;
        mobileMinify?: boolean;
    }
    interface HotArticle {
        title?: string;
        pageSize?: number;
        nextText?: string;
        empty?: string | boolean;
    }
    interface RecommendArticle {
        title?: string;
        pageSize?: number;
        nextText?: string;
        showSelf?: boolean;
        filter?: (page: Theme.PageData) => boolean;
        /**
         * 自定义排序
         * @default 'date'
         */
        sort?: 'date' | 'filename' | ((a: Theme.PageData, b: Theme.PageData) => number);
        empty?: string | boolean;
        style?: 'card' | 'sidebar';
    }
    interface HomeBlog {
        name?: string;
        motto?: string;
        inspiring?: string | string[];
        inspiringTimeout?: number;
        pageSize?: number;
        author?: string | boolean;
        logo?: string | boolean;
        /**
         * @default 'card'
         */
        avatarMode?: 'card' | 'split';
    }
    interface ArticleConfig {
        readingTime?: boolean;
        /**
         * 阅读时间分析展示位置
         * @default 'inline'
         */
        readingTimePosition?: 'inline' | 'newLine' | 'top';
        hiddenCover?: boolean;
    }
    interface Alert {
        type: 'success' | 'warning' | 'info' | 'error';
        duration: number;
        title?: string;
        description?: string;
        closable?: boolean;
        center?: boolean;
        closeText?: string;
        showIcon?: boolean;
        html?: string;
    }
    interface Popover {
        title: string;
        /**
         * 细粒度的时间控制
         * 默认展示时间，-1 只展示1次，其它数字为每次都展示，一定时间后自动消失，0为不自动消失
         * 配置改变时，会重新触发展示
         */
        duration: number;
        /**
         * 移动端自动最小化
         * @default false
         */
        mobileMinify?: boolean;
        body?: BlogPopover.Value[];
        footer?: BlogPopover.Value[];
        /**
         * 手动重新打开
         * @default true
         */
        reopen?: boolean;
        /**
         * 设置展示图标，svg
         * @recommend https://iconbuddy.app/search?q=fire
         */
        icon?: string;
        /**
         * 设置关闭图标，svg
         * @recommend https://iconbuddy.app/search?q=fire
         */
        closeIcon?: string;
    }
    interface FriendConfig {
        list: FriendLink[];
        /**
         * 是否随机展示
         * @default false
         */
        random?: boolean;
        /**
         * 是否限制展示数量（超出自动切换）
         */
        limit?: number;
        /**
         * 滚动速度(ms)，设置为 0 不滚动直接截取
         * @default "动态计算"
         */
        scrollSpeed?: number;
    }
    interface FriendLink {
        nickname: string;
        des: string;
        url: string;
        avatar: ThemeableImage;
    }
    interface UserWork {
        title: string;
        description: string;
        time: string | {
            start: string;
            end?: string;
            lastupdate?: string;
        };
        status?: {
            text: string;
            type?: 'tip' | 'warning' | 'danger';
        };
        url?: string;
        github?: string | {
            owner: string;
            repo: string;
            branch?: string;
            path?: string;
        };
        cover?: string | string[] | {
            urls: string[];
            layout?: 'swiper' | 'list';
        };
        links?: {
            title: string;
            url: string;
        }[];
        tags?: string[];
        top?: number;
    }
    type SearchConfig = boolean | 'pagefind' | {
        btnPlaceholder?: string;
        placeholder?: string;
        emptyText?: string;
        heading?: string;
        mode?: boolean | 'pagefind';
    };
    interface UserWorks {
        title: string;
        description?: string;
        topTitle?: string;
        list: UserWork[];
    }
    type ThemeColor = 'vp-default' | 'vp-green' | 'vp-yellow' | 'vp-red' | 'el-blue' | 'el-yellow' | 'el-green' | 'el-red';
    interface BlogConfig {
        blog?: false;
        /**
         * 内置一些主题色
         * @default 'vp-default'
         * 也可以自定义颜色，详见 TODO：文档
         */
        themeColor?: ThemeColor;
        pagesData: PageData[];
        srcDir?: string;
        author?: string;
        hotArticle?: HotArticle;
        home?: HomeBlog;
        /**
         * 本地全文搜索定制
         * 内置pagefind 实现，
         * VitePress 官方提供 minisearch 实现，
         * 社区提供 flexsearch 实现
         */
        search?: SearchConfig;
        /**
         * 配置评论
         * power by https://giscus.app/zh-CN
         */
        comment?: CommentConfig | false;
        /**
         * 阅读文章左侧的推荐文章（替代默认的sidebar）
         */
        recommend?: RecommendArticle | false;
        article?: ArticleConfig;
        /**
         * el-alert
         */
        alert?: Alert;
        popover?: Popover;
        friend?: FriendLink[] | FriendConfig;
        authorList?: Omit<FriendLink, 'avatar'>[];
        /**
         * 启用 [vitepress-plugin-tabs](https://www.npmjs.com/package/vitepress-plugin-tabs)
         * @default false
         */
        tabs?: boolean;
        works?: UserWorks;
        /**
         * https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
         * @default true
         */
        mermaid?: any;
        /**
         * 设置解析 frontmatter 里 date 的时区
         * @default 8 => 'UTC+8'
         */
        timeZone?: number;
        /**
         * 启用RSS配置
         */
        RSS?: RSSOptions;
        /**
         * 首页页脚
         */
        footer?: Footer | Footer[];
        /**
         * 文章作者，标签等信息插入位置
         * @default 'h1'
         */
        docMetaInsertSelector?: string;
        /**
         * 文章作者，标签等信息插入位置
         * @default 'after'
         */
        docMetaInsertPosition?: 'before' | 'after';
        /**
         * 配置内置的 markdown-it-task-checkbox 插件，设置 false 则关闭
         * 详见 https://github.com/linsir/markdown-it-task-checkbox
         * @default true
         */
        taskCheckbox?: TaskCheckbox | boolean;
        /**
         * 支持 markdown 时间线语法，在 vitepress 中使用 markdown 渲染时间线（时间轴）样式。
         * 详见 https://github.com/HanochMa/vitepress-markdown-timeline
         * @default true
         */
        timeline?: boolean;
        /**
         * 回到顶部
         * @default true
         */
        backToTop?: boolean | BackToTop;
    }
    interface BackToTop {
        /**
         * 距离顶部多少距离出现
         * @default 450
         */
        top?: number;
        /**
         * 设置展示图标，svg
         * @recommend https://iconbuddy.app/search?q=fire
         */
        icon?: string;
    }
    interface TaskCheckbox {
        disabled?: boolean;
        divWrap?: boolean;
        divClass?: string;
        idPrefix?: string;
        ulClass?: string;
        liClass?: string;
    }
    type RSSOptions = RSSPluginOptions;
    interface Footer {
        /**
         * 自定义补充信息（支持配置为HTML）
         */
        message?: string | string[];
        /**
         * 是否展示主题版本信息
         */
        version?: boolean;
        /**
         * copyright
         */
        copyright?: string | {
            message: string;
            link?: string;
            icon?: boolean | string;
        };
        /**
         * ICP 备案信息
         */
        icpRecord?: {
            name: string;
            link: string;
            icon?: boolean | string;
        };
        /**
         * 公安备案信息
         */
        securityRecord?: {
            name: string;
            link: string;
            icon?: boolean | string;
        };
    }
    interface Config extends DefaultTheme.Config {
        blog?: BlogConfig;
    }
    interface HomeConfig {
    }
}

declare function getThemeConfig(cfg?: Partial<Theme.BlogConfig>): {
    themeConfig: {
        blog: {
            blog?: false | undefined;
            themeColor?: Theme.ThemeColor | undefined;
            pagesData?: Theme.PageData[] | undefined;
            srcDir?: string | undefined;
            author?: string | undefined;
            hotArticle?: Theme.HotArticle | undefined;
            home?: Theme.HomeBlog | undefined;
            search?: Theme.SearchConfig | undefined;
            comment?: false | Theme.CommentConfig | undefined;
            recommend?: false | Theme.RecommendArticle | undefined;
            article?: Theme.ArticleConfig | undefined;
            alert?: Theme.Alert | undefined;
            popover?: Theme.Popover | undefined;
            friend?: Theme.FriendLink[] | Theme.FriendConfig | undefined;
            authorList?: Omit<Theme.FriendLink, "avatar">[] | undefined;
            tabs?: boolean | undefined;
            works?: Theme.UserWorks | undefined;
            mermaid?: any;
            timeZone?: number | undefined;
            RSS?: vitepress_plugin_rss.RSSOptions | undefined;
            footer?: Theme.Footer | Theme.Footer[] | undefined;
            docMetaInsertSelector?: string | undefined;
            docMetaInsertPosition?: "before" | "after" | undefined;
            taskCheckbox?: boolean | Theme.TaskCheckbox | undefined;
            timeline?: boolean | undefined;
            backToTop?: boolean | Theme.BackToTop | undefined;
        };
    };
};

export { getThemeConfig };
