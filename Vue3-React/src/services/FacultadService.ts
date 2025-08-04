import type { Facultad } from '../interfaces/Facultad';
import { getSupabaseHeaders, getApiUrl } from './supabaseConfig';

export interface CreateFacultad {
  nombre_facultad: string;
}

export interface UpdateFacultad {
  id_facultad?: number;
  nombre_facultad?: string;
}

const API_BASE_URL = getApiUrl('facultad');

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

export const facultadService = {
  async getAll(): Promise<Facultad[]> {
    try {
      console.log('🔍 Obteniendo todas las facultades...');
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || 'Error al obtener las facultades'}`);
      }

      const facultades = await response.json();
      console.log('✅ Facultades obtenidas:', facultades.length);
      return facultades;
    } catch (error: any) {
      handleNetworkError(error, 'getAll');
      return [];
    }
  },

  async getById(id: string): Promise<Facultad> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_facultad=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener la facultad');
      }

      const facultades = await response.json();
      if (facultades.length === 0) {
        throw new Error('Facultad no encontrada');
      }

      return facultades[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async create(facultad: CreateFacultad): Promise<Facultad> {
    try {
      console.log('✏️ Creando facultad:', facultad);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(facultad)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al crear facultad:', errorText);
        throw new Error(`Error al crear la facultad: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Facultad creada:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'create');
      throw error;
    }
  },

  async update(id: string, facultad: UpdateFacultad): Promise<Facultad> {
    try {
      console.log('📝 Actualizando facultad:', id, facultad);
      
      const response = await fetch(`${API_BASE_URL}?id_facultad=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(facultad)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al actualizar facultad:', errorText);
        throw new Error(`Error al actualizar la facultad: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Facultad actualizada:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'update');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando facultad:', id);
      
      const response = await fetch(`${API_BASE_URL}?id_facultad=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al eliminar facultad:', errorText);
        throw new Error(`Error al eliminar la facultad: ${errorText}`);
      }

      console.log('✅ Facultad eliminada');
    } catch (error: any) {
      handleNetworkError(error, 'delete');
      throw error;
    }
  }
};
