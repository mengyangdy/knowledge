---
title: TypeScript如何与现有的JavaScript库一起使用?
tags:
  - ts
  - 面试题
date: 2024-05-29
---
# 一 TypeScript如何与现有的JavaScript库一起使用?

## 1.1 **类型定义文件（`.d.ts`）**

为了在 TypeScript 项目中获得 JavaScript 库的类型信息，可以使用类型定义文件（`.d.ts`）。这些文件不包含任何实现代码，只提供类型信息，帮助 TypeScript 编译器理解库的结构和类型。

- **DefinitelyTyped**: 社区维护的DefinitelyTyped仓库（[https://github.com/DefinitelyTyped/DefinitelyTyped）](https://github.com/DefinitelyTyped/DefinitelyTyped%EF%BC%89%E5%8C%85%E5%90%AB%E4%BA%86%E5%A4%A7%E9%87%8FJavaScript%E5%BA%93%E7%9A%84%E7%B1%BB%E5%9E%8B%E5%AE%9A%E4%B9%89%E6%96%87%E4%BB%B6%E3%80%82%E4%BD%A0%E5%8F%AF%E4%BB%A5%E9%80%9A%E8%BF%87npm%E5%AE%89%E8%A3%85%E5%AF%B9%E5%BA%94%E7%9A%84%60@types%60%E5%8C%85%E6%9D%A5%E8%8E%B7%E5%8F%96%E8%BF%99%E4%BA%9B%E5%AE%9A%E4%B9%89%EF%BC%8C%E4%BE%8B%E5%A6%82%EF%BC%9A%60npm),包含了大量的 JavaScript 库的类型定义文件,可以通过安装对应类型的包来获取定义
- **手动创建或下载**: 对于没有官方或DefinitelyTyped提供的类型定义的库，你可以自己创建一个`.d.ts`文件来定义类型，或者查找第三方提供的类型定义。

## 1.2 **类型声明**

在代码中，你可以使用`declare`关键字来声明一个全局变量或模块的类型，以便 TypeScript 能够识别它们。例如，如果你的JavaScript库通过全局变量暴露API，可以在一个`.d.ts`文件或项目的全局声明文件（如`globals.d.ts`）中声明它。

```js
// 假设有一个全局变量 MyLib
declare var MyLib: any;
```

## 1.3 **直接使用未定义类型的JavaScript库**

如果没有类型定义，TypeScript 会把未标注类型的JavaScript代码当作`any`类型处理。这意味着你可以直接使用库，但会失去类型检查的好处。

## 1.4 **JSDoc**

即使没有`.d.ts`文件，你也可以在JavaScript代码中使用JSDoc注释来提供类型信息，TypeScript 编译器会尝试读取这些注释来进行类型推断。这在你想为现有JavaScript代码添加类型信息但不想或不能创建独立的`.d.ts`文件时特别有用。

```js
/**
 * @param {string} name 用户名
 */
function greet(name) {
    console.log(`Hello, ${name}`);
}
```

### 5. **使用`// @ts-check`或`// @ts-nocheck`**

在JavaScript文件顶部添加`// @ts-check`指令可以让TypeScript编译器检查该文件中的类型错误。相反，`// @ts-nocheck`可以禁用类型检查。

# 二 声明文件(.d.ts)的作用

> TypeScript 与现有的 JavaScript 库一起使用，主要是通过 `.d.ts` 文件来提供类型定义，以确保类型安全和代码补全等功能。`.d.ts` 文件是TypeScript项目中用于声明类型信息的特殊文件，它们不包含实际的实现代码，仅用于描述JavaScript代码的类型结构。以下是 `.d.ts` 文件在这一过程中的具体作用：
## 2.1 **类型声明**

`.d.ts`文件为原本没有类型信息的JavaScript库提供类型声明。这些声明帮助TypeScript编译器理解库中函数、类、接口等的预期类型，从而在编译阶段提供静态类型检查，减少运行时的类型错误。

## 2.2 **智能提示和代码补全**

在IDE（如Visual Studio Code）中编写代码时，`.d.ts`文件能够让编辑器提供准确的代码补全建议。这大大提升了开发者的编码效率，尤其是在使用大型或复杂的库时。

## 2.3 **提升代码可读性和维护性**

通过详细的类型注解，`.d.ts`文件使得库的API更加清晰，便于开发者理解其使用方式和预期行为，这对于团队协作和长期项目维护尤为重要。

## 2.4 **集成第三方库**

对于许多流行的JavaScript库，社区维护了一个集中存放类型定义的存储库DefinitelyTyped，其中包含了大量的`.d.ts`文件。通过安装对应的`@types/*`包（如`@types/lodash`），就可以在TypeScript项目中直接使用这些库，并享有完整的类型支持。

## 2.5 使用方法

- **安装类型定义**：使用npm或yarn安装对应的`@types`包，例如`npm install @types/jquery`。
- **手动引用**：如果类型定义不在DefinitelyTyped中，或者你有自定义的类型定义，可以直接在项目中包含`.d.ts`文件，或者在tsconfig.json中指定类型声明文件的路径。
- **自动发现**：TypeScript编译器会自动查找项目中的`.d.ts`文件，以及node_modules目录下的`@types`，无须额外配置即可使用已安装的类型定义。

通过这种方式，TypeScript不仅能够与现有的JavaScript生态系统无缝集成，还能够提供现代静态类型语言的优点，提升开发体验和代码质量。


