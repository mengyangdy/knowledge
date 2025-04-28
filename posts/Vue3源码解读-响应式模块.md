---
title: Vue3源码解读-响应式模块
description: 
tags: [Vue3，源码，响应式]
date: 2025-04-05
---

## 1. 响应式系统概述

Vue3 的响应式系统是其核心创新之一，相比 Vue2 基于 Object.defineProperty 的实现，Vue3 全面转向 Proxy 代理方案，带来了显著的性能提升和功能扩展。整个系统可分为六大核心模块：

1. 响应式基础 (reactive) ：创建响应式对象的入口
2. 依赖管理 (effect) ：副作用跟踪与调度核心
3. 值类型响应式 (ref) ：原始值响应式解决方案
4. 计算属性 (computed) ：基于缓存的派生值
5. 侦听器 (watch) ：响应式数据变化监听
6. 作用域管理 (effectScope) ：Effect 生命周期控制

## 2. 核心模块解析

### 2.1 reactive模块

reactive是创建响应式对象的核心方法，Vue3 使用 ES6 Proxy 作为响应式实现的基础：

```javascript
export function reactive(target) {
  return createReactiveObject(target);
}
const reactiveMap = new WeakMap(); // 防止内存泄露的
// 响应式对象的核心逻辑

function createReactiveObject(target) {
  if (!isObject(target)) {
    return;
  }
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }
  // 防止同一个对象被代理两次，返回的永远是同一个代理对象
  let exitstingProxy = reactiveMap.get(target);
  if (exitstingProxy) {
    return exitstingProxy;
  }
  // 返回的是代理对象
  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  // 代理前 代理后做一个映射表
  // 如果用同一个代理对象像做代理，直接返回上一次的代理结果
  return proxy;
}
```

它的主要作用是通过Proxy代理目标对象，通过`reactiveMap`缓存已代理的对象，避免重复代理，通过IS_REACTIVE标识用于识别是否是响应式对象，如果是嵌套对象自动代理，get时自动代理嵌套的对象。

### 2.2 基础代理处理器

```javascript
export const mutableHandlers = {
  // 原始对象 属性  代理对象
  get(target, key, recevier) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    track(target, key);
    let result = Reflect.get(target, key, recevier);
    if (isObject(result)) {
      // 如果取到的是一个对象 则需要继续将这个对象作为代理对象
      return reactive(result);
    }
    return result;
  },
  set(target, key, value, recevier) {
    let oldValue = target[key];
    let flag = Reflect.set(target, key, value, recevier);
    if (value !== oldValue) {
      trigger(target, key, value, oldValue);
    }
    return flag;
  },
};
```

核心方法：

1. get拦截器
   1. 处理内置标识符属性访问
   2. 对于数组方法进行特殊的处理
   3. 自动收集依赖
   4. 嵌套对象自动代理
2. set拦截器
   1. 值变化检测
   2. 类型检测
   3. 触发依赖更新
   4. 数组长度变化处理
3. has拦截器
   1. 处理in操作符
   2. 收集依赖
4. deleteProperty
   1. 处理属性删除
   2. 触发更新

### 2.3 依赖管理系统effect

```javascript
export let activeEffect = undefined;
function cleanupEffect(effect) {
  // {name:set(effect)} 属性对应的effect

  // 找到 deps中的set 清理掉effect才可以
  let deps = effect.deps;
  for (let i = 0; i < deps.length; i++) {
    // effect.deps = [newSet(),newSet(),newSet()]
    deps[i].delete(effect); // 删除掉 set中的effect
  }
  effect.deps.length = 0; // 让effect中的deps直接清空
}
export class ReactiveEffect {
  parent = undefined;
  active = true;
  // this.scheduler
  constructor(public fn, public scheduler?) {
    recordEffectScope(this);
  }
  deps = []; // effect中要记录哪些属性是在effect中调用的
  run() {
    // 当运行的时候 我们需要将属性和对应的effect关联起来
    // 利用js是单线程的特性，先放在全局，在取值
    if (!this.active) {
      return this.fn();
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      cleanupEffect(this);
      return this.fn(); // 触发属性的get 依赖收集，在调用用户函数的时候会发生取值操作
    } finally {
      activeEffect = this.parent;
      this.parent = undefined;
    }
  }
  stop() {
    if (this.active) {
      this.active = false;
      cleanupEffect(this);
    }
  }
}
// 属性和effect之间是什么样的关系 依赖收集
// 1:1
// 1:n
// n:n ✅

export function effect(fn, options: any = {}) {
  // 将用户的函数，拿到变成一个响应式的函数
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // 默认让用户的函数执行一次
  _effect.run();

  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
```

