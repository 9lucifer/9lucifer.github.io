<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import { TreeChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import XMind from 'xmind'

echarts.use([TreeChart, TooltipComponent, CanvasRenderer])

const props = defineProps({
  src: { type: String, required: true },
  height: { type: Number, default: 600 }
})

const containerRef = ref(null)
const loading = ref(true)
const error = ref(null)

let chart = null

/* ---------------- 解析 XMind ---------------- */

function convertToTree(topic) {
  if (!topic) return null

  const node = {
    name: topic.title || ' '
  }

  const children = topic?.children?.attached

  if (children && children.length) {
    node.children = children.map(convertToTree)
  }

  return node
}

async function loadXmind() {
  try {
    loading.value = true
    error.value = null

    const res = await fetch(props.src)
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)

    const buffer = await res.arrayBuffer()
    const workbook = await XMind.load(buffer)
    const sheets = workbook.get()

    if (!sheets?.length) throw new Error('空的 XMind 文件')

    const root = sheets[0].rootTopic
    const treeData = convertToTree(root)

    await nextTick()
    renderChart(treeData)

    loading.value = false
  } catch (e) {
    error.value = e.message
    loading.value = false
    console.error(e)
  }
}

/* ---------------- 渲染图表 ---------------- */

function isDark() {
  return document.documentElement.classList.contains('dark')
}

function renderChart(data) {
  if (!containerRef.value) return

  chart?.dispose()
  chart = echarts.init(containerRef.value)

  const dark = isDark()

  chart.setOption({
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },

    series: [{
      type: 'tree',
      data: [data],

      left: '2%',
      right: '2%',
      top: '5%',
      bottom: '5%',

      layout: 'orthogonal',
      orient: 'LR',

      roam: true,
      expandAndCollapse: true,
      initialTreeDepth: -1,

      symbol: 'roundRect',
      symbolSize: [90, 28],

      label: {
        position: 'inside',
        color: '#fff',
        fontSize: 12
      },

      itemStyle: {
        color: dark ? '#7aa2ff' : '#5B8FF9'
      },

      lineStyle: {
        color: dark ? '#aaa' : '#999',
        width: 2,
        curveness: 0.35
      }
    }]
  })
}

/* ---------------- resize & dark mode ---------------- */

function resize() {
  chart?.resize()
}

const observer = new MutationObserver(() => {
  if (chart) loadXmind()
})

onMounted(() => {
  loadXmind()
  window.addEventListener('resize', resize)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  observer.disconnect()
  chart?.dispose()
})

watch(() => props.src, loadXmind)
</script>

<template>
  <div>
    <div v-if="loading" style="text-align:center;padding:40px;opacity:.6">
      正在加载脑图...
    </div>

    <div v-else-if="error" style="color:#ff4d4f;padding:20px">
      <b>脑图加载失败</b>
      <div style="font-size:12px;margin-top:6px">{{ error }}</div>
    </div>

    <div
      v-else
      ref="containerRef"
      :style="{ width:'100%', height: height + 'px' }"
    />
  </div>
</template>