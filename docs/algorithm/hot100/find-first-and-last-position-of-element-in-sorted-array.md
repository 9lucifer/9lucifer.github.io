# 65. 在排序数组中查找元素的第一个和最后一个位置
> 题目链接：https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/

### 解题思路
如果nums[mid] < target，说明左边界太小；否则就是有边界需要收缩（>= target）
### java版本解答
```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int start = lb(nums, 0, nums.length - 1, target);
        if(start == nums.length || nums[start] != target)return new int[]{-1,-1};
        int end = lb(nums, 0, nums.length - 1, target + 1) - 1;
        return new int[]{start,end};
    }

    int lb(int [] nums,int l,int r,int target){
        while(l <= r){
            int mid = (l + r)/2;
            if(nums[mid] < target)l = mid + 1;
            else r = mid - 1;
        }
        return l;
    }
}
```
