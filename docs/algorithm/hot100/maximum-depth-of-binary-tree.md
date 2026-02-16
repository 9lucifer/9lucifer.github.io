# 37. 二叉树的最大深度
> 题目链接：https://leetcode.cn/problems/maximum-depth-of-binary-tree/

### 解题思路
递归求左右子树最大深度，返回二者最大值加一，即二叉树深度。
### java版本解答
```java
class Solution {
    public int maxDepth(TreeNode root) {
        if(root == null)return 0;
        int l = maxDepth(root.left);
        int r = maxDepth(root.right);
        return Math.max(l,r)+1;
    }
}
```
