# 3. 最长连续序列
> 题目链接：https://leetcode.cn/problems/longest-consecutive-sequence

### 解题思路
利用 HashSet 的 O(1) 查询特性 来模拟“连续增长”。

### java版本解答
```java
class Solution {
    public int longestConsecutive(int[] nums) {
        // 要求设计并实现时间复杂度为 O(n) 的算法解决此问题
        HashSet<Integer>set = new HashSet<>();
        for(int i : nums)set.add(i);
        int res = 0;
        for(int x : set){
            // 保证不重复计算的关键判断
            if(!set.contains(x - 1)){
                int cur = x;
                while(set.contains(cur)){
                    cur++;
                }
                res = Math.max(cur - x,res);
            }
        }
        return res;
    }
}
```
