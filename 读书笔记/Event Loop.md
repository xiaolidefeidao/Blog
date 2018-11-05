    setTimeout(() => {
    console.log('timeout1')
    Promise.resolve().then(() => {
        console.log('promise1')
    })
    Promise.resolve().then(() => {
        console.log('promise2')
    })
	}, 0)

	setTimeout(() => {
	    console.log('timeout2')
	    Promise.resolve().then(() => {
	        console.log('promise3')
	    })
	}, 0)

##浏览器中的Event Loop##

**执行栈**

> 执行栈中的代码永远最先执行

**微任务(microtask): promise MutationObserver...**


> 当执行栈中的代码执行完毕，会在执行宏任务队列之前先看看微任务队列中有没有任务，如果有会先将微任务队列中的任务清空才会去执行宏任务队列

**宏任务(task): setTimeout setInterval setImmediate(IE专用) messageChannel...**

> 等待执行栈和微任务队列都执行完毕才会执行，并且在**执行完每一个宏任务之后，会去看看微任务队列有没有新添加的任务**，如果有，会先将微任务队列中的任务清空，才会继续执行下一个宏任务

**上述代码会依次打印 timeout1 promise1 promise2 timeout2 promise3**


## Node中的Event Loop ##

**Node中的微任务：process.nextTick promise setImmediate...**


**Node中的宏任务：setTimeout setInterval...**

1. 先将两个setTimeout塞到宏任务队列中
1. 当第一个setTimeout1时间到了执行的时候，首先打印timeout1，然后在微任务队列中塞入promise1和promise2
1. 当第一个setTimeout1执行完毕后，继续执行下一个setTimeout2
1. 当setTimeout2 执行的时候，先打印一个timeout2，然后又在微任务队列中塞了一个promise3
1. **当前宏任务队列清空，进入下一阶段，去检查微任务队列中有没有任务**
1. 清空微任务队列
1. 在node环境中执行 **会依次打印 timeout1 timeout2 promise1 promise2 promise3**

