<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { useDialog } from '@/composables/useDialog'
import { dialogMessages } from '@/constants/dialogMessages'
import { useProductStore } from '@/stores/productStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const productStore = useProductStore()
const { items, loading } = storeToRefs(productStore)
const { openConfirmDialog, showConfirmDialog, closeConfirmDialog } = useDialog()

const headers = [
  { title: '商品編號', key: 'productNo' },
  { title: '名稱', key: 'name' },
  { title: '價格', key: 'price' },
  { title: '庫存', key: 'inventory' },
  { title: '商品狀態', key: 'status' },
  { title: '操作', key: 'action', sortable: false },
]

// 權限判斷
const canCreateRole = computed(() => {
  return userStore.user?.permissions?.includes('product.create') ?? false
})

const productAction = computed(() => {
  const permissions = userStore.user?.permissions ?? []

  if (permissions.includes('product.edit')) {
    return {
      mode: 'Edit',
      icon: 'mdi-pencil',
    }
  }

  if (permissions.includes('product.view')) {
    return {
      mode: 'View',
      icon: 'mdi-eye',
    }
  }

  return null
})

const canDeleteRole = computed(() => {
  return userStore.user?.permissions?.includes('product.delete') ?? false
})

// 操作：導轉頁
const goToPage = (id, mode) => {
  router.push({
    name: `${route.name}${mode}`,
    params: { id },
  })
}

const deleteId = ref(null)

const openDeleteDialog = (id) => {
  deleteId.value = id
  openConfirmDialog()
}

// 操作：刪除
const deleteItem = async () => {
  try {
    await productStore.remove(deleteId.value)

    closeConfirmDialog()
    deleteId.value = null
  } catch (err) {
    console.error('刪除失敗', err)
  }
}

onMounted(() => {
  productStore.fetchProductList()
})
</script>

<template>
  <div>
    <v-row class="mb-4">
      <v-col class="d-flex justify-end">
        <v-btn v-if="canCreateRole" variant="outlined" @click="router.push({ name: 'ProductCreate' })">
          新增商品
          <template #append>
            <v-icon>mdi-plus</v-icon>
          </template>
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table :headers="headers" :items="items" :loading="loading">
      <template v-slot:item.status="{ item }">
        {{ productStore.getStatusText(item.status) }}
      </template>

      <template v-slot:item.action="{ item }">
        <!-- 編輯或檢視 -->
        <v-btn v-if="productAction" icon variant="text" @click="goToPage(item.id, productAction.mode)">
          <v-icon>{{ productAction.icon }}</v-icon>
        </v-btn>

        <!-- 刪除 -->
        <v-btn v-if="canDeleteRole" icon variant="text" @click="openDeleteDialog(item.id)">
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
