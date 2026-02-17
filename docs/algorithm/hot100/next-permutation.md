# 99. 下一个排列
> 题目链接：https://leetcode.cn/problems/next-permutation/

### 解题思路
> 重点关注对象。

从右往左找到第一个下降点，与右侧刚好比它大的数交换，再把后缀反转成最小序，使排列变为下一个字典序。

### java版本解答
```java
class Solution {
    public void nextPermutation(int[] nums) {
        // [2, 6, 4, 3, 5, 1]
        // [2, 6, 4, 5, 1, 3]
        int n = nums.length;
        int p = n - 2;
        //第一次找第一个不是倒序排列的
        while(p >=0 && nums[p] >= nums[p+1])p--;
        if(p >= 0){
            int j = n - 1;
            // 第二次找倒数第一个比nums[p]大的
            while(nums[j] <= nums[p])j--;
            swap(nums, p, j);
        }

        reverse(nums, p+1, n-1);
    }

    void swap(int [] nums,int i,int j){
        int t = nums[i];
        nums[i] = nums[j];
        nums[j] = t;
    }
    void reverse(int [] nums,int i,int j){
        while(i < j){
            swap(nums, i, j);
            i++;j--;
        }
    }
}
```
