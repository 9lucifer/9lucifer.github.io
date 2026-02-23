# 87. 最长递增子序列
> 题目链接：https://leetcode.cn/problems/longest-increasing-subsequence/

### 解题思路
dp[i] = 以 nums[i] 结尾的最长递增子序列长度

对每个 i，枚举所有 j<i，如果 nums[i] > nums[j]，则尝试把 i 接在 j 后面，取最大长度。
### java版本解答
```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        int n = nums.length;
        int[]dp = new int[n];
        Arrays.fill(dp, 1);
        int res = 1;
        for(int i = 1;i < n;i++){
            for(int j = 0;j < i;j++){
                if(nums[i] > nums[j])
                dp[i] = Math.max(dp[i],dp[j]+1);
                res = Math.max(dp[i],res);
            }
        }
        return res;
    }
}
```
