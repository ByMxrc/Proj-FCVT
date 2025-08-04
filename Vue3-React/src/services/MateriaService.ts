import type { Materia } from '../interfaces/Materia'
import { getSupabaseHeaders, getApiUrl } from './supabaseConfig'

export interface CreateMateria {
  nombre_materia: string
  semestre: number
}

const API_BASE_URL = getApiUrl('materia')

export const materiaService = {
  async getAll(): Promise<Materia[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getSupabaseHeaders()
      })

      if (!response.ok) {
        throw new Error('Error al obtener las materias')
      }

      return await response.json()
    } catch (error) {
      console.error('Error al obtener materias:', error)
      throw error
    }
  },

  async getById(id: string): Promise<Materia> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_materia=eq.${id}`, {
        method: 'GET',
        headers: getSupabaseHeaders()
      })

      if (!response.ok) {
        throw new Error('Error al obtener la materia')
      }

      const materias = await response.json()
      if (materias.length === 0) {
        throw new Error('Materia no encontrada')
      }

      return materias[0]
    } catch (error) {
      console.error('Error al obtener materia:', error)
      throw error
    }
  },

  async create(materia: CreateMateria): Promise<Materia> {
    try {
      console.log('🔄 MateriaService.create iniciando...')
      console.log('📝 Datos a enviar:', materia)
      console.log('🌐 URL:', API_BASE_URL)
      console.log('🔐 Headers:', getSupabaseHeaders())
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getSupabaseHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(materia)
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Response error text:', errorText)
        throw new Error(`Error al crear la materia: ${response.status} - ${errorText}`)
      }

      // Verificar si la respuesta tiene contenido antes de parsear JSON
      const responseText = await response.text()
      console.log('📄 Respuesta cruda del servidor:', responseText)
      
      if (!responseText.trim()) {
        console.log('⚠️ Respuesta vacía del servidor, pero operación exitosa')
        // Si la respuesta está vacía pero el status es OK, retornar el objeto creado
        return { ...materia, id_materia: Date.now() } // ID temporal
      }
      
      const result = JSON.parse(responseText)
      console.log('✅ Resultado del servidor:', result)
      return Array.isArray(result) ? result[0] : result
    } catch (error) {
      console.error('❌ Error completo en crear materia:', error)
      throw error
    }
  },

  async update(id: string, materia: CreateMateria): Promise<Materia> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_materia=eq.${id}`, {
        method: 'PATCH',
        headers: getSupabaseHeaders(),
        body: JSON.stringify(materia)
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la materia')
      }

      const result = await response.json()
      return Array.isArray(result) ? result[0] : result
    } catch (error) {
      console.error('Error al actualizar materia:', error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_materia=eq.${id}`, {
        method: 'DELETE',
        headers: getSupabaseHeaders()
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la materia')
      }
    } catch (error) {
      console.error('Error al eliminar materia:', error)
      throw error
    }
  }
}
