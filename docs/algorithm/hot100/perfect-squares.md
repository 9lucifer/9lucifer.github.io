# 84. 完全平方数
> 题目链接：https://leetcode.cn/problems/perfect-squares/

### 解题思路
从 1 到 n 依次计算每个数最少由多少个完全平方数组成，通过枚举所有不超过当前数的平方数，取“1 + 剩余部分的最优解”的最小值，最终得到 dp[n]
### java版本解答
```java
class Solution {
    public int numSquares(int n) {
        int[] dp = new int[n + 1];
        dp[1] = 1;
        for (int i = 1; i <= n; i++) {
            int tmp = Integer.MAX_VALUE;
            for (int j = 1; j * j <= i; j++) {
                tmp = Math.min(1 + dp[i - j * j],tmp);
            }
            dp[i] = tmp;
        }
        return dp[n];
    }
}
```
