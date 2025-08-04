import type { Paralelo } from '../types/Paralelo';

export interface CreateParalelo {
  nombre_paralelo: string;
  id_materia: number;
  id_docente: number;
  cupo_maximo: number;
}

const SUPABASE_URL = 'https://db.pijowuuofyevtcphiaxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1/paralelo`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export const paraleloService = {
  async getAllParalelos(): Promise<Paralelo[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
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
        headers: getHeaders()
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
          ...getHeaders(),
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
          ...getHeaders(),
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
        headers: getHeaders()
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
        headers: getHeaders()
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
        headers: getHeaders()
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