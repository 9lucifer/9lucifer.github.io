# 75. 前 K 个高频元素
> 题目链接：https://leetcode.cn/problems/top-k-frequent-elements/

### 解题思路
题目不难，但是这个api需要掌握。

`V merge(K key, V value, BiFunction<V, V, V> remappingFunction)`

含义： 如果 key 不存在 → 直接放入 value
如果 key 存在 → 用 remappingFunction(oldValue, value) 计算新值

### java版本解答
```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        HashMap<Integer,Integer>map = new HashMap<>();
        int [] res = new int[k];
        PriorityQueue<int[]>pq = new PriorityQueue<>(
            (a,b)->(b[1] - a[1])
        );
        for(int i : nums)map.merge(i,1,Integer::sum);
        for(int key : map.keySet()){
            pq.add(new int[]{key,map.get(key)});
        }
        for(int i = 0;i < k;i++){
            res[i] = pq.poll()[0];
        }
        return res;
    }
}
```
