<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOrdersStore } from '@/stores/ordersStore'

const router = useRouter()
const ordersStore = useOrdersStore()
const { items, loading } = storeToRefs(ordersStore)

const headers = [
  { title: '訂單編號', key: 'orderNo' },
  { title: '訂單時間', key: 'createdAt' },
  { title: '訂單狀態', key: 'status' },
  { title: '付款狀態', key: 'paymentStatus' },
  { title: '總金額', key: 'totalAmount' },
  { title: '操作', key: 'action', sortable: false },
]

const selected = ref([])

// 操作：導轉
const goEdit = (id) => {
  router.push({ name: 'OrdersEdit', params: { id: id } })
}

// 操作：刪除
const deleteItem = async (id) => {
  await ordersStore.remove(id)
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
        <!-- 編輯 -->
        <v-icon class="mr-2" @click="goEdit(item.id)"> mdi-pencil </v-icon>

        <!-- 刪除 -->
        <v-dialog max-width="400">
          <template v-slot:activator="{ props: activatorProps }">
            <v-icon v-bind="activatorProps" class="mr-2"> mdi-delete </v-icon>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card title="確認刪除">
              <v-card-text>
                此操作將<strong class="text-error">永久刪除</strong>該資料，且<strong>無法復原</strong>。<br />
                請確認是否繼續？
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="關閉" @click="isActive.value = false"></v-btn>
                <v-btn
                  text="確認"
                  color="red"
                  variant="flat"
                  @click="
                    () => {
                      isActive.value = false
                      deleteItem(item.id)
                    }
                  "
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </template>
    </v-data-table>
  </div>
</template>
<style lang=""></style>
