## 1.let 和 const 命令 ##
    
    没有变量提升；TDZ 暂时性死区
	不允许重复声明
	function func(arg) {
  		let arg; // 报错  函数参数部分与函数体属同一作用域
	}
	function func(arg) {
	  {
	    let arg; // 不报错
	  }
	}
	for (let i = 0; i < 3; i++) {
	  let i = 'abc';
	  console.log(i);
	}
	// abc   for循环有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域
	// abc
	// abc
	在浏览器的 ES6 环境中，块级作用域内声明的函数，行为类似于var声明的变量。
	function f() { console.log('I am outside!'); }   实际运行=>  function f() { console.log('I am outside!'); }
	(function () {                                              (function () {
	  if (false) {                                                 var f = undefined;
	    // 重复声明一次函数f                                         if (false) {
	    function f() { console.log('I am inside!'); }            	function f() { console.log('I am inside!'); }
	  }                                                            }
	  f();                                                         f();
	}());                                                        }());
	// Uncaught TypeError: f is not a function
	应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。
	function f() { console.log('I am outside!'); }
	(function () {
	  if (false) {
	    // 重复声明一次函数f
	    let f=function () { console.log('I am inside!'); }
	  }
	  f();
	}());     //I am outside!

## 2.变量的解构赋值 ##

    const [a, b, c, d, e] = 'hello';
	let {length : len} = 'hello'; //len 5
	var { message: msg = 'Something went wrong' } = {};
	msg // "Something went wrong"
	默认值生效的条件是，对象的属性值严格等于undefined。
	
	解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。
	let {toString: s} = 123;
	s === Number.prototype.toString // true	
	let {toString: s} = true;
	s === Boolean.prototype.toString // true
	由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。

	在解构赋值中尽量不要使用圆括号；可以使用圆括号的情况只有一种：赋值语句的非模式部分，可以使用圆括号。
	[(b)] = [3]; // 正确
	({ p: (d) } = {}); // 正确  p是模式部分
	[(parseInt.prop)] = [3]; // 正确

	用途：
	（1）交换变量的值  let x = 1;  let y = 2;  [x, y] = [y, x];
	（2）从函数返回多个值
	// 返回一个数组
	function example() {
	  return [1, 2, 3];
	}
	let [a, b, c] = example();
	// 返回一个对象
	function example() {
	  return {
	    foo: 1,
	    bar: 2
	  };
	}
	let { foo, bar } = example();
	（3）函数参数的定义
	// 参数是一组有次序的值
	function f([x, y, z]) { ... }
	f([1, 2, 3]);
	// 参数是一组无次序的值
	function f({x, y, z}) { ... }
	f({z: 3, y: 2, x: 1});
	（4）提取 JSON 数据
	解构赋值对提取 JSON 对象中的数据，尤其有用。
	let jsonData = {
	  id: 42,
	  status: "OK",
	  data: [867, 5309]
	};
	let { id, status, data: number } = jsonData;
	console.log(id, status, number);
	// 42, "OK", [867, 5309]
	（5）函数参数的默认值
	jQuery.ajax = function (url, {
	  async = true,
	  beforeSend = function () {},
	  cache = true,
	  complete = function () {},
	  crossDomain = false,
	  global = true,
	  // ... more config
	} = {}) {
	  // ... do stuff
	};
	指定参数的默认值，就避免了在函数体内部再写var foo = config.foo || 'default foo';这样的语句。
	（6）遍历 Map 结构
	任何部署了 Iterator 接口的对象，都可以用for...of循环遍历。Map 结构原生支持 Iterator 接口，配合变量的解构赋值，获取键名和键值就非常方便。
	const map = new Map();
	map.set('first', 'hello');
	map.set('second', 'world');
	for (let [key, value] of map) {
	  console.log(key + " is " + value);
	}
	// first is hello
	// second is world
	如果只想获取键名，或者只想获取键值，可以写成下面这样。
	// 获取键名
	for (let [key] of map) {
	  // ...
	}
	// 获取键值
	for (let [,value] of map) {
	  // ...
	}
	（7）输入模块的指定方法
	加载模块时，往往需要指定输入哪些方法。解构赋值使得输入语句非常清晰。
	const { SourceMapConsumer, SourceNode } = require("source-map");

