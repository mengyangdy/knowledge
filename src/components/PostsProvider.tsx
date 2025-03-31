"use client"

import { createContext, useContext } from "react"

export interface Post {
  date: string
  tags: any
	title: string
	content: string
	slug: string
	// 其他你需要的元数据
}

interface PostsProviderProps {
	children: React.ReactNode
	posts: Post[]
}

interface PostsContextType {
	posts: Post[]
}

const PostsContext = createContext<PostsContextType>({ posts: [] })

export function PostsProvider({ children, posts }: PostsProviderProps) {
	return (
		<PostsContext.Provider value={{ posts }}>{children}</PostsContext.Provider>
	)
}

export const usePostsContext = () => useContext(PostsContext)
