<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useCartStore } from '@/modules/public/stores/cartStore'
    import { useSessionStore } from '@/modules/auth/stores/sessionStore'
    import { useToastStore } from '@/modules/public/stores/toastStore'
    import { useRouter } from 'vue-router'

    const URL_BACKEND = 'http://127.0.0.1:5000'

    const cartStore = useCartStore()
    const sessionStore = useSessionStore()
    const toastStore = useToastStore()
    const router = useRouter()

    const direccion = ref('')
    const telefono = ref('')
    const errDireccion = ref('')
    const errTelefono = ref('')
    const errorGeneral = ref('')
    const submitting = ref(false)
    const orderSuccess = ref(null)

    const envioGratis = computed(() => cartStore.total >= 599)
    const costoEnvio = computed(() => envioGratis.value ? 0 : 99)
    const totalFinal = computed(() => cartStore.total + costoEnvio.value)

    async function handleCheckout() {
        errDireccion.value = ''
        errTelefono.value = ''
        errorGeneral.value = ''

        let valid = true
        if (!direccion.value.trim()) {
            errDireccion.value = 'La dirección es requerida'
            valid = false
        }
        if (!telefono.value.trim()) {
            errTelefono.value = 'El teléfono es requerido'
            valid = false
        } else if (telefono.value.replace(/\D/g, '').length < 10) {
            errTelefono.value = 'Ingresa un teléfono válido (10 dígitos)'
            valid = false
        }

        if (!valid) return

        submitting.value = true

        const items = cartStore.items.map(i => ({
            producto_id: i.producto_id,
            cantidad: i.cantidad
        }))

        try {
            const res = await fetch(`${URL_BACKEND}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    items,
                    direccion: direccion.value,
                    telefono: telefono.value
                })
            })
            const data = await res.json()

            if (res.ok) {
                orderSuccess.value = data.pedido
                cartStore.clear()
                toastStore.show('¡Pedido confirmado! Revisa tu correo 📧', 'success')
            } else {
                errorGeneral.value = data.error || 'Error al procesar el pedido'
            }
        } catch (err) {
            errorGeneral.value = 'Error de conexión con el servidor'
        } finally {
            submitting.value = false
        }
    }

    onMounted(() => {
        if (!sessionStore.isAuthenticated) {
            router.push('/login')
        }
    })
</script>

<template>
    <!-- Success page -->
    <section v-if="orderSuccess" class="min-h-screen bg-orange-50 py-8">
        <div class="max-w-lg mx-auto px-4">
            <div class="text-center  bg-white rounded-3xl shadow-lg p-12 border border-green-100">
                <span class="text-7xl block mb-4">🎉</span>
                <h2 class="font-fredoka text-3xl text-gray-800 mb-2">¡Pedido Confirmado!</h2>
                <p class="text-gray-500 mb-2">Pedido #{{ orderSuccess.id }}</p>
                <p class="text-2xl font-bold text-green-600 mb-4">${{ orderSuccess.total.toFixed(2) }} MXN</p>
                <p class="text-gray-400 text-sm mb-6">Se ha enviado una confirmación a tu correo electrónico.</p>
                <div class="bg-green-50 rounded-xl p-4 mb-6 text-left text-sm text-green-700">
                    <p class="font-bold mb-2">📧 Correo de confirmación enviado</p>
                    <p>Dirección: {{ direccion }}</p>
                    <p>Teléfono: {{ telefono }}</p>
                </div>
                <RouterLink to="/tienda"
                    class="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-md inline-block">
                    Seguir comprando 🛍️
                </RouterLink>
            </div>
        </div>
    </section>

    <!-- Empty cart -->
    <section v-else-if="cartStore.items.length === 0" class="min-h-screen flex items-center justify-center bg-orange-50">
        <div class="text-center">
            <span class="text-6xl block mb-4">🛒</span>
            <h2 class="font-fredoka text-2xl text-gray-600">Tu carrito está vacío</h2>
            <RouterLink to="/tienda" class="mt-4 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold inline-block">
                Ir a la tienda
            </RouterLink>
        </div>
    </section>

    <!-- Checkout form -->
    <section v-else class="min-h-screen bg-orange-50 py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6">
            <h1 class="font-fredoka text-3xl text-gray-800 mb-8 ">💳 Finalizar Compra</h1>

            <div class="grid lg:grid-cols-5 gap-8">
                <!-- Form -->
                <div class="lg:col-span-3">
                    <form @submit.prevent="handleCheckout"
                        class="bg-white rounded-2xl shadow-md p-6 border border-orange-100 space-y-4">
                        <h3 class="font-bold text-lg text-gray-800 mb-2">📍 Datos de Envío</h3>

                        <div>
                            <label class="block text-sm font-semibold text-gray-600 mb-1">Dirección completa</label>
                            <textarea v-model="direccion" rows="3" placeholder="Calle, número, colonia, ciudad, CP..."
                                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400  resize-none" required></textarea>
                            <p v-if="errDireccion" class="text-red-500 text-xs mt-1">{{ errDireccion }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-600 mb-1">Teléfono de contacto</label>
                            <input type="tel" v-model="telefono" placeholder="Ej: 55 1234 5678"
                                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 " required>
                            <p v-if="errTelefono" class="text-red-500 text-xs mt-1">{{ errTelefono }}</p>
                        </div>

                        <div v-if="errorGeneral" class="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">
                            {{ errorGeneral }}
                        </div>

                        <button type="submit" :disabled="submitting"
                            class="w-full py-4 bg-green-500 text-white font-bold rounded-xl shadow-md text-lg">
                            {{ submitting ? '⏳ Procesando...' : `✅ Confirmar Pedido — $${totalFinal.toFixed(2)} MXN` }}
                        </button>
                    </form>
                </div>

                <!-- Order summary -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-2xl shadow-md p-6 border border-orange-100 sticky top-24">
                        <h3 class="font-bold text-lg text-gray-800 mb-4">🧾 Resumen del Pedido</h3>
                        <div class="space-y-3 max-h-[300px] overflow-y-auto">
                            <div v-for="item in cartStore.items" :key="item.producto_id" class="flex gap-3 items-center">
                                <img :src="item.imagen_url" class="w-12 h-12 rounded-lg object-cover">
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-semibold text-gray-700 truncate">{{ item.nombre }}</p>
                                    <p class="text-xs text-gray-400">{{ item.cantidad }} × ${{ item.precio.toFixed(2) }}</p>
                                </div>
                                <span class="text-sm font-bold text-gray-700">${{ (item.precio * item.cantidad).toFixed(2) }}</span>
                            </div>
                        </div>
                        <div class="border-t mt-4 pt-4 space-y-2">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Subtotal</span>
                                <span>${{ cartStore.total.toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Envío</span>
                                <span :class="envioGratis ? 'text-green-600 font-bold' : ''">
                                    {{ envioGratis ? 'GRATIS 🎉' : '$99.00' }}
                                </span>
                            </div>
                            <div class="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total</span>
                                <span class="text-orange-600">${{ totalFinal.toFixed(2) }} MXN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
