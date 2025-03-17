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
	email: string;
	authorsUrl?: string;
	social: socialItem[];
	navigationItems: navigationItem[];
	moreItems: moreItem;
	themeColors?: string | ThemeColor[];
	defaultNextTheme?: string;
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