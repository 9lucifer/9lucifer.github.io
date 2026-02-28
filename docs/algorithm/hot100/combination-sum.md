# 58. 组合总和
> 题目链接：https://leetcode.cn/problems/combination-sum/

### 解题思路
简简单单，但是注意及时剪枝。

### java版本解答
```java
class Solution {
    List<List<Integer>> res = new ArrayList<>();
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<Integer>path = new ArrayList<>();
        backTrack(candidates, target, path, 0,0);
        return res;
    }

    void backTrack(int[] candidates, int target,List<Integer>path,int sum,int start){
        if(sum > target)return;
        if(sum == target){
            res.add(new ArrayList<>(path));
            return;
        }
        for(int i = start;i < candidates.length;i++){
            path.add(candidates[i]);
            sum+=candidates[i];
            backTrack(candidates, target, path, sum, i);
            sum-=candidates[i];
            path.removeLast();
        }
    }
}
```
