---
title: 平时在前端开发中,使用过或者见过那些设计模式呢?是如何应用的?
tags:
  - 场景题
  - 面试题
date: 2024-06-03
---

# 一 平时在前端开发中,使用过或者见过那些设计模式呢?是如何应用的?

## 1.1 是什么

在软件⼯程中，设计模式是对软件设计中普遍存在的各种问题所提出的解决⽅案

设计模式并不直接⽤来完成代码的编写，⽽是描述在各种不同情况下，要怎么解决问题的⼀种⽅案

设计模式能使不稳定依赖于相对稳定、具体依赖于相对抽象，避免会引起⿇烦的紧耦合，以增强软件设计⾯对并适应变化的能⼒

因此，当我们遇到合适的场景时，我们可能会条件反射⼀样⾃然⽽然想到符合这种场景的设计模式

⽐如，当系统中某个接⼝的结构已经⽆法满⾜我们现在的业务需求，但⼜不能改动这个接⼝，因为可能原来的系统很多功能都依赖于这个接⼝，改动接⼝会牵扯到太多⽂件

因此应对这种场景，我们可以很快地想到可以⽤适配器模式来解决这个问题

## 1.2 有哪些

前端开发中常见的设计模式主要基于经典的23种设计模式，这些模式被分为三大类别：创建型、结构型和行为型。下面分别列举每个类别中的一些设计模式及其在前端开发中的应用情况：

### 1.2.1 创建型模式（Creational Patterns）

1. **单例模式（Singleton）**
    
    - **应用**：确保一个类只有一个实例，并提供一个全局访问点。适用于需要全局唯一的资源管理器，如配置管理、缓存等。
2. **工厂模式（Factory）**
    
    - **应用**：提供创建对象的接口，隐藏创建逻辑。在前端，常用于根据条件动态创建不同类型的组件。
3. **抽象工厂模式（Abstract Factory）**
    
    - **应用**：为创建一系列相关或相互依赖的对象提供一个接口，而不需要指定它们的具体类。适用于创建主题相关的UI组件集。
4. **建造者模式（Builder）**
    
    - **应用**：将复杂对象的构建与表示分离，便于一步步构造复杂对象。常用于构建配置复杂或具有多个可选部分的组件。
5. **原型模式（Prototype）**
    
    - **应用**：通过克隆现有对象来创建新对象，以减少创建成本。适用于快速复制和修改已有UI组件。

### 1.2.2 结构型模式（Structural Patterns）

1. **适配器模式（Adapter）**
    
    - **应用**：让两个不兼容的接口协同工作。在前端，可用于将旧的API接口适配到新的组件库或框架中。
2. **桥接模式（Bridge）**
    
    - **应用**：将抽象部分与实现部分分离，使它们可以独立变化。例如，UI组件的外观与功能分离，以便独立修改。
3. **组合模式（Composite）**
    
    - **应用**：允许你以一致的方式处理个别对象和对象组合。在前端树形菜单、文件系统展示中常见。
4. **装饰器模式（Decorator）**
    
    - **应用**：动态地给一个对象添加一些额外的职责。常用于给组件添加临时或动态的功能，如日志记录、权限校验。
5. **外观模式（Facade）**
    
    - **应用**：为子系统中的一组接口提供一个统一的高层接口，简化客户端与子系统的交互。
6. **享元模式（Flyweight）**
    
    - **应用**：通过共享技术有效支持大量细粒度对象。在大量重复UI元素（如图标）中节省内存。
7. **代理模式（Proxy）**
    
    - **应用**：为其他对象提供一种代理以控制对这个对象的访问。如图片懒加载、API请求的缓存代理。

### 1.2.3 行为型模式（Behavioral Patterns）

1. **责任链模式（Chain of Responsibility）**
    
    - **应用**：将请求沿着链传递，直到有对象处理它。在前端，可以用于表单验证、事件处理等。
2. **命令模式（Command）**
    
    - **应用**：将请求封装成对象，以支持参数化、排队或日志等功能。适用于实现撤销/重做功能。
3. **迭代器模式（Iterator）**
    
    - **应用**：顺序访问集合对象的元素，不暴露集合内部结构。在前端，遍历数组或DOM节点时有用。
4. **中介者模式（Mediator）**
    
    - **应用**：减少多个对象之间的耦合，通过中介者对象封装交互。例如，组件间通信的集中管理。
