"use client";

import Container from "@/components/Container";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UTurnLeftIcon, TagIcon } from "@/assets";
import { getAllPosts, Post } from "@/lib/file";
import { Tag, MarkdownRender } from "@douyinfe/semi-ui";
import { usePostsContext } from "@/components/PostsProvider";
import { use } from "react";

const variantStyles = {
  primary:
    "bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-200 dark:text-black dark:hover:bg-zinc-300 dark:active:bg-zinc-300/70",
  secondary:
    "group rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20",
};
interface TypeParams {
  id: string;
}

const Page = ({ params }: any) => {
  const resolvedParams: any = use(params);
  const { posts } = usePostsContext();
  const post:any = posts.find((post) => post.slug === resolvedParams.id);

  return (
    <Container.Outer className="mt-10 lg:mt-16">
      <Container.Inner className="!px-0">
        <div className="w-full md:flex md:justify-between xl:relative gap-1">
          <aside className="hidden w-[160px] shrink-0 lg:block">
            <div className="sticky top-2 pt-16">{/* <Toc /> */}</div>
          </aside>
          <div className="max-w-4xl md:flex-1 md:shrink-0 ">
            <Link
              href="/posts"
              className={cn(
                "group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0",
                variantStyles.secondary
              )}
              aria-label="返回博客页面"
            >
              <UTurnLeftIcon className="h-8 w-8 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
            </Link>
            <article
              data-postid={post.title}
              className="rich-text-viewer prose px-4"
            >
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">{post.title}</h1>
                <div className="flex justify-center rounded-md  h-5 items-center space-x-4 text-sm">
                  <time
                    dateTime={post.date}
                    className="mb-1 text-xs text-gray-600"
                  >
                    {post.date}
                  </time>
                  {/* <Separator orientation="vertical" /> */}
                  <span className="mb-1 text-xs text-gray-600 flex items-center">
                    {/* <HourglassIcon className="mr-2" />{" "} */}
                    {/* {Math.ceil(post)} 分钟 */}
                  </span>
                </div>
                <div className="flex w-full justify-center gap-2 mt-2">
                  {post.tags.map((tag:any) => (
                    <Tag size="large" key={tag}>
                      {tag}
                    </Tag>
                  ))}
                </div>
                {/* 描述渲染 */}
                {post.description && (
                  <div className="bg-gray-200 dark:bg-gray-600 relative p-4 rounded-md mt-4">
                    <TagIcon className="absolute left-4 top-4" />
                    <p className="text-gray-700 dark:text-gray-300">
                      {post.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="js-toc-content">
                <MarkdownRender raw={post.content} format="md" />
              </div>
            </article>
          </div>
        </div>
      </Container.Inner>
    </Container.Outer>
  );
};

export default Page;
