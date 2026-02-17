# 49. 二叉树的最近公共祖先
> 题目链接：https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/

### 解题思路
思路：后序遍历（从下往上返回信息）

含义：
- 函数返回值 = 当前子树中 p 和 q 的最近公共祖先

- 三种情况：

- 1）p 和 q 分别在左右子树 -> 当前节点就是 LCA

- 2）p 和 q 都在同一侧 -> 往上返回那一侧找到的结果

- 3）当前节点就是 p 或 q -> 直接返回当前节点

### java版本解答
```java
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {

        // 找到 p 或 q 或者遍历到 null
        if (root == null || root == p || root == q)
            return root;

        // 在左右子树找
        TreeNode l = lowestCommonAncestor(root.left, p, q);
        TreeNode r = lowestCommonAncestor(root.right, p, q);

        // 情况1：左右各找到一个 -> 当前节点是最近公共祖先
        if (l != null && r != null)
            return root;

        // 情况2：都没找到
        if (l == null && r == null)
            return null;

        // 情况3：只在一边找到 -> 返回那一边的结果
        return l == null ? r : l;
    }
}

```
