---
title: 介绍下flex弹性布局
tags:
  - css
  - 面试题
date: 2024-06-09
---

# 一 介绍下flex弹性布局

## 1.1 flex布局

Flexible Box 简称 flex ，意为”弹性布局”，可以简便、完整、响应式地实现各种⻚⾯布局

采⽤Flex布局的元素，称为 flex 容器 container

它的所有⼦元素⾃动成为容器成员，称为 flex 项⽬ item

容器中默认存在两条轴，主轴和交叉轴，呈90度关系。项⽬默认沿主轴排列，通过 flex-direction 来决定主轴的⽅向

每根轴都有起点和终点，这对于元素的对⻬⾮常重要

## 1.2 容器属性

关于 flex 常⽤的属性，我们可以划分为容器属性和容器项目属性

容器属性有：
- flex-direction
- flex-wrap
- flex-flow
- justify-content
- align-items
- align-content

### 1.2.1 flex-direction

决定主轴的⽅向(即项⽬的排列⽅向)

```css
.container { flex-direction: row | row-reverse | column | column-reverse;}
```

属性对应如下：
- row（默认值）：主轴为⽔平⽅向，起点在左端
- row-reverse：主轴为⽔平⽅向，起点在右端
- column：主轴为垂直⽅向，起点在上沿。
- column-reverse：主轴为垂直⽅向，起点在下沿

### 1.2.2 flex-wrap

弹性元素永远沿主轴排列，那么如果主轴排不下，通过 flex-wrap 决定容器内项⽬是否可换⾏

```css
.container {
flex-wrap: nowrap | wrap | wrap-reverse;
}
```

属性对应如下：
- nowrap（默认值）：不换⾏
- wrap：换⾏，第⼀⾏在下⽅
- wrap-reverse：换⾏，第⼀⾏在上⽅

默认情况是不换⾏，但这⾥也不会任由元素直接溢出容器，会涉及到元素的弹性伸缩

### 1.2.3 flex-flow

是 flex-direction 属性和 flex-wrap 属性的简写形式，默认值为 row nowrap

```css
.box {
 flex-flow: <flex-direction> || <flex-wrap>;
}
```

### 1.2.4 justify-content

定义了项⽬在主轴上的对⻬⽅式

