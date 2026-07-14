<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { VitalSign } from '@ylxb/shared'
import { VitalSignLabels, VitalSignUnits } from '@ylxb/shared'

const router = useRouter()
const signs = ref<VitalSign[]>([])
const loading = ref(true)

onMounted(async () => {
  const res = await get<VitalSign[]>('/health/vital-signs')
  if (res.code === 0) signs.value = res.data as unknown as VitalSign[]
  loading.value = false
})

// 按类型分组
const grouped = computed(() => {
  const map: Record<string, VitalSign[]> = {}
  for (const s of signs.value) {
    if (!map[s.type]) map[s.type] = []
    map[s.type].push(s)
  }
  return map
})
</script>

<template>
  <div class="vital-page">
    <van-nav-bar title="体征数据" left-arrow @click-left="router.back()" />
    <van-pull-refresh v-model="loading" @refresh="onMounted">
      <div class="content">
        <div v-for="(items, type) in grouped" :key="type" class="type-section">
          <div class="type-header">
            <h3>{{ VitalSignLabels[type] || type }}</h3>
            <span class="unit">单位：{{ VitalSignUnits[type] || '' }}</span>
          </div>
          <div class="value-list">
            <div v-for="s in items.slice(0, 7)" :key="s.id" class="value-item" :class="{ abnormal: s.isAbnormal }">
              <span class="val">{{ s.value }}</span>
              <span class="time">{{ s.recordedAt?.slice(5, 16)?.replace('T', ' ') || '' }}</span>
              <van-tag v-if="s.isAbnormal" size="medium" type="danger">异常</van-tag>
            </div>
          </div>
        </div>
        <van-empty v-if="!loading && Object.keys(grouped).length === 0" description="暂无体征数据" />
      </div>
    </van-pull-refresh>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
</script>

<style scoped>
.vital-page { min-height: 100vh; background: #f5f7fa; }
.content { padding: 16px; }
.type-section { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
.type-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.type-header h3 { font-size: 15px; }
.unit { font-size: 11px; color: #999; }
.value-item { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
.value-item:last-child { border-bottom: none; }
.value-item.abnormal { background: #fff2f0; margin: 0 -16px; padding: 8px 16px; }
.val { font-size: 20px; font-weight: 700; min-width: 60px; }
.value-item.abnormal .val { color: var(--danger); }
.time { font-size: 12px; color: #999; flex: 1; }
</style>
