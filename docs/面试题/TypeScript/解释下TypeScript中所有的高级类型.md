---
title: 解释下TypeScript中所有的高级类型?
tags:
  - ts
  - 面试题
date: 2024-05-29
---
# 一 解释下TypeScript中所有的高级类型,如联合类型/交叉类型/索引类型等

> TypeScript中的高级类型是其类型系统的一部分，它们提供了额外的灵活性和能力，使得开发者能够更精确地描述和操作类型。以下是一些关键的高级类型及其解释：

## 1.1 联合类型 (Union Types)

联合类型用 `|` 符号表示，允许一个值为多种类型之一。这意味着变量、参数或返回值可以是多个类型中的任何一个。例如：

```js
let myVar: string | number;
myVar = "hello"; // 合法
myVar = 42;      // 也合法
```

联合类型的一个重要用途是在函数重载和类型保护中，确保在不同条件下使用正确的类型。

## 1.2 交叉类型 (Intersection Types)

交叉类型使用 `&` 符号，表示一个类型需要同时满足多个类型的要求，即新类型包含了所有这些类型的成员。例如：

```js
interface Person {
  name: string;
}
interface Serializable {
  serialize(): string;
}

type PersonWithSerialization = Person & Serializable;
```

这里 `PersonWithSerialization` 类型的实例需要有 `name` 属性和 `serialize` 方法。

## 1.3 索引类型 (Indexed Access Types)

索引类型允许你使用一个类型作为索引来访问另一个类型的属性或元素。这对于处理具有字符串或数字索引签名的对象特别有用。例如：

```js
interface StringArray {
  [index: number]: string;
}

function getElement(arr: StringArray, index: number) {
  return arr[index]; // 类型为 string
}
```

索引类型还可以用于映射类型中，以动态地从一个类型中提取或创建新类型。

## 1.4 映射类型 (Mapped Types)

映射类型使用 `in` 和 `as` 关键字，可以基于现有类型创建新的类型，通过对原有类型的每个属性应用某种变换来生成新的类型结构。例如：

```js
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface Todo {
  title: string;
  description: string;
}

type ReadonlyTodo = Readonly<Todo>;
```

在这个例子中，`ReadonlyTodo` 类型的每个属性都被标记为只读。

## 1.5 字面量类型 (Literal Types)

字面量类型允许你指定变量的类型为具体的值，比如字符串、数字或布尔值的特定值。这可以增加类型检查的严格性：

```js
function logMessage(message: "info" | "warning" | "error") {
  console.log(`[${message}] This is a message.`);
}

logMessage("info"); // 合法
logMessage("debug"); // 错误
```

## 1.6 类型别名 (Type Aliases)

类型别名使用 `type` 关键字，提供了一个给复杂类型起名字的方式，使得类型定义可以复用和自我描述。它与接口相似，但更灵活，可以用来表示任何类型，包括联合类型、交叉类型等：

```js
type UserID = string;
type User = {
  id: UserID;
  name: string;
};
```

这些高级类型为TypeScript带来了强大的类型系统，使开发者能够编写更健壮、可维护和易于理解的代码。

