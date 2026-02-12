# 两数之和
> 题目链接：https://leetcode.cn/problems/two-sum/description/?envType=study-plan-v2&envId=top-100-liked

这已经是最简单的题目了，用hashmap秒杀。
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer,Integer> map = new HashMap<>();
        for(int i = 0;i < nums.length;i++){
            // 如果map里面已经有值可以凑成一对了，直接返回
            if(map.containsKey(target - nums[i])){
                return new int[]{i,map.get(target - nums[i])};
            }
            map.put(nums[i],i);
        }
        // 根据题意走不到这里
        return new int[]{-1,-1};
    }
}
```