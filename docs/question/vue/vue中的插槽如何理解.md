# Vue中的插槽如何理解

## 1. 插槽设计目的是什么

插槽的设计主要是为了`实现组件内容的可重用和内容分发`，这是一种让父组件可以向子组件中动态插入内容的功能

我们可以将任意内容放在组件的标签中，然后在组件的模板中使用 `<slot>` 标签来决定这些内容的位置。当一个组件渲染的时候， `<slot>` 将会被替换为它之间的内容。

Vue插槽解决了以下问题：

1. **内容分发**：插槽可以让开发者在使用一个组件的时候，向组件内部动态传入任意的 DOM 结构。
2. **作用域插槽**：通过作用域插槽，父组件可以获取到子组件内部的数据，达到更复杂的定制和控制

## 2. 使用方式

首先声明一个插槽 然后传入一个具体的内容替代声明的插槽

## 3. 本质：插槽的本质就是函数

都是js函数 动态创建的虚拟dom 然后生成dom



## 4. 如何理解默认插槽具名插槽作用域插槽

- 默认插槽: 一个名为default的函数
- 命名插槽: 一个名为插槽名的函数
- 作用域插槽: 一个带参数的函数

```vue
<div>
   	<slot/>
    <slot name="body"/>
    <slot :index="1" username="张三"/>
</div>

<template>
    <div>
        <Card>
            <!-- 会被编译为一个默认的无参函数const title = ()=>{}, 传递给Card组件-->
            <template>
                <h3>这是标题</h3>
            </template>
            <!-- 会被编译为一个名为body的无参函数const body = ()=>{}, 传递给Card组件-->
            <template #body>
                <div>这是段落</div>
            </template>
            <!-- 会被编译为一个名为default的带参函数const default = (args)=>{}, 
            传递给Card组件-->
            <template v-slot="{ index, username }">
                <div>{{ index }}-{{ username }}</div>
            </template>
        </Card>
    </div>
</template>
```



