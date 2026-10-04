export default [
  {
    path: '/account',
    name: 'Account',
    meta: { title: '帳號管理' },
    component: () => import('@/views/Account/Account.vue'),
    children: [
      {
        path: 'edit/:id',
        name: 'AccountEdit',
        meta: { title: '編輯帳號', hidden: true },
        component: () => import('@/views/Account/AccountEdit/AccountEdit.vue'),
      },
    ],
  },
]
