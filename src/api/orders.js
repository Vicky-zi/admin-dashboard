let orders = [
  {
    id: 1,
    orderNo: 'ORD001',
    totalAmount: 30000,
    status: 0, // 訂單狀態
    paymentStatus: 1, // 付款狀態
    customerName: '王小明',
    customerPhone: '0911111111',
    customerEmail: ' ',
    shippingAddress: '台北市',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01',
  },
  {
    id: 2,
    orderNo: 'ORD002',
    totalAmount: 50000,
    status: 1,
    paymentStatus: 1,
    customerName: '王小明',
    customerPhone: '0911111111',
    customerEmail: ' ',
    shippingAddress: '台北市',
    createdAt: '2026-03-02',
    updatedAt: '2026-03-03',
  },
  {
    id: 3,
    orderNo: 'ORD003',
    totalAmount: 28000,
    status: 2,
    paymentStatus: 2,
    customerName: '王小明',
    customerPhone: '0911111111',
    customerEmail: ' ',
    shippingAddress: '台北市',
    createdAt: '2026-03-03',
    updatedAt: '2026-03-04',
  },
  {
    id: 4,
    orderNo: 'ORD004',
    totalAmount: 8000,
    status: 3,
    paymentStatus: 0,
    customerName: '王小明',
    customerPhone: '0911111111',
    customerEmail: ' ',
    shippingAddress: '台北市',
    createdAt: '2026-03-04',
    updatedAt: '2026-03-05',
  },
]

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export const getOrders = async () => {
  await delay(300)
  return orders
}

export const getOrdersById = async (id) => {
  await delay(200)
  return orders.find((p) => p.id === Number(id))
}

export const updateOrders = async (id, data) => {
  await delay(200)
  const index = orders.findIndex((p) => p.id === Number(id))
  if (index !== -1) {
    orders[index] = { ...orders[index], ...data }
  }
  return orders[index]
}

export const updateOrdersStatus = async (ids, status) => {
  await delay(200)

  orders = orders.map((order) => {
    if (ids.includes(order.id)) {
      return {
        ...order,
        status,
        updatedAt: new Date().toISOString().slice(0, 10),
      }
    }

    return order
  })

  return orders.filter((order) => ids.includes(order.id))
}
