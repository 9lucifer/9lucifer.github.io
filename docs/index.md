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
    <a href="/algorithm/hot100/climbing-stairs" class="article-card">
      <div class="article-inner">
        <div class="article-slide-up">
          <div class="article-content">
            <span class="article-tag">算法</span>
            <h3>81. 爬楼梯</h3>
            <p>题目链接：https://leetcode.cn/problems/climbing-stairs/</p>
          </div>
          <div class="article-footer">查看详情 →</div>
        </div>
      </div>
    </a>
    <a href="/algorithm/hot100/house-robber" class="article-card">
      <div class="article-inner">
        <div class="article-slide-up">
          <div class="article-content">
            <span class="article-tag">算法</span>
            <h3>83. 打家劫舍</h3>
            <p>题目链接：https://leetcode.cn/problems/house-robber/</p>
          </div>
          <div class="article-footer">查看详情 →</div>
        </div>
      </div>
    </a>
    <a href="/algorithm/hot100/pascals-triangle" class="article-card">
      <div class="article-inner">
        <div class="article-slide-up">
          <div class="article-content">
            <span class="article-tag">算法</span>
            <h3>82. 杨辉三角</h3>
            <p>题目链接：https://leetcode.cn/problems/pascals-triangle/</p>
          </div>
          <div class="article-footer">查看详情 →</div>
        </div>
      </div>
    </a>
    <a href="/algorithm/hot100/number-of-islands" class="article-card">
      <div class="article-inner">
        <div class="article-slide-up">
          <div class="article-content">
            <span class="article-tag">算法</span>
            <h3>51. 岛屿数量</h3>
            <p>题目链接：https://leetcode.cn/problems/number-of-islands/</p>
          </div>
          <div class="article-footer">查看详情 →</div>
        </div>
      </div>
    </a>
    <a href="/algorithm/hot100/find-the-duplicate-number" class="article-card">
      <div class="article-inner">
        <div class="article-slide-up">
          <div class="article-content">
            <span class="article-tag">算法</span>
            <h3>100. 寻找重复数</h3>
            <p>题目链接：https://leetcode.cn/problems/find-the-duplicate-number/</p>
          </div>
          <div class="article-footer">查看详情 →</div>
        </div>
      </div>
    </a>
    <a href="/algorithm/hot100/majority-element" class="article-card">
      <div class="article-inner">
        <div class="article-slide-up">
          <div class="article-content">
            <span class="article-tag">算法</span>
            <h3>97. 多数元素</h3>
            <p>题目链接：https://leetcode.cn/problems/majority-element/</p>
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
            <svg class="counter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
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
            <svg class="counter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
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

<script>
// 只在浏览器环境执行
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  (function() {
    // 等待页面加载完成
    function initFeaturesAnimation() {
      const featuresSection = document.querySelector('.VPFeatures');
      const features = document.querySelectorAll('.VPFeature');
      const latestArticles = document.querySelector('.latest-articles');

      if (!featuresSection || features.length < 3 || !latestArticles) {
        // 如果元素未找到，稍后重试
        setTimeout(initFeaturesAnimation, 100);
        return;
      }

      let currentIndex = 0;

      function highlightNext() {
        // 移除所有高亮
        features.forEach(f => f.classList.remove('highlight'));

        if (currentIndex < 3) {
          // 高亮当前卡片
          features[currentIndex].classList.add('highlight');
          currentIndex++;
          // 2秒后下一个
          setTimeout(highlightNext, 2000);
        } else {
          // 全部高亮完毕，隐藏 features 区域并上移最新文章
          featuresSection.classList.add('fade-out');
          latestArticles.classList.add('shift-up');
        }
      }

      // 延迟 1 秒开始动画
      setTimeout(highlightNext, 1000);
    }

    // 启动动画
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initFeaturesAnimation);
    } else {
      initFeaturesAnimation();
    }
  })();
}
</script>
