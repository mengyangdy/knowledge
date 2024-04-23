---
title: 为什么用translate来改变位置而不是定位?
tags:
  - translate
  - 面试题
date: 2024-04-23
---
# 为什么用translate来改变位置而不是定位?

- translate 是 transform 属性的一个值
	- 改变 transform 或者 opacity 不会触发浏览器重新布局(reflow)或重绘(repaint),只会触发复合(compositions)
	- 而改变绝对定位会触发重新布局,进而触发重绘和复合
	- transform 使浏览器为元素创建一个 GPU 图层,但改变绝对定位会使用到 CPU
	- 因此 translate 更高效,可以缩短平滑动画的绘制时间,而 translate 改变位置时,元素依然会占据其原始空间,绝对定位就不会发生这种情况
