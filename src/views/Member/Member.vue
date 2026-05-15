<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMemberStore } from '@/stores/memberStore'

const router = useRouter()
const memberStore = useMemberStore()
const { items, loading } = storeToRefs(memberStore)

const headers = [
  { title: '帳號', key: 'name' },
  { title: '權限', key: 'role' },
  { title: '創建時間', key: 'createdAt' },
  { title: '操作', key: 'action', sortable: false },
]

// 操作：導轉
const goEdit = (id) => {
  router.push({ name: 'MemberEdit', params: { id: id } })
}

// 操作：刪除
const deleteItem = async (id) => {
  await memberStore.remove(id)
}

onMounted(() => {
  memberStore.fetchMemberList()
})
</script>

<template>
  <div>
    <v-data-table :headers="headers" :items="items" :loading="loading">
      <template v-slot:item.role="{ item }">
        {{ memberStore.getRoleText(item.role) }}
      </template>
      <template v-slot:item.action="{ item }">
        <!-- 編輯 -->
        <v-icon v-if="item.role !== 0" class="mr-2" @click="goEdit(item.id)"> mdi-pencil </v-icon>

        <!-- 刪除 -->
        <v-dialog v-if="item.role !== 0" max-width="400">
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
