<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get, post } from '@ylxb/shared'
import type { Circle } from '@ylxb/shared'
import { showToast } from 'vant'

const router = useRouter()
const circles = ref<Circle[]>([])
const selectedCircle = ref('c1')
const content = ref('')
const sending = ref(false)

onMounted(async () => {
  const res = await get<Circle[]>('/community/circles')
  if (res.code === 0) circles.value = res.data as unknown as Circle[]
})

async function handlePublish() {
  if (!content.value.trim()) { showToast('请输入内容'); return }
  sending.value = true
  const res = await post('/community/posts', {
    circleId: selectedCircle.value,
    authorId: 'p1',
    authorName: '张建国',
    authorAvatar: '👨‍🦳',
    authorRole: 'patient',
    authorTenants: ['仁济医院'],
    content: content.value,
    images: [],
  })
  sending.value = false
  if (res.code === 0) { showToast('发布成功'); router.back() }
}
</script>

<template>
  <div class="create-page">
    <van-nav-bar title="发布帖子" left-arrow @click-left="router.back()" />
    <div class="form">
      <div class="field">
        <label>选择圈子</label>
        <van-radio-group v-model="selectedCircle" direction="horizontal">
          <van-radio v-for="c in circles" :key="c.id" :name="c.id">{{ c.name }}</van-radio>
        </van-radio-group>
      </div>
      <van-field v-model="content" type="textarea" rows="6" placeholder="分享你的健康心得..." />
      <van-button type="primary" block round :loading="sending" @click="handlePublish" style="margin-top:24px">发布</van-button>
    </div>
  </div>
</template>

<style scoped>
.create-page { min-height: 100vh; background: var(--bg); }
.form { padding: 16px; }
.field { padding: 12px; margin-bottom: 12px; }
.field label { font-size: 14px; color: var(--text-secondary); display: block; margin-bottom: 8px; }
</style>
