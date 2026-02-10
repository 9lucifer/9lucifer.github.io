<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts/core'
import { TreeChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import XMind from 'xmind'

echarts.use([TreeChart, CanvasRenderer])

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

const containerRef = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
    // 加载 xmind 文件
    const response = await fetch(props.src)
    const blob = await response.blob()
    const buffer = await blob.arrayBuffer()

    // 解析 xmind
    const xmind = await XMind.load(buffer)
    const data = xmind.get()

    // 转换为 ECharts 树形数据
    const treeData = convertToTree(data[0].topic)

    // 渲染脑图
    const chart = echarts.init(containerRef.value)

    const option = {
      series: [{
        type: 'tree',
        data: [treeData],
        top: '5%',
        left: '10%',
        bottom: '5%',
        right: '20%',
        symbolSize: 10,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 13,
          fontWeight: 'bold'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        expandAndCollapse: true,
        initialTreeDepth: 2,
        roam: true,
        itemStyle: {
          color: '#2196F3',
          borderColor: '#2196F3',
          borderWidth: 2
        },
        lineStyle: {
          color: '#90CAF9',
          width: 2,
          curveness: 0.5
        }
      }]
    }

    chart.setOption(option)
    window.addEventListener('resize', () => chart.resize())
  } catch (e) {
    error.value = `加载失败: ${e.message}`
    console.error('Xmind 加载错误:', e)
  }
})

function convertToTree(xmindTopic) {
  const node = {
    name: xmindTopic.title
  }

  if (xmindTopic.children && xmindTopic.children.length > 0) {
    node.children = xmindTopic.children.map
  }

  return node
}
</script>

<template>
  <div>
    <div v-if="error" style="color: red; padding: 20px;">
      {{ error }}
    </div>
    <div ref="containerRef" style="width: 100%; height: 600px;"></div>
  </div>
</template>
