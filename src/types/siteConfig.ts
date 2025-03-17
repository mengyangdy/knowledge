export type socialItem = {
	text: string;
	href: string;
	isPicture?: boolean; // 是否是图片
	hide?: boolean;
	icon: string;
};

export type navigationItem = {
	text: string;
	href: string;
	icon?: string;
	menu?: boolean;
};

export type moreItem = Record<string, navigationItem[]>;

export type ThemeColor = {
	media: string;
	color: string;
};

export type SiteConfig = {
	name: string;
	author: string;
	description: string;
	url: string;
	email: string;
	siteHostList: string[];
	keywords: string[];
	authorsUrl?: string;
	ogImage: string;
	social: socialItem[];
	navigationItems: navigationItem[];
	moreItems: moreItem;
	footerItems: navigationItem[];
	metadataBase: URL | string;
	themeColors?: string | ThemeColor[];
	defaultNextTheme?: string;
	icons: {
		icon: string;
		shortcut?: string;
		apple?: string;
	};
	openGraph?: {
		type: string;
		locale: string;
		url: string;
		title: string;
		description: string;
		siteName: string;
		images?: string[];
	};
	twitter?: {
		card: string;
		title: string;
		description: string;
		images?: string[];
		creator: string;
	};
	locale: string;
};