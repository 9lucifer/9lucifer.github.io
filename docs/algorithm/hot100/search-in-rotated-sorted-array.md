# 66. 搜索旋转排序数组
> 题目链接：https://leetcode.cn/problems/search-in-rotated-sorted-array/

### 解题思路
画个图看看最好，宗旨是保证在**单调的一侧**进行分析。
```text
//
    //
  //
```
### java版本解答
```java
class Solution {
    public int search(int[] nums, int target) {
        //
            //
          //
        int l = 0,r = nums.length - 1;
        while(l <= r){
            int mid = (l + r)/2;
            if(nums[mid] == target)return mid;
            if(nums[mid] >= nums[l]){
                if(nums[mid] > target && target >= nums[l]){
                    r = mid - 1;
                }else{
                    l = mid + 1;
                }
            }else{
                if(nums[mid] < target && target <= nums[r]){
                    l = mid + 1;
                }else{
                    r = mid - 1;
                }
            }
        }
        return -1;
    }
}
```
