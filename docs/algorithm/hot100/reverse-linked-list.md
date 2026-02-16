# 23. 反转链表
> 题目链接：https://leetcode.cn/problems/reverse-linked-list

### 解题思路
记不住的话还是别干计算机了～

### java版本解答
```java
class Solution {
    public ListNode reverseList(ListNode head) {
        if(head == null || head.next == null)return head;
        ListNode newNode = reverseList(head.next);
        head.next.next = head;
        head.next = null;
        return newNode;
    }
}
```
