import { cn } from "@/lib/utils";
import { Post } from "contentlayer/generated";
import dayjs from "dayjs";
import Link from "next/link";
import Image from 'next/image';
import { AspectRatio } from "@/components/ui/AspectRatio";
import { Separator } from "@/components/ui/Separator";
import { Tag } from "./tag-item";
import { generateSlug } from "@/lib/pinyin";


function PostCard({ post, showCover }: { post: Post; showCover?: boolean }) {
	return (
		<Link
			href={`/posts/${generateSlug(post.title)}`}
			className={cn(
				'text-violet-500 relative dark:text-violet-400',
				showCover ? 'hover:drop-shadow-2xl' : ' hover:text-violet-700'
			)}
		>
			{showCover && (
				<AspectRatio
					ratio={16 / 9}
					className="bg-muted absolute left-0 top-0 rounded-md overflow-hidden"
				>
					<Image
						unoptimized
						src={post.cover ?? ''}
						alt={post.title}
						fill
						className=" object-cover"
					/>
				</AspectRatio>
			)}
			<div className="px-4 py-4 rounded-sm border-b-[1px] border-violet-200 sm:border-none  cursor-pointer">
				<h2 className="mb-1 text-xl font-medium">
					<span>{post.title}</span>
				</h2>
				<div className="hidden sm:flex flex-wrap mt-2 justify-start  items-center space-x-4 text-sm">
					<time dateTime={post.date} className=" block text-xs text-gray-600">
						{dayjs(post.date).format('YYYY-MM-DD')}
					</time>
					<Separator orientation="vertical" className="h-5" />
					{post.tags.map((tag:any) => (
						<Tag key={tag}>{tag}</Tag>
					))}
				</div>
			</div>
		</Link>
	);
}

export default PostCard;
