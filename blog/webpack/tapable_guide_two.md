# webpack 作者的 tapable 教程(2)

[原文][2] (撞墙警告)

这是一个系列的文章,目前一共有3篇,是原作者在去年开始连载的系列教程, 我看了一下没看太懂, 翻译出来,大家探讨一下, 这个是第二部分, 第一部分是webpack 的各个包的功能介绍.就不翻译了.想看的就按原文链接 你就能找到全部的系列

## 深入了解

就算这篇教程和上一篇教程都是关于如何向webpack贡献代码的,但是我想先花费一些时间给你们说一下你将会在很多项目中看见的范例(很多项目指的应该是 webpack 里面分布的包)

注意: 对于想向webpack 贡献代码的小伙伴, 或者想自己写插件的小伙伴,这对你们尤其有用.

## tapable

就像上一部分说的,tapable 是webpack 的核心构建块,(webpack是又很多个块组成的),类和对象都继承tapable是tapable 的实例,下面有一个非常简单的例子.

```js
const Tapable = require('tapable');
class Compiler extends Tapable {
  constructor() {  
    this.foo = "43";
    this.applyPluginsAsync("run", this, function(err, done) {
      if (done) {this.doRunStuffAfterSuccess()}
    }
this.applyPlugins("done", stats);
  }
}
```

tapable 添加了插件可以挂钩进去的事件触发功能, 你可以在你使用的任何webpack库中搜索this.applyPlugins 找到挂钩的事件.(一般是插件源码)

## 解剖一个插件

一个webpack 插件的样子最好描述成一个实现了 apply() 方法的类,这个方法会在tapable 实例(通常指Compiler)的初始化事件钩子中被调用,体验一下下面的例子.

```js
class MyFirstPlugin {
  apply(compiler) {
    compiler.plugin("run", function(compiler, cb) {
      console.log("webpack is about to start bundling");
      cb(); // cb() signals to the compiler that this asnyc hook is finished.
    });
compiler.plugin("done", function(stats) {
      console.log("webpack is finished bundling");
    });  
  }
}
```

这里有几个关键的点

- compiler实例被传进去apply 方法,这给了你一个访问tapable实例的途径,然后你就可以 'tap'(我估计是事件流的概念,跟绑定的概念相似,具体可以去了解一下事件流) 进去tapable 触发的事件.

- 要钩进去事件里面,就必须要在tapable实例上调用`.plugins`函数,然后指定事件的名字,和一个执行你的逻辑的回调.

- 如果这个事件是异步的,回调事件的最后一个参数,将会是一个回调钩子,他会在我们的自定义逻辑执行完毕后,发出信号.

## 如何去注册一个插件

tapable实例通过调用apply方法,传入一个nwe 出来的插件实例来注册插件,例如,如果我们要注册上面的插件,我们只需要这样写,`compiler.apply(new MyFirstPlugin())`

## 插件的设计模式

webpack 的插件都是设计成单一目的的,也就是一个插件只能有一个功能.观察下面的代码;

```js
var SingleEntryPlugin = require("./SingleEntryPlugin");
var MultiEntryPlugin = require("./MultiEntryPlugin");

function EntryOptionPlugin() {}
module.exports = EntryOptionPlugin;

EntryOptionPlugin.prototype.apply = function(compiler) {
  compiler.plugin("entry-option", function(context, entry) {
    function itemToPlugin(item, name) {
      if(Array.isArray(item))
        return new MultiEntryPlugin(context, item, name);
      else
        return new SingleEntryPlugin(context, item, name);
    }
    if(typeof entry === "string" || Array.isArray(entry)) {
      compiler.apply(itemToPlugin(entry, "main"));
    } else if(typeof entry === "object") {
      Object.keys(entry).forEach(function(name) {
        compiler.apply(itemToPlugin(entry[name], name));
      });
    }
    return true;
  });
};
```

**EntryOptionPlugin’s**  唯一的目的就是要钩(这里的勾是钩子函数的概念)进去compiler实例,以获得所有在配置文件里面定义的对象的入口点,然后转换为`SingleEntryPlugin`实例 或者`MultiEntryPlugin`实例的值,然后把这些插件传递回`compiler.aaply()`去注册他们.

> 学习源码,写你自己的插件,问问题,做笔记,使用这些难以置信(估计作者在这里幽默了一番,这些方法并不难以执行)的方法,你不仅能学会属于自己的技能,还可以让你成为webpack的下一个贡献者,最后在一天结束的时候,感到很有趣.

## webpack中的Tapable 实例 (你可以插件化的类)

现在你在webpack 和他的插件系统如何工作上有一定的了解,让我们来看一下被webpack 使用的tapable.

- Compiler --- 编译运行时,包含了所有的编译钩子的顶级模块,插件可以钩进`run` 和 `emit`这样的事件.

- Compilation--- webpack Compiler 类的产物,`Compiler` 类返回`Compilation‘s`, 这是你的应用的依赖图的入口`Compilation` 包含了 `optimize-modules`, `seal` and `optimize-chunk-assets`这样的钩子,所有的优化,和整体程序的编译,和工具,都会在`Compilation` 执行.

- Resolver(s) ---- webpack 解析器 是由[enhanced-resolve][1] 这个插件创建的.插入webpack解析器的插件,是用于定制模块解析策略(详情请了解策略模式)的,你的webpack的配置的`resolve`对象的所有属性对应于已经应用的指定的插件解析器.

- NormalModuleFactoty --- 这个东西是一个胶水,把 `resolver`, `loader` 和 `NormalModule` 的创建物绑定在一起,你会用到的生命周期钩子包括`before-resolve`, `after-resolve`, 和 `create-module`, 除此之外,loaders 针对每一个模块运行,他可以从他们的原的文件,转换成可以被添加进入webpack的 `chunk`的东西(例如vue-loader 就会把vue文件转换成 对象)

- ContextModuleFatory --- 这个插件除了,可以动态requires 以外,其他的都跟上面那个一样.

- Templelate --- 因为webpack 捆绑的时候,会生成bundle 代码, Templelate 实例 就是负责绑定的模块数据产出时的结构

- Temple Subclasses --- 它有许多级别的模版, `MainTemplate` (运行时 绑定(bundle)包装器), `ChunkTemplate` 等等....(这里我建议你们看原版吧,实在翻译不出)

- Parser --- webpack Parser 是webpack 源码中最特别的一个tapable实例之一,parser 实例是一个由 `acorn` ast 分析器 提供功能的tapable 实例.

> 前面所有的类都可以发出Tapable事件因此可以为他们编写插件.

译者注: 原文下面都是一些让你努力学习,天天向上,让你选择一个源码去看,然后是最紧要系你觉得开心,之类的话,我选择不译.

> tapable 库已经经过更新, 上面提到的方法已经废弃了,但是基本架构并没有改变, 具体请关注github的tapable仓库

[1]: https://github.com/webpack/enhanced-resolve
[2]: https://medium.com/webpack/the-contributors-guide-to-webpack-part-2-9fd5e658e08c