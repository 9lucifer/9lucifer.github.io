# 82. 杨辉三角
> 题目链接：https://leetcode.cn/problems/pascals-triangle/

### 解题思路
按行生成杨辉三角，每行两端是1，中间的每个数等于上一行相邻两个数之和。

### java版本解答
```java
class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> res = new ArrayList<>();
        List<Integer> tmp = new ArrayList<>();
        tmp.add(1);
        res.add(tmp);
        if(numRows == 1){
            return res;
        }
        for(int i = 2;i <= numRows;i++){
            tmp = new ArrayList<>();
            tmp.add(1);
            for(int j = 2;j <= i - 1;j++){
                tmp.add(res.getLast().get(j-2)+res.getLast().get(j-1));
            }
            tmp.add(1);
            res.add(tmp);
        }
        return res;
    }
}
```
