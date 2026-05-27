<script setup>
    import { computed } from 'vue'
    import { useCartStore } from '@/modules/public/stores/cartStore'
    import { useToastStore } from '@/modules/public/stores/toastStore'
    import { useRouter } from 'vue-router'

    const props = defineProps({
        product: { type: Object, required: true }
    })

    const cartStore = useCartStore()
    const toastStore = useToastStore()
    const router = useRouter()

    const inCart = computed(() => {
        return cartStore.items.find(i => i.producto_id === props.product.id)
    })

    const categoryEmojis = {
        croquetas: '🦴',
        accesorios: '🎀',
        juguetes: '🎾',
        higiene: '🛁',
        camas: '🛏️'
    }

    function getCategoryEmoji(cat) {
        return categoryEmojis[cat] || '📦'
    }

    function addToCart() {
        cartStore.addItem(props.product)
        toastStore.show(`${props.product.nombre} agregado al carrito 🛒`, 'success')
    }

    function goToDetail() {
        router.push(`/producto/${props.product.id}`)
    }
</script>

<template>
    <div class="product-card bg-white rounded-2xl shadow-md overflow-hidden border border-orange-100 flex flex-col">
        <!-- Image -->
        <div class="relative overflow-hidden cursor-pointer" @click="goToDetail">
            <img :src="product.imagen_url" :alt="product.nombre"
                class="w-full h-48 object-cover  transition-transform duration-500" loading="lazy">
            <div class="absolute top-3 left-3">
                <span class="px-3 py-1 bg-white/90  rounded-full text-xs font-bold text-orange-600 capitalize">
                    {{ getCategoryEmoji(product.categoria) }} {{ product.categoria }}
                </span>
            </div>
            <div v-if="product.stock < 10" class="absolute top-3 right-3">
                <span class="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                    ¡Últimas {{ product.stock }}!
                </span>
            </div>
        </div>

        <!-- Content -->
        <div class="p-4 flex-1 flex flex-col">
            <h3 class="font-bold text-gray-800 text-sm mb-1 cursor-pointer   line-clamp-1"
                @click="goToDetail">
                {{ product.nombre }}
            </h3>
            <p class="text-gray-400 text-xs mb-2 line-clamp-2 flex-1">{{ product.descripcion }}</p>

            <!-- Slot for custom content -->
            <slot></slot>

            <div class="flex items-center justify-between mt-auto pt-2 border-t border-orange-50">
                <span class="font-fredoka text-xl text-orange-600">${{ product.precio.toFixed(2) }}</span>
                <button @click.stop="addToCart"
                    :class="[
                        ' px-4 py-2 text-white text-xs font-bold rounded-full shadow-md',
                        inCart ? 'bg-green-500' : 'bg-orange-500'
                    ]">
                    {{ inCart ? `✓ (${inCart.cantidad})` : '🛒 Agregar' }}
                </button>
            </div>
        </div>
    </div>
</template>
