---
title: 为vue3中常用的属性添加ts类型
tags:
  - vue3
  - ts
date: 2023-09-18
cover: https://s2.loli.net/2023/09/18/TNK3EyHURYGpDks.jpg
---

# 为 vue3中常用的属性添加 ts 类型

## 为 props 添加类型

我们在 vue2 中常用的这种方式被称之为运行时声明，因为传递给 defineProps 的参数会作为运行时的 props 选项使用：

```js
const props = defineProps({
  foo: {
    type: String,
    required: true
  },
  bar: Number
})
//string
props.foo
//number || undefined
props.bar
```

在 vue3 中使用的是泛型参数来定义 props 的参数，这种被称之为基于类型的声明，编译器会尽可能的尝试根据类型参数推导出等价的运行时选项，但是这种不能给参数的默认值，所以我们需要使用 `withDefaults` 来定义默认值：

```js
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['listen', 'read']
})
```

上面的代码会被编译为运行时的 `default` 的选项

如果没有使用 `script setup` 的话需使用 `defineComponent` 来定义：

```js
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    //string
    props.message
  }
})
```

## 为 emits 添加类型

emits 函数的类型也分为运行时声明和基于类型的声明：

```js
const emits = defineEmits(['update:res', 'update:data'])

const emits = defineEmits<{
  (e: 'update:res', darkMode: boolean): void
  (e: 'update:data', id: number): void
}>()

// 也可以额外定义类型
interface Emits {
  (e: 'update:dark', darkMode: boolean): void
  (e: 'update:data', id: number): void
}

const emit = defineEmits<Emits>()
```

## 为 ref 添加类型

默认情况下，ref 会根据初始值自动推导其类型：

```js
const num = ref(1)
// TS Error:不能将类型string分配给类型number
num.value = '2'
```

如果我们想为 ref 的值指定一个更复杂的类型，可以引入 Ref 这个接口：

```js
import { ref } from 'vue'
import type { Ref } from 'vue'

const num: Ref<number | string> = ref(1)
num.value = '2'
```

如果我们指定了一个泛型参数但没有给出初始值，那么最后会得到一个包含 `undefined` 的联合类型

## 为 reactive 添加类型

reactive 也会隐式的从他的参数中推导出类型

```js
import { reactive } from 'vue'

const data = reactive({
  title: 'aaa'
})
// Vue: Property add does not exist on type { title: string; }
data.add = 12
```

通过接口指定类型：

```js
import { reactive } from 'vue'

interface Data {
  title: string
  num?: number
}

const data: Data = reactive({
  title: 'aaa'
})
data.num = 111
```

## 为 computed 添加类型

computed 会自动从计算函数的返回值上推导出类型：

```js
import { ref, computed } from 'vue'

const count = ref(0)

const double = computed(() => count.value * 2)
// Vue: Property split does not exist on type number
const result = double.value.split('')
```

通过泛型来显示的指定类型：

```js
const double = computed < number > (() => {})
```

## 为事件处理函数添加类型

在处理事件时，应该给事件处理函数的参数正确的标注类型，如果没有标准类型的话，会被隐式的标注为 `any` 类型：

```js
function handleChange(event) {
  // Vue: Parameter event implicitly has an any type, but a better type may be inferred from usage.
  console.log(event.target.value)
}
```

因此我们需要显式的添加参数类型：

```js
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## 为 provide 和 inject 添加类型

`provide` 和 `inject` 会在不同的组件中运行，`vue` 提供了一个 `InjectionKey` 的接口，它继承自 Symbol 的泛型类型，可以用来在提供者和消费者之间同步注入值的类型：

```js
import { inject, provide } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol('abc') as InjectionKey<string>

provide(key, 'foo')
const foo = inject(key)
```

## 为 dom 添加类型

当我们使用 ref 的时候我们可以通过一个显式指定的泛型参数和一个初始值 `null` 来创建：

```js
import { onMounted, ref } from 'vue'

const el = (ref < HTMLInputElement) | (null > null)
onMounted(() => {
  el.value?.focus()
})
```

有时候我们需要为子组件添加一个 ref 用来调用子组件的方法和属性，为了获取子组件的类型，我们首先通过 typeof 获取到类型，然后在使用 InstanceType 工具类型来获取当前实例的类型：

```js
import { ref } from 'vue'
import child from './child.vue'

const modal = ref < InstanceType < typeof child >> null

const open = () => {
  modal.value?.open()
}
```
