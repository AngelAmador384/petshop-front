<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePacksStore } from '../../../stores/packsStore'
import { useMascotasStore } from '../../../stores/mascotasStore'

const router = useRouter()
const packsStore = usePacksStore()
const mascotasStore = useMascotasStore()

const filtros = ref({
  tipo_mascota: '',
  personalidad_id: ''
})

const packs = computed(() => packsStore.packs)
const personalidades = computed(() => mascotasStore.personalidades)
const loading = computed(() => packsStore.loading)
const error = computed(() => packsStore.error)

const packsDestacados = computed(() => {
  return packs.value.filter(pack => pack.destacado)
})

const packsRegulares = computed(() => {
  return packs.value.filter(pack => !pack.destacado)
})

onMounted(async () => {
  await mascotasStore.cargarPersonalidades()
  await packsStore.cargarPacks()
})

const aplicarFiltros = async () => {
  const filtrosLimpios = {}
  if (filtros.value.tipo_mascota) {
    filtrosLimpios.tipo_mascota = filtros.value.tipo_mascota
  }
  if (filtros.value.personalidad_id) {
    filtrosLimpios.personalidad_id = filtros.value.personalidad_id
  }
  await packsStore.cargarPacks(filtrosLimpios)
}

const getTipoMascotaLabel = (tipo) => {
  const labels = {
    perro: '🐕 Perro',
    gato: '🐈 Gato',
    ambos: '🐾 Ambos'
  }
  return labels[tipo] || tipo
}

const verDetallePack = (packId) => {
  router.push(`/packs/${packId}`)
}
</script>

<template>
  <div class="min-h-screen bg-orange-50 paw-bg py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="font-fredoka text-4xl sm:text-5xl lg:text-6xl gradient-text mb-4">
          📦 Packs para Mascotas
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Ahorra comprando paquetes especialmente diseñados para tu mascota. ¡Hasta 20% de descuento!
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-3xl shadow-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo de Mascota</label>
            <select 
              v-model="filtros.tipo_mascota" 
              @change="aplicarFiltros"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 "
            >
              <option value="">Todos</option>
              <option value="perro">🐕 Perros</option>
              <option value="gato">🐈 Gatos</option>
              <option value="ambos">🐾 Ambos</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Personalidad</label>
            <select 
              v-model="filtros.personalidad_id" 
              @change="aplicarFiltros"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 "
            >
              <option value="">Todas</option>
              <option v-for="p in personalidades" :key="p.id" :value="p.id">
                {{ p.icono }} {{ p.nombre }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class=" rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
        <span class="text-red-700 font-semibold">{{ error }}</span>
      </div>

      <!-- Packs Destacados -->
      <section v-if="packsDestacados.length > 0" class="mb-12">
        <div class="flex items-center gap-3 mb-6">
          <span class="text-3xl">⭐</span>
          <h2 class="font-fredoka text-3xl text-gray-800">Packs Destacados</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="pack in packsDestacados" 
            :key="pack.id" 
            class="bg-white rounded-3xl shadow-lg overflow-hidden     border-2 border-yellow-200"
          >
            <div class="relative h-56 overflow-hidden">
              <img 
                :src="pack.imagen_url || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600'" 
                :alt="pack.nombre"
                class="w-full h-full object-cover"
              >
              <div class="absolute top-3 right-3 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                -{{ pack.descuento_porcentaje?.toFixed(0) }}%
              </div>
              <div class="absolute top-3 left-3 bg-yellow-400 text-gray-800 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1">
                ⭐ Destacado
              </div>
            </div>
            
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="font-fredoka text-xl text-gray-800 flex-1">{{ pack.nombre }}</h3>
                <span class="text-xs bg-gray-100 px-2 py-1 rounded-full">{{ getTipoMascotaLabel(pack.tipo_mascota) }}</span>
              </div>
              
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ pack.descripcion }}</p>
              
              <!-- Productos incluidos -->
              <div v-if="pack.productos && pack.productos.length > 0" class="mb-4 bg-orange-50 rounded-xl p-3">
                <p class="text-xs font-semibold text-orange-700 mb-2">
                  Incluye {{ pack.productos.length }} productos:
                </p>
                <ul class="text-xs text-gray-600 space-y-1">
                  <li v-for="prod in pack.productos.slice(0, 3)" :key="prod.id" class="flex items-center gap-1">
                    <span class="text-green-500">✓</span>
                    {{ prod.cantidad }}x {{ prod.nombre }}
                  </li>
                  <li v-if="pack.productos.length > 3" class="text-gray-500 italic">
                    + {{ pack.productos.length - 3 }} más...
                  </li>
                </ul>
              </div>

              <!-- Precio -->
              <div class="border-t-2 border-gray-100 pt-4 mb-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-500 line-through">
                    ${{ pack.precio_original?.toFixed(2) }}
                  </span>
                  <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                    💰 Ahorras ${{ (pack.precio_original - pack.precio_pack).toFixed(2) }}
                  </span>
                </div>
                <div class="text-3xl font-fredoka text-orange-600">
                  ${{ pack.precio_pack?.toFixed(2) }}
                </div>
              </div>

              <button 
                @click="verDetallePack(pack.id)"
                class="w-full px-6 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-md"
              >
                👁️ Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Todos los Packs -->
      <section v-if="packsRegulares.length > 0">
        <div class="flex items-center gap-3 mb-6">
          <span class="text-3xl">📦</span>
          <h2 class="font-fredoka text-3xl text-gray-800">Todos los Packs</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="pack in packsRegulares" 
            :key="pack.id" 
            class="bg-white rounded-3xl shadow-lg overflow-hidden    "
          >
            <div class="relative h-56 overflow-hidden">
              <img 
                :src="pack.imagen_url || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600'" 
                :alt="pack.nombre"
                class="w-full h-full object-cover"
              >
              <div class="absolute top-3 right-3 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                -{{ pack.descuento_porcentaje?.toFixed(0) }}%
              </div>
            </div>
            
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="font-fredoka text-xl text-gray-800 flex-1">{{ pack.nombre }}</h3>
                <span class="text-xs bg-gray-100 px-2 py-1 rounded-full">{{ getTipoMascotaLabel(pack.tipo_mascota) }}</span>
              </div>
              
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ pack.descripcion }}</p>

              <!-- Precio -->
              <div class="border-t-2 border-gray-100 pt-4 mb-4">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-sm text-gray-500 line-through block">
                      ${{ pack.precio_original?.toFixed(2) }}
                    </span>
                    <div class="text-2xl font-fredoka text-orange-600">
                      ${{ pack.precio_pack?.toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                @click="verDetallePack(pack.id)"
                class="w-full px-6 py-3 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-xl  "
              >
                👁️ Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Sin resultados -->
      <div v-if="!loading && packs.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-lg">
        <div class="text-8xl mb-6">📦</div>
        <h3 class="font-fredoka text-3xl text-gray-700 mb-3">No se encontraron packs</h3>
        <p class="text-gray-500">Intenta con otros filtros</p>
      </div>
    </div>
  </div>
</template>
