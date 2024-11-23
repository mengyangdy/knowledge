# 怎么理解Set和Map两种数据结构?

如果要⽤⼀句来描述，我们可以说

> Set 是⼀种叫做集合的数据结构，Map 是⼀种叫做字典的数据结构

什么是集合？什么⼜是字典？
- 集合
	- 是由⼀堆⽆序的、相关联的，且不重复的内存结构【数学中称为元素】组成的组合
- 字典
	- 是⼀些元素的集合。每个元素有⼀个称作key 的域，不同元素的key 各不相同
- 区别？
	- 共同点：集合、字典都可以存储不重复的值
	- 不同点：集合是以[值，值]的形式存储元素，字典是以[键，值]的形式存储

## 1.1 Set
Set 是 es6 新增的数据结构，类似于数组，但是成员的值都是唯⼀的，没有重复的值，我们⼀般称为集合

Set 本⾝是⼀个构造函数，⽤来⽣成 Set 数据结构

```JS
const s = new Set();
```

### 1.1.1 增删改查

Set 的实例关于增删改查的⽅法：
- add()
- delete()
- has()
- clear()

### 1.1.2 add()

添加某个值，返回 Set 结构本⾝

当添加实例中已经存在的元素， set 不会进⾏处理添加

```JS
s.add(1).add(2).add(2); // 2只被添加了⼀次
```

### 1.1.3 delete()

删除某个值，返回⼀个布尔值，表⽰删除是否成功

```JS
s.delete(1)
```

### 1.1.4 has()

返回⼀个布尔值，判断该值是否为 Set 的成员

```JS
s.has(2)
```

### 1.1.5 clear()

清除所有成员，没有返回值

```JS
s.clear()
```

### 1.1.6 遍历

Set 实例遍历的⽅法有如下：

关于遍历的⽅法，有如下：
- keys()：返回键名的遍历器
- values()：返回键值的遍历器
- entries()：返回键值对的遍历器
- forEach()：使⽤回调函数遍历每个成员

Set 的遍历顺序就是插⼊顺序

keys ⽅法、 values ⽅法、 entries ⽅法返回的都是遍历器对象

```JS
let set = new Set(['red', 'green', 'blue']);
for (let item of set.keys()) {
console.log(item);
}
// red
// green
// blue
for (let item of set.values()) {
console.log(item);
}
// red
// green
// blue
for (let item of set.entries()) {
console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

forEach() ⽤于对每个成员执⾏某种操作，没有返回值，键值、键名都相等，同样的 forEach ⽅法有第⼆个参数，⽤于绑定处理函数的 this

```JS
let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9
```

扩展运算符和 Set 结构相结合实现数组或字符串去重

```JS
// 数组
let arr = [3, 5, 2, 2, 5, 5];
let unique = [...new Set(arr)]; // [3, 5, 2]
// 字符串
let str = "352255";
let unique = [...new Set(str)].join(""); // "352"
```

实现并集、交集、和差集

```JS
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);
// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}
// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}
// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

## 1.2 Map

Map 类型是键值对的有序列表，⽽键和值都可以是任意类型

Map 本⾝是⼀个构造函数，⽤来⽣成 Map 数据结构

```JS
const m = new Map()
```

### 1.2.1 增删改查

Map 结构的实例针对增删改查有以下属性和操作⽅法：
- size 属性
- set()
- get()
- has()
- delete()
- clear()

### 1.2.2 size

size 属性返回 Map 结构的成员总数。

```js
const map = new Map();
map.set('foo', true);
map.set('bar', false);
map.size // 2
```

### 1.2.3 set()
设置键名 key 对应的键值为 value ，然后返回整个 Map 结构

如果 key 已经有值，则键值会被更新，否则就新⽣成该键

同时返回的是当前 Map 对象，可采⽤链式写法

```js
const m = new Map();
m.set('edition', 6) // 键是字符串
m.set(262, 'standard') // 键是数值
m.set(undefined, 'nah') // 键是 undefined
m.set(1, 'a').set(2, 'b').set(3, 'c') // 链式操作
```

### 1.2.4 get()

get ⽅法读取 key 对应的键值，如果找不到 key ，返回 undefined

```js
const m = new Map();
const hello = function() {console.log('hello');};
m.set(hello, 'Hello ES6!') // 键是函数
m.get(hello) // Hello ES6!
```

### 1.2.5 has()

has ⽅法返回⼀个布尔值，表⽰某个键是否在当前 Map 对象之中

```js
const m = new Map();
m.set('edition', 6);
m.set(262, 'standard');
m.set(undefined, 'nah');
m.has('edition') // true
m.has('years') // false
m.has(262) // true
m.has(undefined) // true
```

