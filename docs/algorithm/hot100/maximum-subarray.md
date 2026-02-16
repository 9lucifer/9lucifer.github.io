# 13. 最大子数组和
> 题目链接：https://leetcode.cn/problems/maximum-subarray

### 解题思路
数组题，但是用动态规划做就好。dp[i]的含义是第i个数对应的当前最大连续和。

### java版本解答
```java
class Solution {
    public int maxSubArray(int[] nums) {
        int res = nums[0];
        int [] dp = new int[nums.length];
        dp[0] = nums[0];
        for(int i = 1;i < nums.length;i++){
            dp[i] = Math.max(dp[i-1],0)+nums[i];
            res = Math.max(res,dp[i]);
        }
        return res;
    }
}
```
