export default [
  {
    path: '/orders',
    name: 'Orders',
    meta: { title: '訂單管理' },
    component: () => import('@/views/Orders/Orders.vue'),
    children: [
      {
        path: 'edit/:id',
        name: 'OrdersEdit',
        meta: { title: '編輯訂單', hidden: true },
        component: () => import('@/views/Orders/OrdersEdit/OrdersEdit.vue'),
      }
    ]
  },
]