---
title: 解释什么事单例模式以及如何在JavaScript中实现它
tags:
  - 场景题
  - 面试题
date: 2024-06-03
---
# 一解释什么事单例模式以及如何在JavaScript中实现它?

单例模式是一种设计模式，它保证一个类仅能创建一个实例，并提供一个全局访问点来获取这个实例。这种模式常用于那些需要控制资源访问、管理共享状态或创建全局服务的情景中，以确保不会因为多次实例化而导致资源浪费或状态不一致。

在JavaScript中实现单例模式有多种方式，这里给出两种常见的实现方法：

## 1.1 立即执行函数表达式 (IIFE) + 闭包

使用立即执行函数表达式可以创建一个私有作用域，通过闭包来保存单例实例，确保外部只能通过暴露的方法访问这个实例。

```js
var Singleton = (function () {
    var instance;

    function createInstance() {
        // 单例的实际构造逻辑
        var obj = new Object("I am the instance");
        return obj;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// 使用单例
var singleton1 = Singleton.getInstance();
var singleton2 = Singleton.getInstance();

console.log(singleton1 === singleton2); // 输出 true，证明是同一个实例
```

## 1.2 ES6 Class + 私有静态属性

在ES6及更高版本的JavaScript中，可以通过私有静态属性来实现单例模式。这种方法更符合现代JavaScript的编码风格。

```js
class Singleton {
    static instance = null;

    constructor(name) {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        this.name = name;
        Singleton.instance = this;
    }
}

// 使用单例
const singleton1 = new Singleton("Instance 1");
const singleton2 = new Singleton("Instance 2");

console.log(singleton1 === singleton2); // 输出 true，证明是同一个实例
```

在这两种实现中，关键点都是确保无论实例化多少次，返回的都是同一个对象实例。第一种方法通过闭包和惰性初始化实现，而第二种方法利用了ES6的静态属性来存储实例。