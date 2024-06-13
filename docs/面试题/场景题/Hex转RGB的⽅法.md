---
title: Hex转RGB的⽅法
tags:
  - 场景题
  - 面试题
date: 2024-06-13
---

# 一 Hex转RGB的⽅法

```JS
function hexToRgb(hex) {
  // 去除可能的井号 (#)
  hex = hex.replace('#', '')

  // 处理3位简写形式
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  // 分解Hex字符串并转换为RGB
  var bigint = parseInt(hex, 16)
  var r = (bigint >> 16) & 255
  var g = (bigint >> 8) & 255
  var b = bigint & 255

  return { r: r, g: g, b: b } // 返回对象形式，也可以返回数组或字符串形式，根据需要调整
}

let rgb = hexToRgb('#ABC')
console.log("🚀 ~~- rgb:", rgb)
```