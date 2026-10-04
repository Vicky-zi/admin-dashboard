<script setup>
import { useDialog } from '@/composables/useDialog'
import { useRoleStore } from '@/stores/roleStore'
import { dialogMessages } from '@/constants/dialogMessages'

const route = useRoute()
const router = useRouter()
const roleStore = useRoleStore()
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

// 表單
const form = ref({
  name: '',
  permissions: [],
})

// 驗證規則
const rules = {
  name: [(v) => !!v || '請輸入權限名稱'],
  state: [(v) => (v !== null && v !== undefined) || '請選擇狀態'],
}

// 權限項目
const permissionGroups = {
  product: [
    {
      label: '查看商品',
      value: 'product.view',
    },
    {
      label: '新增商品',
      value: 'product.create',
    },
    {
      label: '編輯商品',
      value: 'product.edit',
    },
    {
      label: '刪除商品',
      value: 'product.delete',
    },
    {
      label: '商品上下架',
      value: 'product.publish',
    },
  ],

  order: [
    {
      label: '查看訂單',
      value: 'order.view',
    },
    {
      label: '出貨',
      value: 'order.ship',
    },
    {
      label: '取消訂單',
      value: 'order.cancel',
    },
  ],

  account: [
    {
      label: '查看會員',
      value: 'account.view',
    },
    {
      label: '停權會員',
      value: 'account.disable',
    },
  ],
}

// 提交
const submit = async () => {
  const result = await formRef.value.validate()
  if (!result.valid) return

  try {
    submitLoading.value = true

    await roleStore.update(route.params.id, {
      permissions: form.value.permissions,
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
      name: 'Role',
    })
  }
}

// 操作：取消
const handleCancel = () => {
  closeConfirmDialog()
  router.push({ name: 'Role' })
}

const isProcessing = computed(() => submitLoading.value)

onMounted(async () => {
  if (isEdit.value) {
    await roleStore.fetchRoleDetail(route.params.id)
    form.value = { ...roleStore.current }
  }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h6"> 權限管理 </v-card-title>

          <v-card-text>
            <v-form ref="formRef" v-model="valid">
              <v-row>
                <!-- 權限名稱 -->
                <v-col cols="6">
                  <v-text-field
                    v-model="form.name"
                    label="權限名稱"
                    variant="outlined"
                    :rules="rules.name"
                    :disabled="isEdit"
                    readonly
                  />
                </v-col>

                <!-- 啟用狀態 -->
                <v-col cols="6">
                  <v-select
                    v-model="form.state"
                    :items="roleStore.statusOptions"
                    :rules="rules.state"
                    label="啟用狀態"
                    variant="outlined"
                  />
                </v-col>

                <!-- 商品管理 -->
                <v-col cols="12">
                  <v-card variant="outlined">
                    <v-card-title class="text-subtitle-1"> 商品管理 </v-card-title>

                    <v-card-text>
                      <v-row>
                        <v-col
                          v-for="permission in permissionGroups.product"
                          :key="permission.value"
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-checkbox
                            v-model="form.permissions"
                            :label="permission.label"
                            :value="permission.value"
                            :disabled="form.state === 0"
                            hide-details
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- 訂單管理 -->
                <v-col cols="12">
                  <v-card variant="outlined">
                    <v-card-title class="text-subtitle-1"> 訂單管理 </v-card-title>

                    <v-card-text>
                      <v-row>
                        <v-col
                          v-for="permission in permissionGroups.order"
                          :key="permission.value"
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-checkbox
                            v-model="form.permissions"
                            :label="permission.label"
                            :value="permission.value"
                            :disabled="form.state === 0"
                            hide-details
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- 帳號管理 -->
                <v-col cols="12">
                  <v-card variant="outlined">
                    <v-card-title class="text-subtitle-1"> 帳號管理 </v-card-title>

                    <v-card-text>
                      <v-row>
                        <v-col
                          v-for="permission in permissionGroups.account"
                          :key="permission.value"
                          cols="12"
                          sm="6"
                          md="4"
                        >
                          <v-checkbox
                            v-model="form.permissions"
                            :label="permission.label"
                            :value="permission.value"
                            :disabled="form.state === 0"
                            hide-details
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <!-- 操作 -->
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

            <v-btn color="primary" variant="flat" :loading="submitLoading" :disabled="isProcessing" @click="submit">
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
