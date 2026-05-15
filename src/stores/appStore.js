import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  // ---- loader----
  const showLoader = ref(false)
  const closeLoader = () => (showLoader.value = false)
  const openLoader = () => (showLoader.value = true)

  // ---- sidebar----
  const showSidebar = ref(true)

  return {
    showLoader, // loader是否打開
    closeLoader, // 關閉loader
    openLoader, // 打開loader
    showSidebar,
  }
})
