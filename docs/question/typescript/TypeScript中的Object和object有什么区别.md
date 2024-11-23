---
title: TypeScript中的Object和object有什么区别
tags:
  - ts
  - 面试题
date: 2024-06-16
---

# TypeScript中的Object和object有什么区别

在TypeScript中，Object和object有着不同的含义和用途：

## 1. Object:

Object通常指的是JavaScript中的全局对象Object，它是一个构造函数，可以用来创建新的对象实例，如var obj = new Object();。这个构造函数也是所有对象的基础，所有对象都隐式地继承自Object.prototype。

在TypeScript中，Object也是一个类型，它可以表示任何非原始值类型（即除了number、string、boolean、null、undefined、symbol之外的所有类型）。由于它过于宽泛，允许原始类型和对象类型，因此在类型检查时可能不够严格，不推荐直接作为类型标注来使用，除非你确实需要接受任何类型的对象。

## 2. object:

从TypeScript 2.2版本开始，引入了名为object的类型（注意是小写），这是一个实际的类型关键字，用来表示除原始类型以外的所有类型，即只包括对象类型（包括数组、函数等引用类型），不包括number、string、boolean、symbol、null或undefined这样的原始类型。

object类型提供了一种更精确的方式来表示非原始值类型，相比Object类型更为严格，使得类型系统能够更好地区分和约束变量的使用。

总结来说，Object是一个构造函数和一个较为宽泛的类型，而object是一个特定的类型关键字，用来精确表示非原始类型的对象。在编写代码时，选择使用object作为类型注解可以带来更严格的类型检查和更清晰的类型意图表达。