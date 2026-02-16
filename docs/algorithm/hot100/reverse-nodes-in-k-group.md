# 31. K 个一组翻转链表
> 题目链接：https://leetcode.cn/problems/reverse-nodes-in-k-group/

### 解题思路
每次翻转前 k 个节点并递归处理后续链表，不足 k 个保持原样。

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
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode tail = head;
        for(int i = 0;i < k;i++){
            //这一行要写前面
            if(tail == null)return head;
            tail = tail.next;
        }
        ListNode newNode = reverse(head, tail);
        head.next = reverseKGroup(tail, k);
        return newNode;
    }


    public ListNode reverse(ListNode head,ListNode tail){
        ListNode cur = head,pre = null;
        while(cur != tail){
            ListNode nxt = cur.next;
            cur.next = pre;
            pre = cur;
            cur = nxt;
        }
        return pre;
    }
}
```