关键机制:

1. 嵌套处理：通过parent链实现effect的嵌套功能
2. 循环检测：防止effect内部触发自身导致无限循环
3. 清理策略：每次运行前清理旧依赖
4. 失活机制：stop后不再触发

#### 2.3.1 依赖收集系统

```javascript
const targetMap = new WeakMap();
function track(target, key) {
  if (activeEffect) {
    // 当前这个属性实在effect中使用的我才收集，否则不收集
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }
    trackEffects(dep); // 收集set中
  }
}
//  { name: 'jw', age: 30 } -> {name => [effect,effect]}
function trigger(target, key, value, oldValue) {
  // 找到effect执行即可
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let effects = depsMap.get(key);
  triggerEffects(effects);
}
export function triggerEffects(effects) {
  if (effects) {
    effects = [...effects]; // vue2中的是数组，先拷贝在魂环
    effects.forEach((effect) => {
      // 当前正在执行的和现在要执行的是同一个我就屏蔽掉
      if (activeEffect !== effect) {
        if (effect.scheduler) {
          // 应该执行的是scheduler
          effect.scheduler();
        } else {
          effect.run(); // 里面有删除+添加的逻辑
        }
      }
    });
  }
}
export function trackEffects(dep) {
  let shouldTrack = !dep.has(activeEffect);
  if (shouldTrack) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
    // 这里让effect也记录一下有哪些属性
  }
}
```

设计要点：

1. 使用三级存储结构：WeakMap==>Map==>Set
2. 双向记录：effect记录deps便于清理，属性通过WeakMap记录使用它的effect
3. 条件收集：通过`shouldTrack`控制是否收集依赖

### 2.4 Ref系统实现

```javascript
export function ref(value) {
  return new RefImpl(value);
}
// computed + watch
class RefImpl {
  _value;
  __v_isRef = true;
  dep = new Set();
  // 内部采用类的属性访问器 -》 Object.defineProperty
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }
  get value() {
    if (activeEffect) {
      trackEffects(this.dep);
    }
    return this._value;
  }
  set value(newVal) {
    if (newVal !== this.rawValue) {
      this.rawValue = newVal;
      this._value = toReactive(newVal);
      triggerEffects(this.dep);
    }
  }
}
// ref 代理的实现
class ObjectRefImpl {
  __v_isRef = true;
  constructor(public object, public key) {}
  get value() {
    return this.object[this.key];
  }
  set value(val) {
    this.object[this.key] = val;
  }
}
```

核心特性：

1. 自动解包：嵌套对象自动转为reactive
2. 变化检测：严格比较避免不必要的更新

### 2.4 工具函数的实现

```javascript
export function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}

export function toRefs(object) {
  let res = {};
  for (let key in object) {
    res[key] = toRef(object, key);
  }
  return res;
}

export function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, recevier) {
      let r = Reflect.get(target, key, recevier);
      return r.__v_isRef ? r.value : r;
    },
    set(target, key, value, recevier) {
      const oldValue = target[key];
      if (oldValue.__v_isRef) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, recevier);
      }
    },
  });
}
```

功能解析：

1. toRef：保持对响应式对象属性的引用
2. toRefs:结构响应式对象不丢失响应性
3. proxyRefs：模版中自动解包ref

### 2.6 计算属性的实现

