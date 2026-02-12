# 2. 字母异位词分组
> 题目链接：https://leetcode.cn/problems/group-anagrams

### 解题思路
将每个字符串转为字符数组并排序，排序结果作为分组 key，使用 HashMap 将相同 key 的字符串聚合在一起。

### java版本解答
```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // key-满足key要求的str列表
        HashMap<String,List<String>> map = new HashMap<>();
        for(String str : strs){
            char [] arr = str.toCharArray();
            // 排序之后的结果作为key
            Arrays.sort(arr);
            String key = new String(arr);
            // 等同于map.computeIfAbsent(key, k -> new ArrayList<>()).add(str);
            List<String>tmp = map.getOrDefault(key, new ArrayList<>());
            tmp.add(str);
            map.put(key,tmp);
        }
        return new ArrayList<>(map.values());
    }
}
```