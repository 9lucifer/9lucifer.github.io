# 64. 搜索二维矩阵
> 题目链接：https://leetcode.cn/problems/search-a-2d-matrix/

### 解题思路
> 需要理解这种二分写法的l代表什么，本题不难。
### java版本解答
```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int n = matrix.length;
        int m = matrix[0].length;
        int l = 0,r = n - 1;
        while(l <= r){
            int mid = (l + r)/2;
            if(target == matrix[mid][0])return true;
            else if(target > matrix[mid][0])l = mid + 1;
            else r = mid - 1;
        }
        // 当l = 0，表示应该被插入到第0行，也就是没找到合适的数据行
        if(l == 0)return false;
        int row = l - 1;
        l = 0;
        r = m - 1;
        while(l <= r){
            int mid = (l + r)/2;
            if(target == matrix[row][mid])return true;
            else if(target > matrix[row][mid])l = mid + 1;
            else r = mid - 1;
        }
        return false;
    }
}
```
