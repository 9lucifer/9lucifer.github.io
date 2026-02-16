# 19. 螺旋矩阵
> 题目链接：https://leetcode.cn/problems/spiral-matrix

### 解题思路
不断收缩四个边界，每次按 上 → 右 → 下 → 左 的顺序“剥一圈”。

### java版本解答
```java
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        int m = matrix.length,n = matrix[0].length;

        // 四个边界：左、右、上、下
        int l = 0,r = n - 1,top = 0,bottom = m - 1;

        while(l <= r && top <= bottom){

            // 1. 从左到右遍历上边
            for(int i = l;i <= r;i++)res.add(matrix[top][i]);
            top++; // 上边界下移

            // 2. 从上到下遍历右边
            for(int i = top;i <= bottom;i++)res.add(matrix[i][r]);
            r--; // 右边界左移

            // 3. 从右到左遍历下边（必须确认这一行还存在）
            if(l <= r && top <= bottom){
                for(int i = r;i >= l;i--)res.add(matrix[bottom][i]);
                bottom--; // 下边界上移
            }

            // 4. 从下到上遍历左边（必须确认这一列还存在）
            if(l <= r && top <= bottom){
                for(int i = bottom;i >= top;i--)res.add(matrix[i][l]);
                l++; // 左边界右移
            }
        }
        return res;
    }
}

```
