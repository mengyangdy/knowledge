

# IFC和FFC和GFC是什么

## 1. IFC-内联格式化上下文

IFC-(inline formatting context)的规则：

- 在一个行内格式化上下文中，盒是一个接一个水平放置
- 盒可能是以不同的方式竖直对齐以他们的底部或者顶部对齐，或者以他们里面的文本的基线对齐
- 行内块元素之间默认有间隙
- 矩形区域包含着来自一行的盒子叫做line box，它的宽度由浮动情况和他的包含块决定，高度由line-height决定



IFC的应用场景

- 元素水平居中：通过设置IFC和text-align
- 多个文本水平垂直居中：设置text-align和vertical-align：middle



## 2. FFC-Flexible Formatting Context(弹性格式化上下文)

使用了flex布局（CSS3）实际上就是声明创建了FFC。[display属性](https://so.csdn.net/so/search?q=display属性&spm=1001.2101.3001.7020)为flex或inline-flex的时候

## 3. GFC-Grids Formatting Context(网格格式化上下文)

使用了grid布局（CSS3）实际上就是声明创建了GFC。display属性为grid或inline-grid的时候