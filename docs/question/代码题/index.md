# 代码运行题

## 1. 运算题

```js
console.log([]+![]);
'false'
```

**知识点**：

1. 对象转原始类型,需要从以下三种方式取原始值值，如果取不到原始值就报错：

```js
const obj={
  // 第一步
  [Symbol.toPrimitive]:function(){
    return 'abc'
  },
  // 第二步
  valueOf:function(){
    return 'abcd'
  },
  // 第三步
  toString:function(){
    return 'abcde'
    return {}
  }
}
console.log(obj+1);
```

**解析**：

**[]+[]输出什么？**

1. 数组是对象也就是对象转原始类型
2. `[][Symbol.toPrimitive]`是undefined，所以说明数组是没有`Symbol.toPrimitive`这个属性的
3. `[].valueOf()`是`[]`得到的还不是原始类型，所以继续查找
4. `[].toString()`是`''`这样就获取到原始类型了，为什么是空字符串呢？是因为数组里面的toString会把数组里面的东西给罗列出来，当没有东西的时候就是空字符串
   1. `[1,2,3].toString()`得到的结果是`'1,2,3'`
5. 所以两端都转化为空字符串，拼接下就是`''`



**[]+![]输出的是什么？**

1. 左边是对象转原始会转化成一个字符串`''`
2. 但是右边是一个表达式，是一个取反的表达式，取反的表达式是不涉及到对象转原始的，涉及到的是布尔判定：例如if函数、三目运算、while循环
3. 布尔评定中null/undefined/0/NaN/''这5中被评定为false，其他的所有情况都是true，所以`![]`的意思就是`!true`取反，所以是`false`
4. 所以结果是`'false'`



**{}+[]输出的是什么？**

1. 因为JS本身的语法特性，{}既可以表示一个代码块，也可以表示一个空对象
2. {}+[]这段代码中就是把{}解释成了一个代码块，那么{}+[]也就是一个运算是需要分开来解析的
3. 以{}开发的会被解析成一个语法块，+为一个运算符而不是加号，[]转化为原始类型是一个`''`所以结果是+''是`0`



**({}+[])输出的是什么？**

1. 因为用小括号包裹起来，它整体是一个语法块，所以里面的{}就参加运算
2. 也就是{}.toString()+[].toString():'[object Object]'+''
3. 所以结果是`'[object Object]'`



**[]+{}输出的是什么？**

1. 这个同上：[].toString()+{}.toString():''+'[object Object]'
2. 所以结果是`'[object Object]'`



**{}+{}输出的是什么？**

1. 因为{}是在前面的，所以第一个{}是一个语法块，也就是只计算+{}.toString()
2. 所以结果是`+'[object Object]'`:`NaN`



### 1.1 对象作为对象的key

```js
var a = {}
var b = {
	key:'a'
}
var c = {
	key:'c'
}

a[b] = '123';
a[c] = '456';

console.log( a[b] ); // 456
```

当对象作为一个对象的key的时候会调用对象的toString方法然后作为key，所以多个对象的key都是一样的字符串`'[oobject Object]'`，所以此题的输出是`456`



## 2. 作用域题

**第一题：**

```js
function c(){
	var b = 1;
	function a(){
		console.log( b );
		var b = 2;
		console.log( b );
	}
	a();
	console.log( b );
}
c();
```

此题的输出是：`undefined 2 1`

**第二题**

```js
var name = 'a';
(function(){
	if( typeof name == 'undefined' ){
		var name = 'b';
		console.log('111'+name);
	}else{
		console.log('222'+name);
	}
})()
```

结果为：`111b`



**第三题**

```js
function fun( a ){
	var a = 10;
	function a(){}
	console.log( a );
}
fun( 100 );
```

此题输出的是`10`



## 3. 原型+this题

### 3.1 原型的this问题

```js
function Foo(){
	getName = function(){console.log(1)} //注意是全局的window.
	return this;
}

Foo.getName = function(){console.log(2)}
Foo.prototype.getName = function(){console.log(3)}
var getName = function(){console.log(4)}
function getName(){
	console.log(5)
}

Foo.getName();    //2
getName(); 		  //4
Foo().getName();  //1
getName();		  //1
new Foo().getName();//3
```

**结果解析：**

