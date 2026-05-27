import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const URL_BACKEND = import.meta.env.VITE_BACKEND_URL

export const useSessionStore = defineStore('session', () => {
    const user = ref(null)
    const isAuthenticated = ref(false)
    const loading = ref(false)

    const nombreBienvenida = computed(() => {
        return user.value ? user.value.nombre : 'Invitado'
    })

    const isAdmin = computed(() => {
        return user.value?.rol === 'admin'
    })

    async function login(correo, password) {
        loading.value = true
        try {
            const res = await fetch(`${URL_BACKEND}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ correo, password })
            })
            const data = await res.json()

            if (res.ok) {
                user.value = data.user
                isAuthenticated.value = true
                localStorage.setItem('petshop_user', JSON.stringify(data.user))
            }

            return { status: res.status, data }
        } catch (err) {
            return { status: 500, data: { error: 'Error de conexión con el servidor' } }
        } finally {
            loading.value = false
        }
    }

    async function register(nombre, correo, password) {
        loading.value = true
        try {
            const res = await fetch(`${URL_BACKEND}/registro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ nombre, correo, password })
            })
            const data = await res.json()
            return { status: res.status, data }
        } catch (err) {
            return { status: 500, data: { error: 'Error de conexión con el servidor' } }
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        try {
            await fetch(`${URL_BACKEND}/logout`, {
                method: 'POST',
                credentials: 'include'
            })
        } catch (err) {
            // Ignorar errores de red al cerrar sesión
        }
        user.value = null
        isAuthenticated.value = false
        localStorage.removeItem('petshop_user')
    }

    async function checkSession() {
        try {
            const res = await fetch(`${URL_BACKEND}/sesion`, {
                credentials: 'include'
            })
            const data = await res.json()

            if (data.autenticado && data.user) {
                user.value = data.user
                isAuthenticated.value = true
                localStorage.setItem('petshop_user', JSON.stringify(data.user))
            } else {
                // Intentar restaurar desde localStorage
                const saved = localStorage.getItem('petshop_user')
                if (saved) {
                    user.value = JSON.parse(saved)
                    isAuthenticated.value = true
                }
            }
        } catch (err) {
            // Si el backend no responde, intentar localStorage
            const saved = localStorage.getItem('petshop_user')
            if (saved) {
                user.value = JSON.parse(saved)
                isAuthenticated.value = true
            }
        }
    }

    return {
        user, isAuthenticated, loading,
        nombreBienvenida, isAdmin,
        login, register, logout, checkSession
    }
})
