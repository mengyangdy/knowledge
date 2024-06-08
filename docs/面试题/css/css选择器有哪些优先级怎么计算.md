---
title: css选择器有哪些优先级怎么计算
tags:
	- css
	- 面试题
date: 2024-06-08
---

# 一 css选择器有哪些？优先级怎么计算？

> css选择器是css规则的一部分，它是元素和其他部分组合起来告诉浏览器那个html元素应当是被选为应用规则中的css属性值的方式
> 选择器所选择的元素叫做选择器的对象

关于css选择器常用的有：

- 通用选择器：#选择所有的元素
- id选择器(#box)：选择id为box的元素
- 类选择器(.one)：选择类名为one的所有元素
- 标签选择器(div)：选择标签为div的所有元素
- 后代选择器(#box div)：选择id为box元素内部所有的div元素
- 子选择器(.one >.one1)：选择父元素为.one的所有.one1的元素
- 相邻兄弟选择器(.one+.two)：选择紧接在.one之后的所有的.two元素
- 群组选择器(div,p)：选择div、p的所有元素
- 伪类选择器：

```css
:link ：选择未被访问的链接
:visited：选取已被访问的链接
:active：选择活动链接
:hover ：鼠标指针浮动在上面的元素
:focus ：选择具有焦点的
:first-child：父元素的首个子元素
//css3新增
:first-of-type 表示一组同级元素中其类型的第一个元素
:last-of-type 表示一组同级元素中其类型的最后一个元素
:only-of-type 表示没有同类型兄弟元素的元素
:only-child 表示没有任何兄弟的元素
:nth-child(n) 根据元素在一组同级中的位置匹配元素
:nth-last-of-type(n) 匹配给定类型的元素，基于它们在一组兄弟元素中的位置，从末尾开始计数
:last-child 表示一组兄弟元素中的最后一个元素
:root 设置HTML文档
:empty 指定空的元素
:enabled 选择可用元素
:disabled 选择被禁用元素
:checked 选择选中的元素
:not(selector) 选择与 <selector> 不匹配的所有元素
```

- 伪元素选择器

```css
:first-letter ：用于选取指定选择器的首字母
:first-line ：选取指定选择器的首行
:before : 选择器在被选元素的内容前面插入内容
:after : 选择器在被选元素的内容后面插入内容
```

- 属性选择器

```css
[attribute] 选择带有attribute属性的元素
[attribute=value] 选择所有使用attribute=value的元素
[attribute~=value] 选择attribute属性包含value的元素
[attribute|=value]：选择attribute属性以value开头的元素
//css3新增
[attribute*=value]：选择attribute属性值包含value的所有元素
[attribute^=value]：选择attribute属性开头为value的所有元素
[attribute$=value]：选择attribute属性结尾为value的所有元素
```

在css3新增的选择器有如下：
- 层级选择器(p~ul):选择前面有p元素的每个ul元素
- 其他新增的在上面

## 1.2 选择器优先级

相信大家对css选择器的优先级都不陌生：
> important > 内联 > ID选择器 > 类选择器 > 标签选择器 

到具体的计算层面，优先级是由A,B,C,D的值来决定的，其中他们的传值计算规则如下:
- 如果存在内联样式那么A=1，否则A=0
- B的值等于ID选择器出现的次数
- C的值等于类类选择器和属性选择器和伪类出现的总次数
- D的值等于标签选择器和伪元素出现的总次数

例如：

```css
#nav-global > ul > li > a.nav-link
```

套用上面的算法，一次求出A B C D的值
- 因为没做内联样式，所以A=0
- ID选择器总共出现了1次，B=1
- 类选择器出现了1次，属性选择器出现了0次，伪类选择器出现0次，所以C=（1+0+0）=1
- 标签选择器出现了3次，伪元素出现了0次，所以D=（3+0）=3
- 上面算出A B C D可以简写为：（0,1,1,3）

知道了优先级是如何计算之后，就来看看比较规则：
- 从左往右一次比较，较大者优先级更高
- 如果相等，则继续往右移动一位进行比较
- 如果4位全部相等，则后面的会覆盖前面的

经过上面的优先级计算规则，我们知道内联样式的优先级最高，如果外部样式需要覆盖内联样式，就需要使用!important