import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

import { getMembers } from '@/api/member'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()

  // 目前登入者
  const user = ref(null)

  // 登入
  const login = async (account, password) => {
    const members = await getMembers()

    const member = members.find((item) => item.name === account && item.password === password)

    if (!member) {
      return {
        success: false,
      }
    }

    user.value = member

    return {
      success: true,
    }
  }

  // 登出功能
  const logout = () => {
    user.value = null
    router.push({ name: 'Login' })
  }

  return {
    login,
    logout,
    user,
  }
})
