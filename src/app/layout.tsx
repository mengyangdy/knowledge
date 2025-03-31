import BaseConfig from "@/config"
import { inter, sansFont } from "@/lib/font"
import "@/style/global.css"
import Footer from "@/components/Footer"
import GlobalBg from "@/components/GlobalBg"
import Header from "@/components/Header"
import { ThemeProvider } from "next-themes"
import { Suspense } from "react"

import { PostsProvider } from "@/components/PostsProvider"
import { getAllPosts } from "@/lib/file"

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const posts = await getAllPosts()
	return (
		<html
			lang={BaseConfig.locale}
			className={`${sansFont.variable} m-0 h-full p-0 font-sans antialiased`}
			suppressHydrationWarning
		>
			<body className={inter.className}>
				<ThemeProvider>
					<PostsProvider posts={posts}>
						<GlobalBg />
						<div className="fixed inset-0 flex justify-center sm:px-8">
							<div className="flex w-full max-w-7xl lg:px-8">
								<div className="opacity-95 w-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20" />
							</div>
						</div>
						<div className="relative text-zinc-800 dark:text-zinc-200">
							<Header />
							<main>{children}</main>
							<Suspense>
								<Footer />
							</Suspense>
						</div>
					</PostsProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
