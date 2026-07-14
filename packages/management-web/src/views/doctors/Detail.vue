<template>
  <div class="page-container">
    <div class="page-header">
      <el-button link @click="$router.push('/doctors/list')">
        <el-icon><ArrowLeft /></el-icon>返回医生列表
      </el-button>
      <h2 style="margin-top: 8px">医生详情</h2>
    </div>

    <el-row :gutter="16" v-loading="loading">
      <!-- Basic info -->
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-title">基本信息</div>
          </template>
          <div class="doctor-profile">
            <el-avatar :size="72" icon="UserFilled" />
            <h3>{{ doctor?.name }}</h3>
            <p class="doctor-title">{{ doctor?.title }}</p>
          </div>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="手机号">{{ doctor?.phone }}</el-descriptions-item>
            <el-descriptions-item label="科室">{{ doctor?.department }}</el-descriptions-item>
            <el-descriptions-item label="医院">{{ doctor?.hospital }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ doctor?.gender === 'male' ? '男' : doctor?.gender === 'female' ? '女' : '未知' }}</el-descriptions-item>
            <el-descriptions-item label="认证状态">
              <el-tag :type="doctor?.realNameVerified ? 'success' : 'warning'" size="small">
                {{ doctor?.realNameVerified ? '已认证' : '未认证' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="入驻时间">{{ formatTime(doctor?.createdAt) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- Stats -->
      <el-col :span="16">
        <el-card style="margin-bottom: 16px">
          <template #header>
            <div class="card-title">工作统计</div>
          </template>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-statistic title="累计咨询" :value="doctor?.consultationCount || 0" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="管理患者" :value="patientCount" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="随访计划" :value="2" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="好评率" :value="98" suffix="%" />
            </el-col>
          </el-row>
        </el-card>

        <el-card>
          <template #header>
            <div class="card-title">执业信息</div>
          </template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="个人简介">{{ doctor?.bio || '暂无' }}</el-descriptions-item>
            <el-descriptions-item label="擅长领域">
              <el-tag
                v-for="s in (doctor?.specialties || [])"
                :key="s"
                size="small"
                style="margin-right: 8px"
              >
                {{ s }}
              </el-tag>
              <span v-if="!doctor?.specialties?.length">暂无</span>
            </el-descriptions-item>
            <el-descriptions-item label="资质证书">
              <div v-for="c in (doctor?.certifications || [])" :key="c">
                {{ c }}
              </div>
              <span v-if="!doctor?.certifications?.length">暂无</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { get } from '@ylxb/shared'
import { formatDate } from '@ylxb/shared'
import type { Doctor } from '@ylxb/shared'

const route = useRoute()
const doctor = ref<Doctor | null>(null)
const loading = ref(false)

const patientCount = computed(() => {
  if (!doctor.value?.tenantPatients) return 0
  const allPatients = new Set<string>()
  Object.values(doctor.value.tenantPatients).forEach((arr) => {
    arr.forEach((id) => allPatients.add(id))
  })
  return allPatients.size
})

function formatTime(str?: string): string {
  if (!str) return '-'
  return formatDate(str, 'YYYY-MM-DD')
}

async function fetchDetail() {
  loading.value = true
  try {
    const id = route.params.id as string
    const res = await get<Doctor[]>(`/management/doctors`)
    if (res.code === 0) {
      doctor.value = res.data.find((d) => d.id === id) || null
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.card-title {
  font-size: 16px;
  font-weight: 600;
}

.doctor-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0 24px;
}

.doctor-profile h3 {
  margin-top: 12px;
  font-size: 20px;
}

.doctor-profile .doctor-title {
  margin-top: 4px;
  color: var(--text-secondary);
}
</style>
