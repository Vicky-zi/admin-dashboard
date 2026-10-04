let accounts = [
  {
    id: 1,
    name: '管理員',
    acc: 'admin',
    paw: 'admin',
    roleId: 1,
    state: 1,
    roleName: '超級管理員',
    createdAt: '2025-01-01',
    updatedAt: '2026-03-04',
  },
  {
    id: 2,
    name: '王小明',
    acc: 'guest',
    paw: 'guest',
    roleId: 2,
    state: 1,
    roleName: '營運人員',
    createdAt: '2026-01-05',
    updatedAt: '2026-03-04',
  },
  {
    id: 3,
    name: '李小華',
    acc: 'guest2',
    paw: 'guest2',
    roleId: 2,
    state: 1,
    roleName: '營運人員',
    createdAt: '2026-01-05',
    updatedAt: '2026-03-04',
  },
  {
    id: 4,
    name: '陳小美',
    acc: 'guest3',
    paw: 'guest3',
    roleId: 4,
    state: 1,
    roleName: '客服人員',
    createdAt: '2026-01-05',
    updatedAt: '2026-03-04',
  },
  {
    id: 5,
    name: '吳小琪',
    acc: 'guest4',
    paw: 'guest4',
    roleId: 3,
    state: 1,
    roleName: '商品管理員',
    createdAt: '2026-01-05',
    updatedAt: '2026-03-04',
  },
]

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export const getAccounts = async () => {
  await delay(300)
  return accounts
}

export const getAccountById = async (id) => {
  await delay(200)
  return accounts.find((p) => p.id === Number(id))
}

export const updateAccount = async (id, data) => {
  await delay(200)
  const index = accounts.findIndex((p) => p.id === Number(id))
  if (index !== -1) {
    accounts[index] = { ...accounts[index], ...data }
  }
  return accounts[index]
}
