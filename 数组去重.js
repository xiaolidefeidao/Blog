'use strict'

//使用Set
/*function unique_set(arr) {
    if (!(arr instanceof Array)) return;
    let ans = new Set(arr);
    return [...ans]
}*/

//使用filter
function unique_filter(arr) {
    if (!(arr instanceof Array)) return;
    return arr.filter((item, idx, array) => {
        return array.indexOf(item) === idx;
    });
}

//先排序再去重
function unique_sort_1(arr) {
    if (!(arr instanceof Array)) return;
    arr.sort();
    //使用了额外的空间
    let len = arr.length, array = [arr[0]]
    for (let i = 1; i < len; i++) {
        if (arr[i] !== arr[i - 1]) {
            array.push(arr[i]);
        }
    }
    return array;
}

function unique_sort_2(arr) {
    if (!(arr instanceof Array)) return;
    if (arr.length < 2) return;
    arr.sort();
    //使用i、j两个指针
    let len = arr.length, i = 0, j = 1;
    for (; j < len; j++) {
        if (arr[i] !== arr[j]) {
            arr[++i] = arr[j]
        }
    }
    return arr.slice(0, i + 1);
}

console.log(unique_sort_2([2, 3, 4, 3, 2]));