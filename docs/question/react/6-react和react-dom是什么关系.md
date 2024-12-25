# 6.react和react-dom

react和react-dom是React库的两个主要部分，他们分别处理不同的事务

1. React：它是React库的核心部分，包含了React的核心功能，如组件、状态、生命周期等等，它提供了构建用户界面所需的基本构建块，当你编写React组件的时候实际上使用React包
2. react-dom：这是React专门为DOM环境提供的包，它包含了与浏览器DOM相关的功能，react-dom提供了用于在浏览器中渲染React组件的方法，包含了reactDOM.render方法，在WEB开发中，react-dom被用于将react应用渲染到浏览器的DOM中

基本上，react和react-dom是为了分离React的核心功能，以便于更好的处理不同的环境和平台，这种分离使得React更加灵活，可以适应不同的渲染目标，而不仅仅局限于浏览器环境