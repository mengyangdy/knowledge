---
title: vue后台管理系统实战（三）
tags:
  - vue3
  - vue
date: 2024-03-22
---
# vue后台管理系统实战（三）

> 国际化也是我们日常项目中需要使用的功能。

## 使用`vue-i18n`来进行国际化

首先我们需要安装`vue-i18n`这个包来进行国际化，下面是国际化的配置：

```ts
import {createI18n} from "vue-i18n";
import zhCN from './langs/zh-cn'
import enUS from './langs/en-us'

const i18n=createI18n({
  locale:'zh-CN',
  fallbackLocale:'en',
  messages:{
  'zh-CN': zhCN,
  'en-US': enUS
  },
  legacy:false
})

export function setupI18n(app) {
  app.use(i18n)
}

export const $t = i18n.global.t

export function setLocale(locale){
  i18n.global.locale.value=locale
}
```

我们还定义了两个国际化的文件填写各种国际化的词语：

```ts
// langs/zh-cn
 const locale ={
  title:'后台管理系统',
  action:'标题1',
  add:'标题2',
  edit:'标题3',
  check:'标题4',
  delete:'标题5'
}

 export default locale
// langs/en-us
 const locale={  
  title:'my admin',  
  action:'title11',  
  add:'title22',  
  edit:'title33',  
  check:'title44',  
  delete:'title55'  
}  
  
 export default  locale
```

在项目中使用：

```vue
<template>  
  <NConfigProvider  
    :theme="naiveDarkTheme"  
    :theme-overrides="themeStore.naiveTheme"  
    class="h-full"  
  >  
      <div>  
        国际化设置  
        <div>  
          <div>{{$t('title')}}</div>  
          <div>{{$t('action')}}</div>  
          <div>{{$t('add')}}</div>  
          <div>{{$t('edit')}}</div>  
          <div>{{$t('check')}}</div>  
          <div>{{$t('delete')}}</div>  
        </div>  
      </div>  
    </div>  
  
  </NConfigProvider>  
</template>  
  
<script setup lang="ts">  
import {computed} from 'vue'  
import {Icon} from '@iconify/vue'  
import {NConfigProvider, darkTheme, NThemeEditor, GlobalThemeOverrides} from 'naive-ui'  
import {useThemeStore} from './store/modules/theme'  
// 引入$t来加载国际化
import {$t} from './locales/index'  
  
const themeStore = useThemeStore()  
const naiveDarkTheme = computed(() => (themeStore.darkMode ? darkTheme : null))  
  
function btnClick() {  
  themeStore.toggleThemeScheme()  
}  
</script>  
```

我们也可以定义一个按钮或者switch来切换语言，然后使用我们定义好的方法`setLocale`来改变语言。