---
title: Vue3的设计⽬标是什么?
tags:
  - vue
  - 面试题
date: 2024-06-10
---

# 一 Vue3的设计⽬标是什么?

## 1.1 设计⽬标

不以解决实际业务痛点的更新都是耍流氓，下⾯我们来列举⼀下 Vue3 之前我们或许会⾯临的问题
- 随着功能的增⻓，复杂组件的代码变得越来越难以维护
- 缺少⼀种⽐较「⼲净」的在多个组件之间提取和复⽤逻辑的机制
- 类型推断不够友好
- bundle 的时间太久了

⽽ Vue3 经过⻓达两三年时间的筹备，做了哪些事情？

我们从结果反推
- 更⼩
- 更快
- TypeScript⽀持
- API设计⼀致性
- 提⾼⾃⾝可维护性
- 开放更多底层功能

⼀句话概述，就是更⼩更快更友好了

### 1.1.1 更⼩

Vue3 移除⼀些不常⽤的 API引⼊ tree-shaking ，可以将⽆⽤模块“剪辑”，仅打包需要的，使打包的整体体积变⼩了

### 1.1.2 更快

主要体现在编译⽅⾯：
- diff算法优化
- 静态提升
- 事件监听缓存
- SSR优化

### 1.1.3 更友好

vue3 在兼顾 vue2 的 options API 的同时还推出了 composition API ，⼤⼤增加了代码的逻辑组织和代码复⽤能⼒

这⾥代码简单演⽰下：

存在⼀个获取⿏标位置的函数

```JS
 import { toRefs, reactive } from 'vue';
 function useMouse(){
 const state = reactive({x:0,y:0});
 const update = e=>{
 state.x = e.pageX;
 state.y = e.pageY;
 }
 onMounted(()=>{
 window.addEventListener('mousemove',update);
 })
 onUnmounted(()=>{
 window.removeEventListener('mousemove',update);
 })
 return toRefs(state);
 }
```

我们只需要调⽤这个函数，即可获取 x 、 y 的坐标，完全不⽤关注实现过程

试想⼀下，如果很多类似的第三⽅库，我们只需要调⽤即可，不必关注实现过程，开发效率⼤⼤提⾼

同时， VUE3 是基于 typescipt 编写的，可以享受到⾃动的类型定义提⽰

## 1.2 优化⽅案
## 
vue3 从很多层⾯都做了优化，可以分成三个⽅⾯：
- 源码
- 性能
- 语法 API

### 1.2.1 源码

源码可以从两个层⾯展开：
- 源码管理
- TypeScript

#### 1.2.1.1 源码管理

vue3 整个源码是通过 monorepo 的⽅式维护的，根据功能将不同的模块拆分到 packages ⽬录下⾯不同的⼦⽬录中

这样使得模块拆分更细化，职责划分更明确，模块之间的依赖关系也更加明确，开发⼈员也更容易阅读、理解和更改所有模块源码，提⾼代码的可维护性

另外⼀些 package （⽐如 reactivity 响应式库）是可以独⽴于 Vue 使⽤的，这样⽤⼾如果只想使⽤ Vue3 的响应式能⼒，可以单独依赖这个响应式库⽽不⽤去依赖整个 Vue

#### 1.1.1.2 ypeScript

Vue3 是基于 typeScript 编写的，提供了更好的类型检查，能⽀持复杂的类型推导

### 1.2.2 性能

vue3 是从什么哪些⽅⾯对性能进⾏进⼀步优化呢？
- 体积优化
- 编译优化
- 数据劫持优化

这⾥讲述数据劫持：

在 vue2 中，数据劫持是通过 Object.defineProperty ，这个 API 有⼀些缺陷，并不能检测对象属性的添加和删除

```JS
 Object.defineProperty(data, 'a',{
 get(){
 // track
 },
 set(){
 // trigger
 }
 })
```

尽管 Vue 为了解决这个问题提供了 set 和 delete 实例⽅法，但是对于⽤⼾来说，还是增加了⼀定的⼼智负担

同时在⾯对嵌套层级⽐较深的情况下，就存在性能问题

```JS
 default {
 data: {
 a: {
 b: {
 c: {
 d: 1
 }
 }
 }
 }
 }
```

相⽐之下， vue3 是通过 proxy 监听整个对象，那么对于删除还是监听当然也能监听到,同时 Proxy 并不能监听到内部深层次的对象变化，⽽ Vue3 的处理⽅式是在 getter 中去递归响应式，这样的好处是真正访问到的内部对象才会变成响应式，⽽不是⽆脑递归

### 1.2.3 语法 API

这⾥当然说的就是 composition API ，其两⼤显著的优化：
- 优化逻辑组织
- 优化逻辑复⽤

#### 1.2.3.1 逻辑组织

Composition API 在逻辑组织⽅⾯的优势,相同功能的代码编写在⼀块，⽽不像 options API 那样，各个功能的代码混成⼀块

#### 1.2.3.2 逻辑复⽤

在 vue2 中，我们是通过 mixin 实现功能混合，如果多个 mixin 混合，会存在两个⾮常明显的问题：命名冲突和数据来源不清晰

⽽通过 composition 这种形式，可以将⼀些复⽤的代码抽离出来作为⼀个函数，只要的使⽤的地⽅直接进⾏调⽤即可

同样是上⽂的获取⿏标位置的例⼦

```JS
 import { toRefs, reactive, onUnmounted, onMounted } from 'vue';
 function useMouse(){
 const state = reactive({x:0,y:0});
 const update = e=>{
 state.x = e.pageX;
 state.y = e.pageY;
 }
 onMounted(()=>{
 window.addEventListener('mousemove',update);
 })
 onUnmounted(()=>{
 window.removeEventListener('mousemove',update);
 })
 return toRefs(state);
 }
```

组件使⽤

```JS
 import useMousePosition from './mouse'
 export default {
 setup() {
 const { x, y } = useMousePosition()
 return { x, y }
 }
 }
```

可以看到，整个数据来源清晰了，即使去编写更多的 hook 函数，也不会出现命名冲突的问题