# 46. 二叉树展开为链表
> 题目链接：https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/

### 解题思路

> 参考labuladong算法

1、将 root 的左子树和右子树拉平。

2、将 root 的右子树接到左子树下方，然后将整个左子树作为右子树。

![image-20260217120420799](https://imgtu.oss-cn-beijing.aliyuncs.com/image/image-20260217120420799.png)


### java版本解答
```java
class Solution {
    public void flatten(TreeNode root) {
        if(root == null)return;
        // 先递归拉平左右子树
        flatten(root.left);
        flatten(root.right);
        // 1、左右子树已经被拉平成一条链表
        TreeNode left = root.left;
        TreeNode right = root.right;
        // 2、将左子树作为右子树
        root.left = null;
        root.right = left;
        // 3、将原先的右子树接到当前右子树的末端
        TreeNode p = root;
        while(p.right != null)p = p.right;
        p.right = right;
    }
}
```
