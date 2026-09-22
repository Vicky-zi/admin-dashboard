<script setup>
import { useAppStore } from '@/stores/appStore.js'
import { useUserStore } from '@/stores/userStore.js'
import { useMemberStore } from '@/stores/memberStore'
const appStore = useAppStore()
const userStore = useUserStore()
const memberStore = useMemberStore()

const { showSidebar } = storeToRefs(appStore)
const { user } = storeToRefs(userStore)

const props = defineProps({
  showHamburger: {
    type: Boolean,
  },
})

const { showHamburger } = toRefs(props)

const emit = defineEmits(['update:showSidebar'])

const role = computed(() => {
  return memberStore.getRoleText(user.value?.role)
})
const userName = computed(() => {
  return user.value?.name || ''
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
      <v-toolbar-title class="mr-4"> {{ userName }}（{{ role }}） </v-toolbar-title>

      <v-btn icon @click="userStore.logout()">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<style lang=""></style>
