# 30. 两两交换链表中的节点
> 题目链接：https://leetcode.cn/problems/swap-nodes-in-pairs/

### 解题思路
递归写法好理解，代码还少😋

### java版本解答
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode swapPairs(ListNode head) {
        // 1 2 3 4
        // 2 1 4 3
        if(head == null || head.next == null)return head;
        ListNode cur = head;
        ListNode nxt = head.next; 
        ListNode nxtnxt = nxt.next; 
        cur.next = swapPairs(nxtnxt);
        nxt.next = cur;
        return nxt;
    }
}
```
