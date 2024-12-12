# 项目难点亮点

## 1. 脚本加载失败怎么处理？

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>JS文件加载失败怎么重试</title>
	</head>
	<body>
		<script src="http://static.com/js/1.js"></script>
		<script src="http://static.com/js/2.js"></script>
		<script src="http://static.com/js/3.js"></script>
	</body>
</html>
```

页面上会引入很多的JS文件，在现在的工程化环境中，这些JS是自动加入的。

在生产环境中可能会出现一种问题，这些JS文件无法加载成功

![image-20241210110556019](http://cdn.mengyang.online/202412101106504.png)

当这种情况出现的时候，我们需要做的就是尽量不影响到用户，怎么做呢？加载不成功我们就尽量换几个域名进行加载重试。

具体需要解决这个问题就需要解决两个问题：

1. 什么时候重试？
2. 如何重试？



### 1.1 什么时候重试

script标签里面有一个事件是onerror事件，当加载失败的时候会触发这个事件：

```js
<script onerror="console.log(1)" src="http://static.com/js/1.js"></script>
		<script onerror="console.log(2)" src="http://static.com/js/2.js"></script>
		<script onerror="console.log(3)" src="http://static.com/js/3.js"></script>
```

![image-20241210111106524](http://cdn.mengyang.online/202412101111559.png)

但是我们不能直接这样写，因为在工程化的环境里面，这些JS是自动生成出来的。

所以最好的做法是在一个地方的单独处理这些文件，所以使用事件委托给窗口增加一个事件

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>JS文件加载失败怎么重试</title>
	</head>
	<body>
		<script onerror="console.log(1)" src="http://static.com/js/1.js"></script>
		<script onerror="console.log(2)" src="http://static.com/js/2.js"></script>
		<script onerror="console.log(3)" src="http://static.com/js/3.js"></script>
		<script>
			window.addEventListener('error',(e)=>{
				console.log('error');
			})
		</script>
	</body>
</html>
```

但是当我们尝试的时候会发现事件没有触发，这是因为注册事件是在下面，脚本加载失败之后才注册的事件，所以监听不到。

但是当注册事件放到前面的时候还是不能触发，这是因为error事件是不支持冒泡的，所以冒泡不到window上面去,所以我们需要使用事件模型中的捕获阶段获取错误

```js
window.addEventListener('error',(e)=>{
	console.log('error');
},true)
```



### 1.2 如何重试

首先需要准备域名：

```js
const domains=[
  'aaa.com',
  'bbb.com',
  'ccc.com'
]
```

错误的情况分为很多种，比如说`throw 1`,`<img src="aaa.com/1"/>`,所以我们需要把脚本加载错误的情况过滤出来

我们通过e的事件类型进行判断：

```js
const domains=[
  'aaa.com',
  'bbb.com',
  'ccc.com'
]
window.addEventListener('error',(e)=>{
  console.log('error');
  if(e instanceof ErrorEvent || e.target.tagName !== 'script'){
    return 
  }

},true)
```

接下来我们就需要把脚本和域名建立一个映射关系，比如说这个脚本已经匹配到了下标为1的域名，还是发生错误，这个时候我们就需要继续匹配下标为2的域名

1. 通过e.target.src获取到访问失败的src地址
2. 创建对象建立src地址和下标的对对应值
3. 如果遍历完域名数组还失败就不匹配了
4. 创建新的url地址
5. 创建script标签加入到失败的标签前面立即重试
6. 重试完下标增加
7. 删除失败的标签



```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>JS文件加载失败怎么重试</title>
  </head>
  <body>
    <script>
      const domains=[
        'aa2312312a.com',
        'bb3213213b.com',
        'cc2312312c.com'
      ]
      const retry={

      }
      window.addEventListener('error',(e)=>{
        console.log('error');
        if(e instanceof ErrorEvent || e.target.tagName !== 'SCRIPT'){
          return 
        }
        const url=new URL(e.target.src)
        const pathname=url.pathname

        if(!(pathname in retry)){
          retry[pathname]=0
        }
        const index=retry[pathname]
        if(index>=domains.length){
          return 
        }
        const newDomain=domains[index]
        url.host=newDomain
        const script=document.createElement('script')
        script.src=url.toString()
        // 加到同一个地方立即重试
        e.target.parentElement.insertBefore(script,e.target)
        retry[pathname]++
        e.target.remove()
      },true)
    </script>
    <script src="http://static.com/js/1.js"></script>
    <script src="http://static.com/js/2.js"></script>
    <script src="http://static.com/js/3.js"></script>
  </body>
</html>
```

如果需要按照脚本的顺序执行脚本的话需要改一下创建脚本的方式：

```js
window.addEventListener('error',(e)=>{
				console.log('error');
				if(e instanceof ErrorEvent || e.target.tagName !== 'SCRIPT'){
					return 
				}
				const url=new URL(e.target.src)
				const pathname=url.pathname

				if(!(pathname in retry)){
					retry[pathname]=0
				}
				const index=retry[pathname]
				if(index>=domains.length){
					return 
				}
				const newDomain=domains[index]
				url.host=newDomain
				document.write(`\<script src="${url.toString()}"><\/script>`)
				// const script=document.createElement('script')
				// script.src=url.toString()
				// // 加到同一个地方立即重试
				// e.target.parentElement.insertBefore(script,e.target)
				retry[pathname]++
				e.target.remove()
			},true)
```

