//给定一个整数数组和一个指定整数N，输出数组中两数之和等于N的元素下标(假定答案只有一组)
//避免使用枚举法，以下方法时间复杂度为O(n)
function findSumElement(arr, N) {
    let obj = {}, len = arr.length;
    for (let i = 0; i < len; i++) {
        obj[arr[i]] = i;
    }
    for (let j = len - 1; j >= 0; j--) {
        if (obj.hasOwnProperty(N - arr[j])) {
            return [j, obj[N - arr[j]]]
        }
    }
}

let arr = [1, 2, 3], N = 3;
console.log(findSumElement(arr, N));

//断舍离
//心理韧性
