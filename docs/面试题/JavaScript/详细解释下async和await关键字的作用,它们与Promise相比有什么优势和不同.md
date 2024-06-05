---
title: 详细解释下async和await关键字的作用,它们与Promise相比有什么优势和不同?
tags:
  - js
  - 面试题
date: 2024-05-29
---
# 一详细解释下async和await关键字的作用,它们与Promise相比有什么优势和不同?

>  `async` 和 `await` 是JavaScript中用于简化异步编程的两个关键字，它们是基于Promise API之上的更高层次的抽象，旨在让异步代码的编写和阅读更接近于同步代码风格。

## 1.1  `async` 关键字的作用

- **声明异步函数**：当你在函数声明前加上`async`关键字，这个函数就会变成一个异步函数。这意味着该函数总是返回一个Promise，即使没有显式使用`return`语句也是如此。如果没有返回值，则默认返回一个Resolved的Promise；如果有返回值，则该值会被封装进一个Resolved的Promise中。如果函数内部抛出错误，则返回一个Rejected的Promise。

## 1.2  `await` 关键字的作用

- **等待Promise的结果**：在`async`函数内部，你可以使用`await`关键字来等待一个Promise的结果。当遇到`await`时，函数会暂停执行，直到等待的Promise完成（resolve或reject）。如果Promise resolve，则`await`后的表达式会得到Promise的resolve值；如果Promise reject，那么会抛出一个错误，可以被`try...catch`捕获。

## 1.3 与Promise相比的优势和不同

**优势**:

1. **代码可读性和简洁性**：`async/await`使得异步代码的结构更接近于同步代码，消除了`.then()`和`.catch()`链，提高了代码的可读性和可维护性。
    
2. **更自然的错误处理**：通过结合`try...catch`块，可以像处理同步代码中的错误一样处理异步操作中的错误，而不需要在每个Promise链中单独添加`.catch()`。
    
3. **更少的回调地狱**：避免了多层嵌套的Promise，使得控制流更加平坦和易于理解。
    

**不同点**:

1. **语法糖**：`async/await`本质上是对Promise的语法糖，它们不是替代品，而是提供了更友好的接口。所有`async/await`能做到的事情，都可以用Promise来实现，只是代码可能会更复杂。
    
2. **执行上下文**：`await`只能在`async`函数内部使用，而Promise可以独立于任何特定的函数结构存在。
    
3. **控制流**：使用`await`时，代码会自然地按照顺序执行，每个`await`后面的代码会在前一个Promise解决后执行，这可能导致某种程度上的阻塞效果（虽然只限于当前`async`函数内部，不会阻塞整个事件循环）。而Promise链中的`.then()`和`.catch()`则更加灵活，可以在任何时候添加到链上，实现更复杂的控制流逻辑。
    

总的来说，`async/await`提供了更现代、更易读的异步编程方式，尤其适合处理那些原本会用到多个Promise链的场景，极大地改善了开发者的编码体验。