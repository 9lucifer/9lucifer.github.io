# 34. 合并 K 个升序链表
> 题目链接：https://leetcode.cn/problems/merge-k-sorted-lists/

### 解题思路
用小根堆，没什么好说的，但是得看下堆的实现。

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
    public ListNode mergeKLists(ListNode[] lists) {
        ListNode dummy = new ListNode(-1);
        ListNode cur = dummy;
        PriorityQueue<ListNode>pq = new PriorityQueue<>(
            (a,b)->(a.val - b.val)
        );
        for(ListNode item : lists){
            if (item != null)
            pq.add(item);
        }
        while(!pq.isEmpty()){
            ListNode tmp = pq.poll();
            cur.next = tmp;
            if(tmp.next != null)pq.add(tmp.next);
            tmp.next = null;
            cur = cur.next;
        }

        return dummy.next;
    }
}
```
