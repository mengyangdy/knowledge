---
title: transition和animation的区别?
tags:
  - transition
  - animation
  - 面试题
date: 2024-04-23
---
# transition和animation的区别?

- transition 是过度属性,强调过度,它的实现需要触发一个事件(比如鼠标移上去)才执行动画,它类似于 flash 的补间动画,设置一个开始关键帧,一个结束关键帧
- animation 是动画属性,它的实现不需要触发事件,设定好时间之后可以自己执行,且可以循环一个动画,他也类似于 flash 的补间动画,但是他可以设置多个关键帧完成动画
