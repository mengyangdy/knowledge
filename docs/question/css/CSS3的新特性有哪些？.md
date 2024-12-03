# CSS3的新特性有哪些？

## 1.1 选择器

| 选择器                  | 例子                    | 例子描述                     |
| -------------------- | --------------------- | ------------------------ |
| element1~element2    | p~ul                  | 选择前面有 p 元素的每个 ul 元素。     |
| [attribute^=value]   | a[src^="https"]       | 选择其src属性值以"https"开头的每个元素 |
| [attribute$=value]   | a[src$=".pdf"]        | 选择其src属性以".pdf" 结尾的所有元素  |
| [attribute*=value]   | a[src*="abc"]         | 选择其src属性中包含"abc"子串的每个元素  |
| :first-of-type       | p:first-of-type       | 选择属于其父元素的第一个 p 元素        |
| :last-of-type        | p:last-of-type        | 选择属于其父元素的最后一个 p 元素       |
| :only-of-type        | p:only-of-type        | 选择属于其父元素唯一的一个 p 元素       |
| :only-child          | p:only-child          | 选择属于其父元素唯一的一个子元素         |
| :nth-child(n)        | p:nth-child(2)        | 选择属于其父元素的第二个子元素          |
| :nth-last-child(n)   | p:nth-last-child(2)   | 同上，从最后一个子元素开始计数          |
| :nth-of-type(n)      | p:nth-of-type(2)      | 选择属于其父元素第二个 p 元素         |
| :nth-last-of-type(n) | p:nth-last-of-type(2) | 同上，但是从最后一个子元素开始计数。       |
| :last-child          | p:last-child          | 选择属于其父元素最后一个 p 元素        |

## 1.2 新样式

### 1.2.1 边框新样式

css 3 新增了三个边框属性，分别是：
- border-radius：创建圆角边框
- box-shadow：为元素添加阴影
- border-image：使用图片来绘制边框

box-shadow 设置元素阴影，设置属性如下：
- 水平阴影
- 垂直阴影
- 模糊距离（虚实）
- 阴影尺寸（影子大小）
- 阴影颜色
- 内/外阴影

其中水平阴影和垂直阴影是必须设置的

### 1.2.2 背景

新增了几个关于背景的属性，分别是 `background-clip`、`background-origin`、`background-size` 和 `background-break`

#### 1.2.2.1 background-clip

用于确定背景画区，有以下几种可能的属性：

- background-clip: border-box; 背景从border开始显示
- background-clip: padding-box; 背景从padding开始显示
- background-clip: content-box; 背景显content区域开始显示
- background-clip: no-clip; 默认属性，等同于border-box

通常情况下，背景都是覆盖整个元素的，利用这个属性可以设定背景颜色或图片的覆盖范围

#### 1.2.2.2 background-size

background-size属性常用来调整背景图片的大小，主要用于设定图片本身。有以下可能的属性：

- background-size: contain; 缩小图片以适合元素（维持像素长宽比）
- background-size: cover; 扩展元素以填补元素（维持像素长宽比）
- background-size: 100px 100px; 缩小图片至指定的大小
- background-size: 50% 100%; 缩小图片至指定的大小，百分比是相对包 含元素的尺寸

#### 1.2.2.3 background-break

元素可以被分成几个独立的盒子（如使内联元素span跨越多行），`background-break` 属性用来控制背景怎样在这些不同的盒子中显示

- background-break: continuous; 默认值。忽略盒之间的距离（也就是像元素没有分成多个盒子，依然是一个整体一样）
- background-break: bounding-box; 把盒之间的距离计算在内；
- background-break: each-box; 为每个盒子单独重绘背景

#### 1.2.2.4 background-origin

当我们设置背景图片时，图片是会以左上角对齐，但是是以 `border` 的左上角对齐还是以 `padding` 的左上角或者 `content` 的左上角对齐? `border-origin` 正是用来设置这个的

- background-origin: border-box; 从border开始计算background-position
- background-origin: padding-box; 从padding开始计算background-position
- background-origin: content-box; 从content开始计算background-position

默认情况是 `padding-box`，即以 `padding` 的左上角为原点

## 1.3 文字

### 1.3.1 word-wrap

语法：`word-wrap:normal|break-word`

- normal：使用浏览器默认的换行
- break-all：允许在单词内换行

### 1.3.2 text-overflow

`text-overflow` 设置或检索当前行超出指定容器的边界时如何处理：

- clip：修剪文本
- ellipsis：显示省略符号来代表被修剪的文本

### 1.3.1 text-shadow

`text-shadow` 可向文本应用阴影。能够规定水平阴影、垂直阴影、模糊距离，以及阴影的颜色

### 1.3.4 text-decoration

CSS3里面开始支持对文字的更深层次的渲染，具体有三个属性可供设置：

- text-fill-color: 设置文字内部填充颜色
- text-stroke-color: 设置文字边界填充颜色
- text-stroke-width: 设置文字边界宽度

## 1.4 颜色

`css3` 新增了新的颜色表示方式 `rgba` 与 `hsla`

- rgba分为两部分，rgb为颜色值，a为透明度
- hala分为四部分，h为色相，s为饱和度，l为亮度，a为透明度
- 线性渐变（`linear-gradient`）和径向渐变（`radial-gradient`）

## 1.5 transform

`transform` 属性允许你旋转，缩放，倾斜或平移给定的元素

- transform: translate(120px, 50%)：位移
- transform: scale(2, 0.5)：缩放
- transform: rotate(0.5turn)：旋转
- transform: skew(30deg, 20deg)：倾斜

`transform-origin`：转换元素的位置（必须与 rotate 一起使用），默认值为 `(x,y,z):(50%,50%,0)`

## 1.6 transition

`transition` 属性可以被指定为一个或多个CSS属性的过渡效果，多个属性之间用逗号进行分隔，必须规定两项内容：过度效果持续时间

语法：CSS属性，花费时间，效果曲线(默认ease)，延迟时间(默认0)，也可以分开写各个属性：

```css
transition-property: width; 
transition-duration: 1s;
transition-timing-function: linear;
transition-delay: 2s;
```

## 1.7 animation

动画这个平常用的也很多，主要是做一个预设的动画。和一些页面交互的动画效果，结果和过渡应该一样，让页面不会那么生硬

animation也有很多的属性:

- animation-name：动画名称
- animation-duration：动画持续时间
- animation-timing-function：动画时间函数
- animation-delay：动画延迟时间
- animation-iteration-count：动画执行次数，可以设置为一个整数，也可以设置为infinite，意思是无限循环
- animation-direction：动画执行方向
- animation-paly-state：动画播放状态
- animation-fill-mode：动画填充模式

## 1.8 灵活的布局模式

- 弹性盒子（Flexbox）布局：提供了一种更有效的方式来布局、对齐和分配容器内项目的空间。
- 网格（Grid）布局：为二维布局提供了强大的系统，适用于页面布局和响应式设计。

## 1.9 多媒体查询（Media Queries）

- 使得样式可以根据设备的特征（如视口宽度、设备像素比等）来调整，是响应式设计的关键技术。

