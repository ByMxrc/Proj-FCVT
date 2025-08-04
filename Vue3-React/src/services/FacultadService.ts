import type { Facultad } from '../types/Facultad';

export interface CreateFacultad {
  nombre_facultad: string;
}

const SUPABASE_URL = 'https://db.pijowuuofyevtcphiaxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1/facultad`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export const facultadService = {
  async getAllFacultades(): Promise<Facultad[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener las facultades');
      }

      const facultades = await response.json();
      return facultades;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getFacultadById(id: string): Promise<Facultad> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_facultad=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener la facultad');
      }

      const facultades = await response.json();
      if (facultades.length === 0) {
        throw new Error('Facultad no encontrada');
      }

      return facultades[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async createFacultad(facultad: CreateFacultad): Promise<Facultad> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(facultad),
      });

      if (!response.ok) {
        throw new Error('Error al crear la facultad');
      }

      const createdFacultades = await response.json();
      return createdFacultades[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async updateFacultad(id: string, facultad: CreateFacultad): Promise<Facultad> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_facultad=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(facultad),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la facultad');
      }

      const updatedFacultades = await response.json();
      if (updatedFacultades.length === 0) {
        throw new Error('Facultad no encontrada para actualizar');
      }

      return updatedFacultades[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async deleteFacultad(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_facultad=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la facultad');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};