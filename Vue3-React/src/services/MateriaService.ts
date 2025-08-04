import type { Materia } from '../types/Materia';

export interface CreateMateria {
  nombre_materia: string;
  semestre: number;
}

const SUPABASE_URL = 'https://db.pijowuuofyevtcphiaxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1/materia`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export const materiaService = {
  async getAllMaterias(): Promise<Materia[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener las materias');
      }

      const materias = await response.json();
      return materias;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getMateriaById(id: string): Promise<Materia> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_materia=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener la materia');
      }

      const materias = await response.json();
      if (materias.length === 0) {
        throw new Error('Materia no encontrada');
      }

      return materias[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async createMateria(materia: CreateMateria): Promise<Materia> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(materia),
      });

      if (!response.ok) {
        throw new Error('Error al crear la materia');
      }

      const createdMaterias = await response.json();
      return createdMaterias[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async updateMateria(id: string, materia: CreateMateria): Promise<Materia> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_materia=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(materia),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la materia');
      }

      const updatedMaterias = await response.json();
      if (updatedMaterias.length === 0) {
        throw new Error('Materia no encontrada para actualizar');
      }

      return updatedMaterias[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async deleteMateria(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_materia=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la materia');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getMateriasBySemestre(semestre: number): Promise<Materia[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?semestre=eq.${semestre}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener las materias por semestre');
      }

      const materias = await response.json();
      return materias;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};
