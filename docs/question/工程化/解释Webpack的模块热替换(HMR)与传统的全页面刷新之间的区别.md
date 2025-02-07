---
title: 解释Webpack的模块热替换(HMR)与传统的全页面刷新之间的区别?
tags:
  - 构建打包工具
  - 面试题
date: 2024-05-29
---
# 一 解释Webpack的模块热替换(HMR)与传统的全页面刷新之间的区别?

Webpack 的模块热替换（Hot Module Replacement，简称 HMR）与传统的全页面刷新之间存在几个关键区别，主要体现在开发效率、用户体验和状态保持方面：

1. **开发效率**:
    
    - **HMR**: 使用 HMR，当开发者修改代码后，只有相关的模块会被即时更新，无需等待整个页面重新加载。这意味着开发者可以立即看到修改的效果，显著提高了开发效率，尤其是在大型项目中，因为它减少了等待时间。
    - **全页面刷新**: 传统方式下，每次代码修改后，开发者都需手动刷新页面或设置自动刷新，导致整个页面重新加载。这不仅耗时，而且在处理大型应用时，每次刷新都会丢失当前状态，需要重新导航至之前的测试位置，效率较低。
2. **用户体验**:
    
    - **HMR**: 用户界面的更新是在后台无缝进行的，用户几乎感觉不到任何中断，即使在开发阶段也能提供接近成品的流畅体验。这对于开发包含复杂交互或表单填写等状态敏感应用尤其重要。
    - **全页面刷新**: 每次刷新都会导致页面状态的重置，用户需要重新进行之前的交互操作，这对于用户体验来说是破坏性的，尤其是当处理长表单或复杂的多步骤流程时。
3. **状态保持**:
    
    - **HMR**: HMR 最大的优点之一是能够保持应用的状态。即使模块被替换，用户界面的状态（如滚动位置、表单数据、组件内部状态等）也会被保留，这对于调试和迭代非常有利。
    - **全页面刷新**: 刷新页面会导致所有JavaScript运行时状态丢失，包括DOM操作、变量值、事件监听器等，这要求开发者在每次刷新后重新创建这些状态，增加了调试难度。
4. **资源消耗**:
    
    - **HMR**: 仅更新必要的模块，减少了网络和计算资源的消耗，特别是在连续迭代开发过程中。
    - **全页面刷新**: 每次刷新都会重新下载所有相关资源，包括HTML、CSS、JavaScript等，即便它们没有变动，这无疑增加了不必要的网络流量和处理负担。

总之，HMR 是一种提升开发效率和用户体验的技术，特别适合在开发阶段频繁迭代和测试时使用，而全页面刷新则是较为基础且较为粗犷的更新方式，更适合最终用户访问已部署的生产环境网页。

