/*
判断一个字符串是否为回文
*/
'use strict'

// method one:使用两个指针，逐一对比
function isPalindrome_one(str) {
    if (typeof str !== 'string') return null;
    let i = 0, j = str.length - 1;
    while (i < j) {
        if (str[i] === str[j]) {
            i++;
            j--;
        } else {
            return false;
        }
    }
    return true;
}

console.log(isPalindrome_one('asdfgdsa'))

// method two:利用栈先进后出的思想
function isPalindrome_two(str) {
    if (typeof str !== 'string') return null;
    let next, stack = [], len = str.length, mid = parseInt(len / 2) - 1;
    for (let i = 0; i <= mid; i++) {
        stack.push(str[i])
    }
    len % 2 === 0 ? next = mid + 1 : next = mid + 2;
    for (let j = next; j <= len - 1; j++) {
        if (str[j] !== stack.pop()) return false;
    }
    return true;
}

console.log(isPalindrome_two('asdfggfdsa'))

