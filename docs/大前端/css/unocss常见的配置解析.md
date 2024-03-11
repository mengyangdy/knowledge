---
title: unocss常见的配置解析
tags:
  - unocss
  - css
date: 2023-09-20
cover: https://s2.loli.net/2023/09/20/RTZg7aKECj9XyGS.jpg
---

# unocss 常见的配置解析

官网 [https://unocss.dev/guide/](https://unocss.dev/guide/) 对 `unocss` 进行了详细的解析，大家可以去看看，这里只对一些 `.unocssconfig.ts` 的配置参数进行解析。

## 配置

`unocss` 的配置主要是在 `unocss.config.ts` 中配置：

### presets 预设

`presets` 是 `unocss` 的核心之一，我们可以选择是否使用 `unocss` 本身的配置，我们也可以自定义自己的 `preset` 让团队使用，如果我们需要使用 `unocss` 自己的 rules，就需要在 `presets` 中引入 `presetUno` 的配置。

```js
presets: [presetUno({ dark: 'class' })],
```

## rules 规则

用来生成一些自定义的 `css` 规则, 比如我们进行如下的设置：

```js
rules: [['ml-1', { 'margin-left': '8px' }]]
```

我们在组件中的元素上可以使用这个规则了定义我们的样式：

```html
<div class="ml-1"></div>
```

这样我们的 div 就有了一个 margin-left 为 8px 的样式。

但是这样做的一个缺点就是不够灵活，如果再来个 div 的样式为 margin-left 为 9px，这样我们有需要再添加一个规则，所以 `unocss` 提供了更加灵活的配置方式：

```js
rules: [[/^ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${parseInt(d) * 8}px` })]]
```

这样的话，我们在元素上使用，可以添加 class 为 ml-1, ml-2, ml-3，`unocss` 会解析出来 ml 为 8px, 16 px, 24 px 的样式。

## shortcuts

官方的说话是，`shortcuts` 可以让我们将多个 `rule` 合并为一个简写的形式，例如：

```js
shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-center': 'flex justify-center items-center',
}
```

第一个的意思是宽 100%，高 100%，这样我们只需要在页面的元素上加上 `wh-full` 的样式，即可设置为宽高都为 100%。

第二个的意思就是 flex 布局垂直水平都居中，我们只需要写一个样式即可。

## theme 主题

`unocss` 同样支持主题配置，我们在配置中通过设置 `theme` 字段来设置变量，用法：

```js
theme: {
    colors: {
        primary: '#3f51b5',
        light: '#fff'
    }
}
```

我们可以将定义的变量 `primary` 和 `light` 进行组合使用，例如：

我们可以在元素中使用 `text-primary` 和 `text-light` 等类名。

## variants

variants 允许我们对现有的规则应用一些变体，比如下面的例子：

```js
// hover
variants: [
  matcher => {
    if (!matcher.startsWith('hover:')) return matcher
    return {
      // slice `hover:` prefix and passed to the next variants and rules
      matcher: matcher.slice(6),
      selector: s => `${s}:hover`
    }
  }
]
```

定义好这个规则之后，我们在组件中使用：

```html
<div class="hover:ml:5"></div>
```

这样就对这个样式做了转换
