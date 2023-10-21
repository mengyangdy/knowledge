---
title: TypeScript的泛型编程
tags:
  - ts
date: 2023-10-23
cover: https://s2.loli.net/2023/10/23/XOUgz2QGZuYwTIj.jpg
---

# TypeScript 的泛型编程

## 泛型语法的基本使用

### 认识泛型

- 软件工程的主要目的是构建不仅仅明确和一致的 API，还要让你的代码具有很强的可重用性：
  - 比如我们可以通过函数来封装一些 API，通过传入不同的函数参数，让函数帮助我们完成不同的操作
  - 但是对于参数的类型是否也可以参数化呢?
- 什么是类型的参数化？
  - 我们来提一个需求：封装一个函数，传入一个参数，并且返回这个参数
- 如果我们是 ts 的思维方式，我们需要考虑这个参数和返回值的类型需要一致

```ts
function foo(age: number): number {
  return age
}
```

- 上面的代码虽然实现了，但是不适用于其他类型，比如 string、boolean、Person 等类型

```ts
function foo(arg：any)：any{
	return arg
}
```

### 泛型实现类型的参数化

- 虽然 any 是可以的，但是定义为 any 的时候，我们其实已经丢失了类型信息
  - 比如我们传入的是一个 number，那么我们希望返回的可不是 any 类型，而是 number 类型
  - 所以，我们需要在函数中可以捕获到参数的类型是 number，并且同事使用它来作为返回值的类型
- 我们需要在这里使用一种特殊的变量-类型变量（type variable），它作用于类型，而不是值

```ts
function foo<Type>(arg: Type): Type {
  return arg
}
```

- 这里我们可以使用两种方式来调用它：
  - 方式一：通过 `<类型>` 的方式将类型传递给函数
  - 方式二：通过类型推导（type argument inference）自动推导出我们传入变量的类型
    - 在这里会推导出他们是字面量类型的，因为字面量类型对于我们的函数也是适用的

```ts
foo<string>('a')
foo<number>(123)

foo('a')
foo(123)
```

### 泛型的基本补充

- 当然我们也可以传入多个类型

```ts
function foo<T, E>(a1: T, a2: E) {}
```

- 平时在开发中我们可能会看到一些常用的名称
  - T：Type 的缩写，类型
  - K、V：key 和 value 的缩写，键值对
  - E：Element 的缩写，元素
  - O：Object 的缩写,对象

## 泛型接口、类的使用

### 泛型接口

- 在定义接口的时候我们也可以使用泛型：

```ts
interface IFoo<T> {
  initialValue: T
  valueList: T[]
  handleValue: (value: T) => vold
}

const foo: IFoo<number> = {
  initialValue: 0,
  valueList: [0, 1, 2],
  handleValue: function (value: number) {
    console.log(value)
  }
}

interface IFoo<T = number> {
  initialValue: T
  valueList: T[]
  handleValue: (value: T) => vold
}
```

### 泛型类

- 我们也可以编写一个泛型类

```ts
class Point<T> {
  x: T
  y: T

  constructor(x: T, y: T) {
    this.x = x
    this.y = y
  }
}

const p1 = new Point(10, 20)
const p2 = new Point<number>(10, 20)
const p3: Point<number> = new Point(10, 20)
```

## 泛型约束

- 有时候我们希望传入的类型有某些共性，但是这些共性可能不是在同一种类型中：
  - 比如 string 和 array 都是有 length 的，或者某些对象也是会有 length 属性的
  - 那么只要有拥有 length 的属性都可以作为我们的参数类型，那么应该如何操作呢？

```ts
interface ILength {
  length: number
}

function getLength<T extends ILength>(args: T) {
  return args.length
}

console.log(getLength('abc'))
console.log(getLength(['a', 'b']))
console.log(getLength({ length: 10, name: 'a' }))
```

- 这里表示是传入的类型必须有这个属性，也可以有其他属性，但是必须至少有这个成员

- 在泛型约束中使用类型参数（Using Type Parameters in Generic Constraints）
  - 你可以声明一个类型参数，这个类型参数被其他类型参数约束
- 举个栗子：我们希望获取一个对象给定属性名的值
  - 我们需要确保我们不会获取 obj 上不存在的属性
  - 所以我们在两个类型之间建立一个约束

```ts
function getProperty<Type, key extends keyof Type>(obj: Type, key: key) {
  return obj[key]
}

const info = {
  name: 'why',
  age: 18
}

console.log(getProperty(info, 'name'))
```

## typeScript 映射类型

