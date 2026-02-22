# 85. 零钱兑换
> 题目链接：https://leetcode.cn/problems/coin-change/

### 解题思路
注意`dp[0] = 0;`
### java版本解答
```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        int[]dp = new int[amount+1];
        Arrays.fill(dp, amount+1);
        // 非常重要
        dp[0] = 0;
        for(int i = 1;i <= amount;i++){
            for(int coin : coins){
                if(i - coin >= 0)
                dp[i] = Math.min(dp[i],dp[i - coin]+1);
            }
        }
        return dp[amount] == amount + 1 ? -1 : dp[amount];
    }
}
```
