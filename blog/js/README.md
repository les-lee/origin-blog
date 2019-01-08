---
title: 'javascript 对象进阶'
---
# 对象属性

属性描述符给js添加了巨大的可能性，要想搞懂前端3大框架原理，不懂不行啊。

## Object.getOwnPropertyDescriptor()

此函数传入两个参数，一个是目标对象，一个是目标对象的属性，返回的是一个该属性的属性描述符对象，就像这样。

```js
var obj = {test: 'test'}
console.log(Object.getOwnPropertyDescriptor(obj, 'test'))
// 输出
{ value: 'test',
  writable: true,
  enumerable: true,
  configurable: true
}

// 建议各位看官，自己动手试一下噢
```

可以看到，如果是用字面量声明的对象，默认 writable enumerable configurable 的值都是true

## Object.defineProperty()

此函数传入3葛参数，第一个是目标对象，第二个是要修改的目标对象的属性（可以是目标对象没有的属性），第三个是属性描述符对象，

## 下面我们来修改一下wratable 属性描述符，看看会发生什么？

```js
Object.defineProperty(myObject, 'test', {
  writable: false
})

myObject.a = 'test again'

console.log(myObject)// {test: 'test'} ???
```

oh 我的again呢？

在writable 为false 的时候，js会忽略掉 该属性的赋值行为，我去太坑了，不行也不告诉我一声。（若想他告诉你，请使用严格模式）

如果我 define 一个不存在的属性的property呢？就像这样

```js
Object.defineProperty(myObject, 'test2', {
    value: 'testtest'
})
console.log(Object.getOwnPropertyDescriptor(myObject, 'test2'))
// 输出
{ value: 'testtest',
  writable: false,
  enumerable: false,
  configurable: false
}
```

我去，定义一个不存在的属性会创建一个只有value， 其他描述符都为false的属性，这样定义的属性，其他描述符默认为false（超级安全）

## 现在来试试 修改configurable吧

```js
Object.defineProperty(myObject, 'test', {
  configurable: false,
  value: 'testconfigurable',
  enumerable: true,
  writable: false
})

Object.defineProperty(myObject, 'test', {
  writable: true
})

myObject.test = 'config writable after set the configurable flase';
console.log(Object.getOwnPropertyDescriptor(myObject, 'test'))
console.log(myObject.test) // error: cant not redefine.....

```

噢 报错了，我们把configurable 修改的同时 把 wriable 也弄成false了，然后 再把writable 给弄回来ture 发现报错了，原来 configurable 是不让我们修改 test 这个属性的描述符了吗？

我们再来试一下，先修改configurable 再动 writable。

```js
Object.defineProperty(myObject, 'test', {
  configurable: false,
  value: 'testconfigurable',
  enumerable: true,
  writable: true
})

Object.defineProperty(myObject, 'test', {
  writable: false
})

myObject.test = 'config writable after set the configurable flase';
console.log(Object.getOwnPropertyDescriptor(myObject, 'test'))
console.log(myObject.test) // testconfigurable
```

我的天啊，what happen 赋值失败？？？ writable false 生效？ 什么情况。。。 只许州官放火，不许百姓点灯啊（不知道是bug，还是另有原因，不过谁让他是js，就是这么神奇）

既然是不可修改属性，那我直接移除了呢？就像这样

```js
var myObject = {test: 'test'}
console.log(myObject) // test
delete myObject.test
console.log(myObject.test) // undefined
// myObject.a = 'bbb'

myObject.test = 'test';

Object.defineProperty(myObject, 'test', {
  configurable: false,
  value: 'testconfigurable',
  enumerable: true,
  writable: true
})

console.log(myObject) // testconfigurable
delete myObject.test
console.log(myObject) // testconfigurable
```

可以看到，你删我不到~，你删我不到~

## enumerable （可枚举的

照常

```js
var myObject = {test: 'test'}

Object.defineProperty(myObject, 'test', {
  configurable: false,
  value: 'testconfigurable',
  enumerable: false,
  writable: true
})

console.log(myObject)
// 输出
{ value: 'testconfigurable',
  writable: true,
  enumerable: false,
  configurable: false }

{}
```

？？ 我的属性呢？ 莫得了？ 但是描述符在啊？ value 也在啊

enumerable 是控制属性是否能 照常显示的描述符，若为false 不单只console.log 不出来 就连 forin 循环也不会遍历到他的key值

好了，所有的属性描述符的性质都已经介绍过了，我们已经知道了他们是什么了，但是这些描述符有什么用呢？为什么需要这些描述符呢？

## 创建不可变的对象

试想一下，在没有属性描述符的时候，如何解决对象这种引用类型的不可变？不可能。。。

上面我们已经说过，当一个属性被设置为configurable 为 false 的时候，该属性不能被删除，当我们设置writable 为false 的时候，该属性不能被修改，嗯？，这不就是不可变的吗，上文演示的是字符串，那我们来测试一下对象吧

```js
var myObject = {test: {}}

Object.defineProperty(myObject, 'test', {
  configurable: false,
  enumerable: true,
  writable: false
})

myObject.test.test = 'test'

console.log(myObject)// {test: {test}: 'test'}
```

我去，不行啊，还是写进去了，难道要用递归把他全部的子属性的子属性都这样定义一遍？

不怕，官方有新的API 来支持这一个功能

## Object.preventExtendsions(myObject)

该函数接受一个对象，该对象变得不可扩展

```js
var myObject = {
    a: 2
};

Object.preventExtensions( myObject );

myObject.b = 3;
myObject.b; // undefined

var anotherObj = {test: {}}
Object.preventExtensions( anotherObj);
anotherObj.test.test = 3;
anotherObj.test.test; // 3
```

从这段代码，可以看到 preventExtensions 仅仅是支持 顶层对象的不可扩展，并不能限制子层对象的扩展。

## seal() 封印

Object.seal(myObjct) 会把myObject 的所有属性的 configurable 都设置为false（注意writable 还是为true的），并且都不可扩展。（但是子层引用属性仍然能被修改）

## freeze() 冻结

Object.freeze(myObjct) 会把myObject 的所有属性的 configurable 都设置为false writable 为false，并且都不可扩展。（但是子层引用属性仍然能被修改）,这是你能在js中获得的最不可变的对象了。

## 访问器描述符

对象描述符，除了属性描述符以外，还有一种访问器描述符。

### get

```js
Object.defineProperty(myObject, 'test', {
    get () {
        console.log('获取值')
        return 'testsetestest'
    }
})
myObject.test = 222;
console.log(myObject.test);
// 输出
获取值
testsetestest
```

### set

```js
Object.defineProperty(myObject, 'test', {
    get () {
        console.log('获取值')
        return this.test2
    },
    set (val) {
        console.log('设置值')
        this.test2 = val
     }
})
myObject.test = 'ttttttt'
console.log(myObject.test2)f // ttttttt
```

综合上面两段代码来看，当我们给该属性设置了get，然后再给该属性赋值时，js会执行get方法 并且 把赋的值给忽略掉，如果我们要让get 和 set 按照正常的思维工作起来，就要借助另外一个属性 来达到正常操作的目的。感觉这有点儿像 vue 中 watch 和 computed 的思维工作方式，说不定他们有很大的关系。

好了，今天就到这吧，对于对象更深入的就是原型链了，这个东西要说的话就另起一篇吧，不然这文章就太长了撒。
