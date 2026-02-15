# 12. 最小覆盖子串
> 题目链接：https://leetcode.cn/problems/minimum-window-substring

### 解题思路
右边界 r 就像是在疯狂进货，不管有用的没用的全往兜里揣，直到把 t 要求的那些“债”全还清。等手里东西齐了（债务归零），左边界 l 就开始极致压缩，心狠手辣地把那些不沾边的、或者拿多了的物资全扔掉，直到缩到一个字节都不能再减的程度。就在这种“右边疯狂扩张、左边拼命精简”的动态拉扯中，我们顺手记下那个最短的瞬间。

### java版本解答
```java
class Solution {
    public String minWindow(String s, String t) {
        // need 数组记录 t 中每个字符出现的次数（即“欠债清单”）
        // 使用 128 是为了覆盖所有 ASCII 字符
        int[] need = new int[128];
        // cnt 记录当前还欠 t 多少个【刚需】字符
        int cnt = t.length();
        
        // 初始化账本：统计 t 中各字符的数量
        for (char c : t.toCharArray()) {
            need[c]++;
        }
        
        int l = 0, minLen = Integer.MAX_VALUE, start = 0;
        char[] cs = s.toCharArray();
        
        // r 是右边界，负责向右寻找“物资”来还债
        for (int r = 0; r < cs.length; r++) {
            // 1. 【进窗口/还债】
            // 如果当前字符在 need 中 > 0，说明它是 t 需要的刚需字符，cnt 减 1
            // 无论是不是刚需，need[cs[r]] 都要减 1（多拿的会变成负数）
            if (need[cs[r]]-- > 0) {
                cnt--;
            }
            
            // 2. 【满足条件：开始收缩左边界】
            // 当 cnt == 0 时，说明当前窗口 [l, r] 已经包含了 t 的所有字符
            while (cnt == 0) {
                // 3. 【更新最优解】
                // 如果当前窗口比之前记录的更短，记录起始位置和长度
                if (r - l + 1 < minLen) {
                    minLen = r - l + 1;
                    start = l;
                }
                
                // 4. 【出窗口/尝试断舍离】
                // 左边界 l 准备向右移动，相当于把 cs[l] 这个字符从窗口中踢出去，还给银行
                // 如果归还后，need[cs[l]] 变成了正数 (> 0)，
                // 说明刚才踢走的是一个“保底”的刚需字符，现在又欠债了
                if (++need[cs[l]] > 0) {
                    cnt++; // 重新欠债，退出 while 循环，让 r 继续去找物资
                }
                l++; // 左边界右移
            }
        }
        
        // 如果 minLen 没变过，说明没找到符合条件的子串
        return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
    }
}
```
