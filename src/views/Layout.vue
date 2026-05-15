<script setup>
import { useAppStore } from '@/stores/appStore.js'
import { useDisplay } from 'vuetify'

const appStore = useAppStore()
const { showSidebar} = storeToRefs(appStore)

// Vuetify breakpoint
const { mdAndUp } = useDisplay()

// 根據裝置自動切換
watch(mdAndUp, (isDesktop) => {
  showSidebar.value = isDesktop
}, { immediate: true })

// 是否顯示漢堡選單
const showHamburger = computed(() => {
  return true
})
</script>

<template>
  <v-app>
    <Header :showSidebar="showSidebar" :show-hamburger="showHamburger"/>
    <Sidebar v-model:showSidebar="showSidebar" :isDesktop="mdAndUp" :show-hamburger="showHamburger" />

    <!-- Content -->
    <v-main>
      <v-container fluid>
        <Breadcrumbs />
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
