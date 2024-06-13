---
title: 手写Promise的代码实现
tags:
  - 手写题
  - 面试题
date: 2024-05-29
---

# 一手写Promise的代码实现

## 1.1 Promise 的基本使用

### 1.1.1 Promise 的状态

Promise 的使用过程中,我们可以将它的状态划分为三个:

- 待定(pending):初始状态,既没有被兑现,也没有被拒绝
  - 当执行 executor 中的代码时,处于该状态
- 已兑现(fulfilled):意味着操作成功完成
  - 执行了 resolve 时,处于该状态
- 已拒绝(rejected):意味着操作失败
  - 执行了 reject 时处于该状态

### 1.1.2 executor

- executor 是在创建 Promise 时需要传入的一个回调函数,这个回调函数会被立即只看,并且传入两个参数 resolve 和 reject
- 通常我们会在 executor 中确定我们的 Promise 状态:
  - 通过 resolve,可以兑现(fulfilled)Promise 的状态,我们称之为已决议(resolved)
  - 通过 reject 可以拒绝(reject)Promise 的状态
- 需要注意:一旦状态被确定下来,Promise 的状态会被锁死,该 Promise 的状态是不可更改的
  - 在我们调用 resolve 的时候,如果 resolve 传入的值本身不是一个 Promise,那么会将该 Promise 的状态变成兑现(fulfilled)
  - 在之后我们去调用 reject 时已经不会有任何的响应了(并不是这行代码不会执行,而是无法改变 Promise 的状态)

### 1.1.3 resolve 参数不同的区别

**情况一:如果 resolve 传入一个普通的值或者对象,那么这个值会作为 then 回调的参数**

普通的值或者对象 pending -> fulfilled

```js
//
new Promise((resolve, reject) => {
  resolve('normal resolve')
}).then((res) => {
  console.log(res)
})
```

**情况二:如果 resolve 中传入的是另外一个 Promise,那么这个新 Promise 会决定原 Promise 的状态**

- 传入一个Promise
  - 那么当前的Promise的状态会由传入的Promise来决定
  - 相当于状态进行了移交

```js
new Promise((resolve, reject) => {
  resolve(
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('第二个Promise')
      }, 3000)
    })
  )
})
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })
```

**情况三:如果 resolve 中传入的是一个对象,并且这个对象有实现 then 方法,那么会执行该 then 方法,并且根据 then 方法的结果来决定 Promise 的状态**

- 传入一个对象, 并且这个对象有实现then方法(并且这个对象是实现了thenable接口)
- 那么也会执行该then方法, 并且由该then方法决定后续状态

```js
new Promise((resolve, reject) => {
  // pending -> fulfilled
  const obj = {
    then: function (resolve, reject) {
      // resolve("resolve message")
      reject('reject message')
    },
  }
  resolve(obj)
}).then(
  (res) => {
    console.log('res:', res)
  },
  (err) => {
    console.log('err:', err)
  }
)
```

### 1.1.4 Promise 对象方法-then

怎么查看 Promise 有那些对象方法?
`console.log(Object.getOwnPropertyDescriptors(Promise.prototype))`

**then 方法基本使用**

- then 方法是 Promise 对象上的一个方法:它其实放在 Promise 的原型上的 Promise.prototype.then
- then 方法接受两个参数
  - fulfilled 的回调函数:当状态变成 fulfilled 时会回调的函数
  - reject 的回调函数:当状态变成 reject 时会回调的函数

```js
promise.then(
  (res) => {
    console.log(res)
  },
  (err) => {
    console.log(err)
  }
)
```

**then 方法多次调用**

- 一个 Promise 的 then 方法可以被多次调用
  - 每次调用我们都可以传入对应的 fulfilled 回调
  - 当 Promise 的状态变成 fulfilled 的时候,这些回调函数都会被执行

```js
promise.then((res) => {
  console.log('res1:', res)
})

promise.then((res) => {
  console.log('res2:', res)
})

promise.then((res) => {
  console.log('res3:', res)
})
```

**then 方法的返回值**

- then 方法本身是有返回值的,它的返回值是一个 Promise,所以我们可以进行如下的链式调用:
  - 但是 then 方法返回的 Promise 到底处于什么样的状态呢?
