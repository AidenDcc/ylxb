<template>
  <div class="page-container">
    <div class="page-header">
      <h2>数据总览</h2>
      <span style="font-size: 13px; color: #909399">实时更新</span>
    </div>

    <!-- 统计卡片 -->
    <div class="stat-cards">
      <div class="stat-card">
        <div class="label">租户数</div>
        <div class="value">{{ dashboard.tenantCount }}</div>
        <div class="sub">个活跃租户</div>
      </div>
      <div class="stat-card">
        <div class="label">医生数</div>
        <div class="value">{{ dashboard.doctorCount }}</div>
        <div class="sub">名医生</div>
      </div>
      <div class="stat-card">
        <div class="label">患者数</div>
        <div class="value">{{ dashboard.patientCount }}</div>
        <div class="sub">名患者</div>
      </div>
      <div class="stat-card">
        <div class="label">咨询量</div>
        <div class="value">{{ dashboard.consultationCount }}</div>
        <div class="sub">次咨询</div>
      </div>
      <div class="stat-card">
        <div class="label">订单量</div>
        <div class="value">{{ dashboard.orderCount }}</div>
        <div class="sub">笔订单</div>
      </div>
      <div class="stat-card">
        <div class="label">平台营收</div>
        <div class="value" style="color: #4A90D9">&yen;{{ formatRevenue(dashboard.revenue) }}</div>
        <div class="sub">累计营收</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px">
      <div class="chart-box">
        <div class="chart-title">租户增长趋势（月）</div>
        <div ref="growthChartRef" class="chart-container"></div>
      </div>
      <div class="chart-box">
        <div class="chart-title">月度营收（万元）</div>
        <div ref="revenueChartRef" class="chart-container"></div>
      </div>
    </div>

    <!-- 待审核提醒 -->
    <el-card v-if="dashboard.pendingApplications > 0" style="margin-bottom: 20px">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div style="display: flex; align-items: center; gap: 12px">
          <el-icon :size="20" color="#FA8C16"><WarningFilled /></el-icon>
          <span style="font-size: 15px; font-weight: 500">
            当前有 <strong style="color: #FA8C16">{{ dashboard.pendingApplications }}</strong> 个租户入驻申请待审核
          </span>
        </div>
        <el-button type="warning" size="small" @click="router.push('/tenants/applications')">
          前往审核
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { get } from '@ylxb/shared'
import { ElMessage } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'

const router = useRouter()
const growthChartRef = ref<HTMLDivElement>()
const revenueChartRef = ref<HTMLDivElement>()

let growthChart: echarts.ECharts | null = null
let revenueChart: echarts.ECharts | null = null

interface DashboardData {
  tenantCount: number
  doctorCount: number
  patientCount: number
  consultationCount: number
  orderCount: number
  revenue: number
  pendingApplications: number
  tenantGrowth: number[]
  monthlyRevenue: number[]
}

const dashboard = ref<DashboardData>({
  tenantCount: 0,
  doctorCount: 0,
  patientCount: 0,
  consultationCount: 0,
  orderCount: 0,
  revenue: 0,
  pendingApplications: 0,
  tenantGrowth: [],
  monthlyRevenue: [],
})

function formatRevenue(val: number): string {
  if (val >= 10000) {
    return (val / 10000).toFixed(1) + '万'
  }
  return val.toLocaleString()
}

async function fetchDashboard() {
  const res = await get<DashboardData>('/platform/dashboard')
  if (res.code === 0) {
    dashboard.value = res.data
    await nextTick()
    initCharts()
  } else {
    ElMessage.error('获取数据失败')
  }
}

function initCharts() {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月']

  if (growthChartRef.value) {
    if (growthChart) growthChart.dispose()
    growthChart = echarts.init(growthChartRef.value)
    growthChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: months },
      yAxis: { type: 'value', name: '个' },
      series: [{
        name: '租户数',
        type: 'line',
        smooth: true,
        data: dashboard.value.tenantGrowth,
        itemStyle: { color: '#4A90D9' },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(74,144,217,0.3)' },
          { offset: 1, color: 'rgba(74,144,217,0.05)' },
        ])},
      }],
    })
  }

  if (revenueChartRef.value) {
    if (revenueChart) revenueChart.dispose()
    revenueChart = echarts.init(revenueChartRef.value)
    revenueChart.setOption({
      tooltip: { trigger: 'axis', valueFormatter: (val: number) => (val / 10000).toFixed(2) + '万元' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: months },
      yAxis: { type: 'value', name: '万元', axisLabel: { formatter: (val: number) => (val / 10000).toString() } },
      series: [{
        name: '月度营收',
        type: 'bar',
        data: dashboard.value.monthlyRevenue,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#6BB8E8' },
            { offset: 1, color: '#4A90D9' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '55%',
      }],
    })
  }
}

function handleResize() {
  growthChart?.resize()
  revenueChart?.resize()
}

onMounted(() => {
  fetchDashboard()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  growthChart?.dispose()
  revenueChart?.dispose()
})
</script>

<style scoped>
</style>
