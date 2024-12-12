# Vue中的diff算法

## 1. 前后元素不一致

两个虚拟节点不一致就不需要比较，直接移除老的节点，将新的虚拟节点渲染成真实DOM进行挂载即可。

```js
const patch = (n1, n2, container, anchor = null) => {
    if (n1 === n2) {
      return //无需更新
    }

    // 如果n1 n2都有值 但是类型不同则删除n1 换n2
    if (n1 && !isSameVNode(n1, n2)) {
      unmount(n1) //删除节点
      n1 = null
    }

    let {shapeFlag, type} = n2

    switch (type) {
      case Text:
        //处理文本
        processText(n1, n2, container)
        break
      case Fragment:
        processFragment(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor)
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent(n1, n2, container, anchor)
        }
    }
  }
```

## 2. 前后元素一致

前后虚拟节点相同则复用节点，在比较界虚拟节点的属性和children节点，通过一下方法判断是否相同：

```js
export function isSameVNode(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key
}
```

### 2.1 处理文本节点

```js
const processText = (n1, n2, el) => {
    if (n1 == null) {
      // 初始化文本
      hostInsert((n2.el = hostCreateText(n2.children)), el)
    } else {
      // 文本的内容变了复用老的节点
      let el = (n2.el = n1.el)
      if (n1.children !== n2.children) {
        hostSetText(el, n2.children)// 更新文本
      }
    }
  }
```

### 2.2 处理元素类型的虚拟节点

```js
const processElement = (n1, n2, container, anchor) => {
  if (n1 == null) {
    // 初次渲染
    mountElement(n2, container, anchor)
  } else {
    // diff
    patchElement(n1, n2)
  }
}

const patchElement = (n1, n2) => {
  let el = (n2.el = n1.el)
  const oldProps = n1.props || {}
  const newProps = n2.props || {}
  patchProps(oldProps, newProps, el)

  patchChildren(n1, n2, el)
}

const patchProps = (oldProps, newProps, el) => {
  if (oldProps !== newProps) {
    for (let key in newProps) {
      const prev = oldProps[key]
      const next = newProps[key]

      if (prev != next) {
        // 用新的改掉老的
        hostPatchProp(el, key, prev, next)
      }
    }
    for (let key in oldProps) {
      if (!(key in newProps)) {
        //老的存在了 新的没有了
        const prev = oldProps[key]
        hostPatchProp(el, key, prev, null)
      }
    }
  }
}
// diff算法
const patchChildren=(n1,n2,el)=>{}
```

子元素比较有一下几种情况：

| 新孩子 | 旧孩子 |          操作方式          |
| :----: | :----: | :------------------------: |
|  文本  |  数组  |    删除老的更新文本内容    |
|  文本  |  文本  |        更新文本内容        |
|  文本  |   空   |        更新文本内容        |
|  数组  |  数组  |          diff算法          |
|  数组  |  文本  | 清空文本内容，挂载数组孩子 |
|  数组  |   空   |        挂载数组孩子        |
|   空   |  数组  |     删除所有的孩子节点     |
|   空   |  文本  |        清空文本内容        |
|   空   |   空   |          不做处理          |

```js
const patchChildren = (n1, n2, el) => {
    // 比较两方孩子的差异 更新el中的孩子
    const c1 = n1.children
    const c2 = n2.children

    const prevShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag

    // 新的是文本的几种情况
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1)
      }
      if (c1 !== c2) {
        // 文本内容不相同
        hostSetElementText(el, c2)
      }
    } else {
      // 老的是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 老的是数组 新的也是数组 diff算法
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          patchKeyedChildren(c1, c2, el)
        } else {
          // 老的是数组 新的不是数组 删除原来的
          unmountChildren(c1)
        }
      } else {
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, '')
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          hostSetElementText(c2, el)
        }
      }
    }
  }
```

## 3. diff算法

### 3.1 从头开始正序比较

