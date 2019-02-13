# css scroll snap

呵呵哒, 本来想搜 `css shape` 的, 结果 shape (形状背景, 可以实现不规则背景) 这个单词记不得了. 打成了 snap 试一下模糊搜寻, 没成想搜出来这个东西, 新是不新, 就是没见过, 没用过, 而且一用, 哎哟尼玛, 太好用了... 节省了不少 `js`.

## 类 `flex` 风格

这个东东基本由两个属性指定. 一个必须作用在父元素, 一个必须作用在子元素. 嗯? 看着是不是跟 felx 一样一样的.

废话不多说. 先来一个例子. 试着稍微轻轻的滚动一下?

<ScrollSnapDemo />

就问你神奇不神奇, 好用不好用?

## scroll-snap-type

看回例子, 这个属性有两个值, 第一个是 `Y`, 指的是 Y 轴, 你可以指定为 `X` 来指定是 X 轴的滚动, 或者 `block` `inline` 来指定特殊行为. 你还可以指定为 `both` 来同时指定两个方向的滚动类型.

第二个是 `madatory` (强制的).意思就是,强制滚动,从上面的例子你可以看到,无论我们滚动到哪里, 他都会自己滚动一下, 以适应子元素定义的对齐方式(`scroll-snap-align`), 他还可以是 `proximity` (接近的) 意思就是,只有在滚动到接近他的对齐方式的位置时候, 他才会自动滚动到该位置, 如果差很远, 他是不会有滚动行为发生的. 不信自己上上面改一下呀, 嘻嘻嘻!

强制滚动是有一个缺点的, 像上面那种情况,就是如果我就是想要停留在底部,你会发现 这TM根本就由不得我....所以,除非你一个子元素的内容能在父元素的可视范围内看完, 不然你使用强制滚动类型你是看不到底部内容的:cry:

### block 和 inline

`scroll-snap-type: blcok mandatory` 效果跟 `scroll-snap-type: y mandatory` 一样一样的, 因为 `block`指的试 块级元素排列方向的轴, 默认他就是Y轴, 而 inline 指的试 内联元素排列的方向轴, 默认他就是X 轴, 奇怪了, 那么为什么要区分开来呢? 

其实block 和 inline 的方向轴 试可以改变的, 有时候 inline 他也可以是垂直的. 他是可以修改的, 这部分知识就不再这里累述了, 毕竟篇幅不宜过长.

## scroll-snap-align

看属性就知道, `scroll-snap-align` 一种对齐方式. 类似的有, `text-align`, `align-items`, `align-content`, `vertical-align`

这个属性决定的是,自动对齐的位置.

这个属性有3个值 在上面的例子中, 我们使用过了 `start`(自动滚动到当前元素的头部), 他还可以取 `end`, `center` 这两个值, `end` 不用解释了, 对齐底部, 就是他会自动滚动到当前元素的底部, `center` 也不用解释了, 自动滚动到当前元素的中间

注意这个当前元素的判定, 你可以自己尝试一下, 滚动到两个元素交界, 你会发现他的判定是会改变的.

## scroll-padding

这也是一个作用在滚动容器的属性, 他决定了, 滚动到对齐位置的间距, 废话不多说, 下面来一个例子.

尝试改变 `scroll-padding` 的值来体验一下(别忘了试一下负值).

<ScrollSnapPaddingDemo />

在某些情况下这很有用. 比如你想在上面固定显示一个标题, 如果对齐方式你设置为 `start` 那么每次回滚都会被标题盖住(绝对定位), 如果这时候你设置一个 `scroll-padding`,  你看, 世界是不是完美了!

嗯? 有 padding 怎么能没有 `margin` 你知道你猜到了没有.

## scroll-margin

这里我不贴例子了好吗, 自己上去改一下:smirk:

不同的是, 这个是设置在子元素上的噢.

这个距离是对齐位置和元素顶部或者是底部的距离 我把他称作`对齐外边距`

**记住这个词 我在下面会用到**

**同样记得尝试一下负值哦**

其他类似属性

- `scroll-margin-block`

默认是上下方向的 对齐外边距

- `scroll-margin-block-end`
- `scroll-margin-block-start`
- `scroll-margin-inline-start`
- `scroll-margin-inline-end`

start: block/inline 轴开头的方向(默认是上), 当对齐方式是 `start` 时, 效果才看得明显.

end: block/inline 轴结尾的方向(默认是上), 当对齐方式是 `end` 时, 效果才看得明显.

- `scroll-margin-bottom`
- `scroll-margin-top`
- `scroll-margin-left`
- `scroll-margin-right`

同上, 默认情况时 跟 `block-end` `inline-end`等 变现一一对应.

**注意** `scroll-padding` 跟 `scroll-margin` 一样拥有同样的变种属性.

再次提醒: `scroll-padding` 作用于父元素哦

## scroll-snap-stop

这是一个没有实现的属性, 他初步定义于, 让每一个子元素都可以滚动得到, 不会一瞬间就滚动得很多. 用于做缓冲, 不过有一个问题就是, 如果页面过长的话, 用户要滚动很久才能到达底部...

这是一个作用在父元素上的属性.

**注意** 这是一个实验中的属性, 有可能会被移除.

最后, 贴一张浏览器兼容图

![加载图片失败][1]

## 总结

使用在父元素的属性

- `scroll-snap-type`
- `scroll-padding`以及变种
- `scroll-snap-stop`(实验中)

使用在子元素的属性

- `scroll-snap-align`
- `scroll-margin` 以及变种

[1]: /compatibility/scrollsnapcompatibility.png