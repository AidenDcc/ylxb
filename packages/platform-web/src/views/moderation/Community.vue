<template>
  <div class="page-container">
    <div class="page-header">
      <h2>社区内容审核</h2>
    </div>

    <div class="filter-bar">
      <el-select v-model="statusFilter" placeholder="状态筛选" clearable @change="fetchPosts">
        <el-option label="全部" value="" />
        <el-option label="正常" value="normal" />
        <el-option label="已隐藏" value="hidden" />
      </el-select>
      <el-input v-model="searchText" placeholder="搜索帖子内容/作者" clearable />
    </div>

    <div class="table-card">
      <el-table :data="filteredPosts" border stripe v-loading="loading" style="width: 100%">
        <el-table-column label="作者" width="120">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 6px">
              <span>{{ row.authorAvatar }}</span>
              <span>{{ row.authorName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="身份" width="80">
          <template #default="{ row }">
            <el-tag :type="row.authorRole === 'doctor' ? 'success' : 'info'" size="small">
              {{ row.authorRole === 'doctor' ? '医生' : '患者' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="260" show-overflow-tooltip />
        <el-table-column prop="circleName" label="所属圈子" width="140" />
        <el-table-column label="所属租户" width="120">
          <template #default="{ row }">
            <el-tag
              v-for="t in row.authorTenants"
              :key="t"
              size="small"
              style="margin-right: 4px"
            >
              {{ t }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="likeCount" label="点赞" width="70" align="center" />
        <el-table-column prop="commentCount" label="评论" width="70" align="center" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : 'danger'" size="small">
              {{ row.status === 'normal' ? '正常' : '已隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="发布时间" width="170">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'normal'"
              type="danger"
              size="small"
              @click="handleHide(row)"
            >
              隐藏
            </el-button>
            <span v-else style="color: #909399; font-size: 13px">已处理</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 隐藏确认弹窗 -->
    <el-dialog
      v-model="hideVisible"
      title="确认隐藏帖子"
      width="460px"
      @closed="hideReason = ''"
    >
      <el-form label-width="80px">
        <el-form-item label="帖子内容">
          <p style="color: #606266; max-height: 80px; overflow-y: auto">
            {{ currentPost?.content }}
          </p>
        </el-form-item>
        <el-form-item label="隐藏原因">
          <el-input
            v-model="hideReason"
            type="textarea"
            :rows="3"
            placeholder="请填写违规原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="hideVisible = false">取消</el-button>
        <el-button type="danger" :loading="actionLoading" @click="doHide">
          确认隐藏
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { get, post, formatDate as sharedFormatDate } from '@ylxb/shared'
import { ElMessage } from 'element-plus'
import type { Post } from '@ylxb/shared'

const posts = ref<Post[]>([])
const loading = ref(false)
const actionLoading = ref(false)
const searchText = ref('')
const statusFilter = ref('')

const hideVisible = ref(false)
const hideReason = ref('')
const currentPost = ref<Post | null>(null)

const filteredPosts = computed(() => {
  return posts.value.filter((p) => {
    if (searchText.value) {
      const kw = searchText.value.toLowerCase()
      if (!p.content.includes(kw) && !p.authorName.includes(kw)) return false
    }
    if (statusFilter.value && p.status !== statusFilter.value) return false
    return true
  })
})

function formatDate(dateStr: string): string {
  return sharedFormatDate(dateStr, 'YYYY-MM-DD HH:mm') || dateStr
}

function handleHide(row: Post) {
  currentPost.value = row
  hideReason.value = ''
  hideVisible.value = true
}

async function doHide() {
  if (!currentPost.value) return
  actionLoading.value = true
  const res = await post(`/platform/moderation/posts/${currentPost.value.id}/hide`, {
    reason: hideReason.value,
  })
  actionLoading.value = false
  if (res.code === 0) {
    ElMessage.success('帖子已隐藏')
    hideVisible.value = false
    fetchPosts()
  } else {
    ElMessage.error(res.message || '操作失败')
  }
}

async function fetchPosts() {
  loading.value = true
  const res = await get<Post[]>('/platform/moderation/posts')
  loading.value = false
  if (res.code === 0) {
    posts.value = res.data
  } else {
    ElMessage.error('获取数据失败')
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
</style>
