# 95. 编辑距离
> 题目链接：https://leetcode.cn/problems/edit-distance/

### 解题思路
把两个字符串逐字符对齐：相同就继承左上角结果；不同则考虑三种编辑操作（替换当前字符、删除 word1 字符、插入字符到 word1），取代价最小的一种并 +1，通过二维 DP 从空串一步步推到完整字符串，最终得到最少编辑次数。
### java版本解答
```java
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        int [][]dp = new int[m+1][n+1];
        for(int i = 0;i <= m;i++)dp[i][0] = i;
        for(int i = 0;i <= n;i++)dp[0][i] = i;
        for(int i = 1;i <= m;i++){
            for(int j = 1;j <= n;j++){
                if(word1.charAt(i - 1) == word2.charAt(j - 1)){
                    dp[i][j] = dp[i-1][j-1];
                }else{
                    dp[i][j] = Math.min(dp[i-1][j-1],Math.min(dp[i-1][j],dp[i][j-1])) + 1;
                }
            }
        }
        return dp[m][n];
    }
}
```
