<script setup>
    import { computed } from 'vue'
    import { useRoute } from 'vue-router'
    import SessionForm from '@/modules/auth/components/SessionForm.vue'

    const route = useRoute()
    const isLogin = computed(() => route.path === '/login')
</script>

<template>
    <section class="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-12 paw-bg">
        <div class="w-full max-w-md">
            <div class="bg-white rounded-3xl shadow-xl p-8 border border-orange-100 ">
                <!-- Header -->
                <div class="text-center mb-8">
                    <span class="text-5xl block mb-3">{{ isLogin ? '🔐' : '🐾' }}</span>
                    <h2 class="font-fredoka text-2xl text-gray-800">{{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}</h2>
                    <p class="text-gray-400 text-sm mt-1">
                        {{ isLogin ? 'Accede a tu cuenta de PetShop MX' : 'Únete a la familia PetShop MX' }}
                    </p>
                </div>

                <!-- SessionForm Component -->
                <SessionForm :mode="isLogin ? 'login' : 'register'" />

                <!-- Toggle -->
                <div class="text-center mt-6 text-sm text-gray-500">
                    <template v-if="isLogin">
                        ¿No tienes cuenta?
                        <RouterLink to="/registro" class="text-orange-600 font-bold ">Regístrate aquí</RouterLink>
                    </template>
                    <template v-else>
                        ¿Ya tienes cuenta?
                        <RouterLink to="/login" class="text-orange-600 font-bold ">Inicia sesión</RouterLink>
                    </template>
                </div>

                <!-- Demo credentials (login only) -->
                <div v-if="isLogin" class="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <p class="text-xs font-bold text-amber-700 mb-2">🔑 Credenciales de prueba:</p>
                    <div class="space-y-1 text-xs text-amber-600">
                        <p><strong>Admin:</strong> admin@petshop.mx / admin123</p>
                        <p><strong>Cliente:</strong> maria@email.com / maria123</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
