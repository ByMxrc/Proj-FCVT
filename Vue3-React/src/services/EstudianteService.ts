import type { Estudiante } from '../interfaces/Estudiante';
import { getSupabaseHeaders, getApiUrl } from './supabaseConfig';

export interface CreateEstudiante {
  id_estudiante: number;
  codigo_estudiante: string;
  carrera: string;
  semestre_actual: number;
  promedio?: number;
}

const API_BASE_URL = getApiUrl('estudiante');

const getHeaders = getSupabaseHeaders;

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