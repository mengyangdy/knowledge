---
title: js下划线转驼峰处理
tags:
  - 场景题
  - 面试题
date: 2024-06-13
---

# 一 js下划线转驼峰处理

```JS
function snakeToCamel(str) {
    return str.replace(/([-_])([a-z])/g, function(match, letter) {
        return letter.toUpperCase();
    });
}
```