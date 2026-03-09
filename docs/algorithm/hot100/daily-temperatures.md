# 72. 每日温度
> 题目链接：https://leetcode.cn/problems/daily-temperatures/

### 解题思路
从右往左遍历数组，用单调栈维护“右边比当前温度高的下标”。如果当前温度比栈顶对应温度高或相等，就把栈顶弹出，因为它不可能成为当前或更左边位置的答案；弹完后栈顶就是最近的更高温度位置，两者下标差就是等待天数，然后把当前下标入栈。
### java版本解答
```java
class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[]res = new int[n];
        Deque<Integer>st = new ArrayDeque<>();
        for(int i = n - 1;i >= 0;i--){
            while(!st.isEmpty() && temperatures[i] >= temperatures[st.peek()])st.pop();
            if(!st.isEmpty())res[i] = st.peek() - i;
            st.push(i);
        }
        return res;
    }
}
```
