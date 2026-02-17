# 44. 二叉搜索树中第 K 小的元素
> 题目链接：https://leetcode.cn/problems/kth-smallest-element-in-a-bst/

### 解题思路
利用 BST 中序遍历是升序序列的性质，遍历时递减 k，减到 0 的节点就是第 k 小元素。

### java版本解答
```java
class Solution {
    int res = 0,k;
    public int kthSmallest(TreeNode root, int k) {
        this.k = k;
        dfs(root);
        return res;
    }
    void dfs(TreeNode root){
        if(root == null)return;
        dfs(root.left);
        k--;
        if(k == 0)res = root.val;
        dfs(root.right);
    }

}
```
