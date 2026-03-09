# 70. 最小栈
> 题目链接：https://leetcode.cn/problems/min-stack/

### 解题思路
两个栈去模拟，空间换时间。
### java版本解答
```java
class MinStack {
    Stack<Integer>nums;
    Stack<Integer>min;
    public MinStack() {
        nums = new Stack<>();
        min = new Stack<>();
    }
    
    public void push(int val) {
        nums.push(val);
        if(!min.isEmpty() && val > min.peek())min.add(min.peek());
        else min.add(val);
    }
    
    public void pop() {
        nums.pop();
        min.pop();
    }
    
    public int top() {
        return nums.peek();
    }
    
    public int getMin() {
        return min.peek();
    }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack obj = new MinStack();
 * obj.push(val);
 * obj.pop();
 * int param_3 = obj.top();
 * int param_4 = obj.getMin();
 */
```