## 3.字符串的扩展 ##
- includes()：返回布尔值，表示是否找到了参数字符串。
- startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
- endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。


> 	let s = 'Hello world!';
> 	
> 	s.startsWith('Hello') // true
> 	s.endsWith('!') // true
> 	s.includes('o') // true


repeat方法返回一个新字符串，表示将原字符串重复n次。
   
    'x'.repeat(3) // "xxx"
    'hello'.repeat(2) // "hellohello"
    'na'.repeat(0) // ""

padStart()用于头部补全，padEnd()用于尾部补全。

	'x'.padStart(5, 'ab') // 'ababx'
	'x'.padStart(4, 'ab') // 'abax'
	
	'x'.padEnd(5, 'ab') // 'xabab'
	'x'.padEnd(4, 'ab') // 'xaba'

模板字符串

	$('#result').append(`
	  There are <b>${basket.count}</b> items
	   in your basket, <em>${basket.onSale}</em>
	  are on sale!
	`);
模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。大括号内部可以放入任意的 JavaScript 表达式，可以进行运算，以及引用对象属性。模板字符串之中还能调用函数。

	function fn() {
	  return "Hello World";
	}
	
	`foo ${fn()} bar`
	// foo Hello World bar


## 4.正则的扩展 ##
1.具名组匹配
   

    const RE_DATE = /(\d{4})-(\d{2})-(\d{2})/;
    
    const matchObj = RE_DATE.exec('1999-12-31');
    const year = matchObj[1]; // 1999
    const month = matchObj[2]; // 12
    const day = matchObj[3]; // 31
组匹配的一个问题是，每一组的匹配含义不容易看出来，而且只能用数字序号（**比如matchObj[1]**）引用，要是组的顺序变了，引用的时候就必须修改序号。

ES2018 引入了具名组匹配（Named Capture Groups），允许为每一个组匹配指定一个名字，既便于阅读代码，又便于引用。

    const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
    
    const matchObj = RE_DATE.exec('1999-12-31');
    const year = matchObj.groups.year; // 1999
    const month = matchObj.groups.month; // 12
    const day = matchObj.groups.day; // 31

上面代码中，“具名组匹配”在圆括号内部，模式的头部添加“问号 + 尖括号 + 组名”（?<year>），然后就可以在exec方法返回结果的groups属性上引用该组名。同时，数字序号（matchObj[1]）依然有效。如果具名组没有匹配，那么对应的groups对象属性会是undefined。

2.解构赋值和替换

有了具名组匹配以后，可以使用解构赋值直接从匹配结果上为变量赋值。

    let {groups: {one, two}} = /^(?<one>.*):(?<two>.*)$/u.exec('foo:bar');
    one  // foo
    two  // bar
字符串替换时，使用$<组名>引用具名组。

    let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;
    
    '2015-01-02'.replace(re, '$<day>/$<month>/$<year>')
    // '02/01/2015'
上面代码中，replace方法的第二个参数是一个字符串，而不是正则表达式。

replace方法的第二个参数也可以是函数，该函数的参数序列如下。
    
    '2015-01-02'.replace(re, (
       matched, // 整个匹配结果 2015-01-02
       capture1, // 第一个组匹配 2015
       capture2, // 第二个组匹配 01
       capture3, // 第三个组匹配 02
       position, // 匹配开始的位置 0
       S, // 原字符串 2015-01-02
       groups // 具名组构成的一个对象 {year, month, day}
     ) => {
     let {day, month, year} = args[args.length - 1];
     return `${day}/${month}/${year}`;
    });
具名组匹配在原来的基础上，新增了最后一个函数参数：具名组构成的一个对象。函数内部可以直接对这个对象进行解构赋值。

## 5.数值的扩展 ##

1.ES6 提供了二进制和八进制数值的新的写法，分别用前缀0b（或0B）和0o（或0O）表示。

2.ES6 在Number对象上，新提供了Number.isFinite()和Number.isNaN()两个方法。它们与传统的全局方法isFinite()和isNaN()的区别在于，**传统方法先调用Number()将非数值的值转为数值**，再进行判断，而这两个新方法只对数值有效，**Number.isFinite()对于非数值一律返回false**, **Number.isNaN()只有对于NaN才返回true**，非NaN一律返回false。

    Number.isNaN(NaN) // true
    Number.isNaN('NaN') // false
    isNaN('NaN') // true
    Number.isFinite(15) // true
    Number.isFinite('15') // false
    isFinite('15') // true

