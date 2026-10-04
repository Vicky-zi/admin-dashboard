<script setup>
import { useRoleStore } from '@/stores/roleStore'
import { useUserStore } from '@/stores/userStore.js'
import { useDialog } from '@/composables/useDialog'
import { dialogMessages } from '@/constants/dialogMessages'

const route = useRoute()
const router = useRouter()
const roleStore = useRoleStore()
const userStore = useUserStore()
const { items, loading } = storeToRefs(roleStore)
const { openConfirmDialog, showConfirmDialog, closeConfirmDialog } = useDialog()

const headers = [
  { title: '權限', key: 'name' },
  { title: '使用人數', key: 'userCount' },
  { title: '啟用狀態', key: 'state' },
  { title: '創建時間', key: 'createdAt' },
  { title: '操作', key: 'action', sortable: false },
]

// 權限判斷
const canEditRole = () => {
  return userStore.user.permissions.includes('role.edit') || userStore.user.roleId === 1
}

const canDeleteRole = () => {
  return userStore.user.permissions.includes('role.delete') || userStore.user.roleId === 1
}

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
    await userStore.remove(deleteId.value)

    closeConfirmDialog()
    deleteId.value = null
  } catch (err) {
    console.error('刪除失敗', err)
  }
}

onMounted(() => {
  roleStore.fetchRoleList()
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
        <v-btn v-if="canEditRole()" icon variant="text" @click="goEdit(item.id)">
          <v-icon>mdi-pencil</v-icon>
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
