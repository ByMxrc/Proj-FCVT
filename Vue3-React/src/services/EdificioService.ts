import type { Edificio } from '../types/Edificio';

export interface CreateEdificio {
  nombre_edificio: string;
  id_facultad: number;
}

const SUPABASE_URL = 'https://db.pijowuuofyevtcphiaxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1/edificio`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export const edificioService = {
  async getAllEdificios(): Promise<Edificio[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los edificios');
      }

      const edificios = await response.json();
      return edificios;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getEdificioById(id: string): Promise<Edificio> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_edificio=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el edificio');
      }

      const edificios = await response.json();
      if (edificios.length === 0) {
        throw new Error('Edificio no encontrado');
      }

      return edificios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async createEdificio(edificio: CreateEdificio): Promise<Edificio> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(edificio),
      });

      if (!response.ok) {
        throw new Error('Error al crear el edificio');
      }

      const createdEdificios = await response.json();
      return createdEdificios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async updateEdificio(id: string, edificio: CreateEdificio): Promise<Edificio> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_edificio=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(edificio),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el edificio');
      }

      const updatedEdificios = await response.json();
      if (updatedEdificios.length === 0) {
        throw new Error('Edificio no encontrado para actualizar');
      }

      return updatedEdificios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async deleteEdificio(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_edificio=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el edificio');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getEdificiosByFacultad(idFacultad: string): Promise<Edificio[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_facultad=eq.${idFacultad}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los edificios por facultad');
      }

      const edificios = await response.json();
      return edificios;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};