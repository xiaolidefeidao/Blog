# [CommonJS 模块与 ES6 模块](http://es6.ruanyifeng.com/#docs/module "阮一峰ES6") #

#### 差异： ####

- **CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。**
- **CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。**

#### 相同： ####

- **同一个模块如果加载多次，将只执行一次。**

## Node加载 ##

#### 举个栗子： ####

	//a.js
	let a=require('./'+'b');//CommonJS 模块是运行时加载，所以可以使用表达式；import会报错
	console.log(a);
	setTimeout(() => console.log(a), 1000);
	setTimeout(() => {
	  a=1;       //ES6 模块输出的是值的引用,如果a是import导入，不能给a使用赋值表达式。
	  console.log(a);
	  require('./c');  //此处不会发生变量提升；import会提升到模块的头部
	}, 2000);
	
	//b.js
	console.log('load b');
	let foo = {bar: 'bar'};
	let x = 10;
	setTimeout(() => {
	  foo.bar = 'baz';
	  x = 20;
	}, 500);
	module.exports = {foo, x};
	
	//c.js
	console.log('load c');
	let c=require('./b');
	console.log(c);

#### 执行a.js，输出： ####

	load b
	{ foo: { bar: 'bar' }, x: 10 }
	{ foo: { bar: 'baz' }, x: 10 }
	1
	load c
	{ foo: { bar: 'baz' }, x: 10 }

#### 执行顺序： ####

1. 执行 `let a=require('./'+'b')` 时，首先加载执行 `b.js` 文件；
1. 在 `b.js` 中执行 `console.log('load b');` ，打印出 `load b`；
1. 给foo、x赋值；将匿名回调函数 `() => {foo.bar = 'baz';x = 20;}` 加入事件队列，**500 ms** 后执行；
1. 导出对象 `{foo, x}`；在Node的运存中缓存了这样一个**对象L**：

	    {
	      id: 'b.js',   //id为模块的唯一标识符
	      exports: {foo: *p, x: 10},   //指针p存储了b.js中对象foo的地址，此时指向{ bar: 'bar' }
	      loaded: true,
	      //省略其他属性
	    }
1. 回到 `a.js` 将上述对象 L 的 **exports 赋值给 a**；
2. 执行 `console.log(a);`，打印 `{ foo: { bar: 'bar' }, x: 10 }`；
3. 将匿名回调函数 `console.log(a)` 加入事件队列，**1000 ms** 后执行；
4. 将匿名回调函数 `() => {a=1;console.log(a);require('./c');}` 加入事件队列，**2000 ms** 后执行；
5. **500 ms** 后执行匿名回调函数 `() => {foo.bar = 'baz';x = 20;}`；**此时缓存中对象 L 的值不会更新**，L.exports.foo 的值不变，指针 p 依然指向 `b.js` 中的局部变量 foo，而此时 `foo.bar===baz`，L.exports.x 依然等于 10，`b.js` 中的局部变量 `x===20`；
6. 再过 **500 ms** 后 `a.js` 执行匿名回调函数 `console.log(a)`；此时 a 对应的值*（L.exports）*为 `{ foo: { bar: 'baz' }, x: 10 }` 并打印出来；
7. 再过 **1000 ms** 后 `a.js` 执行匿名回调函数 `() => {a=1;console.log(a);require('./c');}`；a赋值为1，并打印出来；执行 `require('./c')`，加载 `c.js` 模块；
8. 在 `c.js` 中执行 `console.log('load c');`，打印出 `load c` ；
9. 执行 `let c=require('./b')`，首先加载 `b.js`，Node会去缓存中查找对象L,如果 `L.loaded===true`,直接取缓存的数据，不会再执行 `b.js`；直接将L.exports赋值给c；
10. 打印出c的值 `{ foo: { bar: 'baz' }, x: 10 }`。

***PS1: 实际情况下，上述对象L中并没有指针 p，L.exports.foo指向 `b.js` 模块中的变量foo。
PS2: setTimeout 的设置的延迟时间是存在误差的，不会那么精确。***
 
## ES6 模块加载 ##

- ES6 在编译时完成模块加载，即“静态加载”，效率要比 CommonJS 模块的加载方式高；
- ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块；
- ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错；
- `export` 通过接口，输出的是同一个值，不同的脚本加载这个接口，得到的都是同样的实例

由于 **import 是静态执行**，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。

	// 报错
	import { 'f' + 'oo' } from 'my_module';
	
	// 报错
	let module = 'my_module';
	import { foo } from module;
	
	// 报错
	if (x === 1) {
	  import { foo } from 'module1';
	} else {
	  import { foo } from 'module2';
	}

上面三种写法都会报错，因为它们用到了表达式、变量和if结构。在静态分析阶段，这些语法都是没法得到值的。

import 命令具有提升效果，会提升到整个模块的头部，首先执行。

    foo();
    import { foo } from 'my_module';

上面的代码不会报错，因为import的执行早于foo的调用。这种行为的本质是，import 命令是编译阶段执行的，在代码运行之前。

export 和 import 命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

    function foo() {
      export default 'bar' // SyntaxError
    }
    foo()

**ES6 模块不会缓存运行结果**，而是动态地去被加载的模块取值，并且变量总是绑定其所在的模块。

    // m1.js
    export var foo = 'bar';
    setTimeout(() => foo = 'baz', 500);
    
    // m2.js
    import {foo} from './m1.js';
    console.log(foo);
    setTimeout(() => console.log(foo), 500);

执行 m2.js，输出：

    bar
    baz

ES6 输入的模块变量，只是一个“**符号连接**”，所以这个变量是只读的，对它进行重新赋值会报错。

    // lib.js
    export let obj = {};
    
    // main.js
    import { obj } from './lib';
    
    obj.prop = 123; // OK
    obj = {}; // TypeError

不同的脚本中，import 加载同一个 export 接口，获取到的是**同一个实例**。

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
    // x.js
    import {c} from './mod';
    c.add();
    
    // y.js
    import {c} from './mod';
    c.show();
    
    // main.js
    import './x';
    import './y';

执行 main.js，输出的是 1。




