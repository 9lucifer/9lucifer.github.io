# 60. 单词搜索
> 题目链接：https://leetcode.cn/problems/word-search/

### 解题思路
回溯应该是唯一的做法。
### java版本解答
```java
class Solution {
    boolean res = false;
    public boolean exist(char[][] board, String word) {
        int m = board.length;
        int n = board[0].length;
        for(int i = 0;i < m;i++){
            for(int j = 0;j < n;j++){
                backTrack(board, i, j, 0,word);
                if(res)return true;
            }
        }
        return false;
    }
    void backTrack(char[][] board,int i,int j,int start,String word){
        if(start == word.length()){
            res = true;
            return;
        }
        int m = board.length;
        int n = board[0].length;
        if(i < 0 || i >= m || j < 0 || j >= n)return;
        if(word.charAt(start) != board[i][j])return;
        board[i][j] = (char)(-board[i][j]);
        backTrack(board, i, j+1, start+1, word);
        backTrack(board, i, j-1, start+1, word);
        backTrack(board, i+1, j, start+1, word);
        backTrack(board, i-1, j, start+1, word);
        board[i][j] = (char)(-board[i][j]);
    }
}
```
