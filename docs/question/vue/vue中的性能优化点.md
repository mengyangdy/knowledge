# Vue中的性能优化点

1. 使用Composition API
   1. 提供了更加灵活的代码组织方式，可以更好地复用逻辑，减少不必要的重复代码，提高开发效率和维护性能
2. 细化数据响应式方法
   1. reactive
   2. ref
   3. shallowReactive
   4. readonly
3. 使用computed计算属性，缓存结果，减少函数执行次数
4. 避免过度渲染
   1. 列表中加入key
   2. v-if和v-show使用
5. 异步组件和懒加载
   1. 使用defineAsyncComponent加载组件，使组件变成异步组件
   2. 结合vue-router的动态导入，实现路由级别的懒加载
6. 代码分割
   1. 利用webpack等工具将代码分割成更小的包
7. kepp-alive
8. 减少事件监听，使用事件代理