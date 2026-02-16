# 40. 二叉树的直径
> 题目链接：https://leetcode.cn/problems/diameter-of-binary-tree/

### 解题思路
递归计算左右子树高度，同时更新最大直径（左右高度之和）。
### java版本解答
```java
class Solution {
    int res;
    public int diameterOfBinaryTree(TreeNode root) {
        dfs(root);
        return res;
    }
    int dfs(TreeNode root){
        if(root == null)return 0;
        int l = dfs(root.left);
        int r = dfs(root.right);
        res = Math.max(res,l+r);
        return Math.max(l,r)+1;
    }
}
```
