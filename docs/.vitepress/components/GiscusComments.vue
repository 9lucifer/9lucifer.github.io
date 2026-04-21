<template>
  <div v-if="enabled" class="giscus-comments">
    <div ref="container" class="giscus-comments__inner" />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { inBrowser, useData, useRoute } from 'vitepress'

const { frontmatter, isDark } = useData()
const route = useRoute()
const container = ref(null)

const enabled = computed(() => frontmatter.value.comment !== false)

const getTheme = () => (isDark.value ? 'dark' : 'light')

const cleanup = () => {
  if (container.value) {
    container.value.innerHTML = ''
  }
}

const loadGiscus = () => {
  if (!inBrowser || !container.value || !enabled.value) {
    cleanup()
    return
  }

  cleanup()

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-repo', '9lucifer/9lucifer.github.io')
  script.setAttribute('data-repo-id', 'R_kgDOOVGq5Q')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'DIC_kwDOOVGq5c4C7VwI')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', getTheme())
  script.setAttribute('data-lang', 'zh-CN')

  container.value.appendChild(script)
}

const syncTheme = () => {
  if (!inBrowser) return

  const iframe = document.querySelector('iframe.giscus-frame')
  iframe?.contentWindow?.postMessage(
    {
      giscus: {
        setConfig: {
          theme: getTheme()
        }
      }
    },
    'https://giscus.app'
  )
}

watch(
  () => route.path,
  async () => {
    await nextTick()
    loadGiscus()
  }
)

watch(enabled, async (value) => {
  await nextTick()
  if (value) {
    loadGiscus()
    return
  }

  cleanup()
})

watch(isDark, () => {
  syncTheme()
})

onMounted(() => {
  loadGiscus()
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<style scoped>
.giscus-comments {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.giscus-comments__inner {
  min-height: 160px;
}
</style>
