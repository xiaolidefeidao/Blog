# BFC #

**BFC** 指块级格式化上下文

**特性：**

1. BFC 不与外部的浮动元素重叠
2. 高度计算会包括内部的浮动元素
3. 内部子元素的上下外边距会重叠
4. BFC 是一个页面容器，不与外部的 box 元素产生干涉影响

**生成：**

1. display 为 flex、inline-block、table、table-cell 等
2. position 不为 static、relative,如 absolute、fixed；即脱离文档流
3. float 不为 none，如 left、right 等；即脱离文档流
4. overflow 不为 visible，如 auto、hidden 等


# 类型转换 #

## 数据类型 ##

原始数据类型：

Boolean Number String Symbol Null Undefined

对象：
Object


## 显式转换 ##

**Number 函数、 String 函数、 Boolean 函数**

### Number函数 ###

原始类型转换：

    Number(123)  // 123
	Number('123')  //123
	Number('')  //0
	Number(false)  //0
	Number(null)  //0
	Number('123asd')  //NaN
	Number(undefined) //NaN
	Number(NaN) //NaN
	Number(true)  //1
	
	
    
对象类型转换：

1. 调用对象自身的 valueOf 方法，如果返回原始类型的值，对该值调用 Number 方法，不再进行后续操作；
2. 如果返回复合类型，再调用对象自身的 toString 方法，如果 toString 方法返回原始类型的值，对该值调用 Number 方法，不再进行后续操作；
3. 如果 toString 方法返回的是复合类型的值，则报错。

### String 函数 ###

原始类型转换：

    String(123)  //'123'
	String('123')  //'123'
	String(true)  //'true'
	String(false)  //'false'
	String(null)  //'null'
	String(undefined)  //'undefined'
	String(NaN)  //'NaN'

对象类型转换：

1. 调用对象自身的 toString 方法，如果返回原始类型的值，对该值调用 String 方法，不再进行后续操作；
2. 如果返回复合类型，再调用对象自身的 valueOf 方法，如果 valueOf 方法返回原始类型的值，对该值调用 String 方法，不再进行后续操作；
3. 如果 valueOf 方法返回的是复合类型的值，则报错。


### Boolean 函数 ###

除了以下情况转化为 false，其他一律转化为 true

    null  undefined  NaN  +0  -0  ''

### typeof ###

    type0f {}  //'object'
	typeof []  //'object'
	typeof null //'object'
	typeof function(){}  //'function'
	typeof undefined  //'undefined'
	typeof NaN  //'number'
	typeof 123  //'number'
	typeof '123'  //'string'
	typeof false  //'boolean'
	typeof Symbol(123)  //'symbol'

### 一些测试题 ###

    [2,3]+[56]  //"2,356"
    {}+{}  //chrom: "[object Object][object Object]"  IE、firefox: NaN
    {}+[]  //0  把前面的{}当做了代码块，不执行；即+[]。
    []+{}  //"[object Object]"
    true+true  //2
    false+true  //1
    1+{a:1}  //"1[object Object]"

# DOM事件 #

事件流：

捕获阶段-目标阶段-冒泡阶段

window > document > document.documentElement > document.body > document.getElementById('div')  (捕获阶段)

# HTTP协议 #

**四个特点**：简单快速、灵活、无连接、无状态

**HTTP 报文的组成部分：**

- 请求报文：请求行、请求头、空行、请求体  accept accept-encoding accept-language referer cookie user-agent host(指定服务器的域名) cache-control(why?) last-modified-since if-none-match connection 

- 响应报文：状态行、响应头、空行、响应体 content-type content-encoding content-length transfer-encoding:chunked last-modified etag cache-control access-control-allow-origin connection

会存在队头堵塞的问题

**HTTP2**

1. 二进制协议，头信息帧和数据帧；每个请求的所有数据包，称为一个数据流，每个数据流有一个ID，客户端为奇数、服务器端为偶数，解决了队头堵塞的问题；还可以给数据流设置优先级。
1. 可以将头信息进行压缩；可以将头信息中的重复数据分别放入C、S端的表中，只传相应索引即可。

