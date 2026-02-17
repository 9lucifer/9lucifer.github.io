# 50. 二叉树中的最大路径和
> 题目链接：https://leetcode.cn/problems/binary-tree-maximum-path-sum/

### 解题思路
每个节点尝试当“拐点”，更新答案；但向父节点只能返回一条单边最大路径。

### java版本解答
```java
class Solution {
    // 全局最大答案：记录“任意两点之间”的最大路径和
    int res = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        dfs(root);
        return res;
    }

    /**
     * dfs返回值含义：
     * 从当前节点出发，向父节点“能提供的最大单边路径和”
     * （注意：只能选一条边，因为路径不能分叉）
     */
    int dfs(TreeNode root) {
        if (root == null)
            return 0;

        // 如果子树是负贡献，就不要（相当于不走这条路）
        int l = Math.max(0, dfs(root.left));
        int r = Math.max(0, dfs(root.right));

        // 以当前节点为“最高点”的完整路径（可以同时走左右）
        // 用来更新全局答案
        res = Math.max(res, root.val + l + r);

        // 返回给父节点的值：只能选择一边走（不能同时左右）
        return root.val + Math.max(l, r);
    }
}

```
