# 73. 柱状图中最大的矩形
> 题目链接：https://leetcode.cn/problems/largest-rectangle-in-histogram/

### 解题思路
> 参考labuladong

这是个没啥排面的hard，多看多想多做。
### java版本解答
```java
class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        // 在两端各加一个高度为 0 的哨兵，避免边界判断
        int[] h = new int[n + 2];
        for (int i = 0; i < n; i++) h[i + 1] = heights[i];

        // 单调递增栈，存储索引
        Deque<Integer> stk = new ArrayDeque<>();
        int maxArea = 0;
        for (int i = 0; i < n + 2; i++) {
            // 遇到比栈顶更矮的柱子，弹出并计算以弹出柱为高的最大矩形
            while (!stk.isEmpty() && h[stk.peek()] > h[i]) {
                int height = h[stk.pop()];
                // 宽度 = 当前索引 - 新栈顶索引 - 1
                int width = i - stk.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stk.push(i);
        }
        return maxArea;
    }
}
```
