'use strict'
//给定一个整数数组，以柱状图呈现出来，寻找最大长方形
//eg：[2,1,3,5,6,2]  max=10
//解法：寻找每个元素左右两边比其小的元素的索引
// 利用一个栈先进后出，给数组最后加上0，使最后一个元素出栈
function Solution(arr) {
  //arr为整数数组
  if (arr.length < 2) {
    console.log('请输入长度大于1的整数数组！')
    return
  }
  arr.push(0);
  let stack = [], len = arr.length, i = 0, sum = 0;
  while (i < len) {
    if (stack.length === 0 || arr[stack.slice(-1)[0]] <= arr[i]) {
      stack.push(i);
      i++;
    } else {
      let temp = arr[stack.pop()];
      sum = Math.max(sum, stack.length === 0 ? temp * i : temp * (i - stack.slice(-1)[0] - 1))
    }
  }
  return sum
}
let arr=[2,1,3,5,6,2,3,4];
console.log(Solution(arr));
