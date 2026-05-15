<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { createProduct, updateProduct } from '@/api/product'

const store = useProductStore()
const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const formRef = ref(null)
const valid = ref(false)
const submitLoading = ref(false)

const form = ref({
  name: '',
  productNo: '',
  price: 0,
  status: 1,
  description: '',
})

// 驗證規則
const rules = {
  name: [(v) => !!v || '請輸入商品名稱'],
  price: [(v) => !!v || '請輸入價格', (v) => v > 0 || '價格需大於 0'],
  status: [(v) => (v !== null && v !== undefined) || '請選擇狀態'],
}

// 提交
const submit = async () => {
  const result = await formRef.value.validate()
  if (!result.valid) return

  try {
    submitLoading.value = true

    const payload = { ...form.value }

    if (form.value.id) {
      await store.update(form.value.id, payload)
    } else {
      await store.create(payload)
    }

    router.push({ name: 'Product' })
  } catch (err) {
    console.error('儲存失敗', err)
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    await store.fetchProductDetail(route.params.id)
    form.value = { ...store.current }
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
            <v-form ref="formRef" v-model="valid">
              <v-row>
                <!-- 商品編號 -->
                <v-col v-if="isEdit" cols="12">
                  <v-text-field
                    v-model="form.productNo"
                    label="商品編號"
                    placeholder="請輸入商品名稱"
                    variant="outlined"
                    disabled
                    hide-details
                  />
                </v-col>

                <v-col v-else cols="12">
                  <div class="text-subtitle-2">商品編號</div>

                  <v-chip color="grey-lighten-2" class="mt-2"> 系統自動產生 </v-chip>
                </v-col>

                <!-- 商品名稱 -->
                <v-col cols="12">
                  <v-text-field
                    v-model="form.name"
                    label="商品名稱"
                    placeholder="請輸入商品名稱"
                    variant="outlined"
                    clearable
                    :rules="rules.name"
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
                    :rules="rules.price"
                  />
                </v-col>

                <!-- 狀態 -->
                <v-col cols="12">
                  <v-select
                    v-model="form.status"
                    :items="store.statusOptions"
                    label="商品狀態"
                    variant="outlined"
                    :rules="rules.status"
                  />
                </v-col>

                <!-- 描述 -->
                <v-col cols="12">
                  <v-textarea v-model="form.description" label="商品描述" rows="3" variant="outlined" />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-end">
            <div v-if="isEdit" class="text-caption text-medium-emphasis mb-1">
              最後更新時間 {{ form.updatedAt || '-' }}
            </div>

            <v-dialog max-width="400">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn variant="text" v-bind="activatorProps"> 捨棄 </v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="確認捨棄">
                  <v-card-text>
                    即將<strong class="text-error">放棄編輯</strong>，未儲存內容將遺失並返回列表頁。<br />
                    是否繼續？
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="取消" @click="isActive.value = false"></v-btn>
                    <v-btn
                      text="確認"
                      color="red"
                      variant="flat"
                      @click="
                        () => {
                          isActive.value = false
                          router.push({ name: 'Product' })
                        }
                      "
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>

            <v-btn color="primary" variant="flat" :loading="submitLoading" :disabled="!valid" @click="submit">
              儲存
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
