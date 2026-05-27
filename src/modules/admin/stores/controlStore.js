import { defineStore } from 'pinia'
import { ref } from 'vue'

const URL_BACKEND = import.meta.env.VITE_BACKEND_URL

export const useControlStore = defineStore('control', () => {
    const stats = ref(null)
    const usuarios = ref([])
    const pedidos = ref([])
    const loading = ref(false)

    async function fetchStats() {
        loading.value = true
        try {
            const res = await fetch(`${URL_BACKEND}/admin/stats`, {
                credentials: 'include'
            })
            if (res.ok) {
                stats.value = await res.json()
            }
        } catch (err) {
            console.error('Error cargando stats:', err)
        } finally {
            loading.value = false
        }
    }

    async function fetchUsuarios() {
        try {
            const res = await fetch(`${URL_BACKEND}/admin/usuarios`, {
                credentials: 'include'
            })
            if (res.ok) {
                const data = await res.json()
                usuarios.value = data.usuarios || []
            }
        } catch (err) {
            console.error('Error cargando usuarios:', err)
        }
    }

    async function fetchPedidos() {
        try {
            const res = await fetch(`${URL_BACKEND}/pedidos`, {
                credentials: 'include'
            })
            if (res.ok) {
                const data = await res.json()
                pedidos.value = data.pedidos || []
            }
        } catch (err) {
            console.error('Error cargando pedidos:', err)
        }
    }

    async function addProducto(data) {
        try {
            const res = await fetch(`${URL_BACKEND}/productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            })
            const result = await res.json()
            return { status: res.status, data: result }
        } catch (err) {
            return { status: 500, data: { error: 'Error de conexión' } }
        }
    }

    return {
        stats, usuarios, pedidos, loading,
        fetchStats, fetchUsuarios, fetchPedidos, addProducto
    }
})
