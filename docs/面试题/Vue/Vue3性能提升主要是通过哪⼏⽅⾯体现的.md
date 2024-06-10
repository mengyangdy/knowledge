---
title: Vue3性能提升主要是通过哪⼏⽅⾯体现的?
tags:
  - vue
  - 面试题
date: 2024-06-10
---

# 一 Vue3性能提升主要是通过哪⼏⽅⾯体现的?

## 1.1 编译阶段

回顾 Vue2 ，我们知道每个组件实例都对应⼀个 watcher 实例，它会在组件渲染的过程中把⽤到的数据 property 记录为依赖，当依赖发⽣改变，触发 setter ，则会通知 watcher ，从⽽使关联的组件重新渲染

![](https://f.pz.al/pzal/2024/06/10/6840f6b11cafe.png)

试想⼀下，⼀个组件结构如下图

```Vue
<template>
      <div id="content">
        <p class="text">静态⽂本</p>
        <p class="text">静态⽂本</p>
        <p class="text">{{ message }}</p>
        <p class="text">静态⽂本</p>
        ...
        <p class="text">静态⽂本</p>
      </div>
    </template>
```

可以看到，组件内部只有⼀个动态节点，剩余⼀堆都是静态节点，所以这⾥很多 diff 和遍历其实都是不需要的，造成性能浪费

因此， Vue3 在编译阶段，做了进⼀步优化。主要有如下：
- diff算法优化
- 静态提升
- 事件监听缓存
- SSR优化

### 1.1.1 diff算法优化

vue3 在 diff 算法中相⽐ vue2 增加了静态标记

关于这个静态标记，其作⽤是为了会发⽣变化的地⽅添加⼀个 flag 标记，下次发⽣变化的时候直接找该地⽅进⾏⽐较

下图这⾥，已经标记静态节点的 p 标签在 diff 过程中则不会⽐较，把性能进⼀步提⾼

![](https://f.pz.al/pzal/2024/06/10/40b303ca44a25.png)

关于静态类型枚举如下

```JS
export const enum PatchFlags {
 TEXT = 1,// 动态的⽂本节点
 CLASS = 1 << 1, // 2 动态的 class
 STYLE = 1 << 2, // 4 动态的 style
 PROPS = 1 << 3, // 8 动态属性，不包括类名和样式
 FULL_PROPS = 1 << 4, // 16 动态 key，当 key 变化时需要完整的 diff 算法做⽐较
 HYDRATE_EVENTS = 1 << 5, // 32 表⽰带有事件监听器的节点
 STABLE_FRAGMENT = 1 << 6, // 64 ⼀个不会改变⼦节点顺序的 Fragment
 KEYED_FRAGMENT = 1 << 7, // 128 带有 key 属性的 Fragment
 UNKEYED_FRAGMENT = 1 << 8, // 256 ⼦节点没有 key 的 Fragment
 NEED_PATCH = 1 << 9, // 512
 DYNAMIC_SLOTS = 1 << 10, // 动态 solt
 HOISTED = -1, // 特殊标志是负整数表⽰永远不会⽤作 diff
 BAIL = -2 // ⼀个特殊的标志，指代差异算法
}
```

### 1.1.2 静态提升

Vue3 中对不参与更新的元素，会做静态提升，只会被创建⼀次，在渲染时直接复⽤

这样就免去了重复的创建节点，⼤型应⽤会受益于这个改动，免去了重复的创建操作，优化了运⾏时候的内存占⽤

```html
<span>你好</span>
<div>{{ message }}</div>
```

没有做静态提升之前

```JS
export function render(_ctx, _cache,
 $props, 
 $setup,
 $data, 
 $options) {
 return (_openBlock(), _createBlock(_Fragment, null, [
 _createVNode("span", null, "你好"),
 _createVNode("div", null, _toDisplayString(_ctx.message), 1 /* TEXT
 /)
 * ], 64 /*
 STABLE_FRAGMENT */))
}
```

做了静态提升之后

```JS
const _hoisted_1 = /
 *#*
 *__PURE*__

 /_createVNode("span", null, "你好", -1 /* HOISTED */)
 export function render(_ctx, _cache,
 $props, 
 $setup,
 $data, 
 $options) {
 return (_openBlock(), _createBlock(_Fragment, null, [
 _hoisted_1,
 _createVNode("div", null, _toDisplayString(_ctx.message), 1 /* TEXT
 /)
 * ], 64 /*
 STABLE_FRAGMENT */))
 }
 // Check the console for the AST
```

静态内容 _hoisted_1 被放置在 render 函数外，每次渲染的时候只要取 _hoisted_1 即可同时 _hoisted_1 被打上了 PatchFlag，静态标记值为 -1，特殊标志是负整数表⽰永远不会⽤于 Diff

### 1.1.3 事件监听缓存

默认情况下绑定事件⾏为会被视为动态绑定，所以每次都会去追踪它的变化

```html
<div>
  <button @click = 'onClick'>点我</button>
</div>
```

没开启事件监听器缓存

```js
 export const render = /
 *#*
 *__PURE*__

 /_withId(function render(_ctx, _cache,
 $props, 
 $setup,
 $data, 
 $options) {
 return (_openBlock(), _createBlock("div", null, [
 _createVNode("button", { onClick: _ctx.onClick }, "点我", 8 /* PROPS */,
["onClick"])
 // PROPS=1<<3,// 8 //动态属性，但不包含类名和样式
 ]))
 })
```

开启事件侦听器缓存后

```JS
export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createBlock('div', null, [
      _createVNode(
        'button',
        {
          onClick:
            _cache[1] || (_cache[1] = (...args) => _ctx.onClick(...args)),
        },
        '点我'
      ),
    ])
  )
}
```

上述发现开启了缓存后，没有了静态标记。也就是说下次 diff 算法的时候直接使⽤

### 1.1.4 SSR优化

当静态内容⼤到⼀定量级时候，会⽤ createStaticVNode ⽅法在客⼾端去⽣成⼀个static node，这些静态 node ，会被直接 innerHtml ，就不需要创建对象，然后根据对象渲染

```html
<div>
      <div>
        <span>你好</span>
      </div>
      ... // 很多个静态属性
      <div>
        <span>{{ message }}</span>
      </div>
    </div>
```

编译后

```js
 import { mergeProps as _mergeProps } from "vue"
 import { ssrRenderAttrs as _ssrRenderAttrs, ssrInterpolate as _ssrInterpolate
} from "@vue/server-renderer"
 export function ssrRender(_ctx, _push, _parent, _attrs,
 $props, 
 $setup,
 $data, 
 $options) {
 const _cssVars = { style: { color: _ctx.color }}
 _push(
 <div${ _ssrRenderAttrs(_mergeProps(_attrs, _cssVars)) }><div><span>你好
</span>...<div><span>你好</span><div><span>${ _ssrInterpolate(_ctx.message)
}</span></div></div>
 )
 }
```

## 1.2 源码体积

相⽐ Vue2 ， Vue3 整体体积变⼩了，除了移出⼀些不常⽤的API，再重要的是 Tree shanking任何⼀个函数，如 ref、reavtived、computed 等，仅仅在⽤到的时候才打包，没⽤到的模块都被摇掉，打包的整体体积变⼩

```JS
import { computed, defineComponent, ref } from 'vue'
export default defineComponent({
  setup(props, context) {
    const age = ref(18)
    let state = reactive({
      name: 'test',
    })
    const readOnlyAge = computed(() => age.value++) // 19
    return {
      age,
      state,
      readOnlyAge,
    }
  },
})
```

## 1.3 响应式系统

vue2 中采⽤ defineProperty 来劫持整个对象，然后进⾏深度遍历所有属性，给每个属性添加 getter 和 setter ，实现响应式

vue3 采⽤ proxy 重写了响应式系统，因为 proxy 可以对整个对象进⾏监听，所以不需要深度遍历
- 可以监听动态属性的添加
- 可以监听到数组的索引和数组 length 属性
- 可以监听删除属性