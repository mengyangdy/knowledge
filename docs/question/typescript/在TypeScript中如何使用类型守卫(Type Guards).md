---
title: 在TypeScript中如何使用类型守卫(Type Guards)?
tags:
  - ts
  - 面试题
date: 2024-05-29
---
# 一在TypeScript中如何使用类型守卫(Type Guards)?

> 在TypeScript中，类型守卫（Type Guards）是一种在运行时检查变量类型并在编译时影响类型系统的机制。它们帮助编译器缩小变量可能的类型范围，从而允许更精确地访问类型特定的属性或方法。以下是几种常见的类型守卫方式：

## 1.1 `typeof` 类型守卫

用于检查基本类型的变量，如 `string`、`number`、`boolean`、`bigint`、`symbol`、`undefined` 或 `object`（不包括 `null`）。

```js
function printLength(value: string | number): void {
    if (typeof value === 'string') {
        // 在这个代码块内，TypeScript知道value是string类型
        console.log(value.length);
    } else {
        // 在这里，value被推断为number类型
        console.log(value.toFixed(2));
    }
}
```

## 1.2  `instanceof` 类型守卫

用于检查一个对象是否属于某个构造函数的实例。

```js
class Animal {}
class Dog extends Animal {
    bark() {
        console.log('Woof!');
    }
}

function makeSound(animal: Animal) {
    if (animal instanceof Dog) {
        // 在这里，animal被推断为Dog类型
        animal.bark();
    } else {
        console.log('The animal makes a sound.');
    }
}
```

## 1.3  `in` 操作符类型守卫

用于检查对象是否有特定的属性。

```js
interface Bird {
    fly: () => void;
}

interface Fish {
    swim: () => void;
}

function move(animal: Bird | Fish) {
    if ('fly' in animal) {
        // animal被推断为Bird类型
        animal.fly();
    } else {
        // animal被推断为Fish类型
        animal.swim();
    }
}
```

## 1.4 自定义类型守卫函数

通过返回一个布尔值的函数来判断变量的类型。

```js
function isFish(animal: any): animal is Fish {
    return 'swim' in animal;
}

function moveWithCustomGuard(animal: Bird | Fish) {
    if (isFish(animal)) {
        // animal被推断为Fish类型
        animal.swim();
    } else {
        // animal被推断为Bird类型
        animal.fly();
    }
}
```

通过这些类型守卫，TypeScript能够在编译时提供更强的类型检查，帮助开发者避免类型错误，同时保持代码的灵活性和可读性。

