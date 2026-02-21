# 53. 课程表
> 题目链接：https://leetcode.cn/problems/course-schedule/

### 解题思路
用拓扑排序检测有向图是否有环。

### java版本解答
```java
class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {

        // 构建邻接表：图结构
        // graph[i] 表示 学完 i 之后 可以解锁哪些课程
        List<List<Integer>> graph = new ArrayList<>();

        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }
        // indegree[i] 表示有多少门课必须先修完才能学 i
        int[] indegree = new int[numCourses];

        // prerequisites[i] = [course, pre]
        // 表示：学 course 之前必须先学 pre
        for (int[] p : prerequisites) {
            int course = p[0];
            int pre = p[1];

            // 建立边：pre -> course
            graph.get(pre).add(course);

            // course 入度 +1
            indegree[course]++;
        }
        Queue<Integer> queue = new LinkedList<>();

        // 把所有入度为 0 的课程加入队列
        // 这些课程不依赖任何课程，可以直接学习
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                queue.add(i);
            }
        }

        // 记录已经完成的课程数量
        int finishCnt = 0;
        while (!queue.isEmpty()) {

            // 取出一个可以学习的课程
            int cur = queue.poll();
            finishCnt++;

            // 遍历它能解锁的后续课程
            for (int nxt : graph.get(cur)) {

                // 删除一条依赖边（入度减 1）
                indegree[nxt]--;

                // 如果入度变成 0，说明它也可以学习了
                if (indegree[nxt] == 0) {
                    queue.add(nxt);
                }
            }
        }

        // 如果能完成所有课程，说明无环
        return finishCnt == numCourses;
    }
}

```
