# 6. 三数之和
> 题目链接：https://leetcode.cn/problems/3sum

小黑盒二面好像必问三数之和的三种解法，私以为是新时代的茴香豆几种写法了。

### java版本解答
#### 解法1:内层用hashset记录已经遍历过的数字，利用contains节省一层循环
```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // -1 -1 -1 0 1 1 1
        Arrays.sort(nums);
        HashSet<List<Integer>> res = new HashSet<>();
        for(int i = 0;i < nums.length - 1;i++){
            HashSet<Integer>set = new HashSet<>();
            int target = -nums[i];
            for(int j = i + 1;j < nums.length;j++){
                if(set.contains(target - nums[j])){
                    List<Integer>tmp = new ArrayList<>();
                    tmp.add(nums[i]);
                    tmp.add(target - nums[j]);
                    tmp.add(nums[j]);
                    res.add(tmp);
                }
                set.add(nums[j]);
            }
        }
        return new ArrayList<>(res);
    }
}
```
这个做法只能击败5%。


#### 解法2:双指针+去重
```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for(int i = 0;i < nums.length - 2;i++){
            if (i > 0 && nums[i] == nums[i-1]) continue;
            int l = i + 1,r = nums.length - 1;
            int target = -nums[i];
            while(l < r){
                int sum = nums[l] + nums[r];
                if(sum == target){
                    res.add(Arrays.asList(nums[i],nums[l],nums[r]));
                    l++;r--;
                    while(l < r && nums[l - 1] == nums[l])l++;
                    while(l < r && nums[r + 1] == nums[r])r--;
                }else if(sum > target)r--;
                else l++;
            }
        }
        return res;
    }
}
```
这个做法击败了48%。
