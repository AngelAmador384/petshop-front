<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const URL_BACKEND = import.meta.env.VITE_BACKEND_URL

const estado = ref('cargando') // 'cargando', 'exito', 'error'
const mensaje = ref('Verificando tu cuenta...')

onMounted(async () => {
  // Extraemos el token de la URL
  const token = route.params.token

  try {
    const res = await fetch(`${URL_BACKEND}/confirmar/${token}`, {
      method: 'GET'
    })
    const data = await res.json()

    if (res.ok) {
      estado.value = 'exito'
      mensaje.value = data.mensaje
      
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else {
      estado.value = 'error'
      mensaje.value = data.error || 'Ocurrió un error al confirmar.'
    }
  } catch (error) {
    estado.value = 'error'
    mensaje.value = 'No se pudo conectar con el servidor.'
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Confirmación de Cuenta</h2>
      
      <!-- Cargando -->
      <div v-if="estado === 'cargando'" class="text-blue-500">
        <span class="block text-4xl mb-2">⏳</span>
        <p>{{ mensaje }}</p>
      </div>

      <!-- Éxito -->
      <div v-else-if="estado === 'exito'" class="text-green-600">
        <span class="block text-4xl mb-2">✅</span>
        <p>{{ mensaje }}</p>
        <p class="text-sm text-gray-500 mt-4">Redirigiendo al inicio de sesión...</p>
      </div>

      <!-- Error -->
      <div v-else class="text-red-500">
        <span class="block text-4xl mb-2">❌</span>
        <p>{{ mensaje }}</p>
        <button 
          @click="router.push('/')" 
          class="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Volver al inicio
        </button>
      </div>
    </div>
  </div>
</template>