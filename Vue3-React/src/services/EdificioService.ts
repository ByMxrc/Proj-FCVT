import type { Edificio } from '../interfaces/Edificio';
import { getSupabaseHeaders, getApiUrl } from './supabaseConfig';

export interface CreateEdificio {
  nombre_edificio: string;
  id_facultad: number;
}

export interface UpdateEdificio {
  id_edificio?: number;
  nombre_edificio?: string;
  id_facultad?: number;
}

const API_BASE_URL = getApiUrl('edificio');

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

export const edificioService = {
  async getAll(): Promise<Edificio[]> {
    try {
      console.log('🔍 Obteniendo todos los edificios...');
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || 'Error al obtener los edificios'}`);
      }

      const edificios = await response.json();
      console.log('✅ Edificios obtenidos:', edificios.length);
      return edificios;
    } catch (error: any) {
      handleNetworkError(error, 'getAll');
      return [];
    }
  },

  async getById(id: string): Promise<Edificio> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_edificio=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el edificio');
      }

      const edificios = await response.json();
      if (edificios.length === 0) {
        throw new Error('Edificio no encontrado');
      }

      return edificios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getByFacultadId(facultadId: string): Promise<Edificio[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_facultad=eq.${facultadId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los edificios por facultad');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async create(edificio: CreateEdificio): Promise<Edificio> {
    try {
      console.log('✏️ Creando edificio:', edificio);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(edificio)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al crear edificio:', errorText);
        throw new Error(`Error al crear el edificio: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Edificio creado:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'create');
      throw error;
    }
  },

  async update(id: string, edificio: UpdateEdificio): Promise<Edificio> {
    try {
      console.log('📝 Actualizando edificio:', id, edificio);
      
      const response = await fetch(`${API_BASE_URL}?id_edificio=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(edificio)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al actualizar edificio:', errorText);
        throw new Error(`Error al actualizar el edificio: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Edificio actualizado:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'update');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando edificio:', id);
      
      const response = await fetch(`${API_BASE_URL}?id_edificio=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al eliminar edificio:', errorText);
        throw new Error(`Error al eliminar el edificio: ${errorText}`);
      }

      console.log('✅ Edificio eliminado');
    } catch (error: any) {
      handleNetworkError(error, 'delete');
      throw error;
    }
  }
};
