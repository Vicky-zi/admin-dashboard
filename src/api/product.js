let products = [
  { id: 1, name: 'iPhone', productNo: "P000001",price: 30000, status: 1, description: '', updatedAt: '2026-03-01' },
  { id: 2, name: 'MacBook', productNo: "P000002",price: 50000, status: 1, description: '', updatedAt: '2026-04-01' }
]

const delay = (ms) => new Promise(r => setTimeout(r, ms))

export const getProducts = async () => {
  await delay(300)
  return products
}

export const getProductById = async (id) => {
  await delay(200)
  return products.find(p => p.id === Number(id))
}

const getNextProductNo = () => {
  const max = products.reduce((max, p) => {
    const num = parseInt(p.productNo.replace('P', '')) || 0
    return Math.max(max, num)
  }, 0)

  return `P${String(max + 1).padStart(6, '0')}`
}

export const createProduct = async (data) => {
  await delay(200)
  const newItem = {
    ...data,
    id: Date.now(),
    productNo: getNextProductNo(),
    updatedAt: new Date().toISOString().split('T')[0],
  }

  products.push(newItem)
  return newItem
}

export const updateProduct = async (id, data) => {
  await delay(200)
  const index = products.findIndex(p => p.id === Number(id))
  if (index !== -1) {
    products[index] = { 
      ...products[index], 
      ...data,
      updatedAt: new Date().toISOString().split('T')[0] // yyyy-mm-dd 
      }
  }
  return products[index]
}