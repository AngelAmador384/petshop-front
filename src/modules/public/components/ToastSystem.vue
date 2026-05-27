<script setup>
    import { useToastStore } from '@/modules/public/stores/toastStore'
    const toastStore = useToastStore()

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500 text-gray-800'
    }

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    }
</script>

<template>
    <div class="fixed top-20 right-4 z-[60] space-y-2">
        <div
            v-for="toast in toastStore.items"
            :key="toast.id"
            :class="[
                toast.exiting ? 'toast-exit' : 'toast-enter',
                colors[toast.type] || colors.success,
                'text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px]'
            ]"
        >
            <span class="text-xl">{{ icons[toast.type] || '✅' }}</span>
            <span class="text-sm font-semibold">{{ toast.message }}</span>
        </div>
    </div>
</template>
