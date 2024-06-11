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

通过 in 关键字做类型的映射，遍历已有接⼝的 key 或者是遍历联合类型，如下例⼦：

```JS
type Readonly<T> = {
readonly [P in keyof T]: T[P];
};
interface Obj {
a: string
b: string
}
type ReadOnlyObj = Readonly<Obj>
```

上述的结构，可以分成这些步骤：
- keyof T：通过类型索引 keyof 的得到联合类型 'a' | 'b'
- P in keyof T 等同于 p in 'a' | 'b'，相当于执⾏了⼀次 forEach 的逻辑，遍历 'a' | 'b'

所以最终 ReadOnlyObj 的接⼝为下述：

```JS
interface ReadOnlyObj {
readonly a: string;
readonly b: string;
}
```

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

## 1.7 类型索引

keyof 类似于 Object.keys ，⽤于获取⼀个接⼝中 Key 的联合类型

```JS
interface Button {
 type: string
 text: string
}
type ButtonKeys = keyof Button
// 等效于
type ButtonKeys = "type" | "text"
```

## 1.8 类型约束

通过关键字 extend 进⾏约束，不同于在 class 后使⽤ extends 的继承作⽤，泛型内使⽤的主要作⽤是对泛型加以约束

```JS
type BaseType = string | number | boolean
// 这⾥表⽰ copy 的参数
// 只能是字符串、数字、布尔这⼏种基础类型
function copy<T extends BaseType>(arg: T): T {
return arg
}
```

类型约束通常和类型索引⼀起使⽤，例如我们有⼀个⽅法专⻔⽤来获取对象的值，但是这个对象并不确定，我们就可以使⽤ extends 和 keyof 进⾏约束。

```JS
function getValue<T, K extends keyof T>(obj: T, key: K) {
 return obj[key]
}
const obj = { a: 1 }
const a = getValue(obj, 'a')
```

## 1.9 条件类型

条件类型的语法规则和三元表达式⼀致，经常⽤于⼀些类型不确定的情况

```JS
 T extends U ? X : Y
```

这些高级类型为TypeScript带来了强大的类型系统，使开发者能够编写更健壮、可维护和易于理解的代码。

