
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/IndexPage.vue'), meta: { title: '友伴' } }
    ]
  },
  { path: '/register', name: 'register', component: () => import('pages/RegisterPage.vue'), meta: { title: '友伴 | 註冊' } },
  { path: '/login', name: 'login', component: () => import('pages/LoginPage.vue'), meta: { title: '友伴 | 登入' } },
  {
    path: '/setting',
    component: () => import('layouts/SettingLayout.vue'),
    children: [
      { path: '', name: 'setting', component: () => import('../settings/SettingPage.vue'), meta: { title: '會員設定', login: true } },
      { path: '/comment', name: 'comment', component: () => import('../settings/CommentPage.vue'), meta: { title: '個人評分', login: true } },
      { path: '/appointment', name: 'appointment', component: () => import('../settings/AppointmentPage.vue'), meta: { title: '預約紀錄', login: true } },
      { path: '/question', name: 'question', component: () => import('../settings/QuestionPage.vue'), meta: { title: '個人發問', login: true } },
      { path: '/work', name: 'work', component: () => import('../settings/WorkPage.vue'), meta: { title: '工作預約紀錄', login: true } },
      { path: '/feedback', name: 'feedback', component: () => import('../settings/FeedbackPage.vue'), meta: { title: '會員反饋', login: true } }
    ]
  },
  {
    path: '/backstage',
    component: () => import('layouts/BackstageLayout.vue'),
    children: [
      { path: '', name: 'backstage', component: () => import('../backstages/BackstagePage.vue'), meta: { title: '會員管理', backstage: true, login: true } },
      { path: '/partner', name: 'partner', component: () => import('../backstages/PartnerPage.vue'), meta: { title: '夥伴管理', backstage: true, login: true } },
      { path: '/questionManage', name: 'questionManage', component: () => import('../backstages/QuestionManagePage.vue'), meta: { title: '意見/問題管理', backstage: true, login: true } },
      { path: '/appointmentManage', name: 'appointmentManage', component: () => import('../backstages/AppointmentManagePage.vue'), meta: { title: '預約管理', backstage: true, login: true } },
      { path: '/pageMessageManage', name: 'pageMessageManage', component: () => import('../backstages/PageMessageManagePage.vue'), meta: { title: '頁面訊息管理', backstage: true, login: true } }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