1. 首先定义了一个Foo的函数，因为函数也是一个对象上面是可以有属性的，所以给这个函数上添加一个属性为getName是一个函数打印2
2. 因为函数也是一个对象所以给函数的原型对象上添加一个属性getName是一个函数打印3
3. 然后定义了一个全局函数getName但是又被var定义的getName改变成了新的函数
4. 然后开始执行：
5. 调用这个函数对象上的getName属性打印`2`
6. 调用var定义的函数打印`4`
7. 函数执行首先修改getName的值，函数中没有就往全局作用域中找，所以var定义的getName就被修改为了`打印1`，然后返回this调用this上的getName方法，这个时候this是window，也就是var定义的getName，所以`打印1`
8. 然后在执行全局的getName，由于在函数内部已经修改了全局上的getName所以`打印1`
9. now Foo之后返回的新对象上面是没有getName这个属性的，所以通过`__proto__`找到了`Foo.prototype`上面，所以`打印3`



### 3.2 this指向问题

```js
var o = {
  a:10,
  b:{
    a:2,
    fn:function(){
      console.log( this.a ); // 2
      console.log( this );   //代表b对象
    }
  }
}
o.b.fn();
```

结果为`2 b对象本身`



### 3.3 this指向问题

```js
window.name = 'ByteDance';
function A(){
	this.name = 123;
}
A.prototype.getA = function(){
	console.log( this );
	return this.name + 1;
}
let a = new A();
let funcA = a.getA;
funcA();  //this代表window
```

结果为`window ByteDance1`



### 3.4 this指向问题

```js
var length = 10;
function fn(){
  return this.length + 1;
}
var obj = {
  length:5,
  test1:function(){
    return fn();
  }
}
obj.test2 = fn;
console.log( obj.test1() ); 							//11
console.log( fn()===obj.test2() ); 				//false
console.log( obj.test1() == obj.test2() ); //false
```

结果为`11 false false`



## 4. 事件循环题

### 4.1 代码执行顺序解释

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

**结果解析：**

1. 先定义两个方法 async1和async2,然后执行了script start
2. 然后遇到setTimeout将console.log('setTimeOut');放入宏任务队列
3. 然后执行async1输出async1 start，因为用了await 同步执行代码 执行async2
4. 输出async2，然后因为函数async执行微任务放入队列asnyc1 end
5. promise中的第一个参数函数是同步执行的 所以执行promise1
6. 然后执行reslove将then中代码放入微任务队列
7. 然后执行script end
8. 然后微任务队列执行输出async1 end promise2
9. 宏任务队列执行输出setTimeOut



## 9. 其他题

### 合并对象

```js
// JS中用你知道的方法合并下列对象，尽量写多个答案
const a={a:1,b:4}
const b={b:2,c:3}
```



#### 1. Object.assign()

```js
const merged = Object.assign({}, a, b);
// { a: 1, b: 2, c: 3 }
```

#### 2. 展开运算符

```js
const merged = { ...a, ...b };
// { a: 1, b: 2, c: 3 }
```

#### 3. 使用for...in循环

```js
const merged = {};
for (const key in a) {
  merged[key] = a[key];
}
for (const key in b) {
  merged[key] = b[key];
}
// { a: 1, b: 2, c: 3 }
```

### 4. 使用Object.keys

```js
const merged = {};
Object.keys(a).forEach(key => {
  merged[key] = a[key];
});
Object.keys(b).forEach(key => {
  merged[key] = b[key];
});
// { a: 1, b: 2, c: 3 }
```

#### 5. 使用递归局晒

```js
function mergeObjects(obj1, obj2) {
  const result = {};
  for (const key in obj1) {
    result[key] = obj1[key];
  }
  for (const key in obj2) {
    if (result.hasOwnProperty(key)) {
      if (typeof result[key] === 'object' && typeof obj2[key] === 'object') {
        result[key] = mergeObjects(result[key], obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    } else {
      result[key] = obj2[key];
    }
  }
  return result;
}

const merged = mergeObjects(a, b);
// { a: 1, b: 2, c: 3 }
```

#### 6. reduce方法

```js
const merged = Object.keys({ ...a, ...b }).reduce((acc, key) => {
  acc[key] = (a.hasOwnProperty(key) ? a : b)[key];
  return acc;
}, {});
// { a: 1, b: 2, c: 3 }
```

