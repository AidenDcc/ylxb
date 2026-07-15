import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storage } from '@ylxb/shared'

export const useElderlyStore = defineStore('elderly', () => {
  const enabled = ref<boolean>(storage.get<boolean>('elderly_mode') || false)

  function toggle() {
    enabled.value = !enabled.value
    storage.set('elderly_mode', enabled.value)
  }

  return { enabled, toggle }
})
