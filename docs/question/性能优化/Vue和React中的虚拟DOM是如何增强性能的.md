---
title: Vue和React中的虚拟DOM是如何增强性能的?
tags:
  - 性能优化
  - 面试题
date: 2024-05-29
---
# 一 Vue和React中的虚拟DOM是如何增强性能的?

Vue和React中的虚拟DOM（Virtual DOM）是一种提高前端应用性能的技术，它通过减少对真实DOM的操作来提升UI渲染的效率。以下是虚拟DOM增强性能的主要方式：

## 1.1 减少DOM操作

1. **内存中表示**: 虚拟DOM实际上是在内存中用JavaScript对象树来表示的真实DOM结构的轻量级副本。相比直接操作DOM树，修改JavaScript对象更快，因为它们不需要引发浏览器的布局和绘制操作。
    
2. **批量更新**: 当应用状态改变时，框架首先在虚拟DOM上执行变更，计算出虚拟DOM树的差异（diff）。这个过程发生在内存中，速度很快。然后，框架会将这些差异批量应用到真实DOM上，而不是立即应用每个微小的变化，减少了重绘和回流的次数。
    

## 1.2 差异算法（Diffing）

3. **最小化变更**: 虚拟DOM的核心优势在于其高效的“diff”算法，该算法能快速找出虚拟DOM树与上次渲染的树之间的最小差异。这意味着框架只需要更新实际发生变更的部分，而不是盲目地重新渲染整个界面。
    
4. **精确更新**: 通过diff算法识别出需要变更的部分后，框架仅对这些部分进行更新，从而节省了大量不必要的DOM操作，提高了性能。
    

## 1.3 高效的重渲染控制

5. **组件化**: Vue和React都采用了组件化的开发模式，虚拟DOM使得组件的更新更加独立，只有当组件的props或state发生变化时，该组件对应的DOM部分才会重新渲染，进一步减少了不必要的工作。
    
6. **状态驱动**: 通过响应式的数据绑定，当数据模型变化时，自动触发视图的更新。虚拟DOM确保了这种更新是高效且精准的。
    

## 1.4缓存与重用

7. **重用未变更的节点**: 在diff过程中，如果虚拟节点没有变化，则对应的DOM节点也可以直接重用，避免了不必要的DOM创建和销毁。

