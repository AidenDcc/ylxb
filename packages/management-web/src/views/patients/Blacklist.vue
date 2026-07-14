<template>
  <div class="page-container">
    <div class="page-header">
      <el-button link @click="$router.push('/patients/list')">
        <el-icon><ArrowLeft /></el-icon>返回患者列表
      </el-button>
      <h2 style="margin-top: 8px">黑名单管理</h2>
    </div>

    <el-card>
      <el-table :data="blacklist" stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="患者姓名" min-width="120" />
        <el-table-column prop="phone" label="手机号" min-width="140" />
        <el-table-column prop="reason" label="拉黑原因" min-width="200" />
        <el-table-column prop="createdAt" label="拉黑时间" min-width="160">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleRemove(row)">
              解除拉黑
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无黑名单数据">
            <el-button type="primary" @click="$router.push('/patients/list')">
              返回患者列表
            </el-button>
          </el-empty>
        </template>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { formatDate } from '@ylxb/shared'

interface BlacklistItem {
  id: string
  name: string
  phone: string
  reason: string
  createdAt: string
}

const blacklist = ref<BlacklistItem[]>([])
const loading = ref(false)

function formatTime(str?: string): string {
  if (!str) return '-'
  return formatDate(str, 'YYYY-MM-DD HH:mm')
}

async function fetchBlacklist() {
  loading.value = true
  try {
    // Mock data for blacklist
    blacklist.value = [
      {
        id: 'b1',
        name: '赵六',
        phone: '138****6666',
        reason: '多次恶意骚扰医生',
        createdAt: '2024-07-15T10:00:00Z',
      },
      {
        id: 'b2',
        name: '钱七',
        phone: '138****7777',
        reason: '违规购买处方药品',
        createdAt: '2024-08-01T14:00:00Z',
      },
    ]
  } finally {
    loading.value = false
  }
}

async function handleRemove(row: BlacklistItem) {
  try {
    await ElMessageBox.confirm(`确定要解除「${row.name}」的黑名单状态吗？`, '解除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    })
    blacklist.value = blacklist.value.filter((item) => item.id !== row.id)
    ElMessage.success('已解除黑名单')
  } catch {
    // cancelled
  }
}

onMounted(() => {
  fetchBlacklist()
})
</script>
