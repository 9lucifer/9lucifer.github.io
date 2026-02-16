# 17. 缺失的第一个正数
> 题目链接：https://leetcode.cn/problems/first-missing-positive

### 解题思路
用数组下标当哈希表，把值为 x 的数放到 index = x-1 的位置上。
然后顺序扫描，第一个位置不匹配的就是答案。
### java版本解答
```java
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;

        // 第一轮：把每个数字放到它“应该在的位置”
        // 规则：数字 x 应该放在 下标 x-1 的位置
        for(int i = 0;i < n;i++){
            // 当前数合法(1~n) 且 没放在正确位置 且 目标位置不是同一个数（防止死循环）
            while(nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]){
                int j = nums[i] - 1;   // nums[i] 应该去的位置
                int tmp = nums[i];     // 交换 nums[i] 和 nums[j]
                nums[i] = nums[j];
                nums[j] = tmp;
            }
        }

        // 第二轮：寻找第一个不满足 nums[i] == i+1 的位置
        // 该位置 +1 就是缺失的最小正数
        for(int i = 0;i < n;i++){
            if(nums[i] - 1 != i)return i + 1;
        }

        // 如果 1~n 全都存在，那么答案是 n+1
        return n+1;
    }
}

```
