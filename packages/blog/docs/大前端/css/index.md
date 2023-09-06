---
title: 什么是原子化CSS
tag:
  - css
  - 原子化
date: 2023-09-05
cover: https://s2.loli.net/2023/09/05/TZAkUngWO8Ipqd4.jpg
---

# 原子化CSS

## 什么是原子化CSS？

定义：每一个css属性都通过一个css类来实现的一种css写法。
例如：平时写css

```html
<div class="demo">文字</div>
<style>
  .demo{
    font-size:12px;
    color:red;
    line-height:40px;
  }
</style>
```

而使用原子化css就会变下以下写法：

```html
<div class="text-12 text-red leading-40">文字</div>
<style>
.text-12 {
  font-size: 12px;
}

.text-red {
  color: red;
}

.leading-40 {
  line-height: 40px;
}
</style>
```

## 原子化的优点

- 不必再浪费精力在定义各种类名上
- 控制css体积
	- 随着项目越来越大，css的体积一定是成等比增加的，在原子化css开发中，我们能做到每一个css属性有且只有一个，复用性达到最大
- 调试和修改都非常轻松
	- 每一个样式都是独立的一个，没有丝毫的交叉

## 原子化的缺点

- class类名过多
	- 原子化相当于把一部分的css代码放到了html中，所以样式多的话会变得很长
- 样式优先级
	- 因为原子化的css都是平铺的，所以两个样式之间是不会相互覆盖的，并且类也是框架自动生成的，也不能确定谁前谁后
	- 也就是说原子化中没有权重的概念，如果根据条件修改样式则修改使用不同的类名，而不是通过权重修改

```html
利用权重来修改样式
<button className={`btn ${disabled ? 'disabled' : ''}`}>按钮</button>
<style>
.btn {
  width: 100px;
  height: 50px;
  background: #f0f;
}

.btn.disabled {
  background: #999;
}
</style>

原子化中使用
<button className={`w-100 h-50 ${disabled ? 'bg-[#999]' : 'bg-[#f0f]'}`}>按钮</button>
```

- 需要记很多的类名，记不住了还需要查找

## 项目中是否可以使用原子化

- 团队成员理解并接受原子化css的思想
- 项目定制性比较高，需要书写很多的css
- 对项目体积有要求的
- 迁移项目成本问题