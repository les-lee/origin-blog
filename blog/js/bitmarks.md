---
tags:
  - js
  - lodash
---
# 写给自己看的 bitmarks 解释

## 文章起因

近期因为函数式编程的curry开始了lodash的源码阅读,结果开开头就看到了这样的代码

```js
  var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;
```

程序员就不用说了,什么2,4,8,16,这样的数列一看就知道是什么东西.

 然后我在curry函数里面发现这个函数主要是由一个 createWrap的函数 实现, 然后我又进入了这个函数,发现里面有这么些代码

```js
    var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
    bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
```

这里面有个按位与操作,若是没学过其他语言,直接上手javascript 的程序员 估计 会不知道这些基础知识,我是java转的前端,虽然java学得不怎么样,但是这些东西我一看就知道是什么,但是我不知道,这些操作在干什么,也不知道为什么要这么做,于是就开始了我的求知之旅.

lodash 作者在 那一段 标记声明语句的上面 写了这么一个注释

**Used to compose bitmasks for function metadata.**

bitmasks 对我来说可是一个新词.....

## bitmasks是啥

程序猿都知道,有些操作要判断他是什么状态才执行,什么状态不执行.

那么我们就需要一些标记来帮助我们来确定,他是什么状态的.状态可不止 true false 这么简单.

bitmasks 就是用来标记状态的,只不过他是用位操作的方式来标记.

## 为什么要用 bitmasks

相信大家写过这样的状态,比如程序员的撸码和写文章状态.

```js
var NO_STATUS = 0;
var CODING = 1;
var WRITING = 2;
```

我们可以在上面的状态中切换,我们设置状态的时候可以这样设置.

```js
var NOW_STATUS = CODING;
if (NOW_STATUS === CODING) {
    // todo
}
```

当我们要清楚状态的时候 我们又要重新取消状态;

如果我们的状态需要组合,比如我现在一边写文章,一边撸码,那么我们是否要定义多一个状态,来满足我们的需求呢?

学过排列与组合的就知道,当状态越多的时候,组合是成次方增长的.(意思就是,定义到你扑街---手抽筋)

## bitmarks 如何使用

如果使用bitmasks 状态就会变成下面这样,参考 lodash 源码

```js
var NO_Status = 0;
var CODING = 2;
var WRITING = 4;
```

那么,现在我们设置状态还用 a = b 这种形式吗,既然使用了 bitmarks 那就要体现出这个 bit 呀

现在我们这样设置状态

```js
    var NOW_STATUS |= CODEING
```

二进制就不再这里跟大家说了,程序员必备知识

这里用8位来演示,16 32 也不过是多几个0而已

NOW_STATUS: 0000 0000
CODEING:    0000 0010
按位或操作 同位两个数任意一个是1 结果就为1
得到  0000 0010 如此状态设置成功

| 按位或操作是放大操作, 也就得到的数会比两个都大,如果前面的值是0,后面的值大于0, 那么得到的结果就是后者的本身,如此就设置了CODEING的 状态 可用于 为true 时执行的判断;

若是我们要消除这个状态,普通做法是重新赋值为NO_STATUS,现在我们这样做.

```js
    var NOW_STATUS &= ~(CODEING)
```

与是缩小操作,把CODEING 按位非以后........ 说个蛇皮怪,按位操作自己百度去.

这里只解释原因, 为什么要按位非,我们用按位或操作 设置了值,如果我们要返回去,那么我们必须要按位与才能够返回去,因为一个为放大操作,一个为缩小操作,那么我们怎么才能返回去呢,按位与操作 相同位只要有一个0 那么结果位就是0 那么简单了 我们只要把原来放大的数的相同位的1变回0 那不就可以了嘛 在 按位操作中,~ 就是这样的操作,就像这样 2 是 0000 0010 按位非后 1111 1101 在于 0000 0010 按位与 我去 变成0000 0000 了,看这不是回去了嘛;

那我如何知道我在那个状态

如果两个大于0的相同的数 按位与,结果会返回原来的数

就像这样,

NOW_STATUS & CODEING > 0 那么就可以确定你再哪个状态了

那么如果我的状态要组合呢? 就是这两个参数都可以 还需要重新定义一些状态吗, 天真,看我的

```js
    var NOW_STATUS= CODEING | WRITING
```

nor! 状态出来了, 而且极具可读性, 一看就知道我 一边CODEING 一边 WRITING , 又多了一个请用一边...一边...造句的例子

解释:

2 | 4 对比 返回的是6 任何两个不一样的数相或 ,都不会有重复的,因此 只要你定义状态的时候 符合 1,2,4,8,16,32 这样的规律你就不会担心状态值相等;

那么如何确定我在这两个状态之一呢?

这样

```js
NOW_STATUS & (CODEING | WRITING) != 0
```

嗯哼?  OJBK
解释: 对应上面代码  6 & (2 | 4) != 0
6 & 4 = 4, 6 & 2 = 2, 都大于0 看判断成功;

## bitmarks 的好处

其实在为什么要用bitmarks 的时候 出现的都是 bitmarks 的好处

但是还有一样, 就是性能, 我们知道内存中数字都是2进制存的, 那么我们操作数字的时候使用2进制的方式操作,能够节省掉那么一丝的系统资源,蚂蚁虽小也是肉呀

lodash 真是个好东西, 虽然我不怎么用,但是里面的基础和思想,是我想要的东西.

## 最后

我会继续阅读,有我能驾驭的,一定再写一些东西分享出来.

## 参考文献

 google 搜索 : bitmarks 前3个 哈哈哈哈哈哈哈哈哈