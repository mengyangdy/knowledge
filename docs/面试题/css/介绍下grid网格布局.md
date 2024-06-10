---
title: 介绍下grid网格布局
tags:
  - css
  - 面试题
date: 2024-06-09
---

# 一 介绍下grid网格布局

## 1.1 介绍

Grid 布局即⽹格布局，是⼀个⼆维的布局⽅式，由纵横相交的两组⽹格线形成的框架性布局结构，能够同时处理⾏与列

擅⻓将⼀个⻚⾯划分为⼏个主要区域，以及定义这些区域的⼤⼩、位置、层次等关系

![](https://f.pz.al/pzal/2024/06/09/e511bf0790dea.png)

这与之前讲到的 flex ⼀维布局不相同

设置 display:grid/inline-grid 的元素就是⽹格布局容器，这样就能出发浏览器渲染引擎的⽹格布局算法

```html
<div class="container">
      <div class="item item-1">
        <p class="sub-item"></p>
      </div>
      <div class="item item-2"></div>
      <div class="item item-3"></div>
    </div>
```

上述代码实例中，.container 元素就是⽹格布局容器，.item 元素就是⽹格的项⽬，由于⽹格元素只能是容器的顶层⼦元素，所以 p 元素并不是⽹格元素

这⾥提⼀下，⽹格线概念，有助于下⾯对 grid-column 系列属性的理解

网格线，即划分网格的线，如下图所示：

![pkNwFsO.png](https://s21.ax1x.com/2024/06/09/pkNwFsO.png)

## 1.2 容器属性

同样， Grid 布局属性可以分为两⼤类：
- 容器属性
- 项⽬属性

关于容器属性有如下：

### 1.2.1 display属性

⽂章开头讲到，在元素上设置 display：grid 或 display：inline-grid 来创建⼀个⽹格容器
- display：grid 则该容器是⼀个块级元素
- display: inline-grid 则容器元素为⾏内元素

### 1.2.2 grid-template-columns 属性，grid-template-rows 属性

grid-template-columns 属性设置列宽， grid-template-rows 属性设置⾏⾼

```css
.wrapper {
      display: grid;
      /* 声明了三列，宽度分别为 200px 200px 200px声明了两⾏，⾏⾼分别为 50px 50px */
			grid-template-columns: 200px 200px 200px;
			grid-gap: 5px;
      grid-template-rows: 50px 50px;
    }
```

以上表⽰固定列宽为 200px 200px 200px，⾏⾼为 50px 50px

上述代码可以看到重复写单元格宽⾼，通过使⽤ repeat() 函数，可以简写重复的值

- 第一个参数是重复的次数
- 第二个参数是重复的值

所以上述的代码可以简写为:

```css
.wrapper {
      display: grid;
      /* 声明了三列，宽度分别为 200px 200px 200px声明了两⾏，⾏⾼分别为 50px 50px */
			grid-template-columns: repeat(3,200px);
			grid-gap: 5px;
      grid-template-rows: repeat(2,50px);
    }
```

除了上述的 repeact 关键字，还有：
- auto-fill：表示⾃动填充，让⼀⾏（或者⼀列）中尽可能的容纳更多的单元格
	- grid-template-columns: repeat(auto-fill, 200px) 表⽰列宽是 200 px，但列的数量是不固定的，只要浏览器能够容纳得下，就可以放置元素
- fr：⽚段，为了⽅便表⽰⽐例关系
	- grid-template-columns: 200px 1fr 2fr 表⽰第⼀个列宽设置为 200px，后⾯剩余的宽度分为两部分，宽度分别为剩余宽度的 1/3 和 2/3
- minmax：产⽣⼀个⻓度范围，表⽰⻓度就在这个范围之中都可以应⽤到⽹格项⽬中。第⼀个参数就是最⼩值，第⼆个参数就是最⼤值
	- minmax(100px, 1fr) 表⽰列宽不⼩于 100px ，不⼤于 1fr
- auto：由浏览器⾃⼰决定⻓度
	- grid-template-columns: 100px auto 100px 表⽰第⼀第三列为 100px，中间由浏览器决定⻓度

### 1.2.3 grid-row-gap 属性， grid-column-gap 属性， grid-gap 属性

grid-row-gap 属性、 grid-column-gap 属性分别设置⾏间距和列间距。 grid-gap 属性是两者的简写形式:
- grid-row-gap: 10px 表⽰⾏间距是 10px
- grid-column-gap: 20px 表⽰列间距是 20px
- grid-gap: 10px 20px 等同上述两个属性

### 1.2.4 grid-template-areas 属性

> ⽤于定义区域，⼀个区域由⼀个或者多个单元格组成

```css
.container {
      display: grid;
      grid-template-columns: 100px 100px 100px;
      grid-template-rows: 100px 100px 100px;
      grid-template-areas:
        'a b c'
        'd e f'
        'g h i';
    }
```

上⾯代码先划分出9个单元格，然后将其定名为 a 到 i 的九个区域，分别对应这九个单元格。多个单元格合并成⼀个区域的写法如下:

```css
grid-template-areas: 'a a a'
 'b b b'
 'c c c';
```

上⾯代码将9个单元格分成 a 、 b 、 c 三个区域

如果某些区域不需要利⽤，则使⽤"点"（ . ）表⽰

### 1.2.5 grid-auto-flow 属性

划分⽹格以后，容器的⼦元素会按照顺序，⾃动放置在每⼀个⽹格。

顺序就是由 grid-auto-flow 决定，默认为⾏，代表"先⾏后列"，即先填满第⼀⾏，再开始放⼊第⼆⾏

![](https://f.pz.al/pzal/2024/06/09/a22e9f000fa4b.png)

当修改成 column 后，放置变为如下：

![](https://f.pz.al/pzal/2024/06/09/827ba16e1b2fe.png)


### 1.2.6  justify-items 属性， align-items 属性， place-items 属性

justify-items 属性设置单元格内容的⽔平位置（左中右），align-items 属性设置单元格的垂直位置（上中下）

两者属性的值完成相同:

```css
.container {
      justify-items: start | end | center | stretch;
      align-items: start | end | center | stretch;
    }
```

属性对应如下：
- start：对⻬单元格的起始边缘
- end：对⻬单元格的结束边缘
- center：单元格内部居中
- stretch：拉伸，占满单元格的整个宽度（默认值）

place-items 属性是 align-items 属性和 justify-items 属性的合并简写形式

### 1.2.7 justify-content 属性， align-content 属性， place-content 属性

justify-content 属性是整个内容区域在容器⾥⾯的⽔平位置（左中右）， align-content属性是整个内容区域的垂直位置（上中下）

```css
 .container {
 justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
 align-content: start | end | center | stretch | space-around | space-between | space-evenly;}
```

两个属性的写法完全相同，都可以取下⾯这些值：
- start - 对⻬容器的起始边框
- end - 对⻬容器的结束边框
- center - 容器内部居中

![](https://f.pz.al/pzal/2024/06/09/c322c907bfb54.png)

- space-around - 每个项⽬两侧的间隔相等。所以，项⽬之间的间隔⽐项⽬与容器边框的间隔⼤⼀
倍
- space-between - 项⽬与项⽬的间隔相等，项⽬与容器边框之间没有间隔
- space-evenly - 项⽬与项⽬的间隔相等，项⽬与容器边框之间也是同样⻓度的间隔
- stretch - 项⽬⼤⼩没有指定时，拉伸占据整个⽹格容器

![](https://f.pz.al/pzal/2024/06/09/3d16a51300ee3.png)

### 1.2.8 grid-auto-columns 属性和 grid-auto-rows 属性

有时候，⼀些项⽬的指定位置，在现有⽹格的外部，就会产⽣显⽰⽹格和隐式⽹格

比如网格只有3列，但是某一个项目指定在第5行。这时，浏览器会自动生成多余的网格，以便放置项目。超出的部分就是隐式网格

而grid-auto-rows与grid-auto-columns就是专门用于指定隐式网格的宽高

## 1.3 项目属性

### 1.3.1 grid-column-start 属性、grid-column-end 属性、grid-row-start 属性以及grid-row-end 属性

指定定网格项目所在的四个边框，分别定位在哪根网格线，从而指定项目的位置:
- grid-column-start 属性：左边框所在的垂直网格线
- grid-column-end 属性：右边框所在的垂直网格线
- grid-row-start 属性：上边框所在的水平网格线
- grid-row-end 属性：下边框所在的水平网格线

举个例子:

```html
<style>
      #container {
        display: grid;
        grid-template-columns: 100px 100px 100px;
        grid-template-rows: 100px 100px 100px;
      }
      .item-1 {
        grid-column-start: 2;
        grid-column-end: 4;
      }
    </style>

    <div id="container">
      <div class="item item-1">1</div>
      <div class="item item-2">2</div>
      <div class="item item-3">3</div>
    </div>
```

通过设置grid-column属性，指定1号项目的左边框是第二根垂直网格线，右边框是第四根垂直网格线:

![](https://f.pz.al/pzal/2024/06/09/c6ee906c1a6e3.png)

### 1.3.2 grid-area 属性

grid-area 属性指定项目放在哪一个区域

```css
.item-1 {
  grid-area: e;
}
```

意思为将1号项目位于e区域

与上述讲到的grid-template-areas搭配使用

### 1.3.3 justify-self 属性、align-self 属性以及 place-self 属性

justify-self属性设置单元格内容的水平位置（左中右），跟justify-items属性的用法完全一致，但只作用于单个项目

align-self属性设置单元格内容的垂直位置（上中下），跟align-items属性的用法完全一致，也是只作用于单个项目

```css
.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}
```

这两个属性都可以取下面四个值:
- start：对齐单元格的起始边缘
- end：对齐单元格的结束边缘
- center：单元格内部居中
- stretch：拉伸，占满单元格的整个宽度（默认值）








