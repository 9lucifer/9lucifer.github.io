# 21. 搜索二维矩阵 II
> 题目链接：https://leetcode.cn/problems/search-a-2d-matrix-ii

### 解题思路
从右上角开始搜索：**比当前大就向下，比当前小就向左，逐步排除一行或一列实现二分式收缩查找。**

### java版本解答
```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length;
        int n = matrix[0].length;
        int i = 0,j = n - 1;
        while(j >= 0 && i < m){
            if(target == matrix[i][j])return true;
            else if(target > matrix[i][j])i++;
            else j--;
        }
        return false;
    }
}
```
