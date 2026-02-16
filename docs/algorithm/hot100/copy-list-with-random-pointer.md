# 32. 随机链表的复制
> 题目链接：https://leetcode.cn/problems/copy-list-with-random-pointer/

### 解题思路
对于数据结构复制，甭管他怎么变，你就记住最简单的方式：一个哈希表 + 两次遍历。

### java版本解答
```java
/*
// Definition for a Node.
class Node {
    int val;
    Node next;
    Node random;

    public Node(int val) {
        this.val = val;
        this.next = null;
        this.random = null;
    }
}
*/

class Solution {
    public Node copyRandomList(Node head) {
        HashMap<Node,Node>originToNew = new HashMap<>();
        Node cur = head;
        while(cur != null){
            originToNew.put(cur, new Node(cur.val));
            cur = cur.next;
        }
        cur = head;
        while(cur != null){
            if(cur.next != null){
                originToNew.get(cur).next = originToNew.get(cur.next);
            }
            if(cur.random != null){
                originToNew.get(cur).random = originToNew.get(cur.random);
            }
            cur = cur.next;
        }
        return originToNew.get(head);
    }
}
```
