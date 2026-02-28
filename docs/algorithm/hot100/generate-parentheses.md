# 59. 括号生成
> 题目链接：https://leetcode.cn/problems/generate-parentheses/

### 解题思路
这是一个典型的回溯剪枝问题，把生成括号看成一棵决策树：每一步可以选择加 "(" 或 ")"，但通过两个约束进行剪枝——左括号数量不能超过 n，右括号数量不能超过左括号数量——保证生成过程始终合法，直到左右括号都达到 n 时收集结果。
### java版本解答
```java
class Solution {
    List<String> res = new ArrayList<>();
    public List<String> generateParenthesis(int n) {
        backTrack(n, 0, 0, new String());
        return res;
    }

    void backTrack(int n,int l,int r,String s){
        if(n == l && n == r){
            res.add(new String(s));
            return;
        }
        if(l < n)backTrack(n, l+1, r, s+"(");
        if(l > r && r < n)backTrack(n, l, r+1, s+")");
    }
}
```
