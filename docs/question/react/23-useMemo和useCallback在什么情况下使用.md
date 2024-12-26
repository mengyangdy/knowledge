# 23.useMemo和useCallback在什么情况下使用？

useMemo和useCallback是React的内置Hook，通常作为优化性能的手段被使用，他们可以用来缓存函数、组件、变量，避免两次渲染间的重复计算，但是在实际使用中，他们经常被过度使用：担心性能的开发着给每个组件、函数、变量、计算都套上了memo，以至于他们在代码里好像失控了一样，无处不在

为什么要使用useMemo和useCallback

1. 防止不必要的effect
2. 防止不必要的render
3. 防止不必要的重复计算



## 1. 防止不必要的effect

如果一个值被useEffect依赖，那么它可能需要被缓存，这样可以避免重复执行effect

```js
const Component=()=>{
  const a=useMemo(()=>({test:1}),[])
  useEffect(()=>{
    dsSomething
  },[a])
}
```

当变量直接或者通过依赖链成为了useEffect的依赖项时，那它可能需要被缓存，这是useMemo和useCallback的最基本的用法



## 2. 防止不必要的render

正确的阻止render需要我们明确三个问题：

1. 组件什么时候回render
2. 如何防止子组件render
3. 如何判断子组件需要缓存

三种情况：

当本身的props或者state改变时

Contextvalue改变时，使用该值的组件会render

当父组件重新渲染时，它所有的子组件都会render，形成一条render链



如何防止子组件render?

只有当子组件被React.memo包裹并且所有参数被useMemo缓存才能防止子组件render

为了防止子组件的render，需要一下成本：

1. 开发着工作量的增加：一旦使用了缓存，就必须保证组件本身以及所有的props缓存，后续添加的props都要缓存
2. 代码复杂度和可读性的变化，代码照中出现了大量缓存函数，这会增加代码复杂度，并降低易读性
3. 性能成本：组件的缓存是在初始化时进行的，虽然每个组件缓存的性能耗费很低，通常不足1ms，但是大型程序中的组件初始化缓存，成本还是很高的



## 3. 如何判断是否需要缓存呢？

1. 人肉判断，开发者在研发过程中感知渲染性能问题，并进行判断
2. 通过工具进行判断
   1. React dev tools profiler
   2. useRenderTimes
   3. 16.5版本提出的Profiler API



## 4. 两者的区别

useMemo主要用于缓存计算结果，适用于任何需要缓存值的场景

useCallback主要用于缓存回调函数，适用于需要传递给子组件的事件处理函数，以避免不需要的重新渲染

