'use strict';

function quickSort(arr) {
    if (arr.length <= 1) return arr;
    // let [anchor, i, j] = [arr[0], 0, arr.length-1];
    let cache;
    let anchor = arr[0];
    let i = 0;
    let j = arr.length - 1;
    while (i < j) {
        while (j > i) {
            if (arr[j] < anchor) {
                break;
            } else {
                j--
            }
        }
        while (i < j) {
            if (arr[i] <= anchor) {
                i++
            } else {
                break;
            }
        }
        // [arr[i], arr[j]] = [arr[j], arr[i]]
        cache = arr[i];
        arr[i] = arr[j];
        arr[j] = cache;
    }
    // [arr[0], arr[j]] = [arr[j], arr[0]];
    arr[0] = arr[i];
    arr[i] = anchor;
    console.log(i)
    console.log(j)
    return quickSort(arr.slice(0, j)).concat([anchor], j < arr.length - 1 ? quickSort(arr.slice(j + 1)) : [])

}

let a = [23, 56, 2, 31, 1, 6, 8, 7, 90, 56];
console.log(quickSort(a))