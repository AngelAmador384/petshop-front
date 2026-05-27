<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMascotasStore } from '../../../stores/mascotasStore'
import { useToastStore } from '../../../stores/toastStore'

const router = useRouter()
const mascotasStore = useMascotasStore()
const toastStore = useToastStore()

const mostrarFormulario = ref(false)
const mascotaEditando = ref(null)
const formulario = ref({
  nombre: '',
  tipo: '',
  raza: '',
  edad: null,
  peso: null,
  personalidad_id: null,
  nivel_actividad: 'medio',
  imagen_url: '',
  necesidades_especiales: '',
  alergias: ''
})

const mascotas = computed(() => mascotasStore.mascotas)
const personalidades = computed(() => mascotasStore.personalidades)
const loading = computed(() => mascotasStore.loading)
const error = computed(() => mascotasStore.error)

onMounted(async () => {
  await mascotasStore.cargarPersonalidades()
  await mascotasStore.cargarMascotas()
})

const getNivelActividadClass = (nivel) => {
  const classes = {
    bajo: 'bg-blue-100 text-blue-700',
    medio: 'bg-yellow-100 text-yellow-700',
    alto: 'bg-red-100 text-red-700'
  }
  return classes[nivel] || 'bg-gray-100 text-gray-700'
}

const editarMascota = (mascota) => {
  mascotaEditando.value = mascota
  formulario.value = {
    nombre: mascota.nombre,
    tipo: mascota.tipo,
    raza: mascota.raza || '',
    edad: mascota.edad,
    peso: mascota.peso,
    personalidad_id: mascota.personalidad_id,
    nivel_actividad: mascota.nivel_actividad,
    imagen_url: mascota.imagen_url || '',
    necesidades_especiales: mascota.necesidades_especiales || '',
    alergias: mascota.alergias || ''
  }
  mostrarFormulario.value = true
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
  mascotaEditando.value = null
  formulario.value = {
    nombre: '',
    tipo: '',
    raza: '',
    edad: null,
    peso: null,
    personalidad_id: null,
    nivel_actividad: 'medio',
    imagen_url: '',
    necesidades_especiales: '',
    alergias: ''
  }
}

const guardarMascota = async () => {
  try {
    if (mascotaEditando.value) {
      await mascotasStore.actualizarMascota(mascotaEditando.value.id, formulario.value)
      toastStore.show('Mascota actualizada correctamente', 'success')
    } else {
      await mascotasStore.crearMascota(formulario.value)
      toastStore.show('Mascota creada correctamente', 'success')
    }
    cerrarFormulario()
  } catch (error) {
    toastStore.show(error.message, 'error')
  }
}

const confirmarEliminar = async (mascota) => {
  if (confirm(`¿Estás seguro de eliminar a ${mascota.nombre}?`)) {
    try {
      await mascotasStore.eliminarMascota(mascota.id)
      toastStore.show('Mascota eliminada correctamente', 'success')
    } catch (error) {
      toastStore.show(error.message, 'error')
    }
  }
}

const verRecomendaciones = (mascotaId) => {
  router.push(`/recomendaciones/${mascotaId}`)
}

const limpiarError = () => {
  mascotasStore.limpiarError()
}
</script>

