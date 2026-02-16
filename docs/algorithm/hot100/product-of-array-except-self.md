# 16. 除了自身以外数组的乘积
> 题目链接：https://leetcode.cn/problems/product-of-array-except-self

### 解题思路
先预处理两个数组：`l[i]` 表示 **i 左边所有元素乘积**，`r[i]` 表示 **i 右边所有元素乘积**（前缀积 + 后缀积）。
最终 `res[i] = 左边乘积 × 右边乘积`，也就是 `l[i-1] * r[i+1]`（首尾单独处理）。

### java版本解答
```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int [] l = new int[n];
        int [] r = new int[n];
        int [] res = new int[n];
        l[0] = nums[0];
        r[n-1] = nums[n-1];
        for(int i = 1;i < n;i++)l[i] = l[i-1]*nums[i];
        for(int i = n - 2;i >= 0;i--)r[i] = r[i+1]*nums[i];
        res[0] = r[1];
        res[n-1] = l[n-2];
        for(int i = 1;i < n - 1;i++)res[i] = l[i-1]*r[i+1];
        return res;
    }
}
```
