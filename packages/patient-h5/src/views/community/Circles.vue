<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@ylxb/shared'
import type { Circle } from '@ylxb/shared'

const router = useRouter()
const circles = ref<Circle[]>([])
const loading = ref(true)

onMounted(async () => {
  const res = await get<Circle[]>('/community/circles')
  if (res.code === 0) circles.value = res.data as unknown as Circle[]
  loading.value = false
})
</script>

<template>
  <div class="circles-page">
    <van-nav-bar title="病友圈子" />
    <van-search placeholder="搜索圈子" shape="round" />
    <div class="circle-list">
      <div v-for="c in circles" :key="c.id" class="circle-card" @click="router.push(`/community/circle/${c.id}`)">
        <span class="cover">{{ c.coverImage }}</span>
        <div class="info">
          <div class="name">
            {{ c.name }}
            <van-tag v-if="c.isOfficial" size="medium" type="primary">官方</van-tag>
          </div>
          <div class="desc">{{ c.description }}</div>
          <div class="stats">{{ c.memberCount }} 成员 · {{ c.postCount }} 帖子</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.circles-page { min-height: 100vh; background: #f5f7fa; }
.circle-list { padding: 0 16px; }
.circle-card { background: #fff; border-radius: 12px; padding: 14px; margin-bottom: 10px; display: flex; gap: 12px; cursor: pointer; }
.cover { font-size: 40px; }
.info { flex: 1; }
.name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.desc { font-size: 12px; color: #999; margin-bottom: 4px; }
.stats { font-size: 11px; color: #ccc; }
</style>
