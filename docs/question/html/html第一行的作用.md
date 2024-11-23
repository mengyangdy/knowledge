# html第一行的作用是什么?

html的第一行是`<!DOCTYPE html>`,DOCTYOE 是用来声明文档类型,他的目的是告诉浏览器应该以什么样（html或xhtml）的文档类型定义来解析网页，这一声明对于确保网页在不同浏览器中的正确显示和行为具有至关重要的作用。

如果没有DOCTYPE浏览器可能就不会按照W3C的标准来严格的执行代码，页面可能不会按照我们开发者的预期进行渲染。

```html
<!-- HTML5 -->
<!DOCTYPE html>

<!-- HTML 4.01 Strict -->
<!-- 该 DTD 包含所有 HTML 元素和属性，但不包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets） -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">

<!-- HTML 4.01 Transitional -->
<!-- 该 DTD 包含所有 HTML 元素和属性，包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）-->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" 
"http://www.w3.org/TR/html4/loose.dtd">

<!-- HTML 4.01 Frameset -->
<!-- 该 DTD 等同于 HTML 4.01 Transitional，且允许框架集内容 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" 
"http://www.w3.org/TR/html4/frameset.dtd">
```