<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useMemberStore } from '@/stores/memberStore'

const memberStore = useMemberStore()
const route = useRoute()
const router = useRouter()

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

    await memberStore.update(form.value.id, payload)

    router.push({ name: 'Member' })
  } catch (err) {
    console.error('儲存失敗', err)
  } finally {
    submitLoading.value = false
  }
}

// 操作：取消
const handleCancel = (isActive) => {
  isActive.value = false
  router.push({ name: 'Member' })
}

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
                    <v-btn text="確認" color="red" variant="flat" @click="handleCancel(isActive)"></v-btn>
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
