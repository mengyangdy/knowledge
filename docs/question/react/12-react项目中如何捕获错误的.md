# 12.React项目中如何捕获错误的？

React16中引入了错误边界的概念，它是一种React的组件，这种组件可以捕获发生在其子组件树任何位置的JS错误，并且打印这些错误，然后展示降级的UI

错误边界在渲染期间，生命周期方法和整个组件树的构造函数中捕获错误，形成错误边界的两个条件：

- 使用了static getDerivedStateFromError()
- 使用了componentDIsCatch()

```js
class ErrorBoundary extends React.Component{
  constructor(props){
    super(props)
    this.state={
      hasErrpr:false
    }
  }
  static getDerivedStateFromError(error){
    // 更新state 使下一次渲染能够显示降级后的UI
    return {hasError:true}
  }
  componentDIdCatch(error,errorInfo){
    // 将错误日志上报给服务器
  }
  render(){
    if(this.state.hasError){
      return <h1>something went wrong</h1>
    }
  }
  return this.props.children
}
```

下面这些情况无法捕获到错误：

- 事件处理
  - 使用try-catch
- 异步代码
  - Promise.catch
- 服务端错误
  - 
- 自身抛出来的错误
  - Window监听error事件