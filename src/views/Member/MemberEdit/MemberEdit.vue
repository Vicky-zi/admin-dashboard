<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useMemberStore } from '@/stores/memberStore'
import { useDialog } from '@/composables/useDialog'

const memberStore = useMemberStore()
const route = useRoute()
const router = useRouter()
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

const form = ref({
  name: '',
  role: 1,
})

// 驗證規則
const rules = {
  name: [(v) => !!v || '請輸入會員帳號'],
  role: [(v) => (v !== null && v !== undefined) || '請選擇狀態'],
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

    await memberStore.update(form.value.id, payload)

    // API 成功後等待 1 秒
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })

    // 顯示成功訊息
    openMessageDialog({
      title: '儲存成功',
      text: '資料已成功儲存，請按下確認後返回列表頁。',
      type: 'success',
    })
  } catch (err) {
    console.error('儲存失敗', err)

    // 顯示失敗訊息
    openMessageDialog({
      title: '儲存失敗',
      text: '資料儲存失敗，請稍後再試。',
      type: 'error',
    })
  } finally {
    submitLoading.value = false
  }
}

// 儲存成功後，跳轉回前頁
function handleMessageClose() {
  closeMessageDialog()

  if (messageDialog.type === 'success') {
    router.push({
      name: 'Member',
    })
  }
}

// 操作：取消
const handleCancel = () => {
  closeConfirmDialog()
  router.push({ name: 'Member' })
}

const isProcessing = computed(() => submitLoading.value)

onMounted(async () => {
  if (isEdit.value) {
    await memberStore.fetchMemberDetail(route.params.id)
    form.value = { ...memberStore.current }
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
                    label="會員帳號"
                    placeholder="請輸入會員帳號"
                    variant="outlined"
                    clearable
                    :rules="rules.name"
                    :disabled="isEdit"
                  />
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="form.role"
                    :items="memberStore.roleOptions"
                    label="會員權限"
                    variant="outlined"
                    :rules="rules.role"
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
              title="確認捨棄"
              text="即將放棄編輯，未儲存內容將遺失並返回列表頁。"
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
