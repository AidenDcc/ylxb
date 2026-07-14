<template>
  <div class="page-container">
    <div class="page-header">
      <h2>知识库</h2>
      <span style="font-size: 13px; color: #909399">医学知识库文章管理</span>
    </div>

    <div class="filter-bar">
      <el-input v-model="searchText" placeholder="搜索文章标题" clearable />
      <span style="flex: 1; min-width: 0"></span>
    </div>

    <div class="table-card">
      <el-table :data="filteredKnowledge" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="title" label="文章标题" min-width="300" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="130">
          <template #default="{ row }">
            <el-tag type="primary" size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者/来源" width="140" />
        <el-table-column prop="updatedAt" label="更新时间" width="140">
          <template #default="{ row }">
            {{ row.updatedAt }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="viewArticle(row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="!loading" style="margin-top: 16px; color: #909399; font-size: 13px">
      共 {{ filteredKnowledge.length }} 篇文章
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { get } from '@ylxb/shared'
import { ElMessage } from 'element-plus'

interface KnowledgeArticle {
  id: string
  title: string
  category: string
  author: string
  updatedAt: string
}

const knowledgeList = ref<KnowledgeArticle[]>([])
const loading = ref(false)
const searchText = ref('')

const filteredKnowledge = computed(() => {
  if (!searchText.value) return knowledgeList.value
  const kw = searchText.value.toLowerCase()
  return knowledgeList.value.filter((k) => k.title.toLowerCase().includes(kw))
})

function viewArticle(article: any) {
  ElMessage.info(`查看文章: ${article.title}`)
}

async function fetchKnowledge() {
  loading.value = true
  const res = await get<KnowledgeArticle[]>('/platform/compliance/knowledge')
  loading.value = false
  if (res.code === 0) {
    knowledgeList.value = res.data
  } else {
    ElMessage.error('获取数据失败')
  }
}

onMounted(() => {
  fetchKnowledge()
})
</script>

<style scoped>
</style>
