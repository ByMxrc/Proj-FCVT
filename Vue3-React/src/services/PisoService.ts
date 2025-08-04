import type { Piso } from '../types/Piso';

export interface CreatePiso {
  numero_piso: number;
  id_edificio: number;
}

const SUPABASE_URL = 'https://db.pijowuuofyevtcphiaxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1/piso`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export const pisoService = {
  async getAllPisos(): Promise<Piso[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los pisos');
      }

      const pisos = await response.json();
      return pisos;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getPisoById(id: string): Promise<Piso> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_piso=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el piso');
      }

      const pisos = await response.json();
      if (pisos.length === 0) {
        throw new Error('Piso no encontrado');
      }

      return pisos[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async createPiso(piso: CreatePiso): Promise<Piso> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(piso),
      });

      if (!response.ok) {
        throw new Error('Error al crear el piso');
      }

      const createdPisos = await response.json();
      return createdPisos[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async updatePiso(id: string, piso: CreatePiso): Promise<Piso> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_piso=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(piso),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el piso');
      }

      const updatedPisos = await response.json();
      if (updatedPisos.length === 0) {
        throw new Error('Piso no encontrado para actualizar');
      }

      return updatedPisos[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async deletePiso(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_piso=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el piso');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getPisosByEdificio(idEdificio: string): Promise<Piso[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_edificio=eq.${idEdificio}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los pisos por edificio');
      }

      const pisos = await response.json();
      return pisos;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};