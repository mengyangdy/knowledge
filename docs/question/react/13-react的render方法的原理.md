# 13.react中render方法的原理？

## 1. 原理

在类组件中，指的是render方法：

```js
class Demo extends React.component{
  render(){
    return <h1>Demo</h1>
  }
}
```

在函数组件中，指的是函数组件本身：

```js
function Demo(){
  return <h1>Demo</h1>
}
```

在render中，我们会编写jsx，jsx通过Babel编译后就转化成我们熟悉的JS格式：

```js
return (
    <div className="cn">
      <Header>hello</Header>
      <div>
        start
      </div>
      right reserve
    </div>
  )
```

Babel编译后：

```js
return (
React.createElement(
'div',
  {
    classname:'cn'
  },
  React.createElement(
  	Header,
    nullm,
    'hello'
  ),
  React.createElement(
  	'div',
    null,
    'start'
  ),
  'right reserve'
)
)
```

从名字上来看，createElement方法是用来创建元素的：

在react中，这个元素就是虚拟DOM节点，接受三个参数：

- type：标签
- attributes：标签的属性，若无则为null
- children：标签的子节点

这些虚拟DOM树最终会渲染成真实DOM

在render过程中，React将新调用render函数返回的树与旧版本的树进行比较，这一步是决定如何更新DOM的必要步骤，然后进行diff比较，更新DOM树



## 2. 触发时机

render执行实际主要分为了两部分：

- 类组件调用setState修改状态
- 函数组件通过useState hook修改状态



## 3. 总结

render函数里面可以编写jsx，转化为createElement这种形式，用于生成虚拟DOM，最终转化为真实DOM

在React中，类组件主要执行了setState方法，就一定会触发render函数执行，函数组件使用useState更改状态不一定导致重新render

组件的props改变了，不一定触发render函数的执行，但是如果props的值来自于父组件或者组件组件的state的话，父组件的state发生了变化，就会导致子组件的重新渲染

所以，一旦执行了setState就会执行render方法，useState会判断当前值有无发生改变确认是否执行render方法，一旦父组件发生渲染，子组件也会渲染

