import type { Usuario } from '../types/Usuario';

export interface CreateUsuario {
  cedula: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
}

const SUPABASE_URL = 'https://db.pijowuuofyevtcphiaxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpam93dXVvZnlldnRjcGhpYXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDY5MzgsImV4cCI6MjA2OTIyMjkzOH0.lzyqahuTEJpq98oURT9Y4WpTi6figyU5qruQHmUO4m8';
const API_BASE_URL = `${SUPABASE_URL}/rest/v1/usuario`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export const usuarioService = {
  async getAllUsuarios(): Promise<Usuario[]> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }

      const usuarios = await response.json();
      return usuarios;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getUsuarioById(id: string): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_usuario=eq.${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el usuario');
      }

      const usuarios = await response.json();
      if (usuarios.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return usuarios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async getUsuarioByCedula(cedula: string): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}?cedula=eq.${cedula}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener el usuario');
      }

      const usuarios = await response.json();
      if (usuarios.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return usuarios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async createUsuario(usuario: CreateUsuario): Promise<Usuario> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) {
        throw new Error('Error al crear el usuario');
      }

      const createdUsuarios = await response.json();
      return createdUsuarios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async updateUsuario(id: string, usuario: CreateUsuario): Promise<Usuario> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_usuario=eq.${id}`, {
        method: 'PATCH',
        headers: {
          ...getHeaders(),
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      const updatedUsuarios = await response.json();
      if (updatedUsuarios.length === 0) {
        throw new Error('Usuario no encontrado para actualizar');
      }

      return updatedUsuarios[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  async deleteUsuario(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}?id_usuario=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};
