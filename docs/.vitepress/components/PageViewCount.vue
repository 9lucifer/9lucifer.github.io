<template>
  <div v-if="show" class="article-meta" data-page-meta>
    <div v-if="publishedAt" class="article-meta__item" title="发表于">
      <span class="article-meta__icon">发</span>
      <span>发表于 {{ publishedAt }}</span>
    </div>

    <div v-if="updatedAt" class="article-meta__item" title="更新于">
      <span class="article-meta__icon">更</span>
      <span>更新于 {{ updatedAt }}</span>
    </div>

    <div class="article-meta__item" title="字数">
      <span class="article-meta__icon">字</span>
      <span>总字数 {{ wordCount }}</span>
    </div>

    <div class="article-meta__item" title="阅读量">
      <span class="article-meta__icon">览</span>
      <span>
        阅读量 {{ pv }}
        <span id="vercount_value_page_pv" class="article-meta__vercount-anchor" />
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()

const show = ref(true)
const pv = ref('...')
const wordCount = ref('...')
let observer = null

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
    .format(date)
    .replace(/\//g, '-')
}

const formatNumber = (value) => {
  if (!Number.isFinite(value)) return '...'
  if (value < 1000) return String(value)
  if (value < 10000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`
  if (value < 1000000) return `${(value / 10000).toFixed(1).replace(/\.0$/, '')}w`
  return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}m`
}

const countWords = (text) => {
  const normalized = (text || '').replace(/\s+/g, ' ').trim()
  if (!normalized) return 0

  const chineseCount = (normalized.match(/[\u4e00-\u9fa5]/g) || []).length
  const latinCount = (normalized.match(/[A-Za-z0-9_]+/g) || []).length

  return chineseCount + latinCount
}

const publishedAt = computed(() =>
  formatDate(
    frontmatter.value.firstCommit ||
      frontmatter.value.date ||
      frontmatter.value.createdAt ||
      frontmatter.value.publishDate
  )
)

const updatedAt = computed(() =>
  formatDate(frontmatter.value.lastUpdated || page.value.lastUpdated)
)

const updateWordCount = () => {
  const article = document.querySelector('.VPDoc .main .vp-doc') || document.querySelector('.vp-doc')
  if (!article) {
    wordCount.value = '...'
    return
  }

  const clone = article.cloneNode(true)
  if (clone instanceof HTMLElement) {
    clone.querySelectorAll('[data-page-meta]').forEach((node) => node.remove())
    const count = countWords(clone.textContent || '')
    wordCount.value = formatNumber(count)
  }
}

const disconnectObserver = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

const updatePVFromDom = () => {
  const pvEl = document.getElementById('vercount_value_page_pv')
  if (!pvEl) return false

  const text = pvEl.textContent?.trim()
  if (!text || text === '...') return false

  const value = Number.parseInt(text, 10)
  if (Number.isNaN(value)) return false

  pv.value = formatNumber(value)
  return true
}

const initPVObserver = () => {
  disconnectObserver()

  const pvEl = document.getElementById('vercount_value_page_pv')
  if (!pvEl) return

  if (updatePVFromDom()) return

  observer = new MutationObserver(() => {
    if (updatePVFromDom()) {
      disconnectObserver()
    }
  })

  observer.observe(pvEl, {
    childList: true,
    characterData: true,
    subtree: true
  })
}

const reloadVercount = () => {
  if (typeof window !== 'undefined' && typeof window.__reloadVercount === 'function') {
    window.__reloadVercount()
  }
}

const refreshMeta = async ({ forceReload = false } = {}) => {
  await nextTick()
  updateWordCount()
  pv.value = '...'
  initPVObserver()

  if (forceReload) {
    reloadVercount()
  }
}

onMounted(async () => {
  await refreshMeta()
})

watch(
  () => page.value.relativePath,
  async () => {
    show.value = false
    disconnectObserver()
    await nextTick()
    show.value = true
    await refreshMeta({ forceReload: true })
  }
)

onUnmounted(() => {
  disconnectObserver()
})
</script>

<style scoped>
.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 0 18px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.5;
}

.article-meta__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 4px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--vp-c-brand-1) 7%, transparent) 0%,
    var(--vp-c-bg-soft) 70%
  );
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.article-meta__item:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 38%, var(--vp-c-divider));
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
}

.article-meta__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  flex-shrink: 0;
}

.article-meta__vercount-anchor {
  display: none;
}

@media (max-width: 640px) {
  .article-meta {
    gap: 6px;
    padding: 8px 0 14px;
    font-size: 12px;
  }

  .article-meta__item {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
