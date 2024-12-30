# 17.简述下React的生命周期

![image-20241225210451191](http://cdn.mengyang.online/202412252104228.png)

## 1. 挂载

当组件实例被创建并插入DOM树中，其生命周期调用顺序如下

- constructor
- static getDerivedStateFromProps
- render
- componentDidMount



### 1.1 constructor

如果不初始化State或者不进行方法绑定，则不需要为React组件实现构造函数

在React组件挂载之前，会调用它的构造函数，在为子类实现构造函数时，应该在其他语句之前调用super(props)，否则this.props会出现未定义的bug

通常构造函数仅用于一下两种情况

- 为事件处理函数绑定实例
- 在constructor函数中不要调用setState方法，如果需要使用内部state，请直接在构造函数中为this.state赋值



### 1.2 getDerivedStateFromProps

会在调用render方法之前调用，并且在初始挂载及后续更新时都会被调用，它应该返回一个对象来更新state，如果返回null则不更新任何内容



### 1.3 render

render方法是class组件中唯一必须实现的方法，当render被调用时，他会检查props和state的变化并返回虚拟节点:

- react组件
- 数组或者fragments
- portal组件
- 字符串或者数值类型文本节点
- 布尔类型或者null

render函数应该为纯函数，也就是不修改state的情况下，每次调用都返回相同的结果，并且它不会直接与浏览器交互



### 1.4 componentDidMount

这个会在组件挂载后立即调用



## 2. 更新

当组件的props或者state发生变化时会触发更新

- static getDerivedStateFromProps
- shouldComponentUpdate
- render
- getSnapshotBeforeUpdate
- componentDidUpdate



### 2.1 shouldComponentUpdate

当props或者state发生变化后，页面在渲染函数执行之前会调用这个生命周期，默认情况下，这个方法会返回true，让React执行更新。

如果我们的组件不依赖于state或props的改变，你可以让shouldComponentUpdate返回false来避免不必要的渲染

这个方法仅仅作为性能优化方式而存在的，不要企图依靠此方法来阻止渲染，因为这可能会产生bug，应该使用PureComponent组件而不是使用这个生命周期。

React.PureComponent是另一个可以用来优化性能的方法。PureComponent通过props和state的浅层对比来实现shouldComponentUpdate，这可以避免在props或state没有改变的情况下进行不必要的渲染。



### 2.2 getSnapshotBeforeUpdate

它会在最近一次渲染之前调用，它使得组件能在发生改变之前从DOM中获取一些信息



### 2.3 componentDidUpdate

更新之后立即调用，当组件更新之后，可以再次对DOM进行操作





## 3. 卸载

当组件从DOM树中移除时会调用下面的方法

- componentWillUnmount



### 3.1 componentWillUnmount

会在组件卸载及销毁之前直接调用



## 4. 错误处理

渲染过程，生命周期或者子组件的构造函数中抛出错误时，会调用如下方法

- static getDerivedStateFromError
- componentDidCatch



### 4.1 getDerivedStateFromError

次生命周期会在后代组件抛出错误后调用，他将抛出的错误作为参数，并返回一个值以更新state



### 4.2 componentDidCatch

它在后代组件抛出错误后被调用

- error抛出的错误
- info-一些堆栈信息