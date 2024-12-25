# vite是如何使用的？

## 1. 为什么需要vite

在当前的开发中，我们是离不开构建工具的，构建工具的作用就是用来解决前端开发的痛点问题的。

前端开发有哪些痛点问题呢？

1. 模块化需求
2. 兼容浏览器，编译高级语法
3. 线上代码的质量问题
4. 开发效率

vite等构建工具是如何解决的呢？

1. 模块化方面：提供模块加载方案，并兼容不同模块规范。具体为给予浏览器的ESM支持实现模块加载，将其他格式的产物(commonjs)转化为ESM
2. 语法转译方面：配合sass、tsc等前端工具链，完成高级语法的转译，并对静态资源进行处理，使之能作为一个模块正常加载。具体为vite内置了对TS、JSX、sass等语法的支持，也能够加载各种各样的静态资源
3. 产物质量方面，配合terser等压缩工具进行代码混淆，通过tree shaking删除未使用的代码，提供对低版本量抢救车的语法降级处理。具体为给予rollup实现生产环境打包，配合爸爸饿了等工具链，可以极大程度保证构建产物的质量。
4. 开发效率方面：通过使用go语言、rust语言、no-bundle等思路，提高项目的启动性能和热更新的速度



### 1.1 模块化方面

#### 1.1.1 无模块化标准阶段

在模块化标准还没有诞生的时候，前端已经有一些模块化的开发手段，如`文件划分`、`命名空间`、`IIFE私有作用域`

##### 1.1.1.1 文件划分

文件划分就是将应用的状态和逻辑分散到不同的JS文件中，然后在html中引入

```html
// module-a.js 
let data = "data"; 
// module-b.js 
function method() {
console.log("execute method"); 
} 
// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./module-a.js"></script>
    <script src="./module-b.js"></script>
    <script>
      console.log(data);
      method();
    </script>
  </body>
</html>
```

缺点：

- 模块的变量相当于在全局声明和定义，有变量冲突的问题
- 变量都是在全局定义的，模块多了的话就找不到变量是属于哪个模块定义的
- 模块之间的依赖关系无法管理：模块之间的依赖关系和加载顺序

##### 1.1.1.2 命名空间

在window上定义一系列的对象，每个对象就是一个命名空间，对象里面有变量和方法

```html
// module-a.js
window.moduleA = {
  data: "moduleA",
  method: function () {
    console.log("execute A's method");
  },
};
// module-b.js
window.moduleB = {
  data: "moduleB",
  method: function () {
    console.log("execute B's method");
  },
};

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./module-a.js"></script>
    <script src="./module-b.js"></script>
    <script>
      // 此时 window 上已经绑定了 moduleA 和 moduleB
      console.log(moduleA.data);
      moduleB.method();
    </script>
  </body>
</html>
```

这样一来每个变量都有自己专属的命名空间，我们可以清晰的知道变量属于哪个模块，同时也避免了全局变量命名的问题



##### 1.1.1.3 IIFE立即执行函数

IIFE对模块作用域的区分更加的彻底

```html
// module-a.js
(function () {
  let data = "moduleA";
  function method() {
    console.log(data + "execute");
  }
  window.moduleA = {
    method: method,
  };
})();
// module-b.js
(function () {
  let data = "moduleB";
  function method() {
    console.log(data + "execute");
  }
  window.moduleB = {
    method: method,
  };
})();

// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./module-a.js"></script>
    <script src="./module-b.js"></script>
    <script>
      // 此时 window 上已经绑定了 moduleA 和 moduleB
      console.log(moduleA.data);
      moduleB.method();
    </script>
  </body>
</html>
```

每个IIFE都会创建一个私有的作用域，在私有作用域中的变量外界是无法访问的，只有模块内部的方法才能访问，这种方法也更加的确保了变量的安全性



还有一个问题就是模块加载顺序的问题，以上的几个方法都没有解决掉，如果加载顺序不对就会产生bug



### 1.1.2 CommonJS

CommonJS主要是用于服务端，随着node的普及，也是被业界广泛使用。

对于模块化规范而言，一般会包含2方面的内容

- 统一的模块化代码规范
- 实现自动加载模块的加载器(loader)



CommonJS的模块化代码方案就是使用`require`导入模块，使用`module.exports`导出模块

然后node内部会有相应的loader转译模块代码

问题：

- 模块加载器是由node提供的，在浏览器中是无法直接运行的
- 模块是同步进行加载的，对于node而言在服务器端是没有影响的，但是在浏览器端会造成JS解析过程的阻塞

所以业界设计出来了AMD的浏览器端模块加载方案

### 1.1.3 AMD

