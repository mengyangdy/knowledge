---
title: vue后台管理系统实战（二）
tags:
  - vue
  - vue3
date: 2024-03-21
---
# vue后台管理系统实战（二）

> 主题的配置有点复杂，主要是UI框架的主题配置和UnoCSS的主题配置需要相结合一起使用。所以维护了一些自定义的主题配置，然后分别控制UI框架和UnoCSS的主题配置。

![](https://my-vitepress-blog.sh1a.qingstor.com/202403221511845.png)

## 1. 创建自定义颜色变量

首先我们需要创建一组颜色变量，也就是我们项目的主要颜色：
```ts
// theme/settings.ts
export const themeSettings: App.Theme.ThemeSetting = {  
  themeScheme: 'light',  
  themeColor: '#646cff',  
  otherColor: {  
    info: '#2080f0',  
    success: '#52c41a',  
    warning: '#faad14',  
    error: '#f5222d',  
  },  
  isInfoFollowPrimary: true,  
  layout: {  
    mode: 'vertical',  
    scrollMode: 'content',  
  },  
  page: {  
    animate: true,  
    animateMode: 'fade-slide',  
  },  
  header: {  
    height: 56,  
    breadcrumb: {  
      visible: true,  
      showIcon: true,  
    },  
  },  
  tab: {  
    visible: true,  
    cache: true,  
    height: 44,  
    mode: 'chrome',  
  },  
  fixedHeaderAndTab: true,  
  sider: {  
    inverted: false,  
    width: 220,  
    collapsedWidth: 64,  
    mixWidth: 90,  
    mixCollapsedWidth: 64,  
    mixChildMenuWidth: 200,  
  },  
  footer: {  
    visible: true,  
    fixed: false,  
    height: 48,  
    right: true,  
  },  
}
```

其他的我们可以暂时忽略不计，上面我们定义了`themeColor`也就是`primary`的颜色，和其他的颜色`info`、`success`、`warning`、`error`。

因为现在只是一个固定的数据，所以我们需要将这些数据放到`store/theme`文件里面，变成响应式的对象：

```ts
// store/theme
const settings: Ref<App.Theme.ThemeSetting> = ref(initThemeSettings())

const themeColors = computed(() => {  
  const { themeColor, otherColor, isInfoFollowPrimary } = settings.value  
  const colors: App.Theme.ThemeColor = {  
    primary: themeColor,  
    ...otherColor,  
    info: isInfoFollowPrimary ? themeColor : otherColor.info  
  }  
  return colors  
})
```

这样我们就可以修改颜色变量来改变项目的颜色。

## 2. 修改uaive-ui主题颜色

### 2.1 创建unive-ui颜色变量

> 将我们刚才创建的变量传入到`getNaiveThemeColors`函数中创建出我们需要的颜色变量：

```ts
function getNaiveThemeColors(colors: App.Theme.ThemeColor) {
  const colorActions: NaiveColorAction[] = [
    { scene: '', handler: color => color },
    { scene: 'Suppl', handler: color => color },
    {
      scene: 'Hover',
      handler: color => getColorByColorPaletteNumber(color, 500)
    },
    {
      scene: 'Pressed',
      handler: color => getColorByColorPaletteNumber(color, 700)
    },
    { scene: 'Active', handler: color => addColorAlpha(color, 0.1) }
  ]
  const themeColors: NaiveThemeColor = {}

  const colorEntries = Object.entries(colors) as [App.Theme.ThemeColorKey, string][]

  colorEntries.forEach(color => {
    colorActions.forEach(action => {
      const [colorType, colorValue] = color
      const colorKey: NaiveColorKey = `${colorType}Color${action.scene}`
      themeColors[colorKey] = action.handler(colorValue)
    })
  })

  return themeColors
}
```

创建出来的颜色变量为：

```ts
const theme={
errorColor: "#f5222d",
errorColorActive: "#f5222d1a",
errorColorHover: "#ff5533",
errorColorPressed: "#cf2402",
errorColorSuppl: "#f5222d",
infoColor: "#646cff",
infoColorActive: "#646cff1a",
infoColorHover: "#3946f9",
infoColorPressed: "#0d29c4",
infoColorSuppl: "#646cff",
primaryColor: "#646cff",
primaryColorActive: "#646cff1a",
primaryColorHover: "#3946f9",
primaryColorPressed: "#0d29c4",
primaryColorSuppl: "#646cff",
successColor: "#52c41a",
successColorActive: "#52c41a1a",
successColorHover: "#6fed45",
successColorPressed: "#52c41a",
successColorSuppl: "#52c41a",
warningColor: "#faad14",
warningColorActive: "#faad141a",
warningColorHover: "#ffc533",
warningColorPressed: "#d18400",
warningColorSuppl: "#faad14",
}
```

然后将颜色变量通过一个函数返回出去：

```ts
export function getNaiveTheme(colors: App.Theme.ThemeColor) {
  console.log(getNaiveThemeColors(colors))
  const {primary: colorLoading} = colors
  const theme = {
    common: {
      ...getNaiveThemeColors(colors)
    },
    LoadingBar: {
      colorLoading
    }
  }
  return theme
}

const naiveTheme = computed(() => getNaiveTheme(themeColors.value))
```

### 2.2 将颜色变量应用到naive中

将我们创建好的颜色变量应用到`naive`中即可：

```vue
<template>
  <NConfigProvider
    :theme="naiveDarkTheme"
    :theme-overrides="themeStore.naiveTheme"
    class="h-full"
  >
  </NConfigProvider>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {NConfigProvider, darkTheme, NThemeEditor, GlobalThemeOverrides} from 'naive-ui'
import {useThemeStore} from './store/modules/theme'

const themeStore = useThemeStore()
const naiveDarkTheme = computed(() => (themeStore.darkMode ? darkTheme : null))
</script>
```

然后将`naiveTheme`设置到`NConfigProvider`的`theme-overrides`属性上即可。

## 3. 创建css变量

我们将自定义的颜色变量改为css变量写入到html中，然后UnoCSS就可以应用这些变量了。

首先我们先创建这些变量：

```ts
export function createThemeToken(colors: App.Theme.ThemeColor) {
  const paletteColors = createThemePaletteColors(colors)

  const themeTokens: App.Theme.ThemeToken = {
    colors: {
      ...paletteColors,
      nprogress: paletteColors.primary,
      container: 'rgb(255, 255, 255)',
      layout: 'rgb(247, 250, 252)',
      inverted: 'rgb(0, 20, 40)',
      base_text: 'rgb(31, 31, 31)'
    },
    boxShadow: {
      header: '0 1px 2px rgb(0, 21, 41, 0.08)',
      sider: '2px 0 8px 0 rgb(29, 35, 41, 0.05)',
      tab: '0 1px 2px rgb(0, 21, 41, 0.08)'
    }
  }

  const darkThemeTokens: App.Theme.ThemeToken = {
    colors: {
      ...themeTokens.colors,
      container: 'rgb(28, 28, 28)',
      layout: 'rgb(18, 18, 18)',
      base_text: 'rgb(224, 224, 224)'
    },
    boxShadow: {
      ...themeTokens.boxShadow
    }
  }
  console.log("=>(shared.ts:327) darkThemeTokens", darkThemeTokens);

  return {
    themeTokens,
    darkThemeTokens
  }
}

function createThemePaletteColors(colors: App.Theme.ThemeColor) {  
  const colorKeys = Object.keys(colors) as App.Theme.ThemeColorKey[]  
  const colorPaletteVar = {} as App.Theme.ThemePaletteColor  
  
  colorKeys.forEach(key => {  
    const { palettes, main } = getColorPalette(colors[key], key)  
  
    colorPaletteVar[key] = main.hexcode  
  
    palettes.forEach(item => {  
      colorPaletteVar[`${key}-${item.number}`] = item.hexcode  
    })  
  })  
  return colorPaletteVar  
}
```

创建出来的tokens为：

```ts
const themeTokens={
	colors:{
		base_text: "rgb(31, 31, 31)",
		container: "rgb(255, 255, 255)",
		error: "#ff5533",
		error-50: "#fff2f0",
		error-100: "#ffeae6",
		error-200: "#ffd4cc",
		error-300: "#ffb3a3",
		error-400: "#ff846b",
		error-500: "#ff5533",
		error-600: "#f5222d",
		error-700: "#cf2402",
		error-800: "#ae2105",
		error-900: "#901f09",
		error-950: "#520e00",
		info: "#3946f9",
		info-50: "#f0f0ff",
		info-100: "#e6e6ff",
		info-200: "#cccdff",
		info-300: "#a3a5ff",
		info-400: "#646cff",
		info-500: "#3946f9",
		info-600: "#1830e7",
		info-700: "#0d29c4",
		info-800: "#0e2aa4",
		info-900: "#102889",
		info-950: "#03114f",
		inverted: "rgb(0, 20, 40)",
		layout: "rgb(247, 250, 252)",
		nprogress: "#3946f9",
		primary: "#3946f9",
		primary-50: "#f0f0ff",
		primary-100: "#e6e6ff",
		primary-200: "#cccdff",
		primary-300: "#a3a5ff",
		primary-400: "#646cff",
		primary-500: "#3946f9",
		primary-600: "#1830e7",
		primary-700: "#0d29c4",
		primary-800: "#0e2aa4",
		primary-900: "#102889",
		primary-950: "#03114f",
		success: "#6fed45",
		success-50: "#f2fef0",
		success-100: "#eafee6",
		success-200: "#d8fccf",
		success-300: "#b9faa8",
		success-400: "#92f674",
		success-500: "#6fed45",
		success-600: "#5bdb24",
		success-700: "#52c41a",
		success-800: "#489b17",
		success-900: "#408217",
		success-950: "#204a07",
		warning: "#ffc533",
		warning-50: "#fffcf0",
		warning-100: "#fffae6",
		warning-200: "#fff3cc",
		warning-300: "#ffeaa3",
		warning-400: "#ffd86b",
		warning-500: "#ffc533",
		warning-600: "#faad14",
		warning-700: "#d18400",
		warning-800: "#b26b00",
		warning-900: "#945805",
		warning-950: "#523100",
	},
	boxShadow:{
		header: "0 1px 2px rgb(0, 21, 41, 0.08)",
		sider: "2px 0 8px 0 rgb(29, 35, 41, 0.05)",
		tab: "0 1px 2px rgb(0, 21, 41, 0.08)"
	}
	}
```

然后通过`setupThemeVarsToHtml`方法创建css变量：

```ts
  function setupThemeVarsToHtml(){
    const {themeTokens,darkThemeTokens}=createThemeToken(themeColors.value)
    addThemeVarsToHtml(themeTokens,darkThemeTokens)
  }
```

创建css变量的方法：

```ts
export function addThemeVarsToHtml(tokens: App.Theme.BaseToken, darkTokens: App.Theme.BaseToken) {
  const cssVarStr = getCssVarByTokens(tokens)
  const darkCssVarStr = getCssVarByTokens(darkTokens)

  const css = `
    html {
      ${cssVarStr}
    }
  `

  const darkCss = `
    html.${DARK_CLASS} {
      ${darkCssVarStr}
    }
  `
  const style = document.createElement('style')

  style.textContent = css + darkCss

  document.head.appendChild(style)
}

function getCssVarByTokens(tokens: App.Theme.BaseToken) {  
  const styles: string[] = []  
  
  function removeVarPrefix(value: string) {  
    return value.replace('var(', '').replace(')', '')  
  }  
  
  function removeRgbPrefix(value: string) {  
    return value.replace('rgb(', '').replace(')', '')  
  }  
  
  for (const [key, tokenValues] of Object.entries(themeVars)) {  
    for (const [tokenKey, tokenValue] of Object.entries(tokenValues)) {  
      let cssVarsKey = removeVarPrefix(tokenValue)  
      let cssValue = tokens[key][tokenKey]  
  
      if (key === 'colors') {  
        cssVarsKey = removeRgbPrefix(cssVarsKey)  
        const { r, g, b } = getRgbOfColor(cssValue)  
        cssValue = `${r} ${g} ${b}`  
      }  
  
      styles.push(`${cssVarsKey}: ${cssValue}`)  
    }  
  }  
  
  const styleStr = styles.join(';')  
  
  return styleStr  
}
```

这样我们就将变量添加到html上面了：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403221600866.png)

