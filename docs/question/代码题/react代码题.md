# React代码题

## 1. 下面代码执行打印什么

```js
import {useState} from 'react'

export default function App() {
  const [age, setAge] = useState(42)
  function increment(){
    setAge(age + 1 )
  }
  return (
    <>
      <h1>your age {age}</h1>
      <button onClick={()=>{
        increment()
        increment()
        increment()
      }}></button>
    </>
  )
}
```

**答案：**

点击+3的时候，可能更新为43

这是因为setAge(age+1)即时多次调用，也不会立即更新组件状态，而是会进行合并，最终只能触发一次重新渲染

如果要实现调用三次就增加3，可以将inrement改为函数式更新:

```js
function increment(){
  setAge(a=>a+1)
}
```