如果是相同的虚拟节点，则调用patch方法对元素打补丁：先复用老节点，在比较更新属性，在比较更新孩子节点

- c1：旧节点
- c2：新节点
- e1：尾指针指向旧节点的最后一个节点
- e2:尾指针指向新节点的最后一个节点

```js
// 同级比对  父和父比 子和子比 孙子和孙子比 采用的是深度遍历
    // a b c
    // a b c d

    let i = 0 // 默认从0 开始比对
    let e1 = c1.length - 1
    let e2 = c2.length - 1
    // 按照后面的数据 来看 i=0 e1=2 e2=3
    // 从头开始比较
    while (i <= el && i <= e2) {
      // 有一方循环完了就结束
      const n1 = c1[i]
      const n2 = c2[i]
      // 如果两个是相同节点的话可以复用
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, el) // 深度遍历
      } else {
        break
      }
      i++
    }
```

![image-20241211172515237](http://cdn.mengyang.online/202412111725728.png)

终止条件：新旧节点不一致或有一方的i大于e1或者e2

### 3.2 从尾开始倒序比对

如果是相同的虚拟节点就调用patch方法(复用老节点比较属性比较孩子)

```js
// 从尾部开始比较
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      e1--
      e2--
    }
```

![image-20241211173838826](http://cdn.mengyang.online/202412111738890.png)

### 3.3 挂载剩余的节点

分为头部挂载和尾部挂载两种情况：

1. i比e1大说明有新增的,i和e2之间就是新增的节点，判断下是插入到前面还是插入到后面

```js
// 我要知道 我是添加还是删除 i比e1大说明新的长 老的短
// 同序列挂载
if (i > e1) {
  //有新增
  if (i <= e2) {
    while (i <= e2) {
      // 看一下如果e2向前移动了 那么e2的下一个值肯定存在  意味着向前插入
      // 如果e2 没有动 那么e2 下一个就是空 意味着是向后插入
      const nextPos = e2 + 1
      const anchor = nextPos < c2.length ? c2[nextPos].el : null
      patch(null, c2[i], el, anchor) // 需要判断是向前插入 还是向后插入
      i++
    }
  }
}
```

### 3.4 卸载剩余节点

i比e2大说明要有卸载的节点，i到e1之间就是要卸载的节点

```js
while (i < e1) {
  unmount(c1[i])
  i++
}
```

### 3.5 乱序比对

前面几种都没有对应上则走乱序对比的步骤：：

1. **keyToNewIndexMap**这个map是新节点中的key-->newIndex的一个映射表，也就是说这个节点和这个节点的下标对应上
2. **newIndexToOldMapIndex**此数组记录的是新节点是否被比对过，已经被比对过的节点只需要移动位置，没有被比对过的需要创建
3. 遍历老的节点，看下是否存在于新的节点里面，使用`keyToNewIndexMap.get(child.key)`方法判断是否有值，如果存在就patch比较，不存在就删除老的节点
4. 在patch比较之前给`newIndexToOldMapIndex[newIndex - s2] = i + 1`赋值，用于最长递增子序列
5. 老的节点遍历完之后只是进行了对比和多余老节点的卸载
6. 倒序遍历新的节点，看一下新节点是否被比对过，通过`newIndexToOldMapIndex[i] === 0`进行判断，如果不为0则移动节点位置，如果为0则创建挂载新节点
7. 移动节点的具体位置和挂载新节点的位置计算方法:`const anchor = nextIndex + 1 < *c2*.length ? *c2*[nextIndex + 1] : null`,如果当前节点是最后一个新节点则anchor为null，然后插入到容器的最后，否则插入到anchor之前

```js
let s1 = i // s1 => e1
let s2 = i // s2 => e2
//这里我们要复用老节点 根据key vue2中是根据老节点创建的一个索引表 vue3中根据新的key 做了一个映射表

const keyToNewIndexMap = new Map()
for (let i = s2; i <= e2; i++) {
  const vnode = c2[i]
  keyToNewIndexMap.set(vnode.key, i)
}
// 有了新的映射表后 去老的中查找一下 看一下 是否存在 如果存在需要复用了
const toBePatched = e2 - s2 + 1

const newIndexToOldMapIndex = new Array(toBePatched).fill(0)

for (let i = s1; i <= e1; i++) {
  const child = c1[i]

  let newIndex = keyToNewIndexMap.get(child.key) // 通过老的可以 来查找对应的新的索引
  // 如果newIndex有值说明有

  if (newIndex == undefined) {
    // 老的里面有 新的里面没有
    unmount(child)
  } else {
    // 比对两个属性
    // 如果前后两个能复用 则比较这两个节点
    newIndexToOldMapIndex[newIndex - s2] = i + 1
    patch(child, c2[newIndex], el)
  }
}
// 写到这里 我们已经复用了节点 并且更新了复用节点的属性 差移动操作,和新的里面有老的中没有的操作
//如何知道 新的里面有  老的里面没有

const seq = getSequence(newIndexToOldMapIndex)

let j = seq.length - 1

for (let i = toBePatched - 1; i >= 0; i--) {
  const nextIndex = s2 + 1 // 下一个元素的索引
  const nextChild = c2[nextIndex] // 先拿到h
  // 看一下 h后面是否有值 有值就将h插入到这个元素的前面, 没有值就是appendChild
  const anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1] : null
  // 默认找到f把h插入到f前面
  // ab [e c d h ] f g
  if (newIndexToOldMapIndex[i] === 0) {
    patch(null, nextChild, el, anchor) // 将h插入到了f前面
    // 找到新增的元素
    // 创建元素在插入
  } else {
    if (i !== seq[j]) {
      hostInsert(nextChild.el, anchor)
    } else {
      j-- // 不做移动跳过节点即可
    }
    //直接做插入操作即可
    //倒叙插入

    // 这个插入操作比较暴力 整个做了一次移动 对我们需要优化不动的哪一项
    // [5,3,4,0]==>[1,2]最长递增子序列
    // 索引为1和2的不用动
    // 2 5 8 6 7 9 找递增序列中最长的 2 5 6 7 9
  }
}
```

### 3.6 最长递增子序列

> 目的：尽可能少的移动节点位置，保证节点顺序正确，减少性能浪费

#### 3.6.1 如何找到最长递增子序列

有一个数组`[3,2,8,9,5,6,7,11,15]`,最长递增子序列是什么？

```js
[2,8,9,11,15]// 这个不是最长递增子序列
[2,5,6,7,11,15]// 这个才是

```

我们只需要将3/8/9移动即可获得一个最长递增子序列，我们可以利用贪心算法+二分查找实现

```js
const arr=[3, 2, 8, 9, 5, 6, 7, 11, 15]
/**
 * 3
 * 2(用2替换3)
 * 2 8
 * 2 8 9
 * 2 5 9(5替换8 二分查找，找到第一个比5大的替换，即所有大于当前值的结果中的最小值)
 * 2 5 6(6替换9 二分查找 找到第一个比6大的进行替换)
 * 2 5 6 7
 * 2 5 6 7 11
 * 2 5 6 7 11 15(最长递增子序列)
 */
```

由于贪心算法取的是当前局部的最优解，有可能会导致最长递增子序列在原始数组中是不正确的顺序，但是长度是没有问题的，比如下面这个数组：

```js
const arr1=[3, 2, 8, 9, 5, 6, 7, 11, 15, 4]
// 2, 4, 6, 7, 11, 15
```

代码实现思路：

1. 遍历数组，如果当前这一项比我们的最后一项大则直接放到末尾
2. 如果当前这一项比最后一项小，需要在序列中通过二分查找找到比当前大的这一项，用它来替换掉
3. 节点进行追溯，替换掉错误的节点