3.ES6 将全局方法parseInt()和parseFloat()，移植到Number对象上面，行为完全保持不变。

4.Number.isInteger()用来判断一个数值是否为整数。

    Number.isInteger(25) // true
    Number.isInteger(25.1) // false
JavaScript 内部，整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值。

    Number.isInteger(25) // true
    Number.isInteger(25.0) // true
如果参数不是数值，Number.isInteger返回false。

    Number.isInteger() // false
    Number.isInteger(null) // false
    Number.isInteger('15') // false
    Number.isInteger(true) // false
注意，由于 JavaScript 采用 IEEE 754 标准，数值存储为64位双精度格式，数值精度最多可以达到 53 个二进制位（1 个隐藏位与 52 个有效位）。如果数值的精度超过这个限度，第54位及后面的位就会被丢弃，这种情况下，Number.isInteger可能会误判。

    Number.isInteger(3.0000000000000002) // true
上面代码中，Number.isInteger的参数明明不是整数，但是会返回true。原因就是这个小数的精度达到了小数点后16个十进制位，转成二进制位超过了53个二进制位，导致最后的那个2被丢弃了。

类似的情况还有，如果一个数值的绝对值小于Number.MIN_VALUE（5E-324），即小于 JavaScript 能够分辨的最小值，会被自动转为 0。这时，Number.isInteger也会误判。

    Number.isInteger(5E-324) // false
    Number.isInteger(5E-325) // true
上面代码中，5E-325由于值太小，会被自动转为0，因此返回true。

总之，如果对数据精度的要求较高，不建议使用Number.isInteger()判断一个数值是否为整数。




> 
> **get**方法：a=[1,2,3]=>a[]=1&a[]=2&a[]=3
> 
> **post**方法：a=[1,2,3]=>a=1&a=2&a=3


## 6.函数的扩展 ##
- 1.函数参数的默认值

ES6 之前，不能直接为函数的参数指定默认值，只能采用变通的方法。

    function log(x, y) {
      y = y || 'World';
      console.log(x, y);
    }
    
    log('Hello') // Hello World
    log('Hello', 'China') // Hello China
    log('Hello', '') // Hello World

上面代码检查函数log的参数y有没有赋值，如果没有，则指定默认值为World。**这种写法的缺点在于，如果参数y赋值了，但是对应的布尔值为false，则该赋值不起作用。**就像上面代码的最后一行，参数y等于空字符，结果被改为默认值。

**为了避免这个问题，**通常需要先判断一下参数y是否被赋值，如果没有，再等于默认值。

    if (typeof y === 'undefined') {
      y = 'World';
    }

- 2.rest参数

for...of  用于遍历数组的value      for...in 可以遍历数组的index

利用 rest 参数改写数组push方法的例子。

    function push(array, ...items) {
      items.forEach(function(item) {
    	array.push(item);
    	console.log(item);
      });
    }
    
    var a = [];
    push(a, 1, 2, 3)


注意，rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。


    // 报错
    function f(a, ...b, c) {
      // ...
    }

- 3.箭头函数

下面是 rest 参数与箭头函数结合的例子。

    const numbers = (...nums) => nums;
    
    numbers(1, 2, 3, 4, 5)
    // [1,2,3,4,5]
    
    const headAndTail = (head, ...tail) => [head, tail];
    
    headAndTail(1, 2, 3, 4, 5)
    // [1,[2,3,4,5]]

**使用注意点**

箭头函数有几个使用注意点。

（1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。

（2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。

（3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

（4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。

上面四点中，第一点尤其值得注意。this对象的指向是可变的，但是在箭头函数中，它是固定的。

箭头函数可以让setTimeout里面的this，绑定定义时所在的作用域，而不是指向运行时所在的作用域。

    function Timer() {
      this.s1 = 0;
      this.s2 = 0;
      // 箭头函数
      setInterval(() => this.s1++, 1000);
      // 普通函数
      setInterval(function () {
    	this.s2++;
      }, 1000);
    }
    
    var timer = new Timer();
    
    setTimeout(() => console.log('s1: ', timer.s1), 3100);
    setTimeout(() => console.log('s2: ', timer.s2), 3100);
    // s1: 3
    // s2: 0

