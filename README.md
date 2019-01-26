# # rollup_template

Rollup 是一个 JavaScript 模块打包器。它会对符合js的ES6模块的文件进行打包（非ES6模块如commonjs模块需要插件先转化为es6模块）。另外，Rollup会自动的进行tree shaking,有效的降低代码体积。然而，Rollup暂还不支持码拆分和运行时态的动态导入，所以更适合用作library的打包器。

每次写类库都需要完成大量的基础配置，babel代码，各种格式化工具，提交时的规范等。所以，创建了写一个类库时需要的基本的rollup配置，降低后续开发library的成本。
如果不了解基本的使用规则，可以查看[Rollup.js官网](https://www.rollupjs.com/guide/zh#introduction)

## 关于模板

### 模板的使用

```
git clone https://github.com/banyaner/rollup_template.git
```
1. 修改package.json文件中的所有'rollup_template'为你的模块的名字
2. 模板默认会打包es6和commonjs模块。如果需要打包同时支持多种环境的模块，请看下一节
3. 模板使用prettier在git add时自动格式化代码
4. 模板在git commit时强制使用angular的commit规范使用standard version发布代码[使用方法](https://juejin.im/post/5c1611515188253847206166)。
5. package.json中main字段为iife函数，module默认为基于浏览器环境进行打包。另外，也会打包出对应的其他类型的模块（node环境和commonjs模块）。可以按照项目需求手动修改。代码中通过`process.browser`判断是否为浏览器环境，从而在生成代码时更好的缩减代码。具体的使用可以看文章[[译] 怎样写一个能同时用于 Node 和浏览器的 JavaScript 包？](https://zhuanlan.zhihu.com/p/25215447)


### 关于package.json中的main、module、browser字段。
Rollup支持打包出ES6、CommonJS、UMD模块.
```
{
  "main": "dist/rollup_template.cjs.js",
  "module": "dist/rollup_template.esm.js",
  "browser": "rollup_template.umd.js"
}
```
Webpack和Rollup都会对ES6模块做静态优化（tree shaking 和 scope hoisting），所以他们均会有限使用module字段作为引入资源的入口，如果没有module才读取main字段作为CommonJS的入库。所以：
module 字段指向ES6的模块；main指向CommonJS模块。
但是如果你写的模块需要同时支持在Node.js与浏览器运行，则需要使用browser来字段。
browser字段有两种使用方式：
1. 写入一个umd文件地址，如上面的示例。这种将会把所有的node端和浏览器端的代码都打包进去。（也就意味着如果你的项目只在浏览器端运行的话，代码里也可能还会有冗余的node端代码）。注意：**使用这种方式后，打包工具会忽略module字段，从而无法进行静态优化**。
2. 如果你只需要部分文件做替换，可以使用对象。但前面提到的[文章](https://zhuanlan.zhihu.com/p/25215447)已经说明了这种方式的不友好，所以我们模板中采用了[rollup-plugin-replace](https://www.npmjs.com/package/rollup-plugin-replace)来自动的实现文件的分别打包浏览器和node环境代码。也就不需要使用browser字段了.

### 模板中配置的插件：
1. [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve)rollup不知道如何处理从npm上安装到node_modules的依赖，这个插件就是告诉rollup如何查找外部的模块。
2. [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs)有些库导出的是commonjs的模块，而rollup默认是使用ES6标准，改插件就是将commonjs模块转成ES6模块。
3. [rollup-plugin-babel](https://github.com/rollup/rollup-plugin-babel)
4. @commitlint/cli @commitlint/config-conventional husky standard-version 安装这3个插件是为了实现使用angular的commit规范，和规范的进行发版。更多的介绍看[这里](https://juejin.im/post/5c1611515188253847206166)
~~5. [babel-external-helpers](https://babel.bootcss.com/docs/plugins/external-helpers/)babel-cli 中的一个command，用来生成一段代码，包含 babel 所有的 helper 函数。babel-helpers包里存放了很多帮助函数，如果babel检测到某个文件编译时就会把这个函数放到模块的顶部。但是如果有多个文件都是用了这些helpers就会导致多个模块重复定义。external-helpers插件，它允许 Rollup 在包的顶部只引用一次 “helpers”，而不是每个使用它们的模块中都引用一遍。~~现在是默认支持了。
另外，.babelrc文件放在src中，而不是根目录下，这样可以为不同的任务配置不容的.babelrc（比如测试）。babel模板里配置的兼容是 ``` "browserslist": [
    "iOS >= 8",
    "Android > 4.4"
  ]``` 每个库文件需求可能都不同。根据需要自行修改。 babel配置和兼容性息息相关。后续会单独再讲。
6. prettier [lint-staged](https://github.com/okonet/lint-staged#configuration) git add时格式化代码，便于不同人开发中代码风格统一。
7. [rollup-plugin-replace](https://www.npmjs.com/package/rollup-plugin-replace) 设置环境变量值，从而便于为浏览器端和node端打包需要的代码。
