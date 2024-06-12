---
title: JS中的继承是什么?
tags:
  - js
  - 面试题
date: 2024-06-12
---

# 一 JS中的继承是什么?

## 1.1 是什么

继承（inheritance）是⾯向对象软件技术当中的⼀个概念

如果⼀个类别B“继承⾃”另⼀个类别A，就把这个B称为“A的⼦类”，⽽把A称为“B的⽗类”也可以称“A是B的超类”

### 1.1.1 继承的优点

继承可以使得⼦类具有⽗类别的各种属性和⽅法，⽽不需要再次编写相同的代码

在⼦类继承⽗类的同时，可以重新定义某些属性，并重写某些⽅法，即覆盖⽗类的原有属性和⽅法，使其获得与⽗类不同的功能

虽然JavaScript并不是真正的⾯向对象语⾔，但它天⽣的灵活性，使应⽤场景更加丰富

关于继承，我们举个形象的例⼦：

定义⼀个类（Class）叫汽⻋，汽⻋的属性包括颜⾊、轮胎、品牌、速度、排⽓量等

由汽⻋这个类可以派⽣出“轿⻋”和“货⻋”两个类，在汽⻋的基础属性上，为轿⻋添加⼀个后备厢、给货⻋添加⼀个⼤货箱

这样轿⻋和货⻋就是不⼀样的，但是⼆者都属于汽⻋这个类，汽⻋、轿⻋继承了汽⻋的属性，⽽不需要再次在“轿⻋”中定义汽⻋已经有的属性

在“轿⻋”继承“汽⻋”的同时，也可以重新定义汽⻋的某些属性，并重写或覆盖某些属性和⽅法,使其获得与“汽⻋”这个⽗类不同的属性和⽅法

## 1.2 实现⽅式

下⾯给出JavaScripy常⻅的继承⽅式：
- 原型链继承
- 构造函数继承（借助 call）
- 组合继承
- 原型式继承
- 寄⽣式继承
- 寄⽣组合式继承

### 1.2.1 原型链继承

原型链继承是⽐较常⻅的继承⽅式之⼀，其中涉及的构造函数、原型和实例，三者之间存在着⼀定的关系，即每⼀个构造函数都有⼀个原型对象，原型对象⼜包含⼀个指向构造函数的指针，⽽实例则包含⼀个原型对象的指针

继承的本质就是复制，即重写原型对象，代之以一个新类型的实例

```JS
function SuperType() {
    this.property = true;
}

SuperType.prototype.getSuperValue = function() {
    return this.property;
}

function SubType() {
    this.subproperty = false;
}

// 这里是关键，创建SuperType的实例，并将该实例赋值给SubType.prototype
SubType.prototype = new SuperType(); 

SubType.prototype.getSubValue = function() {
    return this.subproperty;
}

var instance = new SubType();
console.log(instance.getSuperValue()); // true
```