- Promise 有三种状态,那么这个 Promise 处于什么状态呢?
  - 当 then 方法中的回调函数本身在执行的时候,那么它处于 pending 状态
  - 当 then 方法中的回调函数返回一个结果时,那么它处于 fulfilled 状态,并且会将结果作为 resolve 的参数
    - 情况一:返回一个普通的值
    - 情况二:返回一个 Promise
    - 情况三:返回一个 thenable 值
  - 当 then 方法抛出一个异常时,那么它处于 reject 状态

```js
// then返回一个普通的值
const promise = new Promise((resolve, rejct) => {
  setTimeout(() => {
    resolve(10)
  }, 1000)
})

promise
  .then((res) => {
    console.log(res)
    return 20
  })
  .then((res) => {
    console.log(res, 'res')
  })

// 返回一个Promise
promise
  .then((res) => {
    console.log(res)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('promise')
      }, 1000)
    })
  })
  .then((res) => {
    console.log(res, 'res')
  })

// 返回一个thenable
promise
  .then((res) => {
    console.log(res)
    return {
      then: function (resolve, reject) {
        resolve('返回一个thenable')
      },
    }
  })
  .then((res) => {
    console.log(res, 'res')
  })
```

### 1.1.5 Promise 对象方法-catch

**catch 方法多次调用**

- catch 方法也是 Promise 对象上的一个方法:它也是放在 Promise 的原型上的 Promise.prototype.catch
- 一个 Promise 的 catch 方法是可以被多次调用的
  - 每次调用我们都可以传入对应的 reject 回调
  - 当 Promise 的状态变成 reject 的时候,这些回调函数都会被执行

```js
promise.catch((err) => {
  console.log(err)
})

promise.catch((err) => {
  console.log(err)
})

promise.catch((err) => {
  console.log(err)
})
```

**错误捕获**

1. 当executor抛出异常时, 也是会调用错误(拒绝)捕获的回调函数的

```js
const promise = new Promise((resolve, reject) => {
  // reject("rejected status")
  throw new Error('rejected status')
})

promise.then(undefined, (err) => {
  console.log('err:', err)
  console.log('----------')
})
```

2. 通过catch方法来传入错误(拒绝)捕获的回调函数

```js
promise.catch((err) => {
  console.log('err:', err)
})
promise
  .then((res) => {
    return new Promise((resolve, reject) => {
      reject('then rejected status')
    })
    // throw new Error("error message")
  })
  .catch((err) => {
    console.log('err:', err)
  })
```

3. 拒绝捕获的问题

```js
promise.then(
  (res) => {},
  (err) => {
    console.log('err:', err)
  }
)

const promise = new Promise((resolve, reject) => {
  reject('111111')
  // resolve()
})

promise
  .then((res) => {})
  .then((res) => {
    throw new Error('then error message')
  })
  .catch((err) => {
    console.log('err:', err)
  })

promise.catch((err) => {
  console.log('🚀 ~~- err:', err)
})
```

**catch 的返回值**

事实上 catch 方法也是会返回一个 Promise 对象的,所以 catch 方法后面我们可以继续调用 then 方法或者 catch 方法

- 下面的代码中后续是 res 在执行,这是因为 catch 传入的回调在执行完后,默认状态依然会是 fulfilled 的

```js
const promise = new Promise((resolve, reject) => {
  reject(111)
})

promise
  .catch((err) => {
    console.log('err1', err)
  })
  .catch((err) => {
    console.log('err2', err)
  })
  .then((res) => {
    console.log('res', res)
  })
```

如果我们希望后续继续执行 catch,那么需要抛出一个异常:

```js
promise
  .catch((err) => {
    console.log('err1', err)
    throw new Error('error message')
  })
  .catch((err) => {
    console.log('err2', err)
  })
  .then((res) => {
    console.log('res', res)
  })
```

catch 的返回值会继续执行 then 方法:

```js
const promise = new Promise((resolve, reject) => {
  reject('111111')
})

promise
  .then((res) => {
    console.log('res1:', res)
  })
  .catch((err) => {
    console.log('err1:', err)
    return 'catch return value'
  })
  .then((res) => {
    console.log('res1 result:', res)
  })
  .catch((err) => {
    console.log('err1 result:', err)
  })
```

### 1.1.6 Promise 对象方法-finally

- finally 是在 ES 9 中新增的一个特性:表示无论他 Promise 对象无论变成 fulfilled 还是 reject 状态,最终都会被执行的代码
- finally 方法是不接受参数的,因为无论前面是 fulfilled 状态,还是 reject 状态,它都会执行

