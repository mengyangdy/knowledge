---
title: 解释下TypeScript中的映射类型(Mapped Types)并提供一个示例
tags:
  - ts
  - 面试题
date: 2024-05-29
---
# 一解释下TypeScript中的映射类型(Mapped Types)并提供一个示例

TypeScript中的映射类型（Mapped Types）是一种高级类型功能，它允许你根据已有类型定义创建新的类型，通过对原类型中的每个属性应用某种变换规则来生成一个新的类型结构。映射类型基于索引签名的语法，并使用泛型来实现这一目的，具体来说，就是使用 `in` 关键字来遍历类型中的所有键，并对每个键应用变换规则。

## 1.1 基本语法

映射类型的通用语法看起来像这样：

```js
type MappedType<T> = {
  [P in keyof T]?: /* 或其他类型操作 */ T[P] /* 原类型属性的值 */;
};
```

这里的 `T` 是你要映射的原始类型，`keyof T` 表示 `T` 类型的所有键的联合类型，`P` 是一个代表当前遍历到的键的类型变量。`[P in keyof T]` 部分遍历了 `T` 的所有键，而 `T[P]` 则访问了原始类型上对应键的类型。

## 1.2 示例：将所有属性转为可选

假设我们有一个用户类型 `User`，并且我们想要创建一个新的类型 `PartialUser`，其中所有属性都是可选的。这可以通过使用 `Partial` 映射类型来实现，它是 TypeScript 内置的工具类型之一，但我们可以手动展示如何定义这样的映射类型：

```js
type User = {
  name: string;
  age: number;
  email: string;
};

// 使用映射类型将 User 类型的所有属性转为可选
type PartialUser = {
  [P in keyof User]?: User[P];
};

// 现在 PartialUser 类型的实例可以缺少任何属性
const user: PartialUser = {
  name: "Alice",
  // age 和 email 可以省略
};
```

## 1.3 其他映射类型示例

- **将所有属性转为只读**

```js
type ReadonlyUser = {
  readonly [P in keyof User]: User[P];
};
```

- **将所有字符串类型的属性转为 `number` 类型**

```js
type NumberifiedUser = {
  [P in keyof User]: User[P] extends string ? number : User[P];
};
```

映射类型是非常强大的，可以用于创建复杂的类型转换逻辑，提高代码的类型安全性和可维护性。

