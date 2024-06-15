---
title: call和apply和bind的区别是什么
tags:
  - js
  - 面试题
date: 2024-06-11
---

# call和apply和bind的区别是什么

## 1 作⽤

call、apply、bind 作⽤是改变函数执⾏时的上下⽂，简⽽⾔之就是改变函数运⾏时的 this 指向

那么什么情况下需要改变 this 的指向呢？下⾯举个例⼦

```JS
 var name = "lucy";
 var obj = {
 name: "martin",
 say: function () {
 console.log(this.name);
 }
 };
 obj.say(); // martin，this 指向 obj 对象
 setTimeout(obj.say,0); // lucy，this 指向 window 对象
```

从上⾯可以看到，正常情况 say ⽅法输出 martin

但是我们把 say 放在 setTimeout ⽅法中，在定时器中是作为回调函数来执⾏的，因此回到主栈执⾏时是在全局执⾏上下⽂的环境中执⾏的，这时候 this 指向 window ，所以输出 lucy

我们实际需要的是 this 指向 obj 对象，这时候就需要该改变 this 指向了

```JS
setTimeout(obj.say.bind(obj),0); //martin，this指向obj对象
```

## 2 区别

下⾯再来看看 apply、call、bind 的使⽤

### 2.1 apply
apply 接受两个参数，第⼀个参数是 this 的指向，第⼆个参数是函数接受的参数，以数组的形式传⼊

改变 this 指向后原函数会⽴即执⾏，且此⽅法只是临时改变 this 指向⼀次

```JS
 function fn(...args){
 console.log(this,args);
 }
 let obj = {
 myname:"张三"
 }
 fn.apply(obj,[1,2]); // this会变成传⼊的obj，传⼊的参数必须是⼀个数组；
 fn(1,2) // this指向window
```

当第⼀个参数为 null 、 undefined 的时候，默认指向 window (在浏览器中)

```JS
 fn.apply(null,[1,2]); // this指向window
 fn.apply(undefined,[1,2]); // this指向window
```

### 2.2 call

call ⽅法的第⼀个参数也是 this 的指向，后⾯传⼊的是⼀个参数列表

跟 apply ⼀样，改变 this 指向后原函数会⽴即执⾏，且此⽅法只是临时改变 this 指向⼀次

```JS
 function fn(...args){
 console.log(this,args);
 }
 let obj = {
 myname:"张三"
 }
 fn.call(obj,1,2); // this会变成传⼊的obj，传⼊的参数必须是⼀个数组；
 fn(1,2) // this指向window
```

同样的，当第⼀个参数为 null 、 undefined 的时候，默认指向 window (在浏览器中)

```JS
 fn.call(null,[1,2]); // this指向window
 fn.call(undefined,[1,2]); // this指向window
```

### 2.3 bind

bind⽅法和call很相似，第⼀参数也是 this 的指向，后⾯传⼊的也是⼀个参数列表(但是这个参数列表可以分多次传⼊)

改变 this 指向后不会⽴即执⾏，⽽是返回⼀个永久改变 this 指向的函数

```JS
 function fn(...args){
 console.log(this,args);
 }
 let obj = {
 myname:"张三"
 }
 const bindFn = fn.bind(obj); // this 也会变成传⼊的obj ，bind不是⽴即执⾏需要执⾏⼀次
 bindFn(1,2) // this指向obj
 fn(1,2) // this指向window
```

### 2.4 ⼩结

从上⾯可以看到， apply 、 call 、 bind 三者的区别在于：
- 三者都可以改变函数的 this 对象指向
- 三者第⼀个参数都是 this 要指向的对象，如果如果没有这个参数或参数为 undefined 或 null ，则默认指向全局 window
- 三者都可以传参，但是 apply 是数组，⽽ call 是参数列表，且 apply 和 call 是⼀次性传⼊参数，⽽ bind 可以分为多次传⼊
- bind 是返回绑定this之后的函数， apply 、 call 则是⽴即执⾏

## 3 实现

实现 bind 的步骤，我们可以分解成为三部分：
- 修改 this 指向
- 动态传递参数

```JS
 // ⽅式⼀：只在bind中传递函数参数
 fn.bind(obj,1,2)()
 // ⽅式⼆：在bind中传递函数参数，也在返回函数中传递参数
 fn.bind(obj,1)(2)
```

- 兼容 new 关键字

整体实现代码如下：

```JS
 Function.prototype.myBind = function (context) {
 // 判断调⽤对象是否为函数
 if (typeof this !== "function") {
 throw new TypeError("Error");
 }
 // 获取参数
 const args = [...arguments].slice(1),
 fn = this;
 return function Fn() {
 // 根据调⽤⽅式，传⼊不同绑定值
 return fn.apply(this instanceof Fn ? new fn(...arguments) : context,
args.concat(...arguments));
 }
 }
```
