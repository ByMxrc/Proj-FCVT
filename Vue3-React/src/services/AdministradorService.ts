import type { Administrador } from '../types/Administrador';

export interface CreateAdministrador {
  id_administrador: number;
  cargo: string;
  departamento: string;
  fecha_ingreso: string;
}

const SUPABASE_URL = 'https://db.pijowuuofyevtcphiaxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1/administrador`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export const administradorService = {
  async getAllAdministradores(): Promise<Administrador[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los administradores');
      }

      const administradores = await response.json();
      return administradores;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getAdministradorById(id: string): Promise<Administrador> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_administrador=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el administrador');
      }

      const administradores = await response.json();
      if (administradores.length === 0) {
        throw new Error('Administrador no encontrado');
      }

      return administradores[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async createAdministrador(administrador: CreateAdministrador): Promise<Administrador> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(administrador),
      });

      if (!response.ok) {
        throw new Error('Error al crear el administrador');
      }

      const createdAdministradores = await response.json();
      return createdAdministradores[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async updateAdministrador(id: string, administrador: CreateAdministrador): Promise<Administrador> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_administrador=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(administrador),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el administrador');
      }

      const updatedAdministradores = await response.json();
      if (updatedAdministradores.length === 0) {
        throw new Error('Administrador no encontrado para actualizar');
      }

      return updatedAdministradores[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async deleteAdministrador(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_administrador=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el administrador');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getAdministradoresByDepartamento(departamento: string): Promise<Administrador[]> {
    try {
      const response = await fetch(`${API_BASE_URL}?departamento=eq.${departamento}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los administradores por departamento');
      }

      const administradores = await response.json();
      return administradores;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};