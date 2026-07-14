<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get, post } from '@ylxb/shared'
import { showToast } from 'vant'
import type { Patient } from '@ylxb/shared'

const router = useRouter()
const loading = ref(false)

const patients = ref<Patient[]>([])
const form = ref({
  patientId: '',
  title: '',
  description: '',
  frequency: 'monthly' as string,
  startDate: '',
  endDate: '',
})

onMounted(async () => {
  const res = await get<Patient[]>('/doctor/patients')
  if (res.code === 0) {
    patients.value = (res.data as unknown as Patient[]) || []
  }
})

function showPatientPicker() {
  // Simple approach: use a van-action-sheet like pattern
}

const frequencyOptions = [
  { text: '每天', value: 'daily' },
  { text: '每周', value: 'weekly' },
  { text: '每两周', value: 'biweekly' },
  { text: '每月', value: 'monthly' },
  { text: '自定义', value: 'custom' },
]

async function handleSubmit() {
  if (!form.value.patientId || !form.value.title) {
    showToast('请填写必填信息')
    return
  }
  loading.value = true
  const res = await post('/doctor/follow-ups', form.value)
  loading.value = false
  if (res.code === 0) {
    showToast('创建成功')
    router.back()
  } else {
    showToast(res.message)
  }
}
</script>

<template>
  <div class="follow-up-create-page">
    <van-nav-bar title="创建随访计划" left-arrow @click-left="router.back()" />

    <div class="form-section">
      <!-- 患者选择 -->
      <van-field
        v-model="form.patientId"
        is-link
        readonly
        label="选择患者"
        placeholder="请选择患者"
        @click="showPatientPicker"
      />
      <!-- 简单患者列表 -->
      <div class="patient-selector">
        <van-radio-group v-model="form.patientId">
          <div
            v-for="p in patients"
            :key="p.id"
            class="patient-option"
          >
            <van-radio :name="p.id">
              <span class="option-name">{{ p.name }}</span>
              <span class="option-meta">{{ p.gender === 'male' ? '男' : '女' }} · {{ p.phone }}</span>
              <span v-if="p.medicalHistory && p.medicalHistory.length" class="option-tags">
                <van-tag v-for="tag in p.medicalHistory.slice(0, 2)" :key="tag" type="warning" size="mini" plain style="margin-left:4px">
                  {{ tag }}
                </van-tag>
              </span>
            </van-radio>
          </div>
        </van-radio-group>
      </div>

      <van-field v-model="form.title" label="随访标题" placeholder="例如：高血压长期随访管理" />
      <van-field v-model="form.description" label="随访说明" placeholder="描述随访目的和注意事项" type="textarea" rows="3" autosize />

      <van-field
        v-model="form.frequency"
        is-link
        readonly
        label="随访频率"
        placeholder="请选择频率"
        @click="showFrequencyPicker = true"
      />

      <van-field v-model="form.startDate" label="开始日期" placeholder="yyyy-mm-dd" />
      <van-field v-model="form.endDate" label="结束日期" placeholder="yyyy-mm-dd" />

      <div style="padding: 20px 16px;">
        <van-button type="primary" block round :loading="loading" @click="handleSubmit">创建计划</van-button>
      </div>
    </div>

    <!-- 频率选择弹窗 -->
    <van-popup v-model:show="showFrequencyPicker" position="bottom" round>
      <van-picker
        :columns="frequencyOptions"
        @confirm="(option: any) => { form.frequency = option.value; showFrequencyPicker = false }"
        @cancel="showFrequencyPicker = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
const showFrequencyPicker = ref(false)
</script>

<style scoped>
.follow-up-create-page { min-height: 100vh; background: #f5f7fa; padding-bottom: 20px; }
.form-section { background: #fff; margin: 12px; border-radius: 12px; overflow: hidden; }
.patient-selector { padding: 0 16px; max-height: 200px; overflow-y: auto; }
.patient-option { padding: 10px 0; border-bottom: 1px solid #f5f5f5; }
.patient-option:last-child { border-bottom: none; }
.option-name { font-size: 15px; font-weight: 500; }
.option-meta { font-size: 12px; color: #999; margin-left: 8px; }
.option-tags { display: inline-flex; }
</style>
