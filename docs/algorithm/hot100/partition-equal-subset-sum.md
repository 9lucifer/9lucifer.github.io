# 89. 分割等和子集
> 题目链接：https://leetcode.cn/problems/partition-equal-subset-sum/

### 解题思路
先计算数组元素总和 sum，如果 sum 是奇数则不可能分成两个相等子集；否则问题转化为：是否能从数组中选出若干个数，使它们的和等于 sum/2。这是一个典型的 0/1 背包问题。定义 dp[i][j] 表示 前 i 个元素能否组成和 j。遍历每个数字时有两种选择：不选当前数或选当前数。如果不选则继承 dp[i-1][j]；如果选则需要前 i-1 个数能组成 j - nums[i-1]。最终判断 dp[n][sum/2] 是否为 true，即可确定是否能分割成两个等和子集。

状态定义

dp[i][j] 表示：前 i 个数是否可以组成和 j

状态转移公式

1. 当 j < nums[i-1]（当前数放不下）：`dp[i][j] = dp[i-1][j]`

2. 当 j ≥ nums[i-1]：`dp[i][j] = dp[i-1][j] || dp[i-1][j - nums[i-1]]`

含义：
```
不选 nums[i-1]  -> dp[i-1][j]
选 nums[i-1]   -> dp[i-1][j - nums[i-1]]
```
### java版本解答
```java
class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0,n = nums.length;
        for(int i : nums)sum += i;
        if(sum % 2 == 1)return false;
        sum/=2;
        boolean[][]dp = new boolean[n+1][sum+1];
        for(int i = 0;i <= n;i++)dp[i][0] = true;
        for(int i = 1;i <= n;i++){
            for(int j = 1;j <= sum;j++){
                if(j - nums[i - 1] < 0)dp[i][j] = dp[i-1][j];
                else dp[i][j] = dp[i - 1][j] || dp[i-1][j - nums[i - 1]];
            }
        }
        return dp[n][sum];
    }
}
```
