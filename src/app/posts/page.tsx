"use client";

import { usePostsContext } from "@/components/PostsProvider";
import Container from "@/components/Container";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Tag } from '@douyinfe/semi-ui';

function Posts() {
  const { posts } = usePostsContext();
  console.log(posts, "posts");

  return (
    <Container className="min-h-[50vh] mt-16">
      <header className="max-w-2xl mb-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-xl">
            我的 Blog
          </h1>
        </div>
        <p className="mt-4 mb-6 text-base text-zinc-600 dark:text-zinc-400">
          记录工作，学习，生活中的所见所闻所想，主要分享领域 <b>前端开发</b>
          ，偶尔也会记录 <b>其他内容</b>
        </p>
      </header>
      <div className={cn("grid grid-cols-1 gap-4")}>
        {posts.map((item) => (
          <Link
            key={item.title}
            href={`/posts/${item.slug}`}
            className="text-violet-500 relative dark:text-violet-400 hover:text-violet-700"
          >
            <div className="px-4 py-4 rounded-sm border-b-[1px] border-violet-200 sm:border-none  cursor-pointer">
              <h2 className="mb-1 text-xl font-medium">
                <span>{item.title}</span>
              </h2>
              <div className="hidden sm:flex flex-wrap mt-2 justify-start  items-center space-x-4 text-sm">
                <time
                  dateTime={item.date}
                  className=" block text-xs text-gray-600"
                >
                  {/* {dayjs(post.date).format("YYYY-MM-DD")} */}
                  {new Date(item.date).toISOString().split('T')[0]}
                </time>
                {/* <Separator orientation="vertical" className="h-5" /> */}
                {item.tags.map((tag:string) => (
                  <Tag size="large" key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}

export default Posts;