```js
const promise = new Promise((resolve, reject) => {
  // resolve("resolve message")
  reject('reject message')
})

promise
  .then((res) => {
    console.log('res:', res)
  })
  .catch((err) => {
    console.log('err:', err)
  })
  .finally(() => {
    console.log('finally code execute')
  })
```

### 1.1.7 Promise 类方法-resolve

- 有时候我们已经有一个现成的内容了,仙王将其转成 Promise 来使用,这个时候我们可以使用 Promise.resolve 方法来完成:
  - Promise.resolve 的用法相当于 new Promise,并且执行 resolve 方法
- resolve 的参数的形态:
  - 情况一:参数是一个普通的值或者对象
  - 情况二:参数本身是 Promise
  - 情况三:参数是一个 thenable

```js
// 情况一
const promise = Promise.resolve({ name: 'why' })
相当于
const promise2 = new Promise((resolve, reject) => {
  resolve({ name: 'why' })
})

// 情况二
const promise = Promise.resolve(
  new Promise((resolve, reject) => {
    resolve('11111')
  })
)

promise.then((res) => {
  console.log('res:', res)
})

// 情况三
const promise = Promise.resolve({
  then: function (resolve, reject) {
    resolve(`thenable`)
  },
})

promise.then(
  (res) => {
    console.log(res)
  },
  (err) => {
    console.log(err)
  }
)
```

### 1.1.7 reject 方法

- reject 方法类似于 resolve 方法,只是会将 Promise 对象的状态设置为 reject 状态
- Promise.reject 的用法相当于 new Promise,只是会调用 reject
- Promise.reject 传入的参数无论是什么形态,都会直接作为 reject 状态的参数传递到 catch 的

```js
const promise = Promise.reject('rejected message')
// 相当于
const promise2 = new Promsie((resolve, reject) => {
  reject('rejected message')
})

// 注意: 无论传入什么值都是一样的
const promise = Promise.reject(new Promise(() => {}))

promise
  .then((res) => {
    console.log('res:', res)
  })
  .catch((err) => {
    console.log('err:', err)
  })
```

### 1.1.8 Promise 类方法-all

- 另一个类方法是 Promise.all
  - 它的作用是将多个 Promise 包裹在一起形成一个新的 Promise
  - 新的 Promise 状态由包裹的所有 Promise 共同决定:
    - 当所有的 Promise 状态变成 fulfilled 状态时,新的 Promise 状态为 fulfilled,并且会将所有 Promise 的返回值组成一个数组
    - 当有一个 Promise 的状态为 reject 时,新的 Promise 状态为 reject,并且会将第一个 reject 的返回值作为参数

```js
// 创建多个Promise
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(11111)
  }, 1000)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(22222)
  }, 2000)
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(33333)
  }, 3000)
})

// 需求: 所有的Promise都变成fulfilled时, 再拿到结果
// 意外: 在拿到所有结果之前, 有一个promise变成了rejected, 那么整个promise是rejected
Promise.all([p2, p1, p3, 'aaaa'])
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log('err:', err)
  })
```

### 1.1.9 allSettled 方法

- all 方法有一个缺陷,当有其中一个 Promise 变成 reject 状态时,新 Promise 就会立即变成对应的 reject 状态
  - 那么对于 resolve 的以及依然处于 pending 状态的 Promise,我们是获取不到对应的结果的
- 在 ES 11 中,添加了新的 API Promise.allSettled:
  - 该方法会在所有的 Promise 都有结果(settled),无论是 fulfilled 还是 reject 时,才会有最终的状态
  - 并且这个 Promise 的结果一定是 fulfilled 的

```js
// 创建多个Promise
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(11111)
  }, 1000)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(22222)
  }, 2000)
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(33333)
  }, 3000)
})

// allSettled
Promise.allSettled([p1, p2, p3])
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })
/* 结果
[
  { status: 'fulfilled', value: 11111 },
  { status: 'rejected', reason: 22222 },
  { status: 'fulfilled', value: 33333 }
]
*/
```

### 1.1.10 race 方法

- 如果有一个 Promise 有了结果,我们就希望决定最终 Promise 的状态,那么可以使用 race 方法
  - race 是竞技竞赛的意思,表示多个 Promise 相互竞争,谁先有结果,那么就使用谁的结果

