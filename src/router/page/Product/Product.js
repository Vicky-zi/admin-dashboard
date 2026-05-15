export default [
  {
    path: '/product',
    name: 'Product',
    meta: { title: '商品管理' },
    component: () => import('@/views/Product/Product.vue'),
    children: [
      {
        path: 'create',
        name: 'ProductCreate',
        meta: { title: '新增商品', hidden: true },
        component: () => import('@/views/Product/ProductEdit/ProductEdit.vue'),
      },
      {
        path: 'edit/:id',
        name: 'ProductEdit',
        meta: { title: '編輯商品', hidden: true },
        component: () => import('@/views/Product/ProductEdit/ProductEdit.vue'),
      }
    ]
  },
]