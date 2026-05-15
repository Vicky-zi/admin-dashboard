import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getProducts, createProduct, updateProduct, getProductById } from '@/api/product'

export const useProductStore = defineStore('product', () => {
  const items = ref([])
  const current = ref(null)
  const loading = ref(false)

  const statusOptions = [
    { title: '上架', value: 1 },
    { title: '下架', value: 0 },
  ]

  const getStatusText = (value) => {
    return statusOptions.find((item) => item.value === value)?.title || '-'
  }

  // 讀取列表
  const fetchProductList = async () => {
    loading.value = true
    items.value = await getProducts()
    loading.value = false
  }

  // 取得商品
  const fetchProductDetail = async (id) => {
    current.value = await getProductById(id)
  }

  // 新增
  const create = async (data) => {
    await createProduct(data)
  }

  // 更新
  const update = async (id, data) => {
    await updateProduct(id, data)
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

  // 刪除
  const remove = async (id) => {
    try {
      loading.value = true

      await sleep(800)
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
    statusOptions,
    getStatusText,
    fetchProductList,
    fetchProductDetail,
    create,
    update,
    remove,
  }
})
