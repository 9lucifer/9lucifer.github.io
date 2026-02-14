# 8. 无重复字符最长子串
> 题目链接：https://leetcode.cn/problems/longest-substring-without-repeating-characters

### 解题思路
使用滑动窗口维护一个区间，当当前元素在窗口中的出现次数大于 1 时，移动左指针收缩窗口，直到该元素在窗口中只出现一次为止。

### java版本解答
```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        int res = 0,l = 0;
        int[]cnt = new int[200];
        for(int r = 0;r < s.length();r++){
            int idx = s.charAt(r) - ' ';
            cnt[idx]++;
            while(cnt[idx] > 1){
                cnt[s.charAt(l)-' ']--;
                l++;
            }
            res = Math.max(res,r - l + 1);
        }
        return res;
    }
}
```
