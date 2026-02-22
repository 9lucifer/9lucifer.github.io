# 54. 实现 Trie (前缀树)
> 题目链接：https://leetcode.cn/problems/implement-trie-prefix-tree/

### 解题思路
通过树形结构按字符逐层存储单词，利用数组 son[26] 表示当前节点的 26 个字母子节点。插入单词时，从根节点开始逐字符向下建立路径，如果某个字符对应的子节点不存在就新建节点，最后将单词末尾节点标记为 end = true，表示这是一个完整单词；查找单词时，同样按字符逐层遍历，如果中途路径不存在则返回 false，遍历结束后只有当当前节点被标记为 end 才说明该字符串是完整单词；前缀查询 startsWith 则只需判断路径是否存在，不要求必须是完整单词，因此只要能成功遍历整个前缀路径即可返回 true。
### java版本解答
```java
class Trie {
    private static class Node{
        Node[] son = new Node[26];
        boolean end = false;
    }
    private final Node root = new Node();

    public Trie() {

    }
    
    public void insert(String word) {
        Node cur = root;
        for(char c : word.toCharArray()){
            int idx = c - 'a';
            if(cur.son[idx] == null){
                cur.son[idx] = new Node();
            }
            cur = cur.son[idx];
        }
        cur.end = true;
    }
    
    public boolean search(String word) {
        Node cur = root;
        for(char c : word.toCharArray()){
            int idx = c - 'a';
            if(cur.son[idx] == null){
                return false;
            }
            cur = cur.son[idx];
        }
        return cur.end == true;
    }
    
    public boolean startsWith(String prefix) {
        Node cur = root;
        for(char c : prefix.toCharArray()){
            int idx = c - 'a';
            if(cur.son[idx] == null){
                return false;
            }
            cur = cur.son[idx];
        }
        return true;
    }
}

/**
 * Your Trie object will be instantiated and called as such:
 * Trie obj = new Trie();
 * obj.insert(word);
 * boolean param_2 = obj.search(word);
 * boolean param_3 = obj.startsWith(prefix);
 */
```
