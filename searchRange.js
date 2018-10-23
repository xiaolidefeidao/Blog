/**
 *Created by 01369606 on 2018/10/23.
 */
'use strict'

//在一个有序数组（可能存在重复值）中查找指定值target首次出现和最后出现的位置
//本题对边界处理情况比较严格
function Solution(arr, target) {
  let len = arr.length;
  if (len === 0) return false;
  let low = 0, high = len - 1, mid, ans = [];
  //第一次二分找第一个位置
  while (low <= high) {
    mid = parseInt(low + (high - low) / 2);
    if (arr[mid] >= target) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }
  if (low < len && arr[low] === target) {
    ans.push(low)
  } else {
    return false;
  }
  //从第一次出现的位置开始进行第二次二分找最后一个位置
  high = len - 1;
  while (low <= high) {
    mid = parseInt(low + (high - low) / 2);
    if (arr[mid] <= target) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  ans.push(high);
  return ans;
}
let arr=[7,7,7,8,9];
console.log(Solution(arr,7));