- 有的时候，一个类型需要基于另外一个类型，但是你又不想拷贝一份，这个时候可以考虑使用映射类型
  - 大部分内置的工具都是通过映射类型来实现的
  - 大多数类型体操的题目也是通过映射类型完成的
- 映射类型建立在索引签名的语法上：
  - 映射类型,就是使用了 PropertyKeys 联合类型的泛型
  - 其中 PropertyKeys 多是通过 keyof 创建，然后循环遍历键名创建一个类型

```ts
interface IPerson {
  name: string
  age: number
}

type MapType<Type> = {
  [property in keyof Type]: boolean
}

type NewPerson = MapType<IPerson>
```

### 映射修饰符（Mapping Modifiers）

- 在使用映射类型时，有两个额外的修饰符可能会用到：
  - 一个是 readonly，用于设置属性只读
  - 一个是?，用于设置属性可选
- 你可以通过前缀-或者+删除或者添加这些修饰符，如果没有写前缀，相当于使用了+前缀

```ts
type MapType<Type> = {
  [property in keyof Type]-?: Type[property]
}

interface IPerson {
  name: string
  age: number
  height: number
}

type NewPerson = MapType<IPerson>
```

## 类型工具和类型体操

- 类型系统其实在很多语言里面都是有的，比如 Java、Swift、C++，但是相对来说 typeScript 的类型非常灵活
  - 这是因为 typeScript 的目的是为了 JavaScript 添加一套类型校验系统，因为 JavaScript 本身的灵活性，也让 typeScript 类型系统不得不增加更附加的功能以适配 JavaScript 的灵活性
  - 所以 typeScript 是一种可以支持类型编程的类型系统
- 这种类型编程系统为 typeScript 增加了很大的灵活度，同时也增加了他的难度
  - 如果你不仅仅在开发业务的时候为了自己的 JavaScript 代码增加上类型约束，那么基本不需要太多的类型编程能力
  - 但是如果在开发一些框架、库或者通用性的工具，为了考虑各种适配的情况，就需要使用类型编程
- typeScript 本身为我们提供了类型工具，帮助我们辅助进行类型转换
- 很多开发者为了进一步增强自己的 typeScript 的编程能力，还会专门去做一些类型体操的题目：
  - https://github.com/type-challenges/type-challenges
  - https://ghaiklor.github.io/type-challenges-solutions/en/

## typeScript 条件类型

### 条件类型（Conditional Types）

- 很多时候，日常开发中我们需要基于输入的值来决定输出的值，同样我们也需要基于输入的值的类型来决定输出的值的类型
- 条件类型（Conditional Types）就是用来帮助我们表述输入类型和输出类型之间的关系
  - 条件类型的写法有点类似于 JavaScript 中的条件表达式（condition？trueExpression:falseExpression）
  - SomeType extends OtherType?TureType:FalseType

```ts
function sum<T extends number | string>(arg1: T, arg2: T): T extends string ? string : number
function sum(arg1: any, arg2: any) {
  return arg1 + arg2
}

const res1 = sum(10, 20)

const res2 = sum('a', 'b')
```

### 在条件类型中推断（inter）

- 在条件类型中推断（Inferring withinConditional Types）
  - 条件类型提供了 infer 关键词，可以从正在比较的类型中推断类型，然后在 true 分支里引用该推断结果
- 比如我们现在有一个数组类型，想要获取到一个函数的参数类型和返回值类型

```ts
type CalcFnType = (num1: number, num2: number) => number

type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never
const CalcReturnType = ReturnType<CalcFnType>

type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never
type CalcParameterType = Parameters<CalcFnType>
```

### 分发条件类型（Distributive Conditional Types）

- 当在泛型中使用条件类型的时候，如果传入一个联合类型，就会变成分发的（distributive）

```ts
type toArray<Type> = Type extends any ? Type[] : never

//string[]|number[]
type newType = toArray<number | string>
```

- 如果我们在 toArray 传入一个联合类型，这个条件类型会被应用到联合类型的每个成员
  - 当传入 string|number 时，会遍历联合类型中的每一个成员
  - 相当于 `toArray<string>|toArray<number>`
  - 所以最后的结果是：string[]|number[]

### Partial `<Type>`

- 用于构造一个 Type 下面的所有属性都设置为可选的类型

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

interface IPerson {
  name: string
  age: number
  height: number
}

const info: IPerson = {
  name: '1',
  age: 1,
  height: 1
}

