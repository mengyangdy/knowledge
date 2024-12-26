# 35.React的router怎么理解？

前端路由的原理大致相同，可以实现无刷新的条件下切换显示不同的页面，路由的本质就是页面的url发生变化时，页面的显示结果可以根据url的变化而变化，但是页面不会刷新

React-router主要分为几个不同的包：

- react-router实现了路由的核心功能
- react-router-dom：基于react-router，加入了在浏览器环境下的一些功能
- react-router-native：基于react-router，加入了react-native运行环境下的一些功能



react-router-dom的常用API有：

- BrowserRouter、HashRouter
- Route
- Link、NavLink
- switch
- redirect



## 1. browserRouter、HashRouter

router中包含了对路径改变的监听，并且会将相应的路径传递给子组件

browserRouter是history模式，hashRouter是hash模式

使用两者作为最顶层的组件包裹其他组件

```js
import { BrowserRouter } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <main>
        <nav>
          <ul>
            <li>
              <a href="/home">home</a>
            </li>
            <li>
              <a href="/about">about</a>
            </li>
            <li>
              <a href="/contact">contact</a>
            </li>
          </ul>
        </nav>
      </main>
    </BrowserRouter>
  )
}

export default App;
```



## 2. Route

route用于路径的匹配，然后进行渲染组件，对应的属性如下：

- path属性：用于设置匹配到的路径
- component属性：设置匹配到的路径后，渲染的组件
- render属性：设置匹配到路径后，渲染的内容
- exact属性：开启精准匹配，只有精准匹配到完全一致的路径，才会渲染对应的组件

```js
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <main>
        <nav>
          <ul>
            <li>
              <a href="/">home</a>
            </li>
            <li>
              <a href="/about">about</a>
            </li>
            <li>
              <a href="/contact">contact</a>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

function Home(){
  return (
    <div>
      <h1>welcome</h1>
    </div>
  )
}

export default App;
```

## 3. Link、NavLink

通常路径的跳转使用的是Link组件，最终会被渲染成a元素，其中属性to替代了href属性

NavLink是在Link组件基础之上增加了一些样式属性，例如组件被选中时，发生样式变化

- activeStyle：活跃时的样式
- activeClassName：活跃时添加的class

```js
<NavLink to="/" exact activeStyle={{color:'red'}}>首页</NavLink>
```

通过route组委顶层组件包裹其他组件后，页面组件就可以接受到一些路由相关的东西，比如props.history对象，这个对象上有一些方便的方法，如goBack、goFroward、push等方法



## 4. redirect

用于路由的重定向，当这个组件出现时，就会执行跳转对应的to路径中



## 5. switch

switch组件的作用是当匹配到第一个组件的时候，后面的组件就不继续匹配了



初次之外react-router还提供了一些hooks方法：

- useHistory
- useParams
- useLocation



## 6. useHistory

useHistory可以让组件内部直接访问history，无须通过props获取

```js
const history=useHistory()
history.push('/')
```

## 7. useParams

```js
const {name}=useParams()
```

## 8. useLocation

useLocation会返回当前url的location对象

```js
const {pathname}=useLocation()
```



路由参数传递主要分为了三种形式：

- 动态路由的方式
- search传递参数
- to传入对象



## 9. 动态路由

```js
<Route path="/detail/:id" component={Detail} />
```

## 10. search传递参数

```js
<NavLink to="/detail?name=why">
```



## 11. to传入对象

```js
<NavLink to={{
             pathname:'/detail',
             query:{
             name:'why',
             age:30
            },
  state:{
    height:18
  },
    search:'?key=123'
}}>
```

