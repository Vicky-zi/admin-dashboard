<script setup>
import { routes } from '@/router'

import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore.js'
const appStore = useAppStore()
const router = useRouter()

const { showSidebar} = storeToRefs(appStore)

const props = defineProps({
  isDesktop: Boolean
})

const filterRoutes = (routes) => {
  return routes
    .filter(route => route.meta?.hidden !== true)
    .map(route => ({
      ...route,
      children: route.children
        ? filterRoutes(route.children)
        : undefined
    }))
}


const menuRoutes = computed(() => {
  const layoutRoute = routes.find(r => r.children)

  return layoutRoute?.children
    ? filterRoutes(layoutRoute.children)
    : []
})
</script>

<template>
  <v-navigation-drawer v-model="showSidebar" :permanent="props.isDesktop" :temporary="!props.isDesktop">
    <v-list>
      <v-list-item v-for="item in menuRoutes"
        :key="item.name"
        :title="item.meta?.title"
        :to="item.path" />
    </v-list>
  </v-navigation-drawer>
</template>