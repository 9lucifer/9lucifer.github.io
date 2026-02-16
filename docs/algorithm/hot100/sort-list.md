# 33. 排序链表
> 题目链接：https://leetcode.cn/problems/sort-list/

### 解题思路
链表归并排序：快慢指针断链二分，递归排序后再合并两个有序链表。

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
    public ListNode sortList(ListNode head) {
        // 如果不加，会 无限递归，栈溢出(StackOverflowError)
        if(head == null || head.next == null)return head;
        ListNode middle = middle(head);
        ListNode head1 = sortList(head);
        ListNode head2 = sortList(middle);
        return merge(head1, head2);
    }

    ListNode merge(ListNode l1,ListNode l2){
        ListNode dummy = new ListNode(-1);
        ListNode cur = dummy;
        while(l1 != null && l2 != null){
            if(l1.val < l2.val){
                cur.next = l1;
                l1 = l1.next;
            }else{
                cur.next = l2;
                l2 = l2.next;
            }
            cur = cur.next;
        }
        if(l1 != null)cur.next = l1;
        if(l2 != null)cur.next = l2;
        return dummy.next;
    }

    ListNode middle(ListNode head){
        ListNode slow = head,fast = head,pre = head;
        while(fast != null && fast.next != null){
            pre = slow;
            slow = slow.next;
            fast = fast.next.next;
        }
        pre.next = null;
        return slow;
    }
}
```
