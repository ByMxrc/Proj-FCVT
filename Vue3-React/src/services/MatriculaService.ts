import type { Matricula } from '../types/Matricula';

export interface CreateMatricula {
  fecha_matricula: string;
  periodo_academico: string;
  estado: string;
  nota_final?: number;
  id_estudiante: number;
  id_paralelo: number;
}

const SUPABASE_URL = 'https://db.pijowuuofyevtcphiaxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1/matricula`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export const matriculaService = {
  async getAllMatriculas(): Promise<Matricula[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener las matriculas');
      }

      const matriculas = await response.json();
      return matriculas;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getMatriculaById(id: string): Promise<Matricula> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_matricula=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener la matricula');
      }

      const matriculas = await response.json();
      if (matriculas.length === 0) {
        throw new Error('Matricula no encontrada');
      }

      return matriculas[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async createMatricula(matricula: CreateMatricula): Promise<Matricula> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(matricula),
      });

      if (!response.ok) {
        throw new Error('Error al crear la matricula');
      }

      const createdMatriculas = await response.json();
      return createdMatriculas[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async updateMatricula(id: string, matricula: CreateMatricula): Promise<Matricula> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_matricula=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(matricula),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la matricula');
      }

      const updatedMatriculas = await response.json();
      if (updatedMatriculas.length === 0) {
        throw new Error('Matricula no encontrada para actualizar');
      }

      return updatedMatriculas[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async deleteMatricula(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_matricula=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la matricula');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getMatriculasByEstudiante(idEstudiante: string): Promise<Matricula[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_estudiante=eq.${idEstudiante}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener las matriculas por estudiante');
      }

      const matriculas = await response.json();
      return matriculas;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getMatriculasByParalelo(idParalelo: string): Promise<Matricula[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_paralelo=eq.${idParalelo}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener las matriculas por paralelo');
      }

      const matriculas = await response.json();
      return matriculas;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getMatriculasByPeriodo(periodo: string): Promise<Matricula[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?periodo_academico=eq.${periodo}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener las matriculas por periodo');
      }

      const matriculas = await response.json();
      return matriculas;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getMatriculasByEstado(estado: string): Promise<Matricula[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?estado=eq.${estado}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener las matriculas por estado');
      }

      const matriculas = await response.json();
      return matriculas;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};