5. **备忘录模式（Memento）**
    
    - **应用**：在不破坏封装的前提下，捕获一个对象的内部状态，并在以后恢复它。如编辑器的撤销操作。
6. **观察者模式（Observer）**
    
    - **应用**：定义对象间一对多依赖，当目标对象状态改变时，通知所有依赖它的对象。常用于事件监听、状态同步。
7. **状态模式（State）**
    
    - **应用**：允许对象在内部状态改变时改变它的行为。适用于用户界面状态管理，如登录/登出状态切换。
8. **策略模式（Strategy）**
    
    - **应用**：定义一系列算法，并将每个算法封装起来，使它们可以相互替换。如动态切换排序算法。
9. **模板方法模式（Template Method）**
    
    - **应用**：定义一个操作的算法骨架，子类重写某些步骤。适用于组件的基类定义通用流程。
10. **访问者模式（Visitor）**
    
    - **应用**：在不修改对象结构的情况下，为对象结构添加新的操作。较少直接应用于前端，但在某些复杂的场景下有用途，如AST（抽象语法树）遍历。

这些设计模式的应用可以大大提高代码的灵活性、可维护性和可扩展性，是前端工程师必备的技能之一。

## 1.3 详情

### 1.3.1 单例模式

保证⼀个类仅有⼀个实例，并提供⼀个访问它的全局访问点。实现的⽅法为先判断实例存在与否，如果存在则直接返回，如果不存在就创建了再返回，这就确保了⼀个类只有⼀个实例对象

如下图的⻋，只有⼀辆，⼀旦借出去则不能再借给别⼈

![](https://f.pz.al/pzal/2024/06/12/f00ab45b3211c.png)

### 1.3.2 工厂模式

⼯⼚模式通常会分成3个⻆⾊：
- ⼯⼚⻆⾊-负责实现创建所有实例的内部逻辑.
- 抽象产品⻆⾊-是所创建的所有对象的⽗类，负责描述所有实例所共有的公共接⼝
- 具体产品⻆⾊-是创建⽬标，所有创建的对象都充当这个⻆⾊的某个具体类的实例

![](https://f.pz.al/pzal/2024/06/12/73849809ff656.png)

### 1.3.3 策略模式

策略模式，就是定义⼀系列的算法，把他们⼀个个封装起来，并且使他们可以相互替换,⾄少分成两部分：
- 策略类（可变），策略类封装了具体的算法，并负责具体的计算过程
- 环境类（不变），接受客⼾的请求，随后将请求委托给某⼀个策略类

### 1.3.4 代理模式

代理模式：为对象提供⼀个代⽤品或占位符，以便控制对它的访问

例如实现图⽚懒加载的功能，先通过⼀张 loading 图占位，然后通过异步的⽅式加载图⽚，等图⽚加载好了再把完成的图⽚加载到 img 标签⾥⾯

### 1.3.5 中介模式

中介者模式的定义：通过⼀个中介者对象，其他所有的相关对象都通过该中介者对象来通信，⽽不是相互引⽤，当其中的⼀个对象发⽣改变时，只需要通知中介者对象即可

通过中介者模式可以解除对象与对象之间的紧耦合关系

### 1.3.6 装饰者模式

装饰者模式的定义：在不改变对象⾃⾝的基础上，在程序运⾏期间给对象动态地添加⽅法

通常运⽤在原有⽅法维持不变，在原有⽅法上再挂载其他⽅法来满⾜现有需求

### 1.3.7 总结

不断去学习设计模式，会对我们有着极⼤的帮助，主要如下：
- 从许多优秀的软件系统中总结出的成功的、能够实现可维护性、复⽤的设计⽅案，使⽤这些⽅案将可以让我们避免做⼀些重复性的⼯作
- 设计模式提供了⼀套通⽤的设计词汇和⼀种通⽤的形式来⽅便开发⼈员之间沟通和交流，使得设计⽅案更加通俗易懂
- ⼤部分设计模式都兼顾了系统的可重⽤性和可扩展性，这使得我们可以更好地重⽤⼀些已有的设计⽅案、功能模块甚⾄⼀个完整的软件系统，避免我们经常做⼀些重复的设计、编写⼀些重复的代码
- 合理使⽤设计模式并对设计模式的使⽤情况进⾏⽂档化，将有助于别⼈更快地理解系统
- 学习设计模式将有助于初学者更加深⼊地理解⾯向对象思想