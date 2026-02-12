# 5. 盛最多水的容器
> 题目链接：https://leetcode.cn/problems/container-with-most-water

### 解题思路
初始时：宽度最大
- 左指针 l = 0
- 右指针 r = n - 1
然后不断向内移动指针寻找更大的面积。

### java版本解答
```java
class Solution {
    public int maxArea(int[] height) {
        // 双指针，起点为两端
        int l = 0,r = height.length - 1,res = 0;
        while(l < r){
            // 计算当前体积
            int tmp = (r - l) * Math.min(height[l],height[r]);
            res = Math.max(tmp,res);
            if(height[l] > height[r])r--;
            else l++;
        }
        return res;
    }
}
```
