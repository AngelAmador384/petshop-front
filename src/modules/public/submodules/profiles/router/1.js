export default [
  {
    path: '/cuenta',
    name: 'account',
    component: () => import('../views/AccountView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mascotas',
    name: 'mascotas',
    component: () => import('../views/MascotasView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/recomendaciones/:id',
    name: 'recomendaciones',
    component: () => import('../views/RecomendacionesView.vue'),
    meta: { requiresAuth: true }
  }
]
