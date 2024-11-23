---
title: 说说你对BOM的理解
tags:
  - js
  - 面试题
date: 2024-06-11
---

# 说说你对BOM的理解

## 1 是什么

BOM (Browser Object Model)，浏览器对象模型，提供了独⽴于内容与浏览器窗⼝进⾏交互的对象其作⽤就是跟浏览器做⼀些交互效果,⽐如如何进⾏⻚⾯的后退，前进，刷新，浏览器的窗⼝发⽣变化，滚动条的滚动，以及获取客⼾的⼀些信息如：浏览器品牌版本，屏幕分辨率

浏览器的全部内容可以看成 DOM ，整个浏览器可以看成 BOM 。区别如下：

![](https://f.pz.al/pzal/2024/06/11/b22994e43801e.png)

## 2 window

Bom 的核⼼对象是 window ，它表⽰浏览器的⼀个实例

在浏览器中， window 对象有双重⻆⾊，即是浏览器窗⼝的⼀个接⼝，⼜是全局对象

因此所有在全局作⽤域中声明的变量、函数都会变成 window 对象的属性和⽅法

```JS
var name = 'js每⽇⼀题';
 function lookName(){
 alert(this.name);
 }
 console.log(window.name); //js每⽇⼀题
 lookName(); //js每⽇⼀题
 window.lookName(); //js每⽇⼀题
```

关于窗⼝控制⽅法如下：
- moveBy(x,y) ：从当前位置⽔平移动窗体x个像素，垂直移动窗体y个像素，x为负数，将向左移动窗体，y为负数，将向上移动窗体
- moveTo(x,y) ：移动窗体左上⻆到相对于屏幕左上⻆的(x,y)点
- resizeBy(w,h) ：相对窗体当前的⼤⼩，宽度调整w个像素，⾼度调整h个像素。如果参数为负值，将缩⼩窗体，反之扩⼤窗体
- resizeTo(w,h) ：把窗体宽度调整为w个像素，⾼度调整为h个像素
- scrollTo(x,y) ：如果有滚动条，将横向滚动条移动到相对于窗体宽度为x个像素的位置，将纵向滚动条移动到相对于窗体⾼度为y个像素的位置
- scrollBy(x,y) ： 如果有滚动条，将横向滚动条向左移动x个像素，将纵向滚动条向下移动y个像素

window.open() 既可以导航到⼀个特定的 url ，也可以打开⼀个新的浏览器窗⼝

如果 window.open() 传递了第⼆个参数，且该参数是已有窗⼝或者框架的名称，那么就会在⽬标窗⼝加载第⼀个参数指定的URL

```JS
window.open('htttp://www.vue3js.cn','topFrame')
< a href=" " target="topFrame"></ a>
```

window.open() 会返回新窗⼝的引⽤，也就是新窗⼝的 window 对象

```JS
const myWin = window.open('http://www.vue3js.cn','myWin')
```

window.close() 仅⽤于通过 window.open() 打开的窗⼝

新创建的 window 对象有⼀个 opener 属性，该属性指向打开他的原始窗⼝对象

## 3 location

url 地址如下：

```JS
http://foouser:barpassword@www.wrox.com:80/WileyCDA/?q=javascript#contents
```

location 属性描述如下：

| 属性名|例子| 说明|
|---|---|---|
|hash|'#contents'|URL中#后面的字符,没有则返回客串|
|host|www.baidu.com:80|服务器名称和端口号|
|hostname|www.baidu.com|域名不带端口号|
|href|www.baidu.com:80/a/?q=1|完整URL域名不带端口号|
|pathname|/a|服务器下面的文件路径|
|port|80|URL的端口号,没有则为空|
|protocol|http:|使用的协议|
|search|?q=1|url的查询字符串,通常为?后面的内容|

除了 hash 之外，只要修改 location 的⼀个属性，就会导致⻚⾯重新加载新 URL

location.reload() ，此⽅法可以重新刷新当前⻚⾯。这个⽅法会根据最有效的⽅式刷新⻚⾯，如果⻚⾯⾃上⼀次请求以来没有改变过，⻚⾯就会从浏览器缓存中重新加载

如果要强制从服务器中重新加载，传递⼀个参数 true 即可

## 4 navigator

navigator 对象主要⽤来获取浏览器的属性，区分浏览器类型。属性较多，且兼容性⽐较复杂下表列出了 navigator 对象接⼝定义的属性和⽅法：

![](https://f.pz.al/pzal/2024/06/11/76c621c71c717.png)
![](https://f.pz.al/pzal/2024/06/11/f63781dbcdcc3.png)

## 5 screen

保存的纯粹是客⼾端能⼒信息，也就是浏览器窗⼝外⾯的客⼾端显⽰器的信息，⽐如像素宽度和像素⾼度

![](https://f.pz.al/pzal/2024/06/11/05623b926c1af.png)

## 6 history

history 对象主要⽤来操作浏览器 URL 的历史记录，可以通过参数向前，向后，或者向指定 URL 跳转

常⽤的属性如下：
- history.go()

接收⼀个整数数字或者字符串参数：向最近的⼀个记录中包含指定字符串的⻚⾯跳转

```JS
history.go('maixaofei.com')
```

当参数为整数数字的时候，正数表⽰向前跳转指定的⻚⾯，负数为向后跳转指定的⻚⾯

```JS
history.go(3) //向前跳转三个记录
history.go(-1) //向后跳转⼀个记录
```

- history.forward() ：向前跳转⼀个⻚⾯
- history.back() ：向后跳转⼀个⻚⾯
- history.length ：获取历史记录数