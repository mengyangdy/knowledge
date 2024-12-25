# 20.说说你对useMemo的理解

## 1. 作用

在class的时代，我们一般都是通过pureComponent来对数据进行一次浅比较，在hooks中我们可以使用memo进行性能提升

```js
import { useState } from "react";

export default function App() {
  const [n,setN] = useState(0);
  const [m, setM] = useState(10);
  console.log('执行了最外层的盒子');
  return (
    <>
    app组件
      <Child1 value={m} />
      <Child2 value={n} />
      <button onClick={()=>setN(n+1)}>n+1</button>
      <button onClick={()=>setM(n+1)}>m+1</button>
    </>
  )
 }

 function Child1(props){
   console.log('执行了子组件1了');
  return (
    <div>
      子组件1上的m:{props.value}
    </div>
  )
 }
function Child2(props){
  console.log('执行了子组件2了');
  return (
    <div>
      子组件2上的n:{props.value}
    </div>
  )
}
```

上面的代码中分别设置了两个子组件读取app组件中的m和n，然后父组件上修改m和n的两个按钮，第一次渲染时控制台打印：

```js
执行了最外层的盒子
执行了子组件1了
执行了子组件2了
```

和想象中的执行是一样的，render时先进入了app函数，发现里面有两个child函数，执行，创建虚拟dom，创建真实dom,最后将画面渲染到页面上

## 2. 使用memo优化

当我们点击了m+1按钮时，此时state中的m必然+1，也会重新引发render渲染，并把更新后的m渲染到视图中

此时我们看一下打印：

```js
App.jsx:6 执行了最外层的盒子
App.jsx:19 执行了子组件1了
App.jsx:27 执行了子组件2了
hmr.js:142 [HMR] connected.
App.jsx:6 执行了最外层的盒子
App.jsx:19 执行了子组件1了
App.jsx:27 执行了子组件2了
```

我们会发现组件2也渲染了，未曾有改变的n数据的子组件2也重新执行了，但是明显n是没有变化的，组件2我们也不需要进行渲染，如何优化呢？

```js
 const Child1=React.memo((props)=>{
   console.log('执行了子组件1了');
  return (
    <div>
      子组件1上的m:{props.value}
    </div>
  )
 })
const Child2=React.memo((props)=>{
  console.log('执行了子组件2了');
  return (
    <div>
      子组件2上的n:{props.value}
    </div>
  )
})
```

再次点击看下打印：

```js
App.jsx:6  执行了最外层的盒子
App.jsx:19 执行了子组件1了
App.jsx:27 执行了子组件2了
hmr.js:142 [HMR] connected.
App.jsx:6 执行了最外层的盒子
App.jsx:19 执行了子组件1了
```

这样组件2就没有重新执行了，这样React就只会执行对应state变化的组件，而没有变化的组件，则复用上一次的函数

**出现bug**

上面的代码虽然已经优化好了性能，但是会有一个**bug**，上面的代码是由父组件控制button来改变的，如果将更改函数传递给子组件会怎样？

```js
<Child1 value={m} onClick={addM} />
<Child2 value={n} />
<button onClick={()=>setN(n+1)}>n+1</button>
{/*<button onClick={()=>setM(m+1)}>m+1</button>*/}
```

这个时候点击按钮n+1

```js
执行了最外层的盒子
App.jsx:22 执行了子组件1了
App.jsx:30 执行了子组件2了
hmr.js:142 [HMR] connected.
App.jsx:6 执行了最外层的盒子
App.jsx:22 执行了子组件1了
App.jsx:30 执行了子组件2了
```

又重新执行了子组件2了

这是为什么呢？因为APP重新执行了，它会修改addM函数的地址(函数是复杂数据类型)，而addM又作为props传递给了子组件2，那么就会引发子组件2函数的重新执行



### 3. useMemo

这时候就需要用到useMemo来解决问题`useMemo(()=>{},[])`,useMemo接收两个参数，分别是函数和一个数组(实际上是依赖)，函数里return函数，数组内存放依赖

```js
const addM=useMemo(()=>{
    return ()=>{
      setM(m+1)
    }
  },[m])
  // function addM(){
  //   setM(m + 1);
  // }
```

上面的代码很奇怪，还需要返回一个函数执行，所以React给我们准备了语法糖useCallback

```js
const addM=useCallback(()=>{
    setM(m+1)
  },[m])
  // const addM=useMemo(()=>{
  //   return ()=>{
  //     setM(m+1)
  //   }
  // },[m])
  // function addM(){
  //   setM(m + 1);
  // }
```

**总结**：

1. 使用memo可以帮助我们优化性能，让React没必要执行不必要的函数
2. 由于复杂数据类型的地址可能会改变，于是传递给子组件的props也会发生变化，这样还是会执行不必要的函数，所以就用到了useMemo这个api
3. useCallback是useMemo的一个语法糖

