---
title: 将JavaScript文件放置在HTML文档的不同位置(如头部和尾部)对加载和执行的影响?
tags:
  - 浏览器
  - 面试题
date: 2024-05-26
---
# 一 将JavaScript文件放置在HTML文档的不同位置(如头部和尾部)对加载和执行的影响?

> 将JavaScript文件放置在HTML文档的不同位置（头部和尾部）会对页面的加载和执行产生显著影响，具体如下：

## 1.1 放置在头部

1. **阻塞页面渲染**：当浏览器遇到`<head>`部分的JavaScript时，它会暂停HTML的解析和页面的渲染，直到该脚本完全下载并执行完毕。这意味着，如果脚本较大或网络慢，用户可能会看到一个空白的页面，直到脚本执行完成。这对于用户体验来说是不利的，尤其是在移动设备或网络条件不佳的情况下。
2. **执行顺序保证**：放置在头部的脚本会按照它们在HTML中出现的顺序依次加载和执行，这对于那些存在依赖关系的脚本尤为重要。先加载的脚本可以为后面的脚本设置必要的环境或变量。

## 1.2 放置在尾部

1. **非阻塞页面渲染**: 将JavaScript放在标签的底部可以避免阻塞页面的初始渲染。浏览器会先加载和解析HTML，构建DOM树，渲染可见的页面内容，最后再加载和执行JavaScript。这样用户可以更快地看到页面的基本结构和内容，提高用户体验。
    
2. **延迟执行**: 虽然这通常意味着更好的用户体验，但如果JavaScript包含用于修改初始页面渲染（如DOM操作）的代码，则这些改动会在页面部分内容已经显示给用户后才发生，可能导致页面“闪烁”或重新布局。

## 1.3 使用 `defer` 和 `async` 属性

为了平衡性能和依赖需求，现代Web开发实践中常使用`defer`和`async`属性来调整脚本的加载行为，无论脚本放置在文档的哪个位置：

- **`defer`**: 适用于需要按照顺序执行但又不想阻塞页面渲染的脚本。脚本会异步加载，但在HTML解析完成后，DOMContentLoaded事件触发之前，按照脚本在文档中的顺序执行。
- **`async`**: 适合那些独立的、不依赖于页面其他脚本的异步加载和执行。脚本同样异步加载，但加载完成后会立即执行，不保证执行顺序，也不等待其他脚本或HTML解析。

综上，将JavaScript文件放置在文档的不同位置以及是否使用`defer`或`async`属性，是根据脚本的具体需求和对页面加载性能的影响来决定的。