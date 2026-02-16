# 15. 轮转数组
> 题目链接：https://leetcode.cn/problems/rotate-array

### 解题思路
先把数组按 **“后 k 个 + 前 n-k 个”** 两段分别反转，让它们各自内部顺序正确。
再整体反转一次，使两段交换位置，从而完成右旋转。

### java版本解答
```java
class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k = k % n;
        reverse(nums, n - k, n - 1);
        reverse(nums, 0, n - k - 1);
        reverse(nums, 0, n - 1);
    }

    void reverse(int [] nums,int l,int r){
        while(l < r){
            int tmp = nums[l];
            nums[l] = nums[r];
            nums[r] = tmp;
            l++;
            r--;
        }
    }
}
```
