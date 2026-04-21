# 83. 打家劫舍
<PageViewCount />

> 题目链接：https://leetcode.cn/problems/house-robber/

### 解题思路
转移公式 `dp[𝑖]=max(dp[𝑖−1],dp[𝑖−2]+nums[𝑖])`

### java版本解答
```java
class Solution {
    public int rob(int[] nums) {
        if(nums.length == 1)return nums[0];
        int [] dp = new int[nums.length];
        dp[0] = nums[0];
        dp[1] = Math.max(dp[0],nums[1]);
        for(int i = 2;i < nums.length;i++){
            dp[i] = Math.max(dp[i-1],dp[i-2]+nums[i]);
        }
        return dp[nums.length-1];
    }
}```
