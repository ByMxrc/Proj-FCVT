import type { Piso } from '../interfaces/Piso';
import { getSupabaseHeaders, getApiUrl } from './supabaseConfig';

export interface CreatePiso {
  numero_piso: number;
  id_edificio: number;
}

export interface UpdatePiso {
  id_piso?: number;
  numero_piso?: number;
  id_edificio?: number;
}

const API_BASE_URL = getApiUrl('piso');

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

export const pisoService = {
  async getAll(): Promise<Piso[]> {
    try {
      console.log('🔍 Obteniendo todos los pisos...');
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || 'Error al obtener los pisos'}`);
      }

      const pisos = await response.json();
      console.log('✅ Pisos obtenidos:', pisos.length);
      return pisos;
    } catch (error: any) {
      handleNetworkError(error, 'getAll');
      return [];
    }
  },

  async getById(id: string): Promise<Piso> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_piso=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el piso');
      }

      const pisos = await response.json();
      if (pisos.length === 0) {
        throw new Error('Piso no encontrado');
      }

      return pisos[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getByEdificioId(edificioId: string): Promise<Piso[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_edificio=eq.${edificioId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los pisos por edificio');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async create(piso: CreatePiso): Promise<Piso> {
    try {
      console.log('✏️ Creando piso:', piso);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(piso)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al crear piso:', errorText);
        throw new Error(`Error al crear el piso: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Piso creado:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'create');
      throw error;
    }
  },

  async update(id: string, piso: UpdatePiso): Promise<Piso> {
    try {
      console.log('📝 Actualizando piso:', id, piso);
      
      const response = await fetch(`${API_BASE_URL}?id_piso=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(piso)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al actualizar piso:', errorText);
        throw new Error(`Error al actualizar el piso: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Piso actualizado:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'update');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando piso:', id);
      
      const response = await fetch(`${API_BASE_URL}?id_piso=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al eliminar piso:', errorText);
        throw new Error(`Error al eliminar el piso: ${errorText}`);
      }

      console.log('✅ Piso eliminado');
    } catch (error: any) {
      handleNetworkError(error, 'delete');
      throw error;
    }
  }
};
