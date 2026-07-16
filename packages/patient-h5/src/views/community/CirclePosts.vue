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
        <div v-if="p.isPinned" class="pinned"><van-tag type="warning" size="medium">置顶</van-tag></div>
        <div class="p-header">
          <span class="p-avatar">{{ p.authorAvatar }}</span>
          <div class="p-author">
            <div class="p-name">
              {{ p.authorName }}
              <van-tag v-if="p.authorRole === 'doctor'" size="medium" type="primary">医生</van-tag>
            </div>
            <div class="p-tenants" v-if="p.authorTenants.length">{{ p.authorTenants.join('、') }}</div>
          </div>
          <span class="p-time">{{ timeAgo(p.createdAt) }}</span>
        </div>
        <div class="p-content">{{ p.content.slice(0, 100) }}{{ p.content.length > 100 ? '...' : '' }}</div>
        <div class="p-footer">
          <span><van-icon name="like-o" size="14" /> {{ p.likeCount }}</span>
          <span><van-icon name="comment-o" size="14" /> {{ p.commentCount }}</span>
          <span><van-icon name="star-o" size="14" /> {{ p.collectCount }}</span>
        </div>
      </div>
      <van-empty v-if="!loading && posts.length === 0" description="暂无帖子" />
    </div>
  </div>
</template>

<style scoped>
.posts-page { min-height: 100vh; background: var(--bg); }
.post-list { padding: 12px 16px; }
.post-card { background: #fff; border-radius: var(--radius-md); padding: 14px; margin-bottom: 10px; cursor: pointer; box-shadow: var(--shadow-sm); }
.pinned { margin-bottom: 6px; }
.p-header { display: flex; align-items: center; gap: 8px; }
.p-avatar { font-size: 32px; }
.p-author { flex: 1; }
.p-name { font-size: 14px; font-weight: 500; color: var(--text-primary); }
.p-tenants { font-size: 14px; color: var(--text-secondary); }
.p-time { font-size: 14px; color: var(--text-tertiary); }
.p-content { font-size: 14px; line-height: 1.6; margin: 8px 0; color: var(--text-primary); }
.p-footer { display: flex; gap: 16px; font-size: 14px; color: var(--text-secondary); }
.p-footer span { display: flex; align-items: center; gap: 2px; }
</style>
