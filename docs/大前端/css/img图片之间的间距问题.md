---
title: img图片之间的间距问题
tags:
  - css
  - img
date: 2024-03-23
---
# img图片之间的间距问题

> 页面之间如果有多张图片连续显示，那么图片之间会有一些间距。

![](https://my-vitepress-blog.sh1a.qingstor.com/202403272227700.png)

## 1. 问题分析

img本来是行内元素，却可以用width和height设置宽高，当父元素没有设置高度的时候，用子元素的高度计算出的高度给父元素就会出现3px空隙的问题。

img图片默认排版为inline-block，而所有的inline-block元素之间都会有空白。

## 2. 解决办法

### 2.1 将img设置为块级元素

```css
.img-wrapper {
    padding: 100px;
    display: flex;
}
    .item {
    width: 300px;
    height: 300px;
    object-fit: cover;
    display: block;
}
```

### 2.2 将父容器字体大小设置为0

```css
.img-wrapper {
    padding: 100px;
    font-size: 0;
}
.item {
    width: 300px;
    height: 300px;
    object-fit: cover;
}
```

### 2.3 去掉标签之间的空格

```html
<div class="img-wrapper">
      <img
        class="item"
        src="./1.jpeg"
        alt=""
      /><img
        class="item"
        src="./2.jpeg"
        alt=""
      /><img
        class="item"
        src="./3.jpg"
        alt=""
      />
</div>
```

## 3. 效果

![](https://my-vitepress-blog.sh1a.qingstor.com/202403272235339.png)