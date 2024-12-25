# 10.在项目中如何使用redux的？

redux是用于数据状态管理，而React是一个视图层面的库，如果将两者连接在一起，可以使用官方的react-redux库，具有高效且灵活的特性

react-redux将组件分成：

- 容器组件：存在逻辑处理
- UI组件：只负责显示盒交互，内部不处理逻辑，状态由外部控制

**使用：**通过redux将整个应用状态存储到store，组件可以派发dispatch行为action给store，其他组件通过订阅store中的状态state来更新自身的视图

**如何做：**

使用react-redux分为两大核心：

- provider
- connection

在redux中存在一个store用于存储state，如果将这个store存放在顶层元素中，其他组件都会被包裹在顶层元素之上，那么所有的组件都能够受到redux的控制，都能够获取redux中的数据

```js
<Provider store={store}>
	<App/>  
</Provider>
```

connect方法将store上的geState和dispatch包装成组件的props：

```js
class Foo extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
    	<div>this.props.foo</div>
    )
  }
}
Foo=connect()(Foo)
export default Foo
```

![image-20241225151154796](http://cdn.mengyang.online/202412251511839.png)

## 项目结构是如何划分的？

一种是按照角色划分的，一种是按照文件目录划分的

![image-20241225151316764](http://cdn.mengyang.online/202412251513816.png)

![image-20241225151327735](http://cdn.mengyang.online/202412251513776.png)