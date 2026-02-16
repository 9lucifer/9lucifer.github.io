# 20. 旋转图像
> 题目链接：https://leetcode.cn/problems/rotate-image

### 解题思路
水平翻转 + 副对角线翻转 = 顺时针旋转 90°

### java版本解答
```java
class Solution {
    public void rotate(int[][] matrix) {

        // 思路：顺时针旋转 90°
        // = 先左右翻转（每一行反转） + 再按副对角线翻转

        // 每行反转：
        // 1 2 3      3 2 1
        // 4 5 6  ->  6 5 4
        // 7 8 9      9 8 7

        // 再沿副对角线翻转：
        // 3 2 1      7 4 1
        // 6 5 4  ->  8 5 2
        // 9 8 7      9 6 3

        int n = matrix.length;

        // 1. 先把每一行左右反转
        for(int[] row:matrix){
            revserse(row);
        }

        // 2. 按副对角线 (i+j = n-1) 交换
        for(int i = 0;i < n;i++){
            for(int j = 0;j < n;j++){
                // 只处理对角线一侧，避免重复交换
                if((i + j) < n - 1){
                    int tmp = matrix[i][j];
                    matrix[i][j] = matrix[n-j-1][n-i-1];
                    matrix[n-j-1][n-i-1] = tmp;
                }
            }
        }
    }

    // 反转一维数组
    void revserse(int [] row){
        int l = 0,r = row.length - 1;
        while(l < r){
            int tmp = row[l];
            row[l] = row[r];
            row[r] = tmp;
            l++;
            r--;
        }
    }
}

```
