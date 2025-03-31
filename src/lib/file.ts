import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface Post {
	slug: string
	title: string
	description: string
	date: string
	tags: string[]
}

export function getAllPosts(): Post[] {
	const postsDirectory = path.join(process.cwd(), "posts")
	const fileNames = fs.readdirSync(postsDirectory)
	const posts = fileNames
		.filter((fileName) => fileName.endsWith(".md"))
		.map((fileName) => {
			const fulPath = path.join(postsDirectory, fileName)
			const fileContents = fs.readFileSync(fulPath, "utf8")

			const { data, content } = matter(fileContents)
			console.log("🚀 ~ .map ~ data:", data)

			return {
				slug: fileName.replace(/\.md$/, ""),
				title: data.title,
				description:data.description,
				date: new Date(data.date).toISOString().split('T')[0],
				tags:data.tags,
				content,
			}
		})
		
	return posts
}
