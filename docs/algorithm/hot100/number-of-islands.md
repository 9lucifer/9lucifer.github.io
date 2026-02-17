# 51. 岛屿数量
> 题目链接：https://leetcode.cn/problems/number-of-islands/

### 解题思路
遍历网格，遇到陆地就 DFS 淹没整块连通区域，每触发一次搜索就代表发现一个岛屿。

### java版本解答
```java
class Solution {
    public int numIslands(char[][] grid) {
        int cnt = 0;
        int n = grid.length;
        int m = grid[0].length;
        for(int i = 0;i < n;i++){
            for(int j = 0;j < m;j++){
                if(grid[i][j] == '1'){
                    dfs(grid,i,j);
                    cnt++;
                }
            }
        }
        return cnt;
    }

    void dfs(char[][]grid,int i,int j){
        int n = grid.length;
        int m = grid[0].length;
        if(i < 0 || i >= n || j < 0||j >= m)return;
        if(grid[i][j] == '1'){
            grid[i][j] = '0';
            dfs(grid, i+1, j);
            dfs(grid, i-1, j);
            dfs(grid, i, j+1);
            dfs(grid, i, j-1);
        }
    }
}
```
