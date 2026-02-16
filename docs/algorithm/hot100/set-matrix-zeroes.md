# 18. 矩阵置零
> 题目链接：https://leetcode.cn/problems/set-matrix-zeroes

### 解题思路
用 第一行 + 第一列充当 O(1) 空间的标记位，避免额外数组。

### java版本解答
```java
class Solution {
    public void setZeroes(int[][] matrix) {
        int n = matrix.length;
        int m = matrix[0].length;

        // 标记第一行、第一列本身是否需要被清零
        boolean isFirstRow = false;
        boolean isFirstCol = false;

        // 判断第一行是否有 0
        for(int i = 0;i < m;i++){
            if(matrix[0][i] == 0)isFirstRow = true;
        }

        // 判断第一列是否有 0
        for(int i = 0;i < n;i++){
            if(matrix[i][0] == 0)isFirstCol = true;
        }

        // 用第一行和第一列作为“标记数组”
        // 如果 (i,j) 为 0，则标记 i 行 和 j 列需要清零
        for(int i = 0;i < n;i++){
            for(int j = 0;j < m;j++){
                if(matrix[i][j] == 0){
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }

        // 根据标记，把内部元素置 0（跳过第一行第一列）
        for(int i = 1;i < n;i++){
            for(int j = 1;j < m;j++){
                if(matrix[i][0] == 0 || matrix[0][j] == 0){
                    matrix[i][j] = 0;
                }
            }
        }

        // 最后处理第一行
        if(isFirstRow)
            for(int i = 0;i < m;i++)matrix[0][i] = 0;

        // 最后处理第一列
        if(isFirstCol)
            for(int i = 0;i < n;i++)matrix[i][0] = 0;
    }
}

```
