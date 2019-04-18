首页 推荐、搜索  产品列表 产品详情  购物车 订单

体验逼真   样式逼真  
技能全面
数据真实
一线城市 
二线城市
三线城市

continue 用在 while 和 for 中的区别：



- 在 while 循环中，在循环开始处指定的 expression 会重复检测，如果检测结果为 true，循环体会从头开始执行
- 在 for 循环中，**首先计算自增表达式，然后再次检测 test 表达式**，用以判断是否执行循环体
 


如果同级没有 catch 块捕获 try 块抛出的异常，会首先执行 finally 块，然后异常会沿调用栈向上传播，直到被捕获，或者向用户抛出错误。

    try{
	    try{
	    	throw "err"
	    	console.log("err1")
	    }
	    finally{
	    	console.log('fin1')
	    }
    
    }
    catch(e){
    	console.log(e)
    }
    finally{
    	console.log('fin2')
    }
	//fin1
	//err
	//fin2


with 不能用于严格模式中；创建新的属性不能使用 with，可以修改、删除属性。



Object.prototype 处于所有内置对象的原型链上。只有对象 Object.prototype 没有原型。它是只读的。

a={}; a=new Object(); Object.create(Object.prototype); 这三者等价。

Object.create(null) 创建了一个没有原型的对象。

delete 运算符可以删除对象的属性。它只是断开属性和宿主对象的联系，而不会去操作属性中的属性。

    a={p:{x:1}};b=a.p;delete a.p;b.x==1//true

由于已经删除的属性引用依然存在，因此可能造成内存泄漏。所以在销毁对象时，要遍历属性中的属性，依次删除。

this是执行上下文环境的一个属性，而不是某个变量对象的属性

和变量不同，this是没有一个类似搜寻变量的过程。当你在代码中使用了this,这个 this的值就直接从执行的上下文中获取了，而不会从作用域链中搜寻。this的值只取决中进入上下文时的情况。 this 的属性值会在原型链上进行查找。

在一个函数上下文中，this由调用者提供，由调用函数的方式来决定。如果调用括号()的左边是引用类型的值，this将设为引用类型值的base对象（base object），在其他情况下（与引用类型不同的任何其它属性），这个值为null。不过，实际不存在this的值为null的情况，**因为当this的值为null的时候，其值会被隐式转换为全局对象。注：第5版的ECMAScript中，已经不强迫转换成全局变量了，而是赋值为undefined。**

foo.call(null)    foo.call(undefined)   其this指向了全局变量

在Node中，不会将 var 声明的变量绑定为全局变量的一个属性。
