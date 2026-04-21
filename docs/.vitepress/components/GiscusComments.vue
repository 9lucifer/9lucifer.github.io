<template>
  <div v-if="enabled" class="giscus-comments">
    <div class="giscus-comments__header">
      <span class="giscus-comments__title">评论区</span>
      <span class="giscus-comments__hint">欢迎交流</span>
    </div>
    <Giscus
      id="comments"
      :key="route.path"
      repo="9lucifer/9lucifer.github.io"
      repo-id="R_kgDOOVGq5Q"
      category="Announcements"
      category-id="DIC_kwDOOVGq5c4C7VwI"
      mapping="pathname"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      lang="zh-CN"
      loading="lazy"
      :theme="theme"
    />
  </div>
</template>

<script setup>
import Giscus from '@giscus/vue'
import { computed, watch } from 'vue'
import { inBrowser, useData, useRoute } from 'vitepress'

const { frontmatter, isDark, page } = useData()
const route = useRoute()
const theme = computed(() => (isDark.value ? 'dark' : 'light'))

const syncTheme = () => {
  if (!inBrowser) return

  const iframe = document
    .querySelector('giscus-widget')
    ?.shadowRoot?.querySelector('iframe')

  iframe?.contentWindow?.postMessage(
    {
      giscus: {
        setConfig: {
          theme: theme.value
        }
      }
    },
    'https://giscus.app'
  )
}

const enabled = computed(() => {
  const relativePath = page.value.relativePath || ''
  if (frontmatter.value.comment === false) return false
  if (!relativePath.startsWith('mysql/')) return false
  if (relativePath === 'mysql/index.md') return false
  return true
})

watch(isDark, () => {
  syncTheme()
})
</script>

<style scoped>
.giscus-comments {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.giscus-comments__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.giscus-comments__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.giscus-comments__hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .giscus-comments__header {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