<template>
  <div class="min-h-screen bg-orange-50 paw-bg py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="font-fredoka text-4xl sm:text-5xl gradient-text mb-2">
            🐾 Mis Mascotas
          </h1>
          <p class="text-gray-600">Gestiona los perfiles de tus compañeros peludos</p>
        </div>
        <button 
          @click="mostrarFormulario = true"
          class="px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-md whitespace-nowrap"
        >
          ➕ Agregar Mascota
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class=" rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⚠️</span>
          <span class="text-red-700 font-semibold">{{ error }}</span>
        </div>
        <button @click="limpiarError" class="text-red-500  text-2xl">&times;</button>
      </div>

      <!-- Sin mascotas -->
      <div v-if="!loading && mascotas.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-lg">
        <div class="text-8xl mb-6 ">🐕</div>
        <h3 class="font-fredoka text-3xl text-gray-700 mb-3">No tienes mascotas registradas</h3>
        <p class="text-gray-500 mb-6 max-w-md mx-auto">
          Agrega el perfil de tu mascota para recibir recomendaciones personalizadas de productos
        </p>
        <button 
          @click="mostrarFormulario = true"
          class="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-md"
        >
          ➕ Agregar Mi Primera Mascota
        </button>
      </div>

      <!-- Lista de mascotas -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="mascota in mascotas" 
          :key="mascota.id" 
          class="bg-white rounded-3xl shadow-lg overflow-hidden    "
        >
          <div class="relative h-48 overflow-hidden">
            <img 
              :src="mascota.imagen_url || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400'" 
              :alt="mascota.nombre"
              class="w-full h-full object-cover"
            >
            <div class="absolute top-3 right-3 bg-white/90  rounded-full px-3 py-1 text-2xl">
              {{ mascota.personalidad_icono || '🐾' }}
            </div>
          </div>
          
          <div class="p-6">
            <h3 class="font-fredoka text-2xl text-gray-800 mb-3">
              {{ mascota.nombre }}
            </h3>
            
            <div class="space-y-2 text-sm text-gray-600 mb-4">
              <div class="flex items-center gap-2">
                <span class="font-semibold">Tipo:</span>
                <span>{{ mascota.tipo === 'perro' ? '🐕 Perro' : mascota.tipo === 'gato' ? '🐈 Gato' : '🐾 ' + mascota.tipo }}</span>
              </div>
              <div v-if="mascota.raza" class="flex items-center gap-2">
                <span class="font-semibold">Raza:</span>
                <span>{{ mascota.raza }}</span>
              </div>
              <div v-if="mascota.edad" class="flex items-center gap-2">
                <span class="font-semibold">Edad:</span>
                <span>{{ mascota.edad }} años</span>
              </div>
              <div v-if="mascota.peso" class="flex items-center gap-2">
                <span class="font-semibold">Peso:</span>
                <span>{{ mascota.peso }} kg</span>
              </div>
              <div v-if="mascota.personalidad_nombre" class="flex items-center gap-2">
                <span class="font-semibold">Personalidad:</span>
                <span>{{ mascota.personalidad_nombre }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-semibold">Actividad:</span>
                <span :class="['px-2 py-1 rounded-full text-xs font-bold', getNivelActividadClass(mascota.nivel_actividad)]">
                  {{ mascota.nivel_actividad }}
                </span>
              </div>
            </div>

            <div class="flex gap-2">
              <button 
                @click="verRecomendaciones(mascota.id)"
                class="flex-1 px-4 py-2 bg-orange-500 text-white font-semibold rounded-xl shadow-md text-sm"
              >
                💡 Recomendaciones
              </button>
              <button 
                @click="editarMascota(mascota)"
                class="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl  "
              >
                ✏️
              </button>
              <button 
                @click="confirmarEliminar(mascota)"
                class="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-xl  "
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Formulario -->
    <div v-if="mostrarFormulario" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop" @click.self="cerrarFormulario">
      <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ">
        <div class="sticky top-0 bg-orange-500 text-white p-6 rounded-t-3xl flex justify-between items-center">
          <h2 class="font-fredoka text-2xl">
            {{ mascotaEditando ? '✏️ Editar Mascota' : '➕ Nueva Mascota' }}
          </h2>
          <button @click="cerrarFormulario" class="text-white  text-3xl">&times;</button>
        </div>
        
        <form @submit.prevent="guardarMascota" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre *</label>
              <input 
                v-model="formulario.nombre" 
                type="text" 
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 "
                placeholder="Ej: Max"
              >
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo *</label>
              <select v-model="formulario.tipo" required class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 ">
                <option value="">Seleccionar...</option>
                <option value="perro">🐕 Perro</option>
                <option value="gato">🐈 Gato</option>
                <option value="otro">🐾 Otro</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Raza</label>
              <input v-model="formulario.raza" type="text" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 " placeholder="Ej: Golden Retriever">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Edad (años)</label>
              <input v-model.number="formulario.edad" type="number" min="0" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 " placeholder="Ej: 3">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Peso (kg)</label>
              <input v-model.number="formulario.peso" type="number" step="0.1" min="0" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 " placeholder="Ej: 25.5">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Personalidad</label>
              <select v-model.number="formulario.personalidad_id" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 ">
                <option value="">Seleccionar...</option>
                <option v-for="p in personalidades" :key="p.id" :value="p.id">
                  {{ p.icono }} {{ p.nombre }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nivel de Actividad</label>
              <select v-model="formulario.nivel_actividad" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 ">
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">URL de Imagen</label>
              <input v-model="formulario.imagen_url" type="url" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 " placeholder="https://...">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Necesidades Especiales</label>
              <textarea v-model="formulario.necesidades_especiales" rows="2" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 " placeholder="Ej: Dieta especial, medicamentos..."></textarea>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Alergias</label>
              <textarea v-model="formulario.alergias" rows="2" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 " placeholder="Ej: Pollo, trigo..."></textarea>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="cerrarFormulario" class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl  ">
              Cancelar
            </button>
            <button type="submit" class="flex-1 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-md">
              {{ mascotaEditando ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
</style>
