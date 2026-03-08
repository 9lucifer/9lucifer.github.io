# 68. 寻找两个正序数组的中位数
> 题目链接：https://leetcode.cn/problems/median-of-two-sorted-arrays/

### 解题思路
本题要求在两个有序数组中找到整体的中位数，如果直接合并两个数组再取中位数，时间复杂度为 `O(m+n)`，不满足题目要求的 `O(log(m+n))`。因此需要利用两个数组本身已经有序的性质，通过二分查找的方法寻找合适的划分位置。

核心思想是：将两个数组分别划分为左右两部分，使得左半部分的所有元素都小于等于右半部分的所有元素，并且左半部分的元素数量等于右半部分（或多一个）。如果能够找到这样的划分位置，那么中位数就可以直接从边界元素中计算得到。

具体做法是：假设在 nums1 中选择位置 i 作为分割点，则 nums1 被分为 [0,i-1] 和 [i,n-1] 两部分。同时在 nums2 中选择位置 j 作为分割点，使得左右两部分元素总数满足：`i+j=(m+n+1)/2`。
	​


这样可以保证左半部分元素数量始终等于右半部分（或多一个，用于奇数情况）。由于 i 决定后 j 就唯一确定，因此只需要在 nums1 中进行二分查找即可。

为了判断当前划分是否正确，需要比较四个边界元素：

al = nums1[i-1]：nums1 左半部分最大值

ar = nums1[i]：nums1 右半部分最小值

bl = nums2[j-1]：nums2 左半部分最大值

br = nums2[j]：nums2 右半部分最小值

如果满足`al≤br且bl≤ar`说明当前划分满足条件，即左半部分所有元素都小于右半部分元素，此时就找到了正确的划分。

接下来根据数组总长度的奇偶性计算中位数：

如果总长度为奇数，中位数就是左半部分最大值，即 max(al, bl)；

如果总长度为偶数，中位数就是左半部分最大值和右半部分最小值的平均值，即`(max(al,bl)+min(ar,br))/2`。

如果当前划分不满足条件，则需要调整二分范围：

如果 al > br，说明 nums1 左侧元素过大，需要向左移动分割点，因此令 r = i - 1；

如果 bl > ar，说明 nums1 左侧元素过小，需要向右移动分割点，因此令 l = i + 1。

为了保证二分查找的效率，通常要求在较短的数组上进行二分，因此在算法开始时，如果 nums1 长度大于 nums2，就交换两个数组。

通过这种方式，可以在对数时间复杂度内找到正确的划分位置，从而计算出两个有序数组的中位数。
### java版本解答
```java
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if(nums1.length > nums2.length)return findMedianSortedArrays(nums2, nums1);
        int n = nums1.length;
        int m = nums2.length;
        int l = 0,r = n;
        while(l <= r){
            int i = (l + r)/2;
            int j = (m + n + 1)/2 - i;
            int al = (i == 0) ? Integer.MIN_VALUE : nums1[i-1];
            int ar = (i == n) ? Integer.MAX_VALUE : nums1[i];
            int bl = (j == 0) ? Integer.MIN_VALUE : nums2[j-1];
            int br = (j == m) ? Integer.MAX_VALUE : nums2[j];
            if(al <= br && bl <= ar){
                if((m + n)%2 == 0)return (Math.max(al,bl)+Math.min(ar, br))/2.0;
                else return Math.max(al,bl);
            }else if(al > br){
                r = i - 1;
            }else{
                l = i + 1;
            }
        }
        return 0;
    }
}
```
