---
title: Node中的全局对象有那些举例说明它们的作用?
tags:
  - node
  - 面试题
date: 2024-06-03
---
# 一 Node.js中的全局对象有那些?举例说明它们的作用?

Node.js中的全局对象是一个特殊的对象，它在整个应用程序中都可以访问，并且包含了大量有用的属性和方法，用于辅助开发。Node.js的主要全局对象是`global`。以下是一些在Node.js全局对象中常用的关键属性和它们的作用：

1. **global**: 这个就是Node.js的全局对象本身，相当于浏览器环境中的`window`对象。它是所有全局变量和函数的容器。
    
2. **process**: 提供了关于当前Node.js进程的信息和控制。例如，`process.exit()`可以用来终止进程，`process.env`访问环境变量，`process.cwd()`获取当前工作目录等。
    
3. **Buffer**: 用于处理二进制数据。在Node.js中，Buffer对象用于在TCP流、文件系统操作等场景中处理原始数据。
    
4. **console**: 提供了打印到标准输出（stdout）和标准错误（stderr）的方法，如`console.log()`、`console.error()`等，用于调试和日志记录。
    
5. **setTimeout**, **clearTimeout**: 用于在指定的时间后执行函数，类似于浏览器环境中的同名函数，用于定时操作。
    
6. **setInterval**, **clearInterval**: 设置周期性执行的函数，以及清除定时器，常用于定时更新或轮询操作。
    
7. **require**: 动态加载模块。允许在运行时加载和使用其他模块的功能，是Node.js模块系统的核心。
    
8. **__dirname**: 当前文件所在的目录路径，不包含文件名，常用于构建文件路径。
    
9. **__filename**: 当前文件的完整路径和文件名，可用于动态加载相邻模块或文件。
    
10. **exports**, **module**: 实现模块系统的导出和引入机制。`module.exports`用于导出模块的公共接口，而`require()`用于导入其他模块的导出。
    

示例说明：

- **使用process对象获取环境变量和退出程序**:

```js
console.log('Node.js Version:', process.version);
console.log('Current Working Directory:', process.cwd());
process.exit(0); // 优雅地退出程序，0表示正常退出
```
    
- **使用setTimeout进行延时操作**:

```js
    setTimeout(() => {
      console.log('This message will be shown after 2 seconds.');
    }, 2000);
```

- **Buffer操作**:

```js
const buf = Buffer.from('Hello, Node.js');
console.log(buf.toString()); // 输出: Hello, Node.js
```
    
- **模块导入和导出**:

```js
    // myModule.js
    exports.myFunction = function() {
      console.log('This is a function from another module.');
    };
    
    // main.js
    const myModule = require('./myModule');
    myModule.myFunction(); // 输出: This is a function from another module.
```
    

这些全局对象和属性为Node.js应用提供了丰富的功能，帮助开发者处理各种任务，从基本的日志记录到复杂的异步I/O操作。