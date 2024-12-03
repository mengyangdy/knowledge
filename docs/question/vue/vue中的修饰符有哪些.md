# vue中的修饰符有哪些？

1. 事件修饰符
   1. .stop      阻止冒泡
   2. .prevent   阻止默认行为
   3. .capture   内部元素触发的事件现在外部触发
   4. .self     只有在event.target是当前元素时触发
   5. .once     事件只会触发一次
   6. .passive   立即触发默认行为
   7. .native    把当前元素作为原生标签看待
2. 按键修饰符
   1. .enter     按下enter键
   2. .tab       按下tab键
3. 鼠标修饰符
   1. .left      按下鼠标左键
   2. .right     按下鼠标右键
   3. .middle    按下鼠标中键
4. 表单修饰符
   1. .lazy      等待输入完之后再显示
   2. .trim      删除内容前后的空格
   3. .number    输入是数字或转为数字