```css
.box {
 justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

属性对应如下：
- flex-start（默认值）：左对⻬
- flex-end：右对⻬
- center：居中
- space-between：两端对⻬，项⽬之间的间隔都相等
- space-around：两个项⽬两侧间隔相等

### 1.2.5 align-items

定义项目在交叉轴上如何对齐

```css
.box {
 align-items: flex-start | flex-end | center | baseline | stretch;
}
```

属性对应如下：
- flex-start：交叉轴的起点对⻬
- flex-end：交叉轴的终点对⻬
- center：交叉轴的中点对⻬
- baseline: 项⽬的第⼀⾏⽂字的基线对⻬
- stretch（默认值）：如果项⽬未设置⾼度或设为auto，将占满整个容器的⾼度

### 1.2.6 align-content

定义了多根轴线的对⻬⽅式。如果项⽬只有⼀根轴线，该属性不起作⽤

```css
.box {
 align-content: flex-start | flex-end | center | space-between | spacearound | stretch;
}
```

属性对应如下：
- flex-start：与交叉轴的起点对⻬
- flex-end：与交叉轴的终点对⻬
- center：与交叉轴的中点对⻬
- space-between：与交叉轴两端对⻬，轴线之间的间隔平均分布
- space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔⽐轴线与边框的间隔⼤⼀倍
- stretch（默认值）：轴线占满整个交叉轴

## 1.3 项目属性

- order
- flex-grow
- flex-shrink
- flex-basis
- flex
- align-self

### 1.3.1 order 

定义项⽬的排列顺序。数值越⼩，排列越靠前，默认为0

```css
.item {
 order: <integer>;
}
```

### 1.3.2 flex-grow

上⾯讲到当容器设为 flex-wrap: nowrap; 不换⾏的时候，容器宽度有不够分的情况，弹性元素会根据 flex-grow 来决定

定义项⽬的放⼤⽐例（容器宽度>元素总宽度时如何伸展）

默认为 0，即如果存在剩余空间，也不放⼤

```css
.item {
 flex-grow: <number>;
}
```

如果所有项⽬的 flex-grow 属性都为1，则它们将等分剩余空间（如果有的话）

如果⼀个项⽬的 flex-grow 属性为2，其他项⽬都为1，则前者占据的剩余空间将⽐其他项多⼀倍

弹性容器的宽度正好等于元素宽度总和，⽆多余宽度，此时⽆论 flex-grow 是什么值都不会⽣效

### 1.3.3 flex-shrink

定义了项⽬的缩⼩⽐例（容器宽度<元素总宽度时如何收缩），默认为1，即如果空间不⾜，该项⽬将缩⼩

```css
.item {
 flex-shrink: <number>; /* default 1 */
}
```

如果所有项⽬的 flex-shrink 属性都为1，当空间不⾜时，都将等⽐例缩⼩

如果⼀个项⽬的 flex-shrink 属性为0，其他项⽬都为1，则空间不⾜时，前者不缩⼩

在容器宽度有剩余时， flex-shrink 也是不会⽣效的

### 1.3.4 flex-basis

设置的是元素在主轴上的初始尺⼨，所谓的初始尺⼨就是元素在 flex-grow 和 flex-shrink ⽣效前的尺⼨

浏览器根据这个属性，计算主轴是否有多余空间，默认值为 auto ，即项⽬的本来⼤⼩，如设置了 width 则元素尺⼨由 width/height 决定（主轴⽅向），没有设置则由内容决定

```css
.item {
 flex-basis: <length> | auto; /* default auto */
}
```

当设置为0的是，会根据内容撑开

它可以设为跟 width 或 height 属性⼀样的值（⽐如350px），则项⽬将占据固定空间

### 1.3.5 flex

flex属性是`flex-grow`/`flex-shrink`/`flex-basis`的简写,默认值为`0 1 auto`,也是一个比较难的复合属性

```css
.item {
 flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
```

一些属性有:
- flex:1 = flex:1 1 0%
- flex:2 = flex:2 1 0%
- flex:auto = flex:1 1 auto
- flex:none = flex:0 0 auto 常用语固定尺寸不伸缩

`flex:1`和`flex:auto`的区别,可以归结于`flex-basic:0`和`flex-basic:auto`的区别,当设置为0时(绝对弹性元素),此时相当于告诉`flex-grow`和`flex-shrink`在伸缩的时候不需要考虑我的尺寸

当设置为`auto`的时候(相对弹性元素),此时则需要在伸缩时将元素的尺寸考虑在内

注意:建议优先使用额个属性,而不是单独写三个分离的属性,因为浏览器会推算相关值

### 1.3.6 align-self

允许单个项⽬有与其他项⽬不⼀样的对⻬⽅式，可覆盖 align-items 属性

默认值为 auto ，表⽰继承⽗元素的 align-items 属性，如果没有⽗元素，则等同于 stretch

```css
.item {
 align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

## 1.4 应用场景

- 等高的多列布局：Flexbox 可以轻松创建等高的多列布局，使得每一列的高度相等，无论其内容的长度如何。
- 水平和垂直居中：Flexbox 提供了强大的对齐和居中功能，可以在容器中轻松实现水平和垂直居中元素。
- 自适应布局：Flexbox 具有弹性特性，可以根据可用空间自动调整项目的大小和位置，从而实现自适应的布局。
- 等间距的分布：通过使用 Flexbox 的 justify-content 和 align-items 属性，可以轻松地在容器中创建等间距的分布，使项目之间具有相等的间距。
- 响应式布局：Flexbox 是响应式设计的有力工具，可以通过简单的 CSS 更改来构建适应不同屏幕尺寸和设备类型的布局。
