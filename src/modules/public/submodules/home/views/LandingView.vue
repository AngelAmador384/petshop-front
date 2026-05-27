<script setup>
    import { onMounted } from 'vue'
    import { useRecordsStore } from '@/modules/public/stores/recordsStore'
    import { useRouter } from 'vue-router'
    import ItemCard from '@/modules/public/components/ItemCard.vue'

    const recordsStore = useRecordsStore()
    const router = useRouter()

    const categorias = [
        { icon: '🦴', name: 'Croquetas', cat: 'croquetas', color: 'bg-orange-500', desc: 'Nutrición premium' },
        { icon: '🎾', name: 'Juguetes', cat: 'juguetes', color: 'bg-green-500', desc: 'Diversión sin fin' },
        { icon: '🎀', name: 'Accesorios', cat: 'accesorios', color: 'bg-pink-500', desc: 'Estilo y confort' },
        { icon: '🛁', name: 'Higiene', cat: 'higiene', color: 'bg-blue-500', desc: 'Limpieza total' },
        { icon: '🛏️', name: 'Camas', cat: 'camas', color: 'bg-purple-500', desc: 'Descanso perfecto' },
    ]

    const beneficios = [
        { icon: '🚚', title: 'Envío Gratis', desc: 'En compras +$599 MXN' },
        { icon: '🔒', title: 'Pago Seguro', desc: 'Protección total' },
        { icon: '🔄', title: 'Devoluciones', desc: '30 días de garantía' },
        { icon: '💬', title: 'Soporte 24/7', desc: 'Siempre para ti' },
    ]

    const testimonios = [
        { name: 'Ana López', text: 'Mi perrito ama las croquetas premium. ¡Su pelaje nunca estuvo tan brillante!', pet: '🐕' },
        { name: 'Carlos Ruiz', text: 'El arnés ergonómico es increíble. Los paseos son mucho más cómodos para ambos.', pet: '🐩' },
        { name: 'Laura Martínez', text: 'Mi gata no suelta el ratón interactivo. Mejor compra que he hecho. ¡Servicio excelente!', pet: '🐱' },
    ]

    function irCategoria(cat) {
        recordsStore.filtroCategoria = cat
        router.push('/tienda')
    }

    onMounted(() => {
        if (recordsStore.productos.length === 0) {
            recordsStore.fetchProductos()
        }
    })
</script>

<template>
    <!-- Hero Section -->
    <section class="bg-orange-100 paw-bg relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div class="grid md:grid-cols-2 gap-8 items-center">
                <div class="space-y-6">
                    <div class="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm font-semibold text-orange-700">
                        🎉 Envío gratis en compras mayores a $599
                    </div>
                    <h1 class="font-fredoka text-4xl sm:text-5xl lg:text-6xl text-gray-800 leading-tight">
                        Todo para <span class="text-orange-500">consentir</span> a tu mejor amigo
                    </h1>
                    <p class="text-lg text-gray-600 max-w-lg">
                        Encuentra las mejores croquetas, juguetes, accesorios y más para perros y gatos.
                        Calidad premium a precios increíbles. 🐶🐱
                    </p>
                    <div class="flex flex-wrap gap-3">
                        <RouterLink to="/tienda"
                            class="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-md text-lg">
                            🛍️ Ver Catálogo
                        </RouterLink>
                        <RouterLink to="/nosotros"
                            class="px-8 py-4 bg-white text-orange-600 font-bold rounded-2xl shadow-md border-2 border-orange-200">
                            Conoce más →
                        </RouterLink>
                    </div>
                    <div class="flex items-center gap-6 pt-4">
                        <div class="text-center">
                            <span class="font-fredoka text-2xl text-orange-600">500+</span><br>
                            <span class="text-xs text-gray-500">Productos</span>
                        </div>
                        <div class="w-px h-10 bg-orange-200"></div>
                        <div class="text-center">
                            <span class="font-fredoka text-2xl text-pink-500">2K+</span><br>
                            <span class="text-xs text-gray-500">Clientes felices</span>
                        </div>
                        <div class="w-px h-10 bg-orange-200"></div>
                        <div class="text-center">
                            <span class="font-fredoka text-2xl text-green-500">⭐ 4.9</span><br>
                            <span class="text-xs text-gray-500">Calificación</span>
                        </div>
                    </div>
                </div>
                <div class="relative hidden md:block">
                    <img src="https://images.pexels.com/photos/4445456/pexels-photo-4445456.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600"
                        alt="Mascota feliz"
                        class="relative rounded-3xl shadow-2xl w-full max-w-lg mx-auto">
                </div>
            </div>
        </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <div class="text-center mb-12">
                <h2 class="font-fredoka text-3xl sm:text-4xl text-gray-800">Categorías <span class="text-orange-500">Populares</span></h2>
                <p class="text-gray-500 mt-2">Encuentra todo lo que tu mascota necesita</p>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <button v-for="c in categorias" :key="c.cat" @click="irCategoria(c.cat)"
                    :class="['p-6 rounded-2xl text-white text-center shadow-lg', c.color]">
                    <span class="text-4xl block mb-2">{{ c.icon }}</span>
                    <h3 class="font-bold text-lg">{{ c.name }}</h3>
                    <p class="text-white/80 text-xs mt-1">{{ c.desc }}</p>
                </button>
            </div>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-orange-50 paw-bg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <div class="text-center mb-12">
                <h2 class="font-fredoka text-3xl sm:text-4xl text-gray-800">Productos <span class="text-orange-500">Destacados</span></h2>
                <p class="text-gray-500 mt-2">Los más vendidos de la tienda</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ItemCard v-for="p in recordsStore.productos.slice(0, 4)" :key="p.id" :product="p" />
            </div>
            <div class="text-center mt-10">
                <RouterLink to="/tienda"
                    class="px-8 py-3 bg-white text-orange-600 font-bold rounded-xl border-2 border-orange-300 shadow-md inline-block">
                    Ver todos los productos →
                </RouterLink>
            </div>
        </div>
    </section>

    <!-- Benefits -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="b in beneficios" :key="b.title"
                    class="flex items-center gap-4 p-5 bg-orange-50 rounded-2xl">
                    <span class="text-3xl">{{ b.icon }}</span>
                    <div>
                        <h4 class="font-bold text-gray-800">{{ b.title }}</h4>
                        <p class="text-sm text-gray-500">{{ b.desc }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials -->
    <section class="py-16 bg-orange-500 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 class="font-fredoka text-3xl sm:text-4xl text-center mb-12">Lo que dicen nuestros clientes 💛</h2>
            <div class="grid sm:grid-cols-3 gap-6">
                <div v-for="t in testimonios" :key="t.name"
                    class="bg-white/10 rounded-2xl p-6">
                    <div class="flex items-center gap-1 mb-3">⭐⭐⭐⭐⭐</div>
                    <p class="text-white/90 text-sm mb-4">"{{ t.text }}"</p>
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">{{ t.pet }}</span>
                        <span class="font-bold text-sm">{{ t.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
