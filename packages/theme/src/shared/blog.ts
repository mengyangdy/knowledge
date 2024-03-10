import {resolveConfig, useData} from "vitepress";
import type {Component, InjectionKey, Ref} from "vue";
import {computed, defineComponent, h, provide, ref} from "vue";

import { useColorMode } from '@vueuse/core'

import type {Theme} from './index'


const configSymbol: InjectionKey<Ref<Theme.Config>> = Symbol('theme-config')

const activeTagSymbol: InjectionKey<Ref<Theme.activeTag>> = Symbol('active-tag')

const currentPageNum: InjectionKey<Ref<number>> = Symbol('home-page-num')

const userWorks: InjectionKey<Ref<Theme.UserWorks>> = Symbol('user-works')

const homeFooter: InjectionKey<Theme.Footer | Theme.Footer[] | undefined> = Symbol('home-footer')

export function withConfigProvider(App: Component) {
  return defineComponent({
    name: 'ConfigProvider',
    setup(_, {slots}) {
      const {theme} = useData()
      const config = computed(() => resolveConfig(theme.value))
      provide(homeFooter, config.value.blog?.footer)
      provide(configSymbol, config)
      provide(
        userWorks,
        ref(
          config.value.blog?.works || {
            title: '',
            description: '',
            list: []
          }
        )
      )
      const activeTag = ref<Theme.activeTag>({
        label: '',
        type: ''
      })
      provide(activeTagSymbol, activeTag)
      const pageNum = ref(1)
      provide(currentPageNum, pageNum)
      const mode = useColorMode({
        attribute: 'theme',
        modes: {
          // 内置的颜色主题
          'vp-default': 'vp-default',
          'vp-green': 'vp-green',
          'vp-yellow': 'vp-yellow',
          'vp-red': 'vp-red',
          'el-blue': 'el-blue',
          'el-yellow': 'el-yellow',
          'el-green': 'el-green',
          'el-red': 'el-red'
        }
      })
      mode.value = config.value.blog?.themeColor ?? 'vp-default'
      return () => h(App, null, slots)
    }
  })
}