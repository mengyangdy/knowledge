---
title: 使用Swiper4版本进行图片轮播
tags:
  - swiper
date: 2023-09-16
cover: https://s2.loli.net/2023/09/16/aU8c53sNEkBDqFt.jpg
---
# 使用 Swiper4版本进行图片轮播

> 最新要为公司的老项目添加一个轮播图的效果，已经引入过了 swiper 4.5 了，说的是 10 分钟就完成了，谁知道弄了半个小时才弄好，这里记录下 swiper 的使用。

## swiper 的使用

首先先把下载好的 js 和 css 引入进来，然后分为 HTML 部分和 js 部分。

HTML 部分：

```html
<div class="swiper-container">
      <div class="swiper-wrapper">
        <img
          class="swiper-slide"
          style="width: 100%"
          src=""
        />
        <img
          class="swiper-slide"
          style="width: 100%"
          src=""
        />
        <img
          class="swiper-slide"
          style="width: 100%"
          src=""
        />
        <img
          class="swiper-slide"
          style="width: 100%"
          src=""
        />
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <!--左箭头。如果放置在swiper外面，需要自定义样式。-->
      <div class="swiper-button-next"></div>
      <!--右箭头。如果放置在swiper外面，需要自定义样式。-->
    </div>```

因为用的是 4.5 的版本，所以最外层 div 的 class 命名为 `swiper-container`，包裹几个轮播图片的容器的 class 被命名为 `swiper-wrapper`，里面的每一个轮播图片的 class 需要被命名为 `swiper-slide`。

```html
<div class="swiper-container">
      <div class="swiper-wrapper">
        <img
          class="swiper-slide"
          style="width: 100%"
          src=""
        />
        <img
          class="swiper-slide"
          style="width: 100%"
          src=""
        />
        <img
          class="swiper-slide"
          style="width: 100%"
          src=""
        />
        <img
          class="swiper-slide"
          style="width: 100%"
          src=""
        />
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <!--左箭头。如果放置在swiper外面，需要自定义样式。-->
      <div class="swiper-button-next"></div>
      <!--右箭头。如果放置在swiper外面，需要自定义样式。-->
    </div>```

如果需要分页器的话需要在和 `swiper-wrapper` 同级新建一个 div 的 class 为 `swiper-pagination`

```html
<div class="swiper-pagination"></div>
```

如果需要左右箭头的话，需要在和 `swiper-rapper` 同级新建两个 div 的 class 为 `swiper-button-next` 和 `swiper-button-prev`。

```html
<div class="swiper-button-prev"></div>
<!--左箭头。如果放置在swiper外面，需要自定义样式。-->
<div class="swiper-button-next"></div>
<!--右箭头。如果放置在swiper外面，需要自定义样式。-->```

js 部分：

通过 new 一个 Swiper 来创建各种配置：

```js
var myswiper = new Swiper(".swiper-container", {
        loop: true,//无限循环
        autoplay: {//是否自动播放
          delay: 1000,//自动播放的时间间隔
        },
        pagination: {//使用分页器
          el: ".swiper-pagination",
        },
        navigation: {//使用左右箭头
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
      //鼠标放到swiper上面是否暂停自动播放
      myswiper.el.onmouseover = function () {
        myswiper.autoplay.stop();
      };
      myswiper.$el.onmouseout = function () {
        myswiper.autoplay.start();
}
```

以上就是 swiper 的基本使用，不同的版本用法可能会有不同，可以前往 [官网](https://www.swiper.com.cn/) 查找 demo 进行查看。