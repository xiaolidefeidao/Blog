'use strict';

function quickSort(arr, start, end) {
    if (end - start < 1) return;
    // let [anchor, i, j] = [arr[0], 0, arr.length-1];
    let cache;
    //anchor作为基准值
    let anchor = arr[start];
    let i = start;
    let j = end;
    while (i < j) {
        while (j > i && arr[j] > anchor) {
            j--
        }
        while (i < j && arr[i] <= anchor) {
            i++
        }
        // [arr[i], arr[j]] = [arr[j], arr[i]]
        cache = arr[i];
        arr[i] = arr[j];
        arr[j] = cache;
    }


    // [arr[0], arr[j]] = [arr[j], arr[0]];
    arr[start] = arr[i];
    arr[i] = anchor;
    quickSort(arr, start, i - 1);
    quickSort(arr, i + 1, end)
}

let a = [23, 56, 2, 31, 1, 6, 8, 7, 90, 56];
quickSort(a, 0, a.length - 1)
console.log(a)