<script setup>
    import { ref, onMounted, reactive } from 'vue'
    import { useSessionStore } from '@/modules/auth/stores/sessionStore'
    import { useControlStore } from '@/modules/admin/stores/controlStore'
    import { useRecordsStore } from '@/modules/public/stores/recordsStore'
    import { useToastStore } from '@/modules/public/stores/toastStore'
    import { useRouter } from 'vue-router'

    const sessionStore = useSessionStore()
    const controlStore = useControlStore()
    const recordsStore = useRecordsStore()
    const toastStore = useToastStore()
    const router = useRouter()

    const activeTab = ref('dashboard')
    const npError = ref('')
    
    const editingId = ref(null)
    const URL_BACKEND = import.meta.env.VITE_BACKEND_URL

    const npForm = reactive({
        nombre: '', categoria: '', descripcion: '',
        precio: '', stock: '', imagen_url: ''
    })

    const categoryEmojis = {
        croquetas: '🦴', accesorios: '🎀', juguetes: '🎾', higiene: '🛁', camas: '🛏️', snacks: '🍞', medicamentos: '💊'
    }

    const categoryColors = {
        croquetas: 'bg-amber-500', accesorios: 'bg-pink-500', juguetes: 'bg-green-500',
        higiene: 'bg-blue-500', camas: 'bg-purple-500'
    }

    function getCategoryEmoji(cat) {
        return categoryEmojis[cat] || '📦'
    }

    function resetForm() {
        editingId.value = null
        npError.value = ''
        npForm.nombre = ''
        npForm.categoria = ''
        npForm.descripcion = ''
        npForm.precio = ''
        npForm.stock = ''
        npForm.imagen_url = ''
    }

    function startEdit(producto) {
        editingId.value = producto.id
        npForm.nombre = producto.nombre
        npForm.categoria = producto.categoria
        npForm.descripcion = producto.descripcion
        npForm.precio = producto.precio
        npForm.stock = producto.stock
        npForm.imagen_url = producto.imagen_url || ''
        
        npError.value = ''
        activeTab.value = 'nuevo'
    }

    async function deleteProducto(id) {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return

        try {
            const res = await fetch(`${URL_BACKEND}/productos/${id}/desactivar`, {
                method: 'PUT',
                credentials: 'include'
            })
            
            if (res.ok) {
                toastStore.show('Producto eliminado exitosamente', 'success')
                await recordsStore.fetchProductos() // Recarga la tabla
                controlStore.fetchStats() // Actualiza las estadísticas
            } else {
                toastStore.show('Error al eliminar el producto', 'error')
            }
        } catch (error) {
            toastStore.show('Error de conexión', 'error')
        }
    }

    async function handleNewProduct() {
        npError.value = ''

        if (!npForm.nombre || !npForm.categoria || !npForm.descripcion || !npForm.precio || !npForm.stock) {
            npError.value = 'Todos los campos son obligatorios'
            return
        }

        if (isNaN(Number(npForm.precio)) || Number(npForm.precio) <= 0) {
            npError.value = 'El precio debe ser un número positivo'
            return
        }

        const payload = {
            nombre: npForm.nombre,
            categoria: npForm.categoria,
            descripcion: npForm.descripcion,
            precio: npForm.precio,
            stock: npForm.stock,
            imagen_url: npForm.imagen_url || undefined
        }

        if (editingId.value) {
            try {
                const res = await fetch(`${URL_BACKEND}/productos/${editingId.value}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                })

                if (res.ok) {
                    toastStore.show('¡Producto actualizado exitosamente! ✏️', 'success')
                    await recordsStore.fetchProductos()
                    controlStore.fetchStats()
                    resetForm()
                    activeTab.value = 'productos'
                } else {
                    const data = await res.json()
                    npError.value = data.error || 'Error al actualizar producto'
                }
            } catch (error) {
                npError.value = 'Error de conexión con el servidor'
            }
        } else {
            const res = await controlStore.addProducto(payload)

            if (res.status === 201) {
                toastStore.show('¡Producto creado exitosamente! 📦', 'success')
                await recordsStore.fetchProductos()
                controlStore.fetchStats()
                resetForm()
                activeTab.value = 'productos'
            } else {
                npError.value = res.data?.error || 'Error al crear producto'
            }
        }
    }

    onMounted(() => {
        if (!sessionStore.isAuthenticated || !sessionStore.isAdmin) {
            router.push('/login')
            return
        }
        controlStore.fetchStats()
        controlStore.fetchUsuarios()
        controlStore.fetchPedidos()
        if (recordsStore.productos.length === 0) {
            recordsStore.fetchProductos()
        }
    })
</script>

<template>
    <section v-if="sessionStore.isAuthenticated && sessionStore.isAdmin" class="min-h-screen bg-purple-50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                <div>
                    <h1 class="font-fredoka text-3xl text-gray-800">⚙️ Panel de <span class="text-purple-600">Administración</span></h1>
                    <p class="text-gray-500 text-sm mt-1">Gestiona tu tienda PetShop MX</p>
                </div>
            </div>

            <div class="flex flex-wrap gap-2 mb-6 bg-white rounded-xl p-2 shadow-sm border">
                <button v-for="tab in [
                    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
                    { key: 'productos', label: 'Productos', icon: '📦' },
                    { key: 'usuarios', label: 'Usuarios', icon: '👥' },
                    { key: 'pedidos', label: 'Pedidos', icon: '🧾' },
                    { key: 'nuevo', label: editingId ? 'Editar Producto' : 'Nuevo Producto', icon: editingId ? '✏️' : '➕' },
                ]" :key="tab.key"
                    @click="activeTab = tab.key"
                    :class="[
                        'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                        activeTab === tab.key ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                    ]">
                    {{ tab.icon }} {{ tab.label }}
                </button>
            </div>

            <div v-if="activeTab === 'dashboard'" class="">
                <div v-if="!controlStore.stats" class="text-center py-12">
                    <p class="text-gray-400">Cargando estadísticas...</p>
                </div>
                <template v-else>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div v-for="s in [
                            { label: 'Productos', value: controlStore.stats.total_productos, icon: '📦', color: 'bg-orange-500' },
                            { label: 'Usuarios', value: controlStore.stats.total_usuarios, icon: '👥', color: 'bg-blue-500' },
                            { label: 'Pedidos', value: controlStore.stats.total_pedidos, icon: '🧾', color: 'bg-green-500' },
                            { label: 'Ingresos', value: '$' + controlStore.stats.ingresos_totales.toFixed(2), icon: '💰', color: 'bg-purple-500' },
                        ]" :key="s.label"
                            :class="['rounded-2xl p-5 text-white shadow-lg', s.color]">
                            <span class="text-3xl">{{ s.icon }}</span>
                            <p class="font-fredoka text-2xl mt-2">{{ s.value }}</p>
                            <p class="text-white/80 text-sm">{{ s.label }}</p>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-md p-6 border border-purple-100">
                        <h3 class="font-bold text-lg text-gray-800 mb-4">📊 Productos por Categoría</h3>
                        <div class="space-y-3">
                            <div v-for="(count, cat) in controlStore.stats.productos_por_categoria" :key="cat">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="font-semibold capitalize">{{ getCategoryEmoji(cat) }} {{ cat }}</span>
                                    <span class="text-gray-500">{{ count }} ({{ Math.round((count / controlStore.stats.total_productos) * 100) }}%)</span>
                                </div>
                                <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div :class="[categoryColors[cat] || 'bg-gray-400', 'h-full rounded-full transition-all duration-1000']"
                                        :style="{ width: Math.round((count / controlStore.stats.total_productos) * 100) + '%' }">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <div v-if="activeTab === 'productos'" class="bg-white rounded-2xl shadow-md border border-purple-100 overflow-hidden ">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-purple-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-bold text-purple-700">ID</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-purple-700">Producto</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-purple-700">Categoría</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-purple-700">Precio</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-purple-700">Stock</th>
                                <th class="px-4 py-3 text-center text-xs font-bold text-purple-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="p in recordsStore.productos" :key="p.id" class="hover:bg-purple-50/50 transition-colors">
                                <td class="px-4 py-3 text-sm text-gray-500">#{{ p.id }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <img :src="p.imagen_url || 'https://via.placeholder.com/150'" class="w-10 h-10 rounded-lg object-cover">
                                        <span class="text-sm font-semibold text-gray-700">{{ p.nombre }}</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold capitalize">{{ p.categoria }}</span>
                                </td>
                                <td class="px-4 py-3 text-sm font-bold text-gray-700">${{ p.precio.toFixed(2) }}</td>
                                <td class="px-4 py-3">
                                    <span :class="['text-sm font-bold', p.stock < 15 ? 'text-red-500' : 'text-green-600']">{{ p.stock }}</span>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <div class="flex justify-center gap-2">
                                        <button @click="startEdit(p)" class="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors" title="Editar">
                                            ✏️
                                        </button>
                                        <button @click="deleteProducto(p.id)" class="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors" title="Eliminar">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="recordsStore.productos.length === 0" class="p-8 text-center text-gray-500">
                        No hay productos registrados activos.
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'usuarios'" class="bg-white rounded-2xl shadow-md border border-purple-100 overflow-hidden ">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-purple-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-bold text-purple-700">ID</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-purple-700">Nombre</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-purple-700">Email</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-purple-700">Rol</th>
                                <th class="px-4 py-3 text-left text-xs font-bold text-purple-700">Registro</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="u in controlStore.usuarios" :key="u.id" class="hover:bg-purple-50/50 transition-colors">
                                <td class="px-4 py-3 text-sm text-gray-500">#{{ u.id }}</td>
                                <td class="px-4 py-3 text-sm font-semibold text-gray-700">{{ u.nombre }}</td>
                                <td class="px-4 py-3 text-sm text-gray-500">{{ u.correo }}</td>
                                <td class="px-4 py-3">
                                    <span :class="[
                                        'px-2 py-1 rounded-full text-xs font-bold',
                                        u.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                    ]">{{ u.rol }}</span>
                                </td>
                                <td class="px-4 py-3 text-sm text-gray-400">{{ u.fecha_registro }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="activeTab === 'pedidos'" class="">
                <div v-if="controlStore.pedidos.length === 0"
                    class="bg-white rounded-2xl shadow-md p-12 text-center border border-purple-100">
                    <span class="text-5xl block mb-4">🧾</span>
                    <p class="text-gray-400 text-lg">No hay pedidos aún</p>
                    <p class="text-gray-300 text-sm mt-1">Los pedidos aparecerán aquí cuando los clientes compren</p>
                </div>
                <div v-for="p in controlStore.pedidos" :key="p.id"
                    class="bg-white rounded-2xl shadow-md p-6 border border-purple-100 mb-4">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="font-bold text-gray-800">Pedido #{{ p.id }}</h4>
                        <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{{ p.estado }}</span>
                    </div>
                    <div class="border-t mt-3 pt-3 flex justify-between items-center">
                        <span class="text-xs text-gray-400">{{ p.fecha }}</span>
                        <span class="font-bold text-lg text-orange-600">${{ p.total.toFixed(2) }} MXN</span>
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'nuevo'" class="max-w-2xl mx-auto ">
                <div class="bg-white rounded-2xl shadow-md p-6 border border-purple-100">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-lg text-gray-800">
                            {{ editingId ? '✏️ Editar Producto' : '➕ Agregar Nuevo Producto' }}
                        </h3>
                        <button v-if="editingId" @click="resetForm(); activeTab = 'productos'" class="text-sm text-red-500 font-semibold hover:underline">
                            Cancelar edición
                        </button>
                    </div>
                    <form @submit.prevent="handleNewProduct" class="space-y-4">
                        <div class="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">Nombre del producto</label>
                                <input type="text" v-model="npForm.nombre" placeholder="Ej: Croquetas Premium"
                                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors" required>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">Categoría</label>
                                <select v-model="npForm.categoria"
                                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="croquetas">🦴 Croquetas</option>
                                    <option value="juguetes">🎾 Juguetes</option>
                                    <option value="accesorios">🎀 Accesorios</option>
                                    <option value="higiene">🛁 Higiene</option>
                                    <option value="camas">🛏️ Camas</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-600 mb-1">Descripción</label>
                            <textarea v-model="npForm.descripcion" rows="3" placeholder="Describe el producto..."
                                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors resize-none" required></textarea>
                        </div>
                        <div class="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">Precio (MXN)</label>
                                <input type="number" v-model="npForm.precio" step="0.01" min="1" placeholder="0.00"
                                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors" required>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-600 mb-1">Stock</label>
                                <input type="number" v-model="npForm.stock" min="0" placeholder="0"
                                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors" required>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-600 mb-1">URL de imagen (opcional)</label>
                            <input type="url" v-model="npForm.imagen_url" placeholder="https://..."
                                class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors">
                        </div>

                        <div v-if="npError" class="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-200">
                            {{ npError }}
                        </div>

                        <button type="submit"
                            :class="[
                                'w-full py-3 font-bold rounded-xl shadow-md transition-colors text-white',
                                editingId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-500 hover:bg-purple-600'
                            ]">
                            {{ editingId ? 'Guardar Cambios' : '📦 Agregar Producto' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>
