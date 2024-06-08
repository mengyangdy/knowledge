---
title: css中那些属性可以继承？
tags:
	- css
	- 面试题
date: 2024-06-08
---

# 一 css中那些属性可以继承？

在css中,继承指的是给父元素设置一些属性,后代元素会自动拥有这些属性,关于继承属性可以分为:

- 字体系列属性

```css
font:组合字体
font-family:规定元素的字体系列
font-weight:设置字体的粗细
font-size:设置字体的尺寸
font-style:定义字体的风格
font-variant:偏大或偏小的字体
```

- 文本系列属性

```css
text-indent：文本缩进
text-align：文本水平对刘
line-height：行高
word-spacing：增加或减少单词间的空白
letter-spacing：增加或减少字符间的空白
text-transform：控制文本大小写
direction：规定文本的书写方向
color：文本颜色
```

- 元素可见性
	- visibility
- 表格布局属性

```css
caption-side：定位表格标题位置
border-collapse：合并表格边框
border-spacing：设置相邻单元格的边框间的距离
empty-cells：单元格的边框的出现与消失
table-layout：表格的宽度由什么决定
```

- 列表属性

```css
list-style-type：文字前面的小点点样式
list-style-position：小点点位置
list-style：以上的属性可通过这属性集合
```

- 引用

```css
quotes：设置嵌套引用的引号类型
```

- 光标属性

```css
cursor：箭头可以变成需要的形状
```

## 1.1 继承中特殊的点

继承中比较特殊的几点:

- a标签的字体颜色不能被继承
- h1-h6标签字体的大小也是不能被继承的

无继承的属性:

- display
- 文本属性:vertical-align,text-decoration
- 盒子模型的属性:宽度/高度/内外边距/边框
- 背景属性:背景图片/颜色/位置
- 定位属性:浮动/清除浮动/定位position
- 生成内容属性：content、counter-reset、counter-increment
- 轮廓样式属性：outline-style、outline-width、outline-color、outline
- 页面样式属性：size、page-break-before、page-break-after


### 1.1.1 line-height

line-height比较特殊，不同的属性值有不同的计算方式

- line-height：200px 如果是数值 直接继承
- line-height：1.5 如果是倍数，根据自身的自己大小计算
- line-height：200% 如果是百分比，以父级的字体大小计算


