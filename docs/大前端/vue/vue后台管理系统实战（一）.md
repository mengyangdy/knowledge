---
title: vue后台管理系统实战（一）
tags:
  - vue
  - vue3
date: 2024-03-21
---

# vue后台管理系统实战（一）

> 做了好几年的后台管理系统，实现了很多的功能，现在就整理一下常用的功能，这些是我认为的最佳实践。

**这篇文章主要讲UnoCSS和图标**

## 1. 项目中使用UnoCSS

> **UnoCSS 是一个即时原子化 CSS 引擎，它被设计成灵活且可扩展的**。
>
> 首先，UnoCSS 的核心设计理念是“无固定核心”，意味着它不强制要求使用任何特定的预设或规则，而是通过预设来提供所有 CSS 工具。这种设计使得 UnoCSS 可以非常容易地定制和扩展，以适应不同项目的需求。
>
> 其次，UnoCSS 继承了 Windi CSS 的特性，如按需特性、属性化模式、快捷方式、变体组和编译模式等。这些特性都是为了提高开发效率和性能而设计的。
>
> 再者，UnoCSS 从头开始构建时就考虑到了最大的可扩展性和性能，这使得它能够引入新功能，如纯 CSS 图标、无值的属性化、标签化和网络字体等。
>
> 此外，UnoCSS 还提供了一种原子化的 CSS 方法，这意味着开发者可以通过直观的类名来描述样式的作用，从而提高代码的可读性和可维护性。
>
> 总的来说，UnoCSS 是一个功能强大且灵活的 CSS 引擎，它不仅提供了丰富的特性来帮助开发者高效地编写 CSS，而且还具有很强的可定制性和可扩展性。

### 1.1 项目中使用

使用UnoCSS需要在项目中安装`unocss`这个包：

```shell
pnpm install -D unocss
# 也可以下载下面几个包一起使用，但是在unocss里面都包含了，所以只下载一个unocss也是可以使用的
pnpm install -D @unocss/vite @unocss/transformer-variant-group @unocss/transformer-directives @unocss/preset-uno
```

下载完成之后我们需要在`vite.config.ts`中配置使用这个包：

```ts
import { defineConfig } from 'vite'

import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [UnoCSS()],
})
```

接下来我们需要在项目的根目录创建`uno.config.ts`文件，然后自定义我们需要使用的属性：

```ts
import { defineConfig } from 'unocss'
import { transformerDirectives } from 'unocss'
import { transformerVariantGroup } from 'unocss'
import { presetUno } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'],
    },
  },
  theme: {
    colors: {
      veryCool: '#0000ff', // class="text-very-cool"
    },
    fontSize: {
      'icon-xs': '0.875rem',
      'icon-small': '1rem',
      icon: '1.125rem',
      'icon-large': '1.5rem',
      'icon-xl': '2rem',
    },
  },
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm',
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [presetUno({ dark: 'class' })],
})
```

#### 1.1.1 content属性

> content属性用于配置UnoCSS处理或者忽略哪些文件。

content属性包含了一个pipeline对象，可以制定多个不同的配置：

- include：明确指定需要包含的文件和目录。
- exclude:指定需要排除的文件或目录。

这样做了之后可以优化构建过程，确保只有实际需要被编译的文件被处理，从而提高效率并减少不必要的工作。

#### 1.1.2 theme属性

> theme属性用于定义UnoCSS的主题颜色、字体大小等属性，然后就可以在项目中使用。

theme属性可以包含以下属性：

- colors：定义一组颜色值，可以在项目的样式中使用。
- fontSize：定义一组字体大小。
- fontFamily：定义一组字体样式。

我们在上面的配置中定义了一些`color`和`fontSize`，我们看下效果：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403211107982.png)

可以看到颜色和字体大小已经起效果了。

#### 1.1.3 shortcuts属性

> shortcuts属性可以将多个样式组成一组，可以提高我们的开发效率和代码的可维护性。

我们可以定义一个`flex-center`属性，其中有三个属性`flex justify-center items-center`,在项目中使用后我们可以看一下效果：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403221832907.png)

#### 1.1.4 transformers属性

> transformers属性用于配置UnoCSS的转换器，用于处理一些特殊的指令和特性。

首先我们定义一个`custom-div`的css类，然后写入UnoCSS的样式，这样UnoCSS就可以解析了：

```css
.custom-div {
  @apply text-center my-0 font-medium;
}
```

