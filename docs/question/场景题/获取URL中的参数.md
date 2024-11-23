---
title: 获取URL中的参数
tags:
  - 场景题
  - 面试题
date: 2024-06-03
---

# 一 获取URL中的参数

这⾥主要还是正则表达式的设计
- /?&/igm，前⾯是？或者&，任意字符直到遇到=，使⽤⾮贪婪模式，等号后⾯是⾮&符号的任意字符，然后去匹配就好了
- 理论上可以⽤matchAll，然后⽤迭代器去处理

```JS
function name(url) {
	const _url = url || window.location.href;
	const _urlParams = _url.match(/[?&](.+?=[^&]+)/igm);
	return _urlParams ? _urlParams.reduce((a, b) => {
		const value = b.slice(1).split('=');
		a[value[0]] = value[1];
		return a;
	}, {}) : {}
}
```