/**
 *Created by 01369606 on 2018/10/26.
 */
//从1到n共n个整数中随机选取n-1个不重复的整数组成数组arr，请问漏掉了哪一个元素
//选择将arr排序，再扫描数组，找出遗漏的整数
//排序算法空间复杂度O(nlogn)
function Solution(arr) {
  let len = arr.length;
  arr.sort((a, b) => a - b);
  for (let i = 0; i < len; i++) {
    if (i + 1 !== arr[i]) return i + 1;
  }
  return null;
}


//利用1+2+…+n减去数组arr各元素之和，即得遗漏的整数
function Solution_two(arr) {
  let len = arr.length, i = 1, sum = 0;
  while (i <= len + 1) {
    sum += i;
    i++;
  }
  return sum - arr.reduce((a, b) => a + b);
}
let arr=[1,2,3,4,5,6,7,8,9,10,12];
console.log(Solution_two(arr));
