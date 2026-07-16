<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get, post } from '@ylxb/shared'
import type { Post, Comment } from '@ylxb/shared'
import { timeAgo } from '@ylxb/shared'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const postDetail = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const commentText = ref('')
const sending = ref(false)

onMounted(async () => {
  const postId = route.params.id as string
  const [pRes, cRes] = await Promise.all([
    get<Post>(`/community/posts/${postId}`),
    get<Comment[]>(`/community/comments/${postId}`),
  ])
  if (pRes.code === 0) postDetail.value = pRes.data as unknown as Post
  if (cRes.code === 0) comments.value = cRes.data as unknown as Comment[]
})

async function handleLike() {
  const res = await post('/community/like', { postId: route.params.id as string })
  if (res.code === 0 && postDetail.value) { postDetail.value.isLiked = true; postDetail.value.likeCount++ }
}

async function handleCollect() {
  const res = await post('/community/collect', { postId: route.params.id as string })
  if (res.code === 0 && postDetail.value) { postDetail.value.isCollected = true; postDetail.value.collectCount++; showToast('已收藏') }
}

async function handleComment() {
  if (!commentText.value.trim()) return
  sending.value = true
  const res = await post<Comment>('/community/comments', {
    postId: route.params.id as string,
    authorId: 'p1',
    authorName: '我',
    authorAvatar: '👤',
    authorRole: 'patient',
    content: commentText.value,
  })
  if (res.code === 0) { comments.value.push(res.data as unknown as Comment); commentText.value = '' }
  sending.value = false
}
</script>

<template>
  <div class="post-detail" v-if="postDetail">
    <van-nav-bar title="帖子详情" left-arrow @click-left="router.back()" />
    <div class="content">
      <div class="post-header">
        <span class="avatar">{{ postDetail.authorAvatar }}</span>
        <div>
          <div class="name">{{ postDetail.authorName }} <van-tag v-if="postDetail.authorRole==='doctor'" size="medium" type="primary">医生</van-tag></div>
          <div class="time">{{ timeAgo(postDetail.createdAt) }}</div>
        </div>
      </div>
      <div class="post-body">{{ postDetail.content }}</div>
      <div class="post-actions">
        <span @click="handleLike"><van-icon :name="postDetail.isLiked ? 'like' : 'like-o'" size="16" /> {{ postDetail.likeCount }}</span>
        <span><van-icon name="comment-o" size="16" /> {{ postDetail.commentCount }}</span>
        <span @click="handleCollect"><van-icon :name="postDetail.isCollected ? 'star' : 'star-o'" size="16" /> {{ postDetail.collectCount }}</span>
      </div>
    </div>
    <!-- 评论列表 -->
    <div class="comments-section">
      <h4>评论 ({{ comments.length }})</h4>
      <div v-for="c in comments" :key="c.id" class="comment-item">
        <span class="c-avatar">{{ c.authorAvatar }}</span>
        <div class="c-body">
          <div class="c-name">{{ c.authorName }}</div>
          <div class="c-text">{{ c.content }}</div>
          <div class="c-time">{{ timeAgo(c.createdAt) }}</div>
        </div>
      </div>
    </div>
    <!-- 评论输入 -->
    <div class="comment-bar">
      <van-field v-model="commentText" placeholder="写评论..." />
      <van-button type="primary" size="small" :loading="sending" @click="handleComment">发送</van-button>
    </div>
  </div>
</template>

<style scoped>
.post-detail { min-height: 100vh; background: var(--bg); padding-bottom: 50px; }
.content { background: #fff; padding: 16px; margin: 12px 16px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); }
.post-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.avatar { font-size: 36px; }
.name { font-size: 14px; font-weight: 500; color: var(--text-primary); }
.time { font-size: 14px; color: var(--text-tertiary); }
.post-body { font-size: 15px; line-height: 1.8; white-space: pre-wrap; color: var(--text-primary); }
.post-actions { display: flex; gap: 20px; margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border-light); font-size: 14px; cursor: pointer; color: var(--text-secondary); }
.post-actions span { display: flex; align-items: center; gap: 2px; }
.comments-section { background: #fff; margin: 0 16px 12px; border-radius: var(--radius-md); padding: 16px; box-shadow: var(--shadow-sm); }
.comments-section h4 { font-size: 14px; margin-bottom: 12px; color: var(--text-primary); }
.comment-item { display: flex; gap: 8px; margin-bottom: 12px; }
.c-avatar { font-size: 28px; }
.c-name { font-size: 14px; color: var(--text-secondary); }
.c-text { font-size: 14px; margin-top: 2px; color: var(--text-primary); }
.c-time { font-size: 14px; color: var(--text-tertiary); margin-top: 2px; }
.comment-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-top: 1px solid var(--border); box-shadow: 0 -1px 3px rgba(0,0,0,0.04); }
</style>
