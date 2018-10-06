'use strict'

function bubbleSort(arr) {
    if (!Array.isArray(arr)) {
        throw Error('type error')
        return
    }
    let temp, isChange,
        len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        //添加isChange标记，记录一趟冒泡中是否发生元素互换
        isChange = false
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
                temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                isChange = true;
            }
        }
        if(!isChange) break;
    }
    return arr
}

let a = [23, 1, 34, 28, 56, 78, 64]
bubbleSort(a)
console.log(a)