# 52. 腐烂的橘子
> 题目链接：https://leetcode.cn/problems/rotting-oranges/

### 解题思路
先把所有初始腐烂橘子当作“同一时刻的起点”入队，并统计新鲜橘子数量 `cnt`；然后一轮一轮（层序）向四个方向感染相邻的新鲜橘子，每扩散一层时间 `round+1` 且 `cnt--`，直到没有新鲜橘子或队列空——若最后 `cnt>0` 说明有橘子永远到不了返回 `-1`，否则层数 `round` 就是最少分钟数。

### java版本解答
```java
class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        int cnt = 0,round = 0;
        Queue<int[]>queue = new ArrayDeque<>();
        for(int i = 0;i < m;i++){
            for(int j = 0;j < n;j++){
                if(grid[i][j] == 1)cnt++;
                else if(grid[i][j] == 2){
                    queue.add(new int[]{i,j});
                }
            }
        }
        if(cnt == 0)return 0;
        while(cnt > 0 && !queue.isEmpty()){
            round++;
            int size = queue.size();
            for(int i = 0;i < size;i++){
                int [] orange = queue.poll();
                int r = orange[0];
                int c = orange[1];
                if(r - 1 >= 0 && grid[r-1][c] == 1){
                    cnt--;
                    grid[r-1][c] = 2;
                    queue.add(new int[]{r-1,c});
                }

                if(r + 1 < m && grid[r+1][c] == 1){
                    cnt--;
                    grid[r+1][c] = 2;
                    queue.add(new int[]{r+1,c});
                }

                if(c - 1 >= 0 && grid[r][c-1] == 1){
                    cnt--;
                    grid[r][c-1] = 2;
                    queue.add(new int[]{r,c-1});
                }

                if(c + 1 < n && grid[r][c+1] == 1){
                    cnt--;
                    grid[r][c+1] = 2;
                    queue.add(new int[]{r,c+1});
                }
            }
        }
        return cnt > 0 ? -1 : round;
    }
}
```
