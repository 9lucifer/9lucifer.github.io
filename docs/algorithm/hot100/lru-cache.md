# 35. LRU 缓存
<PageViewCount />

> 题目链接：https://leetcode.cn/problems/lru-cache/

### 解题思路
经典双向链表题，但是我用LinkedHashMap😋

### java版本解答
```java
class LRUCache {
    LinkedHashMap<Integer,Integer>map;
    int cap;

    public LRUCache(int capacity) {
        // 初始化容量与哈希表
        map = new LinkedHashMap<>();
        this.cap = capacity;
    }
    
    public int get(int key) {
        // 查询并将该 key 变为最近使用
        if(map.containsKey(key)){
            mkRec(key);
            return map.get(key);
        }
        return -1;
    }
    
    public void put(int key, int value) {
        // 插入/更新元素，必要时淘汰最久未使用
        if(map.containsKey(key)){
            mkRec(key);
            map.put(key, value);
            return;
        }
        if(map.size() >= cap){
            int last = map.keySet().iterator().next();
            map.remove(last);
        }
        map.put(key, value);
    }

    void mkRec(int key){
        // 将元素移动到链表尾部表示最近使用
        int val = map.get(key);
        map.remove(key);
        map.put(key, val);
    }
}

```
