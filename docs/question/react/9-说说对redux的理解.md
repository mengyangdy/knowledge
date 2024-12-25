# 8.说说对redux的理解

## 1. 是什么

在整个应用中会存在很多个组件， 每个组件的state都是由自身进行管理，包括组件定义自身的state、组件之间的通信通过props传递，使用context实现数据共享

如果让每个组件都存储自身相关的状态，理论上来讲不会影响应用的运行，但在开发和维护阶段，我们将花费大量的精力去查询状态的变化过程

这种情况下，如果将所有的状态进行集中管理，当需要更新状态的时候，仅需要对这个管理集中处理，而不用去关系状态是如何分发到每一个组件内部的

redux就是一个实现上述集中管理状态的容器，它遵循三大基本原则：

- 单一数据源
- state是只读的
- 使用纯函数来执行修改

## 2. 工作原理

redux要求我们把数据都放在store公共存储空间

一个组件改变了store里的数据内容，其他组件就能感知到store的变化，再来取数据，从而间接的视线了这些数据传递的功能

![image-20241225152652261](http://cdn.mengyang.online/202412251526302.png)

根据流程图可以这样看：

- 组件是借书的用户
- action是借书时说的话(要借什么书)
- store是图书管理员
- reducer是记录本(借什么书，还什么书，书在哪，查询一下)
- state是书籍信息

整个流程：用户需要借书，需要一句话描述一下借什么书，图书管理员需要查一下记录本，了解图书的位置，最后图书管理员会把这本书给到这个借书人

整个流程：组件需要一些状态，就告知store需要获取数据，store就去reducer查询一下，然后reducer就会告知store返回什么state

## 3. 如何使用

创建一个store的公共数据区域

```js
import {createStore} from 'redux'
const store=createStore()// 创建数据的公共存储区域(管理员)
```

创建一个记录本去辅助管理数据，也就是reducer，本质就是一个函数，接收两个参数state，action，返回state

```js
const initialState={
  counter:0
}
const reducer=(state=initialState,action)=>{
  
}
```

然后将记录本传递给store，两者建立连接

```js
const store=createStore(reducer)
```

如果想要获取store里面的数据通过store.getState获取

然后通过dispatch派发action数据，通常action中都会有type属性，也可以携带其他数据

```js
store.dispatch({
  type:"INCREMENT",
  counter:1
})
```

然后在reducer中进行处理

```js
const reducer=(state=initialState,action)=>{
  switch(action.type){
    case "INCREMENT"
      return {...state.counter:state.counter+1}
  default:
  return state
}
}
```

小结：

createStore可以帮助创建store

store.dispatch帮助派发action，action会传递给store

store.getState这个方法可以帮助我们获取store里面的所有内容

store.subscrible方法订阅store的改变，只要store发生改变，store.subscrible这个函数接收的这个回调函数就会被执行

