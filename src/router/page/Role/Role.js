export default [
  {
    path: '/role',
    name: 'Role',
    meta: { title: '權限管理' },
    component: () => import('@/views/Role/Role.vue'),
    children: [
      {
        path: 'edit/:id',
        name: 'RoleEdit',
        meta: { title: '編輯權限', hidden: true },
        component: () => import('@/views/Role/RoleEdit/RoleEdit.vue'),
      },
    ],
  },
]
