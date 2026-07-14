<template>
  <div class="page-container">
    <div class="page-header">
      <h2>权限模板配置</h2>
    </div>

    <el-row :gutter="16">
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-title">已有模板</div>
          </template>
          <div
            v-for="tmpl in templates"
            :key="tmpl.id"
            class="template-item"
            :class="{ active: selectedId === tmpl.id }"
            @click="selectTemplate(tmpl)"
          >
            <div class="template-name">{{ tmpl.name }}</div>
            <div class="template-desc">{{ tmpl.description }}</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card v-if="selectedTemplate">
          <template #header>
            <div class="card-title">
              编辑权限 - {{ selectedTemplate?.name }}
            </div>
          </template>
          <el-form label-width="160px" size="large">
            <el-form-item label="模板名称">
              <el-input v-model="selectedTemplate.name" />
            </el-form-item>
            <el-form-item label="模板描述">
              <el-input v-model="selectedTemplate.description" type="textarea" :rows="2" />
            </el-form-item>

            <el-divider content-position="left">权限设置</el-divider>

            <el-form-item label="回复患者咨询">
              <el-switch v-model="selectedTemplate.permissions.canReplyConsultation" />
            </el-form-item>
            <el-form-item label="查看患者信息">
              <el-switch v-model="selectedTemplate.permissions.canViewPatient" />
            </el-form-item>
            <el-form-item label="管理随访计划">
              <el-switch v-model="selectedTemplate.permissions.canManageFollowUp" />
            </el-form-item>
            <el-form-item label="查看订单">
              <el-switch v-model="selectedTemplate.permissions.canViewOrders" />
            </el-form-item>
            <el-form-item label="导出数据">
              <el-switch v-model="selectedTemplate.permissions.canExportData" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSave">保存模板</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card v-else>
          <el-empty description="请从左侧选择一个模板进行编辑" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { AssistantPermissions } from '@ylxb/shared'

interface PermissionTemplate {
  id: string
  name: string
  description: string
  permissions: AssistantPermissions
}

const templates = ref<PermissionTemplate[]>([
  {
    id: 'tpl1',
    name: '标准助理模板',
    description: '适用于常规医生助理，可回复咨询、查看患者信息和随访数据',
    permissions: {
      canReplyConsultation: true,
      canViewPatient: true,
      canManageFollowUp: true,
      canViewOrders: false,
      canExportData: false,
    },
  },
  {
    id: 'tpl2',
    name: '高级助理模板',
    description: '适用于高级助理，拥有全部管理权限',
    permissions: {
      canReplyConsultation: true,
      canViewPatient: true,
      canManageFollowUp: true,
      canViewOrders: true,
      canExportData: true,
    },
  },
  {
    id: 'tpl3',
    name: '只读助理模板',
    description: '仅可查看数据，无法进行任何操作',
    permissions: {
      canReplyConsultation: false,
      canViewPatient: true,
      canManageFollowUp: false,
      canViewOrders: true,
      canExportData: false,
    },
  },
])

const selectedId = ref('tpl1')
const selectedTemplate = ref<PermissionTemplate | null>(null)

function selectTemplate(tmpl: PermissionTemplate) {
  selectedId.value = tmpl.id
  selectedTemplate.value = JSON.parse(JSON.stringify(tmpl))
}

function handleSave() {
  if (!selectedTemplate.value) return
  const idx = templates.value.findIndex((t) => t.id === selectedTemplate.value!.id)
  if (idx >= 0) {
    templates.value[idx] = JSON.parse(JSON.stringify(selectedTemplate.value))
  }
  ElMessage.success('权限模板保存成功')
}

function handleReset() {
  if (selectedId.value) {
    const original = templates.value.find((t) => t.id === selectedId.value)
    if (original) {
      selectedTemplate.value = JSON.parse(JSON.stringify(original))
    }
  }
}

// Initialize with first template
selectTemplate(templates.value[0])
</script>

<style scoped>
.card-title {
  font-size: 16px;
  font-weight: 600;
}

.template-item {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.template-item:hover {
  border-color: var(--medical-blue);
}

.template-item.active {
  border-color: var(--medical-blue);
  background: var(--medical-blue-bg);
}

.template-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.template-desc {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
