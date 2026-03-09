# 71. 字符串解码
> 题目链接：https://leetcode.cn/problems/decode-string/

### 解题思路
可以按 **每个分支一句话解释**这样记，说起来也很清晰：

```java
if(Character.isDigit(c))
```

**遇到数字时：** 构造当前的重复次数 `curNum`（支持多位数字）。

```java
else if(c == '[')
```

**遇到左括号时：** 将当前重复次数和当前字符串入栈，并开始构建新的子字符串。

```java
else if(c == ']')
```

**遇到右括号时：** 弹出栈中的重复次数和之前的字符串，将当前字符串重复拼接后再接回去。

```java
else
```

**遇到普通字符时：** 直接追加到当前正在构造的字符串 `curStr` 中。

---


> 使用两个栈分别保存重复次数和上一层字符串，遇到 `[` 进入新层级，遇到 `]` 将当前字符串按次数展开并拼接回上一层，从而实现嵌套解码。



### java版本解答
```java
class Solution {
    public String decodeString(String s) {
        Deque<Integer>numSt = new ArrayDeque<>();
        Deque<StringBuilder>strSt = new ArrayDeque<>();
        StringBuilder curStr = new StringBuilder();
        int curNum = 0;
        for(char c : s.toCharArray()){
            if(Character.isDigit(c)){
                curNum = curNum * 10 + (c - '0');
            }else if(c == '['){
                numSt.push(curNum);
                strSt.push(curStr);
                curNum = 0;
                curStr = new StringBuilder();
            }else if(c == ']'){
                int repeat = numSt.pop();
                String preStr = strSt.pop().toString();
                curStr = new StringBuilder(preStr).append(curStr.toString().repeat(repeat));
            }else{
                curStr.append(c);
            }
        }
        return curStr.toString();
    }
}
```
