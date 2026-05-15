<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProductStore } from '@/stores/productStore'

const router = useRouter()
const productStore = useProductStore()
const { items, loading } = storeToRefs(productStore)

const headers = [
  { title: '商品編號', key: 'productNo' },
  { title: '名稱', key: 'name' },
  { title: '價格', key: 'price' },
  { title: '商品狀態', key: 'status' },
  { title: '操作', key: 'action', sortable: false },
]

// 操作：導轉
const goEdit = (id) => {
  router.push({ name: 'ProductEdit', params: { id: id } })
}

// 操作：刪除
const deleteItem = async (id) => {
  await productStore.remove(id)
}

onMounted(() => {
  productStore.fetchProductList()
})
</script>

<template>
  <div>
    <v-row class="mb-4">
      <v-col class="d-flex justify-end">
        <v-btn variant="outlined" @click="router.push({ name: 'ProductCreate' })">
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
