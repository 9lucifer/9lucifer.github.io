# 9. 找到字符串中所有字母异位词
> 题目链接：https://leetcode.cn/problems/find-all-anagrams-in-a-string

### 解题思路
> 初见不会

通过“存入存款”与“支取透支”的平衡来锁定异位词。 先将 $p$ 的字符作为“存款”存入计数数组，随后滑动窗口每遇到一个字符就“支取”一次；一旦支取导致余额变为负数（意味着该字符在当前窗口内过量或根本不该出现），就不断移动左边界归还字符以平账。由于整个过程中始终保证了“无字符超支”，因此只要窗口长度等于 $p$ 的长度，该窗口就必然是 $p$ 的异位词。

### java版本解答
```java
class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> res = new ArrayList<>();
        // p的每个字母的出现次数
        int [] cnt = new int[26];
        for(char c : p.toCharArray())cnt[c - 'a']++;
        int l = 0;
        for(int r = 0;r < s.length();r++){
            cnt[s.charAt(r) - 'a']--; //右边进窗口
            while(cnt[s.charAt(r) - 'a'] < 0){ // 字母c太多了
                cnt[s.charAt(l) - 'a']++;
                l++;
            }
            // 到这边能保证p里面没有非法的字母
            if(r - l + 1 == p.length())res.add(l);
        }
        return res;
    }
}
```
