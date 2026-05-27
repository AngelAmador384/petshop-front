import SessionView from '@/modules/auth/views/SessionView.vue'
import ConfirmarCorreo from '@/modules/auth/views/ConfirmarCorreo.vue'

const AuthRoutes = [
    { path: '/login', name: 'login', component: SessionView },
    { path: '/registro', name: 'registro', component: SessionView },
    { path: '/confirmar/:token', name: 'ConfirmarCorreo', component: ConfirmarCorreo },
]

export default AuthRoutes
