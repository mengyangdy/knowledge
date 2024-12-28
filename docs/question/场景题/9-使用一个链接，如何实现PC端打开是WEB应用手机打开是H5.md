# 9.同一个链接，PC端打开是Web应用，手机打开是一个h5应用？

## 1. 背景

为了省钱，省服务器，一个链接访问页面，想同时适配PC端和移动端

## 2. 方案

- 如何区分PC还是移动端
	- 先识别端
	- 端内容渲染器

### 2.1 识别端

在js中识别当前设备，需要使用userAgent
```js
console.log(navidator.userAgent)
// 正则判断
function isMobile(){
	return /Mobi|Android/i.test(navigator.userAgent)
}
if(isMobile()){
	// 比如说在Vue中，通过provide中透传是否是手机端这个值，后代组件中根据不同的值显示不同的组件
	// 或者是加载不同的css
}
```

### 2.2 响应式来做页面

媒体查询、flex