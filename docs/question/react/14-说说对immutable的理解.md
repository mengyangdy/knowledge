# 14.说说对immutable的理解

immutable是不可改变的，在计算机中，即指一旦创建就不能再被更改的数据

对Immutable对象的任何修改或者添加删除操作都会返回一个新的immutable对象

immutable实现的原理是persistent data structure(持久化数据结构)

- 用一种数据结构来保存数据
- 当数据被修改时，会返回一个对象，但是新的对象会尽可能的利用之前的数据结构而不会对内存造成浪费

也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变，同时为了避免deepclone把所有节点都复制一遍带来的性能损耗，immutable使用structural sharing(结构共享)，如果对象树中的一个节点发生变化，指修改这个节点和受它影响的父节点，其他节点进行共享

![image-20241225154844430](http://cdn.mengyang.online/202412251548476.png)

## 2. 如何使用

使用immutable对象最主要的库是immutable.js，它的出现弥补了JS没有不可变数据结构的问题

内部提供了collection、list、Map、set、record、seq等数据结构

- list有序索引集，类似于数据
- map无序索引集，类似于对象
- set没有重复值的集合

主要的方法如下：

- fromJS:将一个JS数据转换为immutable类型的数据
- toJS:将一个immutable转化为JS类型的数据
- is:对两个对象进行比较
- get(key)对数据或对象取值
- getIn([])对嵌套对象或数组取值，传参为数组，表示位置

## 3. 在React中的应用

主要是在redux中使用

```js
import {fromJS} from 'immutable'
const initialState=fromJs({
  a:1,
  b:2
})
const reducer=(state=initialState,action)=>{
  switch(action.type){
      case 'add'
      return state.set('a',2)
  }
}
```