AMD就是异步模块加载方案，在浏览器环境中会被异步加载

```js
// main.js
define(["./print"], function (printModule) {
 printModule.print("main");
});
// print.js
define(function () {
 return {
 print: function (msg) {
 console.log("print " + msg);
 },
 };
});
```

由于没有得到浏览器的原生支持，他是通过第三方loader来实现的，最经典的是requirejs库

AMD规范使用起来稍显复杂，代码阅读和书写都不方便，同期出现的还由CMD规范，它只是社区中提出的一个妥协性的方案，关于新的模块化方案的探索，业界也从未停止脚步

### 1.1.4 ESModule

ES6 Module也称之为ES Module 或ESM，如果在html中加入含有type=module属性的script标签，浏览器就会按照ESM的规范加载依赖和模块解析

如果在node环境中使用需要在package.json中声明type：module

ESM作为ECMAScript官方提出的规范，不仅得到了众多浏览器的支持，也得到了node的原生支持，它称为前端大一统的模块标准也是指日可待



## 2. 什么是vite的预构建

vite是基于浏览器原生ES模块规范实现的dev server，无论是应用代码还是第三方代码，都应该符合ESM规范才能运行。

但是我们无法控制第三方库的打包规范，比如说React还是没有ES版本的产物。

像这种CommonJS格式的代码在vite中是无法直接运行的，我们需要将它转换为ESM格式的产物

此外还有一个问题是请求瀑布流的问题，比如说lodash-es版本是可以在vite中直接运行的，但是当它加载的时候会发出特别多的请求，导致页面加载的前几秒都是处于卡顿的状态。

所以依赖预构建做了两件事情：

1. 将其他格式的产物转化为ESM格式的，使其在浏览器中通过scriptde type=module就可以正常使用
2. 打包第三方库，将第三方库分散的文件合并到一起，减少HTTP请求数量



#### 2.1 如何开启预构建

#### 2.1.1 自动开启

当我们第一次启动项目的时候，可以在命令行看到pre-bundling就是开启了预构建

在项目启动成功后，在node-modules里面可以看到.vite文件夹，就是预构建产物存放的目录



#### 2.1.2 手动开启

为什么需要手动开启呢？

某些场景下我们在项目中使用了动态import的引入方法，但是vite是按需加载的特性，这些依赖会在运行时才能被识别出来，这样也就导致了vite进行二次预构建，二次预构建成本比较大，需要重新走一遍预构建的流程，页面也会刷新，并且重新请求所有的模块，所以我们可以提前手动的指定那个模块需要预构建：

```js
// vite.config.ts
{
 optimizeDeps: {
 include: [
 // 按需加载的依赖都可以声明到这个数组里
 "object-assign",
 ];
 }
}
```

## 3. 热更新

vite的热更新主要是依赖于一个浏览器原生的内置对象`import.meta`，它会在这个对象上添加hot对象里面有一套完整的属性和方法。

hot.accept方法

这个方法就是确定模块更新的边界问题

自身模块的更新

某个子模块的更新

多个子模块的更新

如果确定了更新的边界模块就会调用`import.meta.hot.accept(mod=>mod.render())`

模块销毁hot.dispose

它表示了模块销毁时需要做的一些事情，比如说清除定时器等等

共享数据hot.data属性

它的作用是在不同的模块实例上共享一些数据，当模块更新的时候数据保存下来而不是从新开始计算



## 4. 代码分割

在传统的单chunk打包模式下，当项目的代码越来越庞大，最后呢会导致浏览器下载一个巨大的JS文件，它会导致两个问题：

1. 无法做到按需加载，当前页面不需要的代码也会进行加载
2. 线上缓存复用率低，改动一行代码也会导致bundle产物缓存失效

vite默认的拆包优势是css代码的分割于业务代码、第三方库代码、动态import模块代码三者的分离，但是第三方库的打包产物容易变得臃肿

所以我们可以自定义拆包：

```js
// vite.config.ts
{
  build: {
    rollupOptions: {
      output: {
        // manualChunks 配置
        manualChunks: {
          // 将 React 相关库打包成单独的 chunk 中
          'react-vendor': ['react', 'react-dom'],
            // 将 Lodash 库的代码单独打包
            'lodash': ['lodash-es'],
              // 将组件库的代码打包
              'library': ['antd', '@arco-design/web-react'],
  },
      },
    }
  },
}
```



## 5. 语法降级：如何适配低版本浏览器

旧版本的浏览器兼容性问题主要是两方面：

1. 语法降级问题
2. Polyfill缺失问题

vite中主要是使用`@vitejs/plugin-legacy`这个插件来完成浏览器兼容性问题的