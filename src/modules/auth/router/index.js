import SessionView from '@/modules/auth/views/SessionView.vue'

const AuthRoutes = [
    { path: '/login', name: 'login', component: SessionView },
    { path: '/registro', name: 'registro', component: SessionView },
]

export default AuthRoutes
