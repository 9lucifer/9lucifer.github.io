# 67. 寻找旋转排序数组中的最小值
> 题目链接：https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/

### 解题思路
> 这题需要再看。

为什么和 nums[r] 比较？因为 r 永远在右半段。
### java版本解答
```java
class Solution {
    public int findMin(int[] nums) {
        int l = 0,r = nums.length - 1;
        while(l < r){
            int mid = (l + r)/2;
            if(nums[mid] > nums[r])l = mid + 1;
            else r = mid;
        }
        return nums[l];
    }
}
```
