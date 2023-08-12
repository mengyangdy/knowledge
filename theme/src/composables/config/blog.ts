import {useData, useRoute, withBase} from "vitepress";


import {
  Component,
  computed,
  defineComponent,
  h,
  inject,
  InjectionKey,
  provide,
  Ref,
  onMounted,
  onUnmounted,
  reactive,
  ref
} from "vue";

import type {Theme} from "./index";

const configSymbol: InjectionKey<Ref<Theme.Config
>>= Symbol('theme-config')
const activeTagSymbol: InjectionKey<Ref<Theme.activeTag
>>= Symbol('active-tag')
const currentPageNum: InjectionKey<Ref<number
>>= Symbol('home-page-num')
const homeConfigSymbol: InjectionKey<Theme.HomeConfig> = Symbol('home-config')
const userWorks: InjectionKey<Ref<Theme.UserWorks
>>= Symbol('user-works')

export function withConfigProvider(App: Component) {
  return defineComponent({
    name: 'ConfigProvider',
    props: {
      handleChangeSlogan: {
        type: Function,
        required: false
      }
    },
    setup(props, {slots}) {
      provide(homeConfigSymbol, props as Theme.HomeConfig)
      const {theme} = useData()
      const config = computed(() => resolveConfig(theme.value))
      provide(configSymbol, config)
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

export function useConfig () {
  return {
    config:inject(configSymbol)!.value
  }
}

export function useBlogConfig () {
  return inject(configSymbol)!.value.blog!
}


function resolveConfig (config:Theme.Config):Theme.Config {
  return {
    ...config,
    blog:{
      ...config?.blog,
      pagesData:config?.blog?.pagesData || []
    }
  }
}