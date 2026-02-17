# 48. 路径总和 III
> 题目链接：https://leetcode.cn/problems/path-sum-iii/

### 解题思路
枚举起点 + 向下DFS统计路径和 = target 的数量（双递归）。

> 进阶写法是前缀和，o(n)。
### java版本解答
```java
/**
 * 思路：双递归
 * 1）枚举每个节点作为“路径起点”
 * 2）从该节点向下搜索所有满足 target 的路径
 *
 * pathSum = 以当前节点为起点的路径数
 *         + 左子树中的路径数
 *         + 右子树中的路径数
 */
class Solution {
    public int pathSum(TreeNode root, int target) {
        // 空节点没有路径
        if(root == null) return 0;

        // 三部分：
        // 1. 以当前 root 为起点的路径
        // 2. 左子树中的路径
        // 3. 右子树中的路径
        return dfs(root, target)
                + pathSum(root.left, target)
                + pathSum(root.right, target);
    }

    /**
     * dfs 含义：
     * 计算“必须从当前节点出发向下走”的路径数量
     *
     * target：当前还需要凑的和
     */
    int dfs(TreeNode root, long target){
        if(root == null) return 0;

        // 如果当前节点刚好凑成一条路径
        int cnt = (root.val == target) ? 1 : 0;

        // 继续往下找（剩余值 = target - 当前节点值）
        cnt += dfs(root.left, target - root.val);
        cnt += dfs(root.right, target - root.val);

        return cnt;
    }
}

```
