# 39. 对称二叉树
> 题目链接：https://leetcode.cn/problems/symmetric-tree/

### 解题思路
递归比较左右子树**镜像对应节点**，判断二叉树是否对称。

### java版本解答
```java
class Solution {
    public boolean isSymmetric(TreeNode root) {
        return isM(root.left, root.right);
    }
    boolean isM(TreeNode l,TreeNode r){
        if(l == null || r == null)return l == r;
        return l.val == r.val && isM(l.left, r.right) && isM(l.right, r.left);
    }
}
```