上面代码中，Timer函数内部设置了两个定时器，分别使用了箭头函数和普通函数。前者的this绑定定义时所在的作用域（即Timer函数），后者的this指向运行时所在的作用域（即全局对象）。所以，3100 毫秒之后，timer.s1被更新了 3 次，而timer.s2一次都没更新。

***this指向的固定化，并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。正是因为它没有this，所以也就不能用作构造函数。***

除了this，以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：arguments、super、new.target。

- 4.bind、call、apply

call 、bind 、 apply 这三个函数的第一个参数都是 this 的指向对象，第二个参数差别就来了：


1. call的参数是直接放进去的，第二第三第n个参数全都用逗号分隔，直接放到后面  obj.myFun.call(db,'成都', ... ,'string' )；
1. apply的所有参数都必须放在一个数组里面传进去  obj.myFun.apply(db,['成都', ..., 'string' ]);
1. bind除了**返回是函数**以外，它 的参数和call 一样。

**布尔真/假值:**

	'' == 0 == -0 == false;
	null == undefined;
	null != false && null != true; undefined != false && undefined != true; NaN != false && NaN != true;
	//在if判断中NaN、null、undefined、""、0、-0都被判定为假；

- 5.尾调用函数优化

ES6 的尾调用优化只在严格模式下开启，正常模式是无效的。

## 7.数组的扩展 ##
### 扩展运算符 ###

扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

扩展运算符后面还可以放置表达式。

    const arr = [
      ...(x > 0 ? ['a'] : []),
      'b',
    ];

如果扩展运算符后面是一个空数组，则不产生任何效果。

    [...[], 1]
    // [1]

在解构赋值里面，等式左边的 ... 只能放在最后一位：

    [head, ...tail] = [1, 2, 3, 4]
    [head, ...middle, tail] = [1, 2, 3, 4] //报错
	const [first, ...rest] = [1, 2, 3, 4, 5];
	first // 1
	rest  // [2, 3, 4, 5]
	
	const [first, ...rest] = [];
	first // undefined
	rest  // []
	
	const [first, ...rest] = ["foo"];
	first  // "foo"
	rest   // []

扩展运算符替代apply函数：

    // ES5 的写法
    Math.max.apply(null, [14, 3, 77])
    
    // ES6 的写法
    Math.max(...[14, 3, 77])
    
    // 等同于
    Math.max(14, 3, 77);
    
    // ES5的 写法
    var arr1 = [0, 1, 2];
    var arr2 = [3, 4, 5];
    Array.prototype.push.apply(arr1, arr2);
    
    // ES6 的写法
    let arr1 = [0, 1, 2];
    let arr2 = [3, 4, 5];
    arr1.push(...arr2);

### 扩展运算符的应用 ###
**复制数组：**

    //es5写法
    const a1 = [1, 2];
    const a2 = a1.concat();
    
    a2[0] = 2;
    a1 // [1, 2]
    
    //es6写法
    const a1 = [1, 2];
    // 写法一
    const a2 = [...a1];
    // 写法二
    const [...a2] = a1;
    
**合并数组**

    // ES5
    [1, 2].concat(more)
    // ES6
    [1, 2, ...more]
    
    var arr1 = ['a', 'b'];
    var arr2 = ['c'];
    var arr3 = ['d', 'e'];
    
    // ES5的合并数组
    arr1.concat(arr2, arr3);
    // [ 'a', 'b', 'c', 'd', 'e' ]
    
    // ES6的合并数组
    [...arr1, ...arr2, ...arr3]
    // [ 'a', 'b', 'c', 'd', 'e' ]

**字符串**

扩展运算符还可以将字符串转为真正的数组。

    [...'hello']
    // [ "h", "e", "l", "l", "o" ]

**实现了 Iterator 接口的对象**

任何 Iterator 接口的对象（参阅 Iterator 一章），都可以用扩展运算符转为真正的数组。

    let nodeList = document.querySelectorAll('div');
    let array = [...nodeList];
