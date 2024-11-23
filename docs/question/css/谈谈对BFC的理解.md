# BFC是什么？

## 1.1 BFC 是什么？

BFC 全称为块级格式化上下文(Block Formatting Context),BFC 是 W 3 C CSS 2.1 规范中的一个概念，它决定元素如何对其中的内容进行定位，以及与其他元素的关系和相互作用，通俗的讲，BFC 就是一个特殊的块，内部有自己的布局方式，不受外部元素的影响以及不影响外部的元素。

## 1.2 BFC 的规则

1. 内部的盒子会在垂直方向上一个接着一个的排列
2. 处于同一个 BFC 中的元素盒子会相互影响，可能会发生外边距重叠
3. 每个元素的左外边距(margin)与包含块的左边界(border)相接触(即使是浮动元素也是如此)，说明 BFC 中的子元素不会超出它的包含块
4. BFC 的区域不会与 float 的元素区域重叠
5. 计算 BFC 高度时，浮动子元素参与计算
6. BFC 就是页面上一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然

## 1.3 触发 BFC 的条件

- 根元素或其他包含它的元素
- 浮动元素（元素的float 不为 none）
- 绝对定位的元素（元素就有 position 为 absolute 或是 fixed）
- 内联块（元素具有 display:inline-block）
- 表格单元格（元素具有 display:table-cell,HTML 表格单元格默认属性）
- 表格标题（元素具有 display:table-caption,HTML 表格标题默认属性）
- 具有 overflow 且值不是 visible 的块元素
- 弹性盒子（flex 或者 inline-flex）
- display:flow-root
- column-span:all

## 1.4 BFC的应用场景

- 自适应两列布局
```html
<div>
    <div class="left">浮动元素，无固定宽度</div>
    <div class="right">自适应</div>
</div>

<style>
* {
    margin: 0;
    padding: 0;
}
.left {
    float: left;
    height: 200px;
    margin-right: 10px;
    background-color: red;
}
.right {
    overflow: hidden;
    height: 200px;
    background-color: yellow;
}
</style>
```

效果：

![](https://i.imgur.com/cxbhfYF.png)

- 左列设为左浮动，将自身高度塌陷，使得其它块元素可以和它占据同一行的位置
- 右列为div块级元素，利用自身的流特性占满整行
- 右列设置overflow：hidden，触发BFC特性，使其自身与左列的浮动元素隔离开，不占满整行
- 这就是上面说的BFC的特性之一：浮动元素的区域不会和BFC重叠


- 防止外边距重叠

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      p {
        color: #f55;
        background: #fcc;
        width: 200px;
        line-height: 100px;
        text-align: center;
        margin: 100px;
      }
    </style>
  </head>
  <body>
    <p>Hello World</p>
    <p>Hello haha</p>
  </body>
</html>
```

![](https://img.notionusercontent.com/s3/prod-files-secure%2F52004ae7-5014-4293-b63b-97795112e822%2F74d62b66-3fc7-4f58-a79d-aabaa9d63600%2Fimage.png/size/w=2000?exp=1732096550&sig=DHf5xvZ36WRgPYzMxb1Guta6S6RCrAGc9rE5l_Iqp1Y)

两个 p 元素之间的距离为 100px ，发⽣了 margin 重叠（塌陷），以最⼤的为准，如果第⼀个P的margin 为80的话，两个P之间的距离还是100，以最⼤的为准。

前⾯讲到，同⼀个 BFC 的俩个相邻的盒⼦的 margin 会发⽣重叠,可以在 p 外⾯包裹⼀层容器，并触发这个容器⽣成⼀个 BFC ，那么两个 p 就不属于同⼀个 BFC ，则不会出现 margin 重叠

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      p {
        color: #f55;
        background: #fcc;
        width: 200px;
        line-height: 100px;
        text-align: center;
        margin: 100px;
      }
      .wrap {
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <p>Hello World</p>
    <div class="wrap">
      <p>Hello haha</p>
    </div>
  </body>
</html>
```

- 清楚浮动解决父元素高度坍塌

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .par{
      border: 5px solid #fcc;
      width: 300px;
    }
    .child{
      border: 5px solid #f66;
      width: 100px;
      height: 100px;
      float: left;
    }
  </style>
</head>
<body>
  <div class="par">
    <div class="child"></div>
    <div class="child"></div>
  </div>
</body>
</html>
```

![](https://img.notionusercontent.com/s3/prod-files-secure%2F52004ae7-5014-4293-b63b-97795112e822%2F2606f476-f7ec-4113-907a-1a3e15fd355b%2Fimage.png/size/w=2000?exp=1732096619&sig=ptyszU800xiUx5hUwPYBplHtuM3iYMA8wAUoVa7rejk)

⽽ BFC 在计算⾼度时，浮动元素也会参与，所以我们可以触发 .par 元素⽣成 BFC ，则内部浮动元素计算⾼度时候也会计算

```css
.par{
	ovrflow:hidden;
}
```


