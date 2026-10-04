<script setup>
import { useUserStore } from '@/stores/userStore.js'
import { useProductStore } from '@/stores/productStore'
import { useDialog } from '@/composables/useDialog'
import { dialogMessages } from '@/constants/dialogMessages'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const store = useProductStore()
const {
  showConfirmDialog,
  showMessageDialog,
  messageDialog,
  openMessageDialog,
  closeMessageDialog,
  closeConfirmDialog,
} = useDialog()

const isEdit = computed(() => !!route.params.id)
const formRef = ref(null)
const valid = ref(false)
const submitLoading = ref(false)

// 權限判斷
const canChangeProductStatus = computed(() => {
  return userStore.user?.permissions?.includes('product.status') ?? false
})

const canEditProductInventory = computed(() => {
  return userStore.user?.permissions?.includes('product.inventory') ?? false
})

const form = ref({
  name: '',
  productNo: '',
  price: 0,
  status: 1,
  inventory: 0,
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

    // API 成功後等待 1 秒
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })

    // 顯示成功訊息
    openMessageDialog(dialogMessages.saveSuccess)
  } catch (err) {
    console.error('儲存失敗', err)
    // 顯示失敗訊息
    openMessageDialog(dialogMessages.saveError)
  } finally {
    submitLoading.value = false
  }
}

// 儲存成功後，跳轉回前頁
function handleMessageClose() {
  closeMessageDialog()

  if (messageDialog.type === 'success') {
    router.push({
      name: 'Product',
    })
  }
}

// 操作：取消
const handleCancel = () => {
  closeConfirmDialog()
  router.push({ name: 'Product' })
}

const isProcessing = computed(() => submitLoading.value)

onMounted(async () => {
  if (isEdit.value) {
    await store.fetchProductDetail(route.params.id)
    form.value = { ...store.current }
  }
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
                    :disabled="isProcessing"
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
                    :disabled="isProcessing"
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
                    :disabled="!canChangeProductStatus || isProcessing"
                  />
                </v-col>

                <!-- 庫存 -->
                <v-col cols="12">
                  <v-text-field
                    v-model="form.inventory"
                    label="庫存"
                    type="number"
                    variant="outlined"
                    :rules="rules.inventory"
                    :disabled="!canEditProductInventory || isProcessing"
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

            <ConfirmDialog
              v-model="showConfirmDialog"
              :title="dialogMessages.discard.title"
              :text="dialogMessages.discard.text"
              confirm-text="確認"
              confirm-color="red"
              @confirm="handleCancel"
            >
              <template #activator="{ props }">
                <v-btn variant="text" :disabled="isProcessing" v-bind="props"> 捨棄 </v-btn>
              </template>
            </ConfirmDialog>

            <v-btn color="primary" variant="flat" :loading="submitLoading" :disabled="!valid" @click="submit">
              儲存
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <MessageDialog
        v-model="showMessageDialog"
        :title="messageDialog.title"
        :text="messageDialog.text"
        :type="messageDialog.type"
        @close="handleMessageClose"
      />
    </v-row>
  </v-container>
</template>
