---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "IsaacE2的岁月史书"
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


<style>

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