**请求方法**：get post put delete head options 等

**get 方法和 post 方法的区别：**（可以涉及到前端安全方面）

1. get 在浏览器回退时是无害的，而 post 会再次提交请求
2. get 请求会被浏览器主动缓存，而 post 不会，除非手动设置
3. get 比 post 更不安全，因为参数会直接暴露在 URL 上，所以不能用来传递敏感信息
4. get 参数通过 URL 传递，post 放在请求体中
5. get 请求参数会被完整保留在浏览器历史记录中，而 post 中的参数不会被保留
6. get 请求在 URL 中传递的参数长度有限制（一般是2kb），而 post 无限制

**HTTP 状态码：**（可以涉及到缓存方面）

- 1XX：提示信息。101 HTTP upgrade 为 Websocket
- 2XX：成功。200、206Partial Content断点续传，将一个大文档分解为多个下载段同时下载，需要请求头中有 range 字段
- 3XX：重定向。301永久重定向、302临时重定向、304重定向到缓存
- 4XX：客户端报错。401Unauthorized请求未经授权、403Forbidden请求的页面被禁止访问、404
- 5XX：服务端错误。500 Internal Server Error服务器错误、502 Bad Gateway、503 Service Unavailable
- 600：600 Unparseable Response Headers源站没有返回响应头部，只返回实体内容

http 在1.1版本可以通过设置 keep-alive 建立持久连接；请求1>响应1>请求2>响应2>请求3>响应3

http 的管线化，通过持久化连接完成，请求1>请求2>请求3>响应1>响应2>响应3；将多个请求打包发送，多个响应会被打包返回，只支持get、head请求。初次连接时不要启动管线连接，因为服务器端可能不支持。

# 原型链 #

## 模拟 new 运算符 ##

    const new2=function(fn){
	    let o=Object.create(fn.prototype);
	    let k=fn.call(o);
	    if(k instanceof Object){
	    	return k;
	    }else{
	    	return o;
	    }
    }


    Function.__proto__===Function.prototype  //Function是它自身的实例

## 面向对象与继承 ##

### 构造函数继承 ###

	  function Parent() {
	    this.name = 'parent'
	  }
	
	  function Child() {
	    Parent.call(this);
	    this.type = 'child'
	  }

**缺陷：**不能继承`Parent.prototype`上的属性

### 原型链继承 ###

      function Parent() {
    	this.name = 'parent'
		this.data=[1,2,3]
      }
	  Parent.prototype.say = () => {
	    console.log('parent say')
	  };
      function Child() {
    	this.type = 'child'
      }
    
      Child.prototype = new Parent();
      let child1 = new Child();
	  let child2 = new Child();

**缺陷：** 由于`Child.prototype`指向一个固定的实例对象，`child1.data.push(4)`,`child2.data`也会发生改变。

### 组合方式 ###

	  function Parent() {
	    this.name = 'parent';
	    this.data = [1, 2, 3]
	  }
	
	  Parent.prototype.say = function () {
	    console.log('parent say')
	  };
	
	  function Child() {
	    Parent.call(this);
	    this.type = 'child'
	  }
	
	  Child.prototype.__proto__ = Parent.prototype;  
	  //Child.prototype = Object.create(Parent.prototype);Child.prototype.constructor = Child
	  //Object.setPrototypeOf(Child.prototype,Parent.prototype)	  

	  let child = new Child();

# 通信类 #

## 同源策略 ##

- Cookie、LocalStorage、IndexDB 无法获取
- DOM 无法获取
- AJAX 请求不能发送

跨域方式：

- Hash
- PostMessage
- window.name
- document.domain
- CORS
- JSONP
- websocket

原生 AJAX

xhr.readystate:

