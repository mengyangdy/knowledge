# ES6中的proxy用过吗？

## 1.1 介绍

定义：⽤于定义基本操作的⾃定义⾏为

本质：修改的是程序默认形为，就形同于在编程语⾔层⾯上做修改，属于元编程 (meta programming)

元编程（Metaprogramming，⼜译超编程，是指某类计算机程序的编写，这类计算机程序编写或者操纵其它程序（或者⾃⾝）作为它们的数据，或者在运⾏时完成部分本应在编译时完成的⼯作

⼀段代码来理解

```bash
#!/bin/bash
metaprogram
echo '#!/bin/bash' >program
for ((I=1; I<=1024; I++)) do
echo "echo $I" >>program
done
chmod +x program
```

这段程序每执⾏⼀次能帮我们⽣成⼀个名为 program 的⽂件，⽂件内容为1024⾏ echo，如果我们⼿动来写1024⾏代码，效率显然低效
- 元编程优点：与⼿⼯编写全部代码相⽐，程序员可以获得更⾼的⼯作效率，或者给与程序更⼤的灵活度去处理新的情形⽽⽆需重新编译

Proxy 亦是如此，⽤于创建⼀个对象的代理，从⽽实现基本操作的拦截和⾃定义（如属性查找、赋值、枚举、函数调⽤等）

## 1.2 ⽤法

Proxy 为 构造函数，⽤来⽣成 Proxy 实例

```JS
var proxy = new Proxy(target, handler)
```

### 1.2.1 参数
target 表⽰所要拦截的⽬标对象（任何类型的对象，包括原⽣数组，函数，甚⾄另⼀个代理））handler 通常以函数作为属性的对象，各属性中的函数分别定义了在执⾏各种操作时代理 p 的⾏为

