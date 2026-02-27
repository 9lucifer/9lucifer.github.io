# 57. 电话号码的字母组合
> 题目链接：https://leetcode.cn/problems/letter-combinations-of-a-phone-number/

### 解题思路
本题本质是“多叉树的层序选择问题”，每一层代表一个数字，每个节点分支为该数字对应的所有字母，通过回溯构造所有路径。
### java版本解答
```java
class Solution {
    List<String> res = new ArrayList<>();
    HashMap<Character,String> map = new HashMap<>();
    public List<String> letterCombinations(String digits) {
        StringBuilder path = new StringBuilder();
        map.put('2', "abc");
        map.put('3', "def");
        map.put('4', "ghi");
        map.put('5', "jkl");
        map.put('6', "mno");
        map.put('7', "pqrs");
        map.put('8', "tuv");
        map.put('9', "wxyz");
        backTrack(digits, 0, path);
        return res;
    }

    void backTrack(String digits,int start,StringBuilder path){
        if(path.length() == digits.length()){
            res.add(new String(path));
            return;
        }
        for(int i = start;i < digits.length();i++){
            String items = map.get(digits.charAt(i));
            for(char c : items.toCharArray()){
                path.append(c);
                backTrack(digits, i+1, path);
                path.deleteCharAt(path.length()-1);
            }
        }
    }
}
```
