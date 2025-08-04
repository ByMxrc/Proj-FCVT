import type { Administrador } from '../interfaces/Administrador';
import { getSupabaseHeaders, getApiUrl } from './supabaseConfig';

export interface CreateAdministrador {
  id_administrador: number; // FK a usuario
}

export interface UpdateAdministrador {
  id_administrador?: number;
}

const API_BASE_URL = getApiUrl('administrador');

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

export const administradorService = {
  async getAll(): Promise<Administrador[]> {
    try {
      console.log('🔍 Obteniendo todos los administradores...');
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || 'Error al obtener los administradores'}`);
      }

      const administradores = await response.json();
      console.log('✅ Administradores obtenidos:', administradores.length);
      return administradores;
    } catch (error: any) {
      handleNetworkError(error, 'getAll');
      return [];
    }
  },

  async getById(id: string): Promise<Administrador> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_administrador=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el administrador');
      }

      const administradores = await response.json();
      if (administradores.length === 0) {
        throw new Error('Administrador no encontrado');
      }

      return administradores[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async create(administrador: CreateAdministrador): Promise<Administrador> {
    try {
      console.log('✏️ Creando administrador:', administrador);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(administrador)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al crear administrador:', errorText);
        throw new Error(`Error al crear el administrador: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Administrador creado:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'create');
      throw error;
    }
  },

  async update(id: string, administrador: UpdateAdministrador): Promise<Administrador> {
    try {
      console.log('📝 Actualizando administrador:', id, administrador);
      
      const response = await fetch(`${API_BASE_URL}?id_administrador=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(administrador)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al actualizar administrador:', errorText);
        throw new Error(`Error al actualizar el administrador: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Administrador actualizado:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'update');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando administrador:', id);
      
      const response = await fetch(`${API_BASE_URL}?id_administrador=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al eliminar administrador:', errorText);
        throw new Error(`Error al eliminar el administrador: ${errorText}`);
      }

      console.log('✅ Administrador eliminado');
    } catch (error: any) {
      handleNetworkError(error, 'delete');
      throw error;
    }
  }
};