然后我们可以通过watch监听`themeColors`自定义变量的变化，当变化后重新执行`setupThemeVarsToHtml`方法，创建新的css变量。

```ts
watch(themeColors,val=>{  
  setupThemeVarsToHtml()  
},{immediate:true})
```

## 4. 添加UnoCSS颜色变量

首先我们定义一组颜色变量，需要使用到上面的css变量，应为上面的css变量其实是`rgb`的三个数字，所以我们需要用`rgb`来包裹一下才能使用：

```ts
export const themeVars: App.Theme.ThemeToken = {  
  colors: {  
    ...colorPaletteVars,  
    nprogress: 'rgb(var(--nprogress-color))',  
    container: 'rgb(var(--container-bg-color))',  
    layout: 'rgb(var(--layout-bg-color))',  
    inverted: 'rgb(var(--inverted-bg-color))',  
    base_text: 'rgb(var(--base-text-color))'  
  },  
  boxShadow: {  
    header: 'var(--header-box-shadow)',  
    sider: 'var(--sider-box-shadow)',  
    tab: 'var(--tab-box-shadow)'  
  }  
}

function createColorPaletteVars() {  
  const colors: App.Theme.ThemeColorKey[] = ['primary', 'info', 'success', 'warning', 'error']  
  const colorPaletteNumbers: App.Theme.ColorPaletteNumber[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]  
  
  const colorPaletteVar = {} as App.Theme.ThemePaletteColor  
  
  colors.forEach(color => {  
    colorPaletteVar[color] = `rgb(var(--${color}-color))`  
    colorPaletteNumbers.forEach(number => {  
      colorPaletteVar[`${color}-${number}`] = `rgb(var(--${color}-${number}-color))`  
    })  
  })  
  
  return colorPaletteVar  
}  
  
const colorPaletteVars = createColorPaletteVars()
```

这样创建出来的变量为：

```ts
const themeVars={
  colors: {
    primary: 'rgb(var(--primary-color))',
    'primary-50': 'rgb(var(--primary-50-color))',
    'primary-100': 'rgb(var(--primary-100-color))',
    'primary-200': 'rgb(var(--primary-200-color))',
    'primary-300': 'rgb(var(--primary-300-color))',
    'primary-400': 'rgb(var(--primary-400-color))',
    'primary-500': 'rgb(var(--primary-500-color))',
    'primary-600': 'rgb(var(--primary-600-color))',
    'primary-700': 'rgb(var(--primary-700-color))',
    'primary-800': 'rgb(var(--primary-800-color))',
    'primary-900': 'rgb(var(--primary-900-color))',
    'primary-950': 'rgb(var(--primary-950-color))',
    info: 'rgb(var(--info-color))',
    'info-50': 'rgb(var(--info-50-color))',
    'info-100': 'rgb(var(--info-100-color))',
    'info-200': 'rgb(var(--info-200-color))',
    'info-300': 'rgb(var(--info-300-color))',
    'info-400': 'rgb(var(--info-400-color))',
    'info-500': 'rgb(var(--info-500-color))',
    'info-600': 'rgb(var(--info-600-color))',
    'info-700': 'rgb(var(--info-700-color))',
    'info-800': 'rgb(var(--info-800-color))',
    'info-900': 'rgb(var(--info-900-color))',
    'info-950': 'rgb(var(--info-950-color))',
    success: 'rgb(var(--success-color))',
    'success-50': 'rgb(var(--success-50-color))',
    'success-100': 'rgb(var(--success-100-color))',
    'success-200': 'rgb(var(--success-200-color))',
    'success-300': 'rgb(var(--success-300-color))',
    'success-400': 'rgb(var(--success-400-color))',
    'success-500': 'rgb(var(--success-500-color))',
    'success-600': 'rgb(var(--success-600-color))',
    'success-700': 'rgb(var(--success-700-color))',
    'success-800': 'rgb(var(--success-800-color))',
    'success-900': 'rgb(var(--success-900-color))',
    'success-950': 'rgb(var(--success-950-color))',
    warning: 'rgb(var(--warning-color))',
    'warning-50': 'rgb(var(--warning-50-color))',
    'warning-100': 'rgb(var(--warning-100-color))',
    'warning-200': 'rgb(var(--warning-200-color))',
    'warning-300': 'rgb(var(--warning-300-color))',
    'warning-400': 'rgb(var(--warning-400-color))',
    'warning-500': 'rgb(var(--warning-500-color))',
    'warning-600': 'rgb(var(--warning-600-color))',
    'warning-700': 'rgb(var(--warning-700-color))',
    'warning-800': 'rgb(var(--warning-800-color))',
    'warning-900': 'rgb(var(--warning-900-color))',
    'warning-950': 'rgb(var(--warning-950-color))',
    error: 'rgb(var(--error-color))',
    'error-50': 'rgb(var(--error-50-color))',
    'error-100': 'rgb(var(--error-100-color))',
    'error-200': 'rgb(var(--error-200-color))',
    'error-300': 'rgb(var(--error-300-color))',
    'error-400': 'rgb(var(--error-400-color))',
    'error-500': 'rgb(var(--error-500-color))',
    'error-600': 'rgb(var(--error-600-color))',
    'error-700': 'rgb(var(--error-700-color))',
    'error-800': 'rgb(var(--error-800-color))',
    'error-900': 'rgb(var(--error-900-color))',
    'error-950': 'rgb(var(--error-950-color))',
    nprogress: 'rgb(var(--nprogress-color))',
    container: 'rgb(var(--container-bg-color))',
    layout: 'rgb(var(--layout-bg-color))',
    inverted: 'rgb(var(--inverted-bg-color))',
    base_text: 'rgb(var(--base-text-color))'
  },
  boxShadow: {
    header: 'var(--header-box-shadow)',
    sider: 'var(--sider-box-shadow)',
    tab: 'var(--tab-box-shadow)'
  }
}
```

