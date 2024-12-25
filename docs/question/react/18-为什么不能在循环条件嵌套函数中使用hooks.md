# 18.为什么不能在循环条件嵌套函数中调用hooks

如果在条件语句中使用hooks，React会抛出Error，因为React用链表严格保证hooks的顺序

在源码中：mountState用来构建链表并渲染的，updateState依次遍历链表并渲染，hooks的渲染是通过依次遍历来带定位每个hooks内容的，如果前后两次读取的链表在顺序上出现差异，那么渲染结果是不可控的

这个有点像我们一个长度固定的数组，数组中的每一位都对应着一个明确的信息，后续就可以通过索引来定位数据

必须按照顺序调用从根本上来说是因为useState这个钩子在设计层面上并没有状况命名的动作，也就是说你每生成一个新的状态，React并不知道这个状态就什么，所以需要通过顺序来索引到对应的状态值

```js
let mounted=false
  if(!mounted){
    const [name,setName]=useState('leo')
    const [age,setAge]=useState(18)
    mounted=true
  }
  const [career,setCareer]=useState('码农')
  console.log('career',career);


  return (
    <div onClick={()=>setName('lily')}>
      点我点我
    </div>
  )
```

我们期望输出的是码农，事实上输出的是lily，原因是：

三个useState初始化已经构建了一个三节点的链表结构：

`name('leo')-->age(18)-->career('码农')`

每个节点都已经派发了一个与之对应的update操作，因此在执行setName的时候，三个节点就已经修改为了`name('lily')-->age(18)-->career('码农')`

然后执行update渲染操作，从链表中一次取出值，此时，条件语句不在执行，打印的取值从链表的第一个取也就是name的值此时为lily