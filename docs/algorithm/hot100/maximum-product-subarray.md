# 88. 乘积最大子数组
> 题目链接：https://leetcode.cn/problems/maximum-product-subarray/

### 解题思路
不是很难，但是思路要清晰。
> 需要二刷

### java版本解答
```java
class Solution {
    public int maxProduct(int[] nums) {
        int res = nums[0];
        int curMax = nums[0];
        int curMin = nums[0];
        for(int i = 1;i < nums.length;i++){
            int preMax = curMax;
            int preMin = curMin;
            curMax = Math.max(Math.max(nums[i]*preMax,nums[i]*preMin),nums[i]);
            curMin = Math.min(Math.min(nums[i]*preMax,nums[i]*preMin),nums[i]);
            res = Math.max(curMax,res);
        }
        return res;
    }
}
```
