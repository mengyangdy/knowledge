---
title: css+js手写轮播图
tags:
  - 轮播图
date: 2023-09-19
cover: https://s2.loli.net/2023/09/19/R2fNGZdaheL1xq3.jpg
---

# css+js 手写轮播图

## 基本样式搭建

轮播图大致分为两种：一种就是我们常说的循环展示的那种，一种是所有图片重叠一起通过 `opacity` 来控制展示的。

通过 opacity 展示的：

```html
<style>
  .banner .images {
    position: relative;
    height: 550px;
    transition: all 500ms ease;
  }

  .banner .images .item {
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    overflow: hidden;
    transition: opacity 1000ms ease;
    opacity: 0;
  }

  .banner .images .item.active {
    opacity: 1;
  }
</style>

<ul class="images">
  <li>
    <img
      src="图片地址"
      alt=""
    />
  </li>
  <li>
    <img
      src="图片地址"
      alt=""
    />
  </li>
  <li>
    <img
      src="图片地址"
      alt=""
    />
  </li>
</ul>
```

这种主要是把所有的图片都重叠放在一起，透明度都设置为 0，只有当样式上有 active 的样式时，opacity 设置为 1，然后图片展示，这样只需要切换 li 的 active 样式即可完成图片显示与否。

通过循环展示图片：

```html
<style>
  .banner .images {
    position: relative;
    height: 550px;
    transition: all 500ms ease;
  }

  .banner .images .item {
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    overflow: hidden;
    transition: opacity 1000ms ease;
  }
</style>
<div class="banner">
  <ul class="images">
    <li style="left:0;">
      <img
        src="图片地址"
        alt=""
      />
    </li>
    <li style="left:100%;">
      <img
        src="图片地址"
        alt=""
      />
    </li>
    <li style="left:200%;">
      <img
        src="图片地址"
        alt=""
      />
    </li>
  </ul>
</div>
```

这种做法主要是让图片平铺展示，每次让图片向左平移 100%即可实现图片切换

