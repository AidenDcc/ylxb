<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { get, post } from '@ylxb/shared'
import type { Doctor } from '@ylxb/shared'
import { showToast } from 'vant'

const router = useRouter()
const auth = useAuthStore()
const doctors = ref<Doctor[]>([])
const loading = ref(true)

onMounted(async () => {
  // 从医生端 mock 获取（这里复用；实际应按租户获取医生列表）
  const res = await get<Doctor[]>('/management/doctors')
  if (res.code === 0) doctors.value = res.data as unknown as Doctor[]
  loading.value = false
})

async function handleConsult(doctor: Doctor) {
  const res = await post('/consultation/sessions', {
    doctorId: doctor.id,
    tenantId: auth.activeTenant?.tenantId,
    subject: `向${doctor.name}咨询`,
    patientName: auth.user?.name,
    doctorName: doctor.name,
    doctorAvatar: doctor.avatar,
    doctorTitle: doctor.title,
    doctorDepartment: doctor.department,
    tenantName: auth.activeTenant?.tenantName,
    patientAvatar: auth.user?.avatar,
    patientId: auth.user?.id,
  })
  if (res.code === 0) {
    showToast('咨询已发起')
    router.push(`/consultation/chat/${(res.data as Record<string,string>).id}`)
  }
}
</script>

<template>
  <div class="doctor-page">
    <van-nav-bar title="选择医生" left-arrow @click-left="router.back()" />
    <div v-if="!auth.activeTenant" class="warning">
      <van-notice-bar left-icon="warning-o" color="#FA8C16" text="请先选择服务机构后再咨询医生" />
    </div>
    <div class="doctor-list">
      <div v-for="d in doctors" :key="d.id" class="doctor-card" @click="handleConsult(d)">
        <span class="d-avatar">{{ d.avatar }}</span>
        <div class="d-info">
          <div class="d-name">{{ d.name }} <van-tag size="medium" type="primary">{{ d.title }}</van-tag></div>
          <div class="d-dept">{{ d.department }} · {{ d.hospital }}</div>
          <div class="d-bio" v-if="d.bio">{{ d.bio }}</div>
          <div class="d-specialties">
            <van-tag v-for="s in d.specialties" :key="s" size="medium" plain>{{ s }}</van-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.doctor-page { min-height: 100vh; background: #f5f7fa; }
.doctor-list { padding: 12px 16px; }
.doctor-card { background: #fff; border-radius: 12px; padding: 14px; margin-bottom: 10px; display: flex; gap: 12px; cursor: pointer; }
.d-avatar { font-size: 40px; }
.d-name { font-size: 15px; font-weight: 500; margin-bottom: 2px; }
.d-dept { font-size: 14px; color: #999; }
.d-bio { font-size: 14px; color: #666; margin-top: 6px; }
.d-specialties { margin-top: 6px; display: flex; gap: 4px; flex-wrap: wrap; }
.warning { margin: 12px 16px 0; }
</style>
