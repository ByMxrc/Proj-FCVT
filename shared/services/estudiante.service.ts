import type { Estudiantes, CreateEstudiante } from '../types/Estudiante';

const SUPABASE_URL = 'https://awpprvsintxyxbxbvuue.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cHBydnNpbnR4eXhieGJ2dXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0ODc3NTksImV4cCI6MjA2NzA2Mzc1OX0.Toq_X674sk9ALllYwI8-mJ5sa0Hh7ufXmzEt-nYCC8Q';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1/estudiantes`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export const estudianteService = {
  async getAllEstudiantes(): Promise<Estudiantes[]> {
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

  async getEstudianteById(id: string): Promise<Estudiantes> {
    try {
      const response = await fetch(`${API_BASE_URL}?id=eq.${id}`, {
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

 async createEstudiante(estudiante: CreateEstudiante): Promise<Estudiantes> {
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
      const errorText = await response.text();
      console.error('Respuesta Supabase:', errorText); // <-- Esto te mostrará el error real
      throw new Error('Error al crear el estudiante');
    }

    const createdEstudiantes = await response.json();
    return createdEstudiantes[0];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
},

  async updateEstudiante(id: string, estudiante: CreateEstudiante): Promise<Estudiantes> {
    try {
      const response = await fetch(`${API_BASE_URL}?id=eq.${id}`, {
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
      const response = await fetch(`${API_BASE_URL}?id=eq.${id}`, {
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
  }
};