# 22.如何让useEffect支持async和await

## 1. 为什么

如果我们在使用useEffect的时候在回调函数中使用了`async...await...`的时候会报错，这是因为effect函数应该返回一个销毁函数(return 返回的cleanup函数)，如果第一个参数传入了async，返回值就变成了Promise，会导致React在调用销毁函数的时候报错

## 2. 为什么要这样做

useEffect作为hooks中很重要的一个hooks，可以让你在函数组件中执行副作用操作，它能够完成生命周期的职责，它返回的函数的执行时机如下：

- 首次渲染不会进行清理，会在下一次渲染，清除上一次的副作用
- 卸载阶段也会执行清除操作

不管是那个阶段，我们都不希望这个返回值是异步的，这样我们无法预知代码的执行情况，很容易出现难以定位的bug

## 3. 怎么支持

方法一:创建一个异步函数，然后执行这个函数

```js
useEffect(()=>{
  const asyncFn=async()=>{
    setPage(await mockCheck())
  }
  asyncFn()
},[])
```

方法二：也可以使用IIFE：

```js
useEffect(()=>{
  (async ()=>{
    setPage(await mockCheck()
  })()
})
```

