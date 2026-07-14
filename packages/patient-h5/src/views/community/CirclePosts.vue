<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { Post } from '@ylxb/shared'
import { timeAgo } from '@ylxb/shared'

const route = useRoute()
const router = useRouter()
const posts = ref<Post[]>([])
const loading = ref(true)

onMounted(async () => {
  const circleId = route.params.id as string
  const res = await get<Post[]>(`/community/posts?circleId=${circleId}`)
  if (res.code === 0) posts.value = res.data as unknown as Post[]
  loading.value = false
})
</script>

<template>
  <div class="posts-page">
    <van-nav-bar title="圈子帖子" left-arrow @click-left="router.back()">
      <template #right>
        <van-icon name="add-o" size="22" @click="router.push('/community/create-post')" />
      </template>
    </van-nav-bar>
    <div class="post-list">
      <div v-for="p in posts" :key="p.id" class="post-card" @click="router.push(`/community/post/${p.id}`)">
        <div v-if="p.isPinned" class="pinned">📌 置顶</div>
        <div class="p-header">
          <span class="p-avatar">{{ p.authorAvatar }}</span>
          <div class="p-author">
            <div class="p-name">
              {{ p.authorName }}
              <van-tag v-if="p.authorRole === 'doctor'" size="mini" type="primary">医生</van-tag>
            </div>
            <div class="p-tenants" v-if="p.authorTenants.length">{{ p.authorTenants.join('、') }}</div>
          </div>
          <span class="p-time">{{ timeAgo(p.createdAt) }}</span>
        </div>
        <div class="p-content">{{ p.content.slice(0, 100) }}{{ p.content.length > 100 ? '...' : '' }}</div>
        <div class="p-footer">
          <span>❤️ {{ p.likeCount }}</span>
          <span>💬 {{ p.commentCount }}</span>
          <span>⭐ {{ p.collectCount }}</span>
        </div>
      </div>
      <van-empty v-if="!loading && posts.length === 0" description="暂无帖子" />
    </div>
  </div>
</template>

<style scoped>
.posts-page { min-height: 100vh; background: #f5f7fa; }
.post-list { padding: 12px 16px; }
.post-card { background: #fff; border-radius: 12px; padding: 14px; margin-bottom: 10px; cursor: pointer; }
.pinned { font-size: 11px; color: #FA8C16; margin-bottom: 6px; }
.p-header { display: flex; align-items: center; gap: 8px; }
.p-avatar { font-size: 32px; }
.p-author { flex: 1; }
.p-name { font-size: 13px; font-weight: 500; }
.p-tenants { font-size: 10px; color: #999; }
.p-time { font-size: 11px; color: #ccc; }
.p-content { font-size: 14px; line-height: 1.6; margin: 8px 0; color: #333; }
.p-footer { display: flex; gap: 16px; font-size: 12px; color: #999; }
</style>
