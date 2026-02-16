# 29. 删除链表的倒数第 N 个结点
> 题目链接：https://leetcode.cn/problems/remove-nth-node-from-end-of-list/

### 解题思路
快指针先走 n+1 步形成间距，再同步前进，慢指针指向的就是待删除节点的前一个位置。
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
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(-1);
        dummy.next = head;
        ListNode slow = dummy,fast = dummy;
        // 先走n+1步
        for(int i = 0;i <= n;i++){
            fast = fast.next;
        }
        while(fast != null){
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return dummy.next;
    }
}
```
