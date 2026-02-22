# 86. 单词拆分
> 题目链接：https://leetcode.cn/problems/word-break/

### 解题思路
这题使用动态规划来判断字符串是否可以被字典中的单词拆分。定义 dp[i] 表示字符串前 i 个字符是否可以成功拆分。初始状态 dp[0] = true，表示空字符串可以被拆分。对于每个位置 i，枚举所有可能的分割点 j，如果前 j 个字符可以拆分（dp[j] = true），并且从 j 到 i 的子串在字典中存在，则说明前 i 个字符可以拆分，将 dp[i] 设为 true。最终返回 dp[s.length()] 即可。
### java版本解答
```java
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {

        // 使用 HashSet 提高查找效率（O(1)）
        // 用于快速判断某个子串是否在字典中
        HashSet<String> set = new HashSet<>(wordDict);

        // dp[i] 表示：
        // 字符串 s 的前 i 个字符（即 s[0:i-1]）是否可以被拆分
        boolean[] dp = new boolean[s.length() + 1];

        // 空字符串默认可以被拆分
        dp[0] = true;

        // 枚举字符串的结束位置 i
        for (int i = 1; i <= s.length(); i++) {

            // 枚举分割点 j
            // 表示前 j 个字符是否可拆
            for (int j = 0; j <= i; j++) {

                // 如果：
                // 1. 前 j 个字符可以拆分
                // 2. s[j:i] 在字典中
                // 那么前 i 个字符也可以拆分
                if (dp[j] && set.contains(s.substring(j, i))) {
                    dp[i] = true;
                }
            }
        }

        // 返回整个字符串是否可以拆分
        return dp[s.length()];
    }
}
```
