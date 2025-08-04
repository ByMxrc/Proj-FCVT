import type { Aula } from '../interfaces/Aula';
import { getSupabaseHeaders, getApiUrl } from './supabaseConfig';

export interface CreateAula {
  nombre_aula: string;
  id_piso: number;
}

export interface UpdateAula {
  id_aula?: number;
  nombre_aula?: string;
  id_piso?: number;
}

const API_BASE_URL = getApiUrl('aula');

const getHeaders = getSupabaseHeaders;

// Función para manejar errores de red
const handleNetworkError = (error: any, operation: string) => {
  console.error(`Error en ${operation}:`, error);
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    throw new Error('Error de conexión. Verifica tu conexión a internet y que Supabase esté disponible.');
  }
  
  if (error.message.includes('CORS')) {
    throw new Error('Error de CORS. Verifica la configuración de Supabase.');
  }
  
  throw new Error(error.message || `Error desconocido en ${operation}`);
};

export const aulaService = {
  async getAll(): Promise<Aula[]> {
    try {
      console.log('🔍 Obteniendo todas las aulas...');
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || 'Error al obtener las aulas'}`);
      }

      const aulas = await response.json();
      console.log('✅ Aulas obtenidas:', aulas.length);
      return aulas;
    } catch (error: any) {
      handleNetworkError(error, 'getAll');
      return [];
    }
  },

  async getById(id: string): Promise<Aula> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_aula=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el aula');
      }

      const aulas = await response.json();
      if (aulas.length === 0) {
        throw new Error('Aula no encontrada');
      }

      return aulas[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getByPisoId(pisoId: string): Promise<Aula[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_piso=eq.${pisoId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener las aulas por piso');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async create(aula: CreateAula): Promise<Aula> {
    try {
      console.log('✏️ Creando aula:', aula);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(aula)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al crear aula:', errorText);
        throw new Error(`Error al crear el aula: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Aula creada:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'create');
      throw error;
    }
  },

  async update(id: string, aula: UpdateAula): Promise<Aula> {
    try {
      console.log('📝 Actualizando aula:', id, aula);
      
      const response = await fetch(`${API_BASE_URL}?id_aula=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(aula)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al actualizar aula:', errorText);
        throw new Error(`Error al actualizar el aula: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Aula actualizada:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'update');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando aula:', id);
      
      const response = await fetch(`${API_BASE_URL}?id_aula=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al eliminar aula:', errorText);
        throw new Error(`Error al eliminar el aula: ${errorText}`);
      }

      console.log('✅ Aula eliminada');
    } catch (error: any) {
      handleNetworkError(error, 'delete');
      throw error;
    }
  }
};
