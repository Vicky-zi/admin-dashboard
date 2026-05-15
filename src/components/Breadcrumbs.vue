<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { routes } from '@/router/index.js'

const route = useRoute()

// 遞迴尋找當前路由的所有祖先
function findBreadcrumbs(routes, targetName, ancestors = []) {
  for (const r of routes) {
    const current = [...ancestors]
    
    if (r.meta?.title) {
      current.push({ title: r.meta.title, to: r.path })
    }

    if (r.name === targetName) {
      return current
    }

    if (r.children?.length) {
      const result = findBreadcrumbs(r.children, targetName, current)
      if (result) return result
    }
  }
  return null
}

const breadcrumbs = computed(() => {
  return [
    { title: 'Home', to: '/', disabled: true },
    ...(findBreadcrumbs(routes, route.name) || [])
  ]
})
</script>

<template>
  <v-breadcrumbs :items="breadcrumbs" class="pa-0" />
</template>