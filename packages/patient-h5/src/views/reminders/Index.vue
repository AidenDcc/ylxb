<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get, post, del } from '@ylxb/shared'
import type { MedicationReminder } from '@ylxb/shared'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const reminders = ref<MedicationReminder[]>([])
const loading = ref(true)

async function fetchReminders() {
  const res = await get<MedicationReminder[]>('/health/reminders')
  if (res.code === 0) reminders.value = res.data as unknown as MedicationReminder[]
  loading.value = false
}

onMounted(fetchReminders)

async function toggleReminder(r: MedicationReminder) {
  const res = await post(`/health/reminders/${r.id}`, { ...r, enabled: !r.enabled })
  if (res.code === 0) r.enabled = !r.enabled
}

async function deleteReminder(id: string) {
  await showConfirmDialog({ title: '确认删除', message: '确定要删除这条用药提醒吗？' })
  const res = await del(`/health/reminders/${id}`)
  if (res.code === 0) {
    reminders.value = reminders.value.filter(r => r.id !== id)
    showToast('已删除')
  }
}
</script>

<template>
  <div class="reminders-page">
    <van-nav-bar title="用药提醒" left-arrow @click-left="router.back()" />
    <div class="content">
      <div class="card" v-for="r in reminders" :key="r.id">
        <div class="card-head">
          <div class="time-badge">{{ r.time }}</div>
          <div class="drug-info">
            <div class="drug-name">{{ r.drugName }}</div>
            <div class="drug-meta">{{ r.dosage }} · {{ r.frequency === 'daily' ? '每天' : r.frequency === 'weekly' ? '每周' : '自定义' }}</div>
          </div>
          <van-switch :model-value="r.enabled" @update:model-value="toggleReminder(r)" size="20" active-color="var(--primary-green)" />
        </div>
        <div class="card-foot">
          <span>{{ r.startDate }} ~ {{ r.endDate }}</span>
          <van-button size="mini" plain type="danger" @click="deleteReminder(r.id)">删除</van-button>
        </div>
      </div>
      <van-empty v-if="!loading && reminders.length === 0" description="暂无用药提醒" />
    </div>
  </div>
</template>

<style scoped>
.reminders-page { min-height: 100vh; background: var(--bg); }
.content { padding: 16px; }
.card { background: #fff; border-radius: var(--radius-md); padding: 16px; margin-bottom: 12px; }
.card-head { display: flex; align-items: center; gap: 12px; }
.time-badge { background: linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light)); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; white-space: nowrap; }
.drug-info { flex: 1; }
.drug-name { font-size: 15px; font-weight: 600; }
.drug-meta { font-size: 14px; color: var(--text-secondary); margin-top: 2px; }
.card-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-light); font-size: 14px; color: var(--text-tertiary); }
</style>
