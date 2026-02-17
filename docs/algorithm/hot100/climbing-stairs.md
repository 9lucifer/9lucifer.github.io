# 81. 爬楼梯
> 题目链接：https://leetcode.cn/problems/climbing-stairs/

### 解题思路
动态规划版两数之和～

### java版本解答
```java
class Solution {
    public int climbStairs(int n) {
        if(n <= 2)return n;
        int [] dp = new int[n+1];
        dp[1] = 1;
        dp[2] = 2;
        for(int i = 3;i <= n;i++){
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
}
```
