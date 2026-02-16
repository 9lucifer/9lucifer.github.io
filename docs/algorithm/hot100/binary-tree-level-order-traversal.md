# 41. 二叉树的层序遍历
> 题目链接：https://leetcode.cn/problems/binary-tree-level-order-traversal/

### 解题思路
使用队列按层遍历二叉树，每层节点依次加入结果列表实现层序遍历。
### java版本解答
```java
class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        Deque<TreeNode>queue = new ArrayDeque<>();
        if(root != null)queue.add(root);
        while(!queue.isEmpty()){
            int size = queue.size();
            List<Integer>tmp = new ArrayList<>();
            for(int i = 0;i < size;i++){
                TreeNode cur = queue.pollLast();
                tmp.add(cur.val);
                if(cur.left != null)queue.addFirst(cur.left);
                if(cur.right != null)queue.addFirst(cur.right);
            }
            res.add(tmp);
        }
        return res;
    }
}
```
