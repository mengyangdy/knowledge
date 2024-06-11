---
title: DOM常见的操作是什么?
tags:
  - js
  - 面试题
date: 2024-06-11
---

# 一 DOM常见的操作是什么?

## 1.1 DOM
⽂档对象模型 (DOM) 是 HTML 和 XML ⽂档的编程接⼝

它提供了对⽂档的结构化的表述，并定义了⼀种⽅式可以使从程序中对该结构进⾏访问，从⽽改变⽂
档的结构，样式和内容

任何 HTML 或 XML ⽂档都可以⽤ DOM 表⽰为⼀个由节点构成的层级结构

节点分很多类型，每种类型对应着⽂档中不同的信息和（或）标记，也都有⾃⼰不同的特性、数据和⽅法，⽽且与其他类型有某种关系，如下所⽰：

```html
<html>
  <head>
    <title>Page</title>
  </head>
  <body>
    <p>Hello World!</p>
  </body>
</html>
```

DOM 像原⼦包含着亚原⼦微粒那样，也有很多类型的 DOM 节点包含着其他类型的节点。接下来我们先看看其中的三种：

```html
<div>
      <p title="title">content</p>
    </div>
```

上述结构中， div 、 p 就是元素节点， content 就是⽂本节点， title 就是属性节点

## 1.2 操作

⽇常前端开发，我们都离不开 DOM 操作

在以前，我们使⽤ Jquery ， zepto 等库来操作 DOM ，之后在 vue ， Angular ， React 等框架出现后，我们通过操作数据来控制 DOM （绝⼤多数时候），越来越少的去直接操作 DOM

但这并不代表原⽣操作不重要。相反， DOM 操作才能有助于我们理解框架深层的内容

下⾯就来分析 DOM 常⻅的操作，主要分为：
- 创建节点
- 查询节点
- 更新节点
- 添加节点
- 删除节点

### 1.2.1 创建节点

#### 1.2.1.1 createElement

创建新元素，接受⼀个参数，即要创建元素的标签名

```JS
const divEl = document.createElement("div");
```

#### 1.2.1.2 createTextNode

创建⼀个⽂本节点

```JS
const textEl = document.createTextNode("content");
```

#### 1.2.1.3 createDocumentFragment

⽤来创建⼀个⽂档碎⽚，它表⽰⼀种轻量级的⽂档，主要是⽤来存储临时节点，然后把⽂档碎⽚的内容⼀次性添加到 DOM 中

```JS
const fragment = document.createDocumentFragment();
```

当请求把⼀个 DocumentFragment 节点插⼊⽂档树时，插⼊的不是 DocumentFragment ⾃⾝，⽽是它的所有⼦孙节点

#### 1.2.1.4 createAttribute

创建属性节点，可以是⾃定义属性

```JS
const dataAttribute = document.createAttribute('custom');
consle.log(dataAttribute);
```

### 1.2.2 获取节点

#### 1.2.2.1 querySelector

传⼊任何有效的 css 选择器，即可选中单个 DOM 元素（⾸个）：

```JS
document.querySelector('.element')
document.querySelector('#element')
document.querySelector('div')
document.querySelector('[name="username"]')
document.querySelector('div + p > span')
```

如果⻚⾯上没有指定的元素时，返回 null

#### 1.2.2.2 querySelectorAll

返回⼀个包含节点⼦树内所有与之相匹配的 Element 节点列表，如果没有相匹配的，则返回⼀个空节点列表

```JS
const notLive = document.querySelectorAll("p");
```

需要注意的是，该⽅法返回的是⼀个 NodeList 的静态实例，它是⼀个静态的“快照”，⽽⾮“实时”的查询

关于获取 DOM 元素的⽅法还有如下，就不⼀⼀述说

```JS
document.getElementById('id属性值');返回拥有指定id的对象的引⽤
document.getElementsByClassName('class属性值');返回拥有指定class的对象集合
document.getElementsByTagName('标签名');返回拥有指定标签名的对象集合
document.getElementsByName('name属性值'); 返回拥有指定名称的对象结合
document/element.querySelector('CSS选择器'); 仅返回第⼀个匹配的元素
document/element.querySelectorAll('CSS选择器'); 返回所有匹配的元素
document.documentElement; 获取⻚⾯中的HTML标签
document.body; 获取⻚⾯中的BODY标签
document.all['']; 获取⻚⾯中的所有元素节点的对象集合型
```

除此之外，每个 DOM 元素还有 parentNode、childNodes、firstChild、lastChild、nextSibling、previousSibling 属性，关系图如下图所⽰

