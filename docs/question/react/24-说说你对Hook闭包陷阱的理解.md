# 24.说说你对Hook闭包陷阱的理解

在开发中我们会遇到一下的场景：

```js
import { useEffect, useState } from "react";

export default function App(){
  const [state, setState] = useState(1)
  useEffect(() => {
    setInterval(()=>{
      console.log(state);
    })
  }, []);

  return (
    <button onClick={()=>setState(state+1)}>点击</button>
  )
}
```

其实useEffect的场景和我们for循环使用let定义变量的逻辑是一样的，它是React组件更新流程以及useEffect的视线自然而然的结果

原因是每次渲染APP组件都会创建一个函数执行上下文，其中的打印语句还是指向的第一次打印的上下文state一直都是1

为什么useRef不同呢，可以拿到最新的值，因为useRef返回的都是同一个对象，每次组件更新所生成的ref指向的都是同一片内存空间