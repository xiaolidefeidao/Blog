//给定一个整数数组和一个指定整数N，输出数组中三数之和等于N的元素a、b、c(假定答案只有一组)
//需满足a<b<c
//思路：答案需从此小到大排列，我们先将数组排序，再使用i、j、k三个指针
//空间复杂度为O(n2)
'use strict'

function findSumElement(arr, N) {
    let len = arr.length;
    arr.sort((a, b) => a - b);
    for (let i = 0; i < len - 2; i++) {
        let j = i + 1, k = len - 1;
        while (j < k) {
            let tempSum = arr[i] + arr[j] + arr[k];
            if (tempSum < N) {
                j++;
            } else if (tempSum > N) {
                k--;
            } else {
                return [arr[i], arr[j], arr[k]]
            }
        }
    }
    return null;
}

let N = 15, arr = [2, 3, 10, 5, 6, 7];
console.log(findSumElement(arr, N));