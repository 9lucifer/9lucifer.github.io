# 4. 移动零
> 题目链接：https://leetcode.cn/problems/move-zeroes

### 解题思路
用一个指针 idx 表示 下一个非零元素应该放的位置。
1. 遍历数组：
   - 如果当前元素 ≠ 0 → 放到 idx 位置，并 idx++
   - 如果是 0 → 跳过
2. 最后再补充末尾的0

### java版本解答
```java
class Solution {
    public void moveZeroes(int[] nums) {
        int idx = 0;
        // 不为0的往前移
        for(int i : nums){
            if (i != 0){
                nums[idx++] = i;
            }
        }
        for(int i = idx;i < nums.length;i++)nums[i] = 0;
    }
}
```