```javascript
class ComputedRefImpl {
  effect;
  _value;
  dep = new Set();
  __v_isRef = true;
  _dirty = true;
  constructor(public getter, public setter) {
    // 计算属性就是一个effect 会让getter中的属性收集这个effect
    this.effect = new ReactiveEffect(getter, () => {
      // ...
      if (!this._dirty) {
        this._dirty = true; // 让计算属性标记为脏值
        triggerEffects(this.dep);
      }
    });
  }
  get value() {
    if (activeEffect) {
      // value => [effect]
      trackEffects(this.dep);
    }
    if (this._dirty) {
      this._dirty = false;
      // 取值让getter执行拿到返回值，作为计算属性的值
      this._value = this.effect.run();
    }
    return this._value;
  }
  set value(val) {
    // 修改时触发setter即可
    this.setter(val);
  }
}
export function computed(getterOrOptions) {
  const isGetter = isFunction(getterOrOptions);
  let getter;
  let setter;
  if (isGetter) {
    getter = getterOrOptions;
    setter = () => {
      console.warn("computed is readoly");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  return new ComputedRefImpl(getter, setter);
}
```

优化策略：

1. 惰性计算：只有访问时才计算
2. 结果缓存：依赖不变时直接返回缓存
3. 脏检查机制：依赖变化时标记dirty
4. 只读/可写：支持两种创建方式

### 2.7 watch实现

```javascript
// 对象的深拷贝  {...source}浅拷贝
function traverse(source, seen = new Set()) {
  if (!isObject(source)) {
    return source;
  }
  if (seen.has(source)) {
    return source;
  }
  seen.add(source);
  for (let k in source) {
    // 这里访问了对象中的所有属性
    traverse(source[k], seen);
  }
  return source;
}

function doWatch(source, cb, options) {
  let getter;
  if (isReactive(source)) {
    getter = () => traverse(source);
  } else if (isFunction(source)) {
    getter = source;
  }
  let oldValue;
  let clean;
  const onCleanup = (fn) => {
    clean = fn;
  };
  const job = () => {
    if (cb) {
      if (clean) clean();
      const newValue = effect.run();
      cb(newValue, oldValue, onCleanup);
      oldValue = newValue;
    } else {
      effect.run();
    }
  };
  const effect = new ReactiveEffect(getter, job);
  if (options.immediate) {
    job();
  }
  oldValue = effect.run();
}
export function watchEffect(effect, options: any = {}) {
  doWatch(effect, null, options); // === effect
}
export function watch(source, cb, options: any = {}) {
  doWatch(source, cb, options);
}
```

核心流程：

1. 标准化source：统一处理各种数据源
2. 深度监听：通过traverse地柜访问属性
3. 清理机制：返回停止函数和清理回调

watchEffect与watch的区别：

1. 自动依赖收集：无需指定监听源
2. 立即执行：初识必定运行一次
3. 简化API：不提供新旧值

### 2.8 effectScope的实现

```javascript
export let activeEffectScope;
class EffectScope {
  effects = [];
  parent = null;
  scopes = []; // 父亲用于存储儿子的effectScope
  constructor(detached) {
    // 当我自己初始化的时候
    if (!detached && activeEffectScope) {
      activeEffectScope.scopes.push(this);
    }
  }
  run(fn) {
    try {
      this.parent = activeEffectScope;
      activeEffectScope = this;
      return fn();
    } finally {
      activeEffectScope = this.parent;
    }
  }
  stop() {
    // 让所有的effect 停止收集
    for (let i = 0; i < this.effects.length; i++) {
      this.effects[i].stop();
    }
    // 停止儿子的scope中effect
    if (this.scopes.length) {
      for (let i = 0; i < this.scopes.length; i++) {
        this.scopes[i].stop();
      }
    }
  }
}
// 将effect放入到当前的作用域中
export function recordEffectScope(effect) {
  if (activeEffectScope) {
    activeEffectScope.effects.push(effect);
  }
}

export function effectScope(detached = false) {
  return new EffectScope(detached);
}
```

核心功能解析 ：

1. 层级结构管理 ：
  
   - 通过parent属性维护父子关系
   - 通过scopes数组管理子作用域
   - detached参数控制是否独立于父作用域
2. 生命周期控制 ：
  
   - run方法：在作用域内执行函数并收集effect
   - stop方法：递归停止所有effect和子作用域
   - on/off方法：手动控制作用域激活状态
3. 清理机制 ：
  
   - 维护cleanups数组存储清理回调
   - 停止时自动执行所有清理函数