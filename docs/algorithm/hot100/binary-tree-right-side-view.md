# 45. 二叉树的右视图
> 题目链接：https://leetcode.cn/problems/binary-tree-right-side-view/

### 解题思路
二叉树层序遍历的变种。

### java版本解答
```java
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> queue = new ArrayDeque<>();
        if(root!=null)queue.addFirst(root);
        while(!queue.isEmpty()){
            int size = queue.size();
            for(int i = 0;i < size;i++){
                TreeNode tmp = queue.pollLast();
                if(tmp.left != null)queue.addFirst(tmp.left);
                if(tmp.right != null)queue.addFirst(tmp.right);
                if(i == size - 1)res.add(tmp.val);
            }
        }
        return res;
    }
}
```
