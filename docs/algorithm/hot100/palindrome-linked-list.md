# 24. 回文链表
> 题目链接：https://leetcode.cn/problems/palindrome-linked-list

### 解题思路
**先用快慢指针找到链表中点，再反转后半部分，与前半部分逐节点比较判断回文。**
> 如果链表长度是奇数，快慢指针找到的中点 mid 就是正中间那个节点。对比时，奇数中点值会同时出现在前半或后半，但逻辑仍然正确，不影响判断回文。

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
    public boolean isPalindrome(ListNode head) {
        ListNode mid = middleNode(head);
        ListNode head2 = revsese(mid);
        while(head2 != null){
            if(head.val != head2.val)return false;
            head = head.next;
            head2 = head2.next;
        }
        return true;
    }

    private ListNode middleNode(ListNode head){
        ListNode slow = head,fast = head;
        while(fast != null && fast.next != null){
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }

    private ListNode revsese(ListNode head){
        ListNode pre = null;
        ListNode cur = head;
        while(cur != null){
            ListNode nxt = cur.next;
            cur.next = pre;
            pre = cur;
            cur = nxt;
        }
        return pre;
    }


}
```
