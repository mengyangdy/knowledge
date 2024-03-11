import type {Theme} from '../../shared'
import * as process from "process";
import glob from 'fast-glob'
import path from 'node:path'
import fs from 'node:fs'
import matter from 'gray-matter'
import {getDefaultTitle, getFileBirthTime, getTextSummary} from "vitepress-plugin-rss";
import {formatDate, getFirstImagURLFromMD} from "../client";

// hack：RSS用
export const pageMap = new Map<string, string>()

export function getArticles(cfg?:Partial<Theme.BlogConfig>){
  const srcDir=cfg?.srcDir || process.argv.slice(2)?.[1] || '.'
  const files=glob.sync(`${srcDir}/**/*.md`,{ignore:['node_modules']})

  const data=files.map(v=>{
    let route=v.replace('.md','')

    if (route.startsWith('./')){
      route=route.replace(new RegExp(`^\\.\\/${path.join(srcDir, '/').replace(new RegExp(`\\${path.sep}`, 'g'), '/')}`),'')
    }else{
      route = route.replace(
        new RegExp(
          `^${path
            .join(srcDir, '/')
            .replace(new RegExp(`\\${path.sep}`, 'g'), '/')}`
        ),
        ''
      )
    }

    // hack：RSS使用
    pageMap.set(`/${route}`, v)

    const fileContent=fs.readFileSync(v,'utf-8')

    // TODO：摘要生成优化
    // TODO: 用上内容content
    const { data: frontmatter } = matter(fileContent, {
      excerpt: true
    })

    const meta:Partial<Theme.PageMeta>={
      ...frontmatter
    }

    if (!meta.title){
      meta.title=getDefaultTitle(fileContent)
    }

    if (!meta.date){
      meta.date=getFileBirthTime(v)
    }else{
      const timeZone=cfg?.timeZone??8
      meta.date=formatDate(new Date(`${new Date(meta.date).toUTCString()}+${timeZone}`))
    }
    meta.tags = typeof meta.tags === 'string' ? [meta.tags] : meta.tags
    meta.tag = [meta.tag || []]
      .flat()
      .concat([
        ...new Set([ ...(meta.tags || [])])
      ])

    // 获取摘要信息
    const wordCount=100
    meta.description=meta.description || getTextSummary(fileContent,wordCount)

    // 获取封面图
    meta.cover=meta.cover??(getFirstImagURLFromMD(fileContent, `/${route}`))

    if (meta.publish === false){
      meta.hidden=true
      meta.recommend=false
    }
    return {
      route:`/${route}`,
      meta
    }
  }).filter(v=>v.meta.layout !== 'home')

  return data as Theme.PageData[]
}