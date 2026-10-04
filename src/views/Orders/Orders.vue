<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { useOrdersStore } from '@/stores/ordersStore'
import { useDialog } from '@/composables/useDialog'
import { dialogMessages } from '@/constants/dialogMessages'

const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()
const userStore = useUserStore()
const { items, loading } = storeToRefs(ordersStore)
const { openConfirmDialog, showConfirmDialog, closeConfirmDialog } = useDialog()

const headers = [
  { title: '訂單編號', key: 'orderNo' },
  { title: '訂單時間', key: 'createdAt' },
  { title: '訂單狀態', key: 'status' },
  { title: '付款狀態', key: 'paymentStatus' },
  { title: '總金額', key: 'totalAmount' },
  { title: '操作', key: 'action', sortable: false },
]

// 權限判斷
const canViewOrder = () => {
  return userStore.user?.permissions.includes('order.view')
}

const canDeleteRole = () => {
  return userStore.user?.permissions.includes('order.delete')
}

const selected = ref([])

// 操作：導轉
const goEdit = (id) => {
  router.push({ name: `${route.name}Edit`, params: { id: id } })
}

const deleteId = ref(null)

const openDeleteDialog = (id) => {
  deleteId.value = id
  openConfirmDialog()
}

// 操作：刪除
const deleteItem = async () => {
  try {
    await ordersStore.remove(deleteId.value)

    closeConfirmDialog()
    deleteId.value = null
  } catch (err) {
    console.error('刪除失敗', err)
  }
}

const handleBatchUpdateStatus = (status) => {
  ordersStore.batchUpdate(selected.value, status)
}

onMounted(() => {
  ordersStore.fetchOrderList()
})
</script>

<template>
  <div>
    <v-row class="mb-4">
      <v-col class="d-flex ga-2 justify-end">
        <v-btn variant="outlined" :disabled="selected.length === 0" @click="handleBatchUpdateStatus(0)">
          取消訂單
        </v-btn>
        <v-btn variant="outlined" :disabled="selected.length === 0" @click="handleBatchUpdateStatus(2)">
          訂單完成
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      v-model="selected"
      item-value="id"
      show-select
      :sort-by="[{ key: 'createdAt', order: 'asc' }]"
    >
      <!-- 訂單狀態 -->
      <template v-slot:item.status="{ item }">
        <v-chip :color="ordersStore.getStatusText(item.status).color" variant="flat">
          {{ ordersStore.getStatusText(item.status).title }}
        </v-chip>
      </template>

      <!-- 付款狀態 -->
      <template v-slot:item.paymentStatus="{ item }">
        <v-chip :color="ordersStore.getPaymentStatusText(item.paymentStatus).color" variant="flat">
          {{ ordersStore.getPaymentStatusText(item.paymentStatus).title }}
        </v-chip>
      </template>

      <template v-slot:item.action="{ item }">
        <!-- 查看 -->
        <v-btn v-if="canViewOrder()" icon variant="text" @click="goEdit(item.id)">
          <v-icon>mdi-eye</v-icon>
        </v-btn>

        <!-- 刪除 -->
        <v-btn v-if="canDeleteRole()" icon variant="text" @click="openDeleteDialog(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <ConfirmDialog
      v-model="showConfirmDialog"
      :title="dialogMessages.delete.title"
      :text="dialogMessages.delete.text"
      confirm-text="確認"
      confirm-color="red"
      @confirm="deleteItem()"
    />
  </div>
</template>
<style lang=""></style>
