let members = [
  { id: 1, name: 'admin', role: 0, createdAt: '2026-01-01', updatedAt: '2026-03-04' },
  { id: 2, name: 'guest', role: 1, createdAt: '2026-01-05', updatedAt: '2026-03-04' },
  { id: 3, name: 'guest2', role: 1, createdAt: '2026-01-05', updatedAt: '2026-03-04' },
]

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export const getMembers = async () => {
  await delay(300)
  return members
}

export const getMemberById = async (id) => {
  await delay(200)
  return members.find((p) => p.id === Number(id))
}

export const updateMember = async (id, data) => {
  await delay(200)
  const index = members.findIndex((p) => p.id === Number(id))
  if (index !== -1) {
    members[index] = { ...members[index], ...data }
  }
  return members[index]
}
