# 94. 最长公共子序列
> 题目链接：https://leetcode.cn/problems/longest-common-subsequence/

### 解题思路
逐字符对齐两个字符串：如果当前两个字符相等，就把它接到公共子序列后面（来自左上角 +1）；如果不相等，说明当前字符不能同时选，只能分别丢弃其中一个，取“上方或左方”的最优结果，最终在二维表中推到右下角得到最长公共子序列长度。
> 需要巩固

### java版本解答
```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length();
        int n = text2.length();
        int [][] dp = new int[m+1][n+1];
        for(int i = 1;i <= m;i++){
            for(int j = 1;j <= n;j++){
                if(text1.charAt(i-1) == text2.charAt(j-1))dp[i][j] = dp[i-1][j-1] + 1;
                else dp[i][j] = Math.max(dp[i-1][j],dp[i][j-1]);
            }
        }
        return dp[m][n];
    }
}
```
