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

//利用object;有个缺点，会改变数据类型，且无法分辨字符串和数字
function unique_object(arr) {
    if (!(arr instanceof Array)) return;
    let obj = {}, ans = [], len = arr.length;
    for (let i = 0; i < len; i++) {
        if (arr[i] in obj) {
            obj[arr[i]] += 1;
        } else {
            obj[arr[i]] = 1;
            ans.push(arr[i]);
        }
    }
    return ans;
}

//利用Map数据
function unique_map(arr) {
    if (!(arr instanceof Array)) return;
    let map = new Map(), ans = [], len = arr.length;
    for (let i = 0; i < len; i++) {
        if (map.has(arr[i])) {
            map.set(arr[i], map.get(arr[i]) + 1)
        } else {
            map.set(arr[i], 1);
            ans.push(arr[i]);
        }
    }
    return ans;
}

console.log(unique_map([2, 3, '2', 4, 3, 2]));