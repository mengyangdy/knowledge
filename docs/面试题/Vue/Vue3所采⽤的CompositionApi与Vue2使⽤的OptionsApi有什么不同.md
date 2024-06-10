---
title: Vue3所采⽤的CompositionApi与Vue2使⽤的OptionsApi有什么不同?
tags:
  - vue
  - 面试题
date: 2024-06-10
---

# 一 Vue3所采⽤的CompositionApi与Vue2使⽤的OptionsApi有什么不同?

## 1.1 开始之前

Composition API 可以说是 Vue3 的最⼤特点，那么为什么要推出 Composition Api ，解决了什么问题？

通常使⽤ Vue2 开发的项⽬，普遍会存在以下问题：
- 代码的可读性随着组件变⼤⽽变差
- 每⼀种代码复⽤的⽅式，都存在缺点
- TypeScript⽀持有限

以上通过使⽤ Composition Api 都能迎刃⽽解

## 1.2 正⽂

### 1.2.1 Options Api
Options API，即⼤家常说的选项API，即以 vue 为后缀的⽂件，通过定义 methods，computed，watch，data 等属性与方法，共同处理⻚⾯逻辑

Options 代码编写⽅式，如果是组件状态，则写在 data 属性上，如果是⽅法，则写在 methods 属性上...

⽤组件的选项 (data、computed、methods、watch) 组织逻辑在⼤多数情况下都有效

然⽽，当组件变得复杂，导致对应属性的列表也会增⻓，这可能会导致组件难以阅读和理解

### 1.2.2 Composition Api
在 Vue3 Composition API 中，组件根据逻辑功能来组织的，⼀个功能所定义的所有 API 会放在⼀起（更加的⾼内聚，低耦合）

即使项⽬很⼤，功能很多，我们都能快速的定位到这个功能所⽤到的所有 API

### 1.2.3 对⽐
下⾯对 Composition Api 与 Options Api 进⾏两⼤⽅⾯的⽐较
- 逻辑组织
- 逻辑复⽤

#### 1.2.3.1 逻辑组织

**Options API**

假设⼀个组件是⼀个⼤型组件，其内部有很多处理逻辑关注点,这种碎⽚化使得理解和维护复杂组件变得困难,选项的分离掩盖了潜在的逻辑问题。此外，在处理单个逻辑关注点时，我们必须不断地“跳转”相关代码的选项块

**Compostion API**

⽽ Compositon API 正是解决上述问题，将某个逻辑关注点相关的代码全都放在⼀个函数⾥，这样当需要修改⼀个功能时，就不再需要在⽂件中跳来跳去

下⾯举个简单例⼦，将处理 count 属性相关的代码放在同⼀个函数了

```JS
function useCount() {
let count = ref(10);
let double = computed(() => {
return count.value * 2;
});
const handleConut = () => {
count.value = count.value * 2;
};
console.log(count);
return {
count,
double,
handleConut,
};
}
```

组件上中使⽤ count

```JS
export default defineComponent({
setup() {
const { count, double, handleConut } = useCount();
return {
count,
double,
handleConut
}
},
});
```

Composition API 在逻辑组织⽅⾯的优势，以后修改⼀个属性功能的时候，只需要跳到控制该属性的⽅法中即可

#### 1.2.3.2 逻辑复⽤

在 Vue2 中，我们是⽤过 mixin 去复⽤相同的逻辑

下⾯举个例⼦，我们会另起⼀个 mixin.js ⽂件

```JS
 export const MoveMixin = {
 data() {
 return {
 x: 0,
 y: 0,
 };
 },
 methods: {
 handleKeyup(e) {
 console.log(e.code);
 // 上下左右 x y
 switch (e.code) {
 case "ArrowUp":
 this.y--;
 break;
 case "ArrowDown":
 this.y++;
 break;
 case "ArrowLeft":
 this.x--;
 break;
 case "ArrowRight":
 this.x++;
 break;
 }
 },
 },
 mounted() {
 window.addEventListener("keyup", this.handleKeyup);
 },
 unmounted() {
 window.removeEventListener("keyup", this.handleKeyup);
 },
 };
```

然后在组件中使⽤

```JS
 <template>
 <div>
 Mouse position: x {{ x }} / y {{ y }}
 </div>
 </template>
 <script>
 import mousePositionMixin from './mouse'
 export default {
 mixins: [mousePositionMixin]
 }
 </script>
```

使⽤单个 mixin 似乎问题不⼤，但是当我们⼀个组件混⼊⼤量不同的 mixins 的时候

```JS
mixins: [mousePositionMixin, fooMixin, barMixin, otherMixin]
```

会存在两个⾮常明显的问题：
- 命名冲突
- 数据来源不清晰

现在通过 Compositon API 这种⽅式改写上⾯的代码

```JS
 import { onMounted, onUnmounted, reactive } from "vue";
 export function useMove() {
 const position = reactive({
 x: 0,
 y: 0,
 });
 const handleKeyup = (e) => {
 console.log(e.code);
 // 上下左右 x y
 switch (e.code) {
 case "ArrowUp":
 // y.value--;
 position.y--;
 break;
 case "ArrowDown":
 // y.value++;
 position.y++;
 break;
 case "ArrowLeft":
 // x.value--;
 position.x--;
 break;
 case "ArrowRight":
 // x.value++;
 position.x++;
 break;
 }
 };
 onMounted(() => {
 window.addEventListener("keyup", handleKeyup);
 });
 onUnmounted(() => {
 window.removeEventListener("keyup", handleKeyup);
 });
 return { position };
 }
```

在组件中使⽤

```JS
 <template>
 <div>
 Mouse position: x {{ x }} / y {{ y }}
 </div>
 </template>
 <script>
 import { useMove } from "./useMove";
 import { toRefs } from "vue";
 export default {
 setup() {
 const { position } = useMove();
 const { x, y } = toRefs(position);
 return {
 x,
 y,
 };
 },
 };
 </script>
```

可以看到，整个数据来源清晰了，即使去编写更多的 hook 函数，也不会出现命名冲突的问题

## 1.3 ⼩结

- 在逻辑组织和逻辑复⽤⽅⾯， Composition API 是优于 Options API
- 因为 Composition API ⼏乎是函数，会有更好的类型推断。
- Composition API 对 tree-shaking 友好，代码也更容易压缩
- Composition API 中⻅不到 this 的使⽤，减少了 this 指向不明的情况
- 如果是⼩型组件，可以继续使⽤ Options API ，也是⼗分友好的

 