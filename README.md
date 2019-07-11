# rollup-project-template

每次写类库都需要完成大量的基础配置，babel 代码，各种格式化工具，提交时的规范等。所以，创建了写一个类库时需要的基本的 rollup 配置，降低后续开发 library 的成本。
如果不了解基本的使用规则，可以查看[Rollup.js 官网](https://www.rollupjs.com/guide/zh#introduction)

## 关于模板

### 模板的使用

```
git clone https://github.com/banyaner/rollup-project-template.git
```

1. 修改 package.json 文件中的所有'rollup_template'为你的模块的名字
2. 模板默认会打包 es6 和 commonjs 模块。如果需要打包同时支持多种环境的模块，请看下一节
3. 模板使用 prettier 在 git add 时自动格式化代码
4. 模板在 git commit 时强制使用 angular 的 commit 规范使用 standard version 发布代码[使用方法](https://juejin.im/post/5c1611515188253847206166)。
5. package.json 中 main 字段为 iife 函数，module 默认为基于浏览器环境进行打包。另外，也会打包出对应的其他类型的模块（node 环境和 commonjs 模块）。可以按照项目需求手动修改。代码中通过`process.browser`判断是否为浏览器环境，从而在生成代码时更好的缩减代码。具体的使用可以看文章[[译] 怎样写一个能同时用于 Node 和浏览器的 JavaScript 包？](https://zhuanlan.zhihu.com/p/25215447)

### 关于 package.json 中的 main、module、browser 字段。

Rollup 支持打包出 ES6、CommonJS、UMD 模块.

```
{
  "main": "dist/rollup_template.cjs.js",
  "module": "dist/rollup_template.esm.js",
  "browser": "rollup_template.umd.js"
}
```

Webpack 和 Rollup 都会对 ES6 模块做静态优化（tree shaking 和 scope hoisting），所以他们均会优先使用 module 字段作为引入资源的入口，如果没有 module 才读取 main 字段作为 CommonJS 的入库。所以：
module 字段指向 ES6 的模块；main 指向 CommonJS 模块。
但是如果你写的模块需要同时支持在 Node.js 与浏览器运行，则需要使用 browser 来字段。
browser 字段有两种使用方式：

1. 写入一个 umd 文件地址，如上面的示例。这种将会把所有的 node 端和浏览器端的代码都打包进去。（也就意味着如果你的项目只在浏览器端运行的话，代码里也可能还会有冗余的 node 端代码）。注意：**使用这种方式后，打包工具会忽略 module 字段，从而无法进行静态优化**。
2. 如果你只需要部分文件做替换，可以使用对象。但前面提到的[文章](https://zhuanlan.zhihu.com/p/25215447)已经说明了这种方式的不友好，所以我们模板中采用了[rollup-plugin-replace](https://www.npmjs.com/package/rollup-plugin-replace)来自动的实现文件的分别打包浏览器和 node 环境代码。也就不需要使用 browser 字段了.

### 模板中配置的插件：

1. [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve)rollup 不知道如何处理从 npm 上安装到 node_modules 的依赖，这个插件就是告诉 rollup 如何查找外部的模块。
2. [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs)有些库导出的是 commonjs 的模块，而 rollup 默认是使用 ES6 标准，改插件就是将 commonjs 模块转成 ES6 模块。
3. [rollup-plugin-babel](https://github.com/rollup/rollup-plugin-babel)
4. @commitlint/cli @commitlint/config-conventional husky standard-version 安装这 3 个插件是为了实现使用 angular 的 commit 规范，和规范的进行发版。更多的介绍看[这里](https://juejin.im/post/5c1611515188253847206166)
   ~~5. [babel-external-helpers](https://babel.bootcss.com/docs/plugins/external-helpers/)babel-cli 中的一个 command，用来生成一段代码，包含 babel 所有的 helper 函数。babel-helpers 包里存放了很多帮助函数，如果 babel 检测到某个文件编译时就会把这个函数放到模块的顶部。但是如果有多个文件都是用了这些 helpers 就会导致多个模块重复定义。external-helpers 插件，它允许 Rollup 在包的顶部只引用一次 “helpers”，而不是每个使用它们的模块中都引用一遍。~~现在是默认支持了。
   另外，.babelrc 文件放在 src 中，而不是根目录下，这样可以为不同的任务配置不容的.babelrc（比如测试）。babel 模板里配置的兼容是 `"browserslist": [ "iOS >= 8", "Android > 4.4" ]` 每个库文件需求可能都不同。根据需要自行修改。 babel 配置和兼容性息息相关。后续会单独再讲。
5. prettier [lint-staged](https://github.com/okonet/lint-staged#configuration) git add 时格式化代码，便于不同人开发中代码风格统一。
6. [rollup-plugin-replace](https://www.npmjs.com/package/rollup-plugin-replace) 设置环境变量值，从而便于为浏览器端和 node 端打包需要的代码。

## 关于Rollup

Rollup 是一个 JavaScript 模块打包器。它会对符合 js 的 ES6 模块的文件进行打包（非 ES6 模块如 commonjs 模块需要插件先转化为 es6 模块）。另外，Rollup 会自动的进行 tree shaking,有效的降低代码体积。然而，Rollup 暂还不支持码拆分和运行时态的动态导入，所以更适合用作 library 的打包器。