```js
// 创建多个Promise
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(11111)
  }, 3000)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(22222)
  }, 500)
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(33333)
  }, 1000)
})

// race: 竞技/竞赛
// 只要有一个Promise变成fulfilled状态, 那么就结束
// 意外:
Promise.race([p1, p2, p3])
  .then((res) => {
    console.log('res:', res)
  })
  .catch((err) => {
    console.log('err:', err)
  })
```

### 1.1.11 any 方法

- any 方法是 ES 12 中新增的方法,和 race 方法是类似的:
  - any 方法会等到 fulfilled 状态,才会决定新 Promise 的状态
  - 如果所有的 Promise 都是 reject 的,那么也会等到所有的 Promise 都变成 rejected 状态
  - 如果所有的 Promise 都是 reject 的,那么会报一个AggregateError 的错误

```js
// 创建多个Promise
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve(11111)
    reject(1111)
  }, 1000)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(22222)
  }, 500)
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve(33333)
    reject(3333)
  }, 3000)
})

// any方法
Promise.any([p1, p2, p3])
  .then((res) => {
    console.log('res:', res)
  })
  .catch((err) => {
    console.log('err:', err.errors)
  })
```

## 1.2 手写 Promise

### 1.2.1 构造函数的规划

```js
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

// 工具函数 抽离出公共逻辑
function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value)
    resolve(result)
  } catch (err) {
    reject(err)
  }
}

class MYPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []

    const resolve = (value) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_FULFILLED
          this.value = value
          console.log('resolve被调用了')
          // 执行then传进来的第一个回调函数
          this.onFulfilledFns.forEach((fn) => {
            fn(this.value)
          })
        })
      }
    }
    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return
          this.status = PROMISE_STATUS_REJECTED
          this.reason = reason
          console.log('reject被调用了')
          // 执行then传进来的第二个回调函数
          this.onRejectedFns.forEach((fn) => {
            fn(this.reason)
          })
        })
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    const defaultOnRejected = (err) => {
      throw err
    }
    onRejected = onRejected || defaultOnRejected

    const defaultFulfilled = (value) => {
      return value
    }
    onFulfilled = onFulfilled || defaultFulfilled

    return new MYPromise((resolve, reject) => {
      // 如果在then调用的时候 状态已经确定下来了
      if (this.status === PROMISE_STATUS_FULFILLED) {
        execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
      }
      if (this.status === PROMISE_STATUS_REJECTED) {
        execFunctionWithCatchError(onRejected, this.reason, resolve, reject)
      }

      if (this.status === PROMISE_STATUS_PENDING) {
        // 将成功回调和失败回调放到数组中
        this.onFulfilledFns.push(() => {
          execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
        })
        this.onRejectedFns.push(() => {
          execFunctionWithCatchError(onRejected, this.reason, resolve, reject)
        })
      }
    })
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(onFinally) {
    this.then(
      () => {
        onFinally()
      },
      () => {
        onFinally()
      }
    )
  }

  static resolve(value) {
    return new MYPromise((resolve) => resolve(value))
  }
  static reject(reason) {
    return new MYPromise((resolve, reject) => reject(reason))
  }
  static all(promises) {
    return new MYPromise((resolve, reject) => {
      const values = []
      promises.forEach((promise) => {
        promise.then(
          (res) => {
            values.push(res)
            if (values.length === promises.length) {
              resolve(values)
            }
          },
          (err) => {
            reject(err)
          }
        )
      })
    })
  }

  static allSettled(promises) {
    return new MYPromise((resolve) => {
      const results = []
      promises.forEach((promise) => {
        promise.then(
          (res) => {
            results.push({
              status: PROMISE_STATUS_FULFILLED,
              value: res,
            })
            if (results.length === promises.length) {
              resolve(results)
            }
          },
          (err) => {
            results.push({
              status: PROMISE_STATUS_REJECTED,
              reason: err,
            })
            if (results.length === promises.length) {
              resolve(results)
            }
          }
        )
      })
    })
  }

  static race() {
    return new MYPromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(resolve, reject)
      })
    })
  }

  static any(promises) {
    const reasons = []
    return new MYPromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(resolve, (err) => {
          reasons.push(err)
          if (reasons.length === promises.length) {
            reject(new AggregateError(reasons))
          }
        })
      })
    })
  }
}
```
