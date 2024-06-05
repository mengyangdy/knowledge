---
title: 使用CSS，怎么画出一条粗细为0.5px的线?
tags:
  - css
  - 面试题
date: 2024-05-25
---
# 一使用CSS，怎么画出一条粗细为0.5px的线?

## 1.1 直接设置 0.5 px

如果我们**直接设置0.5px**，在不同的浏览器会有不同的表现，使用如下代码：

```html
<!DOCType html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        .hr {
            width: 300px;
            background-color: #000;
        }
        .hr.half-px {
            height: 0.5px;
        }
        .hr.one-px {
           height: 1px;
        }
    </style>
</head>
<body>
    <p>0.5px</p>
    <div class="hr half-px"></div>
    <p>1px</p>
    <div class="hr one-px"></div>
</body>
</html>
```

其中Chrome把0.5px四舍五入变成了1px，而firefox/safari能够画出半个像素的边，并且Chrome会把小于0.5px的当成0，而Firefox会把不小于0.55px当成1px，Safari是把不小于0.75px当成1px，进一步在手机上观察IOS的Chrome会画出0.5px的边，而安卓(5.0)原生浏览器是不行的。

所以直接设置0.5px不同浏览器的差异比较大，并且我们看到不同系统的不同浏览器对小数点的px有不同的处理。

## 1.2 缩放

首先我们设置 1 px 然后使用 scale 0.5

```css
<style>
.hr.scale-half {
    height: 1px;
    transform: scaleY(0.5);
}
</style>
<p>1px + scaleY(0.5)</p>
<div class="hr scale-half"></div>
```

通过transform: scale会导致Chrome变虚了，而粗细几乎没有变化。但是如果加上transform-origin: 50% 100%就都变实了

## 1.3 线性渐变(不太行)

```html
<style>
.hr.gradient {
    height: 1px;
    background: linear-gradient(0deg, #fff, #000);
}
</style>
<p>linear-gradient(0deg, #fff, #000)</p>
<div class="hr gradient"></div>
```

linear-gradient(0deg, #fff , #000 )的意思是：渐变的角度从下往上，从白色 #fff渐变到黑色 #000 ，而且是线性的，在高清屏上，1px的逻辑像素代表的物理（设备）像素有2px，由于是线性渐变，所以第1个px只能是 #fff ，而剩下的那个像素只能是 #000 ，这样就达到了画一半的目的。

## 1.4 boxshadow

```html
<style>
.hr.boxshadow {
    height: 1px;
    background: none;
    box-shadow: 0 0.5px 0 #000;
}
</style>
<p>box-shadow: 0 0.5px 0 #000</p>
<div class="hr boxshadow"></div>
```

设置box-shadow的第二个参数为0.5px，表示阴影垂直方向的偏移为0.5px

## 1.5 SVG

```html
<style>
.hr.svg {
    background: none;
    height: 1px;
    background: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='1px'><line x1='0' y1='0' x2='100%' y2='0' stroke='#000'></line></svg>");
}
</style>
<p>svg</p>
<div class="hr svg"></div>
```

设置background为一个svg文件，这个svg单独拷出来是这样的：

```html
<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='1px'>
    <line x1='0' y1='0' x2='100%' y2='0' stroke='#000'></line>
</svg>
```

使用svg的line元素画线，stroke表示描边颜色，默认描边宽度stroke-width="1"，由于svg的描边等属性的1px是物理像素的1px，相当于高清屏的0.5px，另外还可以使用svg的rect等元素进行绘制。