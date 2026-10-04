<script setup>
import { useUserStore } from '@/stores/userStore'
import { useRoleStore } from '@/stores/roleStore'
import { useAccountStore } from '@/stores/accountStore'
import { useDialog } from '@/composables/useDialog'
import { dialogMessages } from '@/constants/dialogMessages'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const roleStore = useRoleStore()
const accountStore = useAccountStore()
const { items, loading } = storeToRefs(accountStore)
const { openConfirmDialog, showConfirmDialog, closeConfirmDialog } = useDialog()

const headers = [
  { title: 'Id', key: 'id' },
  { title: '姓名', key: 'name' },
  { title: '帳號', key: 'acc' },
  { title: '權限角色', key: 'roleName' },
  { title: '會員狀態', key: 'state' },
  { title: '創建時間', key: 'createdAt' },
  { title: '操作', key: 'action', sortable: false },
]

// 權限僅檢視
const isReadOnly = computed(() => {
  return userStore.user?.role > 0
})

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
    await accountStore.remove(deleteId.value)

    closeConfirmDialog()
    deleteId.value = null
  } catch (err) {
    console.error('刪除失敗', err)
  }
}

onMounted(() => {
  accountStore.fetchAccountList()
})
</script>

<template>
  <div>
    <v-data-table :headers="headers" :items="items" :loading="loading">
      <template v-slot:item.state="{ item }">
        {{ roleStore.getStatusText(item.state) }}
      </template>
      <template v-slot:item.action="{ item }">
        <!-- 編輯 -->
        <v-btn v-if="item.role !== 0" icon variant="text" :disabled="isReadOnly" @click="goEdit(item.id)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <!-- 刪除 -->
        <v-btn v-if="item.role !== 0" icon variant="text" :disabled="isReadOnly" @click="openDeleteDialog(item.id)">
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
