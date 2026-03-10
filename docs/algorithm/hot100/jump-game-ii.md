# 79. 跳跃游戏 II
> 题目链接：https://leetcode.cn/problems/jump-game-ii/

### 解题思路
这题使用 贪心算法。遍历数组时维护当前这一步能够覆盖的最远边界 end，以及在这个范围内下一步能够到达的最远位置 maxNext。当遍历到当前边界 end 时，说明必须进行一次跳跃，于是跳跃次数 step+1，并把边界更新为 maxNext。这样每次都在当前范围内选择能跳得最远的位置，从而保证用 最少的跳跃次数到达终点，时间复杂度 O(n)，空间复杂度 O(1)。
### java版本解答
```java
class Solution {
    public int jump(int[] nums) {
        int maxNext = 0; // 当前这一跳范围内，下一步能够到达的最远位置
        int step = 0;    // 最少跳跃次数
        int end = 0;     // 当前这一跳能够覆盖的最远边界

        // 遍历数组（最后一个位置不需要再跳）
        for (int i = 0; i < nums.length - 1; i++) {

            // 更新在当前跳跃范围内，下一步能到达的最远位置
            maxNext = Math.max(maxNext, i + nums[i]);

            // 当遍历到当前跳跃的边界时，说明必须进行一次跳跃
            if (i == end) {
                step++;          // 跳跃次数 +1
                end = maxNext;   // 更新下一次跳跃的边界
            }
        }

        return step;
    }
}
```
