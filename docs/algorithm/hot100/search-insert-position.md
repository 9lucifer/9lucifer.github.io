# 63. 搜索插入位置
> 题目链接：https://leetcode.cn/problems/search-insert-position/

### 解题思路
> 对于二分，确定一套模版就不要随便改了；
> 
> `<=` `l = mid - 1;` `r = mid + 1;`
### java版本解答
```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        int n = nums.length;
        int l = 0,r = n - 1;
        while(l <= r){
            int mid = (l + r) / 2;
            if(nums[mid] == target)return mid;
            else if(nums[mid] < target){
                l = mid + 1;
            }else{
                r = mid - 1;
            }
        }
        return l;
    }
}
```
