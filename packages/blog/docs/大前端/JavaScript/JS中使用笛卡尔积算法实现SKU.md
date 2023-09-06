---
title: JS中使用笛卡尔积算法实现SKU
tag:
  - 笛卡尔乘积
  - sku
date: 2023-08-28
cover: https://s2.loli.net/2023/08/28/aetMuxEYX7nDkpl.jpg
---

# JS 中使用笛卡尔积算法实现 SKU

## 什么是笛卡尔积

笛卡尔积指在数学中，两个集合 X 和 Y 的笛卡尔积，又称之为直积。表示为 X x Y,X 为第一个合集的成员，Y 为第二个合集的所有可能有序对中的一个成员。
假设合集 A=a,b，合集 B=0,1,则两个合集的笛卡尔积为(a,0), (a,1), (b,0), (b,1)。
数据库中左连接或右连接中会使用到笛卡尔积。

## 什么是 SKU

SKU 的全称是**Stock Keeping Units**，我们可以理解为是商家用于管理商品库存和销售的一种形式。
每个 SKU 都对应着若干个属性的集合。例如：一个商品存在颜色、尺寸等属性，商家就可以根据不同的属性设置不同的 SKU。

假如我们现在有一个商品，这个商品有红色、蓝色两种颜色，1、2 两种尺寸，儿童票、成人票两种规格，那么我们根据现有的规格，可以得到所有的 SKU 为：

```JavaScript
const arr = [
  ["红色", "1", "儿童票"],
  ["红色", "1", "成人票"],
  ["红色", "2", "儿童票"],
  ["红色", "2", "成人票"],
  ["蓝色", "1", "儿童票"],
  ["蓝色", "1", "成人票"],
  ["蓝色", "2", "儿童票"],
  ["蓝色", "2", "成人票"],
]
```

## 具体算法

首先我们需要构建我们商品的数据，数据结构为下：

```JavaScript
const skuTopData=[
	{
	key:0
	attr_name: '颜色',
	attr_value:['红色','蓝色']
	},
	{
	key:1,
	attr_name: '尺寸',
	attr_value:['1cm','8cm']
	}
]
```

![](https://s2.loli.net/2023/08/29/HkTQsZp4gXmwK7l.png)

基于上面的属性结构，我们可以获得的 SKU 结构为：

```JavaScript
const skuBottomData = [
  {
    key0: 'red',
    key1: '1cm',
    original_price: '',
    price: '',
    quantity: '',
    sku: ''
  },
  {
    key0: 'red',
    key1: '8cm',
    original_price: '',
    price: '',
    quantity: '',
    sku: ''
  },
  {
    key0: 'green',
    key1: '1cm',
    original_price: '',
    price: '',
    quantity: '',
    sku: ''
  },
  {
    key0: 'green',
    key1: '8cm',
    original_price: '',
    price: '',
    quantity: '',
    sku: ''
  }
]
```

![](https://s2.loli.net/2023/08/29/WFXzTB8yrqpStIE.png)

我们可以使用笛卡尔积来构建我们的 SKU 数据，SKU 的生成是实时的，也就是销售属性的增加或者删除都会引起 SKU 的变化，所以我们需要通过 watch 监听销售属性的变化:

```JavaScript
// 构建销售属性data
const skuTopData = ref([])

// 监听销售属性的变化
watch(
  () => skuTopData.value,
  newV => {
    // 只有当属性和值都存在的话再去做处理
    // 只添加输入框而没有输入值的话不触发
    const data = newV.filter(ee => {
      return ee.attr_name && ee.attr_value.length && ee.attr_value.every(ee => ee)
    })
    if (data.length) {
      transformColumn(data)
    }
  },
  {
    deep: true
  }
)

// 通过属性构建SKU
function transformColumn(data: any) {
  // 先把下面列表的列提取出来
  const arr = data.map((ee: any, vv: number) => {
    return {
      key: ee.key,
      width: '100px',
      align: 'center',
      title: ee.attr_name
    }
  })
  // 先构建出来列
  skuBottomColumns.value = cloneDeep([...arr, ...initSkuBottomColumns])
  // 再处理sku数据
  transformSkuData(data)
}

function transformSkuData(data) {
  // 获取到所有的属性名 [['red','green'],['1cm','8cm']]
  const cartesianData = data.map((ee: any) => ee.attr_value)
  if (cartesianData.length === 0) {
    addAttr([])
    // 一条数据也要展示在列表上
  } else if (cartesianData.length === 1) {
    // 如果只填了一条数据 [['red']]
    const array: any[] = []
    cartesianData[0].forEach((ee: any) => {
      const obj = {
        key0: ee
      }
      array.push(obj)
    })
    addAttr(array)
  } else {
    const res: any[] = cartesianData.reduce((pre: any, cur: any, index: number) => {
      const array: any[] = []
      pre.forEach((ee: any) => {
        cur.forEach((eee: any) => {
          if (index === 1) {
            const obj = {
              key0: ee,
              key1: eee,
              sku: getSkuNum()
            }
            array.push(obj)
          } else {
            const sku = getSkuNum()
            const item = JSON.parse(JSON.stringify(ee))
            item[`key${index}`] = eee
            item.sku = sku
            array.push(item)
          }
        })
      })
      return array
    })
    addAttr(res)
  }
}


// 添加其他属性 库存 价格 会员价
function addAttr(data: any) {
   let res = data.map(ee => {
     ee.quantity = ''
    Ï ee.price = ''
     ee.original_price = ''
     ee.sku = getSkuNum() // 生成一个唯一值
    return ee
  })
  skuBottomData.value = res
}
```

经过上面的计算，我们的销售属性的变化，就会同时计算 SKU 数据的值。

但是当我们修改某一个值的时候，就会引起 SKU 属性的重新计算，而以前填写的数据也全部会被重置掉，所以我们需要在每次重新计算 SKU 数据的时候，获取到上一次的 SKU 数据和新的对比，如果 key 一样则用旧的数据，如果 ky 不一样，则重新赋值。

```JavaScript
// 添加其他属性 库存 价格 会员价
function addAttr(data: any) {

  let res = data.map((ee, index) => {
	// 如果下面的列表不需要动态输入值的话，可以使用watch监听skuBottomData变化对afterData进行赋值，我这个项目可能会动态的赋值，所以在改变skuBottomData之前获取下现在的最新的值 然后经过计算再赋新值
    const afterData=cloneDeep(skuBottomData.value)
    let old = afterData.find(item => item.key === index)

    ee.quantity = old === undefined ? '' : old.quantity
    ee.price = old === undefined ? '' : old.price
    ee.original_price = old === undefined ? '' : old.original_price
    ee.sku = old === undefined ? getSkuNum() : old.sku
    ee.key = old === undefined ? index : old.key
    return ee
  })

  skuBottomData.value = res
}
```

以上代码为现在的业务需求，因为需要动态输入值，所以比较复杂一点，简单点的只需要通过 reduce 里面的双重 forEach 构建好 SKU 数据即可使用。
