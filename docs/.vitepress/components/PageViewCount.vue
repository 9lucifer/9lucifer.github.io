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

watch(() => route.path, () => {
  show.value = false
  nextTick(() => {
    show.value = true
  })
})
</script>

<style scoped>
.page-view-count {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}
</style>
