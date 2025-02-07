# defer和async属性在script标签中分别有什么作用?

浏览器在解析HTML的过程中，遇到了script元素是不能继续构建DOM树的

- 它会停⽌继续构建，⾸先下载JavaScript代码，并且执⾏JavaScript的脚本
- 只有等到JavaScript脚本执⾏结束后，才会继续解析HTML，构建DOM树

为什么要这样做呢？

- 这是因为JavaScript的作⽤之⼀就是操作DOM，并且可以修改DOM
- 如果我们等到DOM树构建完成并且渲染再执⾏JavaScript，会造成严重的回流和重绘，影响⻚⾯的性能
- 所以会在遇到script元素时，优先下载和执⾏JavaScript代码，再继续构建DOM树

但是这个也往往会带来新的问题，特别是现代⻚⾯开发中：

- 在⽬前的开发模式中（⽐如Vue、React），脚本往往⽐HTML⻚⾯更“重”，处理时间需要更⻓
- 所以会造成⻚⾯的解析阻塞，在脚本下载、执⾏完成之前，⽤户在界⾯上什么都看不到

为了解决这个问题，script元素给我们提供了两个属性（attribute）：defer和async。

> 
>
> 在HTML中的`<script>`标签，`defer`和`async`这两个属性用于控制脚本的加载和执行方式，以优化页面的渲染速度和脚本的执行顺序。

## 1.1 defer 属性

- **异步加载，但顺序执行**：使用`defer`属性的脚本会在文档解析过程中异步加载，这意味着它们不会阻塞页面的解析，从而允许浏览器继续处理HTML和渲染页面。这有助于加快页面的初步渲染。
- **执行时机**：所有带有`defer`属性的脚本会在HTML文档解析完成后，DOMContentLoaded事件触发之前，按照它们在文档中的顺序逐个执行。这样可以确保脚本之间的依赖关系得到维护。
- **适用场景**：适用于那些不需要立即执行，但在文档解析完成之前执行的脚本，特别是当脚本之间存在依赖关系时。

## 1.2 async 属性

- **完全异步**：`async`属性使得脚本的加载和执行完全独立于页面的解析，包括其他脚本的加载和执行。这意味着脚本加载时不会阻塞页面渲染，而且一旦脚本加载完毕就会立即执行，无论文档解析是否完成。
- **不保证执行顺序**：使用`async`的脚本不保证按照在HTML中出现的顺序执行。每个脚本独立加载并尽快执行，因此如果有多个`async`脚本，它们的执行顺序不确定。
- **适用场景**：适用于那些不需要依赖页面其他元素或者相互之间没有依赖关系的外部脚本，如分析脚本或某些第三方库，这些脚本可以在任何时候加载和执行，不影响页面的初始渲染。

总结来说，`defer`适合那些需要维持执行顺序的脚本，而`async`则更适合那些独立执行、无需考虑执行顺序的脚本。两者都能有效减少脚本对页面渲染速度的影响，但具体选择取决于脚本的执行需求。