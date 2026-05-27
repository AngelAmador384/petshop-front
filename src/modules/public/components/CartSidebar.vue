<script setup>
    import { useCartStore } from '@/modules/public/stores/cartStore'
    import { useSessionStore } from '@/modules/auth/stores/sessionStore'
    import { useRouter } from 'vue-router'

    const cartStore = useCartStore()
    const sessionStore = useSessionStore()
    const router = useRouter()

    function cerrarCarrito() {
        cartStore.isOpen = false
    }

    function cerrarSiBackdrop(e) {
        if (e.target === e.currentTarget) {
            cerrarCarrito()
        }
    }

    function irTienda() {
        cerrarCarrito()
        router.push('/tienda')
    }

    function irCheckout() {
        cerrarCarrito()
        router.push('/checkout')
    }

    function irLogin() {
        cerrarCarrito()
        router.push('/login')
    }
</script>

<template>
    <div v-if="cartStore.isOpen" class="fixed inset-0 z-50 flex justify-end" @click="cerrarSiBackdrop">
        <div class="modal-backdrop absolute inset-0"></div>
        <div class="relative w-full max-w-md bg-white shadow-2xl  flex flex-col h-full">
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b bg-orange-50">
                <h2 class="text-xl font-bold text-gray-800">
                    🛒 Mi Carrito <span class="text-sm text-gray-500">({{ cartStore.count }})</span>
                </h2>
                <button @click="cerrarCarrito" class="p-2  rounded-full ">✕</button>
            </div>

            <!-- Items -->
            <div class="flex-1 overflow-y-auto p-4 space-y-3">
                <!-- Empty state -->
                <div v-if="cartStore.items.length === 0" class="text-center py-12">
                    <span class="text-6xl block mb-4">🐕</span>
                    <p class="text-gray-400 text-lg">Tu carrito está vacío</p>
                    <p class="text-gray-300 text-sm mt-1">¡Agrega productos para consentir a tu mascota!</p>
                    <button @click="irTienda" class="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full font-semibold  ">
                        Ir a la Tienda
                    </button>
                </div>

                <!-- Cart items -->
                <div v-for="item in cartStore.items" :key="item.producto_id"
                    class="flex gap-3 bg-gray-50 rounded-xl p-3 ">
                    <img :src="item.imagen_url" :alt="item.nombre" class="w-16 h-16 rounded-lg object-cover">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-sm text-gray-800 truncate">{{ item.nombre }}</h4>
                        <p class="text-orange-600 font-bold">${{ item.precio.toFixed(2) }}</p>
                        <div class="flex items-center gap-2 mt-1">
                            <button @click="cartStore.updateQty(item.producto_id, item.cantidad - 1)"
                                class="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold ">
                                −
                            </button>
                            <span class="text-sm font-semibold w-6 text-center">{{ item.cantidad }}</span>
                            <button @click="cartStore.updateQty(item.producto_id, item.cantidad + 1)"
                                class="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold ">
                                +
                            </button>
                        </div>
                    </div>
                    <div class="flex flex-col items-end justify-between">
                        <button @click="cartStore.removeItem(item.producto_id)"
                            class="text-gray-300   text-lg">🗑️</button>
                        <span class="text-sm font-bold text-gray-700">${{ (item.precio * item.cantidad).toFixed(2) }}</span>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div v-if="cartStore.items.length > 0" class="border-t p-4 bg-orange-50 space-y-3">
                <div class="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span class="text-orange-600">${{ cartStore.total.toFixed(2) }} MXN</span>
                </div>

                <button v-if="sessionStore.isAuthenticated" @click="irCheckout"
                    class="w-full py-3 bg-orange-500 text-white font-bold rounded-xl shadow-md text-lg">
                    Proceder al Pago 💳
                </button>
                <button v-else @click="irLogin"
                    class="w-full py-3 bg-orange-500 text-white font-bold rounded-xl shadow-md">
                    Inicia sesión para comprar 🔐
                </button>

                <button @click="cartStore.clear()"
                    class="w-full py-2 text-gray-400  text-sm font-semibold ">
                    Vaciar carrito
                </button>
            </div>
        </div>
    </div>
</template>
