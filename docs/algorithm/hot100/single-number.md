# 96. 只出现一次的数字
> 题目链接：https://leetcode.cn/problems/single-number/

### 解题思路
利用异或：相同数字抵消( a^a=0 )，最后剩下只出现一次的数
### java版本解答
```java
class Solution {
    public int singleNumber(int[] nums) {
        int ans = 0;
        for(int x : nums) ans ^= x;
        return ans;
    }
}
```
