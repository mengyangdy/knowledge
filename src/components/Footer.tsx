import GithubIcon from "@/assets/icons/github.png"
import Container from "@/components/Container"
import BaseConfig from "@/config"
import { cn } from "@/lib/utils"
import Image, { type StaticImageData } from "next/image"
import Link from "next/link";
import {ExternalLinkIcon} from '@/assets'

const hostsThatNeedInvertedFavicons: Record<string, StaticImageData> = {
	"github.com": GithubIcon,
}

export default function Footer() {
	const hrefHost = new URL("https://github.com/mengyangdy/knowledge").host
	const faviconUrl = hostsThatNeedInvertedFavicons[hrefHost]

	return (
		<footer className="mt-32">
			<Container.Outer>
				<div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
					<Container.Inner>
						<div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
							<p className="text-sm text-zinc-500/80 dark:text-zinc-400/80">
								&copy; {new Date().getFullYear()} {BaseConfig.author}
								&nbsp;网站已开源：
								<span>
									<span
										className={cn(
											"mr-px inline-flex translate-y-0.5",
											Object.keys(hostsThatNeedInvertedFavicons).includes(
												hrefHost,
											) && "dark:invert",
										)}
									>
										<Image
											src={faviconUrl}
											alt=""
											aria-hidden="true"
											className="inline h-4 w-4 rounded"
											width={16}
											height={16}
											unoptimized
											priority={false}
										/>
									</span>
									Dylan
									<ExternalLinkIcon
										width="0.95em"
										height="0.95em"
										className="inline-block translate-y-0.5"
										aria-hidden="true"
									/>
								</span>
							</p>
							<nav className="flex gap-6 text-sm font-medium text-zinc-800 dark:text-zinc-200">
								{BaseConfig.navs.map(({ link, text }) => (
									<Link
										key={link}
										href={link}
										className="transition hover:text-violet-500 dark:hover:text-violet-400"
									>
										{text}
									</Link>
								))}
							</nav>
						</div>
					</Container.Inner>
					<Container.Inner className="mt-6">
						<div className="flex flex-col items-center justify-start gap-2 sm:flex-row">
							欢迎 👏🏻 你的访问
						</div>
					</Container.Inner>
					<Link
						target="_blank"
						href="https://beian.miit.gov.cn/"
						className="absolute text-blue-600 w-full bottom-6 left-1/2 -translate-x-1/2 flex justify-center items-center"
					>
						<Image
							unoptimized
							src={"/police.png"}
							width={18}
							height={18}
							alt="备案"
							className="mr-1 "
						/>
						浙ICP备2021039023号-3
					</Link>
				</div>
			</Container.Outer>
		</footer>
	)
}
