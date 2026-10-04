import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

import { getAccounts } from '@/api/account'
import { getRoles } from '@/api/role'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()

  // 目前登入者
  const user = ref(null)

  // Session 到期時間
  const sessionExpireAt = ref(null)

  // 登入
  const login = async (loginAccount, loginPassword) => {
    const accounts = await getAccounts()

    const account = accounts.find((item) => item.acc === loginAccount && item.paw === loginPassword)

    console.log('帳號：', account)
    const roles = await getRoles()
    const role = roles.find((item) => item.id === account.roleId)

    console.log('權限：', role)
    // 登入後 15 分鐘到期
    sessionExpireAt.value = Date.now() + 15 * 60 * 1000

    if (!account) {
      return {
        success: false,
      }
    }

    user.value = { ...account, role: role.role, roleName: role.name, permissions: role.permissions }

    return {
      success: true,
    }
  }

  // 登出功能
  const logout = () => {
    user.value = null
    sessionExpireAt.value = null
    router.push({ name: 'Login' })
  }

  return {
    login,
    logout,
    user,
    sessionExpireAt,
  }
})
