# 14. 合并区间
> 题目链接：https://leetcode.cn/problems/merge-intervals

### 解题思路
先按照子数组的第一位进行排序，再用linkedList装当前已经确定的子数组。

> `list.toArray`用法
```java
List<String> list = List.of("A", "B", "C"); 
String[] arr = list.toArray(new String[0]);
```
为什么要传 new String[0]?
如果数组长度不够,创建新数组,类型安全,性能好（JDK9+ 已优化）

### java版本解答
```java
class Solution {
    public int[][] merge(int[][] intervals) {
        LinkedList<int[]> list = new LinkedList<>();
        Arrays.sort(intervals,(a,b)->a[0]-b[0]);
        list.add(intervals[0]);
        for(int [] cur : intervals){
            int [] last = list.getLast();
            if(last[1] >= cur[0]){
                last[1] = Math.max(last[1],cur[1]);
            }else{
                list.add(cur);
            }
        }
        return list.toArray(new int[0][0]);
    }
}
```
