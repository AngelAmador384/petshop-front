<script setup>
    import { ref } from 'vue'
    import { useSessionStore } from '@/modules/auth/stores/sessionStore'
    import { useCartStore } from '@/modules/public/stores/cartStore'
    import { useToastStore } from '@/modules/public/stores/toastStore'
    import { useRouter, useRoute } from 'vue-router'

    const sessionStore = useSessionStore()
    const cartStore = useCartStore()
    const toastStore = useToastStore()
    const router = useRouter()
    const route = useRoute()

    const mobileMenuOpen = ref(false)

    function toggleMobileMenu() {
        mobileMenuOpen.value = !mobileMenuOpen.value
    }

    function isActive(path) {
        return route.path === path
    }

    async function handleLogout() {
        await sessionStore.logout()
        cartStore.clear()
        toastStore.show('Sesión cerrada. ¡Hasta pronto! 👋', 'info')
        router.push('/')
    }
</script>

<template>
    <nav class="nav-glass fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <RouterLink to="/" class="flex items-center gap-2 group">
                    <span class="text-3xl ">🐾</span>
                    <span class="font-fredoka text-xl sm:text-2xl gradient-text">PetShop MX</span>
                </RouterLink>

                <!-- Desktop Nav -->
                <div class="hidden md:flex items-center gap-2">
                    <RouterLink to="/"
                        :class="['category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ', isActive('/') ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600  ']">
                        🏠 Inicio
                    </RouterLink>
                    <RouterLink to="/tienda"
                        :class="['category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ', isActive('/tienda') ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600  ']">
                        🛍️ Tienda
                    </RouterLink>
                    <RouterLink to="/packs"
                        :class="['category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ', isActive('/packs') ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600  ']">
                        📦 Packs
                    </RouterLink>
                    <RouterLink v-if="sessionStore.isAuthenticated" to="/mascotas"
                        :class="['category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ', isActive('/mascotas') ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600  ']">
                        🐾 Mis Mascotas
                    </RouterLink>
                    <RouterLink to="/nosotros"
                        :class="['category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ', isActive('/nosotros') ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600  ']">
                        ℹ️ Nosotros
                    </RouterLink>
                    <RouterLink v-if="sessionStore.isAuthenticated && sessionStore.isAdmin" to="/admin"
                        :class="['category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ', isActive('/admin') ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600  ']">
                        ⚙️ Admin
                    </RouterLink>
                    <RouterLink v-if="sessionStore.isAuthenticated" to="/cuenta"
                        :class="['category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ', isActive('/cuenta') ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600  ']">
                        👤 Mi Cuenta
                    </RouterLink>
                </div>

                <!-- Right side -->
                <div class="flex items-center gap-3">
                    <!-- Cart button -->
                    <button @click="cartStore.toggle()" class="relative p-2 rounded-full " title="Carrito">
                        <span class="text-2xl">🛒</span>
                        <span v-if="cartStore.count > 0"
                            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center badge-bounce">
                            {{ cartStore.count }}
                        </span>
                    </button>

                    <!-- Auth buttons (not logged in) -->
                    <template v-if="!sessionStore.isAuthenticated">
                        <RouterLink to="/login"
                            class="px-4 py-2 text-sm font-semibold text-orange-600  rounded-full ">
                            Iniciar Sesión
                        </RouterLink>
                        <RouterLink to="/registro"
                            class="px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded-full shadow-md">
                            Registrarse
                        </RouterLink>
                    </template>

                    <!-- User info (logged in) -->
                    <template v-else>
                        <div class="hidden sm:flex items-center gap-2">
                            <span class="text-sm text-gray-600">
                                Hola, <strong class="text-orange-600">{{ sessionStore.user?.nombre?.split(' ')[0] }}</strong>
                            </span>
                            <span v-if="sessionStore.isAdmin"
                                class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-bold">
                                ADMIN
                            </span>
                        </div>
                        <button @click="handleLogout"
                            class="px-3 py-2 text-sm text-gray-500   rounded-full "
                            title="Cerrar sesión">
                            🚪
                        </button>
                    </template>

                    <!-- Mobile menu button -->
                    <button @click="toggleMobileMenu" class="md:hidden p-2 rounded-full ">
                        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Nav -->
            <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t border-orange-100 mt-2 pt-3">
                <div class="flex flex-col gap-2">
                    <RouterLink to="/" @click="mobileMenuOpen = false"
                        class="category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 ">
                        🏠 Inicio
                    </RouterLink>
                    <RouterLink to="/tienda" @click="mobileMenuOpen = false"
                        class="category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 ">
                        🛍️ Tienda
                    </RouterLink>
                    <RouterLink to="/packs" @click="mobileMenuOpen = false"
                        class="category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 ">
                        📦 Packs
                    </RouterLink>
                    <RouterLink v-if="sessionStore.isAuthenticated" to="/mascotas" @click="mobileMenuOpen = false"
                        class="category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 ">
                        🐾 Mis Mascotas
                    </RouterLink>
                    <RouterLink to="/nosotros" @click="mobileMenuOpen = false"
                        class="category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 ">
                        ℹ️ Nosotros
                    </RouterLink>
                    <RouterLink v-if="sessionStore.isAuthenticated && sessionStore.isAdmin" to="/admin" @click="mobileMenuOpen = false"
                        class="category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 ">
                        ⚙️ Admin
                    </RouterLink>
                    <RouterLink v-if="sessionStore.isAuthenticated" to="/cuenta" @click="mobileMenuOpen = false"
                        class="category-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 ">
                        👤 Mi Cuenta
                    </RouterLink>
                </div>
            </div>
        </div>
    </nav>
    <!-- Spacer for fixed navbar -->
    <div class="h-16"></div>
</template>
