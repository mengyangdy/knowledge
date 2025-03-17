import Container from "@/components/Container";
import siteMetaData from "@/config/site";
import Link from "next/link";
import Image from 'next/image';

const navigationItems = siteMetaData.navigationItems;

export default function Footer() {
  return (
    <footer className="mt-32">
      <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
        <Container.Inner>
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-zinc-500/80 dark:text-zinc-400/80">
              &copy; {new Date().getFullYear()} {siteMetaData.author}
              &nbsp;
            </p>
            <nav className="flex gap-6 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {navigationItems.map(({ href, text }) => (
                <Link
                key={href} href={href}
                className="transition hover:text-violet-500 dark:hover:text-violet-400"
              >
                {text}
              </Link>
              ))}
            </nav>
          </div>
        </Container.Inner>
        <Link
						target="_blank"
						href="https://beian.miit.gov.cn/"
						className="absolute text-blue-600 w-full bottom-0 left-1/2 -translate-x-1/2 flex justify-center items-center"
					>
						<Image
							unoptimized
							src={'/police.png'}
							width={18}
							height={18}
							alt="备案"
							className="mr-1 "
						/>
						浙ICP备2021039023号-3
					</Link>
      </div>
    </footer>
  );
}
