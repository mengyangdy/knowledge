import path from "node:path";
import fs from "node:fs";
import { glob } from "fast-glob";
import matter from "gray-matter";

import { formatBlogDate } from "@dylanjs/utils";
import type { Theme } from "../../composables/config";
import { getDefaultTitle, getFileBirthTime, getTextSummary } from "./index";

export function getArticles(cfg?: Partial<Theme.BlogConfig>) {
  // srcDir 文件目录 process.argv 执行命令穿的参数 执行的命令为vitepress dev docs  可以获取到docs目录
  const srcDir = cfg?.srcDir || process.argv.slice(2)?.[1] || ".";
  // fast-glob 这个库提供了遍历文件系统的方法 返回一组指定模式匹配的路径名
  const files = glob.sync(`${srcDir}/**/*.md`, { ignore: ["node_modules"] });
  // 循环所有的文章 添加一些属性
  const data = files
    .map((v) => {
      // 去掉末尾的.md
      let route = v.replace(".md", "");

      route = route.replace(
        new RegExp(
          `^${path
            .join(srcDir, "/")
            .replace(new RegExp(`\\${path.sep}`, "g"), "/")}`
        ),
        ""
      );
      // 获取到文章内容
      const fileContent = fs.readFileSync(v, "utf-8");
      // 将--- ---中间的内容转化为一个对象
      const { data: frontmatter } = matter(fileContent, {
        excerpt: true,
      });

      const meta: Partial<Theme.PageMeta> = {
        ...frontmatter,
      };
      // 没有写title的话  从文章的标题中获取
      if (!meta.title) {
        meta.title = getDefaultTitle(fileContent);
      }
      if (!meta.date) {
        // 获取文件在github上的最后提交时间
        meta.date = getFileBirthTime(v);
      } else {
        const timeZone = cfg?.timeZone ?? 8;
        meta.date = formatBlogDate(
          new Date(`${new Date(meta.date).toUTCString()}+${timeZone}`)
        );
      }

      // 处理tag的不同写法 直接跟在tag: 后面 或用 - 写在下面
      meta.tags = typeof meta.tags === "string" ? [meta.tags] : meta.tags;
      meta.tag = [meta.tag || []]
        .flat()
        .concat([...new Set([...(meta.tags || [])])]);

      // 获得摘要信息
      const wordCount = 100;
      meta.description =
        meta.description || getTextSummary(fileContent, wordCount);

      // 获取封面图
      meta.cover =
        meta.cover ??
        (fileContent.match(/[!]\[.*?\]\((https:\/\/.+)\)/)?.[1] || "");

      // 是否发布 默认发布
      if (meta.publish === false) {
        meta.hidden = true;
        meta.recommend = false;
      }

      return {
        route: `/${route}`,
        meta,
      };
    })
    .filter((v) => v.meta.layout !== "home");
  return data as Theme.PageData[];
}

export function patchVPThemeConfig(
  cfg?: Partial<Theme.BlogConfig>,
  vpThemeConfig: any = {}
) {

  // 用于自定义sidebar卡片slot
  vpThemeConfig.sidebar = patchDefaultThemeSideBar(cfg)?.sidebar;

  return vpThemeConfig;
}

export function patchDefaultThemeSideBar(cfg?: Partial<Theme.BlogConfig>) {
  return cfg?.blog !== false && cfg?.recommend !== false
    ? {
        sidebar: [
          {
            text: "",
            items: [],
          },
        ],
      }
    : undefined;
}
