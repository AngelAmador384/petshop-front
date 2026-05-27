<script setup>
    import { useSessionStore } from '@/modules/auth/stores/sessionStore'
    import { useToastStore } from '@/modules/public/stores/toastStore'
    import { useCartStore } from '@/modules/public/stores/cartStore'
    import { useRouter } from 'vue-router'
    import { onMounted } from 'vue'

    const sessionStore = useSessionStore()
    const toastStore = useToastStore()
    const cartStore = useCartStore()
    const router = useRouter()

    async function handleLogout() {
        await sessionStore.logout()
        cartStore.clear()
        toastStore.show('Sesión cerrada. ¡Hasta pronto! 👋', 'info')
        router.push('/')
    }

    onMounted(() => {
        if (!sessionStore.isAuthenticated) {
            router.push('/login')
        }
    })
</script>

<template>
    <section v-if="sessionStore.isAuthenticated" class="min-h-screen bg-orange-50 py-8 paw-bg">
        <div class="max-w-4xl mx-auto px-4 sm:px-6">
            <div class="bg-white rounded-3xl shadow-lg p-8 border border-orange-100 ">
                <!-- Profile header -->
                <div class="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-orange-100">
                    <div class="w-24 h-24 rounded-full bg-orange-400 flex items-center justify-center text-white font-fredoka text-3xl shadow-lg">
                        {{ sessionStore.user?.nombre?.charAt(0)?.toUpperCase() }}
                    </div>
                    <div class="text-center sm:text-left">
                        <h1 class="font-fredoka text-2xl text-gray-800">{{ sessionStore.user?.nombre }}</h1>
                        <p class="text-gray-500">{{ sessionStore.user?.email }}</p>
                        <span :class="[
                            'inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase',
                            sessionStore.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                        ]">
                            {{ sessionStore.user?.rol }}
                        </span>
                    </div>
                    <div class="sm:ml-auto">
                        <button @click="handleLogout"
                            class="px-6 py-2 bg-red-50 text-red-500 rounded-xl font-semibold  ">
                            🚪 Cerrar Sesión
                        </button>
                    </div>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div class="bg-orange-50 rounded-xl p-4 text-center">
                        <span class="text-2xl">🛒</span>
                        <p class="font-bold text-lg text-gray-800 mt-1">0</p>
                        <p class="text-xs text-gray-500">Pedidos</p>
                    </div>
                    <div class="bg-pink-50 rounded-xl p-4 text-center">
                        <span class="text-2xl">❤️</span>
                        <p class="font-bold text-lg text-gray-800 mt-1">0</p>
                        <p class="text-xs text-gray-500">Favoritos</p>
                    </div>
                    <div class="bg-green-50 rounded-xl p-4 text-center">
                        <span class="text-2xl">⭐</span>
                        <p class="font-bold text-lg text-gray-800 mt-1">0</p>
                        <p class="text-xs text-gray-500">Reseñas</p>
                    </div>
                    <div class="bg-blue-50 rounded-xl p-4 text-center">
                        <span class="text-2xl">🎁</span>
                        <p class="font-bold text-lg text-gray-800 mt-1">500</p>
                        <p class="text-xs text-gray-500">Puntos</p>
                    </div>
                </div>

                <!-- Quick actions -->
                <div class="grid sm:grid-cols-2 gap-4">
                    <RouterLink to="/tienda"
                        class="p-4 bg-orange-500 text-white rounded-xl font-bold shadow-md flex items-center gap-3">
                        🛍️
                        <div class="text-left">
                            <p class="font-bold">Ir a la Tienda</p>
                            <p class="text-xs text-white/80">Explora nuevos productos</p>
                        </div>
                    </RouterLink>

                    <RouterLink v-if="sessionStore.isAdmin" to="/admin"
                        class="p-4 bg-purple-500 text-white rounded-xl font-bold shadow-md flex items-center gap-3">
                        ⚙️
                        <div class="text-left">
                            <p class="font-bold">Panel Admin</p>
                            <p class="text-xs text-white/80">Gestionar productos y usuarios</p>
                        </div>
                    </RouterLink>

                    <RouterLink v-else to="/nosotros"
                        class="p-4 bg-blue-500 text-white rounded-xl font-bold shadow-md flex items-center gap-3">
                        💬
                        <div class="text-left">
                            <p class="font-bold">Contacto</p>
                            <p class="text-xs text-white/80">¿Necesitas ayuda?</p>
                        </div>
                    </RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>
