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
          <span class="drug-icon"><van-icon name="orders-o" size="20" color="var(--primary-green)" /></span>
          <div class="drug-info">
            <div class="drug-name">{{ r.drugName }}</div>
            <div class="drug-dosage">{{ r.dosage }} · {{ r.frequency === 'daily' ? '每日' : '每周' }} · {{ r.time }}</div>
          </div>
          <van-switch :model-value="r.enabled" size="20" active-color="var(--primary-green)" />
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
.medications-page { min-height: 100vh; background: var(--bg); }
.content { padding: 16px; }
.card { background: #fff; border-radius: var(--radius-md); padding: 16px; margin-bottom: 12px; box-shadow: var(--shadow-sm); }
.card-header { display: flex; align-items: center; gap: 12px; }
.drug-icon {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(16, 185, 129, 0.12);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.drug-info { flex: 1; }
.drug-name { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.drug-dosage { font-size: 14px; color: var(--text-secondary); margin-top: 2px; }
.card-body { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-light); }
.info-row { display: flex; justify-content: space-between; font-size: 14px; padding: 4px 0; color: var(--text-secondary); }
</style>
