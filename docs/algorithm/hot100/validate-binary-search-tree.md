# 43. 验证二叉搜索树
> 题目链接：https://leetcode.cn/problems/validate-binary-search-tree/

### 解题思路
上下界约束传递，注意用long。

我的一个困惑解答：缺孩子完全没问题，只要不违反大小关系就是合法 BST。
> 需要再巩固

### java版本解答
```java
class Solution {
    public boolean isValidBST(TreeNode root) {
        return isV(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    boolean isV(TreeNode root,Long l,Long r){
        if(root == null)return true;
        long x = root.val;
        return l < x && x < r
        && isV(root.left, l, x)
        && isV(root.right, x, r);
    }
}
```
