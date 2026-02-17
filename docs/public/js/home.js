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