上面代码中，querySelectorAll方法返回的是一个nodeList对象。它不是数组，而是一个类似数组的对象。这时，扩展运算符可以将其转为真正的数组，原因就在于NodeList对象实现了 Iterator 。

对于那些没有部署 Iterator 接口的类似数组的对象，扩展运算符就无法将其转为真正的数组。

    let arrayLike = {
      '0': 'a',
      '1': 'b',
      '2': 'c',
      length: 3
    };
    
    // TypeError: Cannot spread non-iterable object.
    let arr = [...arrayLike];
上面代码中，arrayLike是一个类似数组的对象，但是没有部署 Iterator 接口，扩展运算符就会报错。这时，可以改为使用**Array.from**方法将arrayLike转为真正的数组。

**Map 和 Set 结构，Generator 函数**

扩展运算符内部调用的是数据结构的 Iterator 接口，因此只要具有 Iterator 接口的对象，都可以使用扩展运算符，比如 Map 结构。

    let map = new Map([
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
    ]);
    
    let arr = [...map.keys()]; // [1, 2, 3]
Generator 函数运行后，返回一个遍历器对象，因此也可以使用扩展运算符。

    const go = function*(){
      yield 1;
      yield 2;
      yield 3;
    };
    
    [...go()] // [1, 2, 3]
上面代码中，变量go是一个 Generator 函数，执行后返回的是一个遍历器对象，对这个遍历器对象执行扩展运算符，就会将内部遍历得到的值，转为一个数组。

如果对没有 Iterator 接口的对象，使用扩展运算符，将会报错。

    const obj = {a: 1, b: 2};
    let arr = [...obj]; // TypeError: Cannot spread non-iterable object

### Array.from() ###
Array.from方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。

下面是一个类似数组的对象，Array.from将它转为真正的数组。

    let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
    };
    
    // ES5的写法
    var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']
    
    // ES6的写法
    let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

实际应用中，常见的类似数组的对象是 DOM 操作返回的 NodeList 集合，以及函数内部的arguments对象。Array.from都可以将它们转为真正的数组。

**扩展运算符背后调用的是遍历器接口（Symbol.iterator），如果一个对象没有部署这个接口，就无法转换。**Array.from方法还支持类似数组的对象。所谓类似数组的对象，本质特征只有一点，即**必须有length属性**。因此，任何有length属性的对象，都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换。

    Array.from({ length: 3 });
    // [ undefined, undefined, undefined ]
上面代码中，Array.from返回了一个具有三个成员的数组，每个位置的值都是undefined。扩展运算符转换不了这个对象。

对于还没有部署该方法的浏览器，可以用Array.prototype.slice方法替代。

    const toArray = (() =>
      Array.from ? Array.from : obj => [].slice.call(obj)
    )();
Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组。

### Array.of() ###
Array.of方法用于将一组值，转换为数组。

    Array.of(3, 11, 8) // [3,11,8]
    Array.of(3) // [3]
    Array.of(3).length // 1
这个方法的主要目的，是弥补数组构造函数Array()的不足。因为参数个数的不同，会导致Array()的行为有差异。

    Array() // []
    Array(3) // [, , ,]
    Array(3, 11, 8) // [3, 11, 8]
上面代码中，Array方法没有参数、一个参数、三个参数时，返回结果都不一样。只有当参数个数不少于 2 个时，Array()才会返回由参数组成的新数组。参数个数只有一个时，实际上是指定数组的长度。

Array.of基本上可以用来替代Array()或new Array()，并且不存在由于参数不同而导致的重载。它的行为非常统一。

    Array.of() // []
    Array.of(undefined) // [undefined]
    Array.of(1) // [1]
    Array.of(1, 2) // [1, 2]
Array.of总是返回参数值组成的数组。如果没有参数，就返回一个空数组。

Array.of方法可以用下面的代码模拟实现。

    function ArrayOf(){
      return [].slice.call(arguments);
    }

### 数组实例的 copyWithin() ###
数组实例的copyWithin方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。

    Array.prototype.copyWithin(target, start = 0, end = this.length)
它接受三个参数。

