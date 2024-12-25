# 说说你对useContext的理解

context可以看成是扩大版的props，它可以将全局的数据通过provider接口传递value值给局部的组件，让包围在provider中的局部组件可以获取到全局数据的读写接口

用法：

- 创建context
- 设置prpvider并通过value接口传递state
- 局部组件获取读写接口

```js
//App
import { createContext, useState } from "react";
import Father from "../components/Father";

export const ThemeContext = createContext(null);

export default function App ()  {
  const [state, setState] = useState({
    m:100,
    n:50
  })
  return (
    <ThemeContext.Provider value={{state,setState}}>
      <Father />
    </ThemeContext.Provider>
  );
};
//Father
import Child from './Child'
const Father = () => {
  return (
    <div>
      father
      <Child />
    </div>
  )
}

export default Father
// child
import {ThemeContext} from "../src/App";
import { useContext } from "react";

const Child = ()=>{
  const {state,setState}=useContext(ThemeContext)
  console.log(state,'state');
  function addM(){
    setState((state)=>{
      return {
        ...state,
        m:state.m+1
      }
    })
  }
  function addN(){
    setState((state)=>{
      return {
        ...state,
        n:state.n+1
      }
    })
  }
  return (
    <div>
      child
      <div>m:{state.m}</div>
      <div>n:{state.n}</div>
      <button onClick={addM}>设置m</button>
      <button onClick={addN}>设置n</button>
    </div>
  )
}

export default Child ;
```

总结：

1. 通过createContext创建一个上下文
2. 设置provider并通过value接口传递state数据
3. 局部组件从value接口中传递的数据对象中获取数据