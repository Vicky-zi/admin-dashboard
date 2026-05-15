export default [
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { title: 'Dashboard' },
    component: () => import('@/views/Dashboard/Dashboard.vue'),
  }
]