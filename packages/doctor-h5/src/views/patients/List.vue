<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { Patient } from '@ylxb/shared'

const router = useRouter()
const patients = ref<Patient[]>([])
const loading = ref(true)
const searchText = ref('')

onMounted(async () => {
  const res = await get<Patient[]>('/doctor/patients')
  if (res.code === 0) {
    patients.value = (res.data as unknown as Patient[]) || []
  }
  loading.value = false
})

const filteredPatients = computed(() => {
  if (!searchText.value) return patients.value
  const keyword = searchText.value.toLowerCase()
  return patients.value.filter(p =>
    p.name.includes(keyword) ||
    p.phone.includes(keyword)
  )
})

function goDetail(id: string) {
  router.push('/patients/detail/' + id)
}
</script>

<template>
  <div class="patient-list-page">
    <van-search v-model="searchText" placeholder="搜索患者姓名或手机号" shape="round" />

    <van-list
      v-model:loading="loading"
      :finished="true"
      finished-text="没有更多了"
    >
      <div
        v-for="patient in filteredPatients"
        :key="patient.id"
        class="patient-card"
        @click="goDetail(patient.id)"
      >
        <div class="card-left">
          <span class="patient-avatar">{{ patient.avatar || '👤' }}</span>
          <div class="patient-info">
            <div class="patient-name">
              {{ patient.name }}
              <van-tag :type="patient.gender === 'male' ? 'primary' : 'danger'" size="mini" style="margin-left:6px">
                {{ patient.gender === 'male' ? '男' : '女' }}
              </van-tag>
            </div>
            <div class="patient-meta">
              <span v-if="patient.birthDate">年龄 {{ calcAge(patient.birthDate) }}岁</span>
              <span v-if="patient.phone">{{ patient.phone }}</span>
            </div>
          </div>
        </div>
        <div class="card-tags" v-if="patient.medicalHistory && patient.medicalHistory.length > 0">
          <van-tag
            v-for="tag in patient.medicalHistory"
            :key="tag"
            type="warning"
            size="mini"
            plain
            style="margin-right:4px; margin-top:4px;"
          >
            {{ tag }}
          </van-tag>
        </div>
        <van-icon name="arrow" color="#ccc" size="16" style="position:absolute; right:12px; top:50%; transform:translateY(-50%);" />
      </div>
    </van-list>

    <van-empty v-if="!loading && filteredPatients.length === 0" description="暂无患者数据" />
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'

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
.patient-list-page {
  min-height: 100vh;
  background: #f5f7fa;
}
.patient-card {
  background: #fff;
  margin: 8px 12px;
  border-radius: 12px;
  padding: 14px;
  position: relative;
  cursor: pointer;
}
.card-left {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.patient-avatar {
  font-size: 36px;
}
.patient-name {
  font-size: 16px;
  font-weight: 600;
}
.patient-meta {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  display: flex;
  gap: 10px;
}
.card-tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
  padding-left: 46px;
}
</style>
