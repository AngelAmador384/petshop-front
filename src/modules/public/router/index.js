import LandingView from '@/modules/public/submodules/home/views/LandingView.vue'
import AccountView from '@/modules/public/submodules/profiles/views/AccountView.vue'
import RecordsView from '@/modules/public/views/RecordsView.vue'
import InfoView from '@/modules/public/submodules/about/views/InfoView.vue'
import ProductDetailView from '@/modules/public/submodules/home/views/ProductDetailView.vue'
import CheckoutView from '@/modules/public/submodules/home/views/CheckoutView.vue'
import MascotasView from '@/modules/public/submodules/profiles/views/MascotasView.vue'
import RecomendacionesView from '@/modules/public/submodules/profiles/views/RecomendacionesView.vue'
import PacksView from '@/modules/public/submodules/home/views/PacksView.vue'
import PackDetailView from '@/modules/public/submodules/home/views/PackDetailView.vue'

const PublicRoutes = [
    { path: '/', name: 'home', component: LandingView },
    { path: '/tienda', name: 'tienda', component: RecordsView },
    { path: '/producto/:id', name: 'producto', component: ProductDetailView },
    { path: '/nosotros', name: 'nosotros', component: InfoView },
    { path: '/cuenta', name: 'cuenta', component: AccountView, meta: { requiresAuth: true } },
    { path: '/perfil', redirect: '/cuenta' }, // Redirect old route
    { path: '/checkout', name: 'checkout', component: CheckoutView, meta: { requiresAuth: true } },
    { path: '/mascotas', name: 'mascotas', component: MascotasView, meta: { requiresAuth: true } },
    { path: '/recomendaciones/:id', name: 'recomendaciones', component: RecomendacionesView, meta: { requiresAuth: true } },
    { path: '/packs', name: 'packs', component: PacksView },
    { path: '/packs/:id', name: 'pack-detail', component: PackDetailView },
]

export default PublicRoutes
