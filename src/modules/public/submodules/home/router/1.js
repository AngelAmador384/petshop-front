export default [
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/LandingView.vue')
  },
  {
    path: '/producto/:id',
    name: 'product-detail',
    component: () => import('../views/ProductDetailView.vue')
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/packs',
    name: 'packs',
    component: () => import('../views/PacksView.vue')
  },
  {
    path: '/packs/:id',
    name: 'pack-detail',
    component: () => import('../views/PackDetailView.vue')
  }
]
