# 77. 买卖股票的最佳时机
> 题目链接：https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/

### 解题思路
没啥好说的说是。
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
