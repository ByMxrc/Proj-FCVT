import type { Estudiante } from '../types/Estudiante';

export interface CreateEstudiante {
  id_estudiante: number;
  codigo_estudiante: string;
  carrera: string;
  semestre_actual: number;
  promedio?: number;
}

const SUPABASE_URL = 'https://db.pijowuuofyevtcphiaxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1/estudiante`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export const estudianteService = {
  async getAllEstudiantes(): Promise<Estudiante[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los estudiantes');
      }

      const estudiantes = await response.json();
      return estudiantes;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getEstudianteById(id: string): Promise<Estudiante> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_estudiante=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el estudiante');
      }

      const estudiantes = await response.json();
      if (estudiantes.length === 0) {
        throw new Error('Estudiante no encontrado');
      }

      return estudiantes[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getEstudianteByCodigo(codigo: string): Promise<Estudiante> {
    try {
      const response = await fetch(`${API_BASE_URL}?codigo_estudiante=eq.${codigo}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el estudiante');
      }

      const estudiantes = await response.json();
      if (estudiantes.length === 0) {
        throw new Error('Estudiante no encontrado');
      }

      return estudiantes[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async createEstudiante(estudiante: CreateEstudiante): Promise<Estudiante> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(estudiante),
      });

      if (!response.ok) {
        throw new Error('Error al crear el estudiante');
      }

      const createdEstudiantes = await response.json();
      return createdEstudiantes[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async updateEstudiante(id: string, estudiante: CreateEstudiante): Promise<Estudiante> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_estudiante=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(estudiante),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estudiante');
      }

      const updatedEstudiantes = await response.json();
      if (updatedEstudiantes.length === 0) {
        throw new Error('Estudiante no encontrado para actualizar');
      }

      return updatedEstudiantes[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async deleteEstudiante(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_estudiante=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el estudiante');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getEstudiantesByCarrera(carrera: string): Promise<Estudiante[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?carrera=eq.${carrera}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los estudiantes por carrera');
      }

      const estudiantes = await response.json();
      return estudiantes;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getEstudiantesBySemestre(semestre: number): Promise<Estudiante[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?semestre_actual=eq.${semestre}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los estudiantes por semestre');
      }

      const estudiantes = await response.json();
      return estudiantes;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};