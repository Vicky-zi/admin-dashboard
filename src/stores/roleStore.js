import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getRoles, updateRole, getRoleById } from '@/api/role'

export const useRoleStore = defineStore('role', () => {
  const items = ref([])
  const current = ref(null)
  const loading = ref(false)

  const statusOptions = [
    { title: '啟用', value: 1 },
    { title: '停用', value: 0 },
  ]

  const getStatusText = (value) => {
    return statusOptions.find((item) => item.value === value)?.title || '-'
  }

  // 讀取權限列表
  const fetchRoleList = async () => {
    try {
      loading.value = true
      items.value = await getRoles()
    } finally {
      loading.value = false
    }
  }

  // 取得單一會員
  const fetchRoleDetail = async (id) => {
    current.value = await getRoleById(id)
  }

  // 更新會員
  const update = async (id, data) => {
    await updateRole(id, data)
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
    fetchRoleList,
    fetchRoleDetail,
    update,
    remove,
    statusOptions,
    getStatusText,
  }
})
