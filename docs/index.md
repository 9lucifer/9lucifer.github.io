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

<div class="latest-articles">
  <div class="section-header">
    <h2>📝 最新文章</h2>
    <p class="section-tagline">记录成长的点点滴滴</p>
  </div>
  <div class="articles-grid">
    <a href="/algorithm/hot100/find-the-duplicate-number" class="article-card">
      <div class="article-content">
        <span class="article-tag">算法</span>
        <h3>100. 寻找重复数</h3>
        <p>题目链接：https://leetcode.cn/problems/find-the-duplicate-number/</p>
      </div>
      <div class="article-footer">查看详情 →</div>
    </a>
    <a href="/algorithm/hot100/next-permutation" class="article-card">
      <div class="article-content">
        <span class="article-tag">算法</span>
        <h3>99. 下一个排列</h3>
        <p>题目链接：https://leetcode.cn/problems/next-permutation/</p>
      </div>
      <div class="article-footer">查看详情 →</div>
    </a>
    <a href="/algorithm/hot100/sort-colors" class="article-card">
      <div class="article-content">
        <span class="article-tag">算法</span>
        <h3>98. 颜色分类</h3>
        <p>题目链接：https://leetcode.cn/problems/sort-colors/</p>
      </div>
      <div class="article-footer">查看详情 →</div>
    </a>
    <a href="/algorithm/hot100/majority-element" class="article-card">
      <div class="article-content">
        <span class="article-tag">算法</span>
        <h3>97. 多数元素</h3>
        <p>题目链接：https://leetcode.cn/problems/majority-element/</p>
      </div>
      <div class="article-footer">查看详情 →</div>
    </a>
    <a href="/algorithm/hot100/single-number" class="article-card">
      <div class="article-content">
        <span class="article-tag">算法</span>
        <h3>96. 只出现一次的数字</h3>
        <p>题目链接：https://leetcode.cn/problems/single-number/</p>
      </div>
      <div class="article-footer">查看详情 →</div>
    </a>
    <a href="/algorithm/hot100/edit-distance" class="article-card">
      <div class="article-content">
        <span class="article-tag">算法</span>
        <h3>95. 编辑距离</h3>
        <p>题目链接：https://leetcode.cn/problems/edit-distance/</p>
      </div>
      <div class="article-footer">查看详情 →</div>
    </a>
  </div>
</div>

<div class="counter-section">
  <div class="counter-grid">
    <div class="counter-card">
      <div class="counter-icon-wrapper">
        <svg class="counter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </div>
      <div class="counter-content">
        <span class="counter-value" id="vercount_value_site_uv">...</span>
        <span class="counter-label">访客总数</span>
      </div>
    </div>
    <div class="counter-card">
      <div class="counter-icon-wrapper">
        <svg class="counter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </div>
      <div class="counter-content">
        <span class="counter-value" id="vercount_value_site_pv">...</span>
        <span class="counter-label">总浏览量</span>
      </div>
    </div>
  </div>
</div>

<style>
:root {
  --card-bg: var(--vp-c-bg-soft);
  --card-border: var(--vp-c-divider);
  --accent-color: var(--vp-c-brand-1);
}

/* --- 现代玻璃态访问统计 --- */
.counter-section {
  max-width: 1152px;
  margin: 48px auto;
  padding: 0 24px;
}

.counter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.counter-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px 32px;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.04) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.counter-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    var(--vp-c-brand-1) 50%,
    transparent);
  opacity: 0.6;
}

.counter-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: var(--vp-c-brand-1);
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(23, 171, 124, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.counter-icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg,
    var(--vp-c-brand-1) 0%,
    var(--vp-c-brand-2) 100%);
  box-shadow:
    0 4px 16px rgba(23, 171, 124, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.counter-card:hover .counter-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
  box-shadow:
    0 8px 24px rgba(23, 171, 124, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.counter-icon {
  width: 20px;
  height: 20px;
  color: white;
  stroke-width: 2.2;
}

.counter-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.counter-value {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg,
    var(--vp-c-text-1) 0%,
    var(--vp-c-brand-1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: var(--vp-font-family-mono);
  letter-spacing: -0.5px;
  transition: all 0.3s ease;
}

.counter-card:hover .counter-value {
  transform: scale(1.05);
}

.counter-label {
  font-size: 14px;
  color: var(--vp-c-text-2);
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.counter-card:hover .counter-label {
  color: var(--vp-c-brand-1);
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
  /* 使用 translateY 配合 scale，只让它稍微"浮起"，不乱跑 */
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