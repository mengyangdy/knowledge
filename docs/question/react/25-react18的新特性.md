# 25.react18的新特性

## 1. 批处理

当用户点击按钮产生了两次的state更新的时候，按理说应该渲染两次，但是这两次更新完全可以合成一次，从而减少render带来的性能损失，在React18中这种批处理不仅仅在于原生事件内部的更新还扩大了范围：Promise、setTimeout等等

## 2. flushSync

如果想退出批处理需要使用flushSync

## 3. startTransition

过度是一个新概念，用于区分紧急和非紧急的更新

紧急更新反应了直接交互、键入、单机、按下等操作

非紧急更新就是网络请求、渲染UI

我们一般把非紧急的放在startTransition中执行

useTransition是他的Hook版本



## 4. useId

它是一个新Hook，用于在客户端和服务器上生成唯一ID，避免了水合不统一的流程

当我们在使用服务端渲染的时候会遇到一个问题：如果当前组件已经在服务端渲染过了，但是在客户端我们并没有什么手段知道这个事情，于是客户端还会重新再渲染一次，这就造成了冗余的渲染

## 5. createRoot

使用createRoot创建一个root，然后通过root.render渲染页面