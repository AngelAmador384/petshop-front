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
    }

    async function checkSession() {
        // Si ya hay datos persistidos, no es necesario verificar con el backend inmediatamente
        if (user.value && isAuthenticated.value) {
            return
        }

        try {
            const res = await fetch(`${URL_BACKEND}/sesion`, {
                credentials: 'include'
            })
            const data = await res.json()

            if (data.autenticado && data.user) {
                user.value = data.user
                isAuthenticated.value = true
            }
        } catch (err) {
            // Si el backend no responde, mantener el estado persistido
            console.warn('No se pudo verificar la sesión con el backend')
        }
    }

    return {
        user, isAuthenticated, loading,
        nombreBienvenida, isAdmin,
        login, register, logout, checkSession
    }
}, {
    persist: {
        key: 'petshop_session',
        storage: localStorage,
        paths: ['user', 'isAuthenticated']
    }
})
