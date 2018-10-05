'use strict'

function bubbleSort(arr) {
    if (!Array.isArray(arr)) {
        throw Error('type error')
        return
    }
    let temp,
        len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
                temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
        }
    }
    return arr
}

let a = [23, 1, 34, 28, 56, 78, 64]
bubbleSort(a)
console.log(a)