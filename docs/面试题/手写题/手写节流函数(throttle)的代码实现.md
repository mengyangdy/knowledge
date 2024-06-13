---
title: 手写节流函数(throttle)的代码实现
tags:
  - 手写题
  - 面试题
date: 2024-05-29
---

# 一手写节流函数(throttle)的代码实现

实现思路:

1. 基本实现
2. this 和参数绑定
3. 立即执行控制
4. 尾部执行控制
5. 取消功能实现
6. 获取返回值

````js
    function myThrottle(
      fn,
      interval,
      { leading = false, trailing = false } = {}
    ) {
      let startTime = 0
      let timer = null
      const _throttle = function (...args) {
        return new Promise((resolve, reject) => {
          try {
            // 获取当前时间
            const nowTime = new Date().getTime()
            // 对立即执行进行控制
            if (leading && startTime === 0) {
              startTime = nowTime
            }
            // 计算需要等待的时间执行函数
            const waitTime = interval - (nowTime - startTime)
            if (waitTime <= 0) {
              if (timer) clearTimeout(timer)
              const res = fn.apply(this, args)
              resolve(res)
              startTime = nowTime
              timer = null
              return
            }

            // 判断是否需要执行尾部
            if (trailing && !timer) {
              timer = setTimeout(() => {
                const res = fn.apply(this, args)
                resolve(res)
                startTime = new Date().getTime()
                timer = null
              }, waitTime)
            }
          } catch (error) {
            reject(error)
          }
        })
      }
      _throttle.cancel = function () {
        if (timer) clearTimeout(timer)
        startTime = 0
        timer = null
      }

      return _throttle
    }
    ```
````
