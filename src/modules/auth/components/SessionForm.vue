<script setup>
    import { ref, reactive, computed } from 'vue'
    import { useSessionStore } from '@/modules/auth/stores/sessionStore'
    import { useToastStore } from '@/modules/public/stores/toastStore'
    import { useRouter } from 'vue-router'

    const props = defineProps({
        mode: { type: String, default: 'login' }
    })

    const sessionStore = useSessionStore()
    const toastStore = useToastStore()
    const router = useRouter()

    const form = reactive({
        nombre: '',
        correo: '',
        password: '',
        password2: ''
    })

    const errors = reactive({
        nombre: '',
        correo: '',
        password: '',
        password2: '',
        general: '',
        success: ''
    })

    const submitting = ref(false)
    const showPassword = ref(false)

    const isLogin = computed(() => props.mode === 'login')

    function clearErrors() {
        errors.nombre = ''
        errors.correo = ''
        errors.password = ''
        errors.password2 = ''
        errors.general = ''
        errors.success = ''
    }

    function togglePasswordVisibility() {
        showPassword.value = !showPassword.value
    }

    function fillDemo(correo, password) {
        form.correo = correo
        form.password = password
    }

    async function handleSubmit() {
        clearErrors()
        let valid = true

        // Validate email
        if (!form.correo) {
            errors.correo = 'El email es requerido'
            valid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
            errors.correo = 'Email inválido'
            valid = false
        }

        // Validate password
        if (!form.password) {
            errors.password = 'La contraseña es requerida'
            valid = false
        } else if (form.password.length < 6) {
            errors.password = 'Mínimo 6 caracteres'
            valid = false
        }

        if (!isLogin.value) {
            // Validate name
            if (!form.nombre) {
                errors.nombre = 'El nombre es requerido'
                valid = false
            }
            // Validate password confirmation
            if (form.password !== form.password2) {
                errors.password2 = 'Las contraseñas no coinciden'
                valid = false
            }
        }

        if (!valid) return

        submitting.value = true

        if (isLogin.value) {
            const res = await sessionStore.login(form.correo, form.password)
            if (res.status === 200) {
                toastStore.show(`¡Bienvenido, ${res.data.user.nombre}! 🎉`, 'success')
                router.push('/')
            } else {
                errors.general = res.data.error || 'Error al iniciar sesión'
            }
        } else {
            const res = await sessionStore.register(form.nombre, form.correo, form.password)
            if (res.status === 201) {
                errors.success = '✅ ' + (res.data.mensaje || 'Cuenta creada exitosamente')
                toastStore.show('¡Cuenta creada! 📧', 'success')
                setTimeout(() => router.push('/login'), 2000)
            } else {
                errors.general = res.data.error || 'Error al registrarse'
            }
        }

        submitting.value = false
    }
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name (register only) -->
        <div v-if="!isLogin">
            <label class="block text-sm font-semibold text-gray-600 mb-1">👤 Nombre completo</label>
            <input type="text" v-model="form.nombre" placeholder="Ej: María García"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 ">
            <p v-if="errors.nombre" class="text-red-500 text-xs mt-1">{{ errors.nombre }}</p>
        </div>

        <!-- Email -->
        <div>
            <label class="block text-sm font-semibold text-gray-600 mb-1">📧 Correo electrónico</label>
            <input type="email" v-model="form.correo" placeholder="tu@email.com"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 ">
            <p v-if="errors.correo" class="text-red-500 text-xs mt-1">{{ errors.correo }}</p>
        </div>

        <!-- Password -->
        <div>
            <label class="block text-sm font-semibold text-gray-600 mb-1">🔑 Contraseña</label>
            <div class="relative">
                <input :type="showPassword ? 'text' : 'password'" v-model="form.password"
                    :placeholder="isLogin ? 'Tu contraseña' : 'Mínimo 6 caracteres'"
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400  pr-12">
                <button type="button" @click="togglePasswordVisibility"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 ">
                    👁️
                </button>
            </div>
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
        </div>

        <!-- Confirm password (register only) -->
        <div v-if="!isLogin">
            <label class="block text-sm font-semibold text-gray-600 mb-1">🔑 Confirmar contraseña</label>
            <input :type="showPassword ? 'text' : 'password'" v-model="form.password2" placeholder="Repite tu contraseña"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 ">
            <p v-if="errors.password2" class="text-red-500 text-xs mt-1">{{ errors.password2 }}</p>
        </div>

        <!-- General error -->
        <div v-if="errors.general" class="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">
            {{ errors.general }}
        </div>

        <!-- Success -->
        <div v-if="errors.success" class="bg-green-50 text-green-600 text-sm p-3 rounded-xl border border-green-200">
            {{ errors.success }}
        </div>

        <!-- Submit button -->
        <button type="submit" :disabled="submitting"
            class="w-full py-4 bg-orange-500 text-white font-bold rounded-xl shadow-md text-lg">
            {{ submitting ? '⏳ Procesando...' : (isLogin ? '🔓 Entrar' : '🎉 Registrarse') }}
        </button>

        <!-- Demo quick-fill buttons (login only) -->
        <div v-if="isLogin" class="flex gap-2">
            <button type="button" @click="fillDemo('admin@petshop.mx', 'admin123')"
                class="px-3 py-1.5 bg-purple-500 text-white text-xs font-bold rounded-lg  ">
                Admin Demo
            </button>
            <button type="button" @click="fillDemo('maria@email.com', 'maria123')"
                class="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg  ">
                Cliente Demo
            </button>
        </div>
    </form>
</template>
