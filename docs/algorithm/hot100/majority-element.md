# 97. 多数元素
> 题目链接：https://leetcode.cn/problems/majority-element/

### 解题思路
利用“票数抵消”(摩尔投票法)，非众数两两抵消后，最后剩下的候选人就是众数。

### java版本解答
```java
class Solution {
    public int majorityElement(int[] nums) {
        int res = nums[0]; // 当前候选众数
        int vote = 1;      // 当前候选的票数

        for(int i = 1;i < nums.length;i++){
            if(nums[i] == res) vote++;   // 相同就增加支持票
            else{
                vote--;                  // 不同就相互抵消
                if(vote == 0){           // 被抵消光，换新候选人
                    res = nums[i];
                    vote = 1;
                }
            }
        }
        return res; // 最终剩下的一定是众数
    }
}

```
