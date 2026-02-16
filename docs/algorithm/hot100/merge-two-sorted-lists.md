# 27. 合并两个有序链表
> 题目链接：https://leetcode.cn/problems/merge-two-sorted-lists/

### 解题思路
链表也有自己的两数之和思密达。

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
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(-1);
        ListNode cur = dummy;
        while(list1 != null && list2 != null){
            if(list1.val > list2.val){
                cur.next = list2;
                list2 = list2.next;
            }else{
                cur.next = list1;
                list1 = list1.next;
            }
            cur = cur.next;
        }
        if(list1 != null)cur.next = list1;
        if(list2 != null)cur.next = list2;
        return dummy.next;
    }
}
```
