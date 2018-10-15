'use strict'

//杨辉三角又称帕斯卡三角
//[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
//第i层有i个元素；首尾元素为1；a[i][j]=a[i-1][j-1]+a[i-1][j]
function Pascal(number) {
    let num = parseInt(number);
    if (!isNaN(num) && num >= 1) {
        let ans = [];
        for (let i = 0; i < num; i++) {
            ans[i] = [];
            ans[i][0] = ans[i][i] = 1;
            for(let j=1;j<i;j++){
                ans[i][j]=ans[i-1][j-1]+ans[i-1][j];
            }
        }
        return ans;
    } else {
        console.log('请输入一个正整数！');
        return null;
    }
}

console.log(Pascal(6));