解析过后的css样式为：

```css
.custom-div[data-v-7a7a37b1]  {
  margin-top: 0;
  margin-bottom: 0;
  text-align: center;
  font-weight: 500;
}
```

#### 1.1.5 presets属性

> presets属性用于配置UnoCSS的预设，这些预设提供了一组预先定义好的配置选项。

也就是说`presetUno`是一组预先设计好的一组样式，我们安装后就可以直接使用了，我们也可以自定义一组样式，在`presets`中引入就可以使用了。

### 在非vue文件中使用

> 当我们在不是vue文件中使用的时候可能图标和样式出不来,因为UnoCSS有可能不会对此文件进行解析。

解决办法有两种：

1. 在文件的头部写上`// @unocss-include`,以便让UnoCSS的解析器解析这个文件。
2. 在我们刚才讲过的属性`content`中的`include`属性中包含这个文件：

```ts
export default defineConfig({
  // ...
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // 这里只写我需要的，当然你也可以定制，参考：https://unocss.dev/guide/extracting#extracting-from-build-tools-pipeline
        "src/router/index.ts",
      ],
      // exclude files
      // exclude: []
    }
  }
)}
```

## 2. SVG图标的使用

> 在项目中我们经常会使用到一些小图标，我所选择的是`iconify`，这个库的图标非常的多并且也都是SVG格式的使用非常的方便。

使用`iconify`图标库需要用到以下几个包：

- @iconify/json：所有图标的合集
- unplugin-icons：按需加载图标
- @iconify/vue：在Vue项目中快速引入和使用图标

### 2.1 通过引入`Icon`组件使用

不需要在`vite`中做任何的配置，在使用的使用我们需要引入`Icon`组件，然后在`https://icones.js.org/`网站上搜索想要使用的图标：

```vue
<template>
  <div>
    测试图标
    <div>
      <Icon icon="twemoji:1st-place-medal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
```

这样我们就可以在网站上看到这个图标了：

![](https://my-vitepress-blog.sh1a.qingstor.com/202403211424689.png)

### 2.2 静态使用方法，直接使用图标作为组件

如果我们不想引入这个图标想直接以图标名作为组件使用的话，需要安装`unplugin-vue-components`这个包，这个包可以自动引入和注册组件。

```ts
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

const collectionName = 'local'
const iconName = 'icon'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    Icons(),
    Components({
      resolvers: [
        IconsResolver({
          customCollections: [collectionName],
          componentPrefix: iconName,
        }),
      ],
    }),
  ],
})
```

这个配置里面的`customCollections`属性作用是用来制定自定义的图标集合，也就是说我们不仅可以使用`@conify/json`里面的图标，我们也可以使用本地的svg图标。`componentPrefix`属性用于指定图标组件的前缀，这样可以避免样式和命名的冲突。

![](https://my-vitepress-blog.sh1a.qingstor.com/202403211524092.png)
我们可以看到图标已经出来了。

### 2.3 本地的svg图片可以直接以图标名作为组件

当我们本地的svg图片也想像上面一样直接作为组件使用的话，需要做以下的配置：

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Components from 'unplugin-vue-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const collectionName = 'local'
const localIconPath = 'src/assets/svg-icon'
const iconName = 'icon'
const localIconName = 'icon-local'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    Icons({
      compiler: 'vue3',
      customCollections: {
        [collectionName]: FileSystemIconLoader(localIconPath, (svg) =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        ),
      },
      scale: 1,
      defaultClass: 'inline-block',
    }),
    createSvgIconsPlugin({
      iconDirs: [localIconPath],
      symbolId: `${localIconName}-[dir]-[name]`,
      inject: 'body-last',
      customDomId: '__SVG_ICON_LOCAL__',
    }),
    Components({
      resolvers: [
        IconsResolver({
          customCollections: [collectionName],
          componentPrefix: iconName,
        }),
      ],
    }),
  ],
})
```

这样配置之后我们就可以在页面上使用了：

```vue
<div>
    测试图标
    <div>
      <Icon icon="twemoji:1st-place-medal" />
      <icon-mdi-emoticon class="text-24px text-red" />
      <icon-local-banner class="text-24px" />
    </div>
  </div>
