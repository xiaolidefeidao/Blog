/*
判断一个字符串是否为回文
*/
'use strict'

// method one:使用两个指针，逐一对比
function isPalindrome_one(str){
    if(typeof str!=='string') return null;
    let i=0,j=str.length-1;
    while(i<j){
        if(str[i]===str[j]){
            i++;
            j--;
        }else{
            return false;
        }
    }
    return true;
}
console.log(isPalindrome_one('asa'))

// method two:利用栈现金后出的思想

