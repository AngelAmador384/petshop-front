<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMascotasStore } from '../../../stores/mascotasStore'
import { useCartStore } from '../../../stores/cartStore'
import { useToastStore } from '../../../stores/toastStore'

const route = useRoute()
const router = useRouter()
const mascotasStore = useMascotasStore()
const cartStore = useCartStore()
const toastStore = useToastStore()

const mascota = ref(null)
const loading = computed(() => mascotasStore.loading)
const error = computed(() => mascotasStore.error)
const recomendaciones = computed(() => mascotasStore.recomendaciones)

onMounted(async () => {
  const mascotaId = parseInt(route.params.id)
  
  try {
    mascota.value = await mascotasStore.obtenerMascota(mascotaId)
    await mascotasStore.obtenerRecomendaciones(mascotaId)
  } catch (error) {
    toastStore.show('Error al cargar recomendaciones', 'error')
  }
})

const verPack = (packId) => {
  router.push(`/packs/${packId}`)
}

const agregarAlCarrito = (producto) => {
  cartStore.addItem({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    imagen_url: producto.imagen_url,
    cantidad: 1
  })
  toastStore.show(`${producto.nombre} agregado al carrito`, 'success')
}
</script>

<template>
  <div class="min-h-screen bg-orange-50 paw-bg py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="mb-8">
        <button 
          @click="$router.back()" 
          class="mb-4 px-4 py-2 bg-white rounded-xl shadow shadow-md flex items-center gap-2 text-gray-700 font-semibold"
        >
          ← Volver
        </button>
        <div class="bg-white rounded-3xl shadow-lg p-6">
          <h1 class="font-fredoka text-3xl sm:text-4xl gradient-text mb-2">
            💡 Recomendaciones Inteligentes
          </h1>
          <p v-if="mascota" class="text-gray-600 text-lg">
            Productos y packs personalizados para <strong class="text-orange-600">{{ mascota.nombre }}</strong> 
            <span class="text-2xl">{{ mascota.personalidad_icono }}</span>
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-20">
        <div class=" rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
        <p class="text-gray-600">Analizando el perfil de tu mascota...</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
        <span class="text-red-700 font-semibold">{{ error }}</span>
      </div>

      <!-- Recomendaciones -->
      <div v-if="!loading && recomendaciones">
        <!-- Packs Recomendados -->
        <section v-if="recomendaciones.packs && recomendaciones.packs.length > 0" class="mb-12">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-4xl">📦</span>
            <h2 class="font-fredoka text-3xl text-gray-800">Packs Recomendados</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="pack in recomendaciones.packs" 
              :key="pack.id" 
              class="bg-white rounded-3xl shadow-lg overflow-hidden     border-2 border-orange-200"
            >
              <div class="relative h-48 overflow-hidden">
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
                <h3 class="font-fredoka text-xl text-gray-800 mb-2">{{ pack.nombre }}</h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ pack.descripcion }}</p>
                
                <div class="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded">
                  <p class="text-sm text-blue-700">
                    <span class="font-semibold">💡 Por qué:</span> {{ pack.razon }}
                  </p>
                </div>

                <div class="flex items-center justify-between mb-4">
                  <div>
                    <span class="text-sm text-gray-500 line-through block">
                      ${{ pack.precio_original?.toFixed(2) }}
                    </span>
                    <div class="text-2xl font-fredoka text-orange-600">
                      ${{ pack.precio_pack?.toFixed(2) }}
                    </div>
                    <span class="text-xs text-green-600 font-semibold">
                      Ahorras ${{ (pack.precio_original - pack.precio_pack).toFixed(2) }}
                    </span>
                  </div>
                </div>

                <button 
                  @click="verPack(pack.id)"
                  class="w-full px-6 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-md"
                >
                  👁️ Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Productos Recomendados -->
        <section v-if="recomendaciones.productos && recomendaciones.productos.length > 0">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-4xl">⭐</span>
            <h2 class="font-fredoka text-3xl text-gray-800">Productos Recomendados</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              v-for="producto in recomendaciones.productos" 
              :key="producto.id" 
              class="bg-white rounded-3xl shadow-lg overflow-hidden    "
            >
              <div class="relative h-44 overflow-hidden">
                <img 
                  :src="producto.imagen_url || 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=400'" 
                  :alt="producto.nombre"
                  class="w-full h-full object-cover"
                >
                <span v-if="producto.puntuacion" class="absolute top-3 right-3 bg-yellow-400 text-gray-800 font-bold px-2 py-1 rounded-full text-xs">
                  ⭐ {{ producto.puntuacion }}/10
                </span>
              </div>
              
              <div class="p-4">
                <span class="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mb-2">
                  {{ producto.categoria }}
                </span>
                <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">{{ producto.nombre }}</h3>
                <p class="text-gray-600 text-xs mb-3 line-clamp-2">{{ producto.descripcion }}</p>
                
                <div v-if="producto.razon" class="bg-green-50 border-l-4 border-green-500 p-2 mb-3 rounded">
                  <p class="text-xs text-green-700">
                    <span class="font-semibold">✓</span> {{ producto.razon }}
                  </p>
                </div>

                <div class="flex items-center justify-between mb-3">
                  <div class="text-2xl font-fredoka text-orange-600">
                    ${{ producto.precio?.toFixed(2) }}
                  </div>
                </div>

                <button 
                  @click="agregarAlCarrito(producto)"
                  class="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-xl shadow-md text-sm"
                >
                  🛒 Agregar
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Sin recomendaciones -->
        <div 
          v-if="(!recomendaciones.productos || recomendaciones.productos.length === 0) && 
                (!recomendaciones.packs || recomendaciones.packs.length === 0)" 
          class="text-center py-20 bg-white rounded-3xl shadow-lg"
        >
          <div class="text-8xl mb-6">📭</div>
          <h3 class="font-fredoka text-3xl text-gray-700 mb-3">No hay recomendaciones disponibles</h3>
          <p class="text-gray-500 mb-6">Completa el perfil de tu mascota para obtener mejores recomendaciones</p>
          <button 
            @click="$router.push('/mascotas')"
            class="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-md"
          >
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
