<script setup lang="ts">
import { withBase } from 'vitepress'
import { latestArticles } from '../data/homeLatestArticles.generated.js'

type IconKind =
  | 'redis'
  | 'mysql'
  | 'design'
  | 'interview'
  | 'ai'
  | 'algorithm'
  | 'java'
  | 'go'
  | 'center'
  | 'front'
  | 'computer'
  | 'product'
  | 'plan'
  | 'generic'

type ArticleCard = {
  href: string
  date: string
  icon: IconKind
  title: string
  summary: string
  tags: string[]
}

type CardItem =
  | ({ type: 'article' } & ArticleCard)
  | { type: 'stats' }

const articleCards = (latestArticles as ArticleCard[]).slice(0, 6)
const cards: CardItem[] = [
  ...articleCards.slice(0, 3).map((item) => ({ type: 'article' as const, ...item })),
  { type: 'stats' },
  ...articleCards.slice(3).map((item) => ({ type: 'article' as const, ...item }))
]

const iconSvgMap: Record<IconKind, string> = {
  redis: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="5.5" rx="6.5" ry="2.8"></ellipse>
      <path d="M5.5 5.5v4.5c0 1.55 2.9 2.8 6.5 2.8s6.5-1.25 6.5-2.8V5.5"></path>
      <path d="M5.5 10v4.2c0 1.55 2.9 2.8 6.5 2.8s6.5-1.25 6.5-2.8V10"></path>
      <path d="M5.5 14.2v4.3c0 1.55 2.9 2.8 6.5 2.8s6.5-1.25 6.5-2.8v-4.3"></path>
    </svg>
  `,
  mysql: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="5.5" rx="6.5" ry="2.8"></ellipse>
      <path d="M5.5 5.5v4.5c0 1.55 2.9 2.8 6.5 2.8s6.5-1.25 6.5-2.8V5.5"></path>
      <path d="M5.5 10v4.2c0 1.55 2.9 2.8 6.5 2.8s6.5-1.25 6.5-2.8V10"></path>
      <path d="M5.5 14.2v4.3c0 1.55 2.9 2.8 6.5 2.8s6.5-1.25 6.5-2.8v-4.3"></path>
    </svg>
  `,
  design: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="12" rx="3"></rect>
      <path d="M8 19h8"></path>
      <path d="M10 9l2.2 2.2L16 7.5"></path>
    </svg>
  `,
  interview: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 8h8"></path>
      <path d="M8 12h8"></path>
      <path d="M8 16h5"></path>
      <rect x="5" y="4" width="14" height="16" rx="3"></rect>
    </svg>
  `,
  ai: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="7" width="10" height="10" rx="2"></rect>
      <path d="M12 3v3"></path>
      <path d="M12 18v3"></path>
      <path d="M3 12h3"></path>
      <path d="M18 12h3"></path>
      <path d="M9.5 10.5h5"></path>
      <path d="M9.5 13.5h5"></path>
    </svg>
  `,
  algorithm: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17l4-10 2 6 2-4 2 8"></path>
      <path d="M5 19h14"></path>
    </svg>
  `,
  java: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18h6"></path>
      <path d="M8 14h8"></path>
      <path d="M9 10c0 2 6 2 6 0"></path>
      <path d="M10 6c0 1 1 1.5 2 2"></path>
      <path d="M14 5c0 1-1 1.5-2 2"></path>
    </svg>
  `,
  go: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h8"></path>
      <path d="M9 8l3 4-3 4"></path>
      <path d="M14 8h6"></path>
      <path d="M14 16h6"></path>
    </svg>
  `,
  center: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1.5"></rect>
      <rect x="14" y="4" width="6" height="6" rx="1.5"></rect>
      <rect x="9" y="14" width="6" height="6" rx="1.5"></rect>
      <path d="M10 7h4"></path>
      <path d="M12 10v4"></path>
    </svg>
  `,
  front: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2.5"></rect>
      <path d="M4 9h16"></path>
      <path d="M8 7h.01"></path>
      <path d="M11 7h.01"></path>
    </svg>
  `,
  computer: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="11" rx="2.5"></rect>
      <path d="M9 19h6"></path>
      <path d="M12 16v3"></path>
      <path d="M8 9l2 2-2 2"></path>
      <path d="M12 13h4"></path>
    </svg>
  `,
  product: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.5"></rect>
      <rect x="13" y="4" width="7" height="4" rx="1.5"></rect>
      <rect x="13" y="10" width="7" height="10" rx="1.5"></rect>
      <rect x="4" y="13" width="7" height="7" rx="1.5"></rect>
    </svg>
  `,
  plan: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2.5"></rect>
      <path d="M8 3v4"></path>
      <path d="M16 3v4"></path>
      <path d="M4 9h16"></path>
      <path d="M9 13h2"></path>
      <path d="M13 13h2"></path>
    </svg>
  `,
  generic: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="4" width="14" height="16" rx="2.5"></rect>
      <path d="M8 9h8"></path>
      <path d="M8 13h8"></path>
      <path d="M8 17h5"></path>
    </svg>
  `
}

function resolveHref(href: string) {
  return withBase(href)
}

function resolveIcon(icon: IconKind) {
  return iconSvgMap[icon] || iconSvgMap.generic
}
</script>

<template>
  <section class="latest-articles">
    <div class="latest-articles__head">
      <h2 class="latest-articles__title">最新文章</h2>
      <a :href="resolveHref('/annual-summary/')" class="latest-articles__more">
        <span>查看全部</span>
        <span class="latest-articles__arrow">→</span>
      </a>
    </div>

    <div class="latest-articles__grid">
      <template v-for="item in cards" :key="item.type === 'stats' ? 'stats' : item.href">
        <a v-if="item.type === 'article'" :href="resolveHref(item.href)" class="latest-article-card">
          <div class="latest-article-card__top">
            <span class="latest-article-card__date">{{ item.date }}</span>
            <span
              :class="['latest-article-card__icon', `latest-article-card__icon--${item.icon}`]"
              v-html="resolveIcon(item.icon)"
            ></span>
          </div>
          <h3 class="latest-article-card__title">{{ item.title }}</h3>
          <p class="latest-article-card__summary">{{ item.summary }}</p>
          <div class="latest-article-card__tags">
            <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
          </div>
        </a>

        <div v-else class="latest-article-stats">
          <div class="latest-article-stats__top">
            <span class="latest-article-stats__title">访问统计</span>
            <span class="latest-article-stats__icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 18V9"></path>
                <path d="M12 18V5"></path>
                <path d="M18 18v-6"></path>
              </svg>
            </span>
          </div>

          <div class="latest-article-stats__item">
            <div class="latest-article-stats__label-row">
              <span>总访问量</span>
              <span id="vercount_value_site_pv">...</span>
            </div>
            <div class="latest-article-stats__track">
              <span id="home-stat-progress-pv" class="latest-article-stats__bar" style="width: 100%"></span>
            </div>
          </div>

          <div class="latest-article-stats__item">
            <div class="latest-article-stats__label-row">
              <span>独立访客</span>
              <span id="vercount_value_site_uv">...</span>
            </div>
            <div class="latest-article-stats__track">
              <span id="home-stat-progress-uv" class="latest-article-stats__bar" style="width: 58%"></span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
