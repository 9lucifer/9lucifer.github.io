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


<div class="latest-articles">
  <h2>📝 最新文章</h2>
  <div class="articles-grid">
    <a href="/java/basic/hard-37" class="article-card">
      <div class="article-tag">Java</div>
      <h3>📌《每天搞懂一道Hard》之数独终结者（LeetCode 37）</h3>
      <p>🔗原题链接：https://leetcode.com/problems/sudoku-solver/</p>
    </a>
    <a href="/java/basic/jdk-hashmap" class="article-card">
      <div class="article-tag">Java</div>
      <h3>📌《每天搞懂一个JDK源码》之HashMap解读</h3>
      <p>🔗源码定位：java.util.HashMap（建议IDE对照阅读）</p>
    </a>
    <a href="/java/basic/myThreadPool" class="article-card">
      <div class="article-tag">Java</div>
      <h3>🚀 手写线程池实战：从原理到实现，深入理解线程池工作机制</h3>
      <p>📌 本文参考B站技术视频 [《Java手写线程池实战》](https://www.bilibili.com/video</p>
    </a>
    <a href="/center/springSecurity1" class="article-card">
      <div class="article-tag">中间件</div>
      <h3>springSecurity入门</h3>
      <p>（本文适合从未接触过spring security的同学快速上手体验）</p>
    </a>
    <a href="/front/layui-admin" class="article-card">
      <div class="article-tag">前端</div>
      <h3>后端程序员好上手的前端框架——layui</h3>
      <p>layui的基础之后再补，现在是介绍**pear admin layui**</p>
    </a>
    <a href="/front/mark-js" class="article-card">
      <div class="article-tag">前端</div>
      <h3>🎨 Mark.js 的使用指南</h3>
      <p>Mark.js 是一个用于在网页中高亮显示关键词的 JavaScript 库。它可以帮助用户在文本内容中快速定位和突出显</p>
    </a>
  </div>
</div>

<style>

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