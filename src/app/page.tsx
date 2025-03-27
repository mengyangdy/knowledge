import Container from "@/components/Container";
import BaseConfig from "@/config";
import { motion } from "framer-motion";
import { SparkleIcon, SnailIcon } from "@/assets";

export default function Home() {
	return <Container className="mt-10 min-h-[40vh]">
		<div className="max-w-3xl">
			<motion.h1
				className="xs:text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl lg:text-5xl "
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					type: 'spring',
					damping: 25,
					stiffness: 100,
					duration: 0.3
				}}
			>
				<span className="group">
					<span className="font-mono">&lt;</span>
					{BaseConfig.author}&nbsp;
					<span className="font-mono">/&gt;</span>
					<span className="invisible inline-flex text-zinc-300 before:content-['|'] group-hover:visible group-hover:animate-typing dark:text-zinc-500" />
				</span>，
				<span className="group relative bg-black/5 p-1 dark:bg-white/5">
					<span className="pointer-events-none absolute inset-0 border border-violet-700/90 opacity-70 group-hover:border-dashed group-hover:opacity-100 dark:border-violet-400/90">
						<span className="absolute -left-[3.5px] -top-[3.5px] size-1.5 border border-violet-700 bg-zinc-50 dark:border-violet-400" />
						<span className="absolute -bottom-[3.5px] -right-[3.5px] size-1.5 border border-violet-700 bg-zinc-50 dark:border-violet-400" />
						<span className="absolute -bottom-[3.5px] -left-[3.5px] size-1.5 border border-violet-700 bg-zinc-50 dark:border-violet-400" />
						<span className="absolute -right-[3.5px] -top-[3.5px] size-1.5 border border-violet-700 bg-zinc-50 dark:border-violet-400" />
					</span>
					开源爱好者
				</span>，
				<span className="block h-4" />
				<span className="group inline-flex items-center">
					<SparkleIcon className="mr-1 inline-flex transform-gpu transition-transform duration-500 group-hover:rotate-180" />
					<span>AI 深度患者</span>
				</span>，
				<span className="group inline-flex items-center">
					<SnailIcon className="mr-1 inline-flex group-hover:fill-zinc-600/20 dark:group-hover:fill-zinc-200/20" />
					<span>前端工程师</span>
				</span>
			</motion.h1>
			<motion.p
				className="mt-6 text-base text-zinc-600 dark:text-zinc-400"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					type: 'spring',
					damping: 30,
					stiffness: 85,
					duration: 0.3,
					delay: 0.1
				}}
			>
				<Balancer>{BaseConfig.description}</Balancer>
			</motion.p>
		</div>
	</Container>
}
