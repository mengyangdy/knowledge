---
title: 说明npm在安装一个包时到底经历了什么过程?
tags:
  - 构建打包工具
  - 面试题
date: 2024-05-29
---
# 一 说明npm在安装一个包时到底经历了什么过程?

当使用npm（Node Package Manager）安装一个包时，它会经历一系列步骤来确保包及其依赖被正确地下载、解析和安装到本地或全局环境中。以下是npm安装包时的典型过程：

1. **解析依赖**:
    
    - 首先，npm会读取项目的`package.json`文件（如果存在的话），以确定要安装的包及其版本范围。
    - 如果没有`package.json`，npm会根据命令行中指定的包名和版本来决定安装哪个包。
2. **查询注册表**:
    
    - npm连接到npm registry（通常是[https://registry.npmjs.org/），查找指定包的元数据，包括版本信息、依赖关系列表、作者信息等。](https://registry.npmjs.org/%EF%BC%89%EF%BC%8C%E6%9F%A5%E6%89%BE%E6%8C%87%E5%AE%9A%E5%8C%85%E7%9A%84%E5%85%83%E6%95%B0%E6%8D%AE%EF%BC%8C%E5%8C%85%E6%8B%AC%E7%89%88%E6%9C%AC%E4%BF%A1%E6%81%AF%E3%80%81%E4%BE%9D%E8%B5%96%E5%85%B3%E7%B3%BB%E5%88%97%E8%A1%A8%E3%80%81%E4%BD%9C%E8%80%85%E4%BF%A1%E6%81%AF%E7%AD%89%E3%80%82)
3. **解析依赖树**:
    
    - npm会分析目标包及其所有依赖的依赖关系，生成一个依赖树。这个过程确保了所有依赖项及其子依赖项都被考虑在内，并且按照正确的版本安装。
4. **下载包**:
    
    - 根据依赖树，npm开始从npm registry下载所有需要的包。这些包以压缩格式（通常是`.tar.gz`）下载到本地的`.npm`缓存目录。
5. **完整性校验**:
    
    - 下载完成后，npm会对每个包进行完整性校验，确保包没有被篡改。这通常通过校验包的SHA哈希值来完成。
6. **解压和安装**:
    
    - 一旦验证了包的完整性，npm会解压缩这些包，并将其安装到适当的位置。本地安装的包会被放在项目的`node_modules`目录下，而全局安装的包会被安装到一个全局的目录，该目录取决于操作系统和npm的配置。
7. **生命周期脚本**:
    
    - 在安装每个包的过程中，npm会执行包中定义的生命周期脚本，如`preinstall`, `install`, `postinstall`等。这些脚本可以用于自定义安装过程，比如编译源码、创建符号链接、执行测试等。
8. **链接**:
    
    - 对于本地安装的包，npm会创建必要的符号链接，使得项目可以访问这些包的模块。
9. **生成或更新package-lock.json**:
    
    - 安装完成后，npm会生成或更新`package-lock.json`文件，该文件锁定每个依赖的具体版本和子依赖的版本，确保在不同环境中安装得到相同的结果。
10. **完成**:
    
    - 安装结束后，npm会显示安装的包及其版本，以及其他相关信息，如是否有警告或错误。

