---
title: 解释什么是单例模式以及如何在JavaScript中实现它
tags:
  - 场景题
  - 面试题
date: 2024-06-03
---
# 一 解释什么是单例模式以及如何在JavaScript中实现它?

## 1.1 是什么

单例模式（Singleton Pattern）：创建型模式，提供了⼀种创建对象的最佳⽅式，这种模式涉及到⼀个单⼀的类，该类负责创建⾃⼰的对象，同时确保只有单个对象被创建

在应⽤程序运⾏期间，单例模式只会在全局作⽤域下创建⼀次实例对象，让所有需要调⽤的地⽅都共享这⼀单例对象，如下图所⽰：

![](https://f.pz.al/pzal/2024/06/13/7eea5bc192d96.png)

从定义上来看，全局变量好像就是单例模式，但是⼀般情况我们不认为全局变量是⼀个单例模式，原因是：
- 全局命名污染
- 不易维护，容易被重写覆盖

## 1.2实现

在 javascript 中，实现⼀个单例模式可以⽤⼀个变量来标志当前的类已经创建过对象，如果下次获取当前类的实例时，直接返回之前创建的对象即可，如下：

```JS
// 定义⼀个类
function Singleton(name) {
	this.name = name;
	this.instance = null;
}
// 原型扩展类的⼀个⽅法getName()
Singleton.prototype.getName = function() {
	console.log(this.name)
};
// 获取类的实例
Singleton.getInstance = function(name) {
	if (!this.instance) {
		this.instance = new Singleton(name);
	}
	return this.instance
};
// 获取对象1
const a = Singleton.getInstance('a');
// 获取对象2
const b = Singleton.getInstance('b');
// 进⾏⽐较
console.log(a === b);
```

### 1.2.1 立即执行函数表达式 (IIFE) + 闭包

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

### 1.2.2 ES6 Class + 私有静态属性

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

## 1.3 使用场景

在前端中，很多情况都是⽤到单例模式，例如⻚⾯存在⼀个模态框的时候，只有⽤⼾点击的时候才会创建，⽽不是加载完成之后再创建弹窗和隐藏，并且保证弹窗全局只有⼀个

可以先创建⼀个通常的获取对象的⽅法，如下

```JS
const getSingle = function(fn) {
	let result;
	return function() {
		return result || (result = fn.apply(this, arguments));
	}
};
```

创建弹窗的代码如下

```JS
const createLoginLayer = function() {
	var div = document.createElement('div');
	div.innerHTML = '我是浮窗';
	div.style.display = 'none';
	document.body.appendChild(div);
	return div;
};
const createSingleLoginLayer = getSingle(createLoginLayer);
document.getElementById('loginBtn').onclick = function() {
	var loginLayer = createSingleLoginLayer();
	loginLayer.style.display = 'block';
};
```

上述这种实现称为惰性单例，意图解决需要时才创建类实例对象

并且 Vuex 、 redux 全局态管理库也应⽤单例模式的思想，如下图：

![](https://f.pz.al/pzal/2024/06/13/d8de2e7428720.png)

现在很多第三⽅库都是单例模式，多次引⽤只会使⽤同⼀个对象，如 jquery、lodash、moment