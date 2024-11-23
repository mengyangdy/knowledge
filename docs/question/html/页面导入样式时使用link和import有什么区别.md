# 页面导入样式时使用link和import有什么区别

1. 从属关系
   1. @import是css提供的语法规则，只有导入样式表的作用，而link是html提供的标签，不仅可以加载css文件还可以定义RSS和rel等连接属性
2. 加载顺序区别
   1. 加载页面时，link标签引入的css被同时加载，@import引入的css将在页面加载完毕后被加载
3. 兼容性问题
   1. @import是css2.1才有的语法，只有在IE5+才能识别，link标签作为html元素，不存在兼容性问题
4. DOM可控性区别
   1. 可以通过JS操作DOM，插入link标签来改变样式，由于DOM方法是基于文档的，无法使用@import的方式插入样式
5. 权重区别
   1. link引入的样式权重大于@import引入的样式