<script setup>
import { useAccountStore } from '@/stores/accountStore'
import { useRoleStore } from '@/stores/roleStore'
import { useDialog } from '@/composables/useDialog'
import { dialogMessages } from '@/constants/dialogMessages'

const route = useRoute()
const router = useRouter()
const roleStore = useRoleStore()
const accountStore = useAccountStore()
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

// TODO: 待優化
const roleOptions = [
  { title: '超級管理員', value: 1 },
  { title: '營運人員', value: 2 },
  { title: '商品管理員', value: 3 },
  { title: '客服人員', value: 4 },
  { title: '小幫手', value: 5 },
]

// 表單
const form = ref({
  name: '',
  acc: '',
  paw: '',
  roleId: 1,
})

// 驗證規則
const rules = {
  name: [(v) => !!v || '請輸入會員名稱'],
  acc: [(v) => !!v || '請輸入會員帳號'],
  paw: [(v) => !!v || '請輸入會員密碼'],
  roleId: [(v) => (v !== null && v !== undefined) || '請選擇狀態'],
  state: [(v) => (v !== null && v !== undefined) || '請選擇狀態'],
}

// 提交
const submit = async () => {
  const result = await formRef.value.validate()
  if (!result.valid) return

  try {
    submitLoading.value = true

    const payload = { ...form.value }

    if (route.params.id === '3') {
      throw new Error('模擬儲存失敗')
    }

    await accountStore.update(form.value.id, payload)

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
      name: 'Account',
    })
  }
}

// 操作：取消
const handleCancel = () => {
  closeConfirmDialog()
  router.push({ name: 'Account' })
}

const isProcessing = computed(() => submitLoading.value)

onMounted(async () => {
  if (isEdit.value) {
    await accountStore.fetchAccountDetail(route.params.id)
    form.value = { ...accountStore.current }
  }
})

onUnmounted(() => {
  form.value = {
    name: '',
    acc: '',
    paw: '',
    roleId: 1,
  }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h6"> 會員編輯 </v-card-title>

          <v-card-text>
            <v-form ref="formRef" v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.name"
                    label="名稱"
                    placeholder="請輸入會員名稱"
                    variant="outlined"
                    clearable
                    :rules="rules.name"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="form.acc"
                    label="帳號"
                    placeholder="請輸入會員帳號"
                    variant="outlined"
                    clearable
                    :rules="rules.name"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="form.paw"
                    label="密碼"
                    placeholder="請輸入會員帳號"
                    variant="outlined"
                    clearable
                    type="password"
                    :rules="rules.paw"
                  />
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="form.roleId"
                    :items="roleOptions"
                    label="權限角色"
                    variant="outlined"
                    :rules="rules.roleId"
                  />
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="form.state"
                    :items="roleStore.statusOptions"
                    :rules="rules.state"
                    label="啟用狀態"
                    variant="outlined"
                  />
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
