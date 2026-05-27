import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
    const items = ref([])
    const isOpen = ref(false)

    const total = computed(() => {
        return items.value.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    })

    const count = computed(() => {
        return items.value.reduce((sum, item) => sum + item.cantidad, 0)
    })

    function addItem(product) {
        const existing = items.value.find(i => i.producto_id === product.id)
        if (existing) {
            if (existing.cantidad < product.stock) {
                existing.cantidad++
            }
        } else {
            items.value.push({
                producto_id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                imagen_url: product.imagen_url,
                cantidad: 1,
                stock: product.stock
            })
        }
    }

    function removeItem(productoId) {
        items.value = items.value.filter(i => i.producto_id !== productoId)
    }

    function updateQty(productoId, qty) {
        const item = items.value.find(i => i.producto_id === productoId)
        if (item) {
            item.cantidad = Math.max(1, Math.min(qty, item.stock))
        }
    }

    function clear() {
        items.value = []
    }

    function toggle() {
        isOpen.value = !isOpen.value
    }

    return { items, isOpen, total, count, addItem, removeItem, updateQty, clear, toggle }
})
