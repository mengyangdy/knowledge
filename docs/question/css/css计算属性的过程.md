# CSS属性计算过程

你是否了解过CSS的属性计算过程呢？

有的同学可能会讲，CSS属性我倒是知道，例如：

```css
p{
	color:red;
}
```

上面的CSS代码中，p是元素选择器，color就是其中的一个CSS属性。

但是要说CSS属性的计算过程，还真的不是很清楚。

没关系，通过此篇文章，能够让你彻底明白什么是CSS属性的计算流程。

---

首先不知道你有没有考虑过这样的一个问题，假设在HTML中有这么一段代码：

```html
<body>
  <h1>这是一个h1标题</h1>
</body>
```

上面的代码页非常简单，就是在body中有一个h1标题而已，该h1标题呈现出来的外观如下所示：

![](http://cdn.mengyang.online/202411231447260.png)

目前我们没有设置h1的任何样式，但是却能看到该h1有一定的默认样式，例如有默认的字体大小、默认的颜色。

那么问题来了，我们这个h1元素上面除了有默认字体大小、默认颜色等属性之外，究竟还有那些属性呢？

答案是**该元素上面会有CSS所有的属性**。你可以打开浏览器的开发面板，选择「元素」切换到「计算样式」，之后勾选「全部显示」，此时你就能看到在此h1上面所有css属性对应的值。

![](http://cdn.mengyang.online/202411231448587.png)

换句话说，我们所书写的任何一个HTML元素，实际上都有一套完整的CSS样式，这一点往往是让初学者比较意外的，因为我们平时在书写CSS样式时，往往只会书写必要的部分，例如前面的：

```html
p{
	color:red;
}
```

这往往会给我们造成一种错觉，认为p元素上面就只有color属性，而真是的情况是任何一个HTML元素都有一套完整的CSS样式，只不过你没有书写的样式，大概率会使用其默认值，例如上图中h1一个样式都没有设置，全部都用的默认值。

但是注意，我这里强调的是「大概率可能」，难道还有我们没有设置默认值就不使用默认值的情况吗？

确实是有的，所以我才强调你要了解CSS属性的计算过程。

总的来说，属性值的计算过程，分为如下的这么4个步骤：

- 确定声明值
- 层叠冲突
- 使用继承
- 使用默认值

## 确定声明值

首先第一步是确定声明值，所谓声明值就是作者自己所书写的CSS样式，例如前面的：

```css
p{
  color : red;
}
```

这里我们声明了p元素为红色，那么就会应用此属性设置。

当然，除了作者样式表，一般浏览器还会存在「用户代理样式表」，简单来说就是浏览器内置了一套样式表。

![](http://cdn.mengyang.online/202411231448050.png)

在上面的实例中，作者样式表中设置了color属性，而用户代理表中设置了诸如display、margin-block-start、margin-block-end、margin-inline-start、margin-inline-end等属性对应的值。

这些值目前来讲什么也没有冲突，因此最终就会应用这些属性值。

## 层叠冲突

在确定声明值时，会出现一种情况，那就是声明的样式规则发生了冲突。

此时会进入解决层叠冲突的流程，而这一步又可以细分为下面这三个步骤：

- 比较源的重要性
- 比较优先级
- 比较次序

我们一步步的来看。

### 比较源的重要性

当不同的CSS样式来源拥有相同的声明时，此时就会根据样式表来源的重要性来确定应用那一条样式规则

那么问题来了，咱们的样式表的源究竟有几种呢？

整体来讲有三种来源：

- 浏览器会有一个基本的样式表来给任何网页设置默认样式，这些样式统称用户代理样式
- 网页的作者可以定义文档的样式，这是最常见的样式表，称之为页面作者样式。
- 浏览器的用户，可以使用自定义样式表定制使用体验，称之为用户样式表。

对应的重要性顺序依次为：页面作者样式>用户样式>用户代理样式

更详细的来源重要性比较，可以参阅MDN[*https://developer.mozilla.org/zh-CN/docs/Web/CSS/Cascade*](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Cascade)

我们来看一个示例：

例如现在有页面作者样式表和用户代理样式表中存在属性的冲突，那么会以作者样式表优先。

```css
p{
  color : red;
  display: inline-block;
}
```

![](http://cdn.mengyang.online/202411231448282.png)

可以明显的看到，作者样式表和用户代理样式表中同时存在display属性的设置，最终作者样式表干掉了用户代理样式表中冲突的属性，这就是第一步，根据不同源的重要性来决定应用哪一个源的样式。

### 比较优先级

那么接下来，如果是在同一个源中有样式声明冲突怎么办？此时就会进行样式声明的优先级比较。

例如：

```css
<div class="test">
  <h1>test</h1>
</div>
```

```css
.test h1{
  font-size: 50px;
}

h1 {
  font-size: 20px;
}
```

在上面的代码中，同属于页面作者样式，源的重要性是相同的，此时会以选择器的权重来比较重要性。

很明显，上面的选择器的权重大于下面的选择器，因此最终标题呈现为50%。

![](http://cdn.mengyang.online/202411231449082.png)

可以看到，败落的坐着样式在Element>Style中会被划掉

有关选择器权重的计算方式，不清楚的同学可以看[https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)

### 比较次序

经历了上面两个步骤，大多数的样式声明能够被确定下来，但是还剩下最后一种情况，那就是样式声明即是同源权重也相同。

此时就会进入第三个阶段，比较样式声明的次序。

举个例子：

```css
h1 {
  font-size: 50px;
}

h1 {
  font-size: 20px;
}
```

在上面的代码中，同样都是页面作者样式，选择器的权重也相同，此时位于下面的样式声明会层叠掉上面那一条样式声明，最终会应用20px这一条属性值。

![](http://cdn.mengyang.online/202411231449977.png)

至此，样式声明中存在冲突的所有情况，就全部被解决了。

## 使用继承

层叠冲突这一步完成后，解决了相同元素被声明了多条样式规则究竟应用那一条样式规则的问题。

那么如果没有声明的属性呢？此时就使用默认值？

别急，此时还有第三个步骤，那就是使用继承而来的值。

例如：

```css
<div>
  <p>Lorem ipsum dolor sit amet.</p>
</div>
div {
  color: red;
}
```

在上面的代码中，我们针对div设置了color属性值为红色，而针对p元素我们没有声明任何的属性，但是由于color是可以继承的，因此p元素从最近的div身上继承到了color属性的值。

![](http://cdn.mengyang.online/202411231449592.png)

这里有两个点需要注意一下

首先第一个我强调的是最近的div元素，看下面的例子：

```css
<div class="test">
  <div>
    <p>Lorem ipsum dolor sit amet.</p>
  </div>
</div>

div {
  color: red;
}
.test{
  color: blue;
}
```

![](http://cdn.mengyang.online/202411231449848.png)

因为这里并不涉及到选中p元素声明color值，而是从父元素上面继承到color对应的值，因此这里是谁近就听谁的，初学者往往会产生混淆，又去比较权重，但是这里根本不会涉及到权重比较，因为压根就没有选中到p元素。

第二个就是那些属性能够继承？

关于这一点，大家可以在MDN上面轻松的查询到，例如我们以text-align为例：

![](http://cdn.mengyang.online/202411231449809.png)

## 使用默认值

目前走到了这一步，如果属性值都还不能确定下来，那么就只能使用默认值了

如下图所示：

![](http://cdn.mengyang.online/202411231450081.png)

前面我们也说过，一个HTML元素要在浏览器中渲染出来必须具备所有的CSS属性值，但是大部分我们是不会去设置的，用户代理样式表里面也不会去设置，也无法从继承拿到，因此最终都是用默认值。

## 一道面试题

下面代码中，最终渲染出来的效果a是什么颜色？p又是什么颜色？

```css
<div>
  <a href="">test</a>
  <p>test</p>
</div>
div {
  color: red;
}
```

![](http://cdn.mengyang.online/202411231450865.png)

原因很简单，因为a元素在用户代理样式表中已经设置了color属性对应的值，因此会应用此声明值，而在p元素中无论是作者样式表还是用户代理样式表，都没有对此属性进行声明，然而由于color属性是可以继承的，因此最终p元素的color属性值通过继承来自于父元素。