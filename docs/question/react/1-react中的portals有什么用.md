# 1.React中的Portals有什么用？

React中的portals是React提供的一种机制，用于将子组件渲染到父组件DOM层次结构之外的位置，他在处理一些特殊情况下的UI布局会非常的有用：

1. 在模态框使用，在需要应用的根DOM结构之外显示模态框时，portals可以帮助我们将模态框的内容渲染到根DOM之外的地方不影响布局
2. 处理z-index问题，在一些复杂的布局中，可能存在z-index层级关系导致组件无法按照预期的方式叠加显示
3. 在全局位置显示组件
4. 在动画中使用：当在需要在页面中的某个位置执行动画时，可以帮助我们就将动画的内容渲染到离该位置更近的DOM结构中，以提高动画性能

```js
import ReactDOM from "react-dom";

function MyPortalComponent() {
  return ReactDOM.createPortal(
    <div>
      this is rendered using a portal
      </div>,
    document.getElementById('app')
  )
}
export default MyPortalComponent;

import MyPortalComponent from '../components/MyPortalCmponent.tsx'

const App = () => {
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <MyPortalComponent />
    </div>
  );
};

export default App;
```

在上面的代码中，MyProtalComponent中的内容会被渲染到id为app的DOM元素之外