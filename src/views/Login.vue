<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const data = ref({
  account: 'test123',
  password: 'test123',
})

function login() {
  router.push({ name: 'Dashboard' })
}
</script>

<template>
  <div class="h-screen d-flex align-center justify-center">
    <v-sheet class="d-flex flex-column pa-8 rounded-lg w-100" max-width="550">
      <p class="h2 text-center">系統名稱</p>
      <v-form @submit.prevent="login">
        <v-row>
          <v-col cols="12">
            <VTextField v-model="data.account" label="帳號" required placeholder="請輸入帳號" />
          </v-col>
          <v-col cols="12">
            <VTextField v-model="data.password" label="密碼" type="password" required placeholder="請輸入密碼" />
          </v-col>
        </v-row>

        <v-btn class="mt-8" type="submit" block color="primary"> 登入 </v-btn>
      </v-form>
    </v-sheet>
  </div>
</template>
