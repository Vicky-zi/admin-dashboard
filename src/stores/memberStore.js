import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getMembers, updateMember, getMemberById } from '@/api/member'

export const useMemberStore = defineStore('member', () => {
  const items = ref([])
  const current = ref(null)
  const loading = ref(false)

  const roleOptions = [
    { title: 'guest', value: 1 },
    { title: 'admin', value: 0 },
  ]

  const getRoleText = (value) => {
    return roleOptions.find((item) => item.value === value)?.title || '-'
  }

  // 讀取會員列表
  const fetchMemberList = async () => {
    try {
      loading.value = true
      items.value = await getMembers()
    } finally {
      loading.value = false
    }
  }

  // 取得單一會員
  const fetchMemberDetail = async (id) => {
    current.value = await getMemberById(id)
  }

  // 更新會員
  const update = async (id, data) => {
    await updateMember(id, data)
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
    fetchMemberList,
    fetchMemberDetail,
    update,
    remove,
    roleOptions,
    getRoleText,
  }
})
