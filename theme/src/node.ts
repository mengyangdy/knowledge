import glob from "fast-glob";
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import {execSync,spawn,spawnSync} from 'child_process'
import type {SiteConfig,UserConfig} from "vitepress";
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import {formatDate} from "../../utils";


import {Theme} from "./composables/config";

const checkKeys = ['themeConfig']

export function getThemeConfig (cfg?:Partial<Theme.BlogConfig>) {
  const srcDir=cfg?.srcDir || process.argv.slice(2)?.[1]||'.'
  const files=glob.sync(`${srcDir}/**/*.md`,{ignore:['node_modules']})

  const data=files.map(v=>{
    let route=v.replace('.md','')
  })

}