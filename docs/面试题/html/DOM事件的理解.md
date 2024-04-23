---
title: DOM事件的理解
tags:
  - dom
  - 面试题
date: 2024-04-23
---
# DOM 事件的理解

## 一 DOM 事件的级别

- DOM 0:element.onclick=function(){}
- DOM 2:eleent.addEventListener('click',function(){},false)
- DOM 3:element.addEventListener('keyup',function(){},false)(定义方式和 2 一样,但是类型增加了很多,比如说鼠标事件,键盘事件)
- 注意:DOM 1 只是对之前各大厂商的 DOM api 做了整理而实施的标准,所以我们认为 DOM 1 的事件处理和 DOM 0 的事件处理是一样的

## 二 事件模型

![image.png](https://my-vitepress-blog.sh1a.qingstor.com/202404231554383.png)
- 之前我们提到的 addEventListener 还有第三个参数,可以为 true 和 false,当第三个藏几居室为 true 时,绑定的是捕获阶段的事件,在捕获阶段,事件是由上到下依次触发的,反之当第三个参数为 false 时,绑定的是冒泡阶段的事件,在冒泡阶段,事件是由下到上触发的
- W 3 C 规定,当事件发生后,最先通知 window,然后是 document,忧伤往下依次进入直到最底层被触发的那个元素(也就是目标元素,通常是 event.target 的值),这个过程就是捕获,事件会从目标元素开始,冒泡,由下至上逐层传递至 window,这个过程就是冒泡

## 三 事件流

- 浏览器在为当前页面和用户做交互的时候,比如说点击了鼠标左键,这个左键是怎么传到页面上的,页面是怎么响应的,这个就是事件流
- 一个完整的事件流分为三个部分
	- 第一捕获阶段
	- 第二目标阶段
	- 第三从目标元素再上传到 window 对象(也就是冒泡)

## 四 描述 DOM 事件捕获的具体流程

![image.png](https://my-vitepress-blog.sh1a.qingstor.com/202404231600879.png)

## 五 event 对象常用的属性

- `event.preventDefault()`:阻止默认事件(a 标签设置点击事件,用这个可以阻止默认跳转事件)
- `event.stopPropagation()`:阻止冒泡事件
- `event.stopImmediatePropagation()`:注册两个 click 事件,可以在第一个事件中阻止第二个事件触发
- `event.currentTarget`:当前绑定事件的元素
- `event.target`:当前被点击的元素

## 六 自定义事件

事件本质上是一种通信方式,是一种消息,只有在多对象多模块时,才有可能需要使用事件进行通信,在多模块化开发中,可以使用自定义事件进行模块间通信

目前实现自定义事件的两种方式是 js 原生的 `Event()` 构造函数和 `CustomEvent()` 构造函数来创建,两者的区别是 `CustomEvent` 可以在第二个参数中传递一个 detail 对象传递一些信息

```html
<h1 id="elem">Hello from the script!</h1>

<script>
  // 在 document 上捕获...
  document.addEventListener("hello", function(event) { // (1)
    alert("Hello from " + event.target.tagName); // Hello from H1
  });

  // ...在 elem 上 dispatch！
  let event = new Event("hello", {bubbles: true}); // (2)
  elem.dispatchEvent(event);

  // 在 document 上的处理程序将被激活，并显示消息。

</script>

<h1 id="elem">Hello for John!</h1>

<script>
  // 事件附带给处理程序的其他详细信息
  elem.addEventListener("hello", function(event) {
    alert(event.detail.name);
  });

  elem.dispatchEvent(new CustomEvent("hello", {
    detail: { name: "John" }
  }));
</script>
```

## 七事件委托

- 事件委托就是利用事件冒泡,只需制定一个事件处理程序,就可以管理某一类型的所有事件,通过事件委托,可以做到通过在祖先元素添加一个事件处理程序,就可以控制其子孙元素的某些行为
	- 比如说为 ul 下面所有的 li 添加 click 事件对应的行为处理
	- 还有一个常见的利用事件委托的例子,就是点开浮层/关闭浮层,我们常常利用事件委托来监听元素外空间区域的点击来关闭浮层
	- 不是所有事件都是可以委托的,适合用事件委托的事件有: `click` / `mousedown` / `keydown` / `keyup` / `keypress`
