<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import { useDialog } from '@/composables/useDialog'

const router = useRouter()
const userStore = useUserStore()
const { showMessageDialog, messageDialog, openMessageDialog } = useDialog()

const data = ref({
  account: import.meta.env.DEV ? 'admin' : '',
  password: import.meta.env.DEV ? 'admin' : '',
})

// 驗證規則
const rules = {
  account: [(v) => !!v || '請輸入會員帳號'],
  password: [(v) => !!v || '請輸入會員密碼'],
}

const formRef = ref(null)
const loading = ref(false)

// 帳號、密碼都有輸入，按鈕才可以點擊
const canLogin = computed(() => {
  return data.value.account.trim() !== '' && data.value.password.trim() !== ''
})

async function login() {
  const result = await formRef.value.validate()
  if (!result.valid) return

  try {
    loading.value = true

    // 登入時才檢查帳號密碼
    const result = await userStore.login(data.value.account, data.value.password)

    // 帳號或密碼錯誤
    if (!result.success) {
      // 顯示失敗訊息
      openMessageDialog({
        title: '登入失敗',
        text: '帳號密碼錯誤，請稍後再試。',
        type: 'error',
      })
      return
    }

    // API 成功後等待 1 秒
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })

    router.push({ name: 'Dashboard' })
  } finally {
    loading.value = false
  }
}

// 一進入頁面直接focus帳號欄位
const vFocus = {
  mounted(el) {
    const input = el.querySelector('input')

    if (input) {
      input.focus()
    }
  },
}
</script>

<template>
  <div class="h-screen d-flex align-center justify-center">
    <v-sheet class="d-flex flex-column pa-8 rounded-lg w-100" max-width="550">
      <p class="h2 text-center">系統名稱</p>

      <v-form ref="formRef" @submit.prevent="login">
        <v-row>
          <v-col cols="12">
            <VTextField v-model="data.account" v-focus :rules="rules.account" label="帳號" placeholder="請輸入帳號" />
          </v-col>

          <v-col cols="12">
            <VTextField
              v-model="data.password"
              :rules="rules.password"
              label="密碼"
              type="password"
              placeholder="請輸入密碼"
            />
          </v-col>
        </v-row>

        <v-btn class="mt-8" type="submit" block color="primary" :disabled="!canLogin" :loading="loading"> 登入 </v-btn>
      </v-form>
    </v-sheet>

    <MessageDialog
      v-model="showMessageDialog"
      :title="messageDialog.title"
      :text="messageDialog.text"
      :type="messageDialog.type"
    />
  </div>
</template>
