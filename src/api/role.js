let roles = [
  {
    id: 1,
    name: '超級管理員',
    userCount: 1,
    state: 1,
    permissions: [
      'dashboard.view',

      'product.view',
      'product.create',
      'product.edit',
      'product.delete',
      'product.status',
      'product.inventory',

      'order.view',
      'order.ship',
      'order.cancel',

      'account.view',
      'account.suspend',

      'role.view',
      'role.create',
      'role.edit',
      'role.delete',

      'log.view',
    ],
    createdAt: '2025-01-01',
    updatedAt: '2026-03-04',
  },

  {
    id: 2,
    name: '營運人員',
    userCount: 5,
    state: 1,
    permissions: [
      'dashboard.view',

      'product.view',
      'product.status',
      'product.inventory',

      'order.view',
      'order.ship',
      'order.cancel',

      'account.view',

      'log.view',
    ],
    createdAt: '2026-01-05',
    updatedAt: '2026-03-04',
  },

  {
    id: 3,
    name: '商品管理員',
    userCount: 3,
    state: 1,
    permissions: [
      'dashboard.view',

      'product.view',
      'product.create',
      'product.edit',
      'product.status',
      'product.inventory',

      'log.view',
    ],
    createdAt: '2026-01-05',
    updatedAt: '2026-03-04',
  },

  {
    id: 4,
    name: '客服人員',
    userCount: 8,
    state: 1,
    permissions: [
      'dashboard.view',

      'product.view',

      'order.view',
      'order.cancel',

      'account.view',
      'account.suspend',

      'log.view',
    ],
    createdAt: '2026-01-05',
    updatedAt: '2026-03-04',
  },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// 取得角色列表
export const getRoles = async () => {
  await delay(300)

  return roles
}

// 取得單一角色
export const getRoleById = async (id) => {
  await delay(200)
  return roles.find((item) => item.id === Number(id))
}

// 更新角色
export const updateRole = async (id, data) => {
  await delay(200)

  const index = roles.findIndex((item) => item.id === Number(id))

  if (index !== -1) {
    roles[index] = {
      ...roles[index],
      ...data,
    }
  }

  return roles[index]
}
