<script setup lang="ts">
import { watch } from 'vue'
import { useElderlyStore } from '@/stores/elderly'

const elderlyStore = useElderlyStore()

watch(() => elderlyStore.enabled, (val) => {
  document.documentElement.classList.toggle('elderly-mode', val)
}, { immediate: true })
</script>

<template>
  <router-view />
</template>
