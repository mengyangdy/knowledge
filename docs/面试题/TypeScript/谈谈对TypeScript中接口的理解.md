---
title: 谈谈对TypeScript中接口的理解
tags:
  - ts
  - 面试题
date: 2024-06-11
---

# 一 谈谈对TypeScript中接口的理解

## 1.1 是什么
## 
接⼝是⼀系列抽象⽅法的声明，是⼀些⽅法特征的集合，这些⽅法都应该是抽象的，需要由具体的类去实现，然后第三⽅就可以通过这组抽象⽅法调⽤，让具体的类执⾏具体的⽅法

简单来讲，⼀个接⼝所描述的是⼀个对象相关的属性和⽅法，但并不提供具体创建此对象实例的⽅法

typescript 的核⼼功能之⼀就是对类型做检测，虽然这种检测⽅式是“鸭式辨型法”，⽽接⼝的作⽤就是为为这些类型命名和为你的代码或第三⽅代码定义⼀个约定

## 1.2 使⽤⽅式
## 
接⼝定义如下

```JS
interface interface_name {
}
```

例如有⼀个函数，这个函数接受⼀个 User 对象，然后返回这个 User 对象的 name 属性:

```JS
const getUserName = (user) => user.name
```

可以看到，参数需要有⼀个 user 的 name 属性，可以通过接⼝描述 user 参数的结构

```JS
interface User {
name: string
age: number
}
const getUserName = (user: User) => user.name
```

这些属性并不⼀定全部实现，上述传⼊的对象必须拥有 name 和 age 属性，否则 typescript 在编译阶段会报错，如下图：

如果不想要 age 属性的话，这时候可以采⽤可选属性，如下表⽰：

```JS
interface User {
name: string
age?: number
}
```

这时候 age 属性则可以是 number 类型或者 undefined 类型

有些时候，我们想要⼀个属性变成只读属性，在 typescript 只需要使⽤ readonly 声明，如下：

```JS
interface User {
name: string
age?: number
readonly isMale: boolean
}
```

当我们修改属性的时候，就会出现警告，如下所⽰：

![](https://f.pz.al/pzal/2024/06/11/64187cdffa8bf.png)

这是属性中有⼀个函数，可以如下表⽰：

```JS
interface User {
name: string
age?: number
readonly isMale: boolean
say: (words: string) => string
}
```

如果传递的对象不仅仅是上述的属性，这时候可以使⽤：
- 类型推断

```JS
interface User {
name: string
age: number
}
const getUserName = (user: User) => user.name
getUserName({color: 'yellow'} as User)
```

- 给接⼝添加字符串索引签名

```JS
interface User {
name: string
age: number
[propName: string]: any;
}
```

也可以继承多个，⽗类通过逗号隔开，如下：

```JS
interface Father {
color: String
}
interface Mother {
height: Number
}
interface Son extends Father,Mother{
name: string
age: Number
}
```

## 1.3 应⽤场景

例如在 javascript 中定义⼀个函数，⽤来获取⽤⼾的姓名和年龄：

```JS
const getUserInfo = function(user) {
// ...
return name:${user.name}, age: ${user.age}
}
```

如果多⼈开发的都需要⽤到这个函数的时候，如果没有注释，则可能出现各种运⾏时的错误，这时候就可以使⽤接⼝定义参数变量：

```JS
// 先定义⼀个接⼝
interface IUser {
name: string;
age: number;
}
const getUserInfo = (user: IUser): string => {
return name: ${user.name}, age: ${user.age};
};
 // 正确的调⽤
getUserInfo({name: "koala", age: 18});
```
