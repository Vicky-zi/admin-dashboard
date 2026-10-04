import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePermissionStore = defineStore('permission', () => {
  // 所有角色目前擁有的權限
  const rolePermissions = ref({
    superAdmin: [
      'product.view',
      'product.create',
      'product.edit',
      'product.delete',
      'product.publish',

      'order.view',
      'order.ship',
      'order.cancel',

      'account.view',
      'account.edit',
      'account.disable',
    ],

    operation: [
      'product.view',
      'product.create',
      'product.edit',
      'product.publish',

      'order.view',
      'order.ship',

      'account.view',
    ],

    productManager: ['product.view', 'product.create', 'product.edit', 'product.publish'],

    customerService: ['product.view', 'order.view', 'account.view', 'account.disable'],
  })

  // 取得目前使用者的權限
  const currentPermissions = computed(() => {
    return rolePermissions.value[currentUser.value.role] || []
  })

  // 判斷目前使用者是否有權限
  const hasPermission = (permission) => {
    return currentPermissions.value.includes(permission)
  }

  // 修改某個角色的權限
  const updateRolePermissions = (role, permissions) => {
    rolePermissions.value[role] = permissions
  }

  return {
    rolePermissions,
    currentPermissions,
    hasPermission,
    updateRolePermissions,
  }
})
