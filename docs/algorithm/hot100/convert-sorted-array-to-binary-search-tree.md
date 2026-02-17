# 42. 将有序数组转换为二叉搜索树
> 题目链接：https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/

### 解题思路
递归选择中间元素作为根节点，左右子数组分别构建左右子树，实现有序数组转平衡二叉搜索树。
> 需要再巩固
### java版本解答
```java
class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return dfs(nums,0,nums.length-1);
    }
    TreeNode dfs(int[]nums,int l,int r){
        if(l > r)return null;
        int mid = (l + r)/2;
        TreeNode root = new TreeNode(nums[mid]);
        root.left = dfs(nums, l, mid - 1);
        root.right = dfs(nums, mid + 1, r);
        return root;
    }
}
```
