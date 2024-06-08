---
title: BFC是什么？创建BFC有哪些方法？BFC解决了哪些问题？
tags:
  - css
  - 面试题
date: 2024-05-25
---
# 一 BFC是什么？创建BFC有哪些方法？BFC解决了哪些问题？

## 1.1 BFC 是什么？

BFC 全称为块级格式化上下文(Block Formatting Context),BFC 是 W 3 C CSS 2.1 规范中的一个概念，它决定元素如何对其中的内容进行定位，以及与其他元素的关系和相互作用，通俗的讲，BFC 就是一个特殊的块，内部有自己的布局方式，不受外部元素的影响以及不影响外部的元素。

## 1.2 BFC 的规则

1. 内部的盒子会在垂直方向上一个接着一个的排列
2. 处于同一个 BFC 中的元素盒子会相互影响，可能会发生外边距重叠
3. 每个元素的左外边距(margin)与包含块的左边界(border)相接触(即使是浮动元素也是如此)，说明 BFC 中的子元素不会超出它的包含块
4. BFC 的区域不会与 float 的元素区域重叠
5. 计算 BFC 高度时，浮动子元素参与计算
6. BFC 就是页面上一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然

## 1.3 触发 BFC 的条件

- 根元素或其他包含它的元素
- 浮动元素（元素的float 不为 none）
- 绝对定位的元素（元素就有 position 为 absolute 或是 fixed）
- 内联块（元素具有 display:inline-block）
- 表格单元格（元素具有 display:table-cell,HTML 表格单元格默认属性）
- 表格标题（元素具有 display:table-caption,HTML 表格标题默认属性）
- 具有 overflow 且值不是 visible 的块元素
- 弹性盒子（flex 或者 inline-flex）
- display:flow-root
- column-span:all

## 1.4 BFC 可以解决的问题

- 自适应两列布局
```html
<div>
    <div class="left">浮动元素，无固定宽度</div>
    <div class="right">自适应</div>
</div>

<style>
* {
    margin: 0;
    padding: 0;
}
.left {
    float: left;
    height: 200px;
    margin-right: 10px;
    background-color: red;
}
.right {
    overflow: hidden;
    height: 200px;
    background-color: yellow;
}
</style>
```

效果：

![](https://i.imgur.com/cxbhfYF.png)

- 左列设为左浮动，将自身高度塌陷，使得其它块元素可以和它占据同一行的位置
- 右列为div块级元素，利用自身的流特性占满整行
- 右列设置overflow：hidden，触发BFC特性，使其自身与左列的浮动元素隔离开，不占满整行
- 这就是上面说的BFC的特性之一：浮动元素的区域不会和BFC重叠

其他用法：
- 防止外边距重叠
- 清楚浮动解决父元素高度坍塌
