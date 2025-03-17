import { defineDocumentType, makeSource } from "contentlayer/source-files";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import * as pinyin from "pinyin";

// 定义生成 slug 的函数
export function generateSlug(title: string): string {
  try {
    // 将中文转换为拼音
    const pinyinResult = pinyin.default(title, {
      style: pinyin.STYLE_NORMAL, // 不带声调
      heteronym: false, // 不启用多音字
    });

    // 将拼音数组转换为 URL 友好的字符串
    return pinyinResult
      .map((item) => item[0])
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // 将非字母数字字符替换为连字符
      .replace(/(^-|-$)/g, "");
  } catch (error) {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  // 移除首尾连字符
}


export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",

  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" }, required: true },
    author: { type: "string", required: true },
    cover: { type: "string", required: false },
    date: { type: "date", required: true },
  },
  computedFields: {
    // 从标题生成 slug
    slug: {
      type: "string",
      resolve: (doc) => generateSlug(doc.title),
    },
    url: {
      type: "string",
      resolve: (doc) => `/posts/${generateSlug(doc.title)}`,
    },
    readingTime: {
      type: "nested",
      resolve: (doc) => readingTime(doc.body.code),
    },
  },
}));

export default makeSource({
  // contentDirPath: 'posts',
  contentDirPath: ".",
  contentDirInclude: ["posts", "data/blog"],
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      // 为代码添加特殊样式
      // @ts-ignore
      [rehypePrismPlus, { defaultLanguage: "js", ignoreMissing: true }],
      // 为每个 header 添加 id
      rehypeSlug,
      //为 header 添加链接
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["anchor"],
          },
        },
      ],
    ],
  },
});
