# 76. 数据流的中位数
> 题目链接：https://leetcode.cn/problems/find-median-from-data-stream/

### 解题思路
用**两个堆维护数据流的左右两半**：小顶堆 `small` 存较大一半，大顶堆 `large` 存较小一半，每次插入先放入 `small` 再平衡到 `large`，保证 `small` 的元素个数始终 ≥ `large`，这样中位数要么是 `small` 堆顶（奇数个），要么是两个堆顶的平均值（偶数个）。

### java版本解答
```java
class MedianFinder {
    PriorityQueue<Integer> small;
    PriorityQueue<Integer> large;
    public MedianFinder() {
        small = new PriorityQueue<>();
        large = new PriorityQueue<>(
            (a,b)->b-a
        );
    }
    
    public void addNum(int num) {
        small.add(num);
        large.add(small.poll());
        if(small.size() < large.size())small.add(large.poll());
    }
    
    public double findMedian() {
        if(small.size() > large.size())return small.peek();
        return (small.peek() + large.peek())/2.0;
    }
}

/**
 * Your MedianFinder object will be instantiated and called as such:
 * MedianFinder obj = new MedianFinder();
 * obj.addNum(num);
 * double param_2 = obj.findMedian();
 */
```
