import type { Horario } from '../interfaces/Horario';
import { getSupabaseHeaders, getApiUrl } from './supabaseConfig';

export interface CreateHorario {
  id_materia: number;
  id_docente: number;
  id_aula: number;
  id_paralelo?: number;
  dia_semana: string; // USER-DEFINED type
  hora_inicio: string; // time format
  hora_fin: string; // time format
}

export interface UpdateHorario {
  id_horario?: number;
  id_materia?: number;
  id_docente?: number;
  id_aula?: number;
  id_paralelo?: number;
  dia_semana?: string;
  hora_inicio?: string;
  hora_fin?: string;
}

const API_BASE_URL = getApiUrl('horario');

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

export const horarioService = {
  async getAll(): Promise<Horario[]> {
    try {
      console.log('🔍 Obteniendo todos los horarios...');
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || 'Error al obtener los horarios'}`);
      }

      const horarios = await response.json();
      console.log('✅ Horarios obtenidos:', horarios.length);
      return horarios;
    } catch (error: any) {
      handleNetworkError(error, 'getAll');
      return [];
    }
  },

  async getById(id: string): Promise<Horario> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_horario=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el horario');
      }

      const horarios = await response.json();
      if (horarios.length === 0) {
        throw new Error('Horario no encontrado');
      }

      return horarios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getByDocenteId(docenteId: string): Promise<Horario[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_docente=eq.${docenteId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los horarios por docente');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getByMateriaId(materiaId: string): Promise<Horario[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_materia=eq.${materiaId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los horarios por materia');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getByAulaId(aulaId: string): Promise<Horario[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_aula=eq.${aulaId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los horarios por aula');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async create(horario: CreateHorario): Promise<Horario> {
    try {
      console.log('✏️ Creando horario:', horario);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(horario)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al crear horario:', errorText);
        throw new Error(`Error al crear el horario: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Horario creado:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'create');
      throw error;
    }
  },

  async update(id: string, horario: UpdateHorario): Promise<Horario> {
    try {
      console.log('📝 Actualizando horario:', id, horario);
      
      const response = await fetch(`${API_BASE_URL}?id_horario=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(horario)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al actualizar horario:', errorText);
        throw new Error(`Error al actualizar el horario: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Horario actualizado:', result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error: any) {
      handleNetworkError(error, 'update');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      console.log('🗑️ Eliminando horario:', id);
      
      const response = await fetch(`${API_BASE_URL}?id_horario=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al eliminar horario:', errorText);
        throw new Error(`Error al eliminar el horario: ${errorText}`);
      }

      console.log('✅ Horario eliminado');
    } catch (error: any) {
      handleNetworkError(error, 'delete');
      throw error;
    }
  }
};
