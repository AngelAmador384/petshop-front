<script setup>
    import { ref, computed, onMounted, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useRecordsStore } from '@/modules/public/stores/recordsStore'
    import { useCartStore } from '@/modules/public/stores/cartStore'
    import { useToastStore } from '@/modules/public/stores/toastStore'
    import ItemCard from '@/modules/public/components/ItemCard.vue'

    const URL_BACKEND = 'http://127.0.0.1:5000'

    const route = useRoute()
    const router = useRouter()
    const recordsStore = useRecordsStore()
    const cartStore = useCartStore()
    const toastStore = useToastStore()

    const product = ref(null)
    const loading = ref(true)

    const categoryEmojis = {
        croquetas: '🦴', accesorios: '🎀', juguetes: '🎾', higiene: '🛁', camas: '🛏️'
    }

    function getCategoryEmoji(cat) {
        return categoryEmojis[cat] || '📦'
    }

    const related = computed(() => {
        if (!product.value) return []
        return recordsStore.productos
            .filter(p => p.categoria === product.value.categoria && p.id !== product.value.id)
            .slice(0, 4)
    })

    function addToCart() {
        if (product.value) {
            cartStore.addItem(product.value)
            toastStore.show(`${product.value.nombre} agregado al carrito 🛒`, 'success')
        }
    }

    function buyNow() {
        if (product.value) {
            cartStore.addItem(product.value)
            router.push('/checkout')
        }
    }

    async function loadProduct() {
        loading.value = true
        const id = route.params.id

        try {
            const res = await fetch(`${URL_BACKEND}/productos/${id}`)
            if (res.ok) {
                product.value = await res.json()
            } else {
                product.value = null
            }
        } catch (err) {
            product.value = null
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        loadProduct()
        if (recordsStore.productos.length === 0) {
            recordsStore.fetchProductos()
        }
    })

    watch(() => route.params.id, () => {
        loadProduct()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    })
</script>

<template>
    <!-- Loading -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
        <p class="text-gray-400 text-xl">Cargando producto...</p>
    </div>

    <!-- Not found -->
    <div v-else-if="!product" class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <span class="text-6xl block mb-4">😿</span>
            <p class="text-gray-400 text-xl">Producto no encontrado</p>
            <RouterLink to="/tienda" class="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full font-semibold inline-block">
                Volver a la tienda
            </RouterLink>
        </div>
    </div>

    <!-- Product detail -->
    <section v-else class="min-h-screen bg-orange-50 py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <RouterLink to="/" class="">Inicio</RouterLink>
                <span>/</span>
                <RouterLink to="/tienda" class="">Tienda</RouterLink>
                <span>/</span>
                <span class="text-gray-600 font-semibold">{{ product.nombre }}</span>
            </div>

            <div class="grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-orange-100">
                <!-- Image -->
                <div class="relative">
                    <img :src="product.imagen_url" :alt="product.nombre"
                        class="w-full aspect-square object-cover rounded-2xl shadow-md">
                    <span class="absolute top-4 left-4 px-3 py-1 bg-white/90  rounded-full text-sm font-bold text-orange-600 capitalize">
                        {{ getCategoryEmoji(product.categoria) }} {{ product.categoria }}
                    </span>
                </div>

                <!-- Info -->
                <div class="flex flex-col justify-center space-y-4">
                    <h1 class="font-fredoka text-2xl sm:text-3xl text-gray-800">{{ product.nombre }}</h1>
                    <p class="text-gray-600 leading-relaxed">{{ product.descripcion }}</p>

                    <div class="bg-orange-50 rounded-xl p-4 space-y-2">
                        <span class="font-fredoka text-3xl text-orange-600">${{ product.precio.toFixed(2) }} MXN</span>
                        <p :class="['text-sm font-semibold', product.stock > 10 ? 'text-green-600' : 'text-red-500']">
                            {{ product.stock > 10 ? `✅ ${product.stock} disponibles` : `⚠️ ¡Solo quedan ${product.stock}!` }}
                        </p>
                    </div>

                    <div class="flex gap-3 pt-2">
                        <button @click="addToCart"
                            class="flex-1 py-4 bg-orange-500 text-white font-bold rounded-xl shadow-md text-lg">
                            🛒 Agregar al Carrito
                        </button>
                        <button @click="buyNow"
                            class="px-6 py-4 bg-green-500 text-white font-bold rounded-xl  ">
                            ⚡ Comprar
                        </button>
                    </div>

                    <div class="grid grid-cols-3 gap-3 pt-4">
                        <div class="text-center p-3 bg-gray-50 rounded-xl">
                            <span class="text-xl">🚚</span>
                            <p class="text-xs text-gray-500 mt-1">Envío gratis</p>
                        </div>
                        <div class="text-center p-3 bg-gray-50 rounded-xl">
                            <span class="text-xl">🔄</span>
                            <p class="text-xs text-gray-500 mt-1">30 días</p>
                        </div>
                        <div class="text-center p-3 bg-gray-50 rounded-xl">
                            <span class="text-xl">🔒</span>
                            <p class="text-xs text-gray-500 mt-1">Pago seguro</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Related Products -->
            <div v-if="related.length > 0" class="mt-12">
                <h3 class="font-fredoka text-2xl text-gray-800 mb-6">Productos Relacionados</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ItemCard v-for="p in related" :key="p.id" :product="p" />
                </div>
            </div>
        </div>
    </section>
</template>
