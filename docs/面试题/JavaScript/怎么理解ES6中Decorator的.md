---
title: 怎么理解ES6中Decorator的?
tags:
  - js
  - 面试题
date: 2024-06-10
---

# 一 怎么理解ES6中Decorator的?

## 1.1 介绍

Decorator，即装饰器，从名字上很容易让我们联想到装饰者模式

简单来讲，装饰者模式就是⼀种在不改变原类和使⽤继承的情况下，动态地扩展对象功能的设计理论。

ES6 中 Decorator 功能亦如此，其本质也不是什么⾼⼤上的结构，就是⼀个普通的函数，⽤于扩展类属性和类⽅法

这⾥定义⼀个⼠兵，这时候他什么装备都没有

```JS
class soldier{
}
```

定义⼀个得到 AK 装备的函数，即装饰器

```JS
function strong(target){
target.AK = true
}
```
使⽤该装饰器对⼠兵进⾏增强

```JS
@strong
class soldier{
}
```

这时候⼠兵就有武器了

```JS
soldier.AK // true
```

上述代码虽然简单，但也能够清晰看到了使⽤ Decorator 两⼤优点：
- 代码可读性变强了，装饰器命名相当于⼀个注释
- 在不改变原有代码情况下，对原来功能进⾏扩展

## 1.2 ⽤法

Docorator 修饰对象为下⾯两种：
- 类的装饰
- 类属性的装饰

### 1.2.1 类的装饰

当对类本⾝进⾏装饰的时候，能够接受⼀个参数，即类本⾝

将装饰器⾏为进⾏分解，⼤家能够有个更深⼊的了解

```JS
@decorator
class A {}
// 等同于
class A {}
A = decorator(A) || A;
```

下⾯ @testable 就是⼀个装饰器， target 就是传⼊的类，即 MyTestableClass ，实现了为类添加静态属性

```JS
@testable
class MyTestableClass {
// ...
}
function testable(target) {
target.isTestable = true;
}
MyTestableClass.isTestable // true
```

如果想要传递参数，可以在装饰器外层再封装⼀层函数

```JS
function testable(isTestable) {
return function(target) {
target.isTestable = isTestable;
}
}
@testable(true)
class MyTestableClass {}
MyTestableClass.isTestable // true
@testable(false)
class MyClass {}
MyClass.isTestable // false
```

### 1.2.2 类属性的装饰

当对类属性进⾏装饰的时候，能够接受三个参数：
- 类的原型对象
- 需要装饰的属性名
- 装饰属性名的描述对象

⾸先定义⼀个 readonly 装饰器

```JS
function readonly(target, name, descriptor){
descriptor.writable = false; // 将可写属性设为false
return descriptor;
}
```

使⽤ readonly 装饰类的 name ⽅法

```JS
class Person {
@readonly
name() { return
${this.first} ${this.last}
}
}
```

相当于以下调⽤

```JS
readonly(Person.prototype, 'name', descriptor);
```

如果⼀个⽅法有多个装饰器，就像洋葱⼀样，先从外到内进⼊，再由内到外执⾏

```JS
function dec(id){
console.log('evaluated', id);
return (target, property, descriptor) =>console.log('executed', id);
}
class Example {
@dec(1)
@dec(2)
method(){}
}
// evaluated 1
// evaluated 2
// executed 2
// executed 1
```

外层装饰器 @dec(1) 先进⼊，但是内层装饰器 @dec(2) 先执⾏

### 1.2.3 注意

装饰器不能⽤于修饰函数，因为函数存在变量声明情况

```JS
var counter = 0;
var add = function () {
counter++;
};
@add
function foo() {
}
```

编译阶段，变成下⾯

```JS
var counter;
var add;
@add
function foo() {
}
counter = 0;
add = function () {
counter++;
};
```

意图是执⾏后 counter 等于 1，但是实际上结果是 counter 等于 0

## 1.3 使⽤场景
基于 Decorator 强⼤的作⽤，我们能够完成各种场景的需求，下⾯简单列举⼏种：

使⽤ react-redux 的时候，如果写成下⾯这种形式，既不雅观也很⿇烦

```JS
class MyReactComponent extends React.Component {}
export default connect(mapStateToProps, mapDispatchToProps)(MyReactComponent);
```

通过装饰器就变得简洁多了

```JS
@connect(mapStateToProps, mapDispatchToProps)
export default class MyReactComponent extends React.Component {}
```

将 mixins ，也可以写成装饰器，让使⽤更为简洁了

```JS
function mixins(...list) {
return function (target) {
Object.assign(target.prototype, ...list);
};
}
// 使⽤
const Foo = {
foo() { console.log('foo') }
};
@mixins(Foo)
class MyClass {}
let obj = new MyClass();
obj.foo() // "foo"
```
