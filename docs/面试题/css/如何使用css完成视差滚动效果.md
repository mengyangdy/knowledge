---
title: 如何使用css完成视差滚动效果?
tags:
  - css
  - 面试题
date: 2024-06-08
---

# 一 如何使用css完成视差滚动效果?

## 1.1 是什么

视差滚动（Parallax Scrolling）是指多层背景以不同的速度移动，形成⽴体的运动效果，带来⾮常出⾊的视觉体验

我们可以把⽹⻚解刨成：背景层、内容层、悬浮层

![1](https://f.pz.al/pzal/2024/06/08/444f1302f4d87.png)

当滚动⿏标滑轮的时候，各个图层以不同的速度移动，形成视觉差的效果

## 1.2 实现方式

使⽤ css 形式实现视觉差滚动效果的⽅式有：
- background-attachment
- transform:translate3D

### 1.2.1 background-attachment

作⽤是设置背景图像是否固定或者随着⻚⾯的其余部分滚动

值分别有如下：
- scroll：默认值，背景图像会随着⻚⾯其余部分的滚动⽽移动
- fixed：当⻚⾯的其余部分滚动时，背景图像不会移动
- inherit：继承⽗元素background-attachment属性的值

完成滚动视觉差就需要将 background-attachment 属性设置为 fixed ，让背景相对于视⼝固定。即使⼀个元素有滚动机制，背景也不会随着元素的内容⽽滚动

也就是说，背景⼀开始就已经被固定在初始的位置

核⼼的 css 代码如下：

```css
section {
      height: 100vh;
    }
    .g-img {
      background-image: url(...);
      background-attachment: fixed;
      background-size: cover;
      background-position: center center;
    }
```

整体例子如下:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Document</title>
  </head>
  <body>
    <style>
      div {
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        line-height: 100vh;
        text-align: center;
        font-size: 20vh;
      }
      .a-img1 {
        background-image: url(https://images.pexels.com/photos/1097491/pexels-photo-1097491.jpeg);
        background-attachment: fixed;
        background-size: cover;
        background-position: center center;
      }
      .a-img2 {
        background-image: url(https://images.pexels.com/photos/2437299/pexels-photo-2437299.jpeg);
        background-attachment: fixed;
        background-size: cover;
        background-position: center center;
      }
      .a-img3 {
        background-image: url(https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg);
        background-attachment: fixed;
        background-size: cover;
        background-position: center center;
      }
    </style>
    <div class="a-text">1</div>
    <div class="a-img1">2</div>
    <div class="a-text">3</div>
    <div class="a-img2">4</div>
    <div class="a-text">5</div>
    <div class="a-img3">6</div>
    <div class="a-text">7</div>
  </body>
</html>
```

### 1.2.2 transform:translate3D

同样，让我们先来看⼀下两个概念 transform 和 perspective：
- transform: css3 属性，可以对元素进⾏变换(2d/3d)，包括平移 translate,旋转 rotate,缩放 scale,等等
- perspective: css3 属性，当元素涉及 3d 变换时，perspective 可以定义我们眼睛看到的 3d ⽴体效果，即空间感

3D视⻆⽰意图如下所⽰：

![https://f.pz.al/pzal/2024/06/08/f71cc45c45fad.png](https://f.pz.al/pzal/2024/06/08/f71cc45c45fad.png)

举个例子:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Document</title>
  </head>
  <body>
    <style>
      html {
        overflow: hidden;
        height: 100%;
      }
      body {
        /* 视差元素的⽗级需要3D视⻆ */
        perspective: 1px;
        transform-style: preserve-3d;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
      }
      #app {
        width: 100vw;
        height: 200vh;
        background: skyblue;
        padding-top: 100px;
      }
      .one {
        width: 500px;
        height: 200px;
        background: #409eff;
        transform: translateZ(0px);
        margin-bottom: 50px;
      }
      .two {
        width: 500px;
        height: 200px;
        background: #67c23a;
        transform: translateZ(-1px);
        margin-bottom: 150px;
      }
      .three {
        width: 500px;
        height: 200px;
        background: #e6a23c;
        transform: translateZ(-2px);
        margin-bottom: 150px;
      }
    </style>
    <div id="app">
      <div class="one">one</div>
      <div class="two">two</div>
      <div class="three">three</div>
    </div>
  </body>
</html>
```

⽽这种⽅式实现视觉差动的原理如下：
- 容器设置上 transform-style: preserve-3d 和 perspective: xpx，那么处于这个容器的⼦元素就将位于3D空间中，
- ⼦元素设置不同的 transform: translateZ()，这个时候，不同元素在 3D Z轴⽅向距离屏幕（我们的眼睛）的距离也就不⼀样
- 滚动滚动条，由于⼦元素设置了不同的 transform: translateZ()，那么他们滚动的上下距离translateY 相对屏幕（我们的眼睛），也是不⼀样的，这就达到了滚动视差的效果