# 4.说说JSX转化为真实DOM的过程

1. 首先我们编写的JSX文件会被Babel转化为React.createElement(type,props,children)这种形式
   1. 会对type进行判断
   2. 如果是原生标签节点，type是字符串，如div、span
   3. 如果是文本节点，type就没有，就是TEXT
   4. 如果是函数组件，type是函数名
   5. 如果是类组件，type是类名
2. createELement函数对key和ref等特殊的props进行处理，并获取defaultProps对默认的props进行赋值，并且对传入的孩子节点进行处理，最终构造成一个虚拟DOM
3. root.render将生成好的虚拟DOM渲染到指定容器上，其中采取了批处理、事务等机制并且对特性浏览器进行了性能优化，最终转换为真实DOM