---
title: css空出苹果安全区域
description: 
tags: [css]
date: 2025-04-12
---

对于现在的手机有刘海屏、挖孔屏，苹果手机底部还有条横线，这种屏幕一般都被称之为异形屏。

我们以苹果手机为例，现在苹果手机底部都会有一个小黑条，如果我们想把一个按钮放到底部就会被小黑条给挡着，我们就需要做一些兼容性处理。

## 安全区域

> 安全区域指的是一个可视窗口范围，处于安全区域的内容不受到圆角、齐刘海、小黑条的影响。

所以当我们要进行布局的时候，应该仅在安全区域中进行布局。

而要在安全区域中布局我们需要借助几个属性：

1. 一个viewport属性
2. 四个距离的变量
3. 两个css函数

### viewport属性

我们需要为viewport增加`viewport-fit`属性。

viewport-fit是IOS11的新特性，可设置三个值：

1. contain：可视窗口完全包含网页内容
2. cover：网页内容完全覆盖可视窗口
3. auto：默认值，跟contain表现一致

想要完成安全布局，就需要将值设置为cover

```html
<meta name="viewport"content="width=device-width,initial-scale=1.0,viewport-
fit=cover">
```

### 四个距离变量

IOS11新增了四个变量，表示安全区域与边界的距离：

- safe-area-inset-left：安全区域距离左边边界距离
- safe-area-inset-right：安全区域距离右边边界距离
- safe-area-inset-top：安全区域距离顶部边界距离
- safe-area-inset-bottom：安全区域距离底部边界距离

### 两个css函数

这两个函数可以配合上面的四个变量使用，来指定边距：

- constant:constant(safe-area-inset-bottom)；这个属性兼容`iOS<11.2`
- env:env(safe-area-inset-bottom);这个属性兼容`iOS>=11.2`

## 设置按钮样式

```css
.safe-area-bottom{
position: fixed;
bottom:constant（safe-area-inset-bottom);
bottom: env(safe-area-inset-bottom);
width: 100%;
height: 46px;I
line-height: 46px;
text-align: center;
background-color:laqua;
}
```

当我们这样设置了之后就不会出现覆盖的效果了。