# 7. 接雨水
> 题目链接：https://leetcode.cn/problems/trapping-rain-water

### 解题思路
一个位置能装多少水，只取决于它左边最高的墙 和 右边最高的墙 中较矮的那个。

> 暂时不理解的背就完事了～

### java版本解答
```java
class Solution {
    public int trap(int[] height) {
        int res = 0, n = height.length;
        int[] l = new int[n];
        int[] r = new int[n];
        l[0] = height[0];
        r[n - 1] = height[n - 1];
        for (int i = 1; i < n; i++)
            l[i] = Math.max(l[i - 1], height[i]);
        for (int i = n - 2; i >= 0; i--)
            r[i] = Math.max(r[i + 1], height[i]);
        for (int i = 0; i < n; i++)
            res += Math.min(l[i], r[i]) - height[i];
        return res;
    }
}
```
