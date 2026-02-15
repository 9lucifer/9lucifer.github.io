# 10. 和为k的子数组
> 题目链接：https://leetcode.cn/problems/subarray-sum-equals-k

### 解题思路
利用前缀和与哈希表，将“找连续子数组”的问题转化为“找两个前缀和之差”。

通过记录从数组开头到当前位置的累加和 $s$（即前缀和），如果当前前缀和为 $s$，而之前某个位置的前缀和正好是 $s - k$，那么这两个位置之间的子数组之和就必然等于 $k$。使用哈希表实时存储已出现的前缀和及其频率，可以在 $O(1)$ 的时间内快速找到匹配的历史记录，从而在一次遍历中统计出所有符合条件的子数组数量。

### java版本解答
```java
class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer,Integer>map = new HashMap<>();
        int s = 0;
        int res = 0;
        for(int i : nums){
            map.merge(s, 1, Integer::sum);
            s+=i;
            res += map.getOrDefault(s - k, 0);
        }
        return res;
    }
}
```
