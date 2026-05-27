import { defineStore } from 'pinia'

const URL_BACKEND = import.meta.env.VITE_BACKEND_URL

export const useMascotasStore = defineStore('mascotas', {
  state: () => ({
    mascotas: [],
    mascotaActual: null,
    personalidades: [],
    recomendaciones: null,
    loading: false,
    error: null
  }),

  getters: {
    getMascotaById: (state) => (id) => {
      return state.mascotas.find(m => m.id === id)
    },
    
    hasMascotas: (state) => state.mascotas.length > 0
  },

  actions: {
    async cargarPersonalidades() {
      try {
        this.loading = true
        const response = await fetch(`${URL_BACKEND}/personalidades`)
        const data = await response.json()
        this.personalidades = data.personalidades
      } catch (error) {
        this.error = 'Error al cargar personalidades'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async cargarMascotas() {
      try {
        this.loading = true
        this.error = null
        const response = await fetch(`${URL_BACKEND}/mascotas`, {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Error al cargar mascotas')
        }
        
        const data = await response.json()
        this.mascotas = data.mascotas || []
      } catch (error) {
        this.error = error.message
        console.error('Error:', error)
      } finally {
        this.loading = false
      }
    },

    async obtenerMascota(id) {
      try {
        this.loading = true
        const response = await fetch(`${URL_BACKEND}/mascotas/${id}`, {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Mascota no encontrada')
        }
        
        const data = await response.json()
        this.mascotaActual = data
        return data
      } catch (error) {
        this.error = error.message
        console.error('Error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async crearMascota(datos) {
      try {
        this.loading = true
        this.error = null
        const response = await fetch(`${URL_BACKEND}/mascotas`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al crear mascota')
        }
        
        const data = await response.json()
        await this.cargarMascotas()
        return data
      } catch (error) {
        this.error = error.message
        console.error('Error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async actualizarMascota(id, datos) {
      try {
        this.loading = true
        this.error = null
        const response = await fetch(`${URL_BACKEND}/mascotas/${id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al actualizar mascota')
        }
        
        await this.cargarMascotas()
        return await response.json()
      } catch (error) {
        this.error = error.message
        console.error('Error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async eliminarMascota(id) {
      try {
        this.loading = true
        this.error = null
        const response = await fetch(`${URL_BACKEND}/mascotas/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Error al eliminar mascota')
        }
        
        await this.cargarMascotas()
        return await response.json()
      } catch (error) {
        this.error = error.message
        console.error('Error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async obtenerRecomendaciones(mascotaId) {
      try {
        this.loading = true
        this.error = null
        const response = await fetch(
          `${URL_BACKEND}/mascotas/${mascotaId}/recomendaciones`,
          { credentials: 'include' }
        )
        
        if (!response.ok) {
          throw new Error('Error al obtener recomendaciones')
        }
        
        const data = await response.json()
        this.recomendaciones = data
        return data
      } catch (error) {
        this.error = error.message
        console.error('Error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    limpiarRecomendaciones() {
      this.recomendaciones = null
    },

    limpiarError() {
      this.error = null
    }
  }
})
