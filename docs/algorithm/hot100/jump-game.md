# 78. 跳跃游戏
> 题目链接：https://leetcode.cn/problems/jump-game/

### 解题思路
这题使用 **贪心算法**。遍历数组时维护当前能够到达的最远位置 `maxLen`，初始为 `nums[0]`。在遍历过程中，如果当前位置 `i` 已经大于 `maxLen`，说明这个位置无法被到达，直接返回 `false`；否则就用 `maxLen = max(maxLen, i + nums[i])` 更新能够跳到的最远距离。遍历结束仍然没有出现无法到达的位置，说明可以一直跳到终点，因此返回 `true`。时间复杂度 `O(n)`，空间复杂度 `O(1)`。

### java版本解答
```java
class Solution {
    public int maxProfit(int[] prices) {
        int min = prices[0],res = Integer.MIN_VALUE;
        for(int i = 1;i < prices.length;i++){
            if(min < prices[i])res = Math.max(res,prices[i] - min);
            min = Math.min(prices[i],min);
        }
        return res == Integer.MIN_VALUE ? 0 : res;
    }
}
```
