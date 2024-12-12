

# 一 什么是1px问题？如何在前端开发中解决它?

在移动端的设计稿中，往往UI给的设计稿宽度为750px，图中设计的边框宽度为1px，在我们375px的设备下，我们应该将宽度写为0.5px

但是如果直接设置0.5的话，一些设备（特别是旧的移动设备和浏览器）并且不支持0.5px，这个就是我们常说的1px问题以及如何画出0.5px边框的问题

那么这种问题应该如何去处理呢？目前常见的方案有两种：

- 方案一：viewport + rem + div
- 方案二：伪类+ transform

![](http://cdn.mengyang.online/202412091706574.png)

```css
.border{
  position:relative;
  padding:10px;
  margin:20px;
  display:inline-block;
}
.border::before{
  content:'';
  position:absoolute;
  left:0;
  top:0;
  width:200%;
  height:200%;
  border:1px soli red;
  transform-origin:0 0;
  transform:scale(0.5);
}
```
