<template>
  <div class="page-container">
    <!-- Stat cards -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-label">医生数</div>
        <div class="stat-value">{{ dashboardData.doctorCount }}</div>
        <div class="stat-trend up">活跃 {{ dashboardData.doctorCount }} 人</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">患者数</div>
        <div class="stat-value">{{ dashboardData.patientCount.toLocaleString() }}</div>
        <div class="stat-trend up">接入 {{ dashboardData.patientCount.toLocaleString() }} 人</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">咨询量</div>
        <div class="stat-value">{{ dashboardData.consultationCount }}</div>
        <div class="stat-trend up">本周 +{{ weeklyConsultGrowth }}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">订单量</div>
        <div class="stat-value">{{ dashboardData.orderCount }}</div>
        <div class="stat-trend up">营收 ¥{{ (dashboardData.revenue / 10000).toFixed(1) }}万</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="chart-grid">
      <div class="chart-card">
        <div class="chart-header">本周咨询量</div>
        <div ref="consultChartRef" class="chart-body"></div>
      </div>
      <div class="chart-card">
        <div class="chart-header">本周订单量</div>
        <div ref="orderChartRef" class="chart-body"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import { get } from '@ylxb/shared'

interface DashboardData {
  doctorCount: number
  patientCount: number
  consultationCount: number
  orderCount: number
  revenue: number
  weeklyConsultations: number[]
  weeklyOrders: number[]
}

const dashboardData = ref<DashboardData>({
  doctorCount: 0,
  patientCount: 0,
  consultationCount: 0,
  orderCount: 0,
  revenue: 0,
  weeklyConsultations: [],
  weeklyOrders: [],
})

const consultChartRef = ref<HTMLDivElement>()
const orderChartRef = ref<HTMLDivElement>()
let consultChart: echarts.ECharts | null = null
let orderChart: echarts.ECharts | null = null

const dayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const weeklyConsultGrowth = computed(() => {
  const data = dashboardData.value.weeklyConsultations
  if (data.length < 2) return 0
  const last = data[data.length - 1]
  const prev = data[data.length - 2]
  return prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0
})

async function fetchDashboard() {
  const res = await get<DashboardData>('/management/dashboard')
  if (res.code === 0) {
    dashboardData.value = res.data
    await nextTick()
    renderCharts()
  }
}

function renderCharts() {
  if (consultChartRef.value) {
    if (!consultChart) {
      consultChart = echarts.init(consultChartRef.value)
    }
    consultChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: {
        type: 'category',
        data: dayLabels,
        axisLine: { lineStyle: { color: '#DCDFE6' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#F2F3F5' } },
      },
      series: [
        {
          data: dashboardData.value.weeklyConsultations,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#4A90D9', width: 2 },
          itemStyle: { color: '#4A90D9' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(74,144,217,0.3)' },
              { offset: 1, color: 'rgba(74,144,217,0.02)' },
            ]),
          },
        },
      ],
    })
  }

  if (orderChartRef.value) {
    if (!orderChart) {
      orderChart = echarts.init(orderChartRef.value)
    }
    orderChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: {
        type: 'category',
        data: dayLabels,
        axisLine: { lineStyle: { color: '#DCDFE6' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#F2F3F5' } },
      },
      series: [
        {
          data: dashboardData.value.weeklyOrders,
          type: 'bar',
          barWidth: 24,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#7EB8F4' },
              { offset: 1, color: '#4A90D9' },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    })
  }
}

function handleResize() {
  consultChart?.resize()
  orderChart?.resize()
}

onMounted(() => {
  fetchDashboard()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  consultChart?.dispose()
  orderChart?.dispose()
})
</script>
