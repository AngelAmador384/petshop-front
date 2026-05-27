import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const URL_BACKEND = 'http://127.0.0.1:5000'

export const useRecordsStore = defineStore('registros', () => {
    const categorias = ref(['croquetas', 'accesorios', 'juguetes', 'higiene', 'camas'])

    const productos = ref([])
    const loading = ref(false)
    const error = ref('')
    const filtroCategoria = ref('todas')
    const busqueda = ref('')

    const totalElementos = computed(() => productos.value.length)

    const totalDestacados = computed(() => {
        return productos.value.filter(p => p.destacado).length
    })

    const promedioValor = computed(() => {
        if (productos.value.length === 0) return '0.0'
        const suma = productos.value.reduce((acc, p) => acc + Number(p.precio), 0)
        return (suma / productos.value.length).toFixed(1)
    })

    async function fetchProductos() {
        loading.value = true
        error.value = ''

        try {
            let url = `${URL_BACKEND}/productos`
            const params = []

            if (filtroCategoria.value !== 'todas') {
                params.push(`categoria=${filtroCategoria.value}`)
            }
            if (busqueda.value) {
                params.push(`buscar=${encodeURIComponent(busqueda.value)}`)
            }
            if (params.length) {
                url += '?' + params.join('&')
            }

            const res = await fetch(url)
            const data = await res.json()

            if (res.ok) {
                productos.value = data.productos || []
            } else {
                error.value = data.mensaje || 'Error al cargar productos'
            }
        } catch (err) {
            error.value = 'No se pudo conectar con el servidor'
        } finally {
            loading.value = false
        }
    }

    function setCategoria(cat) {
        filtroCategoria.value = cat
        fetchProductos()
    }

    function setBusqueda(q) {
        busqueda.value = q
        fetchProductos()
    }

    function sortProductos(criterio) {
        const sorted = [...productos.value]
        switch (criterio) {
            case 'price_asc':
                sorted.sort((a, b) => a.precio - b.precio)
                break
            case 'price_desc':
                sorted.sort((a, b) => b.precio - a.precio)
                break
            case 'name':
                sorted.sort((a, b) => a.nombre.localeCompare(b.nombre))
                break
        }
        productos.value = sorted
    }

    return {
        categorias, productos, loading, error,
        filtroCategoria, busqueda,
        totalElementos, totalDestacados, promedioValor,
        fetchProductos, setCategoria, setBusqueda, sortProductos
    }
})
