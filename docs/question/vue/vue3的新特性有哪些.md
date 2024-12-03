# vue3的新特性有哪些？

## 1. 性能提升

- 响应式性能提升，由原来的 Object.defineProperty 改为基于 ES6 的 Proxy ，使其速度更快
- 重写了 Vdom (diff算法优化，增加静态标志)
- 进⾏模板编译优化（静态提升，不参与更新的元素只被创建⼀次）
- 更加⾼效的组件初始化



## 2. 更好的支持typescript

- Vue.js 2.x 选⽤ Flow 做类型检查，来避免⼀些因类型问题导致的错误，但是 Flow 对于⼀些复杂场景类型的检查，⽀持得并不好
- Vue.js 3.0 抛弃了 Flow ，使⽤ TypeScript 重构了整个项⽬
- TypeScript 提供了更好的类型检查，能⽀持复杂的 类型推断



## 3. 新增的Composition API

Composition API 是 vue3 新增的功能，⽐ mixin 更强⼤。它可以把各个功能模块独⽴开

来，提⾼代码逻辑的可复⽤性，同时代码压缩性更强。

在 Vue3 中，定义 methods 、 watch 、 computed 、 data 数据等都放在了setup() 函数中。

setup() 函数会在 created() ⽣命周期之前执⾏。执⾏顺序为： beforeCreate > setup> create



## 4. 新增组件

- Fragment 不再限制 template 只有⼀个根节点。

- Teleport 传送⻔，允许我们将控制的内容传送到任意的 DOM 中。

- Suspense 等待异步组件时渲染⼀些额外的内容，让应⽤有更好的⽤⼾体验。



## 5. Tree-shaking:支持摇树优化

摇树优化后会将不需要的模块修剪掉，真正需要的模块打到包内。优化后的项⽬体积只有原来的⼀

半，加载速度更快



## 6. Custom Renderer API:自定义渲染器

实现 DOM 的⽅式进⾏ WebGL 编程