### 1.2.2 handler解析
关于 handler 拦截属性，有如下：
- get(target,propKey,receiver)：拦截对象属性的读取
- set(target,propKey,value,receiver)：拦截对象属性的设置
- has(target,propKey)：拦截 propKey in proxy 的操作，返回⼀个布尔值
- deleteProperty(target,propKey)：拦截 delete proxy[propKey] 的操作，返回⼀个布尔值
- ownKeys(target)：拦截 Object.keys(proxy) 、 for...in 等循环，返回⼀个数组
- getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey) ，返回属性的描述对象
- defineProperty(target, propKey, propDesc)：拦截 Object.defineProperty(proxy,propKey, propDesc） ，返回⼀个布尔值
- preventExtensions(target)：拦截 Object.preventExtensions(proxy) ，返回⼀个布尔值
- getPrototypeOf(target)：拦截 Object.getPrototypeOf(proxy) ，返回⼀个对象
- isExtensible(target)：拦截 Object.isExtensible(proxy) ，返回⼀个布尔值
- setPrototypeOf(target, proto)：拦截 Object.setPrototypeOf(proxy, proto) ，返回⼀个布尔值
- apply(target, object, args)：拦截 Proxy 实例作为函数调⽤的操作
- construct(target, args)：拦截 Proxy 实例作为构造函数调⽤的操作

### 1.2.3 Reflect
若需要在 Proxy 内部调⽤对象的默认⾏为，建议使⽤ Reflect ，其是 ES6 中操作对象⽽提供的新 API

基本特点：
- 只要 Proxy 对象具有的代理⽅法， Reflect 对象全部具有，以静态⽅法的形式存在
- 修改某些 Object ⽅法的返回结果，让其变得更合理（定义不存在属性⾏为的时候不报错⽽是返回 false ）
- 让 Object 操作都变成函数⾏为

下⾯我们介绍 proxy ⼏种⽤法：

### 1.2.4 get()
get 接受三个参数，依次为⽬标对象、属性名和 proxy 实例本⾝，最后⼀个参数可选

```JS
var person = {
name: "张三"
};
var proxy = new Proxy(person, {
get: function(target, propKey) {
return Reflect.get(target,propKey)
}
});
proxy.name // "张三"
```

get 能够对数组增删改查进⾏拦截，下⾯是试下你数组读取负数的索引

```JS
function createArray(...elements) {
let handler = {
get(target, propKey, receiver) {
let index = Number(propKey);
if (index < 0) {
propKey = String(target.length + index);
}
return Reflect.get(target, propKey, receiver);
}
};
 let target = [];
 target.push(...elements);
 return new Proxy(target, handler);
 }
 let arr = createArray('a', 'b', 'c');
 arr[-1] // c
```

注意：如果⼀个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则会报错

```JS
const target = Object.defineProperties({}, {
foo: {
value: 123,
writable: false,
configurable: false
},
});
const handler = {
get(target, propKey) {
return 'abc';
}
}; 
const proxy = new Proxy(target, handler);
proxy.foo
// TypeError: Invariant check failed
```

### 1.2.5 set()
set ⽅法⽤来拦截某个属性的赋值操作，可以接受四个参数，依次为⽬标对象、属性名、属性值和Proxy 实例本⾝

假定 Person 对象有⼀个 age 属性，该属性应该是⼀个不⼤于 200 的整数，那么可以使⽤ Proxy保证 age 的属性值符合要求

```JS
let validator = {
set: function(obj, prop, value) {
if (prop === 'age') {
if (!Number.isInteger(value)) {
throw new TypeError('The age is not an integer');
}
if (value > 200) {
throw new RangeError('The age seems invalid');
}
}
// 对于满⾜条件的 age 属性以及其他属性，直接保存
obj[prop] = value;
}
};
let person = new Proxy({}, validator);
person.age = 100;
person.age // 100
person.age = 'young' // 报错
person.age = 300 // 报错
```

如果⽬标对象⾃⾝的某个属性，不可写且不可配置，那么 set ⽅法将不起作⽤

```JS
const obj = {};
Object.defineProperty(obj, 'foo', {
value: 'bar',
writable: false,
});
const handler = {
set: function(obj, prop, value, receiver) {
obj[prop] = 'baz';
}
};
const proxy = new Proxy(obj, handler);
proxy.foo = 'baz';
proxy.foo // "bar"
```

注意，严格模式下， set 代理如果没有返回 true ，就会报错

```JS
'use strict';
const handler = {
set: function(obj, prop, value, receiver) {
obj[prop] = receiver;
// ⽆论有没有下⾯这⼀⾏，都会报错
return false;
}
};
const proxy = new Proxy({}, handler);
proxy.foo = 'bar';
// TypeError: 'set' on proxy: trap returned falsish for property 'foo'
```

### 1.2.6 deleteProperty()
deleteProperty ⽅法⽤于拦截 delete 操作，如果这个⽅法抛出错误或者返回 false ，当前属性就⽆法被 delete 命令删除

```JS
var handler = {
deleteProperty (target, key) {
invariant(key, 'delete');
Reflect.deleteProperty(target,key)
return true;
}
};
function invariant (key, action) {
if (key[0] === '_') {
 throw new Error(
 ⽆法删除私有属性
 );
 }
 }
 var target = { _prop: 'foo' };
 var proxy = new Proxy(target, handler);
 delete proxy._prop
 // Error: ⽆法删除私有属性
```

注意，⽬标对象⾃⾝的不可配置（configurable）的属性，不能被 deleteProperty ⽅法删除，否则报错

### 1.2.7 取消代理

```JS
Proxy.revocable(target, handler);
```

## 1.3 使⽤场景

Proxy 其功能⾮常类似于设计模式中的代理模式，常⽤功能如下：
- 拦截和监视外部对对象的访问
- 降低函数或类的复杂度
- 在复杂操作前对操作进⾏校验或对所需资源进⾏管理

使⽤ Proxy 保障数据类型的准确性

```JS
let numericDataStore = { count: 0, amount: 1234, total: 14 };
numericDataStore = new Proxy(numericDataStore, {
set(target, key, value, proxy) {
if (typeof value !== 'number') {
throw Error("属性只能是number类型");
}
return Reflect.set(target, key, value, proxy);
}
});
numericDataStore.count = "foo"
// Error: 属性只能是number类型
numericDataStore.count = 333
// 赋值成功
```

声明了⼀个私有的 apiKey ，便于 api 这个对象内部的⽅法调⽤，但不希望从外部也能够访问api._apiKey

```JS
let api = {
 _apiKey: '123abc456def',
 getUsers: function(){ },
 getUser: function(userId){ },
 setUser: function(userId, config){ }
 };
 const RESTRICTED = ['_apiKey'];
 api = new Proxy(api, {
 get(target, key, proxy) {
 if(RESTRICTED.indexOf(key) > -1) {
 throw Error(
 ${key} 不可访问.
 );
 } return Reflect.get(target, key, proxy);
 },
 set(target, key, value, proxy) {
 if(RESTRICTED.indexOf(key) > -1) {
 throw Error(
 ${key} 不可修改
 );
 } return Reflect.get(target, key, value, proxy);
 }
 });
 console.log(api._apiKey)
 api._apiKey = '987654321'
 // 上述都抛出错误
```

还能通过使⽤ Proxy 实现观察者模式

观察者模式（Observer mode）指的是函数⾃动观察数据对象，⼀旦对象有变化，函数就会⾃动执⾏observable 函数返回⼀个原始对象的 Proxy 代理，拦截赋值操作，触发充当观察者的各个函数

```JS
 const queuedObservers = new Set();
 const observe = fn => queuedObservers.add(fn);
 const observable = obj => new Proxy(obj, {set});
 function set(target, key, value, receiver) {
 const result = Reflect.set(target, key, value, receiver);
 queuedObservers.forEach(observer => observer());
 return result;
 }
```

观察者函数都放进 Set 集合，当修改 obj 的值，在会 set 函数中拦截，⾃动执⾏ Set 所有的观察者