function updatePerson(person: IPerson, partPerson: MyPartial<IPerson>) {
  return { ...person, ...partPerson }
}
```

### Required `<Type>`

- 用于构造一个 Type 下面的所有属性全都设置为必填的类型，这个工具类型跟 Partial 相反

```ts
type MyRequired<T> = {
  [K in keyof T]-?: T[K]
}

interface IPerson {
  name: string
  age?: number
  height?: number
}

type IPersonRequired = MyRequired<IPerson>

const info: IPersonRequired = {
  name: 'a',
  age: 1,
  height: 1
}
```

### Readonly `<Type>`

- 用于构造一个 Type 下面的所有属性全都设置为只读的类型，意味着这个类型开哦所有的属性全都不可以重新赋值

```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

interface IPerson {
  name: string
  age: number
}

const info: MyReadonly<IPerson> = {
  name: 'w',
  age: 1
}

const obj: IPerson = {
  name: 'a',
  age: 2
}
```

### Record `<Keys,Type>`

- 用于构造一个对象类型，它所有的 key（键）都是 Keys 类型，它所有的 value（值） 都是 Type 类型

```ts
type MyRecord<K extends keyof any, T> = {
  [P in K]: T
}

interface IPerson {
  name: string
  age: number
}
const p1: IPerson = { name: '1', age: 1 }
const p2: IPerson = { name: '2', age: 2 }

type CityType = '上海' | '北京'

const data: MyRecord<CityType, IPerson> = {
  上海: p1,
  北京: p2
}
```

### Pick `<Type,Keys>`

- 用于构造一个类型，他是从 Type 类型里面挑了一些属性 Keys

```ts
type MYPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

interface IPerson {
  name: string
  age: number
  height: number
}

type IKun = MYPick<IPerson, 'name' | 'age'>
```

### Omit `<Type,Keys>`

- 用于构造一个类型，他是从 Type 类型里面过滤了一些属性 Keys

```ts
type MYOmit<T, K> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}

interface IPerson {
  name: string
  age: number
  height: number
}

type IKun = Omit<IPerson, 'height'>
```

### Exclude `<UnionType,ExCludedMembers>`

- 用于构造一个类型，他是从 UnionType 联合类型里面排除了所有可以赋给 ExcludedMembers 的类型

```ts
type MYExclude<T, U> = T extends U ? never : T

type MYOmit<T, K> = Pick<T, MYExclude<keyof T, K>>

type PropertyTypes = 'name' | 'age' | 'height'
type PropertyTypes2 = MYExclude<PropertyTypes, 'height'>
```

### Extract `<Type,Union>`

- 用于构造一个类型，他是从 Type 类型里面提取了所有可以赋给 Union 的类型

```ts
type MYExtract<T, U> = T extends U ? T : never

type PropertyTypes = 'name' | 'age' | 'height'
type PropertyTypes2 = MYExtract<PropertyTypes, 'name' | 'age'>
```

### NonNullable `<Type>`

- 用于构建一个类型，这个类型从 Type 中排除了所有的 null 和 undefined 的类型

```ts
type MYNonNullable<T> = T extends undefined | null ? never : T

type unionType = string | number | undefined | null

type unionType2 = MYNonNullable<unionType>
```

### ReturnType `<Tyep>`

- 用于构造一个含有 Type 函数的返回值的类型

```ts
type MYReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never

type T1 = MYReturnType<() => string>
type T2 = MYReturnType<() => void>
type T3 = MYReturnType<(num1: number, num2: number) => string>

function sum(num1: number, num2: number) {
  return num1 + num2
}

function getInfo(info: { name: string; age: number }) {
  return info.name + info.age
}

type T4 = MYReturnType<typeof sum>
type T5 = MYReturnType<typeof getInfo>
type T6 = MYReturnType<() => void>
```

### InstanceType `<Type>`

- 用于构造一个由所有 Type 的构造函数的实例类组成的类型

```ts
type MYInstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : never

class Person {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

type T = typeof Person

type PersonType = MYInstanceType<typeof Person>

//对于普通的定义来说似乎是没有区别的

const info: Person = { name: 'a', age: 1 }
const info2: Person = { name: 'b', age: 2 }

//但是如果我们想要做一个工厂函数，用于帮助我们创建某种类型的对象
//这里的返回值不可以写T，因为T的类型会是typeof Person
//这里就可以使用InstanceType<T>,它可以帮助我们返回构造函数的返回值类型（构造函数创建出来的对象类型）

function factory<T extends new (...args: any[]) => any>(ctor: T): MYInstanceType<T> {
  return new ctor()
}
const p1 = factory(Person)
```
