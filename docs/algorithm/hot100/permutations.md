# 55. 全排列
> 题目链接：https://leetcode.cn/problems/permutations/

### 解题思路
爷爷看两遍估计都会了。
### java版本解答
```java
class Solution {
    List<List<Integer>> res = new ArrayList<>();
    public List<List<Integer>> permute(int[] nums) {
        List<Integer>path = new ArrayList<>();
        boolean [] isUsed = new boolean[nums.length];
        backTrack(nums, path,isUsed);
        return res;
    }
    void backTrack(int[] nums,List<Integer>path,boolean [] isUsed){
        if(path.size() == nums.length){
            res.add(new ArrayList<>(path));
            return;
        }
        for(int i = 0;i < nums.length;i++){
            if(isUsed[i])continue;
            isUsed[i] = true;
            path.add(nums[i]);
            backTrack(nums, path, isUsed);
            path.removeLast();
            isUsed[i] = false;
        }

    }
}```
