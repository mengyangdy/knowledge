# 自定义ESLint规则集

一个自定义的ESLint配置工具，它提供了一种灵活且可扩展的方式来配置和管理ESLint规则

## 项目亮点

1. 模块化和可组合性：通过将配置分解为多个模块(如gitignore、node、import)等等，用户可以轻松地组合和重用配置
2. 自动化工具安装：使用ensurePackages函数自动安装顺序的npm包，简化了配置过程
3. 预设规则集：提供了一系列的预设的规则集
4. prettier集成：集成Prettier规则，实现了代码风格和格式的统一管理
5. 动态规则加载：根据文件类型和项目需求动态加载相应的ESLint规则
6. 覆盖多语言和框架：支持JavaScript、TypeScript、Vue、React等多种语言和框架

## 项目原理

1. 配置合并：使用`createOptions`函数合并用户配置和默认配置，生成最终的配置对象
2. 规则集生成：通过各个文件（如`javascript.ts`、`typescript.ts`等）生成针对不同语言和框架的规则集
3. 插件和解析器加载：使用`interopDefault`函数动态加载ESLint插件和解析器，如`@typescript-eslint/parser`
4. 规则覆盖和扩展：通过`getOverridesRules`函数处理用户自定义的规则覆盖和扩展
5. 文件盒目录忽略：使用`createGitignoreRule`函数生成基于`.gitignore`的忽略规则
6. 条件安装：根据项目需求和配置，条件性地安装必要的npm包
7. 配置输出：最终，`defineConfig`函数将所有配置合并，并输出一个完整的ESLint配置数组