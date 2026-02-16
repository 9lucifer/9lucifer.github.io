# 38. 翻转二叉树
> 题目链接：https://leetcode.cn/problems/invert-binary-tree/

### 解题思路
递归交换左右子树，实现二叉树翻转。

### java版本解答
```java
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if(root == null)return root;
        TreeNode tmp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(tmp);
        return root;
    }
}
```
