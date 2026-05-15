import { createRouter, createWebHashHistory } from 'vue-router'

import dashboardRoutes from './page/Dashboard/Dashboard'
import productRoutes from './page/Product/Product'
import oderRoutes from './page/Orders/Orders'
import memberRoutes from './page/Member/Member'

// 攤平路由
function flattenRoute(routes) {
  let flatRoute = []

  if (routes.length === 0) return flatRoute

  routes.forEach((route) => {
    if (route.children && route.children.length) {
      const childRoutes = flattenRoute(route.children)
      flatRoute = flatRoute.concat(childRoutes)
    }
    flatRoute.push({ ...route, children: [] })
  })

  return flatRoute
}

const pageRoutes = [...dashboardRoutes, ...productRoutes, ...oderRoutes, ...memberRoutes]

// 給麵包屑使用的原始巢狀結構
export const routes = [
  {
    path: '/Login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    children: [...pageRoutes],
  },
]

// 給 router 使用的攤平結構
const flatRoutes = [
  {
    path: '/Login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    children: flattenRoute(pageRoutes),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: flatRoutes,
})

export default router
