# 100. 寻找重复数
> 题目链接：https://leetcode.cn/problems/find-the-duplicate-number/

### 解题思路
> 重点关注对象。

把数组看成链表，用快慢指针找环并定位入环点，入环位置对应的数就是重复数字。
### java版本解答
```java
class Solution {
    public int findDuplicate(int[] nums) {
        int slow = 0,fast = 0;
        while(true){
            slow = nums[slow];
            fast = nums[nums[fast]];
            if(slow == fast)break;
        }
        fast = slow;
        slow = 0;
        while(slow != fast){
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}
```
