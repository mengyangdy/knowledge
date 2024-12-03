# null和undefined的区别？

1. JS的作者在设计JS的时候是先设计的null(为什么设计了null：最初设计JS的时候借鉴了Java语言)
2. null会被隐式转换成0，很不容易发现错误
3. 现有null后有的undefined，出来undefined是为了填补之前的坑



> 具体区别：JS的最初版本是这样区分的：null是一个表示无得对象(空对象指针)，转为数值为0，undefined是一个表示无得原始值，转为数值是为NaN