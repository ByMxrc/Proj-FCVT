import type { Aula } from '../types/Aula';

export interface CreateAula {
  nombre_aula: string;
  capacidad: number;
  id_piso: number;
}

const SUPABASE_URL = 'https://db.pijowuuofyevtcphiaxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1/aula`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export const aulaService = {
  async getAllAulas(): Promise<Aula[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener las aulas');
      }

      const aulas = await response.json();
      return aulas;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getAulaById(id: string): Promise<Aula> {
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

  async createAula(aula: CreateAula): Promise<Aula> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(aula),
      });

      if (!response.ok) {
        throw new Error('Error al crear el aula');
      }

      const createdAulas = await response.json();
      return createdAulas[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async updateAula(id: string, aula: CreateAula): Promise<Aula> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_aula=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(aula),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el aula');
      }

      const updatedAulas = await response.json();
      if (updatedAulas.length === 0) {
        throw new Error('Aula no encontrada para actualizar');
      }

      return updatedAulas[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async deleteAula(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_aula=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el aula');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getAulasByPiso(idPiso: string): Promise<Aula[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_piso=eq.${idPiso}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener las aulas por piso');
      }

      const aulas = await response.json();
      return aulas;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getAulasByCapacidad(capacidadMinima: number): Promise<Aula[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?capacidad=gte.${capacidadMinima}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener las aulas por capacidad');
      }

      const aulas = await response.json();
      return aulas;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};
