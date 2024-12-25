---
title: 手写防抖函数(debounce)的代码实现
tags:
  - 手写题
  - 面试题
date: 2024-05-29
---

# 一手写防抖函数(debounce)的代码实现

实现思路:

1. 基本实现
2. 优化一:优化参数和 this 指向
3. 优化二:优化取消操作
4. 优化三:优化立即执行效果
5. 优化四:优化返回值
6. 优化五:增加 promise

````js
      function myDebounce(fn, delay, immediate = false, resultCallback) {
        // 用于记录上一次事件触发的timer
        let timer = null
        let isInvoke = false
        // 触发事件时执行的函数
        const _debounce = function (...args) {
          return new Promise((resolve, reject) => {
            try {
              // 多次触发事件 取消上一次的事件
              if (timer) clearTimeout(timer)

              let res = undefined

              // 立即执行
              if (immediate && !isInvoke) {
                res = fn.apply(this, args)
                if (resultCallback) resultCallback(res)
                resolve(res)
                isInvoke = true
                return
              }

              // 延迟执行对应的fn函数
              timer = setTimeout(() => {
                res = fn.apply(this, args)
                if (resultCallback) resultCallback(res)
                resolve(res)
                timer = null
              }, delay)
            } catch (error) {
              reject(error)
            }
          })
        }

        // 取消功能实现
        _debounce.cancel = function () {
          if (timer) clearTimeout(timer)
          timer = null
          isInvoke = false
        }

        return _debounce
      }
      ```
````
