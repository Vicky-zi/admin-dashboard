<script setup>
import { useAppStore } from '@/stores/appStore.js'
import { useUserStore } from '@/stores/userStore.js'
import { useAccountStore } from '@/stores/accountStore'
const appStore = useAppStore()
const userStore = useUserStore()
const accountStore = useAccountStore()

const { showSidebar } = storeToRefs(appStore)
const { user } = storeToRefs(userStore)

const props = defineProps({
  showHamburger: {
    type: Boolean,
  },
})

const { showHamburger } = toRefs(props)

const emit = defineEmits(['update:showSidebar'])

// ====================
// 登出倒數
// ====================

// 儲存剩餘秒數
const remainingSeconds = ref(0)

// 將剩餘秒數轉換成「分:秒」格式
const remainingTime = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

// 更新剩餘時間
function updateRemainingTime() {
  // 取得使用者的登入到期時間
  const expireAt = userStore.sessionExpireAt

  if (!expireAt) {
    remainingSeconds.value = 0
    return
  }

  // 使用目前時間與到期時間進行比對
  const remaining = expireAt - Date.now()

  // 到期時間已經超過目前時間
  if (remaining <= 0) {
    remainingSeconds.value = 0
    userStore.logout()
    return
  }

  // 將毫秒轉換成秒
  remainingSeconds.value = Math.ceil(remaining / 1000)
}

// 儲存計時器
let timer = null

onMounted(() => {
  updateRemainingTime()

  timer = setInterval(() => {
    updateRemainingTime()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

function openSidebar() {
  console.log('側欄現在是開啟狀態：', showSidebar.value)
  showSidebar.value = !showSidebar.value
}
</script>
<template>
  <v-app-bar>
    <v-app-bar-nav-icon v-if="showHamburger" @click="openSidebar()" />
    <v-spacer />

    <div class="d-flex align-center">
      <v-toolbar-title class="mr-4"> {{ user?.name || '' }}（{{ user?.roleName || '' }}） </v-toolbar-title>

      <span class="mr-4">
        {{ remainingTime }}
      </span>

      <v-btn icon @click="userStore.logout()">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<style lang=""></style>
