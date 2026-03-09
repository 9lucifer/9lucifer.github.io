# 69. 有效的括号
> 题目链接：https://leetcode.cn/problems/valid-parentheses/

### 解题思路
最简单的栈题目，不多说了。
### java版本解答
```java
class Solution {
    public boolean isValid(String s) {
        Stack<Character>st = new Stack<>();
        Map<Character,Character>map = new HashMap<>();
        map.put('(', ')');
        map.put('{', '}');
        map.put('[', ']');
        for(char c : s.toCharArray()){
            if(c == '(' || c == '{' || c == '[')st.add(c);
            else{
                if(st.isEmpty() || map.get(st.pop()) != c)return false;
            }
        }

        return st.isEmpty();
    }
}
```
