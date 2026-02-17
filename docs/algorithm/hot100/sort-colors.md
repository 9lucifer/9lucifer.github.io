# 98. 颜色分类
> 题目链接：https://leetcode.cn/problems/sort-colors/

### 解题思路
单次遍历，通过三个指针维护 0/1/2 三段区间，不断用覆盖的方式重建有序数组。

### java版本解答
```java
class Solution {
    public void sortColors(int[] nums) {
        int idx0 = 0, idx1 = 0, idx2 = 0;

        for (int x : nums) {
            // 每遍历一个数，先把“2区间”向右扩展
            nums[idx2++] = 2;

            // 如果当前数 <=1，说明它不是2，需要把当前位置改写为1
            if (x <= 1) nums[idx1++] = 1;

            // 如果是0，再进一步覆盖为0（0优先级最高）
            if (x == 0) nums[idx0++] = 0;
        }
    }
}
```
