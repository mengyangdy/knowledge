import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const fulPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fulPath, "utf8");

      const { data, content } = matter(fileContents);

      return {
        slug: fileName.replace(/\.md$/, ""),
        title: data.title,
        content,
        ...data,
      };
    });
  return posts;
}
