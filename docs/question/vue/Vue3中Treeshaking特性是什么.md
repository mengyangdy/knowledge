---
title: Vue3中Treeshaking特性是什么?
tags:
  - vue
  - 面试题
date: 2024-06-10
---

# Vue3中Treeshaking特性是什么?

## 1 是什么

Tree Shaking 是一种代码优化技术，用于消除 JavaScript 代码中未使用的导出（dead code）。这一过程依赖于 ES2015（ES6）模块系统提供的静态导入和导出语法，因为这种语法使得模块间的依赖关系在编译时就可以被静态分析确定。简而言之，Tree Shaking 会“摇晃”代码树，将未被引用的代码“摇落”，从而减小最终打包产物的体积，提高应用程序的加载和运行效率。

在 Vue2 中，⽆论我们使⽤什么功能，它们最终都会出现在⽣产代码中。主要原因是 Vue 实例在项⽬中是单例的，捆绑程序⽆法检测到该对象的哪些属性在代码中被使⽤到

```JS
import Vue from 'vue'
Vue.nextTick(() => {})
```

⽽ Vue3 源码引⼊ tree shaking 特性，将全局 API 进⾏分块。如果您不使⽤其某些功能，它们将不会包含在您的基础包中

```JS
import { nextTick, observable } from 'vue'
nextTick(() => {})
```

## 2 如何做

Tree shaking 是基于 ES6 模板语法（ import 与 exports ），主要是借助 ES6 模块的静态编译思想，在编译时就能确定模块的依赖关系，以及输⼊和输出的变量

Tree shaking ⽆⾮就是做了两件事：
- 编译阶段利⽤ ES6 Module 判断哪些模块已经加载
- 判断那些模块和变量未被使⽤或者引⽤，进⽽删除对应代码

下⾯就来举个例⼦：

通过脚⼿架 vue-cli 安装 Vue2 与 Vue3 项⽬

```JS
vue create vue-demo
```

### 2.1 Vue2 项⽬

组件中使⽤ data 属性

```JS
<script>
export default {
data: () => ({
count: 1,
}),
};
</script>
```

对项⽬进⾏打包，体积如下图

![](https://f.pz.al/pzal/2024/06/10/8886fdf777002.png)

为组件设置其他属性（ compted 、 watch ）

```JS
export default {
  data: () => ({
    question: '',
    count: 1,
  }),
  computed: {
    double: function () {
      return this.count * 2
    },
  },
  watch: {
    question: function (newQuestion, oldQuestion) {
      this.answer = 'xxxx'
    },
  },
}
```

再⼀次打包，发现打包出来的体积并没有变化

![](https://f.pz.al/pzal/2024/06/10/835d2448184bd.png)

### 2.2 Vue3 项⽬

组件中简单使⽤

```JS
import { reactive, defineComponent } from 'vue'
export default defineComponent({
  setup() {
    const state = reactive({
      count: 1,
    })
    return {
      state,
    }
  },
})
```

将项⽬进⾏打包

![](https://f.pz.al/pzal/2024/06/10/0c4bc215ea82f.png)

在组件中引⼊ computed 和 watch

```JS
import { reactive, defineComponent, computed, watch } from 'vue'
export default defineComponent({
  setup() {
    const state = reactive({
      count: 1,
    })
    const double = computed(() => {
      return state.count * 2
    })
    watch(
      () => state.count,
      (count, preCount) => {
        console.log(count)
        console.log(preCount)
      }
    )
    return {
      state,
      double,
    }
  },
})
```

再次对项⽬进⾏打包，可以看到在引⼊ computer 和 watch 之后，项⽬整体体积变⼤了

![](https://f.pz.al/pzal/2024/06/10/ef2d762834fbb.png)


## 3 作⽤

通过 Tree shaking ， Vue3 给我们带来的好处是：
- 减少程序体积（更⼩）
- 减少程序执⾏时间（更快）
- 便于将来对程序架构进⾏优化（更友好）