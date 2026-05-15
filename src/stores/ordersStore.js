import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getOrders, updateOrders, getOrdersById, updateOrdersStatus } from '@/api/Orders'

export const useOrdersStore = defineStore('orders', () => {
  const items = ref([])
  const current = ref(null)
  const loading = ref(false)

  const paymentStatusOptions = [
    { title: '未付款', color: '', value: 0 },
    { title: '已付款', color: 'green', value: 1 },
    { title: '付款失敗', color: 'red', value: 2 },
  ]

  const orderStatusConfig = [
    { title: '訂單取消', color: '', value: 0 },
    { title: '處理中', color: 'secondary', value: 1 },
    { title: '訂單已完成', color: 'green', value: 2 },
    { title: '訂單退款', color: 'red', value: 3 },
  ]

  // 取得訂單狀態
  const getStatusText = (value) => {
    return orderStatusConfig.find((item) => item.value === value)
  }

  // 取得付款狀態
  const getPaymentStatusText = (value) => {
    return paymentStatusOptions.find((item) => item.value === value)
  }

  // 讀取列表
  const fetchOrderList = async () => {
    loading.value = true
    items.value = await getOrders()
    loading.value = false
  }

  // 取得商品
  const fetchOrderDetail = async (id) => {
    current.value = await getOrdersById(id)
  }

  // 更新
  const update = async (id, data) => {
    await updateOrders(id, data)
  }

  // 批次更新狀態
  const batchUpdate = async (ids, payload) => {
    await updateOrdersStatus(ids, payload)

    await fetchOrderList()
  }

  // 刪除
  const remove = async (id) => {
    const index = items.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  return {
    items,
    current,
    loading,
    fetchOrderList,
    fetchOrderDetail,
    update,
    remove,
    orderStatusConfig,
    getStatusText,
    paymentStatusOptions,
    batchUpdate,
    getPaymentStatusText,
  }
})
