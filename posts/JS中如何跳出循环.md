---
title: JS中如何跳出循环
description: 
tags: [JavaScript]
date: 2025-03-31
---

## 基础方法 break与continue

### break

> 用于完全终止当前循环，直接执行循环后的代码，适用于for、while、do...while、switch语句

```js
for(let i=0;i<10;i++){
  if(i === 5) break
  console.log(i) // 输入0-4
}
```

### continue

> 跳过当前迭代的剩余代码，直接进入下一轮的循环

```js
for(let i=0;i<10;i++){
  if(i % 2 === 0){
    continue
  }
  console.log(i); // 1 3 5 7 9
}
```

## 嵌套循环：使用标签

> 当需要跳出多层嵌套循环时，可以使用标签+break直接终止外层循环

```js
outerLoop: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break outerLoop; // 直接跳出外层循环
    console.log(`i: ${i}, j: ${j}`);// i:0,j:0 / i:0,j:1 / i:0,j:2 / i:1,j:0
  }
}
```

## 数组方法跳出策略

### forEach

> forEach无法通过break和continue跳出循环，可以通过抛出异常的方式来结束

```js
try {
  [1,2,3].forEach(num => { if (num === 2) throw Error(); });
} catch {}
```

