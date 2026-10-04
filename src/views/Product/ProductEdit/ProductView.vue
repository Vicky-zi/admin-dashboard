<script setup>
import { useProductStore } from '@/stores/productStore'

const route = useRoute()
const router = useRouter()
const store = useProductStore()

const form = ref({
  name: '',
  productNo: '',
  price: 0,
  status: 1,
  inventory: 0,
  description: '',
})

// 返回
const handleBack = async () => {
  router.push({
    name: 'Product',
  })
}

onMounted(async () => {
  await store.fetchProductDetail(route.params.id)
  form.value = { ...store.current }
})

onUnmounted(() => {
  form.value = {
    name: '',
    productNo: '',
    price: 0,
    status: 1,
    inventory: 0,
    description: '',
  }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h6"> 商品編輯 </v-card-title>
          <v-card-text>
            <v-form>
              <v-row>
                <!-- 商品編號 -->
                <v-col cols="12">
                  <v-text-field
                    v-model="form.productNo"
                    label="商品編號"
                    placeholder="請輸入商品名稱"
                    variant="outlined"
                    disabled
                    hide-details
                  />
                </v-col>

                <!-- 商品名稱 -->
                <v-col cols="12">
                  <v-text-field
                    v-model="form.name"
                    label="商品名稱"
                    placeholder="請輸入商品名稱"
                    variant="outlined"
                    readonly
                  />
                </v-col>

                <!-- 價格 -->
                <v-col cols="12">
                  <v-text-field
                    v-model="form.price"
                    label="商品價格"
                    type="number"
                    prefix="$"
                    variant="outlined"
                    readonly
                  />
                </v-col>

                <!-- 狀態 -->
                <v-col cols="12">
                  <v-select
                    v-model="form.status"
                    :items="store.statusOptions"
                    label="商品狀態"
                    variant="outlined"
                    readonly
                  />
                </v-col>

                <!-- 庫存 -->
                <v-col cols="12">
                  <v-text-field v-model="form.inventory" label="庫存" type="number" variant="outlined" readonly />
                </v-col>

                <!-- 描述 -->
                <v-col cols="12">
                  <v-textarea v-model="form.description" label="商品描述" rows="3" variant="outlined" readonly />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-end">
            <div class="text-caption text-medium-emphasis mb-1">最後更新時間 {{ form.updatedAt || '-' }}</div>

            <v-btn color="primary" variant="flat" @click="handleBack"> 返回 </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
