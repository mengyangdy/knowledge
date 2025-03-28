'use client';

import { usePostsContext } from "@/components/PostsProvider";

function Posts (){
  const { posts } = usePostsContext();
  return (
    <div>
      1
    </div>
  )
}

export default Posts