<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts/core'
import { TreeChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TreeChart, CanvasRenderer])

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const containerRef = ref(null)

onMounted(() => {
  const chart = echarts.init(containerRef.value)

  const option = {
    series: [{
      type: 'tree',
      data: [props.data],
      top: '5%',
      left: '10%',
      bottom: '5%',
      right: '20%',
      symbolSize: 7,
      label: {
        position: 'left',
        verticalAlign: 'middle',
        align: 'right',
        fontSize: 14
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
        borderColor: '#2196F3'
      },
      lineStyle: {
        color: '#ccc',
        width: 1.5,
        curveness: 0.5
      }
    }]
  }

  chart.setOption(option)

  window.addEventListener('resize', () => chart.resize())
})
</script>

<template>
  <div ref="containerRef" style="width: 100%; height: 500px;"></div>
</template>