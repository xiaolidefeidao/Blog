'use strict'

//寻找字符串S1、S2最长的公共子串
function Solution(s1, s2) {
  let ans = 0, len1 = s1.length, len2 = s2.length, rectangle = [];
  if (len1 == 0 || len2 == 0) {
    return ans;
  }
  for (let i = 0; i < len1; i++) {
    rectangle[i] = [];
    for (let j = 0; j < len2; j++) {
      if (s1[i] === s2[j]) {
        if (i > 0 && j > 0) {
          rectangle[i][j] = rectangle[i - 1][j - 1] + 1;
        } else {
          rectangle[i][j] = 1;
        }
        ans = Math.max(ans, rectangle[i][j]);
      } else {
        rectangle[i][j] = 0;
      }
    }
  }
  return ans;
}

let s1 = 'abagh', s2 = 'cabade';
console.log(Solution(s1, s2));

/*
分析：
动态规划，使用矩阵展示两个字符串。从上到下，从左至右比较，若两值相等则赋上值（相邻左上角的值加1）
  s2  c a b a d e
  s1
  a   0 1 0 1 0 0
  b   0 0 2 0 0 0
  a   0 1 0 3 0 0
  g   0 0 0 0 0 0
  h   0 0 0 0 0 0
*/