![](https://s2.loli.net/2023/09/19/YnZi4M7jISky3Lw.png)

图片 1 的 left 为 0，图片 2 的 left 为 100%，图片 3 的 left 为 200%，图片 4 的 left 为 300%，然后 banner 的 overflow 设置为 hidden 这样就只会展示出来第一张图片，当我们需要切换的第二张的时候，我们只需要将 images 的 transform 的 translateX (-100%) 即可展示出来第二张。

## 上一页下一页控制

添加两个按钮来控制图片的切换：

```html
<div class="control">
  <button class="prev">上一个</button>
  <button class="next">下一个</button>
</div>
```

然后添加上一页和下一页的逻辑：

```js
// 2. 监听按钮的点击
//上一页  下一页
let previousIndex = 0 //记录下上一页的索引
let currentIndex = 0 //记录下当前图片所在的索引
let controlEl = document.querySelector('.control')
let nextBtnEl = controlEl.querySelector('.next')
let prevBtnEl = controlEl.querySelector('.prev')
prevBtnEl.onclick = function () {
  previousIndex = currentIndex
  currentIndex--
  if (currentIndex === -1) {
    currentIndex = banners.length - 1
  }
  //让currentIndex变成active状态 让previous变成普通的
  switchBannerItem()
}
nextBtnEl.onclick = nextSwitch

function nextSwitch() {
  previousIndex = currentIndex
  currentIndex++
  // if (currentIndex === data.length) {
  //   currentIndex =0
  // }
  switchBannerItem()
}

function switchBannerItem() {
  //让currentIndex变成active状态 让previous变成普通的
  // const currentItemEl = banners[currentIndex]
  // const previousItemEl = banners[previousIndex]
  // previousItemEl.classList.remove('active')
  // currentItemEl.classList.add('active')
  imagesEl.style.transition = `all 500ms ease`
  imagesEl.style.transform = `translateX(${-currentIndex * 100}%)`
  if (currentIndex === data.length) {
    currentIndex = 0
    fixBannerPosition()
  } else if (currentIndex === -1) {
    currentIndex = data.length - 1
    fixBannerPosition()
  }

  //切换指示器的按钮
  var currentInItemEl = indicatorEl.children[currentIndex]
  var previousInItemEl = indicatorEl.children[previousIndex]
  currentInItemEl.classList.add('active')
  previousInItemEl.classList.remove('active')
}
```

点击上一页的逻辑：先让 previousIndex 记录一下当前页 currentIndex 的索引，然后将当前的索引 currentIndex-- 到上一页的索引，当 currentIndex 等于-1 的时候，说明是从第一页点击的上一页，所以就应该跳转到最后一页，所有 currentIndex 就等于图片长度-1。

点击下一页的逻辑，前面的和上一页的逻辑是一样的，当 currentIndex 等于图片数组的长度的时候，证明是最后一个图片点击的下一页，所以需要将 currentIndex=0。

切换的逻辑：切换的时候首先给 imagesEl 添加上动画效果，并且让 imagesEl 进行位移：

```js
imagesEl.style.transition = `all 500ms ease`
imagesEl.style.transform = `translateX(${-currentIndex * 100}%)`
```

## 自动轮播

自动轮播的原理就是让下一页的逻辑每隔几秒执行一下，所以自动轮播的逻辑就是让下一页的逻辑每隔几秒执行一下

```js
var timer = null
//开始自动轮播
startTimer()

//开启定时器
function startTimer() {
  if (timer) {
    return
  }
  // nextSwitch就是点击下一页的逻辑
  timer = setInterval(nextSwitch, 1000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
```

## 指示器展示

指示器的数量应该是和我们的图片数组的长度是一样的，并且 active 样式是和 currentIndex 相关联的，currentIndex 对应的指示器应该添加 active 样式，其他的应该删除这个样式。

```js
// 动态添加指示器内容
var indicatorEl = document.querySelector('.indicator')
for (var i = 0; i < data.length; i++) {
  var itemEl = document.createElement('div')
  itemEl.classList.add('item')
  if (i === 0) {
    itemEl.classList.add('active')
  }
  indicatorEl.append(itemEl)
  //当点击原点的时候切换图片
  itemEl.index = i
  itemEl.onclick = function () {
    previousIndex = currentIndex
    currentIndex = this.index
    switchBannerItem()
  }
}
```

每次当图片切换的时候，currentIndex 变化时，上一个指示器的 active 样式应该删除，当前的 currentIndex 对应的元素应该添加 active 样式。

```js
  function switchBannerItem() {
    ...
    ...
    ...
    ...

    //切换指示器的按钮
    var currentInItemEl = indicatorEl.children[currentIndex]
    var previousInItemEl = indicatorEl.children[previousIndex]
    currentInItemEl.classList.add('active')
    previousInItemEl.classList.remove('active')
  }
```

## 无限滚动

上面其实已经可以实现轮播了，但是还是有一点小瑕疵的，到最后一个图片的时候，需要跳转到第一张图片的时候，是从最后一张图片往前走到第一张，这样第二张第三张都会闪过，会给人带来不好的感觉，所以我们需要把元素的结构修改一下：

```js
const data = [
  {
    url: './image/banner_01.webp'
  },
  {
    url: './image/banner_02.webp'
  },
  {
    url: './image/banner_03.webp'
  }
]

for (var i = 0; i < data.length; i++) {
  var banner = data[i]
  var itemEl = document.createElement('li')
  itemEl.classList.add('item')
  if (i === 0) {
    itemEl.classList.add('active')
    activeItemEl = itemEl
  }
  imagesEl.append(itemEl)
  itemEl.style.left = `${i * 100}%`

  var imgEl = document.createElement('img')
  imgEl.src = `${banner.url}`
  itemEl.append(imgEl)
}
//追加 （无限轮播） 最后和最前添加一个元素
var firstItem = imagesEl.children[0].cloneNode(true)
var lastItem = imagesEl.children[data.length - 1].cloneNode(true)
imagesEl.append(firstItem)
imagesEl.prepend(lastItem)
lastItem.style.left = `-100%`
firstItem.style.left = `${data.length * 100}%`
```

最后一个元素添加到最前面的时候，他的样式为 left：-100%; 这样就是最前面的第四张图片就会在最前面并且不显示，第一张图片添加到最后的时候添加样式 left: `${data.length * 100}%` 这样第一张图片就会排列在最后面。

![](https://s2.loli.net/2023/09/19/zaAo5tHx2pfmNn9.png)

当我们跳转到第四张图片的时候，点击下一张会跳转到最后面的第一张图片，这时候我们需要将动画取消，并且将 ul 的 translateX 改为前面的第一张图片，并且因为我们有动画效果，所以我们应该让第四张跳转到后面的第一张完成后，在做拉回到前面第一张的操作。

```js
function switchBannerItem() {
    imagesEl.style.transition = `all 500ms ease`
    imagesEl.style.transform = `translateX(${-currentIndex * 100}%)`
    if (currentIndex === data.length) {
      currentIndex = 0
      fixBannerPosition()
    } else if (currentIndex === -1) {
      currentIndex = data.length - 1
      fixBannerPosition()
    }
    ...
    ...
    ...
    ...
  }

  //修正位移的位置
  function fixBannerPosition() {
    setTimeout(function () {
      imagesEl.style.transition = 'none'
      imagesEl.style.transform = `translateX(${-currentIndex * 100}%)`
    }, 500)
  }

```

## 优化：页面不可见停止定时器

当我们页面切换或者不可见的时候，浏览器并不会执行切换图片的操作，但是定时器还是会继续执行的，如果我们切换页面的时候定时器从 0 走到了 2，页面显示的时候，页面的图片会快速的从第一张跳转到第三张，并且第二张也会闪一下。

所以当我们的页面不显示的时候，我们应该关闭定时器，当页面显示的时候，我们应该开启定时器：

```js
document.onvisibilitychange = function () {
  if (document.visibilityState === 'visible') {
    startTimer()
  } else if (document.visibilityState === 'hidden') {
    stopTimer()
  }
}
```

这样一个无限轮播的轮播图就已经做好了。
