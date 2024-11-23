# css如何画一个三角形?

> 在前端开发的时候，我们有时候会需要⽤到⼀个三⻆形的形状，⽐如地址选择或者播放器⾥⾯播放按钮

> 通常情况下，我们会使⽤图⽚或者 svg 去完成三⻆形效果图，但如果单纯使⽤ css 如何完成⼀个三⻆形呢？实现过程似乎也并不困难，通过边框就可完成

## 1.1实现过程

在以前也讲过盒⼦模型，默认情况下是⼀个矩形，实现也很简单

```html
<style>
      .border {
        width: 50px;
        height: 50px;
        border: 2px solid;
        border-color: #96ceb4 #ffeead #d9534f #ffad60;
      }
    </style>
    <div class="border"></div>
```

效果图如下:

![pkt7g8P.png](https://s21.ax1x.com/2024/06/08/pkt7g8P.png)

将 border 设置 50px ，效果图如下所⽰：

![pkt7Rv8.png](https://s21.ax1x.com/2024/06/08/pkt7Rv8.png)

⽩⾊区域则为 width、height，这时候只需要你将⽩⾊区域部分宽⾼逐渐变⼩，最终变为0，则变成如下图所⽰：

![pkt7IEj.png](https://s21.ax1x.com/2024/06/08/pkt7IEj.png)

这时候就已经能够看到4个不同颜⾊的三⻆形，如果需要下⽅三⻆形，只需要将上、左、右边框设置为0就可以得到下⽅的红⾊三⻆形

![pkt7oUs.png](https://s21.ax1x.com/2024/06/08/pkt7oUs.png)

但这种⽅式，虽然视觉上是实现了三⻆形，但实际上，隐藏的部分任然占据部分⾼度，需要将上⽅的宽度去掉

最终实现代码如下：

```css
.border {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 50px 50px;
        border-color: transparent transparent #d9534f;
      }
```

如果想要实现⼀个只有边框是空⼼的三⻆形，由于这⾥不能再使⽤ border 属性，所以最直接的⽅法是利⽤伪类新建⼀个⼩⼀点的三⻆形定位上去

```css
.border {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 50px 50px;
        border-color: transparent transparent #d9534f;
        position: relative;
      }
      .border:after {
        content: '';
        border-style: solid;
        border-width: 0 40px 40px;
        border-color: transparent transparent #96ceb4;
        position: absolute;
        top: 0;
        left: 0;
      }
```

效果图如下所示:

![pkt7b80.png](https://s21.ax1x.com/2024/06/08/pkt7b80.png)

伪类元素定位参照对象的内容区域宽⾼都为0，则内容区域即可以理解成中⼼⼀点，所以伪元素相对中⼼这点定位

将元素定位进⾏微调以及改变颜⾊，就能够完成下⽅效果图：

![pkt7q2V.png](https://s21.ax1x.com/2024/06/08/pkt7q2V.png)

最终代码如下:

```css
.border:after {
        content: '';
        border-style: solid;
        border-width: 0 40px 40px;
        border-color: transparent transparent #96ceb4;
        position: absolute;
        top: 6px;
        left: -40px;
      }
```

## 1.2 原理分析

可以看到，边框是实现三⻆形的部分，边框实际上并不是⼀个直线，如果我们将四条边设置不同的颜⾊，将边框逐渐放⼤，可以得到每条边框都是⼀个梯形

![1](https://f.pz.al/pzal/2024/06/08/917d7def4b4e6.png)

当分别取消边框的时候，发现下⾯⼏种情况：
- 取消⼀条边的时候，与这条边相邻的两条边的接触部分会变成直的
- 当仅有邻边时， 两个边会变成对分的三⻆
- 当保留边没有其他接触时，极限情况所有东西都会消失

![1](https://f.pz.al/pzal/2024/06/08/1a57f45a98d0d.png)

通过上图的变化规则，利⽤旋转、隐藏，以及设置内容宽⾼等属性，就能够实现其他类型的三⻆形

如设置直⻆三⻆形，如上图倒数第三⾏实现过程，我们就能知道整个实现原理

实现代码如下：

```css
.box {
      width: 0;
      height: 0;
      border-top: #4285f4 solid;
      border-right: red solid;
      border-width: 60px;
    }
```

