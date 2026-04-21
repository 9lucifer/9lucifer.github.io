<template>
  <span class="page-view-count" v-if="show">
    <span id="vercount_value_page_pv">...</span> 次浏览
  </span>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const show = ref(true)

const reloadVercount = () => {
  if (typeof window !== 'undefined' && typeof window.__reloadVercount === 'function') {
    window.__reloadVercount()
  }
}

onMounted(() => {
  reloadVercount()
})

watch(() => route.path, async () => {
  show.value = false
  await nextTick()
  show.value = true
  await nextTick()
  reloadVercount()
})
</script>

<style scoped>
.page-view-count {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}
</style>
