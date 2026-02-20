# 74. 数组中的第K个最大元素
> 题目链接：https://leetcode.cn/problems/kth-largest-element-in-an-array/

### 解题思路
堆的入门题，注意构建大顶堆。
### java版本解答
```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(
            (a,b)->b-a
        );
        for(int i : nums)pq.add(i);
        for(int i = 1;i <= k - 1;i++)pq.poll();
        return pq.poll();
    }
}
```