### 1.2.6 delete()

delete ⽅法删除某个键，返回 true 。如果删除失败，返回 false

```js
const m = new Map();
m.set(undefined, 'nah');
m.has(undefined) // true
m.delete(undefined)
m.has(undefined) // false
```

### 1.2.7 clear()

clear ⽅法清除所有成员，没有返回值

```js
let map = new Map();
map.set('foo', true);
map.set('bar', false);
map.size // 2
map.clear()
map.size // 0
```

### 1.2.8 遍历

Map 结构原⽣提供三个遍历器⽣成函数和⼀个遍历⽅法：
- keys()：返回键名的遍历器
- values()：返回键值的遍历器
- entries()：返回所有成员的遍历器
- forEach()：遍历 Map 的所有成员

遍历顺序就是插⼊顺序

```js
const map = new Map([
['F', 'no'],
['T', 'yes'],
]);
for (let key of map.keys()) {
console.log(key);
}
// "F"
// "T"
 for (let value of map.values()) {
 console.log(value);
 }
 // "no"
 // "yes"
 for (let item of map.entries()) {
 console.log(item[0], item[1]);
 }
 // "F" "no"
 // "T" "yes"
 // 或者
 for (let [key, value] of map.entries()) {
 console.log(key, value);
 }
 // "F" "no"
 // "T" "yes"
 // 等同于使⽤map.entries()
 for (let [key, value] of map) {
 console.log(key, value);
 }
 // "F" "no"
 // "T" "yes"
 map.forEach(function(value, key, map) {
 console.log("Key: %s, Value: %s", key, value);
 });
```

## 1.3 WeakSet 和 WeakMap

### 1.3.1 WeakSet

创建 WeakSet 实例

```JS
const ws = new WeakSet();
```

WeakSet 可以接受⼀个具有 Iterable 接⼝的对象作为参数

```JS
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}
```

在 API 中 WeakSet 与 Set 有两个区别：
- 没有遍历操作的 API
- 没有 size 属性

WeakSet 只能成员只能是引⽤类型，⽽不能是其他类型的值

```JS
let ws=new WeakSet();
// 成员不是引⽤类型
let weakSet=new WeakSet([2,3]);
console.log(weakSet) // 报错
// 成员为引⽤类型
let obj1={name:1}
let obj2={name:1}
let ws=new WeakSet([obj1,obj2]);
console.log(ws) //WeakSet {{…}, {…}}
```

WeakSet ⾥⾯的引⽤只要在外部消失，它在 WeakSet ⾥⾯的引⽤就会⾃动消失

### 1.3.2WeakMap

WeakMap 结构与 Map 结构类似，也是⽤于⽣成键值对的集合

在 API 中 WeakMap 与 Map 有两个区别：
- 没有遍历操作的 API
- 没有 clear 清空⽅法

```JS
// WeakMap 可以使⽤ set ⽅法添加成员
const wm1 = new WeakMap();
const key = {foo: 1};
wm1.set(key, 2);
wm1.get(key) // 2
// WeakMap 也可以接受⼀个数组，
// 作为构造函数的参数
const k1 = [1, 2, 3];
const k2 = [4, 5, 6];
const wm2 = new WeakMap([[k1, 'foo'], [k2, 'bar']]);
wm2.get(k2) // "bar"
```

WeakMap 只接受对象作为键名（ null 除外），不接受其他类型的值作为键名

```JS
const map = new WeakMap();
map.set(1, 2)
// TypeError: 1 is not an object!
map.set(Symbol(), 2)
// TypeError: Invalid value used as weak map key
map.set(null, 2)
// TypeError: Invalid value used as weak map key
```

WeakMap 的键名所指向的对象，⼀旦不再需要，⾥⾯的键名对象和所对应的键值对会⾃动消失，不⽤⼿动删除引⽤

举个场景例⼦：

在⽹⻚的 DOM 元素上添加数据，就可以使⽤ WeakMap 结构，当该 DOM 元素被清除，其所对应的WeakMap 记录就会⾃动被移除

```JS
const wm = new WeakMap();
const element = document.getElementById('example');
wm.set(element, 'some information');
wm.get(element) // "some information"
```

注意： WeakMap 弱引⽤的只是键名，⽽不是键值。键值依然是正常引⽤

下⾯代码中，键值 obj 会在 WeakMap 产⽣新的引⽤，当你修改 obj 不会影响到内部

```JS
const wm = new WeakMap();
let key = {};
let obj = {foo: 1};
wm.set(key, obj);
obj = null;
wm.get(key)
// Object {foo: 1}
```
