<script setup>
import DefaultTheme from 'vitepress/theme'
import GiscusComments from '../components/GiscusComments.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-after>
      <GiscusComments />
    </template>
  </DefaultTheme.Layout>
</template>
