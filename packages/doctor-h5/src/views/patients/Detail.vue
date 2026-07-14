<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { HealthRecord, VitalSign } from '@ylxb/shared'
import { VitalSignLabels, VitalSignUnits } from '@ylxb/shared'

const route = useRoute()
const router = useRouter()
const patientId = route.params.id as string

const activeTab = ref(0)
const patient = ref<any>(null)
const healthRecords = ref<HealthRecord[]>([])
const vitalSigns = ref<VitalSign[]>([])
const consultations = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  const res = await get<any>('/doctor/patients/' + patientId)
  if (res.code === 0) {
    const data = res.data
    patient.value = data
    healthRecords.value = (data as any).healthRecords || []
    vitalSigns.value = (data as any).vitalSigns || []
  }

  const consultRes = await get<any[]>('/doctor/consultations')
  if (consultRes.code === 0) {
    consultations.value = ((consultRes.data as unknown as any[]) || [])
      .filter((c: any) => c.patientId === patientId)
  }

  loading.value = false
})
</script>

<template>
  <div class="patient-detail-page">
    <van-nav-bar title="患者详情" left-arrow @click-left="router.back()" />

    <!-- 基本信息卡片 -->
    <div class="patient-card" v-if="patient">
      <div class="card-header">
        <span class="avatar">{{ patient.avatar || '👤' }}</span>
        <div>
          <div class="name">{{ patient.name }}</div>
          <div class="meta">
            {{ patient.gender === 'male' ? '男' : '女' }}
            <span v-if="patient.birthDate"> · {{ calcAge(patient.birthDate) }}岁</span>
          </div>
        </div>
      </div>
      <div class="info-row">
        <span>手机：{{ patient.phone }}</span>
        <span v-if="patient.emergencyContact">紧急联系人：{{ patient.emergencyContact }} {{ patient.emergencyPhone }}</span>
      </div>
      <div class="info-row" v-if="patient.medicalHistory && patient.medicalHistory.length > 0">
        <span>既往病史：</span>
        <van-tag v-for="tag in patient.medicalHistory" :key="tag" type="warning" size="mini" plain style="margin-right:4px; margin-top:2px;">
          {{ tag }}
        </van-tag>
      </div>
    </div>

    <van-loading v-if="loading" type="spinner" class="loading" />

    <!-- 标签页 -->
    <van-tabs v-model:active="activeTab" v-if="!loading">
      <!-- 健康档案 -->
      <van-tab title="健康档案">
        <div class="tab-content">
          <div v-for="record in healthRecords" :key="record.id" class="record-item">
            <div class="record-header">
              <span class="record-title">{{ record.title }}</span>
              <van-tag type="primary" size="mini">{{ record.type }}</van-tag>
            </div>
            <div class="record-content">{{ record.content }}</div>
            <div class="record-tags" v-if="record.tags && record.tags.length > 0">
              <van-tag v-for="tag in record.tags" :key="tag" size="mini" plain>{{ tag }}</van-tag>
            </div>
            <div class="record-time">{{ record.createdAt?.slice(0, 10) || '' }}</div>
          </div>
          <van-empty v-if="healthRecords.length === 0" description="暂无健康档案" />
        </div>
      </van-tab>

      <!-- 体征数据 -->
      <van-tab title="体征数据">
        <div class="tab-content">
          <div class="vital-grid">
            <div v-for="vs in vitalSigns" :key="vs.id" class="vital-card" :class="{ abnormal: vs.isAbnormal }">
              <div class="vital-value">{{ vs.value }}</div>
              <div class="vital-unit">{{ vs.unit }}</div>
              <div class="vital-label">{{ VitalSignLabels[vs.type] || vs.type }}</div>
              <div class="vital-time">{{ vs.recordedAt?.slice(0, 10) || '' }}</div>
            </div>
          </div>
          <van-empty v-if="vitalSigns.length === 0" description="暂无体征数据" />
        </div>
      </van-tab>

      <!-- 咨询记录 -->
      <van-tab title="咨询记录">
        <div class="tab-content">
          <div v-for="c in consultations" :key="c.id" class="consult-item" @click="router.push('/consultation/chat/' + c.id)">
            <div class="consult-header">
              <span class="consult-subject">{{ c.subject }}</span>
              <van-tag :type="c.status === 'active' ? 'success' : 'default'" size="mini">
                {{ c.status === 'active' ? '进行中' : '已结束' }}
              </van-tag>
            </div>
            <div class="consult-meta">
              <span>{{ c.doctorName }}</span>
              <span>{{ c.createdAt?.slice(0, 16) || '' }}</span>
            </div>
            <div class="consult-msg" v-if="c.lastMessage">{{ c.lastMessage }}</div>
          </div>
          <van-empty v-if="consultations.length === 0" description="暂无咨询记录" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
function calcAge(birthDate: string): number {
  if (!birthDate) return 0
  const birth = new Date(birthDate)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}
</script>

<style scoped>
.patient-detail-page { min-height: 100vh; background: #f5f7fa; padding-bottom: 20px; }
.patient-card { background: #fff; margin: 12px; border-radius: 12px; padding: 16px; }
.card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.avatar { font-size: 44px; }
.name { font-size: 18px; font-weight: 600; }
.meta { font-size: 13px; color: #666; margin-top: 4px; }
.info-row { font-size: 13px; color: #666; margin-top: 8px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.loading { display: flex; justify-content: center; padding: 40px 0; }
.tab-content { padding: 12px; }
.record-item { background: #fff; border-radius: 10px; padding: 14px; margin-bottom: 10px; }
.record-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.record-title { font-size: 15px; font-weight: 500; }
.record-content { font-size: 13px; color: #666; line-height: 1.6; }
.record-tags { display: flex; gap: 4px; margin-top: 8px; }
.record-time { font-size: 11px; color: #bbb; margin-top: 8px; }
.vital-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.vital-card { background: #fff; border-radius: 10px; padding: 14px; text-align: center; }
.vital-card.abnormal { background: #fff2f0; }
.vital-value { font-size: 22px; font-weight: 700; }
.vital-card.abnormal .vital-value { color: var(--danger); }
.vital-unit { font-size: 11px; color: #999; }
.vital-label { font-size: 12px; color: #666; margin-top: 4px; }
.vital-time { font-size: 10px; color: #ccc; margin-top: 4px; }
.consult-item { background: #fff; border-radius: 10px; padding: 14px; margin-bottom: 10px; cursor: pointer; }
.consult-header { display: flex; align-items: center; gap: 8px; }
.consult-subject { font-size: 15px; font-weight: 500; }
.consult-meta { font-size: 12px; color: #999; margin-top: 6px; display: flex; gap: 12px; }
.consult-msg { font-size: 13px; color: #666; margin-top: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
