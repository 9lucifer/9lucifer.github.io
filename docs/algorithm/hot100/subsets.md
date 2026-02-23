# 56. 子集
> 题目链接：https://leetcode.cn/problems/subsets/

### 解题思路
因为 for 循环已经保证 i < nums.length，所以递归最多到 start == nums.length 就自然停止，start 根本不会大于 length，因此写 if(start > nums.length) 没意义，而且终止逻辑已经被循环控制住了。
### java版本解答
```java
class Solution {
    List<List<Integer>> res = new ArrayList<>();
    public List<List<Integer>> subsets(int[] nums) {
        List<Integer>path = new ArrayList<>();
        backTrack(nums, 0, path);
        return res;
    }

    void backTrack(int[] nums,int start,List<Integer>path){
        res.add(new ArrayList<>(path));
        for(int i = start;i < nums.length;i++){
            path.add(nums[i]);
            backTrack(nums, i+1, path);
            path.removeLast();
        }
    }
}
```