![](https://f.pz.al/pzal/2024/06/11/cc1666479ee8a.png)

### 1.2.3 更新节点

#### 1.2.3.1 innerHTML

不但可以修改⼀个 DOM 节点的⽂本内容，还可以直接通过 HTML ⽚段修改 DOM 节点内部的⼦树

```JS
 // 获取<p id="p">...</p >
 var p = document.getElementById('p');
 // 设置⽂本为abc:
 p.innerHTML = 'ABC'; // <p id="p">ABC</p >
 // 设置HTML:
 p.innerHTML = 'ABC <span style="color:red">RED</span> XYZ';
 // <p>...</p >的内部结构已修改
```

#### 1.2.3.2 innerText、textContent

⾃动对字符串进⾏ HTML 编码，保证⽆法设置任何 HTML 标签

```JS
 // 获取<p id="p-id">...</p >
 var p = document.getElementById('p-id');
 // 设置⽂本:
 p.innerText = '<script>alert("Hi")</script>';
 // HTML被⾃动编码，⽆法设置⼀个<script>节点:
 // <p id="p-id"><script>alert("Hi")</script></p >
```

两者的区别在于读取属性时， innerText 不返回隐藏元素的⽂本，⽽ textContent 返回所有⽂本

#### 1.2.3.3 style

DOM 节点的 style 属性对应所有的 CSS ，可以直接获取或设置。遇到 - 需要转化为驼峰命名

```JS
 // 获取<p id="p-id">...</p >
 const p = document.getElementById('p-id');
 // 设置CSS:
 p.style.color = '#ff0000';
 p.style.fontSize = '20px'; // 驼峰命名
 p.style.paddingTop = '2em';
```

### 1.2.4 添加节点

#### 1.2.4.1 innerHTML

如果这个DOM节点是空的，例如， <div></div> ，那么，直接使⽤ innerHTML ='<span>child</span>' 就可以修改 DOM 节点的内容，相当于添加了新的 DOM 节点

如果这个DOM节点不是空的，那就不能这么做，因为 innerHTML 会直接替换掉原来的所有⼦节点

#### 1.2.4.2 appendChild

把⼀个⼦节点添加到⽗节点的最后⼀个⼦节点

```html
 <!-- HTML结构 -->
 <p id="js">JavaScript</p >
 <div id="list">
 <p id="java">Java</p >
 <p id="python">Python</p >
 <p id="scheme">Scheme</p >
 </div>
```

添加⼀个 p 元素

```JS
 const js = document.getElementById('js')
 js.innerHTML = "JavaScript"
 const list = document.getElementById('list');
 list.appendChild(js);
```

现在 HTML 结构变成了下⾯

```html
 <!-- HTML结构 -->
 <div id="list">
 <p id="java">Java</p >
 <p id="python">Python</p >
 <p id="scheme">Scheme</p >
 <p id="js">JavaScript</p > <!-- 添加元素 -->
 </div>
```

上述代码中，我们是获取 DOM 元素后再进⾏添加操作，这个 js 节点是已经存在当前⽂档树中，因此这个节点⾸先会从原先的位置删除，再插⼊到新的位置

如果动态添加新的节点，则先创建⼀个新的节点，然后插⼊到指定的位置

```JS
 const list = document.getElementById('list'),
 const haskell = document.createElement('p');
 haskell.id = 'haskell';
 haskell.innerText = 'Haskell';
 list.appendChild(haskell);
```

#### 1.2.4.3 insertBefore

把⼦节点插⼊到指定的位置，使⽤⽅法如下：

```JS
parentElement.insertBefore(newElement, referenceElement)
```

⼦节点会插⼊到 referenceElement 之前

#### 1.2.4.4 setAttribute

在指定元素中添加⼀个属性节点，如果元素中已有该属性改变属性值

```JS
const div = document.getElementById('id')
div.setAttribute('class', 'white');//第⼀个参数属性名，第⼆个参数属性值。
```


### 1.2.5 删除节点

删除⼀个节点，⾸先要获得该节点本⾝以及它的⽗节点，然后，调⽤⽗节点的 removeChild 把⾃⼰删掉

```JS
// 拿到待删除节点:
const self = document.getElementById('to-be-removed');
 // 拿到⽗节点:
 const parent = self.parentElement;
 // 删除:
 const removed = parent.removeChild(self);
 removed === self; // true
```

删除后的节点虽然不在⽂档树中了，但其实它还在内存中，可以随时再次被添加到别的位置