# 80. 划分字母区间
> 题目链接：https://leetcode.cn/problems/partition-labels/

### 解题思路
贪心思想：遍历字符串并维护当前区间的最远右边界，当遍历位置等于右边界时说明该区间内的字符不会再出现，可以进行一次切割。

时间复杂度：O(n)

空间复杂度：O(1)（最多26个字母）
### java版本解答
```java
class Solution {
    public List<Integer> partitionLabels(String s) {

        // 存储每个字符最后一次出现的位置
        HashMap<Character,Integer> map = new HashMap<>();

        // 记录最终每个分段的长度
        List<Integer> res = new ArrayList<>();

        // 当前分段的起始位置
        int start = 0;

        // 当前分段能够到达的最远右边界
        int end = 0;

        // 第一步：预处理每个字符最后出现的位置
        for(int i = 0; i < s.length(); i++){
            map.put(s.charAt(i), i);
        }

        // 第二步：遍历字符串，动态更新区间右边界
        for(int i = 0; i < s.length(); i++){

            // 更新当前区间的最远右边界
            // 因为当前字符未来可能还会出现，所以区间必须延长到它最后出现的位置
            end = Math.max(end, map.get(s.charAt(i)));

            // 当遍历到区间最远右边界时，说明该区间内所有字符都不会再出现
            if(i == end){

                // 当前区间长度
                res.add(end - start + 1);

                // 开启下一个新区间
                start = i + 1;
                end = i + 1;
            }
        }

        return res;
    }
}
```
