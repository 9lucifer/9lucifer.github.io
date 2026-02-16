# 26. 环形链表 II
> 题目链接：https://leetcode.cn/problems/linked-list-cycle-ii

### 解题思路
第一次相遇判环，第二次相遇定位环入口。
### java版本解答
```java
public class Solution {
    public ListNode detectCycle(ListNode head) {

        // 快慢指针判断是否有环
        ListNode slow = head,fast = head;
        while(fast != null && fast.next != null){
            slow = slow.next;        // 慢指针走一步
            fast = fast.next.next;   // 快指针走两步
            if(slow == fast)break;   // 相遇说明有环
        }

        // 如果 fast 走到 null，说明无环
        if(fast == null || fast.next == null)return null;

        // 找环入口：slow 回到头结点，两指针同步走
        slow = head;
        while(slow != fast){
            slow = slow.next;
            fast = fast.next;
        }

        // 相遇点即为环的起点
        return slow;
    }
}

```
