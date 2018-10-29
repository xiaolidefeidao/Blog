'use strict'

//判断一个整数是否为‘回文’，例如 1221是‘回文’，1232不是
function Solution(num) {
  //默认num为整数
  if (num === 0) return true;
  if (num < 0) return false;
  let ans = 0, temp = num;
  while (temp != 0) {
    ans = ans * 10 + temp % 10;
    temp = parseInt(temp / 10);
  }
  return ans === num;
}

console.log(Solution(112354453211));
