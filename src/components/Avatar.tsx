import { cn } from "@/lib/utils"
import Image from "next/image"
import Link, { type LinkProps } from "next/link"
import type { PropsWithChildren } from "react"

import portraitImage from "/public/logo.webp"

type ComponentProps<P = object> = PropsWithChildren<
	{
		className?: string
	} & P
>

type AvatarImageProps = ComponentProps &
	Omit<LinkProps, "href"> & {
		large?: boolean
		href?: string
		alt?: boolean
	}

function AvatarContainer({ className, ...props }: ComponentProps) {
	return (
		<div
			className={cn(
				className,
				"h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10",
			)}
			{...props}
		/>
	)
}

function AvatarImage({
	large = false,
	className,
	href,
	alt,
	...props
}: AvatarImageProps) {
	return (
		<Link
			href={href ?? "/"}
			className={cn(className, "pointer-events-auto")}
			{...props}
			aria-label="主页"
		>
			<Image
				src={portraitImage}
				alt="头像"
				sizes={large ? "4rem" : "2rem"}
				priority
				className={cn(
					"rounded-full bg-zinc-100 object-cover dark:bg-zinc-800",
					large ? "h-16 w-16" : "h-9 w-9",
				)}
				unoptimized
			/>
		</Link>
	)
}

interface AvatarComponent extends React.FC<ComponentProps> {
	Image: React.FC<AvatarImageProps>
}

const Avatar = Object.assign(AvatarContainer, {
	Image: AvatarImage,
}) as AvatarComponent

export default Avatar
