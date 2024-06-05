---
title: Webpack的构建流程中有哪些关键的生命周期钩子?
tags:
  - 构建打包工具
  - 面试题
date: 2024-05-29
---
# 一 Webpack的构建流程中有哪些生命周期钩子?

Webpack 的构建流程涉及到一系列的生命周期钩子（Hooks），这些钩子允许开发者在不同的构建阶段插入自定义逻辑。Webpack 的核心构建流程主要围绕着两个关键对象：`Compiler` 和 `Compilation`，这两个对象都继承自 `Tapable` 类，提供了丰富的钩子以供扩展。以下是一些重要的生命周期钩子：

## 1.1 Compiler 钩子

- `beforeRun`: 在运行开始之前执行，但仅在 `watch` 模式下可用。
- `run`: 在编译器开始执行时调用。
- `watchRun`: 在 `watch` 模式下，每次文件系统发生变化重新编译前调用。
- `normalModuleFactory`: 创建 NormalModuleFactory 时调用。
- `contextModuleFactory`: 创建 ContextModuleFactory 时调用。
- `environment`: 在编译器准备环境时调用，时机在配置文件中初始化插件之后。
- `afterEnvironment`: 当编译器环境设置完成后，在 `environment` 钩子之后调用。
- `entryOption`: 入口配置选项处理后调用。
- `thisCompilation`: 创建一个新的 `Compilation` 对象时调用。
- `compilation`: 每次编译开始时调用，可以用来修改或增加编译时的行为。
- `make`: 在编译开始实际“制作”模块之前调用。
- `emit`: 在所有模块被处理并且资源即将被写入磁盘时调用。
- `done`: 编译完成时调用，无论是否成功。

## 1.2 Compilation 钩子

- `optimizeDependenciesBasic`: 优化依赖关系的基本阶段开始时调用。
- `optimizeDependenciesAdvanced`: 优化依赖关系的高级阶段开始时调用。
- `optimizeChunksBasic`: 优化 chunks 的基本阶段开始时调用。
- `optimizeChunksAdvanced`: 优化 chunks 的高级阶段开始时调用。
- `optimizeModulesBasic`: 优化模块的基本阶段开始时调用。
- `optimizeModulesAdvanced`: 优化模块的高级阶段开始时调用。
- `optimizeChunkModulesBasic`: 优化 chunk 中模块的基本阶段开始时调用。
- `optimizeChunkModulesAdvanced`: 优化 chunk 中模块的高级阶段开始时调用。
- `reviveModules`: 在恢复持久化状态时调用，用于模块的重用。
- `optimizeModuleOrder`: 在模块排序优化之前调用。
- `advancedOptimizeModuleOrder`: 在高级模块排序优化之前调用。
- `optimizeModuleIds`: 在模块ID优化之前调用。
- `optimizeChunkIds`: 在 chunk ID 优化之前调用。
- `beforeHash`: 在计算编译哈希之前调用。
- `afterHash`: 在计算编译哈希之后调用。
- `needAdditionalSeal`: 在需要额外封存阶段时调用。
- `shouldRecord`: 在询问是否应该记录模块状态时调用。
- `recordModules`: 在记录模块状态时调用。
- `recordChunks`: 在记录 chunks 状态时调用。
- `additionalChunkAssets`: 在添加额外 chunk 资产时调用。
- `additionalAssets`: 在添加额外资产时调用。
- `optimizeChunkAssets`: 在 chunk 资产优化之前调用。
- `optimizeAssets`: 在资产优化之前调用。
- `afterOptimizeAssets`: 在资产优化之后调用。
- `afterSeal`: 在编译过程密封（完成处理）之后调用。
- `beforeEmit`: 在 emit 阶段开始之前调用。
- `assetEmitted`: 当一个资产被发出到磁盘时调用。
- `afterEmit`: 在所有资产被写出到磁盘之后调用。

这些钩子允许开发者在Webpack构建的不同阶段插入逻辑，比如修改模块、注入额外的处理、优化资源、或是在编译结束时执行自定义操作。通过利用这些钩子，可以高度定制Webpack的构建流程，以满足特定项目的需求。

在Webpack的构建流程中，有几个关键的钩子特别重要，它们允许开发者在核心构建阶段插入自定义逻辑。以下是几个最为关键的钩子：

## 1.3 Compiler 钩子

1. **compile**: 当开始一个新的编译时调用，这是执行自定义逻辑以准备编译的理想时机，比如清空输出目录或设置全局变量。
    
2. **make**: 在编译过程中，所有模块准备就绪即将开始处理之前调用。适合做最后的全局配置调整。
    
3. **emit**: 在所有模块处理完毕，即将写入输出文件到磁盘时触发。常用于修改输出文件或追加额外资源。
    
4. **done**: 编译完成后的回调，无论是成功还是失败都会触发。常用于清理操作、报告生成或通知外部服务。
    

### Compilation 钩子

1. **optimizeChunksAdvanced**: 在 chunks 优化的高级阶段调用，可以用来调整 chunk 的分割策略或优化输出。
    
2. **optimizeModulesAdvanced**: 在模块优化的高级阶段调用，可以对模块进行额外的优化处理，如进一步的Tree Shaking。
    
3. **optimizeAssetModules**: 优化 asset 模块（Webpack 5 引入的特性），在处理资源模块时调用。
    
4. **seal**: 在编译过程中的密封阶段调用，此时所有模块和 chunk 的信息已被确定，但尚未生成最终输出。适合做最终的检查或修改。
    
5. **optimizeChunkAssets**: 在对 chunk 中的资产进行优化时调用，可以用来压缩或修改输出的资源文件。
    
6. **additionalAssets**: 在所有标准资产处理完成后，允许插件添加额外的资产到输出目录。
    

### 通用重要钩子

- **thisCompilation**: 新的 `Compilation` 对象创建时调用，是进行编译层面配置的好时机。
    
- **compilation**: 每次编译开始时触发，用于配置编译时行为，如处理loader结果或修改模块。
    
- **afterEmit**: 所有文件已经发出到磁盘后调用，适合执行文件系统级别的后续操作，如文件校验或上传。
    

通过这些关键钩子，开发者可以深度介入到Webpack的构建流程中，实现高度定制化的构建逻辑，优化性能，或集成特定的工具和服务。

