<template>
  <div class="page-container">
    <div class="page-header">
      <h2>机构设置</h2>
    </div>

    <el-row :gutter="16">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-title">基本信息</div>
          </template>
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="120px"
            size="large"
          >
            <el-form-item label="机构名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入机构名称" />
            </el-form-item>

            <el-form-item label="机构类型">
              <el-tag size="large">{{ tenantTypeLabel(form.type) }}</el-tag>
            </el-form-item>

            <el-form-item label="机构LOGO">
              <el-input v-model="form.logo" placeholder="请输入LOGO emoji或URL" />
            </el-form-item>

            <el-form-item label="机构描述" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="3"
                placeholder="请输入机构描述"
              />
            </el-form-item>

            <el-form-item label="机构地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入机构地址" />
            </el-form-item>

            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>

            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="请输入联系人姓名" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :loading="saving" @click="handleSave">
                {{ saving ? '保存中...' : '保存设置' }}
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card style="margin-bottom: 16px">
          <template #header>
            <div class="card-title">机构统计</div>
          </template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="医生数量">{{ form.doctorCount }} 人</el-descriptions-item>
            <el-descriptions-item label="患者数量">{{ form.patientCount.toLocaleString() }} 人</el-descriptions-item>
            <el-descriptions-item label="入驻时间">{{ form.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="机构状态">
              <el-tag type="success" size="small">正常运营</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card>
          <template #header>
            <div class="card-title">危险操作</div>
          </template>
          <el-alert
            title="注销机构"
            type="error"
            description="注销后所有数据将被清除，此操作不可恢复。"
            show-icon
            :closable="false"
            style="margin-bottom: 12px"
          />
          <el-button type="danger" plain style="width: 100%" @click="handleDeactivate">
            注销机构
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

interface SettingsForm {
  name: string
  type: string
  logo: string
  description: string
  address: string
  contactPhone: string
  contactPerson: string
  doctorCount: number
  patientCount: number
  createdAt: string
}

const formRef = ref<FormInstance>()
const saving = ref(false)

const form = reactive<SettingsForm>({
  name: '仁济医院',
  type: 'hospital',
  logo: '🏥',
  description: '三级甲等综合医院，提供全面慢病管理服务',
  address: '上海市黄浦区南京东路100号',
  contactPhone: '021-12345678',
  contactPerson: '张院长',
  doctorCount: 45,
  patientCount: 3200,
  createdAt: '2024-01-15',
})

const originalForm = { ...form }

const rules: FormRules = {
  name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  contactPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
}

function tenantTypeLabel(type: string): string {
  const map: Record<string, string> = {
    hospital: '医院',
    pharmacy: '药房',
    clinic: '诊所',
  }
  return map[type] || type
}

function handleSave() {
  saving.value = true
  setTimeout(() => {
    Object.assign(originalForm, { ...form })
    saving.value = false
    ElMessage.success('机构设置保存成功')
  }, 1000)
}

function handleReset() {
  Object.assign(form, originalForm)
  ElMessage.info('已恢复原始设置')
}

async function handleDeactivate() {
  try {
    await ElMessageBox.confirm(
      '确定要注销当前机构吗？注销后所有数据将被清除，此操作不可恢复。',
      '注销机构',
      {
        confirmButtonText: '确认注销',
        cancelButtonText: '取消',
        type: 'error',
      }
    )
    ElMessage.success('注销申请已提交，管理员审核后生效')
  } catch {
    // cancelled
  }
}
</script>

<style scoped>
.card-title {
  font-size: 16px;
  font-weight: 600;
}
</style>
