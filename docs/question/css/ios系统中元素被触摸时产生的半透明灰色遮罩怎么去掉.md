# ios系统中元素被触摸时产生的半透明灰色遮罩怎么去掉

```css
<style>
	a,button,input,textarea{
		-webkit-tap-highlight-color: rgba(0,0,0,0);
	}
</style>
```