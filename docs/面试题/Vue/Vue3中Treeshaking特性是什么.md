---
title: Vue3中Treeshaking特性是什么?
tags:
  - vue
  - 面试题
date: 2024-06-10
---

# 一 Vue3中Treeshaking特性是什么?

## 1.1 是什么

Tree shaking 是⼀种通过清除多余代码⽅式来优化项⽬打包体积的技术，专业术语叫 Dead code elimination

简单来讲，就是在保持代码运⾏结果不变的前提下，去除⽆⽤的代码

如果把代码打包⽐作制作蛋糕，传统的⽅式是把鸡蛋（带壳）全部丢进去搅拌，然后放⼊烤箱，最后把（没有⽤的）蛋壳全部挑选并剔除出去

⽽ treeshaking 则是⼀开始就把有⽤的蛋⽩蛋⻩（import）放⼊搅拌，最后直接作出蛋糕

也就是说 ， tree shaking 其实是找出使⽤的代码

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

## 1.2 如何做

Tree shaking 是基于 ES6 模板语法（ import 与 exports ），主要是借助 ES6 模块的静态编译思想，在编译时就能确定模块的依赖关系，以及输⼊和输出的变量

Tree shaking ⽆⾮就是做了两件事：
- 编译阶段利⽤ ES6 Module 判断哪些模块已经加载
- 判断那些模块和变量未被使⽤或者引⽤，进⽽删除对应代码

下⾯就来举个例⼦：

通过脚⼿架 vue-cli 安装 Vue2 与 Vue3 项⽬

```JS
vue create vue-demo
```

### 1.2.1 Vue2 项⽬

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

### 1.2.2 Vue3 项⽬

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


## 1.3 作⽤

通过 Tree shaking ， Vue3 给我们带来的好处是：
- 减少程序体积（更⼩）
- 减少程序执⾏时间（更快）
- 便于将来对程序架构进⾏优化（更友好）