target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示倒数。
end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。
这三个参数都应该是数值，如果不是，会自动转为数值。

    [1, 2, 3, 4, 5].copyWithin(0, 3)
    // [4, 5, 3, 4, 5]
上面代码表示将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2

### 数组实例的 find() 和 findIndex() ###
数组实例的find方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。如果没有符合条件的成员，则返回undefined。

    [1, 4, -5, 10].find((n) => n < 0)
    // -5

数组实例的findIndex方法的用法与find方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。

    [1, 5, 10, 15].findIndex(function(value, index, arr) {
      return value > 9;
    }) // 2

### 数组实例的 fill() ###
fill方法使用给定值，填充一个数组。

    ['a', 'b', 'c'].fill(7)
    // [7, 7, 7]
    
    new Array(3).fill(7)
    // [7, 7, 7]
上面代码表明，fill方法用于空数组的初始化非常方便。数组中已有的元素，会被全部抹去。

fill方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。

    ['a', 'b', 'c'].fill(7, 1, 2)
    // ['a', 7, 'c']
上面代码表示，fill方法从 1 号位开始，向原数组填充 7，到 2 号位之前结束。

注意，如果填充的类型为对象，那么被赋值的是同一个内存地址的对象，而不是深拷贝对象。

    let arr = new Array(3).fill({name: "Mike"});
    arr[0].name = "Ben";
    arr
    // [{name: "Ben"}, {name: "Ben"}, {name: "Ben"}]
    
    let arr = new Array(3).fill([]);
    arr[0].push(5);
    arr
    // [[5], [5], [5]]

### 数组实例的 entries()，keys() 和 values() ###
ES6 提供三个新的方法——entries()，keys()和values()——用于遍历数组。它们都返回一个遍历器对象（详见《Iterator》一章），可以用for...of循环进行遍历，唯一的区别是keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。

    for (let index of ['a', 'b'].keys()) {
      console.log(index);
    }
    // 0
    // 1
    
    for (let elem of ['a', 'b'].values()) {
      console.log(elem);
    }
    // 'a'
    // 'b'
    
    for (let [index, elem] of ['a', 'b'].entries()) {
      console.log(index, elem);
    }
    // 0 "a"
    // 1 "b"
如果不使用for...of循环，可以手动调用遍历器对象的next方法，进行遍历。

    let letter = ['a', 'b', 'c'];
    let entries = letter.entries();
    console.log(entries.next().value); // [0, 'a']
    console.log(entries.next().value); // [1, 'b']
    console.log(entries.next().value); // [2, 'c']

### 数组实例的 includes() ###
Array.prototype.includes方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似。ES2016 引入了该方法。

    [1, 2, 3].includes(2) // true
    [1, 2, 3].includes(4) // false
    [1, 2, NaN].includes(NaN) // true
该方法的第二个参数表示搜索的起始位置，默认为0。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度（比如第二个参数为-4，但数组长度为3），则会重置为从0开始。

下面代码用来检查当前环境是否支持该方法，如果不支持，部署一个简易的替代版本。

    const contains = (() =>
      Array.prototype.includes
    	? (arr, value) => arr.includes(value)
    	: (arr, value) => arr.some(el => el === value)
    )();
    contains(['foo', 'bar'], 'baz'); // => false

## 8.对象的扩展 ##
    let ms = {};
    
    function getItem (key) {
      return key in ms ? ms[key] : null;
    }
    
    function setItem (key, value) {
      ms[key] = value;
    }
    
    function clear () {
      ms = {};
    }
    
    module.exports = { getItem, setItem, clear };
    // 等同于
    module.exports = {
      getItem: getItem,
      setItem: setItem,
      clear: clear
    };

属性的赋值器（setter）和取值器（getter），事实上也是采用这种写法。

    const cart = {
      _wheels: 4,
    
      get wheels () {
    	return this._wheels;
      },
    
      set wheels (value) {
    	if (value < this._wheels) {
      		throw new Error('数值太小了！');
    	}
    	this._wheels = value;
      }
    }

**属性名表达式**

JavaScript 定义对象的属性，有两种方法。

    // 方法一
    obj.foo = true;
    
    // 方法二
    obj['a' + 'bc'] = 123;
上面代码的方法一是直接用标识符作为属性名，方法二是用表达式作为属性名，这时要将表达式放在方括号之内。

但是，如果使用字面量方式定义对象（使用大括号），在 ES5 中只能使用方法一（标识符）定义属性。

    var obj = {
      foo: true,
      abc: 123
    };
ES6 允许字面量定义对象时，用方法二（表达式）作为对象的属性名，即把表达式放在方括号内。

    let propKey = 'foo';
    
    let obj = {
      [propKey]: true,
      ['a' + 'bc']: 123
    };

注意，属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串[object Object]，这一点要特别小心。

    const keyA = {a: 1};
    const keyB = {b: 2};
    
    const myObject = {
      [keyA]: 'valueA',
      [keyB]: 'valueB'
    };
    
    myObject // Object {[object Object]: "valueB"}
上面代码中，[keyA]和[keyB]得到的都是[object Object]，所以[keyB]会把[keyA]覆盖掉，而myObject最后只有一个[object Object]属性。

**Object.is()**

ES5 比较两个值是否相等，只有两个运算符：相等运算符（==）和严格相等运算符（===）。它们都有缺点，前者会自动转换数据类型，后者的NaN不等于自身，以及+0等于-0。JavaScript 缺乏一种运算，在所有环境中，只要两个值是一样的，它们就应该相等。

Object.is就是部署这个算法的新方法。它用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。

    Object.is('foo', 'foo')
    // true
    Object.is({}, {})
    // false
不同之处只有两个：一是+0不等于-0，二是NaN等于自身。

    +0 === -0 //true
    NaN === NaN // false
    
    Object.is(+0, -0) // false
    Object.is(NaN, NaN) // true
ES5 可以通过下面的代码，部署Object.is。

    Object.defineProperty(Object, 'is', {
      value: function(x, y) {
	    if (x === y) {
	      // 针对+0 不等于 -0的情况
	      return x !== 0 || 1 / x === 1 / y;
	    }
	    // 针对NaN的情况
	    return x !== x && y !== y;
      },
      configurable: true,
      enumerable: false,
      writable: true
    });

### Object.assign() ###

基本用法
Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。

    const target = { a: 1 };
    
    const source1 = { b: 2 };
    const source2 = { c: 3 };
    
    Object.assign(target, source1, source2);
    target // {a:1, b:2, c:3}
Object.assign方法的第一个参数是目标对象，后面的参数都是源对象。

注意，如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。

    const target = { a: 1, b: 1 };
    
    const source1 = { b: 2, c: 2 };
    const source2 = { c: 3 };
    
    Object.assign(target, source1, source2);
    target // {a:1, b:2, c:3}
如果只有一个参数，Object.assign会直接返回该参数。

    const obj = {a: 1};
    Object.assign(obj) === obj // true
如果该参数不是对象，则会先转成对象，然后返回。

    typeof Object.assign(2) // "object"
由于undefined和null无法转成对象，所以如果它们作为参数，就会报错。

    Object.assign(undefined) // 报错
    Object.assign(null) // 报错
如果非对象参数出现在源对象的位置（即非首参数），那么处理规则有所不同。首先，这些参数都会转成对象，如果无法转成对象，就会跳过。这意味着，如果undefined和null不在首参数，就不会报错。

    let obj = {a: 1};
    Object.assign(obj, undefined) === obj // true
    Object.assign(obj, null) === obj // true
其他类型的值（即数值、字符串和布尔值）不在首参数，也不会报错。但是，除了字符串会以数组形式，拷贝入目标对象，其他值都不会产生效果。

    const v1 = 'abc';
    const v2 = true;
    const v3 = 10;
    
    const obj = Object.assign({}, v1, v2, v3);
    console.log(obj); // { "0": "a", "1": "b", "2": "c" }
上面代码中，v1、v2、v3分别是字符串、布尔值和数值，结果只有字符串合入目标对象（以字符数组的形式），数值和布尔值都会被忽略。这是因为只有字符串的包装对象，会产生**可枚举属性**。

    Object(true) // {[[PrimitiveValue]]: true}
    Object(10)  //  {[[PrimitiveValue]]: 10}
    Object('abc') // {0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"}
