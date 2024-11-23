# Vue组件之间通信的方式有哪些?

## 一 组件通信的分类

- 父子组件之间的通信
- 兄弟组件之间的通信
- 祖孙与后代组件之间的通信
- 非关系组件之间的通信

## 二 组件间通信的方案

1. 通过 props 传递
2. 通过$emits 触发自定义事件
3. 使用 ref
4. 使用 parent 和 root 与$children
5. attrs 与 listeners
6. provide 与 inject
7. eventButs
8. store

## 三 props

- 适用场景:父组件传递数据给子组件
- 子组件设置 props 属性,定义接受父组件传递过来的参数
- 父组件在使用子组件元素中通过字面量来传递值

## 四 emits 自定义事件

- 适用场景:子组件传递数据给父组件
- 子组件通过 emits 触发自定义事件,emits 第二个参数为传递的值
- 父组件绑定监听函数来获取到子组件传递过来的参数

## 五 ref 与 defineExpose

- 父组件在使用子组件的时候设置 ref
- 父组件通过设置子组件 ref 来获取数据

## 六 parent/root/children

> 注意:vue 2 专用

- 获取到一个父节点/子节点/根节点的 VueComponent 对象,同样包含父节点中所有的数据和方法

## 七 attrs 与 listeners

> vue 3 中已经没有 listeners

- 适用场景:祖先传递数据给子孙
- 设置批量向下传属性 `$attrs` 与 `$listeners`
- attrs:包含父作用域里除了 class 和 style 除外的非 props 属性集合,通过 this.attrs 获取父作用域中所有的符合条件的属性集合,然后还要继续传给子组件内部的其他组件,就可以通过 `v-bind="$attrs"`
- listeners:包含父作用域里 `.native` 除外的所有监听事件集合,如果还要继续传给子组件内部的其他组件,就可以通过 `v-on="$listeners"`

## 八 provide 与 inject

- provide/inject 为依赖注入,说是不推荐直接用于应用程序代码中,但是在一些插件或组件库里却是被常用
- provide:可以让我们指定想要提供给后代组件的数据或方法
- inject:在任何后代组件中接收想要添加在这个组件上的数据或方法,不管组件嵌套多深都可以直接拿来用
- 要注意的是 provide 和 inject 传递的数据不是响应式的,也就是说用 inject 接受来数据后,provide 里的数据改变了,后代组件中的数据不会改变,除非传入的就是一个可监听的对象

## 九 eventButs

- eventButs 是中央事件总线,不管是父子组件/兄弟组件,跨层级组件都可以使用它完成通信操作

## 十 store

- 使用状态管理器,集中式存储管理所有组件的状态
