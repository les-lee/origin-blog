# webpack 作者的 webpack 教程(3)

[原文][13] (撞墙警告)

这是第三篇,也是目前为止的最后一篇了.

## 概括

在这个系列的第一部分我们学习了在webpack,和webpack的github 组织(其实就是介绍webpack各个基础库的用途,感兴趣的可以去看一下链接在[这里][1]),在第二部分,我们介绍了Tapable,学习了一个类似于nodejs 的 EventEmitle的只有2百多行的代码的库,还知道了他掌控着webpack 的整个插件系统.

除此之外,我们知道了webpack 如何去创建tapable 实例(继承Tapable的类),和webpack 如何去注册他们,和执行他们的功能,最后我们学习了每一个在webpack中的tapable实例的功能.

## 构建依赖图

在这篇文章中,我们准备结合我们所学到的东西和webpack如何构建依赖图的高级解释连在一起

依赖图是webpack中的一个关键架构,我们相信,只要我们知道了他是如何工作的,就能给我们带来更远的眼界.(就是看webpack 看得更透彻了)

[这里][2]作者贴了一个youtube的链接, 是作者在一次演讲中对webpack 一次解析, 他建议配套观赏,没字幕,英文字幕都没,而且还很长有一个半小时,有兴趣的可以去看一下.

## 第一步,初始化(Compiler)

设置我们已经拥有的webpack配置(所谓的编译选项), 当webpack运行的时候我们遇到的第一个Tapable实例就是`Compiler`. 因为他只负责触发`run`, `failed`, `done`这些高级事件,所以他是一个中央调度器, 这个编译器(Compiler) 始终会返回一个`Compilation`, 和其他的一些重要的tapable实例,例如`NormalModuleFactory`, `ContextModuleFactory`

![图片描述][3]

![图片描述][4]

[你可以在这里找到所有的注释][5]

当`Compiler` 实例化了编译所需的插件和对象之后, 他会返回一个`nwe Cpmpilation`

## 第二步 开始编译 此处用的是 Compilation (构建依赖图)

在Compilation 之后 (第二个Tapable实例)

我们把你应用的依赖图描述成为`Compilation`, 就好像把一个人描述成一个对象一样,我们必须要在某处有一个跟节点,然后分支出其他的节点

我们正在描述的就是你的配置的入口属性,

即使我们提供了入口点路径,webpack 还是需要确认那个路径存不存在,下面我们将会开启一组递归操作

### Resolve(Resolve 实例)

任何时候都可以提供一个原请求(模块的路径),在这个例子中,就是入口点,webpack会首先发送这些路径信息给Resolve实例去解析得到入口文件.Resolve 实例会用 [增强的nodejs 正则模版][6]去确定该路径是否存在该模块,然后返回一个关于Resolve 模块的额外的信息, 这个信息包含文件系统统计信息,绝对路径,和Resolve模块的唯一ID标识

![图片描述][7]

- [创建模块 :][8] 然后Resolve 会 在原信息在内存中或者缓存中被捕获的时候. 发送 resolve 模块信息到NormalMouduleFactory.

- Parse 模块: 模块工厂会指定Parser 实例到每一个工厂创建的`NormalModule`,在模块源存储之后,`Parser`会分析这个模块,此外,他还会通过被称作`loaders`(loader 概念不懂得可以查看官方文档)一系列的转换去发送`Module`,一个loader链在最后都会返回一个JavaScript代码,因此,`Parser`现在可以开始解析源码并且声称AST(抽象语法树)了

- 寻找依赖, 现在我们在AST上有了模块的信息,[我们可以为特定类型的语句和表达式遍历AST了][9],我们要寻找的是我们定义的依赖说明,因此,当`Parse`遍历AST 并且遇上`require(foo)`这样的信息的时候,那么这个信息就会存储到`Dependeny`实例,并且把他跟原来的模块关联起来(链表的概念)

![图片描述][10]

- 重复执行: 一旦模块的所有的依赖都被找到了,我们需要[处理][11]他们,这就是递归发生的地方(前面的链接),每一个模块都要执行上面的操作来找到他们依赖的模块.

![图片描述][12]

译者注: webpack 大概的流程说得挺清楚明白的,就下来就是要看各位骚操作的时候了

[1]: https://medium.com/webpack/the-contributors-guide-to-webpack-part-1-a0410cc82ca4
[2]: https://www.youtube.com/watch?v=4tQiJaFzuJ8
[3]: /webpackguide/compiler_run.png
[4]: /webpackguide/compile.png
[5]: https://github.com/thelarkinn/artsy-webpack-tour
[6]: https://github.com/webpack/enhanced-resolve
[7]: /webpackguide/module_factory.png
[8]: https://github.com/webpack/webpack/blob/c71fd05f98a752753b9450f590c970b76379803d/lib/Compilation.js#L142-L178
[9]: https://github.com/webpack/webpack/blob/c71fd05f98a752753b9450f590c970b76379803d/lib/Parser.js#L678-L738
[10]: /webpackguide/parser.png
[11]: https://github.com/webpack/webpack/blob/c71fd05f98a752753b9450f590c970b76379803d/lib/Compilation.js#L180-L205
[12]: /webpackguide/all.png
[13]: https://medium.com/webpack/the-contributors-guide-to-webpack-part-3-44cc149af02c