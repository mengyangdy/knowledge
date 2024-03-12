import {useData, useRoute, withBase} from "vitepress";
import type {Component, InjectionKey, Ref} from "vue";
import {computed, defineComponent, h, inject, provide, ref} from 'vue'

import type {Theme} from '../typings'

const configSymbol: InjectionKey<Ref<Theme.Config>> = Symbol('theme-config')
const activeTagSymbol: InjectionKey<Ref<Theme.activeTag>> = Symbol('active-tag')
const currentPageNum: InjectionKey<Ref<number>> = Symbol('home-page-num')
const homeConfigSymbol: InjectionKey<Theme.HomeConfig> = Symbol('home-config')
const userWorks: InjectionKey<Ref<Theme.UserWorks>> = Symbol('user-works')

const homeFooter: InjectionKey<Theme.Footer | Theme.Footer[] | undefined> = Symbol('home-footer')

export function withConfigProvider (App:Component) {
  return defineComponent({
    name:'ConfigProvider',
    setup(_,{slots}){
      const {theme}=useData()
      const config=computed(()=>resolveConfig(theme.value))
      provide(homeFooter, config.value.blog?.footer)
      provide(configSymbol,config)
      provide(userWorks, ref(config.value.blog?.works || {
        title: '',
        description: '',
        list: []
      }))
      const activeTag = ref<Theme.activeTag>({
        label: '',
        type: ''
      })
      provide(activeTagSymbol, activeTag)
      const pageNum = ref(1)
      provide(currentPageNum, pageNum)
      return () => h(App, null, slots)
    }
  })
}

function resolveConfig (config:Theme.Config):Theme.Config {
  return{
    ...config,
    blog:{
      ...config?.blog,
      pagesData:config?.blog?.pagesData||[]
    }
  }
}

export function useConfig () {
  return {
    config:inject(configSymbol)!.value
  }
}

export function useBlogConfig () {
  return inject(configSymbol)!.value.blog!
}

export function useBlogThemeMode(){
  return inject(configSymbol)!.value?.blog?.blog ?? true
}

export function useHomeConfig () {
  return inject(homeConfigSymbol)!
}

export function useGiscusConfig () {
  const blogConfig=useConfig()
  return blogConfig.config?.blog?.comment
}

export function useArticles () {
  const blogConfig=useConfig()
  return computed(() => blogConfig.config?.blog?.pagesData || [])
}

export function useActiveTag () {
  return inject(activeTagSymbol)!
}

export function useCurrentPageNum () {
  return inject(currentPageNum)!
}

export function useCurrentArticle () {
  const blogConfig=useConfig()
  const route=useRoute()
  const docs=computed(()=>blogConfig.config?.blog?.pagesData)
  return computed(() => {
    const currentPath = route.path.replace(/.html$/, '')
    const okPaths = [currentPath, decodeURIComponent(currentPath)]
    if (currentPath.endsWith('/')) {
      okPaths.push(...[`${currentPath}index`, `${decodeURIComponent(currentPath)}index`])
    }
    return docs.value?.find(v => okPaths.includes(withBase(v.route)))
  })
}

export function useUserWorks () {
  return inject(userWorks)!
}

export function useDocMetaInsertPosition() {
  const blogConfig = useConfig()
  const { frontmatter } = useData()
  return computed(() => frontmatter.value?.docMetaInsertPosition || blogConfig.config?.blog?.docMetaInsertPosition || 'after')
}

export function useDocMetaInsertSelector() {
  const blogConfig = useConfig()
  const { frontmatter } = useData()
  return computed(() => frontmatter.value?.docMetaInsertSelector || blogConfig.config?.blog?.docMetaInsertSelector || 'h1')
}

export function useHomeFooterConfig() {
  return inject(homeFooter)
}