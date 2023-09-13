---
title: 使用eslint-plugin-import插件对导入的模块排序
tags:
  - eslint
date: 2023-09-13
cover: https://s2.loli.net/2023/09/13/E3pa6wJsACflSuP.jpg
---
# 使用 eslint-plugin-import 插件对导入的模块排序

> 当一个页面很大的时候，我们会发现各种 import、内部组件、外部组件、各种引入等等都在一起，可能会有个几十行，看着实在是比较杂乱。
> 而 eslint-plugin-import 插件可以对导入的模块进行排序，排序后的代码可以按照内部方法、外部库、组件等等依次排列。

```json
'import/order': [
  'error',
  {
    // 对导入模块进行分组
    groups: [
      'builtin',
      'external',
      ['internal', 'parent', 'sibling', 'index', 'object', 'type'],
      'unknown'
    ],
    // 通过路径自定义分组
    pathGroups: [
      {
        // pattern：当前组中模块的最短路径匹配
        pattern: '@app/**',        // 在规定的组中选其一，index、sibling、parent、internal、external、builtin、object、type、unknown
        group: 'external',
        // 定义组的位置，after、before
        position: 'after'
      }
    ],
    pathGroupsExcludedImportTypes: ['builtin'],
    // newlines-between 不同组之间是否进行换行
    'newlines-between': 'always',
    // alphabetize 根据字母顺序对每个组内的顺序进行排序
    alphabetize: {
      order: 'asc',
      caseInsensitive: true
    }
  }
]
```

## import/order 配置解析

### group

对导入模块进行分组
- `builtin`：内置模块
- `external`：外部模块
- `internl`：内部引用
- `sibling`：兄弟依赖
- `parent`：父级依赖
- `index`：index 文件依赖
- `object`：导入 ts 中的一个对象
- `type`：导入 ts 中的 type 类型
- `unknown`：未知依赖

### pathGroups

可以通过该配置设置别名，进行一些自定义路径分组。

- `pattern`：该组中模块的最短匹配路径（不会用于内置或外部）
- `group`：在规定的组中选择一个，pathGROUP 将位于该组的上面或者下面
- `position`：定义了 pathGroup 在所选择组的位置，可以是 after 或者 before，如果未提供，则 pathGroup 将像组一样定位
- `patternOptions`：最短匹配的选择，默认值：nocomment: true。即禁止将 #开头的视为注释的行为

例如：对项目中的 vue、vue-router、@/component 等引入进行排序：

```js
pathGroups: [
    {
        pattern: 'vue',
        group: 'external',
        position: 'before'
    },
    {
        pattern: 'vue-router',
        group: 'external',
        position: 'before'
    },
    {
        pattern: 'pinia',
        group: 'external',
        position: 'before'
    },
]
```

### pathGroupsExcludedImportTypes

这个属性需要传入一个字符串数组，定义了那些类库不需要被 `group` 处理，比如说 vue、react、vue-router、pinia 等等，这些我们自己自定义 `pathGroups` 即可，不需要自定义 `group` 来处理

```js
pathGroupsExcludedImportTypes: ['vue', 'vue-router', 'pinia', 'naive-ui']
```