然后我们将这些变量添加到UnoCSS中即可：

```ts
import { defineConfig } from 'unocss'   
import { themeVars } from './src/theme/vars'  
  
  
export default defineConfig({  
  theme: {  
    ...themeVars,  
    // colors: {  
    //   veryCool: '#0000ff', // class="text-very-cool"    // },    fontSize: {  
      'icon-xs': '0.875rem',  
      'icon-small': '1rem',  
      icon: '1.125rem',  
      'icon-large': '1.5rem',  
      'icon-xl': '2rem',  
    },  
  }, 
})
```

这样我们就可以在页面中使用了：

```vue
<div>  
  unocss主题变量  
  <div class="text-30px text-primary">primary</div>  
  <div class="text-error">error</div>  
  <div class="text-warning">warning</div>  
  <div class="text-info">info</div>  
  <div class="text-success">success</div>  
</div>
```

![](https://my-vitepress-blog.sh1a.qingstor.com/202403221608962.png)

## 5. 暗黑模式

我们在`settings`里面已经定义了模式`themeScheme`，默认为`ligit`也就是亮色模式。

我们使用了`@vueuse/core`里面的`usePreferredColorScheme`方法来获取当前操作系统的模式是不是暗黑模式。

```ts
const osTheme = usePreferredColorScheme()
const darkMode = computed(() => {  
  if (settings.value.themeScheme === 'auto') {  
    return osTheme.value === 'dark'  
  }  
  return settings.value.themeScheme === 'dark'  
})
```

我们定义了一个`darkMode`变量来定义当前是否是暗黑模式，这样我们就可以将暗黑模式传给`naive`来使用：

```vue
<template>  
  <NConfigProvider  
    :theme="naiveDarkTheme"  
    :theme-overrides="themeStore.naiveTheme"  
    class="h-full"  
  >  
  </NConfigProvider>  
</template>  
  
<script setup lang="ts">  
import {NConfigProvider, darkTheme, NThemeEditor, GlobalThemeOverrides} from 'naive-ui'  
import {useThemeStore} from './store/modules/theme'  
  
const themeStore = useThemeStore()  
const naiveDarkTheme = computed(() => (themeStore.darkMode ? darkTheme : null))  
  
function btnClick() {  
  themeStore.toggleThemeScheme()  
}  
</script>  
```

当我们需要改变模式的话，只需要将`setting`里面的`themeScheme`修改就可以了：

```ts
 function toggleThemeScheme() {
    const themeSchemes= ['light', 'dark', 'auto']

    const index = themeSchemes.findIndex(item => item === settings.value.themeScheme)

    const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1
    const nextThemeScheme = themeSchemes[nextIndex]
    setThemeScheme(nextThemeScheme)
  }

  function setThemeScheme(themeScheme) {
    settings.value.themeScheme = themeScheme
  }
```

### 5.1 没有使用框架如何使用暗黑模式

因为我们项目使用了UnoCSS，所以只需要在预设里面设置上`dark`，项目中就可以使用`dark:bg-#000`这样的样式了。

```ts
// uno.config.ts
presets: [presetUno({ dark: 'class' })],
```

项目中使用：
```vue
<div class="bg-white dark:bg-#000 h-full" >
```
![](https://my-vitepress-blog.sh1a.qingstor.com/202403221624083.png)


## 6. 修改项目主题颜色

当我们需要修改项目主题颜色的时候，需要定义一个颜色按钮，然后来进行修改：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403221617622.png)


当我们修改某一个颜色的时候就可以触发`updateThemeColors`事件：

```ts
function updateThemeColors(key: App.Theme.ThemeColorKey, color: string) {
    if (key === 'primary') {
      settings.value.themeColor = color
    } else {
      settings.value.otherColor[key] = color
    }
  }
```

这样修改`settings`里面的主题颜色就会触发`themeColors`的变化，`themeColors`变化就会触发`naiveTheme`的修改和`setupThemeVarsToHtml`css变量的修改，这样就做到了全局颜色的自动变化了。