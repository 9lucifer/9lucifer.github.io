# 93. 最长回文子串
> 题目链接：https://leetcode.cn/problems/longest-palindromic-substring/

### 解题思路
很巧妙的做法：把每个字符以及每对字符之间都当作“回文中心”，向两侧同时扩散寻找回文长度（中心扩展法），在所有 2n-1 个中心中维护最长区间，最终得到最长回文子串。

> 需要巩固


### java版本解答
```java
class Solution {
    public String longestPalindrome(String s) {
        char[] cs = s.toCharArray();
        int n = s.length();

        // 记录当前找到的最长回文子串区间 [asLeft, asRight)
        int asLeft = 0;
        int asRight = 0;

        // 一共有 2*n-1 个“回文中心”
        // 奇数回文:   a b a   中心在字符上
        // 偶数回文:   a b b a 中心在字符间
        for (int i = 0; i < 2 * n - 1; i++) {

            // 左右指针初始化
            // i/2 和 (i+1)/2 可以同时覆盖奇数与偶数中心
            int l = i / 2;
            int r = (i + 1) / 2;

            // 从中心向两边扩散
            while (l >= 0 && r < n && cs[l] == cs[r]) {
                l--;
                r++;
            }

            // 当前回文长度 = r - l - 1
            // 如果比历史最长更长，则更新答案
            if (r - l - 1 > asRight - asLeft) {
                asLeft = l + 1;
                asRight = r;
            }
        }

        // substring 左闭右开
        return s.substring(asLeft, asRight);
    }
}

```
