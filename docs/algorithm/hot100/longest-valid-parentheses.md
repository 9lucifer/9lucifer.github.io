# 90. 最长有效括号
> 题目链接：https://leetcode.cn/problems/longest-valid-parentheses/

### 解题思路
通过双向扫描统计左右括号数量：从左向右扫描解决 ")" 过多的情况，从右向左扫描解决 "(" 过多的情况，当左右括号数量相等时更新最大长度，从而在 O(n) 时间、O(1) 空间内求出最长有效括号长度。

### java版本解答
```java
class Solution {
    public int longestValidParentheses(String s) {
        int l = 0, r = 0, res = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') l++;
            else r++;
            if (l == r) res = Math.max(2 * l, res);
            if(r > l)l = r = 0;
        }
        l = r = 0;
        for (int i = s.length() -1;i >= 0;i--) {
            if (s.charAt(i) == '(') l++;
            else r++;
            if (l == r) res = Math.max(2 * l, res);
            if(r < l)l = r = 0;
        }
        return res;
    }
}
```