上面代码中，布尔值、数值、字符串分别转成对应的包装对象，可以看到它们的原始值都在包装对象的内部属性[[PrimitiveValue]]上面，这个属性是不会被Object.assign拷贝的。只有字符串的包装对象，会产生可枚举的实义属性，那些属性则会被拷贝。

Object.assign拷贝的属性是有限制的，只拷贝源对象的自身属性（不拷贝继承属性），也不拷贝不可枚举的属性（enumerable: false）。

Object.assign({b: 'c'},
  Object.defineProperty({}, 'invisible', {
enumerable: false,
value: 'hello'
  })
)
// { b: 'c' }
上面代码中，Object.assign要拷贝的对象只有一个不可枚举属性invisible，这个属性并没有被拷贝进去。

属性名为 Symbol 值的属性，也会被Object.assign拷贝。

    Object.assign({ a: 'b' }, { [Symbol('c')]: 'd' })
    // { a: 'b', Symbol(c): 'd' }

**注意点**

- 浅拷贝
- 同名属性的替换
- 数组的处理
- Object.assign可以用来处理数组，但是会把数组视为对象。

>     Object.assign([1, 2, 3], [4, 5])
>     // [4, 5, 3]

- 取值函数的处理

> Object.assign只能进行值的复制，如果要复制的值是一个取值函数，那么将求值后再复制。
> 
>     const source = {
>       get foo() { return 1 }
>     };
>     const target = {};
>     
>     Object.assign(target, source)
>     // { foo: 1 }
> 上面代码中，source对象的foo属性是一个取值函数，Object.assign不会复制这个取值函数，只会拿到值以后，将这个值复制过去。

对象的扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。

    let z = { a: 3, b: 4 };
    let n = { ...z };
    n // { a: 3, b: 4 }
这等同于使用Object.assign方法。

    let aClone = { ...a };
    // 等同于
    let aClone = Object.assign({}, a);
上面的例子只是拷贝了对象实例的属性，如果想完整克隆一个对象，还拷贝对象原型的属性，可以采用下面的写法。

    // 写法一
    const clone1 = {
      __proto__: Object.getPrototypeOf(obj),
      ...obj
    };
    
    // 写法二
    const clone2 = Object.assign(
      Object.create(Object.getPrototypeOf(obj)),
      obj
    );
    
    // 写法三
    const clone3 = Object.create(
      Object.getPrototypeOf(obj),
      Object.getOwnPropertyDescriptors(obj)
    )
上面代码中，写法一的__proto__属性在非浏览器的环境不一定部署，因此推荐使用写法二和写法三。

扩展运算符可以用于合并两个对象。

## 9.Symbol ##

ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突。这就是 ES6 引入Symbol的原因。

ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。

## 10.Module ##

**export通过接口，输出的是同一个值。不同的脚本加载这个接口，得到的都是同样的实例。**

    // mod.js
    function C() {
      this.sum = 0;
      this.add = function () {
      this.sum += 1;
      };
      this.show = function () {
    	console.log(this.sum);
      };
    }
    
    export let c = new C();


上面的脚本mod.js，输出的是一个C的实例。不同的脚本加载这个模块，得到的都是同一个实例。

    // x.js
    import {c} from './mod';
    c.add();
    
    // y.js
    import {c} from './mod';
    c.show();
    
    // main.js
    import './x';
    import './y';

现在执行main.js，输出的是1。

**ES6 模块不会缓存运行结果，而是动态地去被加载的模块取值，并且变量总是绑定其所在的模块。**

**由于 ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。**

    // lib.js
    export let obj = {};
    
    // main.js
    import { obj } from './lib';
    
    obj.prop = 123; // OK
    obj = {}; // TypeError

上面代码中，main.js从lib.js输入变量obj，可以对obj添加属性，但是重新赋值就会报错。因为变量obj指向的地址是只读的，不能重新赋值，这就好比main.js创造了一个名为obj的const变量。

**即便此处obj为一个普通变量'bar'，也不能对其直接进行赋值。**


立即resolve的 Promise 对象，是在本轮“事件循环”（event loop）的结束时，而不是在下一轮“事件循环”的开始时。

    setTimeout(function () {
      console.log('three');
    }, 0);
    
    Promise.resolve().then(function () {
      console.log('two');
    });
    
    console.log('one');
    
    // one
    // two
    // three
