# 61. 分割回文串
> 题目链接：https://leetcode.cn/problems/palindrome-partitioning/

### 解题思路
回溯这种题目就是要敢想。
### java版本解答
```java
class Solution {
    List<List<String>> res = new ArrayList<>();
    public List<List<String>> partition(String s) {
        List<String> path = new ArrayList<>();
        backTrack(s, path,0);
        return res;
    }

    void backTrack(String s,List<String> path,int start){
        if(start == s.length()){
            res.add(new ArrayList<>(path));
            return;
        }
        for(int i = start;i < s.length();i++){
            if(!isP(s, start, i))continue;
            path.add(s.substring(start, i+1));
            backTrack(s, path, i+1);
            path.removeLast();
        }
    }

    boolean isP(String s,int l,int r){
        while(l < r){
            if(s.charAt(l) != s.charAt(r)){
                return false;
            }
            l++;r--;
        }
        return true;
    }
}
```
