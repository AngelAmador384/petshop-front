<script setup>
    import { onMounted, ref } from 'vue'
    import { useRecordsStore } from '@/modules/public/stores/recordsStore'
    import ItemCard from '@/modules/public/components/ItemCard.vue'

    const recordsStore = useRecordsStore()
    const searchInput = ref('')

    const cats = [
        { key: 'todas', label: 'Todas', icon: '🏪' },
        { key: 'croquetas', label: 'Croquetas', icon: '🦴' },
        { key: 'juguetes', label: 'Juguetes', icon: '🎾' },
        { key: 'accesorios', label: 'Accesorios', icon: '🎀' },
        { key: 'higiene', label: 'Higiene', icon: '🛁' },
        { key: 'camas', label: 'Camas', icon: '🛏️' },
    ]

    function handleSearch() {
        recordsStore.setBusqueda(searchInput.value)
    }

    function handleSearchEnter(e) {
        if (e.key === 'Enter') handleSearch()
    }

    function handleSort(value) {
        recordsStore.sortProductos(value)
    }

    onMounted(() => {
        searchInput.value = recordsStore.busqueda
        recordsStore.fetchProductos()
    })
</script>

<template>
    <section class="min-h-screen bg-orange-50 paw-bg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <!-- Header -->
            <div class="text-center mb-8 ">
                <h1 class="font-fredoka text-3xl sm:text-4xl text-gray-800">🛍️ Nuestra <span class="gradient-text">Tienda</span></h1>
                <p class="text-gray-500 mt-2">Explora nuestro catálogo completo de productos</p>
            </div>

            <!-- Search & Filters -->
            <div class="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-8 border border-orange-100">
                <div class="flex flex-col sm:flex-row gap-4">
                    <div class="flex-1 relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input type="text" v-model="searchInput" placeholder="Buscar productos..."
                            class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-400  text-sm"
                            @keyup="handleSearchEnter">
                    </div>
                    <button @click="handleSearch"
                        class="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl  ">
                        Buscar
                    </button>
                </div>

                <!-- Category pills -->
                <div class="flex flex-wrap gap-2 mt-4">
                    <button v-for="c in cats" :key="c.key" @click="recordsStore.setCategoria(c.key)"
                        :class="[
                            'category-pill px-4 py-2 rounded-full text-sm font-semibold ',
                            recordsStore.filtroCategoria === c.key
                                ? 'bg-orange-500 text-white shadow-md scale-105'
                                : 'bg-orange-50 text-gray-600 '
                        ]">
                        {{ c.icon }} {{ c.label }}
                    </button>
                </div>
            </div>

            <!-- Results count & sort -->
            <div class="flex items-center justify-between mb-4 px-1">
                <p class="text-gray-500 text-sm">{{ recordsStore.productos.length }} productos encontrados</p>
                <select @change="handleSort($event.target.value)"
                    class="px-3 py-2 rounded-lg border border-orange-200 text-sm bg-white">
                    <option value="default">Ordenar por</option>
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="price_desc">Precio: Mayor a Menor</option>
                    <option value="name">Nombre A-Z</option>
                </select>
            </div>

            <!-- Loading skeleton -->
            <div v-if="recordsStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="n in 8" :key="n" class="bg-white rounded-2xl shadow-md overflow-hidden ">
                    <div class="h-48 bg-gray-200"></div>
                    <div class="p-4 space-y-3">
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div class="h-3 bg-gray-200 rounded w-full"></div>
                        <div class="h-8 bg-gray-200 rounded w-1/2 mt-4"></div>
                    </div>
                </div>
            </div>

            <!-- Empty state -->
            <div v-else-if="recordsStore.productos.length === 0" class="text-center py-20">
                <span class="text-6xl block mb-4">🔍</span>
                <h3 class="text-xl font-bold text-gray-400">No se encontraron productos</h3>
                <p class="text-gray-300 mt-2">Intenta con otra búsqueda o categoría</p>
                <button @click="recordsStore.filtroCategoria = 'todas'; recordsStore.busqueda = ''; recordsStore.fetchProductos()"
                    class="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full font-semibold ">
                    Ver todos
                </button>
            </div>

            <!-- Products Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ItemCard v-for="p in recordsStore.productos" :key="p.id" :product="p">
                    <div class="text-xs text-green-600 font-semibold mb-1">📦 {{ p.stock }} en stock</div>
                </ItemCard>
            </div>
        </div>
    </section>
</template>
