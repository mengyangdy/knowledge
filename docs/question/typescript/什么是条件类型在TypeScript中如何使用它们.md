---
title: 什么是条件类型(Conditional Types)?在TypeScript中如何使用它们?
tags:
  - ts
  - 面试题
date: 2024-05-29
---
# 一 什么是条件类型(Conditional Types)?在TypeScript中如何使用它们?

> 条件类型（Conditional Types）是TypeScript中一种高级类型系统特性，它允许你根据类型的关系来定义和选择其他类型。条件类型的表现形式类似于JavaScript中的三元条件表达式（`condition ? exprIfTrue : exprIfFalse`），但在TypeScript中，它们用来在类型层面做出决策，而不是在值层面。

## 1.1 基本语法

条件类型的基本形式如下：

```js
SomeType extends OtherType ? TrueType : FalseType;
```

这里：

- `SomeType` 是要检查的类型。
- `OtherType` 是比较的类型或类型谓词。
- `TrueType` 是当 `SomeType` 能够赋值给 `OtherType`（即 `SomeType` 扩展自 `OtherType`）时，返回的类型。
- `FalseType` 是当上述条件不满足时，返回的类型。

## 1.2 如何使用条件类型

条件类型通常与泛型一起使用，以实现更复杂的类型逻辑。下面是一些基本的使用场景：

## 1.3 简单示例

定义一个类型别名，检查一个类型是否为 `number`：

```js
type IsNumber<T> = T extends number ? "Yes, it's a number" : "No, it's not a number";

let result1: IsNumber<string>; // "No, it's not a number"
let result2: IsNumber<number>; // "Yes, it's a number"
```

## 1.4 泛型与条件类型

结合泛型使用，以实现更灵活的类型处理：

```js
type NonNullable<T> = T extends null | undefined ? never : T;

function nonNullableValue<T>(value: T): NonNullable<T> {
    return value as NonNullable<T>;
}

let nullableString: string | null = null;
let nonNullable = nonNullableValue(nullableString); // nonNullable 的类型是 string（排除了 null）
```

在这个例子中，`NonNullable<T>` 类型别名确保了返回的值不会是 `null` 或 `undefined`。

## 1.5 使用映射类型

条件类型也可以用于映射类型，遍历一个类型并根据每个成员类型产生新的类型映射：

```js
type KeysAsStrings<T> = {
    [K in keyof T]: string;
};

interface Person {
    name: string;
    age: number;
}

type PersonKeysAsStrings = KeysAsStrings<Person>;
// PersonKeysAsStrings 等价于 { name: string; age: string; }
```

这里，`KeysAsStrings<T>` 使用了映射类型和条件类型来创建一个新的类型，其中原始接口 `Person` 的每个键都被映射到 `string` 类型。

条件类型在处理复杂类型逻辑、创建类型安全的实用工具、以及增强现有类型系统功能方面非常强大。它们是构建高级类型系统抽象的关键部分，尤其是在库开发和大规模应用中。