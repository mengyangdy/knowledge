# 11.redux的中间件的理解？

## 1. 是什么

中间件是介于应用系统和系统软件之间的一类软件，它使用系统软件提供的基础服务，衔接网络上应用系统的各个部分或不同的应用，能够达到资源共享、功能共享的目的

redux的整个工作流程，当action发出之后，reducer立即算出state，整个过程是一个同步的操作，如果需要支持异步的操作，或者支持错误处理、日志监控，这个过程就可以用上中间件

redux中的中间件就是放在dispatch过程，在分发action进行拦截处理

中间件的本质是一个函数，对store.dispatch方法进行了改造，在发出action和执行reducer这两步之间，添加了其他的功能

## 2. 常用的中间件

- Redux-thunk:用于异步操作
- redux-logger：用于日志记录

上述的中间件都需要通过applyMiddlewares进行注册，作用是将所有的中间件组成一个数组，依次执行，然后作为第二个参数传入到createStore中

```js
const store=createStore(
	reducer,
  applyMiddleware(thunk,logger)
)
```

