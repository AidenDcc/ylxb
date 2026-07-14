<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { MedicationReminder } from '@ylxb/shared'

const router = useRouter()
const reminders = ref<MedicationReminder[]>([])
const loading = ref(true)

onMounted(async () => {
  const res = await get<MedicationReminder[]>('/health/reminders')
  if (res.code === 0) reminders.value = res.data as unknown as MedicationReminder[]
  loading.value = false
})
</script>

<template>
  <div class="medications-page">
    <van-nav-bar title="用药记录" left-arrow @click-left="router.back()" />
    <div class="content">
      <div class="card" v-for="r in reminders" :key="r.id">
        <div class="card-header">
          <span class="drug-icon">💊</span>
          <div class="drug-info">
            <div class="drug-name">{{ r.drugName }}</div>
            <div class="drug-dosage">{{ r.dosage }} · {{ r.frequency === 'daily' ? '每日' : '每周' }} · {{ r.time }}</div>
          </div>
          <van-switch :model-value="r.enabled" size="20" active-color="#4A90D9" />
        </div>
        <div class="card-body">
          <div class="info-row"><span>周期</span><span>{{ r.startDate }} ~ {{ r.endDate }}</span></div>
          <div class="info-row" v-if="r.note"><span>备注</span><span>{{ r.note }}</span></div>
        </div>
      </div>
      <van-empty v-if="!loading && reminders.length === 0" description="暂无用药记录" />
      <van-button type="primary" block round style="margin-top:24px" @click="router.push('/reminders')">管理用药提醒</van-button>
    </div>
  </div>
</template>

<style scoped>
.medications-page { min-height: 100vh; background: #f5f7fa; }
.content { padding: 16px; }
.card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
.card-header { display: flex; align-items: center; gap: 12px; }
.drug-icon { font-size: 32px; }
.drug-info { flex: 1; }
.drug-name { font-size: 15px; font-weight: 600; }
.drug-dosage { font-size: 12px; color: #999; margin-top: 2px; }
.card-body { margin-top: 12px; padding-top: 12px; border-top: 1px solid #f5f5f5; }
.info-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; color: #666; }
</style>
