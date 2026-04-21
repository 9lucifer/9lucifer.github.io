# 36. 二叉树的中序遍历
<PageViewCount />

> 题目链接：https://leetcode.cn/problems/binary-tree-inorder-traversal/

### 解题思路
递归版本，好理解，但是非递归也得会[todo😋]。

### java版本解答
```java
class Solution {
    List<Integer> res = new ArrayList<>();
    public List<Integer> inorderTraversal(TreeNode root) {
        dfs(root);
        return res;
    }
    void dfs(TreeNode root){
        if(root == null) return;
        dfs(root.left);
        res.add(root.val);
        dfs(root.right);
    }
}
```
