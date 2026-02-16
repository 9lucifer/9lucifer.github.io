---
layout: home

hero:
  name: "IsaacE2的记录"
  text: "闲下来写两篇~"
  tagline: 全栈 = 全干 后端 = 后台
  image:
    src: /hero-image.png
    alt: Showcase
  actions:
    - theme: brand
      text: 年度总结
      link: /annual-summary/
    - theme: alt
      text: 个人简历
      link: /resume_v2.pdf

features:
  - title: 我希望
    details: 积累海量的技术沉淀，追求深度的知识洞察，永葆求知若渴的初心
  - title: 我希望
    details: 拥有健康的体魄，保持年轻的心态，活出生命的精彩
  - title: 我希望
    details: 珍惜海枯石烂的爱情，维系温暖和睦的亲情，让爱成为前行的力量
---

<div class="counter-section">
  <div class="counter-grid">
    <div class="counter-card">
      <div class="counter-icon">👥</div>
      <div class="counter-info">
        <span class="counter-value" id="vercount_value_site_uv">...</span>
        <span class="counter-label">访客总数</span>
      </div>
    </div>
    <div class="counter-card">
      <div class="counter-icon">👁️</div>
      <div class="counter-info">
        <span class="counter-value" id="vercount_value_site_pv">...</span>
        <span class="counter-label">总浏览量</span>
      </div>
    </div>
    <div class="counter-card">
      <div class="counter-icon">📄</div>
      <div class="counter-info">
        <span class="counter-value" id="vercount_value_page_pv">...</span>
        <span class="counter-label">本页阅读</span>
      </div>
    </div>
  </div>
</div>

<div class="latest-articles">
  <div class="section-header">
    <h2>📝 最新文章</h2>
    <p class="section-tagline">记录成长的点点滴滴</p>
  </div>
  <div class="articles-grid">
    <a href="/algorithm/hot100/merge-intervals" class="article-card">
      <div class="article-content">
        <span class="article-tag">算法</span>
        <h3>14. 合并区间</h3>
        <p>题目链接：https://leetcode.cn/problems/merge-intervals</p>
      </div>
      <div class="article-footer">查看详情 →</div>
    </a>
    <a href="/algorithm/hot100/maximum-subarray" class="article-card">
      <div class="article-content">
        <span class="article-tag">算法</span>
        <h3>13. 最大子数组和</h3>
        <p>题目链接：https://leetcode.cn/problems/maximum-subarray</p>
      </div>
      <div class="article-footer">查看详情 →</div>
    </a>
    <a href="/java/new-research/java-structured-concurrency" class="article-card">
      <div class="article-content">
        <span class="article-tag">Java</span>
        <h3>结构化并发-虚拟线程</h3>
        <p>传统的 Java 线程是一种**平台线程**：它是一个包含线程运行状态的对象，例如运行时栈、本地存储、指针等，并且与**</p>
      </div>
      <div class="article-footer">查看详情 →</div>
    </a>
    <a href="/algorithm/hot100/minimum-window-substring" class="article-card">
      <div class="article-content">
        <span class="article-tag">算法</span>
        <h3>12. 最小覆盖子串</h3>
        <p>题目链接：https://leetcode.cn/problems/minimum-window-substring</p>
      </div>
      <div class="article-footer">查看详情 →</div>
    </a>
    <a href="/algorithm/hot100/sliding-window-maximum" class="article-card">
      <div class="article-content">
        <span class="article-tag">算法</span>
        <h3>11. 滑动窗口最大值</h3>
        <p>题目链接：https://leetcode.cn/problems/sliding-window-maximum</p>
      </div>
      <div class="article-footer">查看详情 →</div>
    </a>
    <a href="/algorithm/hot100/find-all-anagrams-in-a-string" class="article-card">
      <div class="article-content">
        <span class="article-tag">算法</span>
        <h3>9. 找到字符串中所有字母异位词</h3>
        <p>题目链接：https://leetcode.cn/problems/find-all-anagrams-in-a-str</p>
      </div>
      <div class="article-footer">查看详情 →</div>
    </a>
  </div>
</div>

<style>
:root {
  --card-bg: var(--vp-c-bg-soft);
  --card-border: var(--vp-c-divider);
  --accent-color: var(--vp-c-brand-1);
}

/* --- 访问统计优化 --- */
.counter-section {
  max-width: 1152px;
  margin: 48px auto;
  padding: 0 24px;
}

.counter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.counter-card {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.counter-card:hover {
  border-color: var(--accent-color);
  background: var(--vp-c-bg-mute);
  transform: translateY(-2px);
}

.counter-icon {
  font-size: 28px;
  margin-right: 16px;
  opacity: 0.8;
}

.counter-info {
  display: flex;
  flex-direction: column;
}

.counter-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
}

.counter-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

/* --- 文章区域优化 --- */
.latest-articles {
  max-width: 1152px;
  margin: 80px auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 700;
  border: none;
  margin-bottom: 8px;
}

.section-tagline {
  color: var(--vp-c-text-2);
  font-size: 16px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.article-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none !important;
  transition: all 0.3s ease;
  overflow: hidden;
}

.article-card:hover {
  transform: translateY(-5px);
  border-color: var(--accent-color);
  box-shadow: 0 12px 24px -8px rgba(0,0,0,0.15);
}

.article-content {
  padding: 24px;
}

.article-tag {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent-color);
  background: var(--vp-c-brand-soft);
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 600;
}

.article-card h3 {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.article-card p {
  margin-top: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  /* 限制两行显示 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  padding: 12px 24px;
  font-size: 13px;
  font-weight: 500;
  color: var(--accent-color);
  border-top: 1px solid var(--card-border);
  background: rgba(0,0,0,0.02);
}

/* --- Hero 修正与增强：彻底锁死，不再逃跑 --- */
.VPHero .image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 确保容器不会因为子元素放大而改变大小 */
  overflow: visible; 
}

.VPHero img {
  border-radius: 50%;
  border: 4px solid var(--vp-c-bg);
  box-shadow: var(--vp-shadow-3);
  z-index: 1;
  /* 增加 transform-origin 确保从正中心缩放 */
  transform-origin: center center;
  /* 增加 transition 确保丝滑 */
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

/* 仅在鼠标悬浮时垂直向上微动，而不是向四周跑 */
.VPHero img:hover {
  /* 使用 translateY 配合 scale，只让它稍微“浮起”，不乱跑 */
  transform: scale(1.03) translateY(-5px) !important;
}

/* 光晕背景也锁死在正下方 */
.VPHero .image-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--vp-c-brand-soft) 0%, transparent 70%);
  filter: blur(40px);
  opacity: 0.6;
  pointer-events: none; /* 确保鼠标能穿透光晕点到图片 */
}
</style>