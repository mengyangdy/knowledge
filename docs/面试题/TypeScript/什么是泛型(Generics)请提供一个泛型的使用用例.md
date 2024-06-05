---
title: 什么是泛型(Generics)请提供一个泛型的使用用例?
tags:
  - ts
  - 面试题
date: 2024-05-29
---
# 一 什么是泛型(Generics)?请提供一个泛型的使用用例?

TypeScript中的泛型（Generics）是一种允许你在定义函数、接口或类的时候使用类型参数的技术。这意味着你可以创建可重用的组件，这些组件可以与多种数据类型一起工作，同时保持类型安全。泛型使得代码更加灵活，可以在不牺牲编译时类型检查的情况下处理不确定的类型。

## 1.1 泛型的基本概念

当你定义一个泛型函数或类时，你实际上是在定义一个模板，这个模板可以在使用时用具体的类型来填充。泛型通常使用大写字母表示，如`T`、`U`、`V`等作为类型占位符。

## 1.2 泛型使用用例

一个经典的泛型使用用例是创建一个能够处理多种类型数据的身份（Identity）函数。这个函数接受一个参数并原封不动地返回它，通过使用泛型，我们可以确保传入和返回的类型是一致的，增加类型安全性。

## 1.3 示例代码


```js
function identity<T>(arg: T): T {
    return arg;
}

// 使用泛型函数
let outputNumber = identity<number>(5); // outputNumber 类型为 number
let outputString = identity<string>("hello"); // outputString 类型为 string

// 实际上，TypeScript的类型推断功能允许我们在调用时不明确指定类型参数
let inferredNumber = identity(5); // TypeScript推断出number类型
let inferredString = identity("world"); // TypeScript推断出string类型
```

在这个例子中，`identity`函数就是一个泛型函数，`T`是一个类型参数。当我们调用这个函数时，可以显式地指定`T`的类型，如`identity<number>`，或者让TypeScript根据传入的参数自动推断类型。这样，无论我们传递什么类型的参数给这个函数，返回值都会保持与参数相同的类型，从而增加了代码的灵活性和类型安全性。

