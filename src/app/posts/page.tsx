import Container from "@/components/Container";
import { cn } from "@/lib/utils";
import { allPosts, type Post } from "contentlayer/generated";
import PostCard from "./components/post-item";

export default function Posts() {

  const sortedPosts = allPosts
    .sort((a: any, b: any) => {
      // 按日期降序排序
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    // .slice(0, allPosts.length - 1);

  return (
    <Container className="min-h-[50vh] mt-16">
      <header className="max-w-2xl mb-4">
        <div className="flex items-center ">
          <h1 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-xl">
            我的 blog
          </h1>
        </div>
        <p className="mt-4 mb-6 text-base text-zinc-600 dark:text-zinc-400">
          记录工作，学习，生活中的所见所闻所想，主要分享领域 <b>前端开发</b>
          ，偶尔也会记录 <b>其他内容</b>
        </p>
      </header>
      <div className={cn("grid grid-cols-1 gap-4", false ? "grid-cols-2" : "")}>
        {sortedPosts.map((post: any, idx: number) => (
          <PostCard showCover={false} key={idx} post={post} />
        ))}
      </div>
    </Container>
  );
}
