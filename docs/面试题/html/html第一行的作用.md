---
title: html第一行的作用
tags:
  - doctype
  - 面试题
date: 2024-04-23
---
# html第一行的作用是什么?

DTD(document type definition,文档定义模型)是一系列的语法规则,用来定义 XML 或者 HTML 的文件类型,浏览器会使用它来判断文档类型,决定使用何种协议来解析以及切换浏览器模式

DOCTYOE 是用来声明文档类型和 DTD 规范的,一个主要的用户便是文件的合法性校验,如果文件代码不合法,name 浏览器解析时便会出一些差错

```html
<!-- HTML5 -->
<!DOCTYPE html>

<!-- HTML 4.01 Strict -->
<!-- 该 DTD 包含所有 HTML 元素和属性，但不包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets） -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<!-- HTML 4.01 Transitional -->
<!-- 该 DTD 包含所有 HTML 元素和属性，包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）-->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" 
"http://www.w3.org/TR/html4/loose.dtd">

<!-- HTML 4.01 Frameset -->
<!-- 该 DTD 等同于 HTML 4.01 Transitional，且允许框架集内容 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" 
"http://www.w3.org/TR/html4/frameset.dtd">
```