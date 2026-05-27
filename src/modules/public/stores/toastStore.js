import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
    const items = ref([])

    function show(message, type = 'success', duration = 3500) {
        const id = Date.now() + Math.random()
        items.value.push({ id, message, type, exiting: false })

        setTimeout(() => {
            const toast = items.value.find(t => t.id === id)
            if (toast) toast.exiting = true

            setTimeout(() => {
                items.value = items.value.filter(t => t.id !== id)
            }, 400)
        }, duration)
    }

    return { items, show }
})
