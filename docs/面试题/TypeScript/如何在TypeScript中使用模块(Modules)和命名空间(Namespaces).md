---
title: 如何在TypeScript中使用模块(Modules)和命名空间(Namespaces)?
tags:
  - ts
  - 面试题
date: 2024-05-29
---
# 一 如何在TypeScript中使用模块(Modules)和命名空间(Namespaces)?

> 在TypeScript中，模块（Modules）和命名空间（Namespaces）都是用来组织和管理代码的重要机制，尽管它们的目的和使用方式有所不同。

## 1.1 模块 (Modules)

模块用于将相关代码组织成独立的单元，有助于实现代码的复用和封装。ES6引入了原生的模块系统，TypeScript完全支持这一标准。

**定义模块**：

- 使用 `export` 关键字导出模块对外提供的接口（变量、函数、类、接口等）。
- 使用 `import` 关键字导入其他模块的导出项。

示例：

```js
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import { add } from './math';
console.log(add(1, 2));
```

## 1.2 命名空间 (Namespaces)

命名空间是一种将代码逻辑分组到不同的作用域下的方式，帮助避免全局变量的冲突。它们在编译时会被转换为对象，因此实际上不改变JavaScript的运行时行为。

**定义命名空间**：

- 使用 `namespace` 关键字定义命名空间。
- 命名空间可以在多个文件中定义，并通过编译器选项（如 `--outFile`）合并。

示例：

```js
// shapes.ts
namespace Shapes {
  export class Circle {
    constructor(public radius: number) {}
    getArea() {
      return Math.PI * this.radius ** 2;
    }
  }
}

// main.ts
import './shapes';
namespace Shapes {
  export class Square {
    constructor(public side: number) {}
    getArea() {
      return this.side ** 2;
    }
  }
}

console.log(new Shapes.Circle(5).getArea());
console.log(new Shapes.Square(10).getArea());
```

注意：虽然上面的示例展示了导入命名空间文件，但实际上命名空间不需要像模块那样显式导入。这是因为命名空间会在全局作用域下创建一个对象，其成员可通过该对象访问。但在实际开发中，推荐使用模块而非命名空间，因为模块提供了更好的封装和依赖管理。

## 1.3 比较与选择

- **模块**提供了更好的代码隔离和模块化支持，更适合现代前端项目和大型应用。
- **命名空间**在某些场景下可以帮助减少全局命名冲突，但在TypeScript社区中，随着ES模块的普及，命名空间的使用正在逐渐减少。

总的来说，如果你的项目需要支持ES模块并且追求更现代的代码结构，优先考虑使用模块。而如果是在遗留项目或需要兼容旧的JavaScript环境时，命名空间可能仍然是一个可行的选择。