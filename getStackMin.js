/**
 *Created by 01369606 on 2018/10/24.
 */
'use strict'

//实现一个包含三个方法的栈：push 入栈（每次一个元素）、pop 出栈（每次一个元素）、getMin 返回栈内最小值
//假定栈内元素都是数字类型

//暴力破解
function Solution_one() {
  //时间复杂度O(n)，空间复杂度O(1)
  let stack = new Array();
  stack.getMin = function () {
    if (this.length === 0) return undefined;
    let min = this[0];
    for (let i of this) {
      if (i < min) min = i;
    }
    return min;
  };
  //测试
  stack.push(1);
  stack.push(2);
  stack.push(3);
  stack.pop();
  stack.push(-1);
  console.log(stack.getMin());
  console.log(stack);
}
// Solution_one();


//用空间换时间，使用辅助栈tStack记录stack中的最小值
function Solution_two() {
  //空间复杂度O(n)，时间复杂度O(1)
  let stack = new Array();
  stack.tStack = [];
  stack.push = function (val) {
    [].push.call(this, val);
    if (this.tStack.length === 0) {
      this.tStack.push(val)
    } else {
      if (val > this.tStack.slice(-1)[0]) {
        this.tStack.push(this.tStack.slice(-1)[0]);//复制栈尾的最小值，并将其入栈
      } else {
        this.tStack.push(val)
      }
    }
  };
  stack.pop = function () {
    this.tStack.pop();
    return [].pop.call(this);
  };
  stack.getMin = function () {
    return this.tStack.slice(-1)[0];
  };

  //测试
  stack.push(1);
  stack.push(2);
  stack.push(3);
  stack.pop();
  stack.push(-1);
  console.log(stack.getMin());
  console.log(stack);
}
// Solution_two();


//在Solution_two中，若stack为[3,2,1,4,5,6,7,8,9],则stack.tStack为[3,2,1,1,1,1,1,1,1]
//其中1重复出现了多次，我们可以在push、pop的时候进行优化以节约空间
function Solution_three() {
  let stack = new Array();
  stack.tStack = [];
  stack.push = function (val) {
    [].push.call(this, val);
    if (this.tStack.length === 0) {
      this.tStack.push(val);
      return;
    }
    if (val <= this.tStack.slice(-1)[0]) {
      this.tStack.push(val)     //只有小于或等于当前最小值的元素才入栈tStack
    }
  };
  stack.pop = function () {
    let temp = [].pop.call(this);
    if (temp === this.tStack.slice(-1)[0]) this.tStack.pop();   //出栈时，stack队尾的元素与tStack队尾的元素相等时tStack才出栈
    return temp;
  };
  stack.getMin = function () {
    return this.tStack.slice(-1)[0];
  };

  //测试
  stack.push(3);
  stack.push(2);
  stack.push(1);
  stack.push(4);
  stack.push(5);
  stack.push(6);
  stack.push(7);
  stack.pop();
  stack.push(8);
  stack.pop();
  stack.push(-1);
  console.log(stack.getMin());
  stack.pop();
  console.log(stack);
  console.log(stack.getMin());
}
// Solution_three();


//Solution_three，若stack为[3,2,1,1,1,1,1,1,1],则stack.tStack为[3,2,1,1,1,1,1,1,1]
//其中1重复出现了多次，我们可以在push的时候把最小值的index存入tStack中以节约空间
function Solution_four() {
  let stack = new Array();
  stack.tStack = [];
  stack.push = function (val) {
    [].push.call(this, val);
    if (this.tStack.length === 0) {
      this.tStack.push(0);
      return;
    }
    if (val < this[this.tStack.slice(-1)[0]]) {
      this.tStack.push(this.length - 1)     //只有小于当前最小值，将元素index入栈tStack
    }
  };
  stack.pop = function () {
    if (this.length - 1 === this.tStack.slice(-1)[0]) this.tStack.pop();   //出栈时，stack队尾的index与tStack队尾储存的index值相等时tStack出栈
    return [].pop.call(this);
  };
  stack.getMin = function () {
    return this[this.tStack.slice(-1)[0]];
  };

  //测试
  stack.push(3);
  stack.push(2);
  stack.push(1);
  stack.push(1);
  stack.push(1);
  stack.push(1);
  stack.push(1);
  stack.pop();
  stack.push(8);
  stack.pop();
  stack.push(-1);
  console.log(stack.getMin());
  console.log(stack);
  stack.pop();
  console.log(stack);
  console.log(stack.getMin());
}
// Solution_four();


//使用es6写法
function Solution_final() {
class Stack extends Array{
  constructor(){
    super();
    this.tStack=[];
  }
  push(val){
    super.push(val);
    if (this.tStack.length === 0) {
      this.tStack.push(0);
      return;
    }
    if (val < this[this.tStack.slice(-1)[0]]) {
      this.tStack.push(this.length - 1)     //只有小于当前最小值，将元素index入栈tStack
    }
  }
  pop(){
    if (this.length - 1 === this.tStack.slice(-1)[0]) this.tStack.pop();   //出栈时，stack队尾的index与tStack队尾的index相等时tStack出栈
    return super.pop();
  }
  getMin(){
    return this[this.tStack.slice(-1)[0]];
  }
}
let stack=new Stack();
  //测试
  stack.push(3);
  stack.push(2);
  stack.push(1);
  stack.push(1);
  stack.push(1);
  stack.push(1);
  stack.push(1);
  stack.pop();
  stack.push(8);
  stack.push(-1);
  console.log(stack.getMin());
  console.log(stack);
  stack.pop();
  console.log(stack);
  console.log(stack.getMin());
}
Solution_final();

//PS:本例没有讨论push多参数的情况
