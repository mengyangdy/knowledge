import { DefaultTheme, UserConfig } from 'vitepress';
import { ElButton } from 'element-plus';
export { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';

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
        props?: InstanceType<typeof ElButton>['$props'];
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
        description?: string;
        descriptionHTML?: string;
        cover?: string;
        hiddenCover?: boolean;
        readingTime?: boolean;
        sticky?: number;
        author?: string;
        hidden?: boolean;
        layout?: string;
        categories: string[];
        tags: string[];
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
        empty?: string | boolean;
        style?: 'card' | 'sidebar';
    }
    interface HomeBlog {
        name?: string;
        motto?: string;
        inspiring?: string | string[];
        inspiringTimeout?: number;
        pageSize?: number;
    }
    interface ArticleConfig {
        readingTime?: boolean;
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
        duration: number;
        body?: BlogPopover.Value[];
        footer?: BlogPopover.Value[];
        reopen?: boolean;
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
    interface BlogConfig {
        blog?: false;
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
        comment?: GiscusConfig | false;
        /**
         * 阅读文章左侧的推荐文章（替代默认的sidebar）
         */
        recommend?: RecommendArticle | false;
        article?: ArticleConfig;
        alert?: Alert;
        popover?: Popover;
        friend?: FriendLink[];
        authorList?: Omit<FriendLink, 'avatar'>[];
        /**
         * 启用 [vitepress-plugin-tabs](https://www.npmjs.com/package/vitepress-plugin-tabs)
         * @default false
         */
        tags?: boolean;
        works?: UserWorks;
        /**
         * https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
         * @default false
         */
        mermaid?: any;
        /**
         * 设置解析 frontmatter 里 date 的时区
         * @default 8 => 'UTC+8'
         * */
        timeZone?: number;
    }
    interface Config extends DefaultTheme.Config {
        blog?: BlogConfig;
    }
    interface HomeConfig {
        /**
         * @deprecated
         * 此方法已经废弃，这个定义将在未来某一刻被移除，请为 inspiring 配置数租来实现相同的效果
         */
        handleChangeSlogan?: (oldSlogan: string) => string | Promise<string>;
    }
}

/**
 * 获取主题配置
 * @param cfg 主题配置
 */
declare function getThemeConfig(cfg?: Partial<Theme.BlogConfig>): any;
declare function defineConfig(config: UserConfig<Theme.Config>): any;

export { defineConfig, getThemeConfig };
