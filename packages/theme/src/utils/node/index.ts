import { formatBlogDate } from "@dylanjs/utils"
import { spawn, spawnSync } from "child_process"
import { removeBlank } from "src/constants"

export function aliasObjectToArray(obj: Record<string, string>) {
  return Object.entries(obj).map(([find, replacement]) => ({
    find,
    replacement,
  }))
}

/**
 * 获取文章中带#号的标题 将其作为title处理
 * @param content 文章字符串
 * @returns 处理过后的title字符串
 */
export function getDefaultTitle(content: string) {
  const title =
    clearMatterContent(content)
      .split("\n")
      // 获取到第一个带#符号的标题
      ?.find((str) => {
        return str.startsWith("# ")
      })
      // 去掉#号 获取标题
      ?.slice(2)
      // 匹配以一个或多个空白字符开头或结尾的字符串
      .replace(removeBlank, "") || ""

  return title
}

/**
 * 对文章进行转换去除--- --- 之间的内容 但是包含下面的---
 * @param content 文章字符串
 * @returns 文章字符串
 */
export function clearMatterContent(content: string) {
  let first___: unknown
  let second___: unknown
  // split方法将文章切割为一行一行组成的数组
  const lines = content.split("\n").reduce<string[]>((pre, line) => {
    // 移除开头的空白行
    if (!line.trim() && pre.length === 0) {
      return pre
    }
    if (line.trim() === "---") {
      if (first___ === undefined) {
        first___ = pre.length
      } else if (second___ === undefined) {
        second___ = pre.length
      }
    }
    pre.push(line)
    return pre
  }, [])
  // 去除--- --- 之间的内容但是包含下面的---
  return (
    lines
      // 剔除---之间的内容
      .slice((second___ as number) || 0)
      .join("\n")
  )
}

/**
 * 获取文件在github上的最后一次提交时间
 * @param url 文章的github url
 * @returns 格式化后的时间
 */
export function getFileBirthTime(url: string) {
  let date = new Date()
  try {
    // 参考 vitepress 中的 getGitTimestamp 实现
    const infoStr = spawnSync("git", ["log", "-1", '--pretty="%ci"', url])
      .stdout?.toString()
      .replace(/["']/g, "")
      .trim()
    if (infoStr) {
      date = new Date(infoStr)
    }
  } catch (error) {
    return formatBlogDate(date)
  }

  return formatBlogDate(date)
}
/**
 * 截取文章的前100字 去除标题去除图片等
 * @param text 文章的内容
 * @param count 截取的字数
 * @returns 截取后的文字
 */
export function getTextSummary(text: string, count = 100) {
  return (
    clearMatterContent(text)
      .match(/^# ([\s\S]+)/m)?.[1]
      // 除去标题
      ?.replace(/#/g, "")
      // 除去图片
      ?.replace(/!\[.*?\]\(.*?\)/g, "")
      // 除去链接
      ?.replace(/\[(.*?)\]\(.*?\)/g, "$1")
      // 除去加粗
      ?.replace(/\*\*(.*?)\*\*/g, "$1")
      ?.split("\n")
      ?.filter((v) => !!v)
      ?.slice(1)
      ?.join("\n")
      ?.replace(/>(.*)/, "")
      ?.slice(0, count)
  )
}
