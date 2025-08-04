import type { Paralelo } from '../interfaces/Paralelo';
import { getApiUrl, getSupabaseHeaders } from './supabaseConfig';

export interface CreateParalelo {
  nombre_paralelo: string;
  id_materia: number;
  id_docente: number;
  cupo_maximo: number;
}

const API_BASE_URL = getApiUrl('paralelo');

export const paraleloService = {
  async getAllParalelos(): Promise<Paralelo[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getSupabaseHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los paralelos');
      }

      const paralelos = await response.json();
      return paralelos;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getParaleloById(id: string): Promise<Paralelo> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_paralelo=eq.${id}`, {
        method: 'GET',
        headers: getSupabaseHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el paralelo');
      }

      const paralelos = await response.json();
      if (paralelos.length === 0) {
        throw new Error('Paralelo no encontrado');
      }

      return paralelos[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async createParalelo(paralelo: CreateParalelo): Promise<Paralelo> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getSupabaseHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(paralelo),
      });

      if (!response.ok) {
        throw new Error('Error al crear el paralelo');
      }

      const createdParalelos = await response.json();
      return createdParalelos[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async updateParalelo(id: string, paralelo: CreateParalelo): Promise<Paralelo> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_paralelo=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getSupabaseHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(paralelo),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el paralelo');
      }

      const updatedParalelos = await response.json();
      if (updatedParalelos.length === 0) {
        throw new Error('Paralelo no encontrado para actualizar');
      }

      return updatedParalelos[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async deleteParalelo(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_paralelo=eq.${id}`, {
        method: 'DELETE',
        headers: getSupabaseHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el paralelo');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getParalelosByMateria(idMateria: string): Promise<Paralelo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_materia=eq.${idMateria}`, {
        method: 'GET',
        headers: getSupabaseHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los paralelos por materia');
      }

      const paralelos = await response.json();
      return paralelos;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getParalelosByDocente(idDocente: string): Promise<Paralelo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_docente=eq.${idDocente}`, {
        method: 'GET',
        headers: getSupabaseHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los paralelos por docente');
      }

      const paralelos = await response.json();
      return paralelos;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};
