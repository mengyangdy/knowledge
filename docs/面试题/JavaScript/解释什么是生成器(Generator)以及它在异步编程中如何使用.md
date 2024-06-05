---
title: 解释什么是生成器(Generator)以及它在异步编程中如何使用?
tags:
  - js
  - 面试题
date: 2024-05-29
---
# 一 解释什么是生成器(Generator)以及它在异步编程中如何使用?

生成器（Generator）是JavaScript中的一种特殊类型的函数，它允许函数在执行过程中暂停并在之后恢复执行。生成器通过使用`function*`关键字定义，并且可以使用`yield`关键字来暂停执行并返回一个值。生成器的主要用途之一是在迭代器接口之上构建复杂的迭代逻辑，但它们也在异步编程中找到了一席之地，尤其是在处理基于Promise的异步操作流时。

在异步编程中，生成器的使用通常与诸如`co`这样的库相结合，或者在引入了async/await语法之前作为一种解决回调地狱的方案。以下是生成器在异步编程中应用的基本概念：

## 1.1 如何使用生成器处理异步操作

1. **定义生成器函数**: 生成器函数使用`function*`声明，并在需要等待异步操作完成的地方使用`yield`

```js
1function* asyncTaskGenerator() {
2  const result1 = yield fetchData('api/data1');
3  console.log('Result 1:', result1);
4
5  const result2 = yield fetchAnotherData('api/data2');
6  console.log('Result 2:', result2);
7}
```

在这个例子中，`fetchData`和`fetchAnotherData`假定为返回Promise的异步函数，而实际上`yield`不能直接用于非迭代器对象，因此需要辅助工具来桥接Promise和生成器。

2. **使用库来运行生成器**: 由于JavaScript原生不支持直接用`yield`来等待Promise，所以需要一个外部库（如`co`）来包装生成器并处理Promise的解析。


```js
1const co = require('co');
2
3co(function* () {
4  try {
5    yield asyncTaskGenerator();
6  } catch (err) {
7    console.error('Caught an error:', err);
8  }
9}).catch(console.error);
```

`co`函数会遍历生成器产生的值（这里通常是Promises），自动处理Promise的解析和拒绝，并在遇到`yield`时暂停，等待Promise完成后再继续执行生成器。

## 1.2 为什么使用生成器进行异步编程

- **代码结构更清晰**: 生成器配合辅助库使得异步代码看起来更像同步代码，易于理解和维护。
- **更好的错误处理**: 可以使用try/catch块统一处理异步操作中的错误。
- **资源管理**: 生成器可以更精细地控制异步操作的执行顺序和资源分配。

尽管生成器在异步编程方面提供了很大的帮助，但随着async/await成为标准的一部分，它们在异步控制流中的使用已经减少，因为async/await提供了更直接、更简洁的语法来达到相同的目的。