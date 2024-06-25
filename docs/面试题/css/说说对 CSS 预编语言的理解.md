---
title: 说说对 CSS 预编语言的理解?
tags:
- css
- 面试题
date: 2024-06-10
---

# 一 说说对 CSS 预编语言的理解?

## 1.1 预编语言是什么?

Css 作为⼀⻔标记性语⾔，语法相对简单，对使⽤者的要求较低，但同时也带来⼀些问题

需要书写⼤量看似没有逻辑的代码，不⽅便维护及扩展，不利于复⽤，尤其对于⾮前端开发⼯程师来讲，往往会因为缺少 Css 编写经验⽽很难写出组织良好且易于维护的 Css 代码

Css 预处理器便是针对上述问题的解决方法

## 1.2 有那些

Css 预编译语⾔在前端⾥⾯有三⼤优秀的预编处理器，分别是：
- sass
- less
- stylus

### 1.2.1 sass

2007 年诞⽣，最早也是最成熟的 Css 预处理器，拥有 Ruby 社区的⽀持和 Compass 这⼀最强⼤的 Css 框架，⽬前受 LESS 影响，已经进化到了全⾯兼容 Css 的 Scss

⽂件后缀名为 .sass 与 scss ，可以严格按照 sass 的缩进⽅式省去⼤括号和分号

### 1.2.2 less

2009年出现，受 SASS 的影响较⼤，但⼜使⽤ Css 的语法，让⼤部分开发者和设计师更容易上⼿，在 Ruby 社区之外⽀持者远超过 SASS

其缺点是⽐起 SASS 来，可编程功能不够，不过优点是简单和兼容 Css ，反过来也影响了 SASS 演变到了 Scss 的时代

### 1.2.3 stylus

Stylus 是⼀个 Css 的预处理框架，2010 年产⽣，来⾃ Node.js 社区，主要⽤来给 Node 项⽬进⾏ Css 预处理⽀持

所以 Stylus 是⼀种新型语⾔，可以创建健壮的、动态的、富有表现⼒的 Css 。⽐较年轻，其本质上做的事情与 SASS/LESS 等类似

## 1.3 区别

虽然各种预处理器功能强⼤，但使⽤最多的，还是以下特性：
- 变量（variables）
- 作⽤域（scope）
- 代码混合（ mixins）
- 嵌套（nested rules）
- 代码模块化（Modules）

### 1.3.1 基本使用

less和scss:

sass:

```css
.box
  display: block
```

less:

```css
.box {
 display: block;
}
```

stylus:

```css
.box
  display: block
```

### 1.3.2 嵌套

三者的嵌套语法都是⼀致的，甚⾄连引⽤⽗级选择器的标记 & 也相同

区别只是 Sass 和 Stylus 可以⽤没有⼤括号的⽅式书写

less:

```css
.a {
        &.b {
          color: red;
        }
      }
```

### 1.3.3 变量

变量⽆疑为 Css 增加了⼀种有效的复⽤⽅式，减少了原来在 Css 中⽆法避免的重复「硬编码」

sass 声明的变量跟 less ⼗分的相似，只是变量名前⾯使⽤ $ 开头

```css
$red: #c00;
      strong {
        color: $red;
      }
```

less 声明的变量必须以 @ 开头，后⾯紧跟变量名和变量值，⽽且变量名和变量值需要使⽤冒号 : 分隔开

```css
@red: #c00;
strong {
  color: @red;
}
```

stylus 声明的变量没有任何的限定，可以使⽤ $ 开头，结尾的分号 ; 可有可⽆，但变量与变量值之间需要使⽤ =

在 stylus 中我们不建议使⽤ @ 符号开头声明变量

```css
red = #c00
strong
  color: red
```

### 1.3.4 作用域

Css 预编译器把变量赋予作⽤域，也就是存在⽣命周期。就像 js ⼀样，它会先从局部作⽤域查找变量，依次向上级作⽤域查找

sass 中不存在全局变量

```css
$$color: black;
      .scoped {
        $$bg: blue;

        $color: white;
        color: $ color;
        background-color: $bg;
      }
      .unscoped {
        color: $ color;
      }
```

编译后:

```css
.scoped{
      color:white;
/*是⽩⾊*/
      background-color:blue;
       }
       .unscoped {
       color:white;/
       *⽩⾊（⽆全局变量概念）*
       /
       }
```

所以，在 sass 中最好不要定义相同的变量名

less 与 stylus 的作⽤域跟 javascript ⼗分的相似，⾸先会查找局部定义的变量，如果没有找
到，会像冒泡⼀样，⼀级⼀级往下查找，直到根为⽌

```css
@color: black;
    .scoped {
      @bg: blue;
      @color: white;
      color: @color;
      background-color: @bg;
    }
    .unscoped {
      color: @color;
    }
```

编译后:

```css
   .scoped {
    color:white;/
    *⽩⾊（调⽤了局部变量）*
    /
    background-color:blue;
    }
    .unscoped {
    color:black;/
    *⿊⾊（调⽤了全局变量）*
    /
    }
```

### 1.3.5 混入

混⼊（mixin）应该说是预处理器最精髓的功能之⼀了，简单点来说， Mixins 可以将⼀部分样式抽
出，作为单独定义的模块，被很多选择器重复使⽤

可以在 Mixins 中定义变量或者默认参数

在 less 中，混入的⽤法是指将定义好的 ClassA 中引⼊另⼀个已经定义的 Class ，也能够使⽤传
递参数，参数变量为 @ 声明

```css
.alert {
      font-weight: 700;
    }
    .highlight(@color: red) {
      font-size: 1.2em;
      color: @color;
    }
    .heads-up {
      .alert;
      .highlight(red);
    }
```

编译后

```css
.alert {
      font-weight: 700;
    }
    .heads-up {
      font-weight: 700;
      font-size: 1.2em;
      color: red;
    }
```

Sass 声明 mixins 时需要使⽤ @mixinn ，后⾯紧跟 mixin 的名，也可以设置参数，参数名为变量 $ 声明的形式

```css
@mixin large-text {
      font: {
        family: Arial;
        size: 20px;
        weight: bold;
      }
      color: #ff0000;
    }
    .page-title {
      @include large-text;
      padding: 4px;
      margin-top: 10px;
    }
```

stylus 中的混合和前两款 Css 预处理器语⾔的混合略有不同，他可以不使⽤任何符号，就是直接声明 Mixins 名，然后在定义参数和默认值之间⽤等号（=）来连接

```css
   error(borderWidth= 2px) {
    border: borderWidth solid #F00;
    color: #F00;
    }
    .generic-error {
    padding: 20px;
    margin: 4px;
    error(); 
		/* 调⽤error mixins/
    }
    .login-error {
    left: 12px;
    position: absolute;
    top: 20px;
    * error(5px); 
	  /*调⽤error mixins，并将参数$borderWidth的值指定为5px */
    }
```

### 1.3.6 代码模块化

模块化就是将 Css 代码分成⼀个个模块

scss、less、stylus 三者的使⽤⽅法都如下所⽰

```css
@import './common';
@import './github-markdown';
@import './mixin';
@import './variables';
```



