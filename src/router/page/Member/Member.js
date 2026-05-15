export default [
  {
    path: '/member',
    name: 'Member',
    meta: { title: '會員管理' },
    component: () => import('@/views/Member/Member.vue'),
    children: [
      {
        path: 'edit/:id',
        name: 'MemberEdit',
        meta: { title: '編輯會員', hidden: true },
        component: () => import('@/views/Member/MemberEdit/MemberEdit.vue'),
      }
    ]
  },
]