- 0 : unsent 刚初始化时
- 1 : opened 与服务器建立连接
- 2 : HEADRE_RECEIVED 服务器接收到请求头
- 3 : LOADIN 请求处理中
- 4 : DONE 请求完成

# WEB 安全 #

xss

csrf

# 算法 #

## 栈 ##

    function divideByX(x, number) {
	    if ([2, 4, 8].indexOf(x) === -1) {
	      throw new Error('不支持该进制转换！')
	    }
	    number = parseInt(number);
	    if (Number.isNaN(number) || number <= 0) throw new Error('请输入正整数');
	    let stack = [], ans = '';
	    while (number > 0) {
	      stack.push(number % x);
	      number = Math.floor(number / x);
	    }
	    while (stack.length !== 0) {
	      ans += stack.pop();
	    }
	    return ans;
  	}

## 排序 ##

- 快排
- 冒泡
- 希尔

## 波兰式和逆波兰式 ##

	class MockPromise {
	    constructor(handler) {
	      if(typeof handler!=='function') throw new Error('参数需为函数');
	      this.status = 'pending';
	      this.value = undefined;
	      handler(this._resolve.bind(this), this._reject.bind(this));
	    }
	
	    _resolve(val) {
	      if (this.status !== 'pending') return;
	      this.value = val;
	      this.status = 'resolved'
	    }
	    _reject(err) {
	      if (this.status !== 'pending') return;
	      this.value = err;
	      this.status = 'rejected'
	    }
	    then(...args){
	      if(this.status === 'resolved'){
	        args[0]&&args[0](this.value)
	      }else if(this.status === 'rejected'){
	        args[1]&&args[1](this.value)
	      }
	    }
  	}

# 浏览器渲染机制 #

- reflow
- repaint

# JS 运行机制 #

event loop
同步任务、异步任务
宏任务、微任务

# 页面性能 #

- 合并压缩，减少 http 请求
- CDN
- DSN 预解析
- 缓存
- js 文件异步加载， defer、async

# 错误处理 #

两类错误：js 运行错误、资源加载错误

## js 运行错误 ##

- try...catch...finally
- window.onerror

## 资源加载错误 ##

- object.onerror: `<script onerror=cb src=''></script> //此 error 事件不会冒泡`
- performance.getEntries()
- Error 事件捕获: `window.addEventListener('error',cb,true) //在捕获阶段获取 error 事件`

### 跨域资源加载错误 ###

1. 在 script 标签增加 crossorigin 属性
1. 设置 js 资源响应头 Access-Control-Allow-Oringin : *

## 错误上报 ##

    (new Image()).src = origin/path?search-information


# ISO 四层网络 #

1. 应用层
1. 传输层：TCP（HTTP FTP TELNET SMTP）、UDP（DNS TFTP SNMP）
1. 网络层
1. 数据链路层

手写 generator 
事件中心
手写ajax 结合promise
chart 组件
素数
裴波那契
轮播  拖放

命中缓存但是返回200的情况:
对一些get请求，会被浏览器自动缓存，from memory cache
有些请求会命中强缓存，在请求头会包含cache-control ,from disk cache

	function A() {}
	A.prototype.x = 10;

	var a = new A();
	alert(a.x); // 10

	A.prototype = {
	  constructor: A,
	  x: 20
	  y: 30
	};

	// 对象a是通过隐式的[[Prototype]]引用从原油的prototype上获取的值
	alert(a.x); // 10
	alert(a.y) // undefined

	var b = new A();

	// 但新对象是从新原型上获取的值
	alert(b.x); // 20
	alert(b.y) // 30

对象的原型是对象被创建的时候创建的，并且在此之后不会修改为新的对象。

instanceof 操作符是和原型链一起工作的，而不是构造函数.`foo.__proto__===Foo.prototype`即为`true`

JSON.stringify 会把数组中的 function、undefined、null、NaN 都转化为 "null" ；会把对象中的 function、undefined 省略，把 null、NaN 都转化为 "null"
