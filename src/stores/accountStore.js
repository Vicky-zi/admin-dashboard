import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getAccounts, updateAccount, getAccountById } from '@/api/account'

export const useAccountStore = defineStore('account', () => {
  const items = ref([])
  const current = ref(null)
  const loading = ref(false)

  // 讀取會員列表
  const fetchAccountList = async () => {
    try {
      loading.value = true
      items.value = await getAccounts()
    } finally {
      loading.value = false
    }
  }

  // 取得單一會員
  const fetchAccountDetail = async (id) => {
    current.value = await getAccountById(id)
  }

  // 更新會員
  const update = async (id, data) => {
    await updateAccount(id, data)
  }

  // 刪除
  const remove = async (id) => {
    try {
      loading.value = true
      const index = items.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        items.value.splice(index, 1)
      }
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    current,
    loading,
    fetchAccountList,
    fetchAccountDetail,
    update,
    remove,
  }
})
