# v-if和v-for那个优先级高，并说明产生什么后果

在Vue2中v-for优先级比v-if优先级高，也就是先执行v-for在执行v-if

在Vue3中v-if优先级比v-for优先级高

**产生的后果**：当有这种现象出来的时候对我们开发而言，需要小心使用这个api，因为vue3和vue2是不一样的效果，这对我们产生了心智负担，所以不要同时使用v-for和v-if

eslint-plugin-vue中有一个规则`no-use-v-if-with-v-for`可以加解决这个问题