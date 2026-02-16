# 28. 两数相加
> 题目链接：https://leetcode.cn/problems/add-two-numbers/

### 解题思路
按位相加并维护进位，用虚拟头节点顺序构造结果链表。
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
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(-1);
        ListNode cur = dummy;
        int nxt = 0;
        while(l1 != null || l2 != null){
            int num1 = l1 == null ? 0 : l1.val;
            int num2 = l2 == null ? 0 : l2.val;
            int val = (num1 + num2 + nxt) % 10;
            nxt = (num1 + num2 + nxt) / 10;
            ListNode newnode = new ListNode(val);
            cur.next = newnode;
            cur = cur.next;
            if(l1 != null)l1 = l1.next;
            if(l2 != null)l2 = l2.next;
        }
        if(nxt != 0)cur.next = new ListNode(nxt);
        return dummy.next;
    }
}
```
