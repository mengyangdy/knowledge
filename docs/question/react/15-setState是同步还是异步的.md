# 15.setState是同步还是异步的？

在React18之前，在不同情况下可以表现为异步或者同步，在Promise的状态更新、JS原生事件，setTimeout，setInterval中是同步的

在React的合成事件中是异步的

在React18以后，setState都会表现为异步(批处理)

**解释**：

如果是由React引起的事件处理(比如说onClick)调用setState不会同步更新this.state，除此之外的setState调用会同步执行this.state，所谓除此之外呢指的是绕过React通过addEventListener直接添加的事件处理函数，还有通过setTimeout产生的异步调用

**原因**：

在setState函数实现中，会根据一个变量isBatchingUodates判断是直接更新还是放到队列中回头再说，而这个值默认是false，也就是说会同步的更新this.state，但是，由一个函数batchedUpdates，这个函数会把isBatchingUpdates修改为true，当React在调用事件处理函数之前就会调用这个batchedUpdates，造成的后果就是React控制的事件处理函数不会同步更新

**注意**：

setState的异步并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的异步，可以通过第二个参数setState(partialState,callback)中的cb拿到更新后的值



综上所述：setState只是在合成事件和hook中是异步的，在原生事件和setTimeout中都是同步的



