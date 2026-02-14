---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "IsaacE2的记录"
  text: "闲下来写两篇~[迁移中-预计还需2天]"
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

<div class="counter-container">
  <h3>📊 访问统计</h3>
  <div class="counter-grid">
    <div class="counter-item">
      <span class="counter-label">总访问量</span>
      <span class="counter-value" id="vercount_value_site_pv">Loading</span>
    </div>
    <div class="counter-item">
      <span class="counter-label">总访客数</span>
      <span class="counter-value" id="vercount_value_site_uv">Loading</span>
    </div>
    <div class="counter-item">
      <span class="counter-label">页面浏览</span>
      <span class="counter-value" id="vercount_value_page_pv">Loading</span>
    </div>
  </div>
</div>


<div class="latest-articles">
  <h2>📝 最新文章</h2>
  <div class="articles-grid">
    <a href="/algorithm/hot100/longest-substring-without-repeating-characters" class="article-card">
      <div class="article-tag">算法</div>
      <h3>8. 无重复字符最长子串</h3>
      <p>题目链接：https://leetcode.cn/problems/longest-substring-without-</p>
    </a>
    <a href="/design/role-permission" class="article-card">
      <div class="article-tag">其他</div>
      <h3>权限管理鉴权模型</h3>
      <p>用户登陆之后，在访问系统某个功能模块的时候，往往需要根据内容和用户进行鉴权，比如GitHub需要判断某个用户对某个仓库是</p>
    </a>
    <a href="/algorithm/hot100/trapping-rain-water" class="article-card">
      <div class="article-tag">算法</div>
      <h3>7. 接雨水</h3>
      <p>题目链接：https://leetcode.cn/problems/trapping-rain-water</p>
    </a>
    <a href="/algorithm/hot100/3sum" class="article-card">
      <div class="article-tag">算法</div>
      <h3>6. 三数之和</h3>
      <p>题目链接：https://leetcode.cn/problems/3sum</p>
    </a>
    <a href="/java/basic/string" class="article-card">
      <div class="article-tag">Java</div>
      <h3>字符串</h3>
      <p>![image-20260213221946267](https://imgtu.oss-cn-beijing.aliy</p>
    </a>
    <a href="/center/rabbitmq/rabbitmq-base" class="article-card">
      <div class="article-tag">中间件</div>
      <h3>rabbitmq五种模式的总结</h3>
      <p>完整项目地址：https://github.com/9lucifer/rabbitmq4j-learning</p>
    </a>
  </div>
</div>

<style>
/* 访问计数器样式 */
.counter-container {
  max-width: 1152px;
  margin: 32px auto;
  padding: 0 24px;
  text-align: center;
}

.counter-container h3 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 24px;
  color: var(--vp-c-text-2);
}

.counter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.counter-item {
  padding: 16px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
}

.counter-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: var(--vp-c-divider);
}

.counter-label {
  display: block;
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 6px;
}

.counter-value {
  display: block;
  font-size: 20px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

/* 最新文章区域 */
.latest-articles {
  max-width: 1152px;
  margin: 64px auto;
  padding: 0 24px;
}

.latest-articles h2 {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 48px;
  color: var(--vp-c-text-1);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.article-card {
  position: relative;
  padding: 24px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.article-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  margin-bottom: 12px;
}

.article-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--vp-c-text-1);
}

.article-card p {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
}

/* 调整 hero 图片容器 */
.VPHero .image-container {
  position: relative;
  display: inline-block;
  margin-left: 50px; /* 容器整体右移 */
}
/* 创建光晕伪元素 */
.VPHero .image-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;  /* 光晕尺寸 */
  height: 500px;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(100, 149, 237, 0.3) 0%,  /* 柔和的蓝色光晕 */
    rgba(100, 149, 237, 0.15) 50%,
    rgba(100, 149, 237, 0) 70%
  );
  filter: blur(60px);
  z-index: -1;
}

/* 调整图片样式 */
.VPHero img {
  width: 300px;
  height: 300px;
  position: relative;
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(100, 149, 237, 0.3); /* 添加辅助光晕 */
}

/* 其他文字调整保持原样 */
.VPHero .text { font-size: 24px; }
.VPHero .name { font-size: 48px; }
.VPHero .tagline { font-size: 18px; }



/* 修改 hero 部分的字号 */
.VPHero .text {
  font-size: 24px; /* 调整为你需要的字号 */
}

.VPHero .name {
  font-size: 48px; /* 调整 hero name 的字号 */
}

.VPHero .tagline {
  font-size: 18px; /* 调整 tagline 的字号 */
}
</style>