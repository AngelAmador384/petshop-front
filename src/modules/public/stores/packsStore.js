import { defineStore } from 'pinia'

const URL_BACKEND = 'http://127.0.0.1:5000'

export const usePacksStore = defineStore('packs', {
  state: () => ({
    packs: [],
    packActual: null,
    loading: false,
    error: null
  }),

  getters: {
    packsDestacados: (state) => {
      return state.packs.filter(pack => pack.destacado)
    },
    
    packsPorTipo: (state) => (tipo) => {
      return state.packs.filter(pack =>
        pack.tipo_mascota === tipo || pack.tipo_mascota === 'ambos'
      )
    },
    
    getPackById: (state) => (id) => {
      return state.packs.find(p => p.id === id)
    }
  },

  actions: {
    async cargarPacks(filtros = {}) {
      try {
        this.loading = true
        this.error = null
        
        const params = new URLSearchParams()
        if (filtros.tipo_mascota) params.append('tipo_mascota', filtros.tipo_mascota)
        if (filtros.personalidad_id) params.append('personalidad_id', filtros.personalidad_id)
        
        const url = `${URL_BACKEND}/packs${params.toString() ? '?' + params.toString() : ''}`
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Error al cargar packs')
        }
        
        const data = await response.json()
        this.packs = data.packs || []
      } catch (error) {
        this.error = error.message
        console.error('Error:', error)
      } finally {
        this.loading = false
      }
    },

    async obtenerPack(id) {
      try {
        this.loading = true
        this.error = null
        const response = await fetch(`${URL_BACKEND}/packs/${id}`)
        
        if (!response.ok) {
          throw new Error('Pack no encontrado')
        }
        
        const data = await response.json()
        this.packActual = data
        return data
      } catch (error) {
        this.error = error.message
        console.error('Error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    calcularAhorro(pack) {
      if (!pack) return 0
      return pack.precio_original - pack.precio_pack
    },

    limpiarError() {
      this.error = null
    }
  }
})