```

![](https://my-vitepress-blog.sh1a.qingstor.com/202403211531961.png)

### 2.4 图标与UnoCSS配合使用

`iconify`里面的图标也可以配合UnoCSS一起使用，我们可以直接在元素的类名上写上图标名称即可使用：

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Components from 'unplugin-vue-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { presetIcons } from 'unocss'

const collectionName = 'local'
const localIconPath = 'src/assets/svg-icon'
const iconName = 'icon'
const localIconName = 'icon-local'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      presets: [
        presetIcons({
          prefix: `${iconName}-`,
          scale: 1,
          extraProperties: {
            display: 'inline-block',
          },
          collections: {
            [collectionName]: FileSystemIconLoader(localIconPath, (svg) =>
              svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
            ),
          },
          warn: true,
        }),
      ],
    }),
    Icons({
      compiler: 'vue3',
      customCollections: {
        [collectionName]: FileSystemIconLoader(localIconPath, (svg) =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        ),
      },
      scale: 1,
      defaultClass: 'inline-block',
    }),
    createSvgIconsPlugin({
      iconDirs: [localIconPath],
      symbolId: `${localIconName}-[dir]-[name]`,
      inject: 'body-last',
      customDomId: '__SVG_ICON_LOCAL__',
    }),
    Components({
      resolvers: [
        IconsResolver({
          customCollections: [collectionName],
          componentPrefix: iconName,
        }),
      ],
    }),
  ],
})
```

在页面中使用：

```html
<div>
  测试图标
  <div>
    <Icon icon="twemoji:1st-place-medal" />
    <icon-mdi-emoticon class="text-24px text-red" />
    <icon-local-banner class="text-24px" />
    <!-- 使用iconify的图标 -->
    <div class="icon-twemoji:alarm-clock"></div>
    <!-- 使用本地的图标 -->
    <div class="icon-local-copy"></div>
  </div>
</div>
```

效果如下：
![](https://my-vitepress-blog.sh1a.qingstor.com/202403211540661.png)

### 2.5 使用render函数渲染

```ts
export default function useSvgIconRender(SvgIcon: Component) {
  interface IconConfig {
    /** Iconify icon name */
    icon?: string
    /** Local icon name */
    localIcon?: string
    /** Icon color */
    color?: string
    /** Icon size */
    fontSize?: number
  }

  type IconStyle = Partial<Pick<CSSStyleDeclaration, 'color' | 'fontSize'>>
  const SvgIconVNode = (config: IconConfig) => {
    const { color, fontSize, icon, localIcon } = config

    const style: IconStyle = {}

    if (color) {
      style.color = color
    }
    if (fontSize) {
      style.fontSize = `${fontSize}px`
    }

    if (!icon && !localIcon) {
      return undefined
    }

    return () => h(SvgIcon, { icon, localIcon, style })
  }

  return {
    SvgIconVNode,
  }
}
```

使用这个函数之前我们需要创建一个SvgIcon的组件，这个组件是对图标的封装：

```vue
<template>
  <template v-if="renderLocalIcon">
    <svg
      aria-hidden="true"
      width="1em"
      height="1em"
      v-bind="bindAttrs"
    >
      <use
        :xlink:href="symbolId"
        fill="currentColor"
      />
    </svg>
  </template>
  <template v-else>
    <Icon
      v-if="icon"
      :icon="icon"
      v-bind="bindAttrs"
    />
  </template>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import { Icon } from '@iconify/vue'

defineOptions({
  name: 'SvgIcon',
})

interface Props {
  icon?: string
  localIcon?: string
}

const props = defineProps<Props>()

const attrs = useAttrs()

const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || '',
}))

const symbolId = computed(() => {
  const { VITE_ICON_LOCAL_PREFIX: prefix } = import.meta.env
  const defaultLocalIcon = 'no-icon'
  const icon = props.localIcon || defaultLocalIcon
  return `#${prefix}-${icon}`
})

const renderLocalIcon = computed(() => props.localIcon || !props.icon)
</script>

<style scoped></style>
```

使用的话我们这样使用：

```tsx
import { useSvgIconRender } from './xxx'
const { SvgIconVNode } = useSvgIconRender(SvgIcon)
const opts: DropdownOption[] = [
  {
    label: $t('common.userCenter'),
    key: 'user-center',
    icon: SvgIconVNode({ icon: 'ph:user-circle', fontSize: 18 }),
  },
  {
    type: 'divider',
    key: 'divider',
  },
  {
    label: $t('common.logout'),
    key: 'logout',
    icon: SvgIconVNode({ icon: 'ph:sign-out', fontSize: 18 }),
  },
]
```
