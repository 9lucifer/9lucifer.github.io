---
layout: home

hero:
  name: "IsaacE2的记录"
  text: "ai时代，也得掌握原理～"
  tagline: 联系方式：3616266449@qq.com
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
---

<div v-pre>
<div class="latest-articles">
  <div class="section-header">
    <h2>📝 最新文章</h2>
    <p class="section-tagline">记录成长的点点滴滴</p>
  </div>
  <div class="articles-grid">
    <a href="/mysql/redis-info-index" class="article-card">
      <div class="article-inner">
        <div class="article-slide-up">
          <div class="article-content">
            <span class="article-tag">数据库</span>
            <h3>Redis</h3>
            <p>什么是 Redis?</p>
          </div>
          <div class="article-footer">查看详情 →</div>
        </div>
      </div>
    </a>
    <a href="/mysql/mysql-info-index" class="article-card">
      <div class="article-inner">
        <div class="article-slide-up">
          <div class="article-content">
            <span class="article-tag">数据库</span>
            <h3>Mysql知识体系[索引]</h3>
            <p>mysql是什么</p>
          </div>
          <div class="article-footer">查看详情 →</div>
        </div>
      </div>
    </a>
    <a href="/design/high-concurrency-inventory-design" class="article-card">
      <div class="article-inner">
        <div class="article-slide-up">
          <div class="article-content">
            <span class="article-tag">系统设计</span>
            <h3>如何解决超卖和少卖</h3>
            <p>在电商的团购、秒杀等高并发场景下，用户会在极短时间内集中抢购库存极少的商品（有的支持多件购买，有的限制每人一件），核心难</p>
          </div>
          <div class="article-footer">查看详情 →</div>
        </div>
      </div>
    </a>
    <a href="/design/i-interview" class="article-card">
      <div class="article-inner">
        <div class="article-slide-up">
          <div class="article-content">
            <span class="article-tag">系统设计</span>
            <h3>面试突击</h3>
            <p>- 为什么 new ArrayList() 时建议指定初始化容量值</p>
          </div>
          <div class="article-footer">查看详情 →</div>
        </div>
      </div>
    </a>
    <a href="/ai/openclaw-analysis" class="article-card">
      <div class="article-inner">
        <div class="article-slide-up">
          <div class="article-content">
            <span class="article-tag">人工智能</span>
            <h3>OpenClaw 开源项目分析</h3>
            <p>OpenClaw 解决的核心问题是如何构建一个多平台、可扩展的个人 AI 助手。现在的agent智能体的痛点是使用体验割</p>
          </div>
          <div class="article-footer">查看详情 →</div>
        </div>
      </div>
    </a>
    <a href="/algorithm/hot100/maximum-product-subarray" class="article-card">
      <div class="article-inner">
        <div class="article-slide-up">
          <div class="article-content">
            <span class="article-tag">算法</span>
            <h3>88. 乘积最大子数组</h3>
            <p>题目链接：https://leetcode.cn/problems/maximum-product-subarray/</p>
          </div>
          <div class="article-footer">查看详情 →</div>
        </div>
      </div>
    </a>
  </div>
</div>

<div class="counter-section">
  <div class="counter-grid">
    <div class="counter-card">
      <div class="counter-inner">
        <div class="counter-slide-up">
          <div class="counter-icon-wrapper">
            <span class="counter-icon-text">👥</span>
          </div>
          <span class="counter-label">访客总数</span>
          <div class="counter-value-wrapper">
            <span class="counter-value" id="vercount_value_site_uv">...</span>
            <span class="counter-value-label">访客总数</span>
          </div>
        </div>
      </div>
    </div>
    <div class="counter-card">
      <div class="counter-inner">
        <div class="counter-slide-up">
          <div class="counter-icon-wrapper">
            <span class="counter-icon-text">👁️</span>
          </div>
          <span class="counter-label">总浏览量</span>
          <div class="counter-value-wrapper">
            <span class="counter-value" id="vercount_value_site_pv">...</span>
            <span class="counter-value-label">总浏览量</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>