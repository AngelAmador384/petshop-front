<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePacksStore } from '../../../stores/packsStore'
import { useCartStore } from '../../../stores/cartStore'
import { useToastStore } from '../../../stores/toastStore'

const route = useRoute()
const router = useRouter()
const packsStore = usePacksStore()
const cartStore = useCartStore()
const toastStore = useToastStore()

const pack = ref(null)
const loading = computed(() => packsStore.loading)

onMounted(async () => {
  const packId = parseInt(route.params.id)
  try {
    pack.value = await packsStore.obtenerPack(packId)
  } catch (error) {
    toastStore.show('Error al cargar el pack', 'error')
  }
})

const getTipoMascotaLabel = (tipo) => {
  const labels = {
    perro: '🐕 Perro',
    gato: '🐈 Gato',
    ambos: '🐾 Ambos'
  }
  return labels[tipo] || tipo
}

const agregarPackAlCarrito = () => {
  if (!pack.value) return
  
  // Agregar todos los productos del pack al carrito
  pack.value.productos.forEach(producto => {
    for (let i = 0; i < producto.cantidad; i++) {
      cartStore.addItem({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen_url: producto.imagen_url,
        cantidad: 1
      })
    }
  })
  
  toastStore.show(`Pack "${pack.value.nombre}" agregado al carrito`, 'success')
  router.push('/checkout')
}
</script>

<template>
  <div class="min-h-screen bg-orange-50 paw-bg py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class=" rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
      </div>

      <!-- Pack Detail -->
      <div v-else-if="pack" class="space-y-6">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-600">
          <router-link to="/" class=" ">Inicio</router-link>
          <span>›</span>
          <router-link to="/packs" class=" ">Packs</router-link>
          <span>›</span>
          <span class="text-gray-800 font-semibold">{{ pack.nombre }}</span>
        </nav>

        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Imagen -->
          <div class="bg-white rounded-3xl shadow-lg overflow-hidden">
            <img 
              :src="pack.imagen_url || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'" 
              :alt="pack.nombre"
              class="w-full h-full object-cover"
            >
          </div>

          <!-- Info -->
          <div class="space-y-6">
            <div class="bg-white rounded-3xl shadow-lg p-8">
              <div class="flex items-start justify-between mb-4">
                <h1 class="font-fredoka text-3xl sm:text-4xl text-gray-800 flex-1">
                  {{ pack.nombre }}
                </h1>
                <div class="flex flex-col gap-2">
                  <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {{ getTipoMascotaLabel(pack.tipo_mascota) }}
                  </span>
                  <span v-if="pack.destacado" class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                    ⭐ Destacado
                  </span>
                </div>
              </div>

              <p class="text-gray-600 text-lg mb-6">{{ pack.descripcion }}</p>

              <!-- Precio -->
              <div class="bg-orange-50 rounded-2xl p-6 mb-6">
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p class="text-sm text-gray-600 mb-1">Precio normal:</p>
                    <p class="text-2xl font-fredoka text-gray-400 line-through">
                      ${{ pack.precio_original?.toFixed(2) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600 mb-1">Precio del pack:</p>
                    <p class="text-3xl font-fredoka text-orange-600">
                      ${{ pack.precio_pack?.toFixed(2) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center justify-between pt-4 border-t-2 border-white">
                  <span class="bg-red-500 text-white font-bold px-4 py-2 rounded-full">
                    -{{ pack.descuento_porcentaje?.toFixed(0) }}% de descuento
                  </span>
                  <span class="text-green-600 font-bold text-lg">
                    💰 Ahorras ${{ (pack.precio_original - pack.precio_pack).toFixed(2) }}
                  </span>
                </div>
              </div>

              <!-- Botones -->
              <div class="space-y-3">
                <button 
                  @click="agregarPackAlCarrito"
                  class="w-full px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-md text-lg"
                >
                  🛒 Agregar Pack al Carrito
                </button>
                <button 
                  @click="$router.push('/packs')"
                  class="w-full px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl   "
                >
                  ← Ver Más Packs
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Productos incluidos -->
        <div v-if="pack.productos && pack.productos.length > 0" class="bg-white rounded-3xl shadow-lg p-8">
          <h2 class="font-fredoka text-2xl text-gray-800 mb-6 flex items-center gap-3">
            <span class="text-3xl">📦</span>
            Productos Incluidos ({{ pack.productos.length }})
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="producto in pack.productos" 
              :key="producto.id" 
              class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl  "
            >
              <img 
                :src="producto.imagen_url || 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=200'" 
                :alt="producto.nombre"
                class="w-20 h-20 object-cover rounded-xl"
              >
              <div class="flex-1">
                <h3 class="font-semibold text-gray-800 mb-1">{{ producto.nombre }}</h3>
                <p class="text-sm text-gray-500 mb-2">{{ producto.categoria }}</p>
                <div class="flex items-center justify-between">
                  <span class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                    Cantidad: {{ producto.cantidad }}
                  </span>
                  <span class="text-orange-600 font-bold">
                    ${{ producto.precio?.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else class="text-center py-20 bg-white rounded-3xl shadow-lg">
        <div class="text-8xl mb-6">⚠️</div>
        <h3 class="font-fredoka text-3xl text-gray-700 mb-3">Pack no encontrado</h3>
        <p class="text-gray-500 mb-6">El pack que buscas no existe o ha sido eliminado</p>
        <button 
          @click="$router.push('/packs')"
          class="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-md"
        >
          Ver Todos los Packs
        </button>
      </div>
    </div>
  </div>
</template>
