# 代码执行顺序解释

```js
async function async1() {
	console.log('async1 start');
	await async2();
	console.log('asnyc1 end');
}
async function async2() {
	console.log('async2');
}
console.log('script start');
setTimeout(() => {
	console.log('setTimeOut');
}, 0);
async1();
new Promise(function (reslove) {
	console.log('promise1');
	reslove();
}).then(function () {
	console.log('promise2');
})
console.log('script end');
```

1. 先定义两个方法 async1和async2,然后执行了script start
2. 然后遇到setTimeout将console.log('setTimeOut');放入宏任务队列
3. 然后执行async1输出async1 start，因为用了await 同步执行代码 执行async2
4. 输出async2，然后因为函数async执行微任务放入队列asnyc1 end
5. promise中的第一个参数函数是同步执行的 所以执行promise1
6. 然后执行reslove将then中代码放入微任务队列
7. 然后执行script end
8. 然后微任务队列执行输出async1 end promise2
9. 宏任务队列执行